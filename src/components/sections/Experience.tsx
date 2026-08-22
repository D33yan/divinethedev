"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { usePortfolioData } from "@/components/providers/PortfolioDataContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  const { experiences } = usePortfolioData();
  const [active, setActive] = useState<string>(experiences[0]?.id || "");
  
  // Update active state if experiences list shifts or changes
  const activeId = experiences.some(e => e.id === active) ? active : (experiences[0]?.id || "");
  const current = experiences.find((e) => e.id === activeId) ?? experiences[0];

  if (!current) return null;

  return (
    <section id="experience" className="px-6 py-24 lg:px-12" aria-labelledby="experience-heading">
      <SectionHeading number="02" title="Experience" />
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-row gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible" role="tablist">
          {experiences.map((exp) => (
            <button
              key={exp.id}
              type="button"
              role="tab"
              aria-selected={active === exp.id}
              onClick={() => setActive(exp.id)}
              className={`min-h-[44px] shrink-0 border-l-2 px-4 py-3 text-left font-mono text-sm transition ${
                active === exp.id
                  ? "border-[#64ffda] bg-[#64ffda]/5 text-[#64ffda]"
                  : "border-transparent text-[#8892b0] hover:border-[#64ffda]/40 hover:text-[#ccd6f6]"
              }`}
            >
              {exp.company}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            role="tabpanel"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-xl p-6 md:p-8"
          >
            <h3 className="text-xl font-semibold text-[#ccd6f6]">
              {current.role}{" "}
              <span className="text-[#64ffda]">@ {current.company}</span>
            </h3>
            <p className="mt-2 font-mono text-sm text-[#8892b0]">
              {current.period} · {current.location}
            </p>
            
            {/* Role-specific Tech stack pills */}
            {current.tech && (
              <div className="mt-4 flex flex-wrap gap-2">
                {current.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#64ffda]/10 px-3 py-1 font-mono text-[10px] text-[#64ffda] border border-[#64ffda]/20 shadow-[0_0_10px_rgba(100,255,218,0.05)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <ul className="mt-6 space-y-3">
              {current.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[#8892b0]">
                  <span className="mt-1.5 text-[#64ffda]" aria-hidden>
                    ▹
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
