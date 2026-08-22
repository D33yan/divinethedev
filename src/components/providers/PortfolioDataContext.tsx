"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  experiences as staticExperiences, 
  projects as staticProjects, 
  skillGroups as staticSkillGroups, 
  education as staticEducation, 
  certifications as staticCertifications,
  services as staticServices,
  testimonials as staticTestimonials,
  workflowsConfig,
  siteConfig
} from "@/lib/site";

// Types derived from site.ts structure
export interface Project {
  id: string; // mapped from DB 'slug'
  db_id?: string; // DB UUID for edits
  title: string;
  description: string;
  tech: string[];
  tag: string;
  featured: boolean;
  github: string;
  live: string | null;
  badge: string | null;
  caseStudy: {
    problem: string;
    approach: string;
    built: string;
    result: string;
    images: string[];
  };
}

export interface Experience {
  id: string; // mapped from DB 'slug'
  db_id?: string; // DB UUID
  company: string;
  role: string;
  period: string;
  location: string;
  tech: string[];
  bullets: string[];
}

export interface SkillGroup {
  id?: string; // DB UUID
  title: string;
  skills: string[];
}

export interface EducationItem {
  id?: string; // DB UUID
  type: "education";
  title: string;
  org: string;
  period: string;
}

export interface CertificationItem {
  id?: string; // DB UUID
  type: "cert";
  title: string;
  org: string;
  period: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  stars: number;
}

interface PortfolioDataContextType {
  projects: Project[];
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: EducationItem[];
  certifications: CertificationItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  workflowNodes: any[];
  workflowSteps: any[];
  logoUrl: string;
  avatar1Url: string;
  avatar2Url: string;
  resumeUrl: string;
  accentColor: string;
  darkBgColor: string;
  lightBgColor: string;
  accentPresets: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string;
  analyticsId: string;
  loading: boolean;
  refreshData: () => Promise<void>;
  logEvent: (eventType: string, eventDetails?: string) => Promise<void>;
  isUsingLiveDb: boolean;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(staticProjects as unknown as Project[]);
  const [experiences, setExperiences] = useState<Experience[]>(staticExperiences as unknown as Experience[]);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(staticSkillGroups as unknown as SkillGroup[]);
  const [education, setEducation] = useState<EducationItem[]>(staticEducation as unknown as EducationItem[]);
  const [certifications, setCertifications] = useState<CertificationItem[]>(staticCertifications as unknown as CertificationItem[]);
  
