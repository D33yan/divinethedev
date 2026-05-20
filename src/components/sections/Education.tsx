"use client";

import { motion } from "framer-motion";
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
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative border-l-2 border-[#64ffda]/40 py-4 pl-8"
    >
      <span className="absolute top-6 -left-[5px] h-2 w-2 rounded-full bg-[#64ffda]" aria-hidden />
      <h3 className="font-semibold text-[#ccd6f6]">{title}</h3>
      <p className="font-mono text-sm text-[#64ffda]">{org}</p>
      <p className="mt-1 text-sm text-[#8892b0]">{period}</p>
    </motion.li>
  );
}

export function Education() {
  return (
    <section id="education" className="px-6 py-24 lg:px-12" aria-labelledby="education-heading">
      <SectionHeading number="05" title="Education" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-[#8892b0]">Education</h3>
          <ul>
            {education.map((item, i) => (
              <TimelineItem
                key={item.title}
                title={item.title}
                org={item.org}
                period={item.period}
                delay={i * 0.08}
              />
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-[#8892b0]">
            Certifications
          </h3>
          <ul>
            {certifications.map((item, i) => (
              <TimelineItem
                key={item.title}
                title={item.title}
                org={item.org}
                period={item.period}
                delay={i * 0.08}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
