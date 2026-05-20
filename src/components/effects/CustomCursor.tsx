"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useDebouncedMouse } from "@/hooks/useDebouncedMouse";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CustomCursor() {
  const { x, y } = useDebouncedMouse(12);
  const touch = useIsTouchDevice();
  const reduced = usePrefersReducedMotion();
  const [hovering, setHovering] = useState(false);

  const springConfig = { stiffness: 500, damping: 28 };
  const dotX = useSpring(x, springConfig);
  const dotY = useSpring(y, springConfig);
  const ringX = useSpring(x, { stiffness: 150, damping: 20 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (touch || reduced) return;
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-cursor-hover]"));
    };
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, [touch, reduced]);

  if (touch || reduced) return null;

  return (
    <motion.div className="no-touch-fx pointer-events-none fixed inset-0 z-[9998]" aria-hidden>
      <motion.div
        className="fixed top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#64ffda] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#64ffda] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          marginLeft: hovering ? -24 : -16,
          marginTop: hovering ? -24 : -16,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </motion.div>
  );
}
