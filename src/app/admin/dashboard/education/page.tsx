"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { FormInput } from "@/components/ui/FormInput";
import { FormActions } from "@/components/ui/FormActions";
import { GraduationCap, Award, Plus, Edit2, Trash2, X, Save, Loader2, AlertCircle } from "lucide-react";

interface EducationItem {
  id: string;
  title: string;
  org: string;
  period: string;
  sort_order: number;
}

interface CertificationItem {
  id: string;
  title: string;
  org: string;
  period: string;
  sort_order: number;
}

export default function ManageAcademicRecords() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [loadingEdu, setLoadingEdu] = useState(true);
  const [loadingCert, setLoadingCert] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Editor modes: 'edu' | 'cert' | null
  const [editMode, setEditMode] = useState<"edu" | "cert" | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [period, setPeriod] = useState("");

  const fetchEducation = async () => {
    if (!supabase) return;
    setLoadingEdu(true);
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setEducation(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingEdu(false);
    }
  };

  const fetchCertifications = async () => {
    if (!supabase) return;
    setLoadingCert(true);
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setCertifications(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingCert(false);
    }
  };

  useEffect(() => {
    fetchEducation();
    fetchCertifications();
  }, []);

  const openEdit = (type: "edu" | "cert", item: any) => {
    triggerSound("click");
    setEditMode(type);
    setEditingItem(item);
    setIsNew(false);
    setActionError("");
    setActionSuccess("");

    setTitle(item.title);
    setOrg(item.org);
    setPeriod(item.period);
  };

  const openNew = (type: "edu" | "cert") => {
    triggerSound("click");
    setEditMode(type);
    setEditingItem({} as any);
    setIsNew(true);
    setActionError("");
    setActionSuccess("");

    setTitle("");
    setOrg("");
    setPeriod("");
  };

  const closeEditor = () => {
    triggerSound("click");
    setEditMode(null);
    setEditingItem(null);
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

    const table = editMode === "edu" ? "education" : "certifications";
    const currentLength = editMode === "edu" ? education.length : certifications.length;

    const payload = {
      title,
      org,
      period,
      sort_order: isNew ? currentLength : editingItem.sort_order
    };

    try {
      if (isNew) {
        const { error } = await supabase.from(table).insert(payload);
        if (error) throw error;
        setActionSuccess(`Record added successfully!`);
      } else {
        const { error } = await supabase
          .from(table)
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        setActionSuccess(`Record updated successfully!`);
      }
      
      triggerSound("success");
      setEditMode(null);
      setEditingItem(null);
      if (table === "education") await fetchEducation();
      else await fetchCertifications();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Error saving database record.");
      triggerSound("glitch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: "edu" | "cert", id: string, name: string) => {
    if (!supabase) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setActionError("Delete permissions restricted: Administrator clearance required.");
      return;
    }

    if (!confirm(`Are you sure you want to delete '${name}'?`)) {
      return;
    }

    triggerSound("click");
    setActionError("");
    setActionSuccess("");

    const table = type === "edu" ? "education" : "certifications";

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      setActionSuccess(`Record deleted successfully.`);
      triggerSound("success");
      if (table === "education") await fetchEducation();
      else await fetchCertifications();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to delete record.");
      triggerSound("glitch");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">ACADEMIC_&_CERTIFICATIONS</h1>
        <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
          MANAGE EDUCATION TRACKS AND SYSTEM CERTIFICATES
        </p>
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {editMode ? (
        /* Form Editor Box */
        <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 bg-[#0a192f]/40 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">
              {isNew ? `NEW_${editMode === "edu" ? "EDUCATION" : "CERTIFICATION"}_RECORD` : `EDIT_${editMode === "edu" ? "EDUCATION" : "CERTIFICATION"}_RECORD`}
            </h2>
            <button onClick={closeEditor} className="text-[#8892b0] hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label={editMode === "edu" ? "Degree / Field of Study" : "Certification Title"}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={editMode === "edu" ? "e.g. B.Sc. Computer Science" : "e.g. Fullstack Web Engineering"}
              />

              <FormInput
                label={editMode === "edu" ? "Institution / School" : "Issuing Organization"}
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder={editMode === "edu" ? "e.g. University of Abuja" : "e.g. AWS, EarlyCode"}
              />
            </div>

            <FormInput
              label="Period / Date"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder={editMode === "edu" ? "e.g. 2023 – Present" : "e.g. May – June 2022"}
            />

            <FormActions onCancel={closeEditor} saving={saving} isAdmin={isAdmin} />
          </form>
        </div>
      ) : (
        /* Double Column List Views */
        <div className="grid gap-8 md:grid-cols-2">
          {/* Education Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-[#ccd6f6]">
                <GraduationCap className="h-5 w-5 text-[#64ffda]" />
                <h2 className="text-md font-mono uppercase tracking-wider font-bold">Academic Record</h2>
              </div>
              <button
                onClick={() => openNew("edu")}
                className="flex items-center gap-1 bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda]/30 text-[#64ffda] px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider transition"
              >
                <Plus className="h-3 w-3" />
                ADD
              </button>
            </div>

            <div className="space-y-4">
              {loadingEdu ? (
                <div className="text-center py-10 font-mono text-xs text-[#8892b0]">reading...</div>
              ) : education.length === 0 ? (
                <div className="text-center py-10 text-[#8892b0] border border-dashed border-white/5 rounded-xl text-xs font-mono">
                  No education records.
                </div>
              ) : (
                education.map((item) => (
                  <div key={item.id} className="glass-card rounded-xl p-4 border border-white/5 bg-[#112240]/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#ccd6f6]">{item.title}</h4>
                      <p className="text-[11px] text-[#64ffda] font-mono mt-0.5">{item.org}</p>
                      <p className="text-[10px] text-[#8892b0] font-mono mt-0.5">{item.period}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit("edu", item)}
                        className="p-2 hover:bg-white/5 text-[#8892b0] hover:text-[#64ffda] rounded-lg transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("edu", item.id, item.title)}
                        disabled={!isAdmin}
                        className="p-2 hover:bg-white/5 text-[#8892b0] hover:text-red-400 rounded-lg transition disabled:opacity-30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certifications Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-[#ccd6f6]">
                <Award className="h-5 w-5 text-amber-400" />
                <h2 className="text-md font-mono uppercase tracking-wider font-bold">Certifications</h2>
              </div>
              <button
                onClick={() => openNew("cert")}
                className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider transition"
              >
                <Plus className="h-3 w-3" />
                ADD
              </button>
            </div>

            <div className="space-y-4">
              {loadingCert ? (
                <div className="text-center py-10 font-mono text-xs text-[#8892b0]">reading...</div>
              ) : certifications.length === 0 ? (
                <div className="text-center py-10 text-[#8892b0] border border-dashed border-white/5 rounded-xl text-xs font-mono">
                  No certifications records.
                </div>
              ) : (
                certifications.map((item) => (
                  <div key={item.id} className="glass-card rounded-xl p-4 border border-white/5 bg-[#112240]/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#ccd6f6]">{item.title}</h4>
                      <p className="text-[11px] text-amber-400 font-mono mt-0.5">{item.org}</p>
                      <p className="text-[10px] text-[#8892b0] font-mono mt-0.5">{item.period}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit("cert", item)}
                        className="p-2 hover:bg-white/5 text-[#8892b0] hover:text-[#64ffda] rounded-lg transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("cert", item.id, item.title)}
                        disabled={!isAdmin}
                        className="p-2 hover:bg-white/5 text-[#8892b0] hover:text-red-400 rounded-lg transition disabled:opacity-30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
