"use client";

import { motion, useMotionTemplate } from "framer-motion";
import { useDebouncedMouse } from "@/hooks/useDebouncedMouse";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CursorSpotlight() {
  const { x, y } = useDebouncedMouse(16);
  const touch = useIsTouchDevice();
  const reduced = usePrefersReducedMotion();
  const background = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgba(100,255,218,0.07), transparent 60%)`;

  if (touch || reduced) return null;

  return (
    <motion.div
      className="no-touch-fx pointer-events-none fixed inset-0 z-[1]"
      style={{ background }}
      aria-hidden
    />
  );
}
