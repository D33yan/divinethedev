"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  experiences as staticExperiences, 
  projects as staticProjects, 
  skillGroups as staticSkillGroups, 
  education as staticEducation, 
  certifications as staticCertifications 
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

interface PortfolioDataContextType {
  projects: Project[];
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: EducationItem[];
  certifications: CertificationItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  isUsingLiveDb: boolean;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(staticProjects as unknown as Project[]);
  const [experiences, setExperiences] = useState<Experience[]>(staticExperiences as unknown as Experience[]);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(staticSkillGroups as unknown as SkillGroup[]);
  const [education, setEducation] = useState<EducationItem[]>(staticEducation as unknown as EducationItem[]);
  const [certifications, setCertifications] = useState<CertificationItem[]>(staticCertifications as unknown as CertificationItem[]);
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
      const { data: dbCertifications, error: certsError } = await supabase
        .from("certifications")
        .select("*")
        .order("sort_order", { ascending: true });

      if (projectsError || experiencesError || skillsError || educationError || certsError) {
        console.warn("Error fetching from Supabase, falling back to static config:", {
          projectsError, experiencesError, skillsError, educationError, certsError
        });
        setIsUsingLiveDb(false);
      } else if (
        (!dbProjects || dbProjects.length === 0) &&
        (!dbExperiences || dbExperiences.length === 0) &&
        (!dbSkills || dbSkills.length === 0)
      ) {
        // Tables exist but are empty (not seeded yet)
        console.log("Supabase tables are empty. Using static content config.");
        setIsUsingLiveDb(false);
      } else {
        // Map database schemas to UI interfaces
        if (dbProjects && dbProjects.length > 0) {
          setProjects(dbProjects.map((p: any) => ({
            id: p.slug,
            db_id: p.id,
            title: p.title,
            description: p.description,
            tech: p.tech || [],
            tag: p.tag,
            featured: p.featured,
            github: p.github,
            live: p.live,
            badge: p.badge,
            caseStudy: p.case_study || { problem: "", approach: "", built: "", result: "", images: [] }
          })));
        }

        if (dbExperiences && dbExperiences.length > 0) {
          setExperiences(dbExperiences.map((e: any) => ({
            id: e.slug,
            db_id: e.id,
            company: e.company,
            role: e.role,
            period: e.period,
            location: e.location,
            tech: e.tech || [],
            bullets: e.bullets || []
          })));
        }

        if (dbSkills && dbSkills.length > 0) {
          setSkillGroups(dbSkills.map((s: any) => ({
            id: s.id,
            title: s.title,
            skills: s.skills || []
          })));
        }

        if (dbEducation && dbEducation.length > 0) {
          setEducation(dbEducation.map((edu: any) => ({
            id: edu.id,
            type: "education",
            title: edu.title,
            org: edu.org,
            period: edu.period
          })));
        }

        if (dbCertifications && dbCertifications.length > 0) {
          setCertifications(dbCertifications.map((c: any) => ({
            id: c.id,
            type: "cert",
            title: c.title,
            org: c.org,
            period: c.period
          })));
        }

        setIsUsingLiveDb(true);
      }
    } catch (err) {
      console.error("Exception fetching data from Supabase:", err);
      setIsUsingLiveDb(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PortfolioDataContext.Provider value={{
      projects,
      experiences,
      skillGroups,
      education,
      certifications,
      loading,
      refreshData: fetchData,
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
