"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Download, Mail, Phone, Globe, 
  Briefcase, GraduationCap, Award, Cpu, FileText, CheckCircle2 
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { siteConfig, experiences, projects } from "@/lib/site";
import { playGlitch, playSuccess } from "@/lib/audio";

export function ResumeViewerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      playGlitch();
    };

    window.addEventListener("open-resume-viewer", handleOpen);
    return () => {
      window.removeEventListener("open-resume-viewer", handleOpen);
    };
  }, []);

  // Lock body scroll when overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard escape shortcut to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        playGlitch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    playGlitch();
  };

  const handleDownload = () => {
    playSuccess();
    const link = document.createElement("a");
    link.href = siteConfig.resumePath;
    link.download = "Divine_Nnaji_CV.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 220 }}
            className="relative flex h-full w-full flex-col border-l border-white/10 bg-[#060814]/95 backdrop-blur-2xl p-5 shadow-2xl sm:p-8 md:max-w-3xl"
          >
            {/* Elegant Header Title Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#64ffda] shadow-[0_0_8px_#64ffda] animate-pulse" />
                <span className="font-mono text-xs text-[#64ffda] uppercase tracking-wider">
                  document_viewer // professional_cv.html
                </span>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-[#8892b0] transition hover:bg-white/5 hover:text-[#64ffda] cursor-pointer"
                aria-label="Close CV Viewer"
                data-cursor-hover
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Viewport Wrapper */}
            <div className="flex-1 overflow-hidden my-6 rounded-xl border border-white/10 bg-[#070b19] shadow-inner flex flex-col">
              {/* macOS-style document header tab chrome */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-navy-light/95 border-b border-white/5 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] font-mono text-[#ccd6f6] tracking-wide truncate max-w-[240px]">
                  Divine_Nnaji_CV.html
                </span>
                <span className="text-[9px] font-mono text-[#8892b0]/60 hidden sm:inline uppercase">
                  interactive // select_enabled
                </span>
              </div>

              {/* Native Premium HTML CV Dashboard (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent text-left select-text bg-[#030611] space-y-8 font-sans">
                
                {/* 1. Header Information */}
                <div className="border-b border-white/5 pb-6 text-center sm:text-left">
                  <span className="font-mono text-[9px] tracking-widest text-[#64ffda] uppercase block mb-1">
                    [SEC-00] // PRINCIPAL_IDENTITY
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ccd6f6] tracking-tight uppercase">
                    {siteConfig.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-[#00e5ff] tracking-wide mt-1 font-semibold">
                    {siteConfig.title}
                  </p>
                  
                  {/* Contact Links */}
                  <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2.5 text-xs text-[#8892b0]">
                    <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 hover:text-[#64ffda] transition" data-cursor-hover>
                      <Mail className="h-3.5 w-3.5 text-[#64ffda]" />
                      <span>{siteConfig.email}</span>
                    </a>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#64ffda]" />
                      <span>+234 810 689 0380</span>
                    </span>
                    <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#64ffda] transition" data-cursor-hover>
                      <SiGithub className="h-3.5 w-3.5 text-[#64ffda]" />
                      <span>github.com/{siteConfig.githubHandle}</span>
                    </a>
                    <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#64ffda] transition" data-cursor-hover>
                      <FaLinkedin className="h-3.5 w-3.5 text-[#64ffda]" />
                      <span>linkedin.com/in/divine-nnaji</span>
                    </a>
                    <a href={siteConfig.liveSite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#64ffda] transition" data-cursor-hover>
                      <Globe className="h-3.5 w-3.5 text-[#64ffda]" />
                      <span>{siteConfig.liveSite.replace("https://", "")}</span>
                    </a>
                  </div>
                </div>

                {/* 2. Professional Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-[#64ffda]" />
                    <h2 className="font-mono text-xs tracking-wider text-[#64ffda] uppercase font-bold">
                      [SEC-01] // PROFESSIONAL SUMMARY
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-[#8892b0] bg-white/3 border border-white/5 rounded-xl p-4 sm:p-5 backdrop-blur-md">
                    Dynamic, results-driven Fullstack Software Engineer and AI Builder with 3 years of hands-on experience
                    delivering high-performance web applications, native mobile experiences, and advanced workflow automation pipelines.
                    Adept at bridging the gap between complex mathematical systems and sleek, responsive UI/UX designs.
                    Expertly leverages Next.js, React Native, Supabase, Express.js, n8n, and Python to automate operations,
                    reduce system latency, and engineer premium consumer products.
                  </p>
                </div>

                {/* 3. Technical Skills Matrix */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="h-4 w-4 text-[#64ffda]" />
                    <h2 className="font-mono text-xs tracking-wider text-[#64ffda] uppercase font-bold">
                      [SEC-02] // TECHNICAL SKILLS MATRIX
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { category: "Languages", skills: ["JavaScript (ES6+)", "TypeScript", "Python", "PHP", "HTML5", "CSS3", "SQL"] },
                      { category: "Frontend & Mobile", skills: ["React Native", "Expo", "Next.js (App Router)", "React.js", "Tailwind CSS", "shadcn/ui", "Figma"] },
                      { category: "Backend & Database", skills: ["Node.js", "Express.js", "Supabase", "PostgreSQL", "Laravel", "Firebase", "Firestore", "REST APIs", "WebSockets"] },
                      { category: "AI, ML & Data Science", skills: ["Scikit-learn", "NumPy", "Matplotlib", "Pandas", "Exploratory Data Analysis (EDA)", "Data Preprocessing & Modeling"] },
                      { category: "Automation & CRM", skills: ["n8n", "Zapier", "Make.com", "GoHighLevel CRM", "Webhook Listeners", "Automation Funnels"] },
                      { category: "Platforms & DevOps", skills: ["Git / GitHub", "CI/CD pipelines", "WordPress", "Wix", "Vercel", "Brevo", "Linux Systems"] }
                    ].map((group, index) => (
                      <div key={index} className="bg-white/3 border border-white/5 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                        <h3 className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-wider mb-2 border-b border-white/5 pb-1">
                          {group.category}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {group.skills.map((skill, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="rounded bg-white/5 border border-white/5 px-2 py-0.5 font-mono text-[10px] text-[#ccd6f6] hover:border-[#64ffda]/30 hover:text-[#64ffda] transition"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Professional Experience Timeline */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-4 w-4 text-[#64ffda]" />
                    <h2 className="font-mono text-xs tracking-wider text-[#64ffda] uppercase font-bold">
                      [SEC-03] // CHRONOLOGICAL EXPERIENCE
                    </h2>
                  </div>
                  
                  <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-6">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline node dot */}
                        <div className="absolute -left-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-[#070b19] border border-white/20 group-hover:border-[#64ffda] transition flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#64ffda] shadow-[0_0_8px_#64ffda]" />
                        </div>
                        
                        <div className="bg-white/3 border border-white/5 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(100,255,218,0.02)] transition">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3 className="text-base font-bold text-[#ccd6f6]">
                              {exp.role} <span className="text-[#64ffda]">@ {exp.company}</span>
                            </h3>
                            <span className="text-xs font-mono text-[#8892b0]">
                              {exp.period}
                            </span>
                          </div>
                          
                          <p className="text-xs font-mono text-[#8892b0]/60 mt-1 uppercase">
                            {exp.location}
                          </p>

                          {/* Bullet points */}
                          <ul className="mt-4 space-y-2">
                            {exp.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex gap-2 text-xs text-[#8892b0] leading-relaxed">
                                <span className="text-[#64ffda] shrink-0 mt-0.5">▸</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Tech stack tags */}
                          <div className="mt-4 pt-3 border-t border-dashed border-white/5 flex flex-wrap gap-1.5">
                            {exp.tech.map((techItem, tIdx) => (
                              <span key={tIdx} className="rounded-full bg-[#64ffda]/5 border border-[#64ffda]/15 px-2.5 py-0.5 font-mono text-[9px] text-[#64ffda]">
                                {techItem}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Selected Projects */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 text-[#64ffda]" />
                    <h2 className="font-mono text-xs tracking-wider text-[#64ffda] uppercase font-bold">
                      [SEC-04] // SELECTED REPRESENTATIVE PROJECTS
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {projects.slice(0, 3).map((proj, idx) => (
                      <div key={idx} className="bg-white/3 border border-white/5 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(100,255,218,0.02)] transition">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#ccd6f6]">
                            {proj.title}
                          </h3>
                          <span className="rounded bg-[#64ffda]/10 px-2 py-0.5 font-mono text-[9px] text-[#64ffda] border border-[#64ffda]/10">
                            {proj.tag}
                          </span>
                        </div>
                        
                        <p className="text-xs text-[#8892b0] mt-3 leading-relaxed">
                          {proj.caseStudy?.problem || proj.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[9px] font-mono font-bold text-[#00e5ff] uppercase mr-1">
                            ENGINEERING STACK:
                          </span>
                          {proj.tech.map((t, tIdx) => (
                            <span key={tIdx} className="font-mono text-[9px] text-[#8892b0]">
                              {t}{tIdx < proj.tech.length - 1 ? " //" : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Education & Certifications */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Education card */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="h-4 w-4 text-[#64ffda]" />
                      <h2 className="font-mono text-xs tracking-wider text-[#64ffda] uppercase font-bold">
                        [SEC-05] // ACADEMIC RECORD
                      </h2>
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-xl p-5 h-full">
                      <h3 className="text-sm font-bold text-[#ccd6f6]">
                        B.Sc. Computer Science
                      </h3>
                      <p className="text-xs text-[#64ffda] mt-1 font-mono">
                        University of Abuja
                      </p>
                      <p className="text-[10px] font-mono text-[#8892b0]/60 mt-1 uppercase">
                        Abuja, Nigeria // 2023 – Present
                      </p>
                    </div>
                  </div>

                  {/* Certifications card */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-[#64ffda]" />
                      <h2 className="font-mono text-xs tracking-wider text-[#64ffda] uppercase font-bold">
                        [SEC-06] // SYSTEM CERTIFICATIONS
                      </h2>
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-xl p-5 space-y-3">
                      {[
                        { title: "App Development Certificate", period: "July – Sept 2023" },
                        { title: "Fullstack Web Engineering Certificate", period: "Oct 2022 – Feb 2023" },
                        { title: "Python Programming Certificate", period: "May – June 2022" }
                      ].map((cert, certIdx) => (
                        <div key={certIdx} className="flex gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#64ffda] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#ccd6f6]">{cert.title}</p>
                            <p className="text-[10px] font-mono text-[#8892b0]/55 uppercase">{cert.period} // EarlyCode Training Institute</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Footer Action Controls */}
            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 shrink-0">
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2.5 font-mono text-xs font-semibold text-[#8892b0] transition hover:bg-white/5 hover:text-[#64ffda] cursor-pointer"
                data-cursor-hover
              >
                CLOSE_VIEWER
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg bg-[#64ffda] px-5 py-2.5 font-mono text-xs font-bold text-black transition hover:bg-[#64ffda]/80 cursor-pointer shadow-lg shadow-[#64ffda]/10 hover:shadow-[#64ffda]/25 active:scale-95"
                data-cursor-hover
              >
                <span>DOWNLOAD_OFFICIAL_PDF</span>
                <Download className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
