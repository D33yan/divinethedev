"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { FormInput } from "@/components/ui/FormInput";
import { FormActions } from "@/components/ui/FormActions";
import { Cpu, Plus, Edit2, Trash2, X, Save, Loader2, AlertCircle } from "lucide-react";

interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
  sort_order: number;
}

export default function ManageSkills() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Editor states
  const [editingGroup, setEditingGroup] = useState<SkillGroup | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");

  const fetchSkillGroups = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("skill_groups")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setSkillGroups(data || []);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to load skill groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGroups();
  }, []);

  const openEdit = (group: SkillGroup) => {
    triggerSound("click");
    setEditingGroup(group);
    setIsNew(false);
    setActionError("");
    setActionSuccess("");

    setTitle(group.title);
    setSkills(group.skills.join(", "));
  };

  const openNew = () => {
    triggerSound("click");
    setEditingGroup({} as SkillGroup);
    setIsNew(true);
    setActionError("");
    setActionSuccess("");

    setTitle("");
    setSkills("");
  };

  const closeEditor = () => {
    triggerSound("click");
    setEditingGroup(null);
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
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      sort_order: isNew ? skillGroups.length : editingGroup!.sort_order
    };

    try {
      if (isNew) {
        const { error } = await supabase.from("skill_groups").insert(payload);
        if (error) throw error;
        setActionSuccess(`Skill Group '${title}' added successfully!`);
      } else {
        const { error } = await supabase
          .from("skill_groups")
          .update(payload)
          .eq("id", editingGroup!.id);
        if (error) throw error;
        setActionSuccess(`Skill Group '${title}' updated successfully!`);
      }
      
      triggerSound("success");
      setEditingGroup(null);
      await fetchSkillGroups();
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

    if (!confirm(`Are you sure you want to delete skill group '${name}'?`)) {
      return;
    }

    triggerSound("click");
    setActionError("");
    setActionSuccess("");

    try {
      const { error } = await supabase.from("skill_groups").delete().eq("id", id);
      if (error) throw error;
      setActionSuccess(`Skill group '${name}' deleted successfully.`);
      triggerSound("success");
      await fetchSkillGroups();
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
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>SKILLS_MANAGEMENT</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                CATEGORIES, CAPABILITIES AND TECH STACK LISTINGS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="liquid-glass-pill px-3.5 py-1.5 rounded-full font-mono text-xs text-[#8892b0]">
              TOTAL: {skillGroups.length}
            </span>
            {!editingGroup && (
              <button
                onClick={openNew}
                className="flex items-center gap-2 bg-[#64ffda] text-black px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-[#64ffda]/90 transition-all shadow-md shadow-[#64ffda]/20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>NEW_CATEGORY</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {editingGroup ? (
        /* Form Editor Box */
        <div className="liquid-glass-panel rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">
              {isNew ? "CREATE_NEW_SKILLS_CATEGORY" : `EDIT_RECORD: ${editingGroup.title}`}
            </h2>
            <button onClick={closeEditor} className="text-[#8892b0] hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <FormInput
              label="Category Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Languages, Databases, Automation"
            />

            <FormInput
              label="Tech/Skills List (comma separated)"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Next.js, React Native, TypeScript, Tailwind CSS"
            />

            <FormActions onCancel={closeEditor} saving={saving} isAdmin={isAdmin} />
          </form>
        </div>
      ) : (
        /* List View */
        <div className="grid gap-6 sm:grid-cols-2">
          {loading ? (
            <div className="flex flex-col py-20 items-center justify-center font-mono text-xs text-[#8892b0] gap-3 col-span-2">
              <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
              <span>reading skills tables...</span>
            </div>
          ) : skillGroups.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-12 text-center font-mono col-span-2">
              <Cpu className="h-12 w-12 text-[#8892b0]/30 mx-auto mb-4" />
              <p className="text-sm text-[#ccd6f6]">Database holds 0 skills records.</p>
              <p className="text-xs text-[#8892b0] mt-1">Visit Overview to seed database with initial records in one click.</p>
            </div>
          ) : (
            skillGroups.map((group) => (
              <div
                key={group.id}
                className="liquid-glass relative overflow-hidden rounded-2xl p-6 hover:border-[#64ffda]/50 hover:shadow-[0_0_30px_rgba(100,255,218,0.15)] transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#64ffda] border-b border-white/5 pb-2 mb-3">
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((s) => (
                      <span key={s} className="liquid-glass-pill text-xs text-[#ccd6f6] px-3 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 justify-end">
                  <button
                    onClick={() => openEdit(group)}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-[#64ffda]/30 rounded-xl hover:bg-[#64ffda]/5 text-[#8892b0] hover:text-[#64ffda] transition text-xs flex items-center gap-1.5 font-mono"
                    title="Edit Group"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(group.id, group.title)}
                    disabled={!isAdmin}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-red-500/30 rounded-xl hover:bg-red-500/5 text-[#8892b0] hover:text-red-400 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 text-xs flex items-center gap-1.5 font-mono"
                    title="Delete Group"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    DELETE
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
