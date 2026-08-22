"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, AlertCircle, Compass, Terminal, Trophy, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/components/providers/PortfolioDataContext";

interface CaseStudyModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image when project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project]);

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

  const handleLaunchDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (project.live) {
      window.dispatchEvent(new CustomEvent("open-project-browser", {
        detail: { url: project.live, title: project.title }
      }));
      onClose(); // Instantly close case study slide-over to reveal active sandbox!
    }
  };

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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="relative flex h-full w-full flex-col border-l border-white/10 bg-navy/95 backdrop-blur-2xl p-6 shadow-2xl sm:p-8 md:max-w-2xl"
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
                    className="rounded-full bg-navy-light/60 px-3 py-1 font-mono text-xs text-[#8892b0] border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Connection to Live Link from the Case Study */}
              {project.live && (
                <button
                  onClick={handleLaunchDemo}
                  className="w-full text-left group/live mt-6 flex items-center justify-between rounded-xl border border-[#64ffda]/30 bg-[#64ffda]/5 p-4 transition duration-300 hover:bg-[#64ffda]/10 hover:border-[#64ffda]/50 cursor-pointer"
                  data-cursor-hover
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#64ffda]/10 text-[#64ffda]">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#ccd6f6] group-hover/live:text-[#64ffda] transition-colors">
                        Launch Live Application
                      </h4>
                      <p className="text-xs text-[#8892b0]">
                        Explore the interactive deployed experience
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-light text-[#64ffda] border border-white/5 transition-transform duration-300 group-hover/live:translate-x-1 group-hover/live:border-[#64ffda]/30">
                    <span className="text-sm font-mono">→</span>
                  </div>
                </button>
              )}

              {/* Case Study Image Gallery */}
              {/* Case Study Image Gallery */}
              {"images" in project.caseStudy && project.caseStudy.images && (project.caseStudy.images as readonly string[]).length > 0 && (() => {
                const images = project.caseStudy.images as readonly string[];
                const isMobile = project.tag.toLowerCase().includes("mobile") || project.id === "rebid";
                
                const handleNext = () => {
                  setActiveImageIndex((prev) => (prev + 1) % images.length);
                };
                const handlePrev = () => {
                  setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
                };

                return (
                  <div className="mt-8 relative group/slider">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#64ffda] mb-4">
                      Interactive Gallery ({activeImageIndex + 1} of {images.length})
                    </h4>
                    
                    {/* Main Mockup Container */}
                    <div className="relative flex items-center justify-center py-4 w-full">
                      {isMobile ? (
                        /* Mobile Mockup Device Frame */
                        <div className="relative mx-auto aspect-[9/16] w-[210px] sm:w-[230px] rounded-[36px] border-[6px] border-slate-700/90 bg-[#0c0e17] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/10 shrink-0">
                          {/* Smartphone Notch / Dynamic Island */}
                          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-16 rounded-full bg-slate-900 z-30 flex items-center justify-center border border-white/5">
                            <div className="w-1 h-1 rounded-full bg-blue-900/40 ml-auto mr-1.5" />
                          </div>
                          
                          {/* Smartphone Screen Inner Content */}
                          <div className="relative h-full w-full overflow-hidden bg-slate-950">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeImageIndex}
                                src={encodeURI(images[activeImageIndex])}
                                alt={`${project.title} Phone View ${activeImageIndex + 1}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.4}
                                onDragEnd={(e, info) => {
                                  const swipeThreshold = 50;
                                  if (info.offset.x > swipeThreshold) {
                                    handleNext();
                                  } else if (info.offset.x < -swipeThreshold) {
                                    handlePrev();
                                  }
                                }}
                                className="h-full w-full object-cover animate-none cursor-grab active:cursor-grabbing select-none"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </AnimatePresence>
                          </div>
                        </div>
                      ) : (
                        /* Desktop Browser Mockup Frame */
                        <div className="w-full rounded-xl border border-white/15 bg-[#0a192f]/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
                          {/* Browser Window Title Bar */}
                          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-navy-light/90 border-b border-white/10">
                            <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                            <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                            
                            {/* Browser Search Bar */}
                            <div className="mx-auto text-[9px] font-mono text-[#8892b0] truncate w-1/2 text-center bg-navy/60 py-0.5 px-3 rounded border border-white/5 select-none">
                              {project.live ? project.live.replace("https://", "") : `${project.title.toLowerCase()}.dev`}
                            </div>
                          </div>
                          
                          {/* Browser Screen Inner Content */}
                          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeImageIndex}
                                src={encodeURI(images[activeImageIndex])}
                                alt={`${project.title} Desktop View ${activeImageIndex + 1}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.4}
                                onDragEnd={(e, info) => {
                                  const swipeThreshold = 50;
                                  if (info.offset.x > swipeThreshold) {
                                    handleNext();
                                  } else if (info.offset.x < -swipeThreshold) {
                                    handlePrev();
                                  }
                                }}
                                className="h-full w-full object-cover animate-none cursor-grab active:cursor-grabbing select-none"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                      
                      {/* Left Navigation Arrow */}
                      {images.length > 1 && (
                        <button
                          onClick={handlePrev}
                          className="absolute left-1 sm:-left-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy/90 backdrop-blur-md text-[#ccd6f6] shadow-lg transition opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:text-[#64ffda] hover:border-[#64ffda] hover:scale-105 active:scale-95 cursor-pointer"
                          aria-label="Previous image"
                          data-cursor-hover
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                      )}
                      
                      {/* Right Navigation Arrow */}
                      {images.length > 1 && (
                        <button
                          onClick={handleNext}
                          className="absolute right-1 sm:-right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy/90 backdrop-blur-md text-[#ccd6f6] shadow-lg transition opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:text-[#64ffda] hover:border-[#64ffda] hover:scale-105 active:scale-95 cursor-pointer"
                          aria-label="Next image"
                          data-cursor-hover
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Indicator Dots */}
                    {images.length > 1 && (
                      <div className="mt-4 flex justify-center gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              idx === activeImageIndex ? "w-6 bg-[#64ffda]" : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                            data-cursor-hover
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Grid or flex list of case study sections */}
              <div className="mt-10 space-y-8">
                {/* 1. The Problem */}
                <div className="group relative rounded-xl border border-white/5 bg-navy-light/25 p-5 transition hover:border-[#f43f5e]/30 hover:bg-navy-light/40">
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
                <div className="group relative rounded-xl border border-white/5 bg-navy-light/25 p-5 transition hover:border-[#0ea5e9]/30 hover:bg-navy-light/40">
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
                <div className="group relative rounded-xl border border-white/5 bg-navy-light/25 p-5 transition hover:border-[#a855f7]/30 hover:bg-navy-light/40">
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
                <div className="group relative rounded-xl border border-white/5 bg-navy-light/25 p-5 transition hover:border-[#10b981]/30 hover:bg-navy-light/40">
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
                className="flex items-center gap-2 rounded-lg bg-navy-light px-4 py-2.5 text-sm font-medium text-[#ccd6f6] border border-white/5 transition hover:border-[#64ffda]/30 hover:text-[#64ffda]"
                data-cursor-hover
              >
                <SiGithub className="h-4 w-4" />
                <span>Source Code</span>
              </a>
              {project.live ? (
                <button
                  onClick={handleLaunchDemo}
                  className="flex items-center gap-2 rounded-lg bg-[#64ffda] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#64ffda]/80 cursor-pointer"
                  data-cursor-hover
                >
                  <span>Launch Demo</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
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
