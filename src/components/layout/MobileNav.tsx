"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navSections, siteConfig, themeConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/effects/ThemeToggle";
import { playClick } from "@/lib/audio";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const enabledSections = [
    { id: "hero", label: "Home" },
    ...themeConfig.sectionsOrder
      .map((id) => navSections.find((sec) => sec.id === id))
      .filter((sec): sec is typeof navSections[number] => {
        if (!sec) return false;
        if (sec.id === "workflows" && !themeConfig.enableWorkflows) return false;
        if (sec.id === "services" && !themeConfig.enableServices) return false;
        if (sec.id === "testimonials" && !themeConfig.enableTestimonials) return false;
        return true;
      })
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLinkClick = () => {
    playClick();
    setOpen(false);
  };

  const handleToggleClick = () => {
    playClick();
    setOpen((o) => !o);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#070b14]/90 px-5 py-4 backdrop-blur-xl lg:hidden">
      <Link href="#hero" className="flex items-center" onClick={handleLinkClick}>
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={36}
          height={36}
          className="rounded-full object-cover border border-[#64ffda]/30 shadow-[0_0_10px_rgba(100,255,218,0.15)]"
          priority
        />
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#64ffda] cursor-pointer"
          onClick={handleToggleClick}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay for tap-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClick();
                setOpen(false);
              }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden h-screen"
            />

            {/* Premium Slide-over Side Drawer Menu */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 bottom-0 z-40 flex w-[280px] sm:w-[320px] h-screen flex-col bg-[#070b14]/95 border-l border-white/10 px-8 py-24 shadow-2xl backdrop-blur-2xl lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="mb-8 border-b border-white/5 pb-4 text-left">
                <p className="font-mono text-xs text-[#64ffda]">{siteConfig.alias} // CLI_MENU</p>
                <p className="text-lg font-bold text-[#ccd6f6] mt-1">{siteConfig.name}</p>
              </div>
              <ul className="space-y-5 text-left">
                {enabledSections.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={`#${item.id}`}
                      className="text-lg font-semibold text-[#ccd6f6] hover:text-[#64ffda] transition flex items-center gap-2"
                      onClick={handleLinkClick}
                    >
                      <span className="font-mono text-xs text-[#64ffda]">0{i + 1}.</span> {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