  const [services, setServices] = useState<ServiceItem[]>(staticServices as ServiceItem[]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(staticTestimonials as TestimonialItem[]);
  
  const [workflowNodes, setWorkflowNodes] = useState<any[]>(workflowsConfig.nodes);
  const [workflowSteps, setWorkflowSteps] = useState<any[]>(workflowsConfig.steps);
  
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [avatar1Url, setAvatar1Url] = useState("/portfolioprofile1.png");
  const [avatar2Url, setAvatar2Url] = useState("/portfolioprofile2.jpg");
  const [resumeUrl, setResumeUrl] = useState(siteConfig.resumePath || "/Divine_Nnaji_CV.pdf");
  
  const [accentColor, setAccentColor] = useState("rgb(100, 255, 218)");
  const [darkBgColor, setDarkBgColor] = useState("#000000");
  const [lightBgColor, setLightBgColor] = useState("#f6f8fa");
  const [accentPresets, setAccentPresets] = useState<string[]>([]);

  // SEO & Meta Settings states
  const [seoTitle, setSeoTitle] = useState("Divine Chibueze Nnaji (Navie) — Premium Cybernetic Portfolio");
  const [seoDescription, setSeoDescription] = useState("A world-class, premium developer portfolio website with a cybernetic tactile design system.");
  const [seoKeywords, setSeoKeywords] = useState("Developer, Fullstack, AI Builder, Automation, Portfolio");
  const [seoOgImage, setSeoOgImage] = useState("/og_image.png");
  const [analyticsId, setAnalyticsId] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [isUsingLiveDb, setIsUsingLiveDb] = useState(false);

  const fetchData = async () => {
    if (!supabase) {
      console.log("Supabase client not initialized. Using static content.");
      setLoading(false);
      setIsUsingLiveDb(false);
      return;
    }

    try {
      // Fetch dynamic brand
      try {
        const { data: dbSettings } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", "primary")
          .single();

        if (dbSettings) {
          if (dbSettings.logo_url) setLogoUrl(dbSettings.logo_url);
          if (dbSettings.avatar1_url) setAvatar1Url(dbSettings.avatar1_url);
          if (dbSettings.avatar2_url) setAvatar2Url(dbSettings.avatar2_url);
          if (dbSettings.resume_url) setResumeUrl(dbSettings.resume_url);
          if (dbSettings.accent_color) setAccentColor(dbSettings.accent_color);
          if (dbSettings.dark_bg_color) setDarkBgColor(dbSettings.dark_bg_color);
          if (dbSettings.light_bg_color) setLightBgColor(dbSettings.light_bg_color);
          if (dbSettings.seo_title) setSeoTitle(dbSettings.seo_title);
          if (dbSettings.seo_description) setSeoDescription(dbSettings.seo_description);
          if (dbSettings.seo_keywords) setSeoKeywords(dbSettings.seo_keywords);
          if (dbSettings.seo_og_image) setSeoOgImage(dbSettings.seo_og_image);
          if (dbSettings.analytics_id) setAnalyticsId(dbSettings.analytics_id);
          if (dbSettings.accent_presets) {
            try {
              const presets = typeof dbSettings.accent_presets === "string" 
                ? JSON.parse(dbSettings.accent_presets) 
                : dbSettings.accent_presets;
              setAccentPresets(presets);
            } catch (pErr) {
              console.warn("Could not parse accent presets JSON:", pErr);
            }
          }
        }
      } catch (settingsErr) {
        console.warn("Could not query dynamic branding details:", settingsErr);
      }

      // Fetch projects
      const { data: dbProjects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      // Fetch experiences
      const { data: dbExperiences, error: experiencesError } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });

      // Fetch skill groups
      const { data: dbSkills, error: skillsError } = await supabase
        .from("skill_groups")
        .select("*")
        .order("sort_order", { ascending: true });

      // Fetch education
      const { data: dbEducation, error: educationError } = await supabase
        .from("education")
        .select("*")
        .order("sort_order", { ascending: true });

      // Fetch certifications
      const { data: dbCertifications, error: certError } = await supabase
        .from("certifications")
        .select("*")
        .order("created_at", { ascending: true });

      // Fetch services
      const { data: dbServices, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });

      // Fetch testimonials
      const { data: dbTestimonials, error: testimonialsError } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: true });

      // Fetch dynamic workflows
      const { data: dbWfNodes, error: wfNodesError } = await supabase
        .from("workflow_nodes")
        .select("*")
        .order("created_at", { ascending: true });

      const { data: dbWfSteps, error: wfStepsError } = await supabase
        .from("workflow_steps")
        .select("*")
        .order("sort_order", { ascending: true });

      if (dbProjects && !projectsError) {
        const mapped = dbProjects.map((p) => ({
          db_id: p.id,
          id: p.slug,
          title: p.title,
          description: p.description,
          tech: p.tech || [],
          tag: p.tag,
          featured: p.featured || false,
          github: p.github || "",
          live: p.live || null,
          badge: p.badge || null,
          caseStudy: p.case_study || {
            problem: "",
            approach: "",
            built: "",
            result: "",
            images: []
          }
        }));
        setProjects(mapped);
        setIsUsingLiveDb(true);
      }

      if (dbExperiences && !experiencesError) {
        const mapped = dbExperiences.map((e) => ({
          db_id: e.id,
          id: e.slug,
          company: e.company,
          role: e.role,
          period: e.period,
          location: e.location || "",
          tech: e.tech || [],
          bullets: e.bullets || []
        }));
        setExperiences(mapped);
      }

      if (dbSkills && !skillsError) {
        const mapped = dbSkills.map((s) => ({
          id: s.id,
          title: s.title,
          skills: s.skills || []
        }));
        setSkillGroups(mapped);
      }

      if (dbEducation && !educationError) {
        const mapped = dbEducation.map((edu) => ({
          id: edu.id,
          type: "education" as const,
          title: edu.title,
          org: edu.org,
          period: edu.period
        }));
        setEducation(mapped);
      }

      if (dbCertifications && !certError) {
        const mapped = dbCertifications.map((c) => ({
          id: c.id,
          type: "cert" as const,
          title: c.title,
          org: c.org,
          period: c.period
        }));
        setCertifications(mapped);
      }

      if (dbServices && !servicesError) {
        setServices(dbServices as ServiceItem[]);
      } else {
        setServices(staticServices as ServiceItem[]);
      }

      if (dbTestimonials && !testimonialsError) {
        setTestimonials(dbTestimonials as TestimonialItem[]);
      } else {
        setTestimonials(staticTestimonials as TestimonialItem[]);
      }

      if (dbWfNodes && !wfNodesError) {
        setWorkflowNodes(dbWfNodes);
      } else {
        setWorkflowNodes(workflowsConfig.nodes);
      }

      if (dbWfSteps && !wfStepsError) {
        setWorkflowSteps(dbWfSteps);
      } else {
        setWorkflowSteps(workflowsConfig.steps);
      }

    } catch (err) {
      console.error("Error fetching dynamic portfolio context data:", err);
      setIsUsingLiveDb(false);
    } finally {
      setLoading(false);
    }
  };

  const logEvent = async (eventType: string, eventDetails: string = "") => {
    if (!supabase) return;
    try {
      await supabase.from("analytics_events").insert({
        event_type: eventType,
        event_details: eventDetails
      });
    } catch (err) {
      console.warn("Could not log telemetry event:", err);
    }
  };

  useEffect(() => {
    fetchData();
    logEvent("page_view", "Landing page mounted");
  }, []);

  // Theme variable custom properties synchronizer hook
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    // Inject dynamic theme colors in document DOM properties
    root.style.setProperty("--color-accent", accentColor);
    
    const rgbMatch = accentColor.match(/\d+,\s*\d+,\s*\d+/);
    if (rgbMatch) {
      root.style.setProperty("--color-accent-rgb", rgbMatch[0]);
      root.style.setProperty("--color-accent-dim", `rgba(${rgbMatch[0]}, 0.1)`);
    }

    root.style.setProperty("--bg-navy-custom", darkBgColor);
    root.style.setProperty("--bg-white-custom", lightBgColor);
  }, [accentColor, darkBgColor, lightBgColor]);

  // SEO & Head injection synchronizer hook
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.title = seoTitle;
    
    // Dynamic meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoDescription);

    // Dynamic meta keywords
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement('meta');
      metaKey.setAttribute('name', 'keywords');
      document.head.appendChild(metaKey);
    }
    metaKey.setAttribute('content', seoKeywords);

    // Dynamic Open Graph tags
    const ogTags = [
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:image", content: seoOgImage }
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Inject Google Analytics snippet if present
    if (analyticsId) {
      const scriptId = "google-analytics-script";
      const existingScript = document.getElementById(scriptId);
      if (!existingScript) {
        const newScript = document.createElement("script");
        newScript.id = scriptId;
        newScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
        newScript.async = true;
        document.head.appendChild(newScript);

        const inlineScript = document.createElement("script");
        inlineScript.id = `${scriptId}-inline`;
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [seoTitle, seoDescription, seoKeywords, seoOgImage, analyticsId]);

  return (
    <PortfolioDataContext.Provider value={{
      projects,
      experiences,
      skillGroups,
      education,
      certifications,
      services,
      testimonials,
      workflowNodes,
      workflowSteps,
      logoUrl,
      avatar1Url,
      avatar2Url,
      resumeUrl,
      accentColor,
      darkBgColor,
      lightBgColor,
      accentPresets,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoOgImage,
      analyticsId,
      loading,
      refreshData: fetchData,
      logEvent,
      isUsingLiveDb
    }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (context === undefined) {
    throw new Error("usePortfolioData must be used within a PortfolioDataProvider");
  }
  return context;
}
