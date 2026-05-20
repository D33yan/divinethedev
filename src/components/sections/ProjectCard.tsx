"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import { useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { CaseStudyModal } from "@/components/sections/CaseStudyModal";
import type { projects } from "@/lib/site";

type Project = (typeof projects)[number];

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouchDevice();
  const [isOpen, setIsOpen] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  function onMove(e: React.MouseEvent) {
    if (touch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <>
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={
          touch
            ? undefined
            : { rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }
        }
        className="glass-card shimmer-card group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl p-6 transition-shadow hover:shadow-[0_0_40px_rgba(100,255,218,0.08)]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#64ffda]/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-[#64ffda]">{project.tag}</span>
              {project.badge && (
                <span className="ml-2 rounded bg-[#64ffda]/15 px-2 py-0.5 font-mono text-xs text-[#64ffda]">
                  {project.badge}
                </span>
              )}
              <h3 className="mt-2 text-xl font-semibold text-[#ccd6f6]">{project.title}</h3>
            </div>
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8892b0] transition hover:text-[#64ffda]"
              aria-label={`${project.title} on GitHub`}
              data-cursor-hover
            >
              <SiGithub className="h-5 w-5" />
            </Link>
          </div>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-[#8892b0]">{project.description}</p>
          
          {project.caseStudy && (
            <button
              onClick={() => setIsOpen(true)}
              className="mb-5 self-start flex items-center gap-1.5 font-mono text-xs text-[#64ffda] hover:underline"
              data-cursor-hover
            >
              <span>Read Case Study</span>
              <span className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          )}

          <div className="flex flex-wrap gap-3">
            {project.tech.map((t) => (
              <span key={t} className="font-mono text-xs text-[#8892b0]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.article>

      {project.caseStudy && (
        <CaseStudyModal
          project={project}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
