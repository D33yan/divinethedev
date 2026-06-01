"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, Laptop, Tablet, Smartphone, ExternalLink, Lock } from "lucide-react";

export function BuiltInBrowser() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const handleOpenBrowser = (e: Event) => {
      const customEvent = e as CustomEvent<{ url: string; title: string }>;
      if (customEvent.detail?.url) {
        setUrl(customEvent.detail.url);
        setTitle(customEvent.detail.title || "Project Deployment");
        setIsOpen(true);
        setViewMode("desktop");
        setIsLoading(true);
      }
    };

    window.addEventListener("open-project-browser", handleOpenBrowser);
    return () => {
      window.removeEventListener("open-project-browser", handleOpenBrowser);
    };
  }, []);

  // Prevent background scrolling when browser is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setUrl("");
  };

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Determine iframe container width classes depending on selected viewport frame
  let frameWidthClass = "w-full h-full";
  if (viewMode === "tablet") {
    frameWidthClass = "w-[768px] max-w-full h-[95%] border-x border-white/10 rounded-xl shadow-[0_24px_50px_rgba(0,0,0,0.6)]";
  } else if (viewMode === "mobile") {
    frameWidthClass = "w-[380px] max-w-full h-[88%] border border-white/15 rounded-[36px] shadow-[0_24px_50px_rgba(0,0,0,0.6)]";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b14]/75 p-3 backdrop-blur-md md:p-6"
        >
          {/* Main Browser Window Frame */}
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1222] shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
          >
            {/* Top Bar Chrome (macOS style + URL Address Bar + Viewport Toggles) */}
            <div className="flex shrink-0 flex-col gap-3 border-b border-white/10 bg-[#090e1a]/95 px-4 py-3 md:flex-row md:items-center md:justify-between">
              
              {/* Left Column: Window Controls & Title */}
              <div className="flex items-center justify-between md:justify-start gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5252]/80 hover:bg-[#ff5252]"
                    aria-label="Close browser"
                  >
                    <X className="h-2 w-2 opacity-0 group-hover:opacity-100 text-black/70 font-bold" />
                  </button>
                  <div className="h-3.5 w-3.5 rounded-full bg-[#ffab00]/70" />
                  <div className="h-3.5 w-3.5 rounded-full bg-[#00e676]/70" />
                </div>
                <span className="font-sans text-xs font-semibold text-[#ccd6f6] tracking-wide">
                  {title} - Sandbox OS
                </span>
              </div>

              {/* Middle Column: SSL Address Bar */}
              <div className="flex flex-1 items-center gap-2 max-w-xl md:mx-4">
                <button
                  onClick={handleReload}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-[#8892b0] hover:text-[#64ffda] hover:bg-white/10 transition"
                  aria-label="Reload frame"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>

                <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 font-mono text-[10px] text-[#8892b0] shadow-inner select-all">
                  <Lock className="h-3 w-3 text-[#64ffda] shrink-0" />
                  <span className="truncate text-[#64ffda]/80">{url}</span>
                </div>
              </div>

              {/* Right Column: Viewport Toggles & Open Externally */}
              <div className="flex items-center justify-between md:justify-end gap-3 border-t border-white/5 pt-2.5 md:border-none md:pt-0">
                {/* Viewport frames toggle buttons */}
                <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/5">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`flex h-7 px-2.5 items-center gap-1.5 rounded font-mono text-[10px] sm:text-xs transition ${
                      viewMode === "desktop"
                        ? "bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/20 shadow-[0_0_10px_rgba(100,255,218,0.1)] font-semibold"
                        : "text-[#8892b0] hover:text-[#ccd6f6]"
                    }`}
                    title="Desktop frame View"
                  >
                    <Laptop className="h-3 w-3" />
                    <span className="hidden md:inline">DESK</span>
                  </button>
                  <button
                    onClick={() => setViewMode("tablet")}
                    className={`flex h-7 px-2.5 items-center gap-1.5 rounded font-mono text-[10px] sm:text-xs transition ${
                      viewMode === "tablet"
                        ? "bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/20 shadow-[0_0_10px_rgba(100,255,218,0.1)] font-semibold"
                        : "text-[#8892b0] hover:text-[#ccd6f6]"
                    }`}
                    title="Tablet frame View"
                  >
                    <Tablet className="h-3 w-3" />
                    <span className="hidden md:inline">TAB</span>
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`flex h-7 px-2.5 items-center gap-1.5 rounded font-mono text-[10px] sm:text-xs transition ${
                      viewMode === "mobile"
                        ? "bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/20 shadow-[0_0_10px_rgba(100,255,218,0.1)] font-semibold"
                        : "text-[#8892b0] hover:text-[#ccd6f6]"
                    }`}
                    title="Mobile frame View"
                  >
                    <Smartphone className="h-3 w-3" />
                    <span className="hidden md:inline">MOB</span>
                  </button>
                </div>

                <button
                  onClick={handleOpenExternal}
                  className="flex h-8 px-3 items-center gap-1.5 rounded-lg border border-[#64ffda]/20 bg-[#64ffda]/5 font-mono text-[10px] sm:text-xs text-[#64ffda] hover:bg-[#64ffda]/15 transition cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>LAUNCH</span>
                </button>

                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#8892b0] hover:bg-white/5 hover:text-[#64ffda] hover:border-[#64ffda]/30 transition cursor-pointer"
                  title="Close sandbox browser"
                  aria-label="Close sandbox browser"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* Iframe Viewport Container */}
            <div className="relative flex-1 bg-[#070b14] flex items-center justify-center p-4 overflow-hidden">
              
              {/* Cybernetic HUD Loading Screen Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0c1222]/95"
                  >
                    {/* Pulsing core logo loader */}
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="absolute h-16 w-16 rounded-full border-2 border-dashed border-[#64ffda]/10 animate-[spin_10s_linear_infinite]" />
                      <div className="absolute h-12 w-12 rounded-full border border-dashed border-[#64ffda]/25 animate-[spin_5s_linear_infinite_reverse]" />
                      <div className="h-6 w-6 rounded-full bg-[#64ffda]/20 animate-ping" />
                      <div className="absolute h-3 w-3 rounded-full bg-[#64ffda]" />
                    </div>

                    <div className="font-mono text-xs text-[#64ffda] uppercase tracking-widest animate-pulse">
                      ESTABLISHING SANDBOX DEPLOYMENT STREAM...
                    </div>
                    
                    <div className="mt-3 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#64ffda] rounded-full animate-[shimmer_1.5s_infinite]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Secure frame shell */}
              <div className={`${frameWidthClass} transition-all duration-300 bg-white`}>
                <iframe
                  key={reloadKey}
                  src={url}
                  title={title}
                  onLoad={() => setIsLoading(false)}
                  className="h-full w-full border-none outline-none"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>

            </div>

            {/* Bottom Window Info Bar */}
            <div className="flex h-7 shrink-0 items-center justify-between border-t border-white/5 bg-[#090e1a] px-4 font-mono text-[9px] text-[#8892b0]">
              <span>SANDBOX STATUS: ONLINE // ISOLATED</span>
              <span className="hidden sm:inline">VIEWPORT FRAME: {viewMode.toUpperCase()}</span>
              <span>SECURE CONSOLE LINK</span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
