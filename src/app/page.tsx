"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { CursorSpotlight } from "@/components/effects/CursorSpotlight";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { BackToTop } from "@/components/effects/BackToTop";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { BuiltInBrowser } from "@/components/ui/BuiltInBrowser";
import { PortfolioDataProvider } from "@/components/providers/PortfolioDataContext";
import { themeConfig } from "@/lib/site";

// 1. Server-side placeholder (solid black full-screen overlay to block initial view and prevent flashes)
function LoaderPlaceholder() {
  return <div className="fixed inset-0 z-[9999] bg-black" />;
}

// 2. Dynamic client-side only loading animation to completely bypass SSR execution
const LoaderEntrance = dynamic(
  () => import("@/components/effects/LoaderEntrance").then((m) => m.LoaderEntrance),
  { ssr: false, loading: () => <LoaderPlaceholder /> }
);

const About = dynamic(() => import("@/components/sections/About").then((m) => m.About));
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((m) => m.Experience)
);
const Projects = dynamic(() => import("@/components/sections/Projects").then((m) => m.Projects));
const Workflows = dynamic(() => import("@/components/sections/Workflows").then((m) => m.Workflows));
const Skills = dynamic(() => import("@/components/sections/Skills").then((m) => m.Skills));
const Education = dynamic(() => import("@/components/sections/Education").then((m) => m.Education));
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => m.Contact));
const Services = dynamic(() => import("@/components/sections/Services").then((m) => m.Services));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then((m) => m.Testimonials));

const sectionRegistry: Record<string, React.ComponentType> = {
  about: About,
  services: Services,
  experience: Experience,
  projects: Projects,
  workflows: Workflows,
  skills: Skills,
  education: Education,
  testimonials: Testimonials,
  contact: Contact,
};

const TelemetryHUD = dynamic(
  () => import("@/components/ui/TelemetryHUD").then((m) => m.TelemetryHUD),
  { ssr: false }
);

const ResumeViewerModal = dynamic(
  () => import("@/components/sections/ResumeViewerModal").then((m) => m.ResumeViewerModal),
  { ssr: false }
);

function SectionFallback() {
  return <div className="min-h-[40vh]" aria-hidden />;
}

export default function Home() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  // Restore saved accent color theme on mount client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedTheme = localStorage.getItem("navie-accent-theme");
      if (cachedTheme) {
        const themes: Record<string, string> = {
          teal: "100, 255, 218",
          blue: "0, 229, 255",
          pink: "255, 0, 127",
          green: "0, 255, 159",
          red: "255, 51, 51",
          orange: "255, 145, 0",
        };
        const rgb = themes[cachedTheme];
        if (rgb) {
          const root = document.documentElement;
          root.style.setProperty("--color-accent-rgb", rgb);
          root.style.setProperty("--color-accent", `rgb(${rgb})`);
          root.style.setProperty("--color-accent-dim", `rgba(${rgb}, 0.1)`);
        }
      }
    }
  }, []);

  return (
    <>
      {/* 3. Loader Overlay: Mounted on the client; fades out smoothly on complete */}
      <AnimatePresence mode="wait">
        {!isIntroFinished && (
          <LoaderEntrance key="entrance-loader" onComplete={() => setIsIntroFinished(true)} />
        )}
      </AnimatePresence>

      {/* 4. Portfolio Content: Always pre-rendered by Next.js on the server for SEO crawlability */}
      <motion.div
        key="main-portfolio"
        initial={{ opacity: 0, y: 15 }}
        animate={isIntroFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={!isIntroFinished ? "pointer-events-none h-screen overflow-hidden" : ""}
      >
        <PortfolioDataProvider>
          <ScrollProgress />
          <CustomCursor />
          <CursorSpotlight />
          <BackToTop />
          <BuiltInBrowser />
          <Sidebar />
          <MobileNav />
          <TelemetryHUD />
          <ResumeViewerModal />

          <div className="lg:pl-[min(320px,28vw)]">
            <main>
              <Hero />
              {themeConfig.sectionsOrder.map((sectionId) => {
                const Component = sectionRegistry[sectionId];
                if (!Component) return null;

                // Feature toggles check
                if (sectionId === "workflows" && !themeConfig.enableWorkflows) return null;
                if (sectionId === "services" && !themeConfig.enableServices) return null;
                if (sectionId === "testimonials" && !themeConfig.enableTestimonials) return null;

                return (
                  <Suspense key={sectionId} fallback={<SectionFallback />}>
                    <Component />
                  </Suspense>
                );
              })}
            </main>
            <Footer />
          </div>
        </PortfolioDataProvider>
      </motion.div>
    </>
  );
}
