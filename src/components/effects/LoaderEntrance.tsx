"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoaderEntranceProps {
  onComplete: () => void;
}

const LOG_LINES = [
  { html: '<span class="text-[#a78bfa] font-bold">$ node init.js --name "Divine"</span>', progress: 10 },
  { html: '<span class="text-[rgba(255,255,255,0.35)]">▸ resolving identity...</span>', progress: 30 },
  { html: '<span class="text-[rgba(255,255,255,0.35)]">▸ compiling </span><span class="text-[#f5c518]">greatness.ts</span><span class="text-[rgba(255,255,255,0.35)]"> </span><span class="text-[#00ff9f]">✓</span>', progress: 55 },
  { html: '<span class="text-[rgba(255,255,255,0.35)]">▸ injecting destiny into runtime</span>', progress: 75 },
  { html: '<span class="text-[#00ff9f]">▸ BUILD SUCCESSFUL — no errors found</span>', progress: 90 }
];

const TARGET_NAME = "Divine";
const SCRAMBLE_CHARS = "01_$#@!%&{}[]<>";

interface Particle {
  x: number;
  y: number;
  speed: number;
  char: string;
  alpha: number;
}

export function LoaderEntrance({ onComplete }: LoaderEntranceProps) {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const glitchCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const [solvedNameHtml, setSolvedNameHtml] = useState<string>("");
  const [subLabelVisible, setSubLabelVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tiltStyle, setTiltStyle] = useState({ transform: "rotateX(0deg) rotateY(0deg)" });
  const [gridTranslate, setGridTranslate] = useState({ transform: "translate3d(0, 0, -100px) scale(1.1)" });
  const [isShaking, setIsShaking] = useState(false);

  // Use refs to store active timeouts/intervals to avoid leaks
  const activeTimers = useRef<NodeJS.Timeout[]>([]);
  const glitchActive = useRef(false);

  const setSafeTimeout = (callback: () => void, delay: number) => {
    const id = setTimeout(callback, delay);
    activeTimers.current.push(id);
    return id;
  };

  useEffect(() => {
    // 1. Grid Canvas Particle Orchestration
    const gridCanvas = gridCanvasRef.current;
    if (!gridCanvas) return;
    const gridCtx = gridCanvas.getContext("2d");
    if (!gridCtx) return;

    let gridWidth = (gridCanvas.width = window.innerWidth);
    let gridHeight = (gridCanvas.height = window.innerHeight);

    let particles: Particle[] = [];
    const initParticles = () => {
      gridWidth = gridCanvas.width = window.innerWidth;
      gridHeight = gridCanvas.height = window.innerHeight;
      
      particles = [];
      const colCount = Math.floor(gridWidth / 28);
      for (let i = 0; i < colCount; i += 2) {
        particles.push({
          x: i * 28,
          y: Math.random() * gridHeight,
          speed: 0.5 + Math.random() * 1.5,
          char: Math.random() > 0.5 ? "1" : "0",
          alpha: 0.05 + Math.random() * 0.15
        });
      }
    };

    initParticles();
    window.addEventListener("resize", initParticles);

    let animationId: number;
    const drawLoop = () => {
      gridCtx.clearRect(0, 0, gridWidth, gridHeight);

      // Draw Grid Matrix Lines
      gridCtx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      gridCtx.lineWidth = 0.5;

      for (let x = 0; x < gridWidth; x += 28) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridHeight);
        gridCtx.stroke();
      }

      for (let y = 0; y < gridHeight; y += 28) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridWidth, y);
        gridCtx.stroke();
      }

      // Draw Drifting Cyber Signals
      gridCtx.font = "9px Courier New, monospace";
      particles.forEach((p) => {
        gridCtx.fillStyle = `rgba(0, 255, 159, ${p.alpha})`;
        gridCtx.fillText(p.char, p.x + 8, p.y);

        p.y -= p.speed;
        if (p.y < 0) {
          p.y = gridHeight;
          p.char = Math.random() > 0.5 ? "1" : "0";
        }
      });

      animationId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      window.removeEventListener("resize", initParticles);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 2. Glitch Screen Slicer Loop Trigger
  const triggerGlitch = (duration: number) => {
    if (glitchActive.current) return;
    glitchActive.current = true;
    setIsShaking(true);

    const glitchCanvas = glitchCanvasRef.current;
    if (!glitchCanvas) return;
    const glitchCtx = glitchCanvas.getContext("2d");
    if (!glitchCtx) return;

    glitchCanvas.width = window.innerWidth;
    glitchCanvas.height = window.innerHeight;

    const startTime = performance.now();
    let glitchFrameId: number;

    const renderSlices = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      glitchCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (elapsed < duration) {
        for (let i = 0; i < 4; i++) {
          const h = 2 + Math.random() * 8;
          const y = Math.random() * window.innerHeight;
          const xOffset = -15 + Math.random() * 30;

          const color = Math.random() > 0.5 ? "rgba(0, 255, 159, 0.18)" : "rgba(255, 255, 255, 0.18)";
          glitchCtx.fillStyle = color;
          glitchCtx.fillRect(xOffset, y, window.innerWidth, h);
        }
        glitchFrameId = requestAnimationFrame(renderSlices);
      } else {
        glitchCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        setIsShaking(false);
        glitchActive.current = false;
      }
    };

    glitchFrameId = requestAnimationFrame(renderSlices);
  };

  // 3. 3D Mouse Parallax Tilt Handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;

    const tiltX = -dy * 25;
    const tiltY = dx * 25;

    setTiltStyle({
      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    });

    setGridTranslate({
      transform: `translate3d(${-dx * 45}px, ${-dy * 45}px, -100px) scale(1.15)`
    });
  };

  // Helper to draw color solved letters in scramble reveals
  const renderNameHtmlString = (str: string) => {
    let outputHTML = "";
    for (let i = 0; i < str.length; i++) {
      if (i === 0) {
        outputHTML += `<span class="text-[#00ff9f] drop-shadow-[0_0_10px_rgba(0,255,159,0.4)]">${str[i]}</span>`;
      } else {
        if (TARGET_NAME[i] && str[i] === TARGET_NAME[i]) {
          outputHTML += `<span class="text-white">${str[i]}</span>`;
        } else {
          outputHTML += `<span class="text-[rgba(255,255,255,0.35)]">${str[i]}</span>`;
        }
      }
    }
    setSolvedNameHtml(outputHTML);
  };

  // 4. Sequence Orchestrator
  useEffect(() => {
    // Inject logs sequentially with random staggered delays
    let currentDelay = 0;
    const activeLogs: string[] = [];

    LOG_LINES.forEach((line) => {
      currentDelay += 300 + Math.random() * 100;
      setSafeTimeout(() => {
        activeLogs.push(line.html);
        setLogs([...activeLogs]);
        setProgress(line.progress);
      }, currentDelay);
    });

    // Solve Identity Reveal Scrambler
    setSafeTimeout(() => {
      let currentResolved = "";
      const nameLength = TARGET_NAME.length;

      const solveLetter = (letterIndex: number) => {
        if (letterIndex >= nameLength) {
          // Resolve sequence complete!
          setProgress(100);

          setSafeTimeout(() => {
            setSubLabelVisible(true);
            triggerGlitch(220);

            // Auto complete and slide out loader after brief delay
            setSafeTimeout(() => {
              onComplete();
            }, 1000);
          }, 200);
          return;
        }

        let cycle = 0;
        const targetChar = TARGET_NAME[letterIndex];

        const scrambleCycle = () => {
          if (cycle < 3) {
            const randChar = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            renderNameHtmlString(currentResolved + randChar);
            cycle++;
            setSafeTimeout(scrambleCycle, 55);
          } else {
            currentResolved += targetChar;
            renderNameHtmlString(currentResolved);
            triggerGlitch(80);

            const stepProgress = 90 + ((letterIndex + 1) / nameLength) * 10;
            setProgress(stepProgress);

            setSafeTimeout(() => {
              solveLetter(letterIndex + 1);
            }, 100);
          }
        };

        scrambleCycle();
      };

      solveLetter(0);
    }, currentDelay + 450);

    return () => {
      activeTimers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden font-mono"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
    >
      {/* HUD System Overlays */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9999] opacity-85" 
        style={{
          background: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)",
          backgroundSize: "100% 4px"
        }}
      />
      <div 
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          background: "radial-gradient(circle, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)"
        }}
      />

      {/* Grid Canvas */}
      <canvas 
        ref={gridCanvasRef} 
        id="gridCanvas" 
        className="pointer-events-none fixed inset-0 z-1 transition-transform duration-100 ease-out"
        style={{ ...gridTranslate, transformStyle: "preserve-3d" }}
      />

      {/* Glitch Overlay Canvas */}
      <canvas ref={glitchCanvasRef} className="pointer-events-none fixed inset-0 z-[9990]" />

      {/* Interactive Card wrapper */}
      <div className="relative z-10 flex flex-col items-center gap-8" style={{ transformStyle: "preserve-3d" }}>
        <div
          ref={cardRef}
          style={{ ...tiltStyle, transformStyle: "preserve-3d" }}
          className={`relative w-[380px] rounded-[10px] border border-white/12 bg-black p-[20px_24px] shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_40px_rgba(167,139,250,0.05),inset_0_0_20px_rgba(255,255,255,0.02)] transition-all duration-100 ease-out ${
            isShaking ? "animate-[card-shake_0.15s_infinite]" : ""
          }`}
        >
          {/* Shifting edge border gradient glow */}
          <div 
            className="pointer-events-none absolute inset-[-1px] rounded-[10px] p-[1px] opacity-80"
            style={{
              background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(0,255,159,0.15))",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }}
          />

          {/* Window Chrome bar */}
          <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-[18px]" style={{ transform: "translateZ(25px)" }}>
            <div className="flex gap-1.5">
              <span className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
              <span className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
              <span className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
            </div>
            <div className="text-[10px] tracking-[1px] lowercase text-white/30">
              divine_the_dev — init
            </div>
          </div>

          {/* Terminal Console Logs */}
          <div className="flex flex-col gap-1 min-h-[110px]" style={{ transform: "translateZ(15px)" }}>
            {logs.map((logHtml, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-[11px] leading-[2]"
                dangerouslySetInnerHTML={{ __html: logHtml }}
              />
            ))}
          </div>

          {/* Identity solved sequence reveal */}
          <div className="mt-3.5 pt-3.5 border-t border-dashed border-white/6" style={{ transform: "translateZ(28px)" }}>
            <div className="flex items-center font-bold text-base h-6 relative select-none">
              <span dangerouslySetInnerHTML={{ __html: solvedNameHtml }} />
              <span className="inline-block w-[3px] height-[15px] bg-[#00ff9f] shadow-[0_0_8px_rgba(0,255,159,0.7)] ml-1 animate-[blink_0.7s_infinite_steps(1)]" style={{ height: "16px" }} />
            </div>
            <div className={`text-[11px] text-[rgba(167,139,250,0.7)] tracking-[5px] lowercase mt-1.5 transition-all duration-500 ease-out translate-y-1 ${
              subLabelVisible ? "opacity-100 translate-y-0" : "opacity-0"
            }`}>
              the dev
            </div>
          </div>

          {/* Custom linear Loading bar */}
          <div className="mt-[18px] flex flex-col gap-2" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-end">
              <span className="text-[10px] font-bold text-[#00ff9f] drop-shadow-[0_0_6px_rgba(0,255,159,0.2)]">
                {Math.floor(progress)}%
              </span>
            </div>
            <div className="relative w-full h-[3px] rounded-[2px] bg-white/7 overflow-hidden">
              <div 
                style={{ width: `${progress}%` }}
                className="h-full rounded-[2px] bg-gradient-to-r from-[#a78bfa] to-[#00ff9f] shadow-[0_0_10px_rgba(0,255,159,0.3)] transition-all duration-100 ease-out"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS Inject for Blink/Shake */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes card-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 1px) rotate(-0.5deg); }
          40% { transform: translate(1px, -1px) rotate(0.3deg); }
          60% { transform: translate(-1px, -2px) rotate(-0.2deg); }
          80% { transform: translate(2px, 2px) rotate(0.4deg); }
        }
      `}</style>
    </div>
  );
}
