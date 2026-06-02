// Web Audio API Sound Synthesis Engine
// Pure-logic synthesized retro electronic SFX. Zero asset downloads, 100% SSR-safe.

let audioCtx: AudioContext | null = null;
let isAudioEnabled = false;

// Initialize isAudioEnabled safely client-side
if (typeof window !== "undefined") {
  const cached = localStorage.getItem("navie-audio-enabled");
  // Default to true but verify on gesture, or default to false for politeness
  isAudioEnabled = cached !== null ? cached === "true" : false;
}

/**
 * Lazy initializer for AudioContext to bypass strict browser autoplay security policies.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Cross-browser AudioContext initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  // Resume context if suspended by browser autoplay policy
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  
  return audioCtx;
}

/**
 * Checks if sound effects should play
 */
export function getAudioEnabled(): boolean {
  return isAudioEnabled;
}

/**
 * Toggles the audio engine globally and persists the preference
 */
export function setAudioEnabled(enabled: boolean): void {
  isAudioEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("navie-audio-enabled", String(enabled));
  }
  if (enabled) {
    getAudioContext(); // Warm up context
  }
}

/**
 * 1. playClick: High-frequency cybernetic terminal keypress square-wave pop.
 */
export function playClick(): void {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(800, time);
    // Exponential decay sweep
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.04);

    gainNode.gain.setValueAtTime(0.04, time); // Low volume click
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  } catch (e) {
    // Silently handle any browser Web Audio blocks
  }
}

/**
 * 2. playHover: Soft, low-frequency triangular pulse for cards and badges hovers.
 */
export function playHover(): void {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(70, time + 0.08);

    gainNode.gain.setValueAtTime(0.06, time); // Subtle ambient hover pulse
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.09);
  } catch (e) {
    // Safe fallback
  }
}

/**
 * 3. playSuccess: Rising dual-sine wave synthesizer sweep for successful actions.
 */
export function playSuccess(): void {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const time = ctx.currentTime;
    
    // First high note (C5 -> 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, time);
    gain1.gain.setValueAtTime(0.05, time);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(time);
    osc1.stop(time + 0.13);

    // Second higher note (E5 -> 659.25 Hz) after brief delay
    const delay = 0.07;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, time + delay);
    gain2.gain.setValueAtTime(0.05, time + delay);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + delay + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.start(time + delay);
    osc2.stop(time + delay + 0.19);
  } catch (e) {
    // Safe fallback
  }
}

/**
 * 4. playGlitch: Synthesizes a sweeping lowpass frequency-modulated glitch sweep.
 */
export function playGlitch(): void {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, time);
    osc.frequency.linearRampToValueAtTime(450, time + 0.15);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.25);

    gainNode.gain.setValueAtTime(0.025, time); // Faint modulated glitch sound
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.26);
  } catch (e) {
    // Safe fallback
  }
}
