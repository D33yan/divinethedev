"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Loader2, Plus, Trash2, Star, MessageSquare } from "lucide-react";

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  stars: number;
}

export default function TestimonialsManager() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [avatar, setAvatar] = useState("/portfolioprofile1.png");
  const [stars, setStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: true });
      if (err) throw err;
      setTestimonials(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = async (e: React.FormEvent) => {
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
      const { error: err } = await supabase.from("testimonials").insert({
        quote,
        author,
        role,
        company,
        avatar,
        stars
      });
      if (err) throw err;

      setSuccess("Client review added successfully!");
      setQuote("");
      setAuthor("");
      setRole("");
      setCompany("");
      setAvatar("/portfolioprofile1.png");
      setStars(5);
      triggerSound("success");
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message || "Could not add testimonial.");
      triggerSound("glitch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase.from("testimonials").delete().eq("id", id);
      if (err) throw err;

      setSuccess("Testimonial deleted successfully.");
      triggerSound("success");
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message || "Could not delete testimonial.");
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
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>TESTIMONIALS_MANAGER</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                MANAGE CLIENT FEEDBACK AND REVIEWS DISPLAYED ON YOUR LANDING PAGE
              </p>
            </div>
          </div>
        </div>
      </div>

      <SystemAlert type="error" message={error} />
      <SystemAlert type="success" message={success} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Testimonials List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="liquid-glass-panel rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6] mb-4">CLIENT_REVIEWS</h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 text-[#8892b0] font-mono text-xs border border-dashed border-white/5 rounded-xl">
                NO TESTIMONIALS DEFINED. LANDING PAGE SECTION WILL BE HIDDEN.
              </div>
            ) : (
              <div className="divide-y divide-white/5 space-y-4">
                {testimonials.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full border border-[#64ffda]/30 overflow-hidden bg-black/40 shrink-0">
                        <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex gap-0.5">
                          {Array.from({ length: item.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#64ffda] text-[#64ffda]" />
                          ))}
                        </div>
                        <p className="text-xs text-[#ccd6f6] italic leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                        <div className="font-mono text-[10px] text-[#8892b0]">
                          <span className="font-bold text-[#64ffda]">{item.author}</span> &middot; {item.role} @ {item.company}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTestimonial(item.id)}
                      disabled={!isAdmin}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
                      title="Delete testimonial"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Testimonial Column */}
        <div className="space-y-4">
          <div className="liquid-glass rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6] mb-4">ADD_NEW_REVIEW</h2>

            <form onSubmit={handleAddTestimonial} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Client Name</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="liquid-glass-input w-full rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Client Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. CEO"
                    className="liquid-glass-input w-full rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Company</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="liquid-glass-input w-full rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Rating (Stars)</label>
                  <select
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                    className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s} Stars</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Avatar Path</label>
                  <input
                    type="text"
                    required
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="/portfolioprofile1.png"
                    className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Review Quote</label>
                <textarea
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Insert client quote here..."
                  rows={4}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none"
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
                    <span>CREATE_TESTIMONIAL</span>
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
