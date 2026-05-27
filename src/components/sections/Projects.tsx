"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { TerminalView } from "@/components/sections/TerminalView";

export function Projects() {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false });
  const [viewMode, setViewMode] = useState<"cards" | "terminal">("cards");

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
          >
            {/* Desktop Vertical Layout */}
            <div className="hidden flex-col gap-6 lg:flex">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            {/* Mobile Carousel Layout */}
            <div className="overflow-hidden lg:hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="min-w-[85vw] shrink-0 sm:min-w-[70vw]">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
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

