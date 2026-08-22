"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Loader2, Globe, FileText, Save, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SeoAndCvManager() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // SEO Form states
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("/og_image.png");
  const [analyticsId, setAnalyticsId] = useState("");

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
        setSeoOgImage(data.seo_og_image || "/og_image.png");
        setAnalyticsId(data.analytics_id || "");
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
      const { error: err } = await supabase
        .from("site_settings")
        .update({
          seo_title: seoTitle,
          seo_description: seoDesc,
          seo_keywords: seoKeywords,
          seo_og_image: seoOgImage,
          analytics_id: analyticsId
        })
        .eq("id", "primary");

      if (err) throw err;

      setSuccess("SEO settings saved successfully! Document headers will update dynamically.");
      triggerSound("success");
    } catch (err: any) {
      setError(err.message || "Could not save SEO settings.");
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">SEO_&_CV_COMPILER</h1>
        <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
          Configure dynamic search meta-tags, analytical measurement scripts, and compile PDF CVs
        </p>
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
          <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md space-y-4">
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
                  className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition"
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
                  className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Social OG Image URL</label>
                  <input
                    type="text"
                    required
                    value={seoOgImage}
                    onChange={(e) => setSeoOgImage(e.target.value)}
                    placeholder="/og_image.png"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Google Analytics ID</label>
                  <input
                    type="text"
                    value={analyticsId}
                    onChange={(e) => setAnalyticsId(e.target.value)}
                    placeholder="G-XXXXXX"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Meta Description</label>
                <textarea
                  required
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Insert meta tag details..."
                  rows={4}
                  className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none leading-relaxed text-xs"
                />
              </div>

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
          <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#64ffda]" />
                <span>DYNAMIC_PDF_CV_COMPILER</span>
              </h2>

              <p className="text-xs text-[#8892b0] leading-relaxed text-left font-sans">
                Trigger the Python `reportlab` compiler to dynamically query experiences, skills, and projects from Supabase and compile them into an ATS-friendly single-page PDF resume.
              </p>

              {/* Status and output logs box */}
              <div className="border border-white/10 rounded-xl bg-black/40 p-4 font-mono text-xs text-left min-h-[140px] flex flex-col justify-between">
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
