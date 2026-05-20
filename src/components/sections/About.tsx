"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig, techPills } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="px-6 py-24 lg:px-12" aria-labelledby="about-heading">
      <SectionHeading number="01" title="About Me" />
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg leading-relaxed text-[#8892b0]">{siteConfig.aboutBio}</p>
          <div className="mt-10 flex flex-wrap gap-2">
            {techPills.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, borderColor: "rgba(100,255,218,0.5)" }}
                className="rounded-full border border-white/10 bg-[#112240]/60 px-3 py-1.5 font-mono text-xs text-[#ccd6f6] transition-colors hover:text-[#64ffda]"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-sm"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute -inset-3 rotate-3 rounded-lg border-2 border-[#64ffda]/40" aria-hidden />
          <motion.div className="absolute -inset-3 -rotate-2 rounded-lg border border-white/10" aria-hidden />
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#112240]">
            <Image
              src="/profile.svg"
              alt="Divine Chibueze Nnaji"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
