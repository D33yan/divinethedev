"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { siteConfig, techPills } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { usePortfolioData } from "@/components/providers/PortfolioDataContext";

export function About() {
  const { avatar1Url, avatar2Url, aboutBio } = usePortfolioData();
  const [profileImg, setProfileImg] = useState<1 | 2>(1);

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
          <p className="text-lg leading-relaxed text-[#8892b0]">{aboutBio || siteConfig.aboutBio}</p>
          <div className="mt-10 flex flex-wrap gap-2">
            {techPills.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, borderColor: "rgba(100,255,218,0.5)" }}
                className="rounded-full border border-white/10 bg-navy-light/60 px-3 py-1.5 font-mono text-xs text-[#ccd6f6] transition-colors hover:text-[#64ffda]"
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
          
          <div 
            onClick={() => setProfileImg(prev => prev === 1 ? 2 : 1)}
            className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-navy-light cursor-pointer group shadow-xl"
            title="Click to toggle profile picture"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={profileImg}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full"
              >
                <img
                  src={profileImg === 1 ? avatar1Url : avatar2Url}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </motion.div>
            </AnimatePresence>

            {/* Glowing Corner Badge controller */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfileImg(prev => prev === 1 ? 2 : 1);
              }}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-3 py-1.5 font-mono text-[9px] text-[#ccd6f6] backdrop-blur-md transition-colors hover:border-[#64ffda] hover:text-[#64ffda] cursor-pointer shadow-lg select-none"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#64ffda] animate-pulse" />
              SWAP IMG
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
