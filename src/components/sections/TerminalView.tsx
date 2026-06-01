"use client";

import { useEffect, useRef, useState } from "react";
import { projects, siteConfig } from "@/lib/site";

interface TerminalLine {
  text: string;
  type: "system" | "input" | "success" | "error" | "primary" | "secondary" | "header";
}

interface TerminalViewProps {
  onSwitchToCards: () => void;
}

export function TerminalView({ onSwitchToCards }: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [inputVal, setInputVal] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: "NAVIE-OS [Version 1.0.4] Core Shell Terminal", type: "header" },
    { text: "(c) 2026 Divine Chibueze Nnaji. All rights reserved.", type: "system" },
    { text: "System diagnostic: STABLE // Core Data Science & AI node connected.", type: "system" },
    { text: "Type 'help' to view available commands, or 'gui' to return to visual mode.", type: "success" },
    { text: "", type: "system" },
  ]);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHacking, setIsHacking] = useState(false);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Focus input on click anywhere inside the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Keyboard command submission and history logic
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputVal.trim();
      if (!command) return;

      // Add to command lines
      const newLines = [...lines, { text: `guest@navie-os:~# ${command}`, type: "input" as const }];
      setLines(newLines);
      setInputVal("");

      // Add to command history
      const newHistory = [...history, command];
      setHistory(newHistory);
      setHistoryIndex(-1);

      // Execute command
      executeCommand(command, newLines);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputVal(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;

      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(newIndex);
        setInputVal(history[newIndex]);
      }
    }
  };

  // Shell Command Execution Engine
  const executeCommand = (cmdStr: string, currentLines: TerminalLine[]) => {
    // Strip optional leading slash to support both "/help" and "help"
    let normalized = cmdStr.trim();
    if (normalized.startsWith("/")) {
      normalized = normalized.substring(1);
    }

    const parts = normalized.toLowerCase().split(" ");
    const command = parts[0];
    const arg = parts[1];

    let output: TerminalLine[] = [];

    switch (command) {
      case "help":
        output = [
          { text: "AVAILABLE SHELL COMMANDS:", type: "success" },
          { text: "  ls / projects           - List all development projects by ID", type: "primary" },
          { text: "  cat <project_id>        - Display detailed retro Case Study for a project", type: "primary" },
          { text: "  open / run <project_id> - Launch the project inside the Sandbox Browser", type: "primary" },
          { text: "  source / code <id>      - Open the GitHub code repository in new tab", type: "primary" },
          { text: "  skills                  - Show interactive terminal skills profile & bars", type: "primary" },
          { text: "  about                   - Print server specifications and bio stats", type: "primary" },
          { text: "  contact                 - Print professional contact links & details", type: "primary" },
          { text: "  resume / cv             - Automate CV / Resume document secure download", type: "primary" },
          { text: "  hack                    - Activate dynamic system overrides simulation", type: "primary" },
          { text: "  gui                     - Switch view back to visual slider cards", type: "primary" },
          { text: "  clear                   - Clear terminal screen buffer", type: "primary" },
          { text: "  help                    - Show this command log utility", type: "primary" },
        ];
        break;

      case "ls":
      case "projects":
        output = [
          { text: "CATALOGED PROJECTS IN SYSTEM ARCHIVE:", type: "success" },
          ...projects.map((p) => ({
            text: `  [${p.id}] - ${p.title} (${p.tag})\n    Tech: ${p.tech.join(", ")}\n    Desc: ${p.description}`,
            type: "primary" as const,
          })),
          { text: "\nType 'cat <project_id>' to display a detailed case study (e.g. 'cat rebid').", type: "system" },
        ];
        break;

      case "cat": {
        if (!arg) {
          output = [{ text: "Error: No project specified. Usage: cat <project_id> (e.g. 'cat rebid')", type: "error" }];
          break;
        }

        const project = projects.find((p) => p.id === arg);
        if (!project) {
          output = [{ text: `Error: Project '${arg}' not found. Type 'ls' to see all valid IDs.`, type: "error" }];
          break;
        }

        output = [
          { text: `-------------------------------------------------------`, type: "system" },
          { text: `PROJECT DATA STREAM: ${project.title.toUpperCase()}`, type: "success" },
          { text: `Domain Focus:        ${project.tag}`, type: "secondary" },
          { text: `Engineering Stack:   ${project.tech.join(" // ")}`, type: "secondary" },
          { text: `-------------------------------------------------------`, type: "system" },
          { text: ``, type: "primary" },
          { text: `[THE PROBLEM CHALLENGE]`, type: "success" },
          { text: project.caseStudy.problem, type: "primary" },
          { text: ``, type: "primary" },
          { text: `[DEVELOPER APPROACH]`, type: "success" },
          { text: project.caseStudy.approach, type: "primary" },
          { text: ``, type: "primary" },
          { text: `[SOLUTION ARCHITECTURE BUILT]`, type: "success" },
          { text: project.caseStudy.built, type: "primary" },
          { text: ``, type: "primary" },
          { text: `[FINAL METRICS & RESULTS]`, type: "success" },
          { text: project.caseStudy.result, type: "primary" },
          { text: ``, type: "primary" },
          { text: `-------------------------------------------------------`, type: "system" },
          { 
            text: `Action Triggers: Type 'open ${project.id}' to launch, 'source ${project.id}' for GitHub.`, 
            type: "success" 
          },
        ];
        break;
      }

      case "open":
      case "run": {
        if (!arg) {
          output = [{ text: `Error: No project specified. Usage: ${command} <project_id>`, type: "error" }];
          break;
        }

        const project = projects.find((p) => p.id === arg);
        if (!project) {
          output = [{ text: `Error: Project '${arg}' not found.`, type: "error" }];
          break;
        }

        if (project.live) {
          window.dispatchEvent(new CustomEvent("open-project-browser", {
            detail: { url: project.live, title: project.title }
          }));
          output = [{ text: `Launching in-built sandbox browser stream for: ${project.title}`, type: "success" }];
        } else {
          output = [
            { text: `Diagnostic: Project '${project.title}' is a native app or offline tool. No live web URL.`, type: "error" },
            project.github 
              ? { text: `Type 'source ${project.id}' to review the mobile codebase on GitHub!`, type: "system" }
              : { text: "No source code available.", type: "secondary" }
          ];
        }
        break;
      }

      case "source":
      case "view":
      case "code": {
        if (!arg) {
          output = [{ text: `Error: No project specified. Usage: ${command} <project_id>`, type: "error" }];
          break;
        }

        const project = projects.find((p) => p.id === arg);
        if (!project) {
          output = [{ text: `Error: Project '${arg}' not found.`, type: "error" }];
          break;
        }

        const githubUrl = (project as any).github;
        if (githubUrl) {
          window.open(githubUrl, "_blank", "noopener,noreferrer");
          output = [{ text: `Launching GitHub code repository: ${githubUrl}`, type: "success" }];
        } else {
          output = [{ text: `Diagnostic: Source code for '${project.title}' is proprietary or offline.`, type: "error" }];
        }
        break;
      }

      case "skills":
        output = [
          { text: "GUEST SYSTEM PROFILE: TECH SKILLS MONITORS", type: "success" },
          { text: "  Languages   [████████████████] JavaScript, TypeScript, Python, PHP", type: "primary" },
          { text: "  Frontend    [██████████████]   Next.js, HTML5/CSS3, TailwindCSS", type: "primary" },
          { text: "  Backend     [████████████]     Node.js, Laravel APIs, SQL/NoSQL", type: "primary" },
          { text: "  AI & ML     [██████████████]   Scikit-Learn, NumPy, Data Modelling", type: "primary" },
          { text: "  Automation  [████████████████] n8n Orchestrator, Make, Zapier webhooks", type: "primary" },
          { text: "  Platforms   [████████████]     GoHighLevel, WordPress, Firebase", type: "primary" },
          { text: "  Design      [████████████]     Figma, UI/UX Wireframing, Adobe suite", type: "primary" },
          { text: "", type: "system" },
          { text: "EARLYCODE SYSTEM CERTIFICATIONS CATALOGED:", type: "success" },
          { text: "  ▸ Python Programming        (May–June 2022)", type: "secondary" },
          { text: "  ▸ Fullstack Web Development (Oct 2022 – Feb 2023)", type: "secondary" },
          { text: "  ▸ App Development           (July–Sept 2023)", type: "secondary" },
        ];
        break;

      case "about":
        output = [
          { text: `-------------------------------------------------`, type: "system" },
          { text: `SERVER NODE DATA: guest@navie-os:~# sysinfo`, type: "success" },
          { text: `Developer:       ${siteConfig.name} (${siteConfig.alias})`, type: "primary" },
          { text: `Title Focus:     ${siteConfig.title}`, type: "primary" },
          { text: `Base Node:       Cloud Server Portal`, type: "primary" },
          { text: `Active Role:     ${siteConfig.currentRole}`, type: "primary" },
          { text: `Server Core:     AI Core Integration Engine`, type: "secondary" },
          { text: `Memory Buffer:   16 GB Cybernetic Stream`, type: "secondary" },
          { text: `System Shell:    bash / zsh v1.0.4-next`, type: "secondary" },
          { text: `-------------------------------------------------`, type: "system" },
          { text: siteConfig.aboutBio, type: "primary" },
        ];
        break;

      case "contact":
        if (arg === "mail" || arg === "email") {
          window.open(`mailto:${siteConfig.email}`, "_self");
          output = [{ text: `Launching local mail application for: ${siteConfig.email}`, type: "success" }];
          break;
        }
        if (arg === "phone" || arg === "call") {
          window.open(`tel:${siteConfig.phone}`, "_self");
          output = [{ text: `Launching local dialer system for: ${siteConfig.phone}`, type: "success" }];
          break;
        }

        output = [
          { text: "COMMUNICATION PROTOCOL CHANNELS:", type: "success" },
          { text: `  Secure Mail:  ${siteConfig.email}`, type: "primary" },
          { text: `  Phone Comm:   ${siteConfig.phone}`, type: "primary" },
          { text: `  GitHub Node:  ${siteConfig.github}`, type: "primary" },
          { text: `  LinkedIn:     ${siteConfig.linkedin}`, type: "primary" },
          { text: "", type: "system" },
          { text: "CONSOLE TRIGGERS:", type: "success" },
          { text: "  Type 'contact mail'  - Instantly compose email to Divine", type: "secondary" },
          { text: "  Type 'contact phone' - Auto dial cell line", type: "secondary" },
        ];
        break;

      case "resume":
      case "cv":
        output = [{ text: "Establishing secure CV data download tunnel...", type: "success" }];
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = siteConfig.resumePath;
          link.download = "Divine_Nnaji_CV.docx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 600);
        break;

      case "hack":
        setIsHacking(true);
        return;

      case "clear":
        setLines([]);
        return;

      case "gui":
        onSwitchToCards();
        return;

      default:
        output = [
          { text: `bash: command not found: '${command}'`, type: "error" },
          { text: "Type 'help' to review catalog of valid shell operators.", type: "system" },
        ];
    }

    setLines([...currentLines, ...output, { text: "", type: "system" }]);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleTerminalClick}
      className="relative flex h-[520px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070b14]/85 shadow-[0_12px_40px_rgba(10,15,30,0.5)] backdrop-blur-md cursor-text"
    >
      {/* HUD terminal scanline overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(100, 255, 218, 0) 50%, rgba(100, 255, 218, 0.4) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Falling Matrix green rain digital code animation overlay */}
      {isHacking && (
        <MatrixOverlay onClose={() => setIsHacking(false)} />
      )}

      {/* Terminal Window Header (macOS Retro Shell style) */}
      <div className="relative flex h-10 w-full shrink-0 items-center justify-between border-b border-white/5 bg-navy/90 px-4">
        {/* macOS Window Controls */}
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5252]/80 hover:bg-[#ff5252]" />
          <div className="h-3 w-3 rounded-full bg-[#ffab00]/80 hover:bg-[#ffab00]" />
          <div className="h-3 w-3 rounded-full bg-[#00e676]/80 hover:bg-[#00e676]" />
        </div>

        {/* Window Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-[10px] tracking-wider text-[#8892b0] uppercase">
            guest@navie-os:~ (bash)
          </span>
        </div>

        {/* Console indicator */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#64ffda]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#64ffda] animate-pulse" />
          <span>PORT 8080 // OK</span>
        </div>
      </div>

      {/* Main Terminal Lines Buffer */}
      <div className="flex-1 overflow-y-auto p-5 font-mono text-xs md:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="space-y-1.5">
          {lines.map((line, idx) => {
            let colorClass = "text-[#ccd6f6]";
            if (line.type === "system") colorClass = "text-[#8892b0]/70";
            if (line.type === "header") colorClass = "text-[#64ffda] font-bold text-sm tracking-wider";
            if (line.type === "input") colorClass = "text-[#00e5ff] font-semibold";
            if (line.type === "success") colorClass = "text-[#64ffda]";
            if (line.type === "error") colorClass = "text-[#ff5252]";
            if (line.type === "secondary") colorClass = "text-[#8892b0]";

            return (
              <pre
                key={idx}
                className={`whitespace-pre-wrap ${colorClass}`}
              >
                {line.text}
              </pre>
            );
          })}
        </div>

        {/* Typing Line */}
        <div className="mt-2 flex items-center">
          <span className="mr-2 text-[#00e5ff] font-semibold">guest@navie-os:~#</span>
          <span className="relative flex flex-1 items-center">
            <span className="text-[#ccd6f6] whitespace-pre">{inputVal}</span>
            <span className="h-4 w-2 bg-[#64ffda] animate-pulse" />
            
            {/* Hidden HTML input for soft-keyboard integration */}
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 opacity-0 cursor-text pointer-events-auto w-full border-none outline-none"
              autoFocus
              autoCapitalize="none"
              autoComplete="off"
              spellCheck="false"
            />
          </span>
        </div>

        {/* Dummy bottom element for autoscroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ==========================================================================
   Matrix Falling Digital Code Rain Animation Overlay
   ========================================================================== */
function MatrixOverlay({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("DECRYPTING IDENTITY ARCHIVE...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive size boundary mapping
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || 520;

    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = Array(columns).fill(1);
    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1023456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff9f";
      ctx.font = "11px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i] * 14;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Secondary progress ticker
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    const statusTimeout = setTimeout(() => {
      setStatus("DECRYPTION COMPLETE // Greatness.ts Compiled successfully.");
    }, 2800);

    const exitTimeout = setTimeout(() => {
      onClose();
    }, 5200);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(progressInterval);
      clearTimeout(statusTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black font-mono text-xs select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40 px-6 text-center">
        <div className="rounded-xl border border-[#00ff9f]/30 bg-black/90 p-6 shadow-[0_0_30px_rgba(0,255,159,0.25)] max-w-sm w-full">
          <div className="flex justify-between items-center mb-4 border-b border-[#00ff9f]/20 pb-2">
            <span className="text-[#00ff9f] uppercase tracking-wider text-[10px] font-bold">SYSTEM OVERRIDE DETECTED</span>
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5252] animate-ping" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00ff9f]" />
            </div>
          </div>
          
          <pre className="text-left text-[#00ff9f] text-[10px] leading-relaxed mb-4 overflow-hidden">
            {`[OS RUNTIME CORRUPTED]
▸ resolving identity...
▸ injecting destiny into runtime
▸ bypass check: SUCCESSFUL
▸ decrypted nodes: 102/102`}
          </pre>
          
          <div className="text-[#00ff9f] font-bold text-xs uppercase tracking-wide animate-pulse">
            {status}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-1.5 w-full bg-neutral-900 rounded-full border border-[#00ff9f]/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00ff9f] to-[#64ffda] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right text-[10px] text-[#00ff9f]/60">
            {progress}% SECURE DATA TUNNEL ESTABLISHED
          </div>
        </div>
      </div>
    </div>
  );
}
