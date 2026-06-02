"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TerminalView } from "@/components/sections/TerminalView";
import { ProjectDeck } from "@/components/sections/ProjectDeck";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { projects } from "@/lib/site";

export function Projects() {
  const [viewMode, setViewMode] = useState<"cards" | "terminal">("cards");

  // Synchronize dynamic AI chat requests from other sections
  useEffect(() => {
    const handleFocusChat = () => {
      if (viewMode !== "terminal") {
        setViewMode("terminal");
        // Wait for AnimatePresence slide and TerminalView mount
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("focus-terminal-chat-active"));
        }, 150);
      } else {
        window.dispatchEvent(new CustomEvent("focus-terminal-chat-active"));
      }
    };

    window.addEventListener("focus-terminal-chat", handleFocusChat);
    return () => {
      window.removeEventListener("focus-terminal-chat", handleFocusChat);
    };
  }, [viewMode]);

  return (
    <section id="projects" className="px-6 py-24 lg:px-12" aria-labelledby="projects-heading">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
        <SectionHeading number="03" title="Projects" />
        
        {/* Visual vs Terminal Mode Toggle */}
        <div className="glass-card flex rounded-lg p-1 border border-white/5 self-start sm:self-center">
          <button
            onClick={() => setViewMode("cards")}
            className={`cursor-pointer rounded px-4 py-1.5 font-mono text-[10px] sm:text-xs transition-all duration-250 ${
              viewMode === "cards"
                ? "bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 shadow-[0_0_12px_rgba(100,255,218,0.12)] font-semibold"
                : "text-[#8892b0] hover:text-[#ccd6f6] border border-transparent"
            }`}
          >
            [01] VISUAL_CARDS
          </button>
          <button
            onClick={() => setViewMode("terminal")}
            className={`cursor-pointer rounded px-4 py-1.5 font-mono text-[10px] sm:text-xs transition-all duration-250 ${
              viewMode === "terminal"
                ? "bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 shadow-[0_0_12px_rgba(100,255,218,0.12)] font-semibold"
                : "text-[#8892b0] hover:text-[#ccd6f6] border border-transparent"
            }`}
          >
            [02] HACKER_TERMINAL
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "cards" ? (
          <motion.div
            key="cards-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {/* Desktop grid layout */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project as any} />
              ))}
            </div>
            {/* Mobile swipable stack layout */}
            <div className="lg:hidden w-full flex items-center justify-center">
              <ProjectDeck />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="terminal-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full max-w-4xl mx-auto"
          >
            <TerminalView onSwitchToCards={() => setViewMode("cards")} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


