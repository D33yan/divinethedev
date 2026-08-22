"use client";

import { playClick, playSuccess, playGlitch } from "@/lib/audio";

export function useTactileAudio() {
  const triggerSound = (type: "click" | "success" | "glitch") => {
    try {
      if (type === "click") playClick();
      else if (type === "success") playSuccess();
      else if (type === "glitch") playGlitch();
    } catch (e) {
      // Audio might be unmounted or blocked by user action
    }
  };

  return { triggerSound };
}
