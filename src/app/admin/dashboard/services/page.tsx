"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Loader2, Plus, Trash2, Award, HelpCircle } from "lucide-react";
import * as Icons from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export default function ServicesManager() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("Code");
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });
      if (err) throw err;
      setServices(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase.from("services").insert({
        title,
        desc,
        icon
      });
      if (err) throw err;

      setSuccess("Service created successfully!");
      setTitle("");
      setDesc("");
      setIcon("Code");
      triggerSound("success");
      await fetchServices();
    } catch (err: any) {
      setError(err.message || "Could not create service.");
      triggerSound("glitch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete this service?")) return;

    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase.from("services").delete().eq("id", id);
      if (err) throw err;

      setSuccess("Service deleted successfully.");
      triggerSound("success");
      await fetchServices();
    } catch (err: any) {
      setError(err.message || "Could not delete service.");
      triggerSound("glitch");
    }
  };

  const iconOptions = ["Code", "Cpu", "Layout", "Globe", "Server", "Pencil", "Search", "Shield", "Zap", "User", "Heart", "Briefcase"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">SERVICES_MANAGER</h1>
        <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
          Manage professional service listings displayed on your landing page
        </p>
      </div>

      <SystemAlert type="error" message={error} />
      <SystemAlert type="success" message={success} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Services List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6] mb-4">ACTIVE_SERVICES</h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 text-[#8892b0] font-mono text-xs border border-dashed border-white/5 rounded-xl">
                NO SERVICES DEFINED. LANDING PAGE SECTION WILL BE HIDDEN.
              </div>
            ) : (
              <div className="divide-y divide-white/5 space-y-4">
                {services.map((service) => {
                  const IconComponent = (Icons as any)[service.icon] || HelpCircle;
                  return (
                    <div key={service.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/20 flex items-center justify-center text-[#64ffda] shrink-0">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold font-mono text-[#ccd6f6]">{service.title}</h3>
                          <p className="text-xs text-[#8892b0] leading-relaxed">{service.desc}</p>
                          <div className="text-[10px] text-white/20 font-mono">ICON: {service.icon}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteService(service.id)}
                        disabled={!isAdmin}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
                        title="Delete service"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add Service Column */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6] mb-4">ADD_NEW_SERVICE</h2>

            <form onSubmit={handleAddService} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fullstack Development"
                  className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Lucide Icon Class</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Summarize the value and features of this service..."
                  rows={4}
                  className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !isAdmin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#64ffda] text-black hover:bg-[#64ffda]/80 font-bold font-mono text-xs py-3 px-4 shadow-lg shadow-[#64ffda]/10 transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>CREATE_SERVICE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
