"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { certifications, education } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

function TimelineItem({
  title,
  org,
  period,
  delay,
}: {
  title: string;
  org: string;
  period: string;
  delay: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.4 }}
      className="relative py-4 pl-8 group"
    >
      {/* Pulsing Entry Dot (Hollow Ring design with Neon Glow Border) */}
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: delay + 0.1, type: "spring", stiffness: 150 }}
        className="absolute top-[22px] left-0 h-2 w-2 rounded-full bg-navy border-2 border-accent shadow-[0_0_8px_var(--color-accent)] z-10 transition-transform duration-300 group-hover:scale-130"
        aria-hidden
      />
      <h3 className="font-semibold text-text-primary transition-colors duration-300 group-hover:text-accent">
        {title}
      </h3>
      <p className="font-mono text-sm text-accent">{org}</p>
      <p className="mt-1 text-sm text-text-secondary">{period}</p>
    </motion.li>
  );
}

function TimelineList({ items }: { items: readonly { title: string; org: string; period: string }[] }) {
  const containerRef = useRef<HTMLUListElement>(null);
  
  // Track scroll progress of the list relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  // Smooth spring physics for fluid movement
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <ul ref={containerRef} className="relative pl-0 list-none my-0">
      {/* Faint background track guide rail */}
      <div 
        className="absolute left-[3px] top-4 bottom-4 w-[2px] bg-navy-lighter rounded-full" 
        aria-hidden 
      />
      
      {/* Dynamic Glowing Progress Line (Scales smoothly with scroll) */}
      <motion.div
        style={{ scaleY }}
        className="absolute left-[3px] top-4 bottom-4 w-[2px] origin-top bg-gradient-to-b from-accent to-accent/40 shadow-[0_0_10px_var(--color-accent)] rounded-full"
        aria-hidden
      />

      {items.map((item, i) => (
        <TimelineItem
          key={item.title}
          title={item.title}
          org={item.org}
          period={item.period}
          delay={i * 0.08}
        />
      ))}
    </ul>
  );
}

export function Education() {
  return (
    <section id="education" className="px-6 py-24 lg:px-12" aria-labelledby="education-heading">
      <SectionHeading number="05" title="Education" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-text-secondary border-b border-navy-lighter pb-2">
            Education
          </h3>
          <TimelineList items={education} />
        </div>
        <div>
          <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-text-secondary border-b border-navy-lighter pb-2">
            Certifications
          </h3>
          <TimelineList items={certifications} />
        </div>
      </div>
    </section>
  );
}
