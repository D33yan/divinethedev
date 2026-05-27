"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/lib/site";
import { CaseStudyModal } from "@/components/sections/CaseStudyModal";

type Project = (typeof projects)[number];

export function ProjectDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Motion value to track the X-drag coordinate of the front card
  const dragX = useMotionValue(0);
  
  // Maps the X displacement to organic rotation and opacity shifts
  const rotate = useTransform(dragX, [-200, 200], [-25, 25]);
  const opacity = useTransform(dragX, [-180, -100, 0, 100, 180], [0.6, 1, 1, 1, 0.6]);

  const cycleDeck = (direction: number) => {
    // Reset drag tracking motion value
    dragX.set(0);
    if (direction > 0) {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  // Keyboard navigation binds (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in Terminal shell input or textareas
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        cycleDeck(1);
      } else if (e.key === "ArrowLeft") {
        cycleDeck(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 120;
    if (info.offset.x > swipeThreshold) {
      cycleDeck(1);
    } else if (info.offset.x < -swipeThreshold) {
      cycleDeck(-1);
    }
  };

  const handleOpenCaseStudy = (project: Project) => {
    setActiveProject(project);
    setModalOpen(true);
  };

  const handleLaunchBrowser = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    if (project.live) {
      window.dispatchEvent(new CustomEvent("open-project-browser", {
        detail: { url: project.live, title: project.title }
      }));
    }
  };

  // Generate top 3 visible cards in depth order
  const visibleCards = [0, 1, 2].map((depth) => {
    const projectIdx = (currentIndex + depth) % projects.length;
    return {
      project: projects[projectIdx] as Project,
      depth,
    };
  });

  return (
    <div className="relative flex flex-col items-center justify-center py-6 w-full max-w-[92vw] sm:max-w-[480px] md:max-w-[500px] mx-auto">
      {/* Outer ambient cosmic stacked HUD outlines (matched to exact deck widths) */}
      <div className="absolute -top-4 h-full w-[104%] rounded-xl border border-dashed border-[#64ffda]/3 pointer-events-none" />
      <div className="absolute -top-2 h-full w-[102%] rounded-xl border border-dashed border-[#64ffda]/5 pointer-events-none" />

      {/* Cards stack layer with generous standardised heights to prevent overflows */}
      <div className="relative h-[360px] sm:h-[380px] md:h-[400px] w-full flex items-center justify-center select-none">
        <AnimatePresence initial={false}>
          {visibleCards.reverse().map(({ project, depth }) => {
            const isTop = depth === 0;

            // Stack spacing and displacement styling
            const scale = 1 - depth * 0.05;
            const yOffset = -depth * 16;
            const zIndex = 30 - depth * 10;
            const cardOpacity = 1 - depth * 0.35;

            return (
              <motion.article
                key={project.id}
                style={isTop ? { x: dragX, rotate, opacity, zIndex } : { zIndex }}
                animate={{
                  scale,
                  y: yOffset,
                  opacity: cardOpacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={isTop ? handleDragEnd : undefined}
                className={`glass-card absolute flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] ${
                  isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                }`}
              >
                {/* Visual HUD grid highlight corners */}
                {isTop && (
                  <>
                    <div className="absolute top-3 left-3 font-mono text-[8px] text-[#64ffda]/25 uppercase tracking-widest">
                      // CLI_CARD // ACTIVE
                    </div>
                    <div className="absolute bottom-3 right-3 font-mono text-[8px] text-[#64ffda]/25 uppercase tracking-widest">
                      SWIPE TO CYCLE
                    </div>
                  </>
                )}

                {/* Card Top: Tags, Badges & GitHub Links */}
                <div>
                  <div className="flex items-center justify-between h-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] sm:text-xs text-[#64ffda] uppercase tracking-wider">
                        {project.tag}
                      </span>
                      {project.badge && (
                        <span className="rounded bg-[#64ffda]/10 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-[#64ffda]">
                          {project.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Source Code launch */}
                    {isTop && project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8892b0] transition hover:text-[#64ffda] pointer-events-auto"
                        aria-label={`${project.title} on GitHub`}
                        data-cursor-hover
                      >
                        <SiGithub className="h-4 sm:h-5 w-4 sm:w-5" />
                      </a>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#ccd6f6] truncate">
                    {project.title}
                  </h3>

                  {/* Description: clamped strictly to a fixed height to guarantee visual symmetry across cards! */}
                  <div className="mt-2.5 h-[80px] sm:h-[96px] md:h-[105px] overflow-hidden">
                    <p className="text-xs sm:text-sm leading-relaxed text-[#8892b0] line-clamp-4">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Interactions & Technologies */}
                <div>
                  {/* Action buttons with standardized heights and touch margins */}
                  <div className="flex items-center gap-3 mb-4 h-8">
                    {project.caseStudy && isTop && (
                      <button
                        onClick={() => handleOpenCaseStudy(project)}
                        className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-[#64ffda] hover:underline cursor-pointer pointer-events-auto font-semibold"
                        data-cursor-hover
                      >
                        <span>Case Study</span>
                        <span className="text-[9px]">→</span>
                      </button>
                    )}

                    {project.live && isTop && (
                      <button
                        onClick={(e) => handleLaunchBrowser(e, project)}
                        className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-[#00e5ff] hover:underline cursor-pointer pointer-events-auto ml-auto font-semibold"
                        data-cursor-hover
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>

                  {/* Tech stack listing with clean height limits */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-white/5 pt-3.5 h-[34px] sm:h-[40px] overflow-hidden">
                    {project.tech.map((t) => (
                      <span key={t} className="font-mono text-[9px] sm:text-[10px] text-[#8892b0]/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Retro HUD Bottom Deck Controls (Standardized widths matching deck container) */}
      <div className="mt-6 flex items-center justify-between w-full px-4 shrink-0">
        {/* Previous Card button */}
        <button
          onClick={() => cycleDeck(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-[#8892b0] hover:text-[#64ffda] hover:bg-white/10 transition cursor-pointer shadow-md"
          data-cursor-hover
          title="Previous Project (ArrowLeft)"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Console Digital Card Readout */}
        <div className="font-mono text-[10px] sm:text-xs text-[#64ffda] tracking-widest uppercase font-bold">
          [ PROJECT {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} ]
        </div>

        {/* Next Card button */}
        <button
          onClick={() => cycleDeck(1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-[#8892b0] hover:text-[#64ffda] hover:bg-white/10 transition cursor-pointer shadow-md"
          data-cursor-hover
          title="Next Project (ArrowRight)"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Floating global drawer Case Study Modal */}
      {activeProject && (
        <CaseStudyModal
          project={activeProject}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
