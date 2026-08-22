"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/components/providers/PortfolioDataContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { playHover } from "@/lib/audio";
import { 
  SiJavascript, SiTypescript, SiPython, SiPhp,
  SiNextdotjs, SiReact, SiHtml5,
  SiNodedotjs, SiLaravel, SiScikitlearn, SiNumpy,
  SiZapier, SiFigma, SiWordpress, SiWix, SiBrevo, SiN8N,
  SiTailwindcss, SiFramer, SiExpress, SiSupabase, SiFirebase,
  SiTensorflow, SiPandas, SiHubspot, SiTelegram
} from "react-icons/si";
import { FaDatabase, FaCheckSquare } from "react-icons/fa";
import { 
  TbBinaryTree, 
  TbChartFunnel, 
  TbTargetArrow,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobeAfterEffect,
  TbBrandAdobeXd,
  TbFilter
} from "react-icons/tb";

// Dictionary mapping skill names to vector icons and authentic brand colors
const SKILL_ICONS: Record<string, { icon: any; color: string }> = {
  // Languages
  "javascript": { icon: SiJavascript, color: "#F7DF1E" },
  "typescript": { icon: SiTypescript, color: "#3178C6" },
  "python": { icon: SiPython, color: "#3776AB" },
  "php": { icon: SiPhp, color: "#777BB4" },
  
  // Frontend
  "next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
  "react native": { icon: SiReact, color: "#61DAFB" },
  "html/css": { icon: SiHtml5, color: "#E34F26" },
  "tailwind css": { icon: SiTailwindcss, color: "#06B6D4" },
  "shadcn/ui": { icon: SiReact, color: "#FFFFFF" },
  "framer motion": { icon: SiFramer, color: "#0055FF" },
  
  // Backend
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  "express.js": { icon: SiExpress, color: "#FFFFFF" },
  "laravel": { icon: SiLaravel, color: "#FF2D20" },
  "supabase": { icon: SiSupabase, color: "#3ECF8E" },
  "firebase": { icon: SiFirebase, color: "#FFCA28" },
  
  // AI & ML
  "tensorflow": { icon: SiTensorflow, color: "#FF6F00" },
  "scikit-learn": { icon: SiScikitlearn, color: "#F7931E" },
  "numpy": { icon: SiNumpy, color: "#013243" },
  "pandas": { icon: SiPandas, color: "#150458" },
  "matplotlib": { icon: TbBinaryTree, color: "#11557C" },
  "data cleaning": { icon: FaDatabase, color: "#00b0ff" },
  
  // Automation
  "n8n": { icon: SiN8N, color: "#FF6C37" },
  "zapier": { icon: SiZapier, color: "#FF4F00" },
  "make.com": { icon: TbBinaryTree, color: "#E03E2F" },
  
  // Design
  "figma": { icon: SiFigma, color: "#F24E1E" },
  "photoshop": { icon: TbBrandAdobePhotoshop, color: "#31A8FF" },
  "illustrator": { icon: TbBrandAdobeIllustrator, color: "#FF9A00" },
  "after effects": { icon: TbBrandAdobeAfterEffect, color: "#9999FF" },
  
  // Platforms
  "wordpress": { icon: SiWordpress, color: "#21759B" },
  "wix": { icon: SiWix, color: "#0C7BEE" },
  "go high level": { icon: TbChartFunnel, color: "#1a73e8" },
  "hubspot crm": { icon: SiHubspot, color: "#FF7A59" },
  "telegram api": { icon: SiTelegram, color: "#26A5E4" },
  "brevo": { icon: SiBrevo, color: "#00E676" },
  
  // Other
  "ui/ux principles": { icon: TbBrandAdobeXd, color: "#FF61F6" },
  "funnel design": { icon: TbFilter, color: "#ffab00" },
  "lead generation": { icon: TbTargetArrow, color: "#00e5ff" },
};

function getSkillIcon(skillName: string) {
  const key = skillName.toLowerCase().trim();
  
  // Smart substring-based checks to match formatted variations (e.g. Next.js 15)
  if (key.includes("next.js")) return SKILL_ICONS["next.js"];
  if (key.includes("html") || key.includes("css")) return SKILL_ICONS["html/css"];
  
  return SKILL_ICONS[key] || { icon: FaCheckSquare, color: "#64ffda" };
}

export function Skills() {
  const { skillGroups } = usePortfolioData();

  return (
    <section id="skills" className="px-6 py-24 lg:px-12" aria-labelledby="skills-heading">
      <SectionHeading number="04" title="Skills" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: gi * 0.05 }}
            className="shimmer-card glass-card rounded-xl p-5 border border-white/5 flex flex-col justify-between"
          >
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-[#64ffda] border-b border-white/5 pb-2">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const iconData = getSkillIcon(skill);
                  const IconComponent = iconData.icon;
                  
                  return (
                    <motion.div
                      key={skill}
                      whileHover={{ scale: 1.03 }}
                      style={{ "--hover-color": iconData.color } as React.CSSProperties}
                      className="group flex items-center gap-2 rounded-lg border border-white/5 bg-navy-light/40 px-3 py-1.5 transition-all duration-300 hover:bg-navy-light/80 hover:border-[#64ffda]/30 cursor-default"
                      onMouseEnter={() => {
                        window.dispatchEvent(new CustomEvent("highlight-skill", { detail: skill }));
                        playHover();
                      }}
                      onMouseLeave={() => {
                        window.dispatchEvent(new CustomEvent("highlight-skill", { detail: null }));
                      }}
                    >
                      <IconComponent
                        className="h-4 w-4 text-[#8892b0] transition-colors duration-300 group-hover:text-[var(--hover-color)] group-hover:drop-shadow-[0_0_6px_var(--hover-color)]"
                      />
                      <span className="font-mono text-xs text-[#8892b0] transition-colors duration-300 group-hover:text-[#ccd6f6]">
                        {skill}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
