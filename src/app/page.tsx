"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
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
const Skills = dynamic(() => import("@/components/sections/Skills").then((m) => m.Skills));
const Education = dynamic(() => import("@/components/sections/Education").then((m) => m.Education));
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => m.Contact));

function SectionFallback() {
  return <div className="min-h-[40vh]" aria-hidden />;
}

export default function Home() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);

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
        <ScrollProgress />
        <CustomCursor />
        <CursorSpotlight />
        <BackToTop />
        <BuiltInBrowser />
        <Sidebar />
        <MobileNav />

        <div className="lg:pl-[min(320px,28vw)]">
          <main>
            <Hero />
            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Experience />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Education />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
          </main>
          <Footer />
        </div>
      </motion.div>
    </>
  );
}
