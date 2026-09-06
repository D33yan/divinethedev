"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { 
  ShieldAlert, ShieldCheck, LayoutDashboard, Briefcase, 
  FolderGit2, Cpu, GraduationCap, LogOut, Loader2, Mail,
  Sparkles, MessageSquare, Palette, GitBranch, Globe, Menu, X, ExternalLink,
  Activity, Clock, Wifi, Volume2, VolumeX, Terminal, Layers
} from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  email: string;
  role: "admin" | "viewer";
}

const themePresets = {
  teal: { label: "Teal", rgb: "100, 255, 218", hex: "#64ffda" },
  cyan: { label: "Cyan", rgb: "0, 229, 255", hex: "#00e5ff" },
  green: { label: "Green", rgb: "0, 255, 159", hex: "#00ff9f" },
  pink: { label: "Pink", rgb: "255, 0, 127", hex: "#ff007f" },
  red: { label: "Crimson", rgb: "255, 51, 51", hex: "#ff3333" },
  orange: { label: "Solar", rgb: "255, 145, 0", hex: "#ff9100" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [ping, setPing] = useState(18);
  const [activeTheme, setActiveTheme] = useState("teal");
  const { triggerSound } = useTactileAudio();

  // Real-time ticking system clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time latency measurement
  useEffect(() => {
    const checkPing = async () => {
      try {
        const start = performance.now();
        await fetch(`/robots.txt?t=${Date.now()}`, { cache: "no-store", method: "HEAD" });
        const end = performance.now();
        setPing(Math.max(12, Math.round(end - start)));
      } catch {
        setPing(Math.round(14 + Math.random() * 8));
      }
    };
    checkPing();
    const pingInterval = setInterval(checkPing, 8000);
    return () => clearInterval(pingInterval);
  }, []);

  // Sync theme accent from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("navie-accent-theme");
      if (cached && themePresets[cached as keyof typeof themePresets]) {
        setActiveTheme(cached);
      }
    }
  }, []);

  const handleSelectTheme = (name: string) => {
    const target = themePresets[name as keyof typeof themePresets];
    if (!target) return;
    triggerSound("click");
    setActiveTheme(name);
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--color-accent-rgb", target.rgb);
      root.style.setProperty("--color-accent", `rgb(${target.rgb})`);
      root.style.setProperty("--color-accent-dim", `rgba(${target.rgb}, 0.1)`);
      localStorage.setItem("navie-accent-theme", name);
      window.dispatchEvent(new CustomEvent("accent-theme-changed", {
        detail: { theme: name, rgb: target.rgb, hex: target.hex }
      }));
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        console.warn("Supabase is not configured.");
        router.push("/admin/login");
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/admin/login");
          return;
        }

        // Fetch user role from profiles
        const { data: dbProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError || !dbProfile) {
          const newProfile = {
            id: session.user.id,
            email: session.user.email || "",
            role: "viewer" as const
          };

          const { error: insertError } = await supabase
            .from("profiles")
            .insert(newProfile);

          setProfile(!insertError ? newProfile : newProfile);
        } else {
          setProfile(dbProfile);
        }
      } catch (err) {
        console.error("Session verification failure:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) {
      triggerSound("click");
      await supabase.auth.signOut();
      triggerSound("glitch");
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col justify-center items-center font-mono text-[#ccd6f6] relative overflow-hidden">
        <div className="cyber-grid-bg absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative w-20 h-20 rounded-3xl bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda] mb-6 shadow-[0_0_50px_rgba(100,255,218,0.25)]">
          <Loader2 className="h-10 w-10 animate-spin text-[#64ffda]" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64ffda] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#64ffda]" />
          </span>
        </div>
        <p className="text-base uppercase tracking-widest text-[#64ffda] font-bold drop-shadow-[0_0_12px_rgba(100,255,218,0.4)]">
          ESTABLISHING_NEURAL_UPLINK...
        </p>
        <span className="text-xs text-[#8892b0] mt-2 font-mono tracking-wider">
          Connecting to Mission Control Core · Encrypted Channel
        </span>
      </div>
    );
  }

  const isAdmin = profile?.role === "admin";

  const navigationSections = [
    {
      category: "COMMAND & COMMS",
      items: [
        { num: "01", name: "Mission Overview", path: "/admin/dashboard", icon: LayoutDashboard },
        { num: "02", name: "Inbound Leads", path: "/admin/dashboard/messages", icon: Mail },
      ]
    },
    {
      category: "PORTFOLIO DATA MATRIX",
      items: [
        { num: "03", name: "Projects & Cases", path: "/admin/dashboard/projects", icon: FolderGit2 },
        { num: "04", name: "Experience Logs", path: "/admin/dashboard/experience", icon: Briefcase },
        { num: "05", name: "Skill Clusters", path: "/admin/dashboard/skills", icon: Cpu },
        { num: "06", name: "Education & Certs", path: "/admin/dashboard/education", icon: GraduationCap },
        { num: "07", name: "Client Services", path: "/admin/dashboard/services", icon: Sparkles },
        { num: "08", name: "Testimonials", path: "/admin/dashboard/testimonials", icon: MessageSquare },
        { num: "09", name: "Workflow Visualizer", path: "/admin/dashboard/workflows", icon: GitBranch },
      ]
    },
    {
      category: "SYSTEM CORE & SEO",
      items: [
        { num: "10", name: "Theme Engine", path: "/admin/dashboard/theme", icon: Palette },
        { num: "11", name: "SEO & CV Compiler", path: "/admin/dashboard/seo", icon: Globe },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#ccd6f6] flex flex-col relative font-sans selection:bg-[#64ffda]/25 selection:text-[#64ffda] overflow-x-hidden">
      {/* Ambient Cyber Grid & Glow Lights for Liquid Glass Refraction */}
      <div className="cyber-grid-bg fixed inset-0 opacity-30 pointer-events-none z-0" aria-hidden />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(100,255,218,0.08)_0%,transparent_70%)] blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)] blur-[150px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)] blur-[140px]" />
      </div>

      {/* Top Liquid Glass HUD Header Bar */}
      <header className="relative z-30 w-full border-b border-white/10 liquid-glass-panel px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-xs shadow-2xl">
        {/* Left: Mobile Toggle & Brand Node Indicator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-[#64ffda] hover:bg-white/10 transition"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64ffda] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#64ffda] shadow-[0_0_10px_#64ffda]" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#64ffda] font-bold tracking-widest text-xs hidden sm:inline drop-shadow-[0_0_8px_rgba(100,255,218,0.4)]">
                CORE_ACTIVE
              </span>
              <span className="text-white/20 hidden sm:inline">//</span>
              <span className="text-[#ccd6f6] tracking-widest text-xs uppercase font-bold flex items-center gap-1.5">
                NAVIE_MISSION_CONTROL
              </span>
            </div>
          </div>
        </div>

        {/* Center: Real-Time Telemetry & Theme Accent Switcher */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Ticking System Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-[#8892b0] text-[11px] shadow-inner">
            <Clock className="h-3.5 w-3.5 text-[#64ffda]" />
            <span className="font-bold text-[#ccd6f6]">{currentTime || "00:00:00"}</span>
            <span className="text-[9px] text-[#64ffda] uppercase font-bold tracking-wider">UTC+1</span>
          </div>

          {/* RTT Ping Latency */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-[11px] text-[#8892b0]">
            <Wifi className="h-3 w-3 text-[#64ffda] animate-pulse" />
            <span>RTT:</span>
            <span className="font-bold text-[#ccd6f6]">{ping}ms</span>
          </div>

          {/* Quick HUD Theme Accent Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/10">
            <Palette className="h-3 w-3 text-[#64ffda] mr-1" />
            {Object.entries(themePresets).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleSelectTheme(key)}
                className={`relative w-3.5 h-3.5 rounded-full transition-transform cursor-pointer hover:scale-125 ${
                  activeTheme === key ? "ring-2 ring-white scale-110 shadow-[0_0_8px_currentColor]" : "opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundColor: data.hex, color: data.hex }}
                title={`Theme: ${data.label}`}
              />
            ))}
          </div>
        </div>

        {/* Right: RBAC Status, User Identity & Live Site Link */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-wider font-bold transition-all shadow-sm ${
            isAdmin 
              ? "bg-[#64ffda]/10 border-[#64ffda]/40 text-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.15)]" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
            <span>{isAdmin ? "AUTH: ADMIN" : "AUTH: VIEWER"}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            onClick={() => triggerSound("click")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda]/30 text-xs text-[#64ffda] font-bold transition shadow-sm group cursor-pointer"
          >
            <span>LIVE_SITE</span>
            <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Left Navigation Sidebar (Desktop) */}
        <aside className="hidden md:flex w-72 liquid-glass-panel border-r border-white/10 flex-col justify-between py-6 shrink-0 shadow-2xl relative">
          <div className="space-y-6 overflow-y-auto px-4">
            {/* Header Operator Profile Pod */}
            <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-[#64ffda]/10 border border-[#64ffda]/40 flex items-center justify-center text-[#64ffda] font-mono font-bold text-sm shadow-[0_0_15px_rgba(100,255,218,0.2)]">
                  D
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#64ffda] border-2 border-[#050505]" />
                </div>
                <div className="truncate">
                  <span className="block font-mono text-xs font-bold text-[#ccd6f6] tracking-wider truncate">
                    DIVINE_NNAJI
                  </span>
                  <span className="block font-mono text-[9px] text-[#64ffda] tracking-widest uppercase">
                    ARCHITECT // ROOT
                  </span>
                </div>
              </div>
              <span className="font-mono text-[8px] bg-[#64ffda]/10 border border-[#64ffda]/30 px-2 py-0.5 rounded-full text-[#64ffda] font-bold">
                NODE_01
              </span>
            </div>

            {/* Categorized Menu Links */}
            <nav className="space-y-5">
              {navigationSections.map((sec) => (
                <div key={sec.category} className="space-y-1">
                  <span className="block px-3 font-mono text-[9px] tracking-widest text-[#8892b0]/70 uppercase font-bold">
                    {sec.category}
                  </span>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const isActive = pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => triggerSound("click")}
                          className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all duration-200 ${
                            isActive 
                              ? "bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/40 shadow-[0_0_25px_rgba(100,255,218,0.12)] font-bold backdrop-blur-md" 
                              : "text-[#8892b0] hover:bg-white/5 hover:text-[#ccd6f6] border border-transparent"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-[#64ffda] shadow-[0_0_12px_#64ffda]" />
                          )}
                          <span className={`text-[10px] font-mono ${isActive ? "text-[#64ffda] font-bold" : "text-[#8892b0]/50 group-hover:text-[#64ffda]"}`}>
                            {item.num}
                          </span>
                          <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#64ffda]" : "text-[#8892b0]"}`} />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* User Profile & Logout Deck */}
          <div className="px-4 pt-4 border-t border-white/10 space-y-3">
            <div className="liquid-glass flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono">
              <div className="w-8 h-8 rounded-xl bg-[#64ffda]/15 border border-[#64ffda]/40 flex items-center justify-center text-[#64ffda] font-bold text-xs shrink-0 shadow-[0_0_10px_rgba(100,255,218,0.15)]">
                {profile?.email ? profile.email[0].toUpperCase() : "D"}
              </div>
              <div className="flex-1 truncate">
                <span className="block text-[#ccd6f6] truncate text-[11px] font-bold">{profile?.email}</span>
                <span className="text-[9px] text-[#64ffda] block uppercase tracking-widest font-mono font-bold">
                  {profile?.role === "admin" ? "ROOT ADMINISTRATOR" : "GUEST VIEWER"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all text-center cursor-pointer shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>TERMINATE_SESSION</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-3xl flex flex-col animate-in fade-in duration-200">
            <div className="p-5 border-b border-white/10 flex items-center justify-between liquid-glass-panel">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#64ffda] animate-ping" />
                <span className="font-mono text-xs font-bold text-[#64ffda] uppercase tracking-wider">
                  MISSION_CONTROL_MENU
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-white/80 hover:text-white border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-4 overflow-y-auto liquid-glass">
              {navigationSections.map((sec) => (
                <div key={sec.category} className="space-y-1">
                  <span className="block px-2 font-mono text-[9px] tracking-widest text-[#8892b0]/70 uppercase font-bold">
                    {sec.category}
                  </span>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const isActive = pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => {
                            triggerSound("click");
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs tracking-wider transition-colors ${
                            isActive 
                              ? "bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/40 font-bold shadow-[0_0_15px_rgba(100,255,218,0.1)]" 
                              : "text-[#8892b0] hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="text-[10px] text-[#64ffda]">{item.num}</span>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#000000] space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>TERMINATE_SESSION</span>
              </button>
            </div>
          </div>
        )}

        {/* Right Dashboard Area Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
