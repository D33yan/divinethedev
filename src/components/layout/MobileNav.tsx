"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navSections, siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/effects/ThemeToggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/10 bg-navy/90 px-5 py-4 backdrop-blur-xl lg:hidden">
      <Link href="#hero" className="font-bold text-[#ccd6f6]" onClick={() => setOpen(false)}>
        Navie
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#64ffda]"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 top-0 z-40 flex flex-col justify-center bg-navy px-10"
            aria-label="Mobile navigation"
          >
            <div className="mb-8">
              <p className="font-mono text-sm text-[#64ffda]">{siteConfig.alias}</p>
              <p className="text-xl font-semibold text-[#ccd6f6]">{siteConfig.name}</p>
            </div>
            <ul className="space-y-6">
              {navSections.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={`#${item.id}`}
                    className="text-2xl font-medium text-[#ccd6f6] hover:text-[#64ffda]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-mono text-[#64ffda]">0{i + 1}.</span> {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
