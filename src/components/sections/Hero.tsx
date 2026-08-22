"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { Typewriter } from "@/components/ui/Typewriter";
import { FuturisticGlobe } from "@/components/ui/FuturisticGlobe";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center px-6 pt-24 pb-20 lg:px-12 lg:pt-0 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background radial gradient glow highlights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(100,255,218,0.08)_0%,transparent_70%)] blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(100,255,218,0.05)_0%,transparent_70%)] blur-3xl"
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Futuristic Background Globe Layer (Interactive on desktop, ambient on mobile) */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[50vw] h-[100%] max-h-[850px] max-w-[850px] z-0 overflow-hidden opacity-30 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
        aria-hidden="true"
      >
        <FuturisticGlobe />
      </div>

      {/* Foreground Content Layer */}
      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          className="max-w-2xl lg:max-w-3xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 font-mono text-[#64ffda] tracking-wide">Hi, my name is</p>
          <h1
            id="hero-heading"
            className="mb-4 text-[clamp(2.75rem,8vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#ccd6f6]"
            suppressHydrationWarning
          >
            {siteConfig.shortName} — they call me <span className="text-[#64ffda] glow-text">{siteConfig.alias}</span>.
          </h1>
          <p className="mb-3 text-[clamp(1.45rem,4vw,2.25rem)] font-semibold text-[#8892b0]">
            I&apos;m a{" "}
            <Typewriter phrases={siteConfig.typewriterRoles} className="text-[#ccd6f6]" />.
          </p>
          <p className="mb-10 max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-[#8892b0]">
            {siteConfig.sidebarBio}
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
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-resume-viewer"));
                }}
                className="inline-flex min-h-[44px] items-center rounded border border-[#64ffda]/50 px-6 py-3 font-mono text-sm text-[#ccd6f6] transition hover:border-[#64ffda] hover:text-[#64ffda] cursor-pointer"
                data-cursor-hover
              >
                Download Resume
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("focus-terminal-chat"));
                }}
                className="inline-flex min-h-[44px] items-center rounded border border-[#64ffda]/50 px-6 py-3 font-mono text-sm text-[#ccd6f6] transition hover:border-[#64ffda] hover:text-[#64ffda] cursor-pointer bg-[#64ffda]/5"
                data-cursor-hover
              >
                Chat with AI
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


