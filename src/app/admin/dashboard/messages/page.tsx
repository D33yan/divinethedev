"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Mail, Trash2, Calendar, User, MessageSquare, Loader2, Sparkles, Send, ExternalLink } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function ManageMessages() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Track active opened drafts by message ID
  const [activeDrafts, setActiveDrafts] = useState<Record<string, { text: string; category: string }>>({});
  const [openDraftId, setOpenDraftId] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error("Failed to load messages:", err);
      setActionError(err.message || "Failed to load database inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string, senderName: string) => {
    if (!supabase) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setActionError("Delete restricted: Administrator clearance required.");
      return;
    }

    if (!confirm(`Remove inquiry message from '${senderName}'?`)) {
      return;
    }

    triggerSound("click");
    setDeletingId(id);
    setActionError("");
    setActionSuccess("");

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setActionSuccess(`Message from '${senderName}' deleted successfully.`);
      triggerSound("success");
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (openDraftId === id) setOpenDraftId(null);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to delete message record.");
      triggerSound("glitch");
    } finally {
      setDeletingId(null);
    }
  };

  // Deterministic Local Heuristics Email Drafter (Zero AI Credits Required!)
  const generateDraft = (msg: ContactMessage) => {
    const text = msg.message.toLowerCase();
    
    // Keyword groups
    const recruiterKeywords = ["job", "hire", "recruiter", "interview", "contract", "position", "role", "nasrda", "resume", "cv", "salary", "hiring"];
    const freelanceKeywords = ["project", "client", "freelance", "website", "automation", "workflow", "n8n", "funnel", "fiverr", "upwork", "proposal"];
    
    const isRecruiter = recruiterKeywords.some((kw) => text.includes(kw));
    const isFreelance = freelanceKeywords.some((kw) => text.includes(kw));

    let category = "GENERAL_INQUIRY";
    let body = "";

    if (isRecruiter) {
      category = "RECRUITER_FOLLOW_UP";
      body = `Hi ${msg.name},\n\nThank you for reaching out regarding recruitment opportunities. I am very interested in learning more about the role and how my background in Fullstack Development, AI integration, and automation aligns with your team's goals.\n\nI have uploaded my downloadable ATS-optimized CV directly to my portfolio (https://divinethe.dev) and would love to schedule a brief call to discuss this further.\n\nBest regards,\nDivine`;
    } else if (isFreelance) {
      category = "FREELANCE_PROPOSAL";
      body = `Hi ${msg.name},\n\nThank you for reaching out regarding your project. I'd love to help you build and automate this! My background includes deploying 15+ custom client websites, designing sales funnels, and building webhook-integrated automation pipelines (n8n, Zapier, GoHighLevel).\n\nLet's schedule a brief consultation call to align on your specific requirements, scope, and timeline.\n\nBest regards,\nDivine`;
    } else {
      category = "GENERAL_FEEDBACK";
      body = `Hi ${msg.name},\n\nThank you for your message and feedback! I appreciate you taking the time to visit my portfolio website. I've received your query and will get back to you shortly.\n\nBest regards,\nDivine`;
    }

    return { text: body, category };
  };

  const toggleDraft = (msg: ContactMessage) => {
    triggerSound("click");
    if (openDraftId === msg.id) {
      setOpenDraftId(null);
      return;
    }

    if (!activeDrafts[msg.id]) {
      const draft = generateDraft(msg);
      setActiveDrafts((prev) => ({ ...prev, [msg.id]: draft }));
    }
    setOpenDraftId(msg.id);
  };

  const handleDraftTextChange = (id: string, text: string) => {
    setActiveDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], text }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Cyber Header Banner */}
      <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-2xl">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>INBOX_LEADS_MATRIX</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                INCOMING RECRUITER & CLIENT MESSAGES · TELEGRAM BOT UPLINK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="liquid-glass-pill px-3.5 py-1.5 rounded-full font-mono text-xs text-[#64ffda] font-bold shadow-[0_0_12px_rgba(100,255,218,0.15)]">
              TOTAL: {messages.length} INQUIRIES
            </span>
          </div>
        </div>
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {loading ? (
        <div className="flex flex-col py-20 items-center justify-center font-mono text-xs text-[#8892b0] gap-3">
          <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
          <span>reading live contact inquiries...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="liquid-glass relative overflow-hidden rounded-3xl p-12 text-center font-mono">
          <Mail className="h-12 w-12 text-[#8892b0]/30 mx-auto mb-4" />
          <p className="text-sm text-[#ccd6f6] font-bold">Your Inbox is currently clear.</p>
          <p className="text-xs text-[#8892b0] mt-1">Incoming inquiries from your portfolio contact form will display here in real time.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => {
            const hasDraft = !!activeDrafts[msg.id];
            const draft = activeDrafts[msg.id];
            const isDraftOpen = openDraftId === msg.id;

            return (
              <div 
                key={msg.id} 
                className="liquid-glass relative overflow-hidden rounded-2xl p-6 hover:border-[#64ffda]/50 hover:shadow-[0_0_30px_rgba(100,255,218,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#ccd6f6] font-mono">
                      <User className="h-4 w-4 text-[#64ffda] shrink-0" />
                      <span>{msg.name}</span>
                    </div>
                    <div className="text-xs text-[#8892b0] font-mono hover:text-[#64ffda] transition text-left">
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8892b0]/70 font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      disabled={deletingId === msg.id || !isAdmin}
                      className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 hover:border-red-500/20 disabled:opacity-50 transition cursor-pointer"
                      title="Delete Inquiry"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inquiry Message Text */}
                <div className="mt-4 pt-2 text-left">
                  <div className="flex gap-2.5 items-start text-sm text-[#ccd6f6]/90 font-sans leading-relaxed whitespace-pre-wrap">
                    <MessageSquare className="h-4 w-4 text-[#8892b0] mt-1 shrink-0" />
                    <p>{msg.message}</p>
                  </div>
                </div>

                {/* Smart Draft Assistant Section */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => toggleDraft(msg)}
                    className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg border transition duration-200 cursor-pointer ${
                      isDraftOpen 
                        ? "bg-[#64ffda]/10 text-[#64ffda] border-[#64ffda]/25" 
                        : "bg-white/5 text-[#8892b0] border-transparent hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isDraftOpen ? "HIDE_AUTO_REPLY" : "SMART_AUTO_REPLY"}</span>
                  </button>

                  <AnimatePresence>
                    {isDraftOpen && draft && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-3 text-left space-y-3 font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="liquid-glass-pill text-[9px] px-2.5 py-0.5 rounded-full text-[#8892b0] tracking-wider">
                            TEMPLATE: {draft.category}
                          </span>
                          <span className="text-[9px] text-[#64ffda] tracking-widest uppercase">
                            Zero-Credits Local Draft
                          </span>
                        </div>

                        <textarea
                          value={draft.text}
                          onChange={(e) => handleDraftTextChange(msg.id, e.target.value)}
                          rows={8}
                          className="liquid-glass-input w-full rounded-xl p-4 text-[11px] text-white/90 outline-none transition resize-none leading-relaxed"
                          placeholder="Edit the reply draft..."
                        />

                        {/* Action buttons to trigger client mail application */}
                        <div className="flex flex-wrap gap-3 font-mono text-[10px]">
                          <a
                            href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry&body=${encodeURIComponent(draft.text)}`}
                            onClick={() => {
                              triggerSound("success");
                            }}
                            className="inline-flex items-center gap-1.5 rounded bg-[#64ffda] text-black hover:bg-[#64ffda]/80 font-bold px-4 py-2 transition"
                          >
                            <Send className="h-3 w-3" />
                            <span>SEND_VIA_MAILTO</span>
                          </a>

                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=Re: Portfolio Inquiry&body=${encodeURIComponent(draft.text)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              triggerSound("success");
                            }}
                            className="inline-flex items-center gap-1.5 rounded border border-white/10 hover:border-white/20 bg-white/5 text-white px-4 py-2 transition"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>OPEN_IN_GMAIL</span>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
