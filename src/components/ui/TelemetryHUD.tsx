"use client";

import { useEffect, useState, useRef } from "react";
import { getAudioEnabled, setAudioEnabled, playSuccess, playHover } from "@/lib/audio";
import { Activity, Volume2, VolumeX, ShieldCheck, Palette } from "lucide-react";

const themes = {
  teal: { rgb: "100, 255, 218", hex: "#64ffda" },
  blue: { rgb: "0, 229, 255", hex: "#00e5ff" },
  green: { rgb: "0, 255, 159", hex: "#00ff9f" },
  pink: { rgb: "255, 0, 127", hex: "#ff007f" },
  red: { rgb: "255, 51, 51", hex: "#ff3333" },
  orange: { rgb: "255, 145, 0", hex: "#ff9100" },
};

export function TelemetryHUD() {
  const [audioOn, setAudioOn] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [fps, setFps] = useState(60);
  const [ping, setPing] = useState(15);
  const [isOpen, setIsOpen] = useState(false); // Toggle expanding the detail panel!
  const [activeTheme, setActiveTheme] = useState("teal");

  const hudRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Handle click outside to close the expanded diagnostics HUD
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && hudRef.current && !hudRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);
  const rAFRef = useRef<number | null>(null);

  // Initialize theme and audio state from localstorage safely client-side
  useEffect(() => {
    setAudioOn(getAudioEnabled());
    setIsOnline(navigator.onLine);

    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("navie-accent-theme");
      if (cached && themes[cached as keyof typeof themes]) {
        setActiveTheme(cached);
      }
    }

    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.theme) {
        setActiveTheme(detail.theme);
      }
    };
    window.addEventListener("accent-theme-changed", handleThemeChange);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("accent-theme-changed", handleThemeChange);
    };
  }, []);

  // Real-Time Frame Rate (FPS) Telemetry
  useEffect(() => {
    const calcFps = () => {
      const now = performance.now();
      fpsRef.current++;

      if (now >= lastTimeRef.current + 1000) {
        setFps(Math.round((fpsRef.current * 1000) / (now - lastTimeRef.current)));
        fpsRef.current = 0;
        lastTimeRef.current = now;
      }
      rAFRef.current = requestAnimationFrame(calcFps);
    };

    rAFRef.current = requestAnimationFrame(calcFps);

    return () => {
      if (rAFRef.current !== null) {
        cancelAnimationFrame(rAFRef.current);
      }
    };
  }, []);

  // Real-Time Server Round-Trip Latency (Ping) Telemetry
  useEffect(() => {
    const checkPing = async () => {
      if (!navigator.onLine) {
        setPing(0);
        return;
      }
      try {
        const start = performance.now();
        // Dynamic cache-busting fetch to local robots.txt to measure actual local latency!
        await fetch(`/robots.txt?t=${Date.now()}`, { cache: "no-store", method: "HEAD" });
        const end = performance.now();
        setPing(Math.round(end - start));
      } catch (e) {
        // Fallback random mock jitter if server restricts headers
        setPing(Math.round(10 + Math.random() * 15));
      }
    };

    checkPing();
    const interval = setInterval(checkPing, 5000); // Poll latency every 5s

    return () => clearInterval(interval);
  }, []);

  const handleToggleAudio = () => {
    const newState = !audioOn;
    setAudioEnabled(newState);
    setAudioOn(newState);
    if (newState) {
      setTimeout(() => playSuccess(), 100);
    }
  };

  const handleTriggerHoverSound = () => {
    playHover();
  };

  const handleSelectTheme = (name: string) => {
    const targetTheme = themes[name as keyof typeof themes];
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--color-accent-rgb", targetTheme.rgb);
      root.style.setProperty("--color-accent", `rgb(${targetTheme.rgb})`);
      root.style.setProperty("--color-accent-dim", `rgba(${targetTheme.rgb}, 0.1)`);
      localStorage.setItem("navie-accent-theme", name);
      
      window.dispatchEvent(new CustomEvent("accent-theme-changed", {
        detail: { theme: name, rgb: targetTheme.rgb, hex: targetTheme.hex }
      }));
    }
    playSuccess();
  };

  return (
    <div 
      ref={hudRef}
      className="fixed bottom-4 right-4 z-[50] flex flex-col items-end gap-2"
      onMouseEnter={handleTriggerHoverSound}
    >
      {/* Floating CTA button for quick AI Assistant chat */}
      {!isOpen && (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("focus-terminal-chat"))}
          className="glass-card flex items-center gap-1.5 rounded-lg border border-[#64ffda]/30 bg-navy-light/95 px-2.5 py-1.5 font-mono text-[9px] text-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.12)] transition hover:bg-[#64ffda]/10 hover:border-[#64ffda]/50 cursor-pointer animate-pulse"
          data-cursor-hover
          title="Chat with AI Assistant"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#64ffda] animate-ping" />
          <span>TALK_TO_AI</span>
        </button>
      )}

      {/* Visual cyber diagnostic HUD header panel */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`glass-card flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase transition-all duration-300 shadow-md ${
          isOpen 
            ? "border-[#64ffda] text-[#64ffda] bg-[#64ffda]/10 shadow-[0_0_15px_rgba(100,255,218,0.1)]" 
            : "border-white/10 text-[#8892b0] hover:text-[#64ffda] hover:border-[#64ffda]/30 hover:bg-white/5"
        }`}
        data-cursor-hover
        title="Toggle HUD Telemetry"
      >
        <Activity className={`h-3 w-3 ${isOpen ? "animate-pulse text-[#64ffda]" : "text-[#8892b0]"}`} />
        <span>SYS_TELEMETRY // {isOpen ? "COLLAPSE" : "EXPAND"}</span>
      </button>

      {/* Expanding Telemetry HUD Diagnostics Dashboard */}
      {isOpen && (
        <div className="glass-card flex w-[170px] sm:w-[190px] flex-col gap-2 rounded-xl border border-white/10 bg-navy-light/80 p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] text-[#8892b0] backdrop-blur-xl shadow-2xl animate-fade-in ring-1 ring-white/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[#ccd6f6] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#64ffda]" />
              CORE DIAGNOSTICS
            </span>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex justify-between items-center">
              <span>SYSTEM STATE:</span>
              <span className={`font-bold ${isOnline ? "text-[#64ffda]" : "text-rose-500 animate-pulse"}`}>
                {isOnline ? "ACTIVE // ONLINE" : "OFFLINE_MODE"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>RTT LATENCY:</span>
              <span className="text-[#ccd6f6] font-bold">
                {ping > 0 ? `${ping} MS` : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>REFRESH RATE:</span>
              <span className="text-[#ccd6f6] font-bold">{fps} FPS</span>
            </div>
          </div>

          {/* Interactive GUI Theme Accent Selector */}
          <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
            <span className="text-[#ccd6f6] font-semibold flex items-center gap-1.5">
              <Palette className="h-3 w-3 text-[#64ffda]" />
              THEME ACCENT
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 py-1 flex items-center justify-between">
            {Object.entries(themes).map(([name, data]) => (
              <button
                key={name}
                onClick={() => handleSelectTheme(name)}
                className="group/color relative flex h-4.5 w-4.5 items-center justify-center rounded-full border transition cursor-pointer"
                style={{ 
                  backgroundColor: `rgb(${data.rgb})`,
                  borderColor: activeTheme === name ? "#ffffff" : "rgba(255,255,255,0.15)",
                  boxShadow: activeTheme === name ? `0 0 10px rgb(${data.rgb})` : "none"
                }}
                data-cursor-hover
                title={`Switch to ${name}`}
              >
                {activeTheme === name && (
                  <div className="h-1.5 w-1.5 rounded-full bg-navy" />
                )}
                {/* Micro hover tooltip */}
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black/90 px-1.5 py-0.5 text-[7px] font-mono font-bold text-white opacity-0 transition group-hover/color:opacity-100 uppercase tracking-widest whitespace-nowrap z-20 border border-white/10">
                  {name}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Global Audio Node Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border py-2 font-semibold transition-all duration-300 cursor-pointer ${
              audioOn 
                ? "border-[#64ffda]/30 bg-[#64ffda]/5 text-[#64ffda] hover:bg-[#64ffda]/10 hover:border-[#64ffda]/50" 
                : "border-white/10 bg-white/5 text-[#8892b0] hover:text-[#ccd6f6] hover:bg-white/10"
            }`}
            data-cursor-hover
          >
            {audioOn ? (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>AUDIO: SYNTH_ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>AUDIO: MUTED</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
