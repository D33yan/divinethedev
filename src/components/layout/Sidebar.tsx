"use client";

import { Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { navSections, siteConfig } from "@/lib/site";
import { Typewriter } from "@/components/ui/Typewriter";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Magnetic } from "@/components/ui/Magnetic";
import { ThemeToggle } from "@/components/effects/ThemeToggle";

export function Sidebar() {
  const active = useActiveSection();

  return (
    <aside
      className="fixed top-0 left-0 z-40 hidden h-screen w-[min(320px,28vw)] flex-col justify-between border-r border-white/10 bg-navy/95 px-8 py-12 backdrop-blur-xl lg:flex"
      aria-label="Site sidebar"
    >
      <div>
        <Link href="#hero" className="block group/logo">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={56}
            height={56}
            className="rounded-full object-cover border-2 border-[#64ffda]/30 shadow-[0_0_15px_rgba(100,255,218,0.15)] transition-transform duration-300 group-hover/logo:scale-105"
            priority
          />
          <p className="mt-4 font-mono text-sm text-[#64ffda]">

            <Typewriter phrases={siteConfig.typewriterRoles} />
          </p>
        </Link>
        <p className="mt-6 text-sm leading-relaxed text-[#8892b0]">{siteConfig.sidebarBio}</p>
      </div>

      <nav className="absolute top-1/2 right-6 flex -translate-y-1/2 flex-col gap-4" aria-label="Section navigation">
        {navSections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="group flex items-center justify-end gap-3"
            aria-label={section.label}
            aria-current={active === section.id ? "true" : undefined}
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-wider transition-opacity ${
                active === section.id ? "text-[#64ffda] opacity-100" : "text-[#8892b0] opacity-0 group-hover:opacity-100"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`h-2.5 w-2.5 rounded-full border transition-all ${
                active === section.id
                  ? "scale-125 border-[#64ffda] bg-[#64ffda]"
                  : "border-[#8892b0] bg-transparent group-hover:border-[#64ffda]"
              }`}
            />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Magnetic strength={0.4}>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 text-[#8892b0] transition hover:border-[#64ffda]/50 hover:text-[#64ffda]"
            aria-label="GitHub profile"
            data-cursor-hover
          >
            <SiGithub className="h-5 w-5" />
          </a>
        </Magnetic>
        <Magnetic strength={0.4}>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 text-[#8892b0] transition hover:border-[#64ffda]/50 hover:text-[#64ffda]"
            aria-label="LinkedIn profile"
            data-cursor-hover
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
        </Magnetic>
        <Magnetic strength={0.4}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 text-[#8892b0] transition hover:border-[#64ffda]/50 hover:text-[#64ffda]"
            aria-label="Send email"
            data-cursor-hover
          >
            <Mail className="h-5 w-5" />
          </a>
        </Magnetic>
      </div>
    </aside>
  );
}
