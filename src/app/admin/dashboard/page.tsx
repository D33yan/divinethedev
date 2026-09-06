"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { 
  Database, Play, CheckCircle, AlertTriangle, User, ShieldAlert, ShieldCheck, 
  Loader2, Upload, FileText, Globe, Eye, Send, Terminal, TrendingUp, BarChart3,
  Mail, FolderGit2, ArrowUpRight, Sparkles, Radio, Wifi, BellRing, CheckCircle2,
  Zap, ArrowRight, ExternalLink, Cpu, Briefcase, GraduationCap, MessageSquare
} from "lucide-react";

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
    dailyActivity: [] as { day: string; count: number; date: string }[],
    recent: [] as any[]
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Telegram Live Dispatcher states
  const [testSending, setTestSending] = useState(false);
  const [testStatus, setTestStatus] = useState<"success" | "error" | null>(null);
  const [testResponse, setTestResponse] = useState("");

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

  const handleDispatchTestNotification = async () => {
    setTestSending(true);
    setTestStatus(null);
    setTestResponse("");
    triggerSound("click");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Mission Control Telemetry",
          email: "telemetry@divinethe.dev",
          message: "⚡ Live Telemetry Uplink Check: Divine, your Telegram push bot integration (@Callmenavi3) is 100% operational and delivering real-time lead alerts!"
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus("success");
        setTestResponse("Push alert dispatched! Check your Telegram app for the instant alert.");
        triggerSound("success");
      } else {
        setTestStatus("error");
        setTestResponse(data.error || data.message || "Failed to deliver Telegram push notification.");
        triggerSound("glitch");
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestResponse(err.message || "Network transmission error.");
      triggerSound("glitch");
    } finally {
      setTestSending(false);
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

        // 7-day timeline trend calculation
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const { data: weeklyEvents } = await supabase
          .from("analytics_events")
          .select("created_at")
          .gte("created_at", sevenDaysAgo.toISOString());

        const daysMap: Record<string, { count: number; dayName: string }> = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split("T")[0];
          const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
          daysMap[key] = { count: 0, dayName };
        }

        if (weeklyEvents) {
          weeklyEvents.forEach((ev: any) => {
            if (ev.created_at) {
              const key = ev.created_at.split("T")[0];
              if (daysMap[key]) {
                daysMap[key].count += 1;
              }
            }
          });
        }

        const dailyActivity = Object.entries(daysMap).map(([date, val]) => ({
          date,
          day: val.dayName,
          count: val.count
        }));

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
          dailyActivity,
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
      {/* 1. Cyberpunk Mission Command Nexus */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 liquid-glass-panel p-6 sm:p-8 shadow-2xl shadow-black">
        {/* HUD Technical Corner Brackets */}
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Ambient Neon Spotlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#64ffda]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Live Animated Telemetry Frequency Wave Background */}
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-20 overflow-hidden" aria-hidden>
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C150,90 300,30 450,75 C600,120 750,15 900,60 C1050,105 1200,45 1200,60 L1200,120 L0,120 Z"
              fill="url(#wave-gradient)"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64ffda" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            {/* System Status Chips */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#64ffda]/10 border border-[#64ffda]/40 text-[#64ffda] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(100,255,218,0.2)]">
                <span className="h-2 w-2 rounded-full bg-[#64ffda] animate-ping" />
                NODE_ONLINE // PRIME
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold tracking-wider">
                <ShieldCheck className="h-3 w-3" />
                RLS_FIREWALL: ENFORCED
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold tracking-wider">
                <Send className="h-3 w-3" />
                TELEGRAM_UPLINK: ACTIVE
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono flex items-center gap-3 drop-shadow-sm">
                  <span>COMMAND_NEXUS</span>
                </h1>
                <span className="text-xs font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[#64ffda]">
                  v2.5_CORE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8892b0] font-mono mt-1.5 max-w-2xl leading-relaxed">
                Central telemetry bridge for portfolio content synchronization, live recruiter interaction, automated CV compilation, and instant Telegram push alerts.
              </p>
            </div>
          </div>

          {/* Quick Action Command Launchpad */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 font-mono text-xs">
            <Link
              href="/admin/dashboard/seo"
              onClick={() => triggerSound("click")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#64ffda] text-black font-bold hover:bg-[#64ffda]/90 transition-all duration-200 shadow-lg shadow-[#64ffda]/20 hover:shadow-[#64ffda]/30 hover:scale-[1.02] cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>COMPILE_CV_PDF</span>
            </Link>

            <Link
              href="/admin/dashboard/messages"
              onClick={() => triggerSound("click")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#ccd6f6] hover:text-[#64ffda] hover:border-[#64ffda]/40 transition cursor-pointer backdrop-blur-md"
            >
              <Mail className="h-4 w-4" />
              <span>INBOX_LEADS ({analytics.contacts})</span>
            </Link>

            <Link
              href="/admin/dashboard/projects"
              onClick={() => triggerSound("click")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#ccd6f6] hover:text-[#64ffda] hover:border-[#64ffda]/40 transition cursor-pointer backdrop-blur-md"
            >
              <FolderGit2 className="h-4 w-4" />
              <span>MANAGE_PROJECTS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Seven Holographic Quantum Stat Pods */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs text-[#8892b0] uppercase tracking-widest flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[#64ffda]" />
            QUANTUM_DATA_CORES
          </span>
          <span className="font-mono text-[10px] text-[#64ffda]">
            7 LIVE CLUSTERS SYNCED
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {[
            { id: "POD_01", name: "Projects", count: counts.projects, color: "text-[#64ffda]", border: "hover:border-[#64ffda]/50", bg: "bg-[#64ffda]/10", path: "/admin/dashboard/projects", icon: FolderGit2 },
            { id: "POD_02", name: "Experiences", count: counts.experiences, color: "text-blue-400", border: "hover:border-blue-500/50", bg: "bg-blue-500/10", path: "/admin/dashboard/experience", icon: Briefcase },
            { id: "POD_03", name: "Skill Groups", count: counts.skills, color: "text-pink-400", border: "hover:border-pink-500/50", bg: "bg-pink-500/10", path: "/admin/dashboard/skills", icon: Cpu },
            { id: "POD_04", name: "Education", count: counts.education, color: "text-purple-400", border: "hover:border-purple-500/50", bg: "bg-purple-500/10", path: "/admin/dashboard/education", icon: GraduationCap },
            { id: "POD_05", name: "Certifications", count: counts.certifications, color: "text-amber-400", border: "hover:border-amber-500/50", bg: "bg-amber-500/10", path: "/admin/dashboard/education", icon: ShieldCheck },
            { id: "POD_06", name: "Services", count: counts.services, color: "text-emerald-400", border: "hover:border-emerald-500/50", bg: "bg-emerald-500/10", path: "/admin/dashboard/services", icon: Sparkles },
            { id: "POD_07", name: "Testimonials", count: counts.testimonials, color: "text-indigo-400", border: "hover:border-indigo-500/50", bg: "bg-indigo-500/10", path: "/admin/dashboard/testimonials", icon: MessageSquare }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name} 
                href={stat.path}
                onClick={() => triggerSound("click")}
                className={`group relative rounded-2xl p-4 border border-white/10 liquid-glass ${stat.border} hover:shadow-[0_0_35px_rgba(100,255,218,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden`}
              >
                {/* Micro corner indicators */}
                <div className="hud-corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="hud-corner-br opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono text-[10px] text-[#8892b0]/70 uppercase">
                      {stat.id}
                    </span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#8892b0] group-hover:text-[#64ffda] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ccd6f6] font-bold block mb-1">
                    {stat.name}
                  </span>
                  <div className="flex items-baseline justify-between">
                    {countsLoading ? (
                      <span className="text-xs font-mono text-[#8892b0] animate-pulse">syncing...</span>
                    ) : (
                      <span className={`text-2xl sm:text-3xl font-bold font-mono ${stat.color} drop-shadow-sm`}>
                        {stat.count}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[8px] font-mono text-[#64ffda] uppercase bg-[#64ffda]/10 px-1.5 py-0.5 rounded border border-[#64ffda]/20">
                      <span className="h-1 w-1 rounded-full bg-[#64ffda] animate-pulse" />
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Bottom micro progress track */}
                <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color.replace('text-', 'bg-')} w-3/4 rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Live Telegram Push Alert Dispatcher Pod */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 liquid-glass-panel p-6 sm:p-8 shadow-2xl shadow-black">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <BellRing className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-mono text-[#ccd6f6] tracking-wide flex items-center gap-2">
                  <span>TELEGRAM_PUSH_UPLINK</span>
                  <span className="text-[10px] font-mono bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 px-2 py-0.5 rounded-full">
                    BOT: @Callmenavi3
                  </span>
                </h2>
                <p className="text-xs text-[#8892b0] font-mono mt-0.5">
                  Instant mobile notifications sent directly to your phone (Chat ID: 5758847362) whenever a recruiter or client submits the contact form.
                </p>
              </div>
            </div>
          </div>

          {/* Trigger Live Test Dispatch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleDispatchTestNotification}
              disabled={testSending}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 hover:border-blue-400 text-xs font-mono font-bold text-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] cursor-pointer disabled:opacity-50"
            >
              {testSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span>TRANSMITTING_UPLINK...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span>DISPATCH_TEST_ALERT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test status banner */}
        {testStatus && (
          <div className="mt-4">
            <SystemAlert 
              type={testStatus} 
              message={testResponse} 
            />
          </div>
        )}
      </div>

      {/* 4. Recruiter Analytics & Live Telemetry Nexus */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 liquid-glass-panel p-6 sm:p-8 shadow-2xl shadow-black space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#64ffda]/10 border border-[#64ffda]/25 flex items-center justify-center text-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.15)]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] tracking-wide">
                ORBITAL_TELEMETRY_&_RECRUITER_ANALYTICS
              </h2>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                Live visitor engagement, ATS CV downloads, and terminal AI session metrics
              </p>
            </div>
          </div>

          <span className="font-mono text-[10px] text-[#64ffda] bg-[#64ffda]/10 border border-[#64ffda]/30 px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-ping" />
            TELEMETRY_STREAM: ACTIVE
          </span>
        </div>

        {analyticsLoading ? (
          <div className="flex flex-col py-12 items-center justify-center font-mono text-xs text-[#8892b0] gap-3">
            <Loader2 className="h-6 w-6 text-[#64ffda] animate-spin" />
            <span>querying database telemetry telemetry...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 4 Metric Conversion Holographic Cubes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="p-4 rounded-2xl liquid-glass border border-white/10 hover:border-[#64ffda]/40 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <div className="flex items-center justify-between text-[#8892b0] mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Impressions</span>
                  <Eye className="h-4 w-4 text-[#64ffda]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#ccd6f6]">{analytics.pageViews}</div>
                <span className="text-[10px] text-[#64ffda] font-mono mt-1 block">100% visitor baseline</span>
              </div>

              <div className="p-4 rounded-2xl liquid-glass border border-white/10 hover:border-blue-500/40 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <div className="flex items-center justify-between text-[#8892b0] mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold">CV Downloads</span>
                  <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">{analytics.cvDownloads}</div>
                <span className="text-[10px] text-blue-400/80 font-mono mt-1 block">
                  {((analytics.cvDownloads / Math.max(analytics.pageViews, 1)) * 100).toFixed(1)}% conversion rate
                </span>
              </div>

              <div className="p-4 rounded-2xl liquid-glass border border-white/10 hover:border-purple-500/40 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <div className="flex items-center justify-between text-[#8892b0] mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Direct Leads</span>
                  <Send className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">{analytics.contacts}</div>
                <span className="text-[10px] text-purple-400/80 font-mono mt-1 block">
                  {((analytics.contacts / Math.max(analytics.pageViews, 1)) * 100).toFixed(1)}% inquiry rate
                </span>
              </div>

              <div className="p-4 rounded-2xl liquid-glass border border-white/10 hover:border-amber-500/40 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <div className="flex items-center justify-between text-[#8892b0] mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold">AI Chatbot</span>
                  <Terminal className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400">{analytics.commands}</div>
                <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">
                  {((analytics.commands / Math.max(analytics.pageViews, 1)) * 100).toFixed(1)}% prompt sessions
                </span>
              </div>
            </div>

            {/* 7-Day Activity Trend Visualizer */}
            {analytics.dailyActivity.length > 0 && (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 font-mono shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#64ffda]" />
                    <span className="text-xs uppercase tracking-wider text-[#ccd6f6] font-bold">
                      7-DAY ENGAGEMENT FREQUENCY
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8892b0]">
                    Weekly Total: {analytics.dailyActivity.reduce((acc, curr) => acc + curr.count, 0)} events
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 h-28 pt-4 px-2">
                  {(() => {
                    const maxDay = Math.max(...analytics.dailyActivity.map((d: any) => d.count), 1);
                    return analytics.dailyActivity.map((d: any, idx: number) => {
                      const heightPercent = Math.max((d.count / maxDay) * 100, 12);
                      const isToday = idx === analytics.dailyActivity.length - 1;
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[10px] text-[#ccd6f6] font-bold">{d.count}</span>
                          <div 
                            className={`w-full max-w-[32px] rounded-t-lg transition-all duration-700 ${
                              isToday 
                                ? "bg-gradient-to-t from-[#64ffda]/80 to-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.4)]" 
                                : d.count > 0 
                                ? "bg-gradient-to-t from-[#64ffda]/30 to-[#64ffda]/70 hover:brightness-125" 
                                : "bg-white/5"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                            title={`${d.day} (${d.date}): ${d.count} event(s)`}
                          />
                          <span className={`text-[10px] ${isToday ? "text-[#64ffda] font-bold" : "text-[#8892b0]"}`}>
                            {d.day}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Live System Activity Logs */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 font-mono shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#ccd6f6] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
                  REAL-TIME EVENT STREAM (5 RECENT)
                </span>
                <span className="text-[10px] text-[#8892b0]">
                  LIVE LOGS
                </span>
              </div>

              {analytics.recent.length === 0 ? (
                <p className="text-xs text-[#8892b0] italic py-3">No events recorded yet. Telemetry listener active...</p>
              ) : (
                <div className="space-y-2">
                  {analytics.recent.map((log) => (
                    <div key={log.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/5 bg-white/5 text-xs">
                      <div className="flex items-center gap-3 truncate">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          log.event_type === "page_view" ? "bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/25" :
                          log.event_type === "cv_download" ? "bg-blue-500/10 text-blue-400 border border-blue-500/25" :
                          log.event_type === "contact_attempt" ? "bg-purple-500/10 text-purple-400 border border-purple-500/25" : 
                          "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                        }`}>
                          {log.event_type}
                        </span>
                        <span className="text-[#ccd6f6] truncate font-mono text-[11px]">
                          {log.event_details || "Standard telemetry ping"}
                        </span>
                      </div>
                      <span className="text-[#8892b0] text-[10px] shrink-0 font-mono">
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

      {/* 5. Database Seed Engine & Security Deck */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sync Panel */}
        <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
          <div className="hud-corner-tl" />
          <div className="hud-corner-br" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.15)]">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">NEURAL_SEED_ENGINE</h2>
                <span className="text-[10px] font-mono text-[#64ffda] uppercase">SOURCE: static config (site.ts)</span>
              </div>
            </div>
            
            <p className="text-xs text-[#8892b0] leading-relaxed mb-4 font-mono">
              Synchronize your deployed Supabase instance in 1-click from the hardened static data configurations in code. Cleanly populates projects, case studies, roles, skills, and certifications.
            </p>

            {/* Table status chips */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {["projects", "experiences", "skills", "education", "certs", "services", "testimonials", "workflows"].map((t) => (
                <span key={t} className="liquid-glass-pill px-2.5 py-0.5 rounded-full font-mono text-[9px] text-[#ccd6f6]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <SystemAlert type="error" message={seedError} />
            <SystemAlert type="success" message={seedSuccess ? "Database seeding completed successfully! All tables synchronised." : ""} />

            <button
              onClick={handleSeedDatabase}
              disabled={seeding || !isAdmin}
              className="w-full bg-[#64ffda]/15 hover:bg-[#64ffda]/25 border border-[#64ffda]/50 disabled:border-white/5 disabled:bg-white/5 text-[#64ffda] disabled:text-[#8892b0] font-mono rounded-xl py-3.5 flex items-center justify-center gap-2 transition duration-300 shadow-[0_0_20px_rgba(100,255,218,0.1)] text-xs uppercase font-bold cursor-pointer"
            >
              {seeding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#64ffda]" />
                  <span>SEEDING_LIVE_TABLES...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>EXECUTE_NEURAL_SEED</span>
                </>
              )}
            </button>
            
            {!isAdmin && (
              <p className="text-[10px] text-amber-400 font-mono text-center">
                ⚠ Write privilege required: Elevated Administrator clearance needed to execute database mutations.
              </p>
            )}
          </div>
        </div>

        {/* Security & Access Info */}
        <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
          <div className="hud-corner-tl" />
          <div className="hud-corner-br" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">SECURITY_&_RBAC_RULES</h2>
                <span className="text-[10px] font-mono text-purple-400 uppercase">ENFORCED VIA SUPABASE RLS</span>
              </div>
            </div>

            <p className="text-xs text-[#8892b0] leading-relaxed mb-4 font-mono">
              Database operations are governed by cryptographically signed session tokens and Row Level Security policies:
            </p>

            <ul className="space-y-3 pl-0 text-xs font-mono">
              <li className="liquid-glass p-3 rounded-xl border border-[#64ffda]/25 flex items-start gap-2.5 text-[#64ffda]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#64ffda] mt-0.5" />
                <span>
                  <strong>ADMINISTRATOR</strong>: Unrestricted privileges to insert, mutate, and delete records and deploy storage assets.
                </span>
              </li>
              <li className="liquid-glass p-3 rounded-xl border border-amber-500/25 flex items-start gap-2.5 text-amber-400">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>GUEST_VIEWER</strong>: Read-only observation clearance. Write operations are blocked at the database engine level.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-[#8892b0] font-mono flex items-center justify-between">
            <span>RLS_STATUS: ENFORCED</span>
            <span className="text-[#64ffda]">AES-256 ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* 6. Holographic Branding & Identity Studio */}
      <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] tracking-wide">
                HOLOGRAPHIC_IDENTITY_&_ASSETS
              </h2>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                Direct deployment to Supabase Storage (Logo, Avatars, PDF CV, Social OG)
              </p>
            </div>
          </div>

          <span className="liquid-glass-pill font-mono text-[10px] text-[#64ffda] px-3 py-1 rounded-full w-fit">
            BUCKET: portfolio-assets [PUBLIC]
          </span>
        </div>

        <SystemAlert type="error" message={brandingError} />
        <SystemAlert type="success" message={brandingSuccess} />

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pt-2">
          {/* 1. App Logo */}
          <div className="liquid-glass group rounded-2xl p-5 hover:border-[#64ffda]/50 hover:shadow-[0_0_35px_rgba(100,255,218,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[11px] tracking-wider text-[#8892b0] uppercase group-hover:text-[#ccd6f6] transition-colors mb-3">
              Navigation Logo
            </span>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[#64ffda] flex items-center justify-center bg-black/50 backdrop-blur-md mb-4 shadow-xl transition-all p-1.5">
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#64ffda]/15 hover:bg-[#64ffda]/25 border border-[#64ffda]/40 hover:border-[#64ffda] rounded-xl cursor-pointer text-[10px] font-mono font-bold text-[#64ffda] uppercase select-none transition-all shadow-sm">
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
          <div className="liquid-glass group rounded-2xl p-5 hover:border-[#64ffda]/50 hover:shadow-[0_0_35px_rgba(100,255,218,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[11px] tracking-wider text-[#8892b0] uppercase group-hover:text-[#ccd6f6] transition-colors mb-3">
              Profile Photo 1
            </span>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-[#64ffda] flex items-center justify-center bg-black/50 backdrop-blur-md mb-4 shadow-xl transition-all">
              <img src={avatar1Preview} alt="Avatar 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#64ffda]/15 hover:bg-[#64ffda]/25 border border-[#64ffda]/40 hover:border-[#64ffda] rounded-xl cursor-pointer text-[10px] font-mono font-bold text-[#64ffda] uppercase select-none transition-all shadow-sm">
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
          <div className="liquid-glass group rounded-2xl p-5 hover:border-[#64ffda]/50 hover:shadow-[0_0_35px_rgba(100,255,218,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[11px] tracking-wider text-[#8892b0] uppercase group-hover:text-[#ccd6f6] transition-colors mb-3">
              Profile Photo 2
            </span>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-[#64ffda] flex items-center justify-center bg-black/50 backdrop-blur-md mb-4 shadow-xl transition-all">
              <img src={avatar2Preview} alt="Avatar 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#64ffda]/15 hover:bg-[#64ffda]/25 border border-[#64ffda]/40 hover:border-[#64ffda] rounded-xl cursor-pointer text-[10px] font-mono font-bold text-[#64ffda] uppercase select-none transition-all shadow-sm">
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
          <div className="liquid-glass group rounded-2xl p-5 hover:border-[#64ffda]/50 hover:shadow-[0_0_35px_rgba(100,255,218,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[11px] tracking-wider text-[#8892b0] uppercase group-hover:text-[#ccd6f6] transition-colors mb-3">
              Official CV PDF
            </span>
            <div className="w-20 h-20 rounded-2xl border-2 border-white/20 group-hover:border-[#64ffda] flex flex-col items-center justify-center bg-black/50 backdrop-blur-md mb-4 shadow-xl transition-all">
              <FileText className="h-8 w-8 text-[#64ffda]" />
              {resumePreview && (
                <a 
                  href={resumePreview} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] font-mono text-[#64ffda] underline truncate max-w-[65px] block mt-1 hover:text-white"
                >
                  PREVIEW
                </a>
              )}
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#64ffda]/15 hover:bg-[#64ffda]/25 border border-[#64ffda]/40 hover:border-[#64ffda] rounded-xl cursor-pointer text-[10px] font-mono font-bold text-[#64ffda] uppercase select-none transition-all shadow-sm">
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

          {/* 5. Social Share OG Image */}
          <div className="liquid-glass group rounded-2xl p-5 hover:border-[#64ffda]/50 hover:shadow-[0_0_35px_rgba(100,255,218,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-[11px] tracking-wider text-[#8892b0] uppercase group-hover:text-[#ccd6f6] transition-colors mb-3">
              Social OG Image
            </span>
            <div className="w-24 h-20 rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-[#64ffda] flex items-center justify-center bg-black/50 backdrop-blur-md mb-4 shadow-xl transition-all">
              <img src={ogPreview} alt="Social OG" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#64ffda]/15 hover:bg-[#64ffda]/25 border border-[#64ffda]/40 hover:border-[#64ffda] rounded-xl cursor-pointer text-[10px] font-mono font-bold text-[#64ffda] uppercase select-none transition-all shadow-sm">
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
