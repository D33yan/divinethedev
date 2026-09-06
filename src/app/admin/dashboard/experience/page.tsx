"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextArea } from "@/components/ui/FormTextArea";
import { FormActions } from "@/components/ui/FormActions";
import { Briefcase, Plus, Edit2, Trash2, X, Save, Loader2, AlertCircle } from "lucide-react";

interface Experience {
  id: string; // uuid
  slug: string;
  company: string;
  role: string;
  period: string;
  location: string;
  tech: string[];
  bullets: string[];
  sort_order: number;
}

export default function ManageExperience() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Editor states
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [slug, setSlug] = useState("");
  const [period, setPeriod] = useState("");
  const [location, setLocation] = useState("");
  const [tech, setTech] = useState("");
  const [bullets, setBullets] = useState("");

  const fetchExperiences = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setExperiences(data || []);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to load experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openEdit = (exp: Experience) => {
    triggerSound("click");
    setEditingExp(exp);
    setIsNew(false);
    setActionError("");
    setActionSuccess("");

    setCompany(exp.company);
    setRole(exp.role);
    setSlug(exp.slug);
    setPeriod(exp.period);
    setLocation(exp.location);
    setTech(exp.tech?.join(", ") || "");
    setBullets(exp.bullets?.join("\n") || "");
  };

  const openNew = () => {
    triggerSound("click");
    setEditingExp({} as Experience);
    setIsNew(true);
    setActionError("");
    setActionSuccess("");

    setCompany("");
    setRole("");
    setSlug("");
    setPeriod("");
    setLocation("");
    setTech("");
    setBullets("");
  };

  const closeEditor = () => {
    triggerSound("click");
    setEditingExp(null);
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
      company,
      role,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
      period,
      location,
      tech: tech.split(",").map(t => t.trim()).filter(Boolean),
      bullets: bullets.split("\n").map(b => b.trim()).filter(Boolean),
      sort_order: isNew ? experiences.length : editingExp!.sort_order
    };

    try {
      if (isNew) {
        const { error } = await supabase.from("experiences").insert(payload);
        if (error) throw error;
        setActionSuccess(`Experience @ ${company} added successfully!`);
      } else {
        const { error } = await supabase
          .from("experiences")
          .update(payload)
          .eq("id", editingExp!.id);
        if (error) throw error;
        setActionSuccess(`Experience @ ${company} updated successfully!`);
      }
      
      triggerSound("success");
      setEditingExp(null);
      await fetchExperiences();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Error saving database record.");
      triggerSound("glitch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (!supabase) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setActionError("Delete permissions restricted: Administrator clearance required.");
      return;
    }

    if (!confirm(`Are you sure you want to delete experience @ ${companyName}?`)) {
      return;
    }

    triggerSound("click");
    setActionError("");
    setActionSuccess("");

    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
      setActionSuccess(`Experience @ ${companyName} deleted successfully.`);
      triggerSound("success");
      await fetchExperiences();
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
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>EXPERIENCE_MANAGEMENT</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                ADD, EDIT OR REMOVE PROFESSIONAL CHRONOLOGICAL JOB RECORDS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="liquid-glass-pill px-3.5 py-1.5 rounded-full font-mono text-xs text-[#8892b0]">
              TOTAL: {experiences.length}
            </span>
            {!editingExp && (
              <button
                onClick={openNew}
                className="flex items-center gap-2 bg-[#64ffda] text-black px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-[#64ffda]/90 transition-all shadow-md shadow-[#64ffda]/20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>NEW_EXPERIENCE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {editingExp ? (
        /* Form Editor Box */
        <div className="liquid-glass-panel rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">
              {isNew ? "CREATE_NEW_EXPERIENCE_RECORD" : `EDIT_RECORD: @ ${editingExp.company}`}
            </h2>
            <button onClick={closeEditor} className="text-[#8892b0] hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="Company Name"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
              />

              <FormInput
                label="Professional Role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Architect"
              />

              <FormInput
                label="Unique Slug / ID (URL safe)"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. google-architect"
              />

              <FormInput
                label="Location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mountain View, CA (Remote)"
              />
            </div>

            <FormInput
              label="Work Period (Date / Range)"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. Jan 2024 – Present, March – Aug 2023"
            />

            <FormInput
              label="Key Tech Stack Used (comma separated)"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="e.g. React, Next.js, Node.js, PostgreSQL"
            />

            <FormTextArea
              label="Role Highlights & Accomplishments (One per line)"
              required
              rows={6}
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
              placeholder="Spearheaded frontend migration resulting in 40% performance gains...&#10;Mentored 4 junior engineers...&#10;Integrated secure Supabase DB backend..."
            />

            <FormActions onCancel={closeEditor} saving={saving} isAdmin={isAdmin} />
          </form>
        </div>
      ) : (
        /* List View */
        <div className="grid gap-6">
          {loading ? (
            <div className="flex flex-col py-20 items-center justify-center font-mono text-xs text-[#8892b0] gap-3">
              <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
              <span>reading job history tables...</span>
            </div>
          ) : experiences.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-12 text-center font-mono">
              <Briefcase className="h-12 w-12 text-[#8892b0]/30 mx-auto mb-4" />
              <p className="text-sm text-[#ccd6f6]">Database holds 0 experience records.</p>
              <p className="text-xs text-[#8892b0] mt-1">Visit Overview to seed database with initial records in one click.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="liquid-glass relative overflow-hidden rounded-2xl p-6 hover:border-[#64ffda]/50 hover:shadow-[0_0_30px_rgba(100,255,218,0.15)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#ccd6f6]">
                      {exp.role} <span className="text-[#64ffda]">@ {exp.company}</span>
                    </h3>
                    <span className="liquid-glass-pill font-mono text-[9px] px-2.5 py-0.5 rounded-full text-[#8892b0]">
                      {exp.slug}
                    </span>
                  </div>
                  <p className="text-xs text-[#8892b0] font-mono">
                    {exp.period} · {exp.location}
                  </p>
                  <ul className="list-disc pl-5 text-xs text-[#8892b0]/85 space-y-1">
                    {exp.bullets.slice(0, 2).map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                    {exp.bullets.length > 2 && (
                      <li className="list-none text-[10px] text-[#64ffda]/70 font-mono mt-1">
                        + {exp.bullets.length - 2} more accomplishment highlights
                      </li>
                    )}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.tech.map((t) => (
                      <span key={t} className="liquid-glass-pill font-mono text-[9px] text-[#64ffda]/90 px-2.5 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => openEdit(exp)}
                    className="p-3 bg-white/5 border border-white/10 hover:border-[#64ffda]/30 rounded-xl hover:bg-[#64ffda]/5 text-[#8892b0] hover:text-[#64ffda] transition"
                    title="Edit Record"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, exp.company)}
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
