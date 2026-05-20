"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SectionTitle({ id, children }: { id: string; children: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const chars = children.split("");

  return (
    <h2
      id={id}
      ref={ref}
      className="mb-12 text-4xl font-bold tracking-tight text-white md:text-5xl"
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </h2>
  );
}
