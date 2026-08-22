"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  experiences as staticExperiences, 
  projects as staticProjects, 
  skillGroups as staticSkillGroups, 
  education as staticEducation, 
  certifications as staticCertifications 
} from "@/lib/site";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Database, Play, CheckCircle, AlertTriangle, User, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

export default function DashboardOverview() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState("");
  const [counts, setCounts] = useState({
    projects: 0,
    experiences: 0,
    skills: 0,
    education: 0,
    certifications: 0
  });
  const [countsLoading, setCountsLoading] = useState(true);

  const fetchCounts = async () => {
    if (!supabase) return;
    setCountsLoading(true);
    try {
      const pCount = await supabase.from("projects").select("id", { count: "exact" });
      const eCount = await supabase.from("experiences").select("id", { count: "exact" });
      const sCount = await supabase.from("skill_groups").select("id", { count: "exact" });
      const eduCount = await supabase.from("education").select("id", { count: "exact" });
      const certCount = await supabase.from("certifications").select("id", { count: "exact" });

      setCounts({
        projects: pCount.count || 0,
        experiences: eCount.count || 0,
        skills: sCount.count || 0,
        education: eduCount.count || 0,
        certifications: certCount.count || 0
      });
    } catch (err) {
      console.error("Error fetching db counts:", err);
    } finally {
      setCountsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSeedDatabase = async () => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setSeedError("Access denied: Seeding requires administrator privilege.");
      return;
    }

    setSeeding(true);
    setSeedSuccess(false);
    setSeedError("");
    triggerSound("click");

    try {
      // 1. Seed Projects
      const projectsToInsert = staticProjects.map((p, idx) => ({
        slug: p.id,
        title: p.title,
        description: p.description,
        tech: p.tech,
        tag: p.tag,
        featured: p.featured,
        github: p.github,
        live: p.live,
        badge: p.badge,
        case_study: p.caseStudy || { problem: "", approach: "", built: "", result: "", images: [] },
        sort_order: idx
      }));

      const { error: pErr } = await supabase.from("projects").upsert(projectsToInsert, { onConflict: "slug" });
      if (pErr) throw new Error(`Projects Seed Error: ${pErr.message}`);

      // 2. Seed Experiences
      const experiencesToInsert = staticExperiences.map((e, idx) => ({
        slug: e.id,
        company: e.company,
        role: e.role,
        period: e.period,
        location: e.location,
        tech: e.tech,
        bullets: e.bullets,
        sort_order: idx
      }));

      const { error: eErr } = await supabase.from("experiences").upsert(experiencesToInsert, { onConflict: "slug" });
      if (eErr) throw new Error(`Experiences Seed Error: ${eErr.message}`);

      // 3. Seed Skill Groups
      const skillsToInsert = staticSkillGroups.map((s, idx) => ({
        title: s.title,
        skills: s.skills,
        sort_order: idx
      }));

      const { error: sErr } = await supabase.from("skill_groups").upsert(skillsToInsert, { onConflict: "title" });
      if (sErr) throw new Error(`Skills Seed Error: ${sErr.message}`);

      // 4. Seed Education
      const eduToInsert = staticEducation.map((edu, idx) => ({
        title: edu.title,
        org: edu.org,
        period: edu.period,
        sort_order: idx
      }));

      // No natural unique constraint on education, so we insert directly
      // To avoid duplicate seed entries, we delete first if count > 0 or let upsert run
      await supabase.from("education").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const { error: eduErr } = await supabase.from("education").insert(eduToInsert);
      if (eduErr) throw new Error(`Education Seed Error: ${eduErr.message}`);

      // 5. Seed Certifications
      const certToInsert = staticCertifications.map((c, idx) => ({
        title: c.title,
        org: c.org,
        period: c.period,
        sort_order: idx
      }));

      await supabase.from("certifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const { error: certErr } = await supabase.from("certifications").insert(certToInsert);
      if (certErr) throw new Error(`Certifications Seed Error: ${certErr.message}`);

      setSeedSuccess(true);
      triggerSound("success");
      await fetchCounts();
    } catch (err: any) {
      console.error(err);
      setSeedError(err.message || "Failed to seed database.");
      triggerSound("glitch");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">DASHBOARD_OVERVIEW</h1>
        <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
          SYSTEM STATUS & CENTRAL DATABASE SYNCHRONIZER
        </p>
      </div>

      {/* Grid of Counts */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { name: "Projects", count: counts.projects, color: "text-[#64ffda]" },
          { name: "Experiences", count: counts.experiences, color: "text-blue-400" },
          { name: "Skill Groups", count: counts.skills, color: "text-pink-400" },
          { name: "Education", count: counts.education, color: "text-purple-400" },
          { name: "Certifications", count: counts.certifications, color: "text-amber-400" }
        ].map((stat) => (
          <div key={stat.name} className="glass-card rounded-xl p-5 border border-white/5 bg-[#112240]/40 backdrop-blur-sm flex flex-col justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#8892b0]">{stat.name}</span>
            <div className="mt-4 flex items-baseline justify-between">
              {countsLoading ? (
                <span className="text-xs font-mono text-[#8892b0]">reading...</span>
              ) : (
                <span className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.count}</span>
              )}
              <span className="text-[10px] font-mono text-white/5 uppercase">Live DB</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sync panel */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#64ffda]/10 border border-[#64ffda]/20 flex items-center justify-center text-[#64ffda]">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">Database Seed Engine</h2>
            </div>
            <p className="text-xs text-[#8892b0] leading-relaxed mb-6 font-mono uppercase tracking-wide">
              Seed your Supabase database in one-click directly from the static configurations in code (site.ts). 
              This will populate your projects, case studies, job history, skills, and certifications cleanly.
            </p>
          </div>

          <div className="space-y-4">
            <SystemAlert type="error" message={seedError} />
            <SystemAlert type="success" message={seedSuccess ? "Database seeding completed successfully! All tables synchronised." : ""} />

            <button
              onClick={handleSeedDatabase}
              disabled={seeding || !isAdmin}
              className="w-full bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda] disabled:border-white/5 disabled:bg-white/5 text-[#64ffda] disabled:text-[#8892b0] font-mono rounded-xl py-3.5 flex items-center justify-center gap-2 transition duration-300 shadow-[0_0_15px_rgba(100,255,218,0.05)] text-xs uppercase"
            >
              {seeding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#64ffda]" />
                  Seeding Live Tables...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Seed Database from Static Data
                </>
              )}
            </button>
            
            {!isAdmin && (
              <p className="text-[10px] text-amber-500 font-mono text-center">
                ⚠ Seeding operations are write-actions. Elevate to Administrator role to execute.
              </p>
            )}
          </div>
        </div>

        {/* Security & Access Info */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <User className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">Security & Roles</h2>
            </div>
            <p className="text-xs text-[#8892b0] leading-relaxed mb-4 font-mono uppercase tracking-wide">
              The CMS implements Role-Based Access Control (RBAC) securely in the database:
            </p>
            <ul className="space-y-3 pl-0 text-xs font-mono">
              <li className="flex items-start gap-2 text-[#64ffda]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#64ffda] mt-0.5" />
                <span>
                  <strong>ADMINISTRATOR</strong>: Full access to insert, update, or delete records. Permissions enforced via Supabase RLS policies.
                </span>
              </li>
              <li className="flex items-start gap-2 text-amber-400">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>GUEST_VIEWER</strong>: Read-only access to browse the panels and see data. Submissions and deletions are blocked by RLS policies.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-[#8892b0]/60 font-mono">
            OPERATIONAL LOG: SECURE CONNECTION ESTABLISHED WITH DEPLOYED INSTANCE
          </div>
        </div>
      </div>
    </div>
  );
}
