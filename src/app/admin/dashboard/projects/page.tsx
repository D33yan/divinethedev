"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextArea } from "@/components/ui/FormTextArea";
import { FormActions } from "@/components/ui/FormActions";
import { FolderGit2, Plus, Edit2, Trash2, X, Save, Eye, ArrowRight, Loader2, AlertCircle } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">PROJECTS_MANAGEMENT</h1>
          <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
            ADD, UPDATE OR ARRANGE REPOSITORIES AND CASE STUDIES
          </p>
        </div>
        {!editingProject && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda] text-[#64ffda] px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all"
          >
            <Plus className="h-4 w-4" />
            NEW_PROJECT
          </button>
        )}
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {editingProject ? (
        /* Form Editor Box */
        <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 bg-[#0a192f]/40 backdrop-blur-md">
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
                className="w-4 h-4 rounded border-white/10 bg-[#112240] text-[#64ffda] focus:ring-[#64ffda]/30 focus:ring-2 focus:ring-offset-0"
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

              <FormInput
                label="Case Study Images (URLs, comma separated)"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                placeholder="https://imgur.com/image1.jpg, https://imgur.com/image2.jpg"
              />
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
            <div className="glass-card rounded-2xl border border-white/5 p-12 text-center bg-[#0a192f]/20 font-mono">
              <FolderGit2 className="h-12 w-12 text-[#8892b0]/30 mx-auto mb-4" />
              <p className="text-sm text-[#ccd6f6]">Database holds 0 project records.</p>
              <p className="text-xs text-[#8892b0] mt-1">Visit Overview to seed database with initial records in one click.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-2xl border border-white/5 p-6 bg-[#112240]/20 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#ccd6f6]">{project.title}</h3>
                    <span className="font-mono text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#8892b0]">
                      {project.slug}
                    </span>
                    {project.featured && (
                      <span className="font-mono text-[9px] bg-[#64ffda]/10 text-[#64ffda] px-2 py-0.5 rounded border border-[#64ffda]/20">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8892b0] max-w-2xl">{project.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tech.map((t) => (
                      <span key={t} className="font-mono text-[10px] bg-[#64ffda]/5 text-[#64ffda]/80 border border-[#64ffda]/10 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-3 bg-white/5 border border-white/10 hover:border-[#64ffda]/30 rounded-xl hover:bg-[#64ffda]/5 text-[#8892b0] hover:text-[#64ffda] transition"
                    title="Edit Record"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={!isAdmin}
                    className="p-3 bg-white/5 border border-white/10 hover:border-red-500/30 rounded-xl hover:bg-red-500/5 text-[#8892b0] hover:text-red-400 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10"
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
