"use client";

import { useEffect, useRef, useState } from "react";
import { projects, siteConfig } from "@/lib/site";
import { playClick, playSuccess, playGlitch } from "@/lib/audio";

interface TerminalLine {
  text: string;
  type: "system" | "input" | "success" | "error" | "primary" | "secondary" | "header";
}

interface TerminalViewProps {
  onSwitchToCards: () => void;
}

const getSuggestion = (input: string): string => {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  const allCommands = [
    "help", "clear", "about", "skills", "contact", 
    "resume", "cv", "hack", "gui", "ls", "cat", 
    "theme", "open", "run", "source", "code", "view"
  ];

  const parts = input.split(" ");
  if (parts.length === 1) {
    const query = parts[0].toLowerCase();
    const match = allCommands.find(c => c.startsWith(query));
    return match && match !== query ? match : "";
  } else if (parts.length === 2) {
    const cmd = parts[0].toLowerCase();
    const argQuery = parts[1].toLowerCase();
    let argOptions: string[] = [];

    if (cmd === "cat") {
      argOptions = ["about.md", "skills.md", "contact.txt", "resume.pdf", "projects/rebid.md", "projects/typhoidguard.md", "projects/acadexpub.md"];
    } else if (["open", "run", "source", "view", "code"].includes(cmd)) {
      argOptions = ["rebid", "typhoidguard", "acadexpub"];
    } else if (cmd === "theme") {
      argOptions = ["teal", "blue", "pink", "green", "red", "orange"];
    } else if (cmd === "ls") {
      argOptions = ["projects"];
    } else if (cmd === "contact") {
      argOptions = ["mail", "email", "phone", "call"];
    }

    const match = argOptions.find(opt => opt.startsWith(argQuery));
    return match && match !== argQuery ? `${parts[0]} ${match}` : "";
  }
  return "";
};

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
    if (e.key === "Tab" || e.key === "ArrowRight") {
      const suggestion = getSuggestion(inputVal);
      if (suggestion) {
        e.preventDefault();
        setInputVal(suggestion);
        playSuccess();
      }
    } else if (e.key === "Enter") {
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

      case "ls": {
        const path = arg ? arg.trim().toLowerCase() : "";
        if (path === "projects" || path === "projects/") {
          output = [
            { text: "DIRECTORY LISTING: guest@navie-os:~/projects#", type: "success" },
            { text: "total 32", type: "system" },
            ...projects.map((p) => ({
              text: `-rw-r--r--  devine  staff  1.2K Jun 02 14:00 ${p.id}.md`,
              type: "primary" as const
            })),
            { text: "\nType 'cat projects/<project_id>.md' to view the file (e.g. 'cat projects/rebid.md').", type: "system" }
          ];
        } else {
          output = [
            { text: "DIRECTORY LISTING: guest@navie-os:~#", type: "success" },
            { text: "total 48", type: "system" },
            { text: "drwxr-xr-x  devine  staff  128B Jun 02 14:00 projects/", type: "success" },
            { text: "-rw-r--r--  devine  staff  2.4K Jun 02 14:00 about.md", type: "primary" },
            { text: "-rw-r--r--  devine  staff  1.8K Jun 02 14:00 skills.md", type: "primary" },
            { text: "-rw-r--r--  devine  staff  528B Jun 02 14:00 contact.txt", type: "primary" },
            { text: "-rwxr-xr-x  devine  staff  145K Jun 02 14:00 resume.pdf", type: "primary" },
            { text: "\nType 'cat <filename>' to read a file, or 'ls projects' to view project files.", type: "system" }
          ];
        }
        break;
      }

      case "cat": {
        if (!arg) {
          output = [{ text: "Error: No file specified. Usage: cat <filename> (e.g. 'cat about.md')", type: "error" }];
          break;
        }

        const targetFile = arg.trim().toLowerCase().replace("projects/", "").replace(".md", "").replace(".txt", "");

        if (targetFile === "about") {
          output = [
            { text: "--- about.md ---", type: "success" },
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
        } else if (targetFile === "skills") {
          output = [
            { text: "--- skills.md ---", type: "success" },
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
        } else if (targetFile === "contact") {
          output = [
            { text: "--- contact.txt ---", type: "success" },
            { text: `  Secure Mail:  ${siteConfig.email}`, type: "primary" },
            { text: `  Phone Comm:   ${siteConfig.phone}`, type: "primary" },
            { text: `  GitHub Node:  ${siteConfig.github}`, type: "primary" },
            { text: `  LinkedIn:     ${siteConfig.linkedin}`, type: "primary" },
          ];
        } else if (targetFile === "resume" || targetFile === "resume.pdf" || targetFile === "cv") {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-resume-viewer"));
          }
          output = [{ text: "Establishing secure CV data tunnel... launching inline viewer drawer.", type: "success" }];
        } else {
          // Check if it's a project
          const project = projects.find((p) => p.id === targetFile);
          if (project) {
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
          } else {
            output = [{ text: `Error: File or directory '${arg}' not found. Type 'ls' to view catalog.`, type: "error" }];
          }
        }
        break;
      }

      case "theme": {
        if (!arg) {
          output = [
            { text: "Usage: theme <accent_color> (e.g. 'theme pink', 'theme blue')", type: "error" },
            { text: "Available themes:", type: "success" },
            { text: "  ▸ teal   - Standard Cyber Teal (Default)", type: "primary" },
            { text: "  ▸ blue   - Electric Neon Cyan Blue", type: "primary" },
            { text: "  ▸ pink   - Hot Cyberpunk Pink", type: "primary" },
            { text: "  ▸ green  - Matrix Digital Green", type: "primary" },
            { text: "  ▸ red    - Electric Neon Red", type: "primary" },
            { text: "  ▸ orange - Cyber Orange", type: "primary" },
          ];
          break;
        }

        const themes: Record<string, { rgb: string; hex: string }> = {
          teal: { rgb: "100, 255, 218", hex: "#64ffda" },
          blue: { rgb: "0, 229, 255", hex: "#00e5ff" },
          green: { rgb: "0, 255, 159", hex: "#00ff9f" },
          pink: { rgb: "255, 0, 127", hex: "#ff007f" },
          red: { rgb: "255, 51, 51", hex: "#ff3333" },
          orange: { rgb: "255, 145, 0", hex: "#ff9100" },
        };

        const targetTheme = themes[arg.toLowerCase()];
        if (!targetTheme) {
          output = [{ text: `Error: Theme '${arg}' not found. Valid options: teal, blue, pink, green, red, orange`, type: "error" }];
          break;
        }

        if (typeof window !== "undefined") {
          const root = document.documentElement;
          root.style.setProperty("--color-accent-rgb", targetTheme.rgb);
          root.style.setProperty("--color-accent", `rgb(${targetTheme.rgb})`);
          root.style.setProperty("--color-accent-dim", `rgba(${targetTheme.rgb}, 0.1)`);
          localStorage.setItem("navie-accent-theme", arg.toLowerCase());
          
          window.dispatchEvent(new CustomEvent("accent-theme-changed", {
            detail: { theme: arg.toLowerCase(), rgb: targetTheme.rgb, hex: targetTheme.hex }
          }));
        }

        playSuccess();
        output = [{ text: `System visual layout theme re-coded: ${arg.toUpperCase()} (${targetTheme.hex})`, type: "success" }];
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
          link.download = "Divine_Nnaji_CV.pdf";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
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

  const suggestion = getSuggestion(inputVal);

  return (
    <div
      ref={containerRef}
      onClick={handleTerminalClick}
      className="terminal-container relative flex h-[520px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md cursor-text"
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
            {suggestion && (
              <span className="absolute left-0 pointer-events-none text-[#ccd6f6] opacity-25 whitespace-pre select-none font-mono">
                {inputVal}
                <span className="text-white/30">{suggestion.substring(inputVal.length)}</span>
              </span>
            )}
            <span className="text-[#ccd6f6] whitespace-pre">{inputVal}</span>
            <span className="h-4 w-2 bg-[#64ffda] animate-pulse" />
            
            {/* Hidden HTML input for soft-keyboard integration */}
            <input
              ref={inputRef}
              type="text"
              onChange={(e) => {
                setInputVal(e.target.value);
                playClick();
              }}
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

    const mouseRef = { x: -9999, y: -9999 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.x = e.clientX - rect.left;
      mouseRef.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.x = -9999;
      mouseRef.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        let x = i * 14;
        let y = drops[i] * 14;

        // Calculate distance from mouse coordinates
        const dist = Math.hypot(x - mouseRef.x, y - mouseRef.y);
        const insideRipple = dist < 120;

        if (insideRipple) {
          // Glitch / offset coordinates
          const angle = Math.atan2(y - mouseRef.y, x - mouseRef.x);
          const force = (120 - dist) * 0.15; // push characters slightly away
          x += Math.cos(angle) * force;
          y += Math.sin(angle) * force;

          // Glitch color to neon white
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px monospace"; // make it slightly larger/bolder
        } else {
          ctx.fillStyle = "#00ff9f";
          ctx.font = "11px monospace";
        }

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
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
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
