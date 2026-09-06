"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Loader2, Globe, FileText, Save, RefreshCw, CheckCircle2, AlertTriangle, Upload } from "lucide-react";

export default function SeoAndCvManager() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required to upload assets.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `og-image-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;
      let publicUrl = "";

      // 1. Try uploading to portfolio-assets
      try {
        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (!uploadError) {
          const { data } = supabase.storage
            .from("portfolio-assets")
            .getPublicUrl(filePath);
          if (data?.publicUrl) {
            publicUrl = data.publicUrl;
          }
        }
      } catch (err) {
        console.warn("Upload to portfolio-assets failed, trying fallback...", err);
      }

      // 2. Fallback to portfolio-images bucket under project-images folder (to bypass RLS limits)
      if (!publicUrl) {
        const fallbackPath = `project-images/${fileName}`;
        const { error: fallbackError } = await supabase.storage
          .from("portfolio-images")
          .upload(fallbackPath, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (fallbackError) throw fallbackError;

        const { data } = supabase.storage
          .from("portfolio-images")
          .getPublicUrl(fallbackPath);

        if (data?.publicUrl) {
          publicUrl = data.publicUrl;
        } else {
          throw new Error("Could not retrieve public URL for fallback storage upload.");
        }
      }

      setSeoOgImage(publicUrl);
      setSuccess("Open Graph social preview image uploaded successfully!");
      triggerSound("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload social preview image.");
      triggerSound("glitch");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // SEO Form states
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("/logo.png");
  const [analyticsId, setAnalyticsId] = useState("");
  const [aboutBio, setAboutBio] = useState("");
  const [sidebarBio, setSidebarBio] = useState("");
  const [needMigration, setNeedMigration] = useState(false);

  // CV Compiler states
  const [compilerLoading, setCompilerLoading] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState("");
  const [compilerError, setCompilerError] = useState("");
  const [compilerSuccess, setCompilerSuccess] = useState("");

  const fetchSeoSettings = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "primary")
        .single();

      if (err) throw err;

      if (data) {
        setSeoTitle(data.seo_title || "");
        setSeoDesc(data.seo_description || "");
        setSeoKeywords(data.seo_keywords || "");
        setSeoOgImage(data.seo_og_image || "/logo.png");
        setAnalyticsId(data.analytics_id || "");
        setAboutBio(data.about_bio || "");
        setSidebarBio(data.sidebar_bio || "");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load SEO parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const updatePayload: any = {
        seo_title: seoTitle,
        seo_description: seoDesc,
        seo_keywords: seoKeywords,
        seo_og_image: seoOgImage,
        analytics_id: analyticsId
      };

      const { error: err } = await supabase
        .from("site_settings")
        .update({
          ...updatePayload,
          about_bio: aboutBio,
          sidebar_bio: sidebarBio
        })
        .eq("id", "primary");

      if (err) {
        // Check if error is due to missing columns in site_settings
        if (err.message.includes("about_bio") || err.message.includes("column")) {
          const { error: fallbackErr } = await supabase
            .from("site_settings")
            .update(updatePayload)
            .eq("id", "primary");

          if (fallbackErr) throw fallbackErr;
          
          setSuccess("SEO settings saved. Note: To enable dynamic 'About Me' and 'Hero Bio' edits, please execute the database schema migration shown below.");
          setNeedMigration(true);
          triggerSound("success");
        } else {
          throw err;
        }
      } else {
        setSuccess("SEO & Bio settings saved successfully! Page content and headers will update dynamically.");
        setNeedMigration(false);
        triggerSound("success");
      }
    } catch (err: any) {
      setError(err.message || "Could not save settings.");
      triggerSound("glitch");
    } finally {
      setSaving(false);
    }
  };

  const handleRebuildCv = async () => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setCompilerError("Admin write privilege required to trigger compiler.");
      return;
    }

    setCompilerLoading(true);
    setCompilerError("");
    setCompilerSuccess("");
    setCompilerOutput("Synaptic resume builder initiated... retrieving database schemas...");
    triggerSound("click");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active credentials found. Re-authenticate session.");

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        }
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to execute python compilation.");

      setCompilerSuccess("PDF Resume compiled successfully and deployed to static public directory!");
      setCompilerOutput("COMPILER_SUCCESS // output written to: public/Divine_Nnaji_CV.pdf");
      triggerSound("success");
    } catch (err: any) {
      setCompilerError(err.message || "Python script execution failed.");
      setCompilerOutput("COMPILER_ABORT // compilation error occurred");
      triggerSound("glitch");
    } finally {
      setCompilerLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cyber Header Banner */}
      <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-2xl">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>SEO_&_CV_COMPILER</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                CONFIGURE DYNAMIC SEARCH META-TAGS, ANALYTICAL SCRIPTS & PDF CV COMPILATION
              </p>
            </div>
          </div>
        </div>
      </div>

      <SystemAlert type="error" message={error} />
      <SystemAlert type="success" message={success} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-[#64ffda] animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* SEO & Meta Form */}
          <div className="liquid-glass-panel rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6] flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#64ffda]" />
              <span>SEARCH_ENGINE_OPTIMIZATION</span>
            </h2>

            <form onSubmit={handleSaveSeo} className="space-y-4 text-left font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Default Page Title</label>
                <input
                  type="text"
                  required
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Divine Chibueze Nnaji — Fullstack Software Engineer"
                  className="liquid-glass-input w-full rounded-xl px-4 py-2.5 text-[#ccd6f6] outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Meta Keywords</label>
                <input
                  type="text"
                  required
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="Developer, Fullstack, AI, NextJS"
                  className="liquid-glass-input w-full rounded-xl px-4 py-2.5 text-[#ccd6f6] outline-none transition font-mono"
                />
              </div>

              {/* Social OG Image Card */}
              <div className="space-y-2 border border-white/10 rounded-xl p-4 bg-black/60">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold font-mono text-[#64ffda] uppercase tracking-wider block">
                    Social Share Image (Open Graph Preview)
                  </label>
                  <span className="text-[9px] font-mono text-[#8892b0]">1200 × 630px recommended</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* Thumbnail Preview */}
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-white/15 bg-black/50 shrink-0 flex items-center justify-center">
                    {seoOgImage ? (
                      <img 
                        src={seoOgImage} 
                        alt="Social OG Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[9px] font-mono text-[#8892b0]">No Preview</span>
                    )}
                  </div>

                  {/* Upload Button and Info */}
                  <div className="space-y-2 flex-1 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda]/40 rounded-xl cursor-pointer text-xs font-mono font-bold text-[#64ffda] transition select-none shadow-sm">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span>{uploading ? "UPLOADING_IMAGE..." : "UPLOAD_NEW_OG_IMAGE"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleOgImageUpload}
                        className="hidden"
                        disabled={uploading || !isAdmin}
                      />
                    </label>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-[#8892b0] block">Direct URL / Storage Link:</span>
                      <input
                        type="text"
                        required
                        value={seoOgImage}
                        onChange={(e) => setSeoOgImage(e.target.value)}
                        placeholder="/og_image.png or https://..."
                        className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-3 py-2 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Google Analytics ID</label>
                <input
                  type="text"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXX"
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Meta Description</label>
                <textarea
                  required
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Insert meta tag details..."
                  rows={4}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none leading-relaxed text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Hero Subtitle Bio (Dynamic copy)</label>
                <textarea
                  value={sidebarBio}
                  onChange={(e) => setSidebarBio(e.target.value)}
                  placeholder="I design and engineer interactive frontend interfaces..."
                  rows={2}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none leading-relaxed text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">About Me Bio Description (Dynamic copy)</label>
                <textarea
                  value={aboutBio}
                  onChange={(e) => setAboutBio(e.target.value)}
                  placeholder="I'm Divine Chibueze Nnaji — a Fullstack Software Engineer..."
                  rows={4}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none leading-relaxed text-xs"
                />
              </div>

              {needMigration && (
                <div className="border border-[#f59e0b]/30 bg-[#f59e0b]/5 rounded-xl p-4 space-y-2 text-left font-mono text-[10px] text-[#f59e0b]">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                    <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
                    <span>Database Migration Required</span>
                  </div>
                  <p className="font-sans leading-relaxed text-[#ccd6f6]/70">
                    To enable saving the <strong>About Me Bio</strong> and <strong>Hero Subtitle</strong> in the database, please execute this SQL block in your Supabase SQL Editor:
                  </p>
                  <pre className="bg-black/40 border border-white/10 rounded p-2 text-white/90 select-all cursor-pointer font-bold" title="Click to copy">
                    {`ALTER TABLE site_settings \nADD COLUMN IF NOT EXISTS about_bio text,\nADD COLUMN IF NOT EXISTS sidebar_bio text;`}
                  </pre>
                </div>
              )}

              <button
                type="submit"
                disabled={saving || !isAdmin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#64ffda] text-black hover:bg-[#64ffda]/80 font-bold font-mono text-xs py-3 px-4 shadow-lg shadow-[#64ffda]/10 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>SAVE_SEO_PROPERTIES</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* CV Compiler Dashboard Card */}
          <div className="liquid-glass-panel rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#64ffda]" />
                <span>DYNAMIC_PDF_CV_COMPILER</span>
              </h2>

              <p className="text-xs text-[#8892b0] leading-relaxed text-left font-sans">
                Trigger the Python `reportlab` compiler to dynamically query experiences, skills, and projects from Supabase and compile them into an ATS-friendly single-page PDF resume.
              </p>

              {/* Status and output logs box */}
              <div className="liquid-glass rounded-xl p-4 font-mono text-xs text-left min-h-[140px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[10px] text-[#8892b0] uppercase tracking-wider block font-bold">COMPILER_OUTPUT_LOGS:</div>
                  <div className="text-white/80 select-all whitespace-pre-wrap">{compilerOutput}</div>
                </div>

                <div className="mt-4 pt-2 border-t border-white/5 flex items-center gap-2 text-[10px]">
                  {compilerLoading && (
                    <span className="text-[#64ffda] animate-pulse flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin" /> compiling...
                    </span>
                  )}
                  {compilerSuccess && (
                    <span className="text-[#64ffda] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> SUCCESS
                    </span>
                  )}
                  {compilerError && (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> ERROR
                    </span>
                  )}
                  {!compilerLoading && !compilerSuccess && !compilerError && (
                    <span className="text-neutral-500 uppercase">STANDBY // trigger compile</span>
                  )}
                </div>
              </div>

              {compilerSuccess && (
                <SystemAlert type="success" message={compilerSuccess} />
              )}
              {compilerError && (
                <SystemAlert type="error" message={compilerError} />
              )}
            </div>

            <button
              onClick={handleRebuildCv}
              disabled={compilerLoading || !isAdmin}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-[#64ffda] bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 font-bold font-mono text-xs py-3 px-4 shadow-lg shadow-[#64ffda]/10 transition disabled:opacity-50 cursor-pointer"
            >
              {compilerLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>COMPILE_PDF_RESUME</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
