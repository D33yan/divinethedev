"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShow(v > 0.5);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-6 bottom-6 z-[100] flex h-12 w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#64ffda]/40 bg-[#112240]/90 text-[#64ffda] backdrop-blur-md transition hover:border-[#64ffda] hover:shadow-[0_0_20px_rgba(100,255,218,0.2)] md:right-10"
          aria-label="Back to top"
          data-cursor-hover
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
