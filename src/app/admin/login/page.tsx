"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Shield, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { triggerSound } = useTactileAudio();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    triggerSound("click");

    if (!supabase) {
      setErrorMsg("Supabase client is not configured. Check environment variables.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        setSuccessMsg("Registration successful! Check your email for confirmation, or try signing in if email verification is disabled.");
        triggerSound("success");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        triggerSound("success");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An authentication error occurred.");
      triggerSound("glitch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#64ffda]/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00e5ff]/5 rounded-full blur-[120px] -z-10" />

      {/* Cybernetic Grid Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Terminal Header */}
        <div className="glass-card rounded-t-2xl border border-white/10 border-b-0 px-6 py-3 bg-[#112240]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-xs text-[#8892b0] tracking-wider">SECURE_GATEWAY_v1.2</span>
        </div>

        {/* Login Body */}
        <div className="glass-card rounded-b-2xl border border-white/10 p-8 bg-[#0a192f]/95 backdrop-blur-md shadow-[0_12px_40px_rgba(2,12,27,0.8)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(100,255,218,0.15)] animate-pulse">
              <Shield className="h-8 w-8 text-[#64ffda]" />
            </div>
            <h1 className="text-2xl font-bold text-center tracking-tight text-[#ccd6f6]">
              {isSignUp ? "Create Administrator" : "Control Panel Login"}
            </h1>
            <p className="text-xs text-[#8892b0] mt-1 text-center font-mono uppercase tracking-widest">
              {isSignUp ? "Setup secure DB credentials" : "Authorize session credentials"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-[#8892b0] uppercase tracking-wider mb-2">
                Identity E-Mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8892b0]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@divinethedev.com"
                  className="w-full bg-[#112240] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[#ccd6f6] placeholder-[#8892b0]/55 focus:outline-none focus:border-[#64ffda] focus:shadow-[0_0_15px_rgba(100,255,218,0.1)] transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8892b0] uppercase tracking-wider mb-2">
                Access Token / Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8892b0]">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#112240] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[#ccd6f6] placeholder-[#8892b0]/55 focus:outline-none focus:border-[#64ffda] focus:shadow-[0_0_15px_rgba(100,255,218,0.1)] transition-all font-mono text-sm"
                />
              </div>
            </div>

            <SystemAlert type="error" message={errorMsg} />
            <SystemAlert type="success" message={successMsg} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda] text-[#64ffda] font-mono rounded-xl py-3.5 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(100,255,218,0.25)] transition duration-300 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  {isSignUp ? "INITIALIZE DB PORTAL" : "ESTABLISH SESSION"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Setup / Register Switch toggle */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => {
                triggerSound("click");
                setIsSignUp(!isSignUp);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-xs text-[#8892b0] hover:text-[#64ffda] transition duration-200 font-mono uppercase tracking-widest"
            >
              {isSignUp 
                ? "▸ Returning operator? Sign in here" 
                : "▸ Setup initial administrator profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
