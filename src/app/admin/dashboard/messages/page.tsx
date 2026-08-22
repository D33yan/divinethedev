"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Mail, Trash2, Calendar, User, MessageSquare, Loader2 } from "lucide-react";

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
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Failed to delete message record.");
      triggerSound("glitch");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">INBOX_MESSAGES</h1>
        <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
          READ AND MANAGE USER INQUIRIES SUBMITTED FROM CONTACT PAGE
        </p>
      </div>

      <SystemAlert type="error" message={actionError} />
      <SystemAlert type="success" message={actionSuccess} />

      {loading ? (
        <div className="flex flex-col py-20 items-center justify-center font-mono text-xs text-[#8892b0] gap-3">
          <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
          <span>reading live contact inquiries...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 text-center bg-[#0a192f]/20 font-mono">
          <Mail className="h-12 w-12 text-[#8892b0]/30 mx-auto mb-4" />
          <p className="text-sm text-[#ccd6f6]">Your Inbox is empty.</p>
          <p className="text-xs text-[#8892b0] mt-1">Incoming inquiries from the contact form will show up here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="glass-card rounded-2xl border border-white/10 p-6 bg-[#112240]/20 backdrop-blur-md hover:border-[#64ffda]/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#ccd6f6] font-mono">
                    <User className="h-4 w-4 text-[#64ffda] shrink-0" />
                    <span>{msg.name}</span>
                  </div>
                  <div className="text-xs text-[#8892b0] font-mono hover:text-[#64ffda] transition">
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

              <div className="mt-4 pt-2">
                <div className="flex gap-2.5 items-start text-sm text-[#ccd6f6]/90 font-sans leading-relaxed whitespace-pre-wrap">
                  <MessageSquare className="h-4 w-4 text-[#8892b0] mt-1 shrink-0" />
                  <p>{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
