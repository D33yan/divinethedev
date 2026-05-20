"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { Typewriter } from "@/components/ui/Typewriter";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center px-6 pt-24 pb-20 lg:px-12 lg:pt-0"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(100,255,218,0.12)_0%,transparent_70%)] blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(100,255,218,0.08)_0%,transparent_70%)] blur-3xl"
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-3xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-4 font-mono text-[#64ffda]">Hi, my name is</p>
        <h1
          id="hero-heading"
          className="mb-4 text-[clamp(2rem,5vw,4rem)] font-bold leading-tight tracking-tight text-[#ccd6f6]"
        >
          Divine — they call me <span className="text-[#64ffda]">Navie</span>.
        </h1>
        <p className="mb-2 text-[clamp(1.25rem,3vw,2rem)] font-semibold text-[#8892b0]">
          I&apos;m a{" "}
          <Typewriter phrases={siteConfig.typewriterRoles} className="text-[#ccd6f6]" />.
        </p>
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-[#8892b0]">
          {siteConfig.currentRole}. Building web apps, mobile experiences, and AI-powered tools from{" "}
          {siteConfig.location}.
        </p>

        <div className="flex flex-wrap gap-4">
          <Magnetic>
            <Link
              href="#projects"
              className="inline-flex min-h-[44px] items-center rounded border border-[#64ffda] bg-[#64ffda]/10 px-6 py-3 font-mono text-sm text-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.15)] transition hover:bg-[#64ffda]/20"
              data-cursor-hover
            >
              View My Work
            </Link>
          </Magnetic>
          <Magnetic>
            <a
              href={siteConfig.resumePath}
              download
              className="inline-flex min-h-[44px] items-center rounded border border-[#64ffda]/50 px-6 py-3 font-mono text-sm text-[#ccd6f6] transition hover:border-[#64ffda] hover:text-[#64ffda]"
              data-cursor-hover
            >
              Download Resume
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
