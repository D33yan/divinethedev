"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  experiences as staticExperiences, 
  projects as staticProjects, 
  skillGroups as staticSkillGroups, 
  education as staticEducation, 
  certifications as staticCertifications,
  services as staticServices,
  testimonials as staticTestimonials,
  workflowsConfig
} from "@/lib/site";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Database, Play, CheckCircle, AlertTriangle, User, ShieldAlert, ShieldCheck, Loader2, Upload, FileText, Globe } from "lucide-react";

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
    certifications: 0,
    services: 0,
    testimonials: 0
  });
  const [countsLoading, setCountsLoading] = useState(true);

  // Recruiter Analytics states
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    cvDownloads: 0,
    contacts: 0,
    commands: 0,
    recent: [] as any[]
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Asset uploader states
  const [brandingLoading, setBrandingLoading] = useState(false);
  const [brandingError, setBrandingError] = useState("");
  const [brandingSuccess, setBrandingSuccess] = useState("");
  const [logoPreview, setLogoPreview] = useState("/logo.png");
  const [avatar1Preview, setAvatar1Preview] = useState("/portfolioprofile1.png");
  const [avatar2Preview, setAvatar2Preview] = useState("/portfolioprofile2.jpg");
  const [resumePreview, setResumePreview] = useState("");
  const [ogPreview, setOgPreview] = useState("/og_image.png");

  const fetchBranding = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "primary")
        .single();
      
      if (data) {
        if (data.logo_url) setLogoPreview(data.logo_url);
        if (data.avatar1_url) setAvatar1Preview(data.avatar1_url);
        if (data.avatar2_url) setAvatar2Preview(data.avatar2_url);
        if (data.resume_url) setResumePreview(data.resume_url);
        if (data.seo_og_image) setOgPreview(data.seo_og_image);
      }
    } catch (err) {
      console.warn("Could not query branding settings:", err);
    }
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "avatar1" | "avatar2" | "resume" | "og_image") => {
    if (!supabase || !e.target.files || e.target.files.length === 0) return;
    if (!isAdmin) {
      triggerSound("glitch");
      setBrandingError("Upload restricted: Administrator clearance required.");
      return;
    }

    setBrandingLoading(true);
    setBrandingError("");
    setBrandingSuccess("");
    triggerSound("click");

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      // Upload file to Supabase storage bucket 'portfolio-assets'
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);

      const publicUrl = data?.publicUrl;
      if (!publicUrl) throw new Error("Could not retrieve public URL of uploaded file.");

      // Check if primary settings row exists, if not insert it
      const { data: existingRow } = await supabase
        .from("site_settings")
        .select("id")
        .eq("id", "primary")
        .maybeSingle();

      if (!existingRow) {
        await supabase.from("site_settings").insert({ id: "primary" });
      }

      // Update mapping table column
      const updateData: any = { updated_at: new Date().toISOString() };
      if (type === "logo") updateData.logo_url = publicUrl;
      if (type === "avatar1") updateData.avatar1_url = publicUrl;
      if (type === "avatar2") updateData.avatar2_url = publicUrl;
      if (type === "resume") updateData.resume_url = publicUrl;
      if (type === "og_image") updateData.seo_og_image = publicUrl;

      const { error: dbError } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", "primary");

      if (dbError) throw dbError;

      // Update local preview states
      if (type === "logo") setLogoPreview(publicUrl);
      if (type === "avatar1") setAvatar1Preview(publicUrl);
      if (type === "avatar2") setAvatar2Preview(publicUrl);
      if (type === "resume") setResumePreview(publicUrl);
      if (type === "og_image") setOgPreview(publicUrl);

      setBrandingSuccess(`Branding asset [${type.toUpperCase()}] updated successfully!`);
      triggerSound("success");
    } catch (err: any) {
      console.error(err);
      setBrandingError(err.message || `Failed to upload branding asset. Make sure the 'portfolio-assets' storage bucket exists in Supabase and has public read access.`);
      triggerSound("glitch");
    } finally {
      setBrandingLoading(false);
      e.target.value = "";
    }
  };

  const fetchCounts = async () => {
    if (!supabase) return;
    setCountsLoading(true);
    setAnalyticsLoading(true);
    try {
      const pCount = await supabase.from("projects").select("id", { count: "exact" });
      const eCount = await supabase.from("experiences").select("id", { count: "exact" });
      const sCount = await supabase.from("skill_groups").select("id", { count: "exact" });
      const eduCount = await supabase.from("education").select("id", { count: "exact" });
      const certCount = await supabase.from("certifications").select("id", { count: "exact" });
      const servCount = await supabase.from("services").select("id", { count: "exact" });
      const testCount = await supabase.from("testimonials").select("id", { count: "exact" });

      setCounts({
        projects: pCount.count || 0,
        experiences: eCount.count || 0,
        skills: sCount.count || 0,
        education: eduCount.count || 0,
        certifications: certCount.count || 0,
        services: servCount.count || 0,
        testimonials: testCount.count || 0
      });

      // Fetch analytics counts
      try {
        const pvCount = await supabase.from("analytics_events").select("id", { count: "exact" }).eq("event_type", "page_view");
        const cvdCount = await supabase.from("analytics_events").select("id", { count: "exact" }).eq("event_type", "cv_download");
        const caCount = await supabase.from("analytics_events").select("id", { count: "exact" }).eq("event_type", "contact_attempt");
        const ceCount = await supabase.from("analytics_events").select("id", { count: "exact" }).eq("event_type", "command_executed");

        const { data: recentEvents } = await supabase
          .from("analytics_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setAnalytics({
          pageViews: pvCount.count || 0,
          cvDownloads: cvdCount.count || 0,
          contacts: caCount.count || 0,
          commands: ceCount.count || 0,
          recent: recentEvents || []
        });
      } catch (aErr) {
        console.warn("Could not query telemetry analytics database tables:", aErr);
      }
    } catch (err) {
      console.error("Error fetching db counts:", err);
    } finally {
      setCountsLoading(false);
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchBranding();
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

      // 6. Seed Site Settings primary row
      try {
        await supabase.from("site_settings").upsert({
          id: "primary",
          logo_url: "/logo.png",
          avatar1_url: "/portfolioprofile1.png",
          avatar2_url: "/portfolioprofile2.jpg",
          resume_url: "/Divine_Nnaji_CV.pdf",
          accent_color: "rgb(100, 255, 218)",
          dark_bg_color: "#000000",
          light_bg_color: "#f6f8fa",
          accent_presets: JSON.stringify([
            "rgb(100, 255, 218)",
            "rgb(168, 85, 247)",
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)"
          ])
        });
      } catch (settingsErr) {
        console.warn("Could not seed default site settings row:", settingsErr);
      }

      // 7. Seed Services
      try {
        const servicesToInsert = staticServices.map((s) => ({
          title: s.title,
          desc: s.desc,
          icon: s.icon
        }));
        await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { error: servErr } = await supabase.from("services").insert(servicesToInsert);
        if (servErr) throw new Error(`Services Seed Error: ${servErr.message}`);
      } catch (servErr: any) {
        console.warn("Could not seed default services:", servErr);
      }

      // 8. Seed Testimonials
      try {
        const testimonialsToInsert = staticTestimonials.map((t) => ({
          quote: t.quote,
          author: t.author,
          role: t.role,
          company: t.company,
          avatar: t.avatar,
          stars: t.stars
        }));
        await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { error: testErr } = await supabase.from("testimonials").insert(testimonialsToInsert);
        if (testErr) throw new Error(`Testimonials Seed Error: ${testErr.message}`);
      } catch (testErr: any) {
        console.warn("Could not seed default testimonials:", testErr);
      }

      // 9. Seed Workflows
      try {
        const nodesToInsert = workflowsConfig.nodes.map((n) => ({
          node_id: n.id,
          title: n.title,
          icon: n.icon,
          color: n.color,
          desc: n.desc
        }));
        await supabase.from("workflow_nodes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { error: wfNodeErr } = await supabase.from("workflow_nodes").insert(nodesToInsert);
        if (wfNodeErr) throw new Error(`Workflow Nodes Seed Error: ${wfNodeErr.message}`);

        const stepsToInsert = workflowsConfig.steps.map((s, idx) => ({
          node_id: s.id,
          log: s.log,
          sort_order: idx
        }));
        await supabase.from("workflow_steps").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { error: wfStepErr } = await supabase.from("workflow_steps").insert(stepsToInsert);
        if (wfStepErr) throw new Error(`Workflow Steps Seed Error: ${wfStepErr.message}`);
      } catch (wfErr: any) {
        console.warn("Could not seed default workflows:", wfErr);
      }

      setSeedSuccess(true);
      triggerSound("success");
      await fetchCounts();
      await fetchBranding();
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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
        {[
          { name: "Projects", count: counts.projects, color: "text-[#64ffda]" },
          { name: "Experiences", count: counts.experiences, color: "text-blue-400" },
          { name: "Skill Groups", count: counts.skills, color: "text-pink-400" },
          { name: "Education", count: counts.education, color: "text-purple-400" },
          { name: "Certifications", count: counts.certifications, color: "text-amber-400" },
          { name: "Services", count: counts.services, color: "text-emerald-400" },
          { name: "Testimonials", count: counts.testimonials, color: "text-indigo-400" }
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

      {/* Recruiter Analytics & Telemetry section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#64ffda]/10 border border-[#64ffda]/20 flex items-center justify-center text-[#64ffda]">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">Recruiter Analytics & Live Telemetry</h2>
            <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
              Live engagement tracking from visitors, chatbot commands, and CV downloads
            </p>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex flex-col py-10 items-center justify-center font-mono text-xs text-[#8892b0] gap-3">
            <Loader2 className="h-5 w-5 text-[#64ffda] animate-spin" />
            <span>querying database telemetry...</span>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Visual Bar Telemetry charts */}
            <div className="space-y-4 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8892b0] font-bold block mb-2">Event Density Ratios</span>
              
              {[
                { name: "Page View events", count: analytics.pageViews, color: "bg-[#64ffda]", text: "text-[#64ffda]" },
                { name: "CV Downloads & Prints", count: analytics.cvDownloads, color: "bg-blue-400", text: "text-blue-400" },
                { name: "Chatbot Inquiries logged", count: analytics.commands, color: "bg-amber-400", text: "text-amber-400" },
                { name: "Contact Forms submitted", count: analytics.contacts, color: "bg-purple-400", text: "text-purple-400" }
              ].map((item) => {
                const maxVal = Math.max(analytics.pageViews, 1);
                const percent = Math.min((item.count / maxVal) * 100, 100);
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#ccd6f6]">{item.name}</span>
                      <span className={`${item.text} font-bold`}>{item.count}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recipient Logs list */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8892b0] font-bold block mb-2">Live System Activity Logs (5 Recent)</span>
              {analytics.recent.length === 0 ? (
                <p className="text-[10px] text-[#8892b0] italic py-4">No events logged yet. Telemetry listening active...</p>
              ) : (
                <div className="space-y-2">
                  {analytics.recent.map((log) => (
                    <div key={log.id} className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-white/5 bg-white/5 text-[10px] leading-relaxed">
                      <div className="flex flex-col gap-1">
                        <span className={`font-bold uppercase tracking-wider ${
                          log.event_type === "page_view" ? "text-[#64ffda]" :
                          log.event_type === "cv_download" ? "text-blue-400" :
                          log.event_type === "contact_attempt" ? "text-purple-400" : "text-amber-400"
                        }`}>
                          [{log.event_type}]
                        </span>
                        <span className="text-[#ccd6f6] max-w-[200px] truncate sm:max-w-none block">
                          {log.event_details || "No details provided"}
                        </span>
                      </div>
                      <span className="text-[#8892b0]/50 text-[9px] shrink-0">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Branding & Branding Assets section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">Branding & System Assets</h2>
            <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
              Update branding assets (Logo, Profile Photos, and CV PDF) live
            </p>
          </div>
        </div>

        <SystemAlert type="error" message={brandingError} />
        <SystemAlert type="success" message={brandingSuccess} />

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-6">
          {/* 1. App Logo */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-4 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[10px] tracking-wider text-[#8892b0] uppercase mb-3">Navigation Logo</span>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#64ffda]/30 flex items-center justify-center bg-navy mb-4">
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer text-[10px] font-mono text-[#64ffda] uppercase select-none transition">
              <Upload className="h-3.5 w-3.5" />
              <span>Select Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAssetUpload(e, "logo")}
                disabled={brandingLoading || !isAdmin}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Avatar 1 */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-4 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[10px] tracking-wider text-[#8892b0] uppercase mb-3">Profile Photo 1</span>
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-navy mb-4">
              <img src={avatar1Preview} alt="Avatar 1" className="w-full h-full object-cover" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer text-[10px] font-mono text-[#64ffda] uppercase select-none transition">
              <Upload className="h-3.5 w-3.5" />
              <span>Select Photo 1</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAssetUpload(e, "avatar1")}
                disabled={brandingLoading || !isAdmin}
                className="hidden"
              />
            </label>
          </div>

          {/* 3. Avatar 2 */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-4 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[10px] tracking-wider text-[#8892b0] uppercase mb-3">Profile Photo 2</span>
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-navy mb-4">
              <img src={avatar2Preview} alt="Avatar 2" className="w-full h-full object-cover" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer text-[10px] font-mono text-[#64ffda] uppercase select-none transition">
              <Upload className="h-3.5 w-3.5" />
              <span>Select Photo 2</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAssetUpload(e, "avatar2")}
                disabled={brandingLoading || !isAdmin}
                className="hidden"
              />
            </label>
          </div>

          {/* 4. CV Resume PDF */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-4 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[10px] tracking-wider text-[#8892b0] uppercase mb-3">Official CV PDF</span>
            <div className="w-16 h-16 rounded-xl border border-white/10 flex items-center justify-center bg-navy mb-4 text-[#8892b0]/55">
              <FileText className="h-8 w-8 text-[#64ffda]/70" />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              {resumePreview && (
                <a 
                  href={resumePreview} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] font-mono text-[#64ffda] underline truncate max-w-full block mb-1"
                >
                  view_active_pdf.pdf
                </a>
              )}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer text-[10px] font-mono text-[#64ffda] uppercase select-none transition">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleAssetUpload(e, "resume")}
                  disabled={brandingLoading || !isAdmin}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 5. Social Share OG Image */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-4 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[10px] tracking-wider text-[#8892b0] uppercase mb-3">Social OG Image</span>
            <div className="w-20 h-14 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-navy mb-4">
              <img src={ogPreview} alt="Social OG" className="w-full h-full object-cover" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer text-[10px] font-mono text-[#64ffda] uppercase select-none transition">
              <Upload className="h-3.5 w-3.5" />
              <span>Select OG Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAssetUpload(e, "og_image")}
                disabled={brandingLoading || !isAdmin}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
