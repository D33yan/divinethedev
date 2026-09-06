"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextArea } from "@/components/ui/FormTextArea";
import { FormActions } from "@/components/ui/FormActions";
import { FolderGit2, Plus, Edit2, Trash2, X, Save, Eye, ArrowRight, Loader2, AlertCircle, Upload } from "lucide-react";

interface CaseStudy {
  problem: string;
  approach: string;
  built: string;
  result: string;
  images: string[];
}

interface Project {
  id: string; // uuid in database
  slug: string;
  title: string;
  description: string;
  tech: string[];
  tag: string;
  featured: boolean;
  github: string;
  live: string | null;
  badge: string | null;
  case_study: CaseStudy;
  sort_order: number;
}

export default function ManageProjects() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Editor states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [tag, setTag] = useState("");
  const [featured, setFeatured] = useState(false);
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [badge, setBadge] = useState("");
  const [problem, setProblem] = useState("");
  const [approach, setApproach] = useState("");
  const [built, setBuilt] = useState("");
  const [result, setResult] = useState("");
  const [images, setImages] = useState("");

  const fetchProjects = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openEdit = (project: Project) => {
    triggerSound("click");
    setEditingProject(project);
    setIsNew(false);
    setActionError("");
    setActionSuccess("");

    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description);
    setTech(project.tech.join(", "));
    setTag(project.tag);
    setFeatured(project.featured);
    setGithub(project.github);
    setLive(project.live || "");
    setBadge(project.badge || "");
    setProblem(project.case_study?.problem || "");
    setApproach(project.case_study?.approach || "");
    setBuilt(project.case_study?.built || "");
    setResult(project.case_study?.result || "");
    setImages(project.case_study?.images?.join(", ") || "");
  };

  const openNew = () => {
    triggerSound("click");
    setEditingProject({} as Project);
    setIsNew(true);
    setActionError("");
    setActionSuccess("");

    setTitle("");
    setSlug("");
    setDescription("");
    setTech("");
    setTag("");
    setFeatured(false);
    setGithub("");
    setLive("");
    setBadge("");
    setProblem("");
    setApproach("");
    setBuilt("");
    setResult("");
    setImages("");
  };

  const closeEditor = () => {
    triggerSound("click");
    setEditingProject(null);
    setIsNew(false);
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          const maxWidth = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                  type: "image/webp",
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !e.target.files || e.target.files.length === 0) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setActionError("Upload restricted: Administrator clearance required.");
      return;
    }

    setUploading(true);
    setActionError("");
    setActionSuccess("");
    triggerSound("click");

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < e.target.files.length; i++) {
        const rawFile = e.target.files[i];
        // Compress image dynamically before storage upload
        const file = await compressImage(rawFile);
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        // Upload file to 'portfolio-images' bucket
        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("portfolio-images")
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        const existing = images.trim();
        const delimiter = existing ? ", " : "";
        setImages(existing + delimiter + uploadedUrls.join(", "));
        setActionSuccess(`Successfully uploaded ${uploadedUrls.length} image(s) to Supabase Storage!`);
        triggerSound("success");
      }
    } catch (err: any) {
      console.error("Storage upload error:", err);
      setActionError(err.message || "Failed to upload image file(s). Make sure the 'portfolio-images' storage bucket exists in Supabase.");
      triggerSound("glitch");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setActionError("Write permissions restricted: Administrator clearance required.");
      return;
    }

    setSaving(true);
    setActionError("");
    setActionSuccess("");
    triggerSound("click");

    const payload = {
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
      description,
      tech: tech.split(",").map(t => t.trim()).filter(Boolean),
      tag,
      featured,
      github,
      live: live.trim() || null,
      badge: badge.trim() || null,
      case_study: {
        problem,
        approach,
        built,
        result,
        images: images.split(",").map(i => i.trim()).filter(Boolean)
      },
      sort_order: isNew ? projects.length : editingProject!.sort_order
    };

    try {
      if (isNew) {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        setActionSuccess(`Project '${title}' added successfully!`);
      } else {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingProject!.id);
        if (error) throw error;
        setActionSuccess(`Project '${title}' updated successfully!`);
      }
      
      triggerSound("success");
      setEditingProject(null);
      await fetchProjects();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Error saving database record.");
      triggerSound("glitch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!supabase) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setActionError("Delete permissions restricted: Administrator clearance required.");
      return;
    }

    if (!confirm(`Are you sure you want to delete '${name}'? This cannot be undone.`)) {
      return;
    }

    triggerSound("click");
    setActionError("");
    setActionSuccess("");

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setActionSuccess(`Project '${name}' deleted successfully.`);
      triggerSound("success");
      await fetchProjects();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to delete record.");
      triggerSound("glitch");
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
            <div className="w-11 h-11 rounded-2xl bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.2)]">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>PROJECTS_&_CASES_STUDIO</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                MANAGE REPOSITORIES, LIVE URLS, TECH STACKS & ATS CASE STUDIES
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="liquid-glass-pill px-3.5 py-1.5 rounded-full font-mono text-xs text-[#8892b0]">
              TOTAL: {projects.length}
            </span>
            {!editingProject && (
              <button
                onClick={openNew}
                className="flex items-center gap-2 bg-[#64ffda] text-black px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-[#64ffda]/90 transition-all shadow-md shadow-[#64ffda]/20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>NEW_PROJECT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {editingProject ? (
        /* Form Editor Box */
        <div className="liquid-glass-panel rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">
              {isNew ? "CREATE_NEW_PROJECT_RECORD" : `EDIT_RECORD: ${editingProject.title}`}
            </h2>
            <button onClick={closeEditor} className="text-[#8892b0] hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="Project Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. TyphoidGuard"
              />

              <FormInput
                label="Slug / ID (URL safe)"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. typhoidguard"
              />

              <FormInput
                label="Project Tagline"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. HealthTech automation dashboard"
              />

              <FormInput
                label="Special Badge (optional)"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Live Demo, AI Engine"
              />
            </div>

            <FormTextArea
              label="Short Description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Core functionality summary..."
            />

            <FormInput
              label="Tech Stack (comma separated)"
              required
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="e.g. React Native, Next.js, Laravel, Tailwind CSS"
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="GitHub Repository URL"
                type="url"
                required
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/D33yan/..."
              />

              <FormInput
                label="Live URL Demo (optional)"
                type="url"
                value={live}
                onChange={(e) => setLive(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-[#0c0c0c] text-[#64ffda] focus:ring-[#64ffda]/30 focus:ring-2 focus:ring-offset-0"
              />
              <label htmlFor="featured" className="text-xs font-mono text-[#ccd6f6] uppercase tracking-wider cursor-pointer">
                Feature project prominently in project highlights deck
              </label>
            </div>

            {/* Case study fields */}
            <div className="pt-6 mt-6 border-t border-white/5 space-y-6">
              <h3 className="text-sm font-bold font-mono text-[#64ffda] uppercase">CASE_STUDY_MONOGRAPHS</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <FormTextArea
                  label="The Problem"
                  rows={4}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe the challenge or initial state..."
                />

                <FormTextArea
                  label="The Approach"
                  rows={4}
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  placeholder="Describe your design and engineering strategy..."
                />

                <FormTextArea
                  label="What Was Built"
                  rows={4}
                  value={built}
                  onChange={(e) => setBuilt(e.target.value)}
                  placeholder="Describe technical implementation detail..."
                />

                <FormTextArea
                  label="Results & Takeaways"
                  rows={4}
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Describe the outcome, metrics, and learnings..."
                />
              </div>

              <div>
                <FormInput
                  label="Case Study Images (URLs, comma separated)"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="https://imgur.com/image1.jpg, https://imgur.com/image2.jpg"
                />
                
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 hover:text-[#64ffda] border border-white/10 rounded-xl px-4 py-2 cursor-pointer transition-all duration-300 font-mono text-[11px] tracking-wider uppercase">
                    <Upload className="h-3.5 w-3.5 text-[#64ffda]" />
                    <span>Upload Image Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading || !isAdmin}
                      className="hidden"
                    />
                  </label>
                  {uploading && (
                    <span className="text-[10px] text-[#8892b0] ml-3 animate-pulse font-mono uppercase tracking-wide">
                      Uploading to Supabase storage bucket...
                    </span>
                  )}
                </div>
              </div>
            </div>

            <FormActions onCancel={closeEditor} saving={saving} isAdmin={isAdmin} />
          </form>
        </div>
      ) : (
        /* List View */
        <div className="grid gap-6">
          {loading ? (
            <div className="flex flex-col py-20 items-center justify-center font-mono text-xs text-[#8892b0] gap-3">
              <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
              <span>reading live database project schemas...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-12 text-center font-mono">
              <FolderGit2 className="h-12 w-12 text-[#8892b0]/30 mx-auto mb-4" />
              <p className="text-sm text-[#ccd6f6]">Database holds 0 project records.</p>
              <p className="text-xs text-[#8892b0] mt-1">Visit Overview to seed database with initial records in one click.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="liquid-glass relative overflow-hidden rounded-2xl p-6 hover:border-[#64ffda]/50 hover:shadow-[0_0_30px_rgba(100,255,218,0.15)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-[#ccd6f6] font-mono">{project.title}</h3>
                    <span className="liquid-glass-pill font-mono text-[9px] px-2.5 py-0.5 rounded-full text-[#8892b0]">
                      {project.slug}
                    </span>
                    {project.featured && (
                      <span className="liquid-glass-pill font-mono text-[9px] text-[#64ffda] px-2.5 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(100,255,218,0.2)]">
                        FEATURED
                      </span>
                    )}
                    {project.badge && (
                      <span className="liquid-glass-pill font-mono text-[9px] text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        {project.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8892b0] max-w-2xl leading-relaxed font-sans">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t) => (
                      <span key={t} className="liquid-glass-pill font-mono text-[10px] text-[#64ffda]/90 px-2.5 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-3 bg-white/5 border border-white/10 hover:border-[#64ffda]/40 rounded-xl hover:bg-[#64ffda]/10 text-[#8892b0] hover:text-[#64ffda] transition cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={!isAdmin}
                    className="p-3 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl hover:bg-red-500/10 text-[#8892b0] hover:text-red-400 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
