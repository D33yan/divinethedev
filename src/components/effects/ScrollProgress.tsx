"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 z-[10000] h-0.5 w-full origin-left bg-[#64ffda]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
