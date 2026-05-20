"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.04) 0%, transparent 70%)`;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const mq = window.matchMedia("(hover: hover)");
    if (!mq.matches) return;
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] hidden mix-blend-screen md:block"
      style={{ background }}
      aria-hidden
    />
  );
}
