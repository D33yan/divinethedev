"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24 lg:px-12" aria-labelledby="skills-heading">
      <SectionHeading number="04" title="Skills" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: gi * 0.05 }}
            className="shimmer-card glass-card rounded-xl p-5"
          >
            <h3 className="mb-4 font-mono text-sm text-[#64ffda]">{group.title}</h3>
            <ul className="space-y-2">
              {group.skills.map((skill) => (
                <li key={skill} className="text-sm text-[#8892b0] transition hover:text-[#ccd6f6]">
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
