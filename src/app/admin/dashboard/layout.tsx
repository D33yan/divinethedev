"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { 
  ShieldAlert, ShieldCheck, LayoutDashboard, Briefcase, 
  FolderGit2, Cpu, GraduationCap, LogOut, ArrowLeft, Loader2, Mail,
  Sparkles, MessageSquare, Palette
} from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  email: string;
  role: "admin" | "viewer";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { triggerSound } = useTactileAudio();

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
          // If profile profile doesn't exist, create default viewer profile
          console.warn("Profile not found. Creating default profile.", profileError);
          const newProfile = {
            id: session.user.id,
            email: session.user.email || "",
            role: "viewer" as const
          };

          const { error: insertError } = await supabase
            .from("profiles")
            .insert(newProfile);

          if (!insertError) {
            setProfile(newProfile);
          } else {
            // Fallback
            setProfile(newProfile);
          }
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
      <div className="min-h-screen bg-[#0a192f] flex flex-col justify-center items-center font-mono text-[#ccd6f6]">
        <Loader2 className="h-10 w-10 text-[#64ffda] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#8892b0]">Establishing secure sync link...</p>
      </div>
    );
  }

  const roleColorClass = profile?.role === "admin" ? "text-[#64ffda]" : "text-amber-400";
  const roleText = profile?.role === "admin" ? "ADMINISTRATOR" : "GUEST_VIEWER";

  const menuItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/dashboard/projects", icon: FolderGit2 },
    { name: "Experiences", path: "/admin/dashboard/experience", icon: Briefcase },
    { name: "Skills", path: "/admin/dashboard/skills", icon: Cpu },
    { name: "Education & Certs", path: "/admin/dashboard/education", icon: GraduationCap },
    { name: "Services", path: "/admin/dashboard/services", icon: Sparkles },
    { name: "Testimonials", path: "/admin/dashboard/testimonials", icon: MessageSquare },
    { name: "Theme Settings", path: "/admin/dashboard/theme", icon: Palette },
    { name: "Inbox Messages", path: "/admin/dashboard/messages", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#070d19] text-[#ccd6f6] flex flex-col relative font-sans">
      {/* Top Banner Alert (RBAC state) */}
      <div className={`w-full py-2.5 px-6 border-b border-white/5 backdrop-blur-md flex items-center justify-between text-xs font-mono uppercase tracking-wider ${
        profile?.role === "admin" 
          ? "bg-[#64ffda]/5 text-[#64ffda]" 
          : "bg-amber-500/5 text-amber-400 border-amber-500/10"
      }`}>
        <div className="flex items-center gap-2">
          {profile?.role === "admin" ? (
            <ShieldCheck className="h-4 w-4 shrink-0" />
          ) : (
            <ShieldAlert className="h-4 w-4 shrink-0" />
          )}
          <span>
            [NODE_STATUS]: LOGGED IN AS <span className={`font-bold ${roleColorClass}`}>{roleText}</span> 
            {profile?.role !== "admin" && " // ALL WRITES/UPDATES MUTATIONS DISABLED"}
          </span>
        </div>
        <div className="hidden sm:block text-[#8892b0] lowercase">
          {profile?.email}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#0a192f] border-r border-white/5 flex flex-col justify-between py-6 shrink-0">
          <div className="space-y-6">
            <div className="px-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <Link 
                href="/" 
                onClick={() => triggerSound("click")}
                className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#8892b0] hover:text-[#64ffda] transition duration-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                PORTFOLIO
              </Link>
              <span className="font-mono text-[9px] bg-white/5 px-2 py-0.5 rounded text-[#8892b0]">
                v1.2.0
              </span>
            </div>

            <nav className="px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => triggerSound("click")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs tracking-wider transition-all ${
                      isActive 
                        ? "bg-[#64ffda]/10 text-[#64ffda] shadow-[inset_0_0_12px_rgba(100,255,218,0.05)] border border-[#64ffda]/20" 
                        : "text-[#8892b0] hover:bg-white/5 hover:text-[#ccd6f6] border border-transparent"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#64ffda]" : ""}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-3 pt-6 border-t border-white/5 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs tracking-wider text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-left"
            >
              <LogOut className="h-4 w-4" />
              TERMINATE_SESSION
            </button>
          </div>
        </aside>

        {/* Right Dashboard Area Content */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
          {/* Inject profile role in children props via React.cloneElement or render props if needed, 
              but in Client Components we can just fetch it or share via local React Context.
              Wait! Sharing via local context is clean, let's create a local context or just query Supabase locally 
              in each page component. Since session state is cached by Supabase client, query is instant and has no overhead! */}
          {children}
        </main>
      </div>
    </div>
  );
}
