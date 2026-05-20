"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";

export function Projects() {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false });

  return (
    <section id="projects" className="px-6 py-24 lg:px-12" aria-labelledby="projects-heading">
      <SectionHeading number="03" title="Projects" />

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

      <div className="overflow-hidden lg:hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {projects.map((project) => (
            <div key={project.id} className="min-w-[85vw] shrink-0 sm:min-w-[70vw]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
