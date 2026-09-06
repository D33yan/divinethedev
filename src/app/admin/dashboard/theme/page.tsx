"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Loader2, Palette, Save, RefreshCw, Eye } from "lucide-react";

export default function ThemeSettingsManager() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Theme states
  const [accentColor, setAccentColor] = useState("rgb(100, 255, 218)");
  const [darkBgColor, setDarkBgColor] = useState("#000000");
  const [lightBgColor, setLightBgColor] = useState("#f6f8fa");
  const [presets, setPresets] = useState<string[]>([
    "rgb(100, 255, 218)", // Teal
    "rgb(168, 85, 247)", // Purple
    "rgb(59, 130, 246)", // Blue
    "rgb(16, 185, 129)", // Emerald
    "rgb(245, 158, 11)"  // Amber
  ]);

  // Preview helper state for color checker mockup
  const [previewMode, setPreviewMode] = useState<"dark" | "light">("dark");

  const fetchThemeSettings = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "primary")
        .single();

      if (err) throw err;

      if (data) {
        if (data.accent_color) setAccentColor(data.accent_color);
        if (data.dark_bg_color) setDarkBgColor(data.dark_bg_color);
        if (data.light_bg_color) setLightBgColor(data.light_bg_color);
        if (data.accent_presets) {
          const parsed = typeof data.accent_presets === "string"
            ? JSON.parse(data.accent_presets)
            : data.accent_presets;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPresets(parsed.slice(0, 5)); // Limit to exactly 5 elements
          }
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to load theme settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const handlePresetChange = (index: number, val: string) => {
    const updated = [...presets];
    updated[index] = val;
    setPresets(updated);
  };

  const handleSaveTheme = async () => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase
        .from("site_settings")
        .update({
          accent_color: accentColor,
          dark_bg_color: darkBgColor,
          light_bg_color: lightBgColor,
          accent_presets: JSON.stringify(presets)
        })
        .eq("id", "primary");

      if (err) throw err;

      setSuccess("Theme settings saved successfully! Page accent colors updated sitewide.");
      triggerSound("success");
      
      // Hot-apply variables to the admin view immediately
      const root = document.documentElement;
      root.style.setProperty("--color-accent", accentColor);
      const rgbMatch = accentColor.match(/\d+,\s*\d+,\s*\d+/);
      if (rgbMatch) {
        root.style.setProperty("--color-accent-rgb", rgbMatch[0]);
      }
      root.style.setProperty("--bg-navy-custom", darkBgColor);
      root.style.setProperty("--bg-white-custom", lightBgColor);
    } catch (err: any) {
      setError(err.message || "Could not save theme settings.");
      triggerSound("glitch");
    } finally {
      setSaving(false);
    }
  };

  // Convert RGB string representation e.g. "rgb(100, 255, 218)" to hex color for picker
  const rgbToHex = (rgbStr: string): string => {
    const match = rgbStr.match(/\d+/g);
    if (!match || match.length < 3) return "#64ffda";
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert hex color picker value back to "rgb(r, g, b)"
  const hexToRgb = (hexStr: string): string => {
    const r = parseInt(hexStr.slice(1, 3), 16);
    const g = parseInt(hexStr.slice(3, 5), 16);
    const b = parseInt(hexStr.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-8">
      {/* Cyber Header Banner */}
      <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-2xl">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.2)]">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2.5">
                <span>THEME_&_ACCENT_ENGINE</span>
              </h1>
              <p className="text-xs text-[#8892b0] mt-0.5 font-mono uppercase tracking-widest">
                CUSTOMIZE REAL-TIME NEON ACCENTS, BASE CANVASES & PALETTES
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveTheme}
            disabled={saving || !isAdmin}
            className="flex items-center gap-2 bg-[#64ffda] text-black px-5 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-[#64ffda]/90 transition-all shadow-md shadow-[#64ffda]/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>SAVE_THEME_CONFIG</span>
              </>
            )}
          </button>
        </div>
      </div>

      <SystemAlert type="error" message={error} />
      <SystemAlert type="success" message={success} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-[#64ffda] animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customizations Controls */}
          <div className="space-y-6">
            {/* Background Colors Control Card */}
            <div className="liquid-glass rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#64ffda]" />
                <span>BACKGROUND_SCHEMES</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 text-left font-mono text-xs">
                <div className="space-y-2">
                  <label className="text-[10px] text-[#8892b0] uppercase tracking-wider block font-bold">Dark Mode Base Background</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={darkBgColor}
                      onChange={(e) => setDarkBgColor(e.target.value)}
                      className="w-10 h-10 border border-white/15 rounded-lg bg-transparent cursor-pointer overflow-hidden p-0"
                    />
                    <input
                      type="text"
                      value={darkBgColor}
                      onChange={(e) => setDarkBgColor(e.target.value)}
                      className="liquid-glass-input flex-1 rounded-lg px-3 py-2 text-[#ccd6f6] outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-[#8892b0] uppercase tracking-wider block font-bold">Light Mode Base Background</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={lightBgColor}
                      onChange={(e) => setLightBgColor(e.target.value)}
                      className="w-10 h-10 border border-white/15 rounded-lg bg-transparent cursor-pointer overflow-hidden p-0"
                    />
                    <input
                      type="text"
                      value={lightBgColor}
                      onChange={(e) => setLightBgColor(e.target.value)}
                      className="liquid-glass-input flex-1 rounded-lg px-3 py-2 text-[#ccd6f6] outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Presets Control Card */}
            <div className="liquid-glass rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6]">ACCENT_COLOR_PRESETS (LIMIT 5)</h2>
              <p className="text-xs text-[#8892b0] leading-relaxed">
                Define 5 presets of accent color. Click on a color bubble below to assign it as the active sitewide accent color.
              </p>

              {/* Accent Color Preset Picker bubbles */}
              <div className="flex flex-wrap gap-4 items-center justify-start py-2">
                {presets.map((preset, idx) => {
                  const isActive = accentColor === preset;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => {
                          setAccentColor(preset);
                          triggerSound("click");
                        }}
                        className={`w-12 h-12 rounded-full border-2 transition-transform duration-300 ${
                          isActive ? "border-white scale-110 shadow-lg shadow-white/10" : "border-transparent"
                        }`}
                        style={{ backgroundColor: preset }}
                        title={`Select Accent Color preset #${idx + 1}`}
                      />
                      <input
                        type="color"
                        value={rgbToHex(preset)}
                        onChange={(e) => handlePresetChange(idx, hexToRgb(e.target.value))}
                        className="w-8 h-6 border border-white/10 rounded cursor-pointer p-0 overflow-hidden bg-transparent mt-1"
                        title={`Edit color preset #${idx + 1}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Active Color Preview value */}
              <div className="pt-2 border-t border-white/5 font-mono text-xs flex justify-between items-center text-left">
                <div>
                  <span className="text-[#8892b0]">ACTIVE ACCENT COLOR:</span>
                  <span className="text-white block font-bold mt-0.5">{accentColor}</span>
                </div>
                <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: accentColor }} />
              </div>
            </div>

            <button
              onClick={handleSaveTheme}
              disabled={saving || !isAdmin}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#64ffda] text-black hover:bg-[#64ffda]/80 font-bold font-mono text-xs py-3 px-4 shadow-lg shadow-[#64ffda]/10 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>SAVE_THEME_CONFIGURATION</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Color Checker Mockup Preview */}
          <div className="space-y-4">
            <div className="liquid-glass-panel rounded-2xl p-6 space-y-4 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-mono text-[#ccd6f6] flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#64ffda]" />
                  <span>COLOR_CHECKER_PREVIEW</span>
                </h2>
                
                {/* Mode switcher tabs */}
                <div className="flex rounded-lg bg-black/40 p-1 border border-white/5">
                  <button
                    onClick={() => setPreviewMode("dark")}
                    className={`px-3 py-1 font-mono text-[10px] font-bold rounded-md transition cursor-pointer ${
                      previewMode === "dark" ? "bg-[#64ffda] text-black" : "text-[#8892b0] hover:text-white"
                    }`}
                  >
                    DARK
                  </button>
                  <button
                    onClick={() => setPreviewMode("light")}
                    className={`px-3 py-1 font-mono text-[10px] font-bold rounded-md transition cursor-pointer ${
                      previewMode === "light" ? "bg-white text-black" : "text-[#8892b0] hover:text-white"
                    }`}
                  >
                    LIGHT
                  </button>
                </div>
              </div>

              {/* Mockup Canvas */}
              <div 
                className="flex-1 min-h-[300px] border border-white/10 rounded-xl p-6 flex flex-col justify-between text-left transition-colors duration-300 relative overflow-hidden"
                style={{ backgroundColor: previewMode === "dark" ? darkBgColor : lightBgColor }}
              >
                {/* Simulated Glow Spotlight */}
                <div 
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-colors duration-300 pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="space-y-4 relative z-10">
                  <span 
                    className="font-mono text-[9px] font-bold uppercase tracking-wider block"
                    style={{ color: accentColor }}
                  >
                    01. Project Showcase Preview
                  </span>
                  
                  <h3 
                    className={`text-xl font-bold font-mono tracking-tight leading-tight ${
                      previewMode === "dark" ? "text-[#ccd6f6]" : "text-neutral-900"
                    }`}
                  >
                    FitTrack Health PWA
                  </h3>
                  
                  <p 
                    className={`text-xs leading-relaxed ${
                      previewMode === "dark" ? "text-[#8892b0]" : "text-neutral-600"
                    }`}
                  >
                    A high-performance offline health suite. Integrates WebRTC EAN scanners and hardware sensors inside a glassmorphic frame.
                  </p>
                </div>

                {/* Mock buttons using preview values */}
                <div className="mt-8 flex gap-3 relative z-10 font-mono text-[10px]">
                  <button 
                    className="px-4 py-2 border rounded font-bold transition cursor-default"
                    style={{ 
                      borderColor: accentColor,
                      color: previewMode === "dark" ? accentColor : "#000",
                      backgroundColor: accentColor + "1a" // 10% opacity
                    }}
                  >
                    LAUNCH_PREVIEW
                  </button>
                  <button 
                    className={`px-4 py-2 border rounded font-bold cursor-default transition ${
                      previewMode === "dark" ? "border-white/10 text-white/60" : "border-black/10 text-black/60"
                    }`}
                  >
                    SOURCE_CODE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
