"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePortfolioData } from "@/components/providers/PortfolioDataContext";

function ContactContent() {
  const { logEvent } = usePortfolioData();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Track submission event in telemetry
    logEvent("contact_attempt", `From: ${formState.name} (${formState.email})`);

    // Log query details directly in Supabase contact_messages table
    try {
      if (supabase) {
        await supabase.from("contact_messages").insert({
          name: formState.name,
          email: formState.email,
          message: formState.message
        });
      }
    } catch (dbErr) {
      console.warn("Could not log inquiries to live database table:", dbErr);
    }

    // Dispatch instant push notification to phone via Telegram engine (non-blocking)
    try {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      }).catch((notifyErr) => console.warn("Telegram notification dispatch notice:", notifyErr));
    } catch (e) {
      console.warn("Could not trigger notification endpoint:", e);
    }

    try {
      const response = await fetch("https://formspree.io/f/xredppln", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (response.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again or reach out directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message. Please check your connection.");
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-start max-w-5xl mx-auto mt-6">
      {/* Left Column: Quick Connect info */}
      <div className="lg:col-span-5 space-y-6 text-left">
        <h3 className="text-3xl font-bold text-[#ccd6f6] tracking-tight">
          Let&apos;s Build Something Extraordinary
        </h3>
        <p className="text-sm leading-relaxed text-[#8892b0]">
          I&apos;m currently open to full-time, hybrid, and onsite engineering roles, as well as freelance opportunities, contract positions, and collaborative AI and fullstack projects. Whether you have a position to fill, a project in mind, or just want to connect, feel free to drop a message or reach out directly!
        </p>

        <div className="flex flex-col gap-4 pt-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-navy-light/45 p-4 transition duration-300 hover:border-[#64ffda]/30 hover:bg-navy-light/70 group"
            data-cursor-hover
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#64ffda]/10 text-[#64ffda] group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#64ffda]">
                Direct Email
              </span>
              <span className="text-sm font-medium text-[#ccd6f6] break-all">
                {siteConfig.email}
              </span>
            </div>
          </a>

          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-navy-light/45 p-4 transition duration-300 hover:border-[#64ffda]/30 hover:bg-navy-light/70 group"
            data-cursor-hover
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#64ffda]/10 text-[#64ffda] group-hover:scale-105 transition-transform">
              <FaLinkedin className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#64ffda]">
                LinkedIn Profile
              </span>
              <span className="text-sm font-medium text-[#ccd6f6] truncate max-w-[200px] sm:max-w-none block">
                Divine Nnaji
              </span>
            </div>
          </a>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-navy-light/45 p-4 transition duration-300 hover:border-[#64ffda]/30 hover:bg-navy-light/70 group"
            data-cursor-hover
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#64ffda]/10 text-[#64ffda] group-hover:scale-105 transition-transform">
              <SiGithub className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#64ffda]">
                GitHub Profile
              </span>
              <span className="text-sm font-medium text-[#ccd6f6]">
                {siteConfig.githubHandle}
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Right Column: Premium Glassmorphic Form */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-white/10 bg-navy/80 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#64ffda]/10 text-[#64ffda] mb-6">
                <span className="text-2xl font-mono">✓</span>
              </div>
              <h4 className="text-2xl font-bold text-[#ccd6f6]">Message Sent!</h4>
              <p className="mt-4 text-[#8892b0] text-sm">
                Thank you for reaching out! I typically respond within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 rounded-full border border-[#64ffda]/40 bg-[#64ffda]/10 px-6 py-2.5 font-mono text-xs text-[#64ffda] transition hover:bg-[#64ffda]/20"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-[10px] uppercase tracking-wider text-[#ccd6f6] mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-white/10 bg-navy-light/40 px-4 py-3.5 text-sm text-[#ccd6f6] placeholder-[#8892b0]/50 outline-none transition focus:border-[#64ffda]/50 focus:bg-navy-light/70"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-[10px] uppercase tracking-wider text-[#ccd6f6] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="contact-email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-white/10 bg-navy-light/40 px-4 py-3.5 text-sm text-[#ccd6f6] placeholder-[#8892b0]/50 outline-none transition focus:border-[#64ffda]/50 focus:bg-navy-light/70"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[10px] uppercase tracking-wider text-[#ccd6f6] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Hi Divine, let's talk about..."
                  className="w-full rounded-xl border border-white/10 bg-navy-light/40 px-4 py-3.5 text-sm text-[#ccd6f6] placeholder-[#8892b0]/50 outline-none transition focus:border-[#64ffda]/50 focus:bg-navy-light/70 resize-none"
                />
              </div>

              {status === "error" && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-400">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-[#64ffda] px-6 py-4 text-sm font-semibold text-black transition duration-300 hover:bg-[#64ffda]/80 disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <span className="transition-transform group-hover/btn:translate-x-1 duration-200">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <section id="contact" className="px-6 py-24 lg:px-12" aria-labelledby="contact-heading">
      <SectionHeading number="06" title="Contact" />

      {/* Desktop view */}
      <div className="hidden md:block">
        <ContactContent />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <p className="text-center text-[#8892b0] mb-6">Tap below to reach out — I&apos;d love to hear from you.</p>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="mx-auto flex min-h-[44px] items-center rounded-full border border-[#64ffda] bg-[#64ffda]/10 px-8 py-3 font-mono text-sm text-[#64ffda] transition hover:bg-[#64ffda]/20 shadow-[0_0_20px_rgba(100,255,218,0.1)]"
        >
          Get in touch
        </button>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 md:hidden backdrop-blur-sm"
              onClick={() => setSheetOpen(false)}
              aria-label="Close contact sheet"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 bottom-0 left-0 z-[70] max-h-[90vh] overflow-y-auto rounded-t-2xl border-t border-[#64ffda]/20 bg-navy p-6 pb-12 md:hidden"
              role="dialog"
              aria-modal
              aria-label="Contact"
            >
              {/* Tap target close trigger for mobile screens */}
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#8892b0] hover:text-[#64ffda] hover:border-[#64ffda]/30 transition cursor-pointer"
                aria-label="Close contact form"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20" />
              <ContactContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
