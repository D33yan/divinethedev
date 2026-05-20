"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X, AlertCircle, Compass, Terminal, Trophy, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { projects } from "@/lib/site";

type Project = (typeof projects)[number];

interface CaseStudyModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project.caseStudy) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617]/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="relative flex h-full w-full flex-col border-l border-white/10 bg-[#0a0f1e]/95 backdrop-blur-2xl p-6 shadow-2xl sm:p-8 md:max-w-2xl"
          >
            {/* Elegant Top Nav Controls */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#64ffda]/10 px-2 py-0.5 font-mono text-xs text-[#64ffda]">
                  {project.tag}
                </span>
                {project.badge && (
                  <span className="rounded bg-[#64ffda]/20 px-2 py-0.5 font-mono text-xs text-[#64ffda]">
                    {project.badge}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-[#8892b0] transition hover:bg-white/5 hover:text-[#64ffda]"
                aria-label="Close Case Study"
                data-cursor-hover
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Panel Contents */}
            <div className="flex-1 overflow-y-auto py-6 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              <h2 className="text-3xl font-bold tracking-tight text-[#ccd6f6] sm:text-4xl">
                {project.title}
              </h2>
              
              {/* Tech stack pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#112240]/60 px-3 py-1 font-mono text-xs text-[#8892b0] border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Connection to Live Link from the Case Study */}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/live mt-6 flex items-center justify-between rounded-xl border border-[#64ffda]/30 bg-[#64ffda]/5 p-4 transition duration-300 hover:bg-[#64ffda]/10 hover:border-[#64ffda]/50"
                  data-cursor-hover
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#64ffda]/10 text-[#64ffda]">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-[#ccd6f6] group-hover/live:text-[#64ffda] transition-colors">
                        Launch Live Application
                      </h4>
                      <p className="text-xs text-[#8892b0]">
                        Explore the interactive deployed experience
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#112240] text-[#64ffda] border border-white/5 transition-transform duration-300 group-hover/live:translate-x-1 group-hover/live:border-[#64ffda]/30">
                    <span className="text-sm font-mono">→</span>
                  </div>
                </a>
              )}

              {/* Case Study Image Gallery */}
              {"images" in project.caseStudy && project.caseStudy.images && (project.caseStudy.images as readonly string[]).length > 0 && (
                <div className="mt-8">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#64ffda] mb-3">
                    Project Screenshots
                  </h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x snap-mandatory">
                    {(project.caseStudy.images as readonly string[]).map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-video w-[280px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#112240] snap-start transition duration-300 hover:border-[#64ffda]/30 sm:w-[360px]"
                      >
                        <img
                          src={img}
                          alt={`${project.title} Screenshot ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid or flex list of case study sections */}
              <div className="mt-10 space-y-8">
                {/* 1. The Problem */}
                <div className="group relative rounded-xl border border-white/5 bg-[#112240]/25 p-5 transition hover:border-[#f43f5e]/30 hover:bg-[#112240]/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f43f5e]/10 text-[#f43f5e]">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-[#f43f5e]">
                      The Problem
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#8892b0]">
                    {project.caseStudy.problem}
                  </p>
                </div>

                {/* 2. The Approach */}
                <div className="group relative rounded-xl border border-white/5 bg-[#112240]/25 p-5 transition hover:border-[#0ea5e9]/30 hover:bg-[#112240]/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9]">
                      <Compass className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-[#0ea5e9]">
                      The Approach
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#8892b0]">
                    {project.caseStudy.approach}
                  </p>
                </div>

                {/* 3. What Was Built */}
                <div className="group relative rounded-xl border border-white/5 bg-[#112240]/25 p-5 transition hover:border-[#a855f7]/30 hover:bg-[#112240]/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a855f7]/10 text-[#a855f7]">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-[#a855f7]">
                      What Was Built
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#8892b0]">
                    {project.caseStudy.built}
                  </p>
                </div>

                {/* 4. The Result */}
                <div className="group relative rounded-xl border border-white/5 bg-[#112240]/25 p-5 transition hover:border-[#10b981]/30 hover:bg-[#112240]/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-[#10b981]">
                      The Result
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#8892b0]">
                    {project.caseStudy.result}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links Section Footer */}
            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[#112240] px-4 py-2.5 text-sm font-medium text-[#ccd6f6] border border-white/5 transition hover:border-[#64ffda]/30 hover:text-[#64ffda]"
                data-cursor-hover
              >
                <SiGithub className="h-4 w-4" />
                <span>Source Code</span>
              </a>
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-[#64ffda] px-4 py-2.5 text-sm font-medium text-[#0a0f1e] transition hover:bg-[#64ffda]/80"
                  data-cursor-hover
                >
                  <span>Launch Demo</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="text-xs font-mono text-[#8892b0]">
                  Private Repository Demo
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
