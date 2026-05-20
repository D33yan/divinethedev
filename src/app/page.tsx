import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { CursorSpotlight } from "@/components/effects/CursorSpotlight";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { BackToTop } from "@/components/effects/BackToTop";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

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
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <CursorSpotlight />
      <BackToTop />
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
    </>
  );
}
