"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import * as Icons from "lucide-react";
import { Play, Settings, ShieldCheck, CheckCircle } from "lucide-react";
import { playClick, playSuccess, playGlitch } from "@/lib/audio";
import { workflowsConfig } from "@/lib/site";

interface WorkflowNode {
  id: string;
  title: string;
  icon: any;
  color: string;
  desc: string;
  status: "idle" | "running" | "success";
}

export function Workflows() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    workflowsConfig.nodes.map((node) => ({
      ...node,
      icon: (Icons as any)[node.icon] || Icons.HelpCircle,
      status: "idle"
    }))
  );

  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string>("SYSTEM_IDLE // Standby for workflow initiation");

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    playClick();

    // Reset nodes to idle
    setNodes((prev) => prev.map((n) => ({ ...n, status: "idle" })));

    const steps = workflowsConfig.steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setSimulationLog(step.log);
      
      // Update current node to running
      setNodes((prev) =>
        prev.map((n) => (n.id === step.id ? { ...n, status: "running" } : n))
      );
      playClick();

      await new Promise((r) => setTimeout(r, 1200));

      // Update current node to success
      setNodes((prev) =>
        prev.map((n) => (n.id === step.id ? { ...n, status: "success" } : n))
      );
    }

    setSimulationLog("✔ SUCCESS: Workflow execution pipeline complete.");
    playSuccess();
    setIsRunning(false);
  };

  return (
    <section id="workflows" className="px-6 py-24 lg:px-12 relative" aria-labelledby="workflows-heading">
      <SectionHeading number="05" title="Workflow Automations" />

      <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-12 items-start mt-6">
        {/* Left Column: Visual Pipeline Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/30 backdrop-blur-md relative overflow-hidden">
            
            {/* SVG Glowing Connector lines */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
              <svg className="w-full h-full" style={{ minHeight: "180px" }}>
                <defs>
                  <linearGradient id="neon-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#64ffda" />
                  </linearGradient>
                </defs>
                {/* Connector line 1 */}
                <path 
                  d="M 120 70 L 260 70" 
                  fill="none" 
                  stroke={isRunning ? "url(#neon-glow)" : "rgba(255,255,255,0.05)"} 
                  strokeWidth="2" 
                  strokeDasharray={isRunning ? "6, 4" : "none"}
                  className={isRunning ? "animate-workflow-dash" : ""}
                />
                {/* Connector line 2 */}
                <path 
                  d="M 370 70 L 510 70" 
                  fill="none" 
                  stroke={isRunning ? "url(#neon-glow)" : "rgba(255,255,255,0.05)"} 
                  strokeWidth="2" 
                  strokeDasharray={isRunning ? "6, 4" : "none"}
                  className={isRunning ? "animate-workflow-dash" : ""}
                />
                {/* Connector line 3 */}
                <path 
                  d="M 620 70 L 760 70" 
                  fill="none" 
                  stroke={isRunning ? "url(#neon-glow)" : "rgba(255,255,255,0.05)"} 
                  strokeWidth="2" 
                  strokeDasharray={isRunning ? "6, 4" : "none"}
                  className={isRunning ? "animate-workflow-dash" : ""}
                />
              </svg>
            </div>

            {/* Pipeline Nodes Row */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 py-6 min-h-[140px]">
              {nodes.map((node) => {
                const IconComponent = node.icon;
                const isSelected = activeNode === node.id;
                
                return (
                  <motion.div 
                    key={node.id}
                    onClick={() => {
                      playClick();
                      setActiveNode(isSelected ? null : node.id);
                    }}
                    whileHover={{ scale: 1.03 }}
                    className={`w-36 h-28 rounded-xl border p-4 cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-300 ${node.color} ${
                      isSelected ? "border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.15)]" : ""
                    }`}
                  >
                    <div className="relative">
                      {node.status === "running" ? (
                        <div className="w-8 h-8 rounded-lg border border-dashed border-[#64ffda] flex items-center justify-center animate-spin">
                          <Settings className="h-4 w-4 text-[#64ffda]" />
                        </div>
                      ) : node.status === "success" ? (
                        <div className="w-8 h-8 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda]">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                          <IconComponent className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#ccd6f6] truncate max-w-full">
                      {node.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulating Output logger */}
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-left uppercase tracking-wider text-[#8892b0] flex justify-between items-center">
              <span>{simulationLog}</span>
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#64ffda]/10 hover:bg-[#64ffda]/25 border border-[#64ffda] text-black bg-[#64ffda] disabled:bg-white/5 disabled:border-white/5 disabled:text-[#8892b0] font-bold rounded-lg cursor-pointer transition text-[9px] uppercase tracking-widest shadow-lg shadow-[#64ffda]/10"
              >
                <Play className="h-3 w-3 fill-black" />
                <span>Test Run Pipeline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Node Parameters Tooltip Details */}
        <div className="lg:col-span-4 h-full">
          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card rounded-2xl border border-[#64ffda]/20 p-6 bg-[#112240]/40 backdrop-blur-md text-left font-mono text-xs space-y-4"
              >
                <div className="flex items-center gap-2 text-[#64ffda] font-bold tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>NODE_INSPECTOR // {activeNode.toUpperCase()}</span>
                </div>
                <h3 className="text-sm font-bold text-[#ccd6f6]">
                  {nodes.find((n) => n.id === activeNode)?.title}
                </h3>
                <p className="text-[#8892b0] leading-relaxed">
                  {nodes.find((n) => n.id === activeNode)?.desc}
                </p>
                <div className="pt-2 border-t border-white/5 text-[9px] text-neutral-500 uppercase tracking-widest">
                  Status: {nodes.find((n) => n.id === activeNode)?.status.toUpperCase()}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl border border-white/5 p-6 bg-[#0a192f]/20 text-left font-mono text-xs text-[#8892b0]/55 flex items-center justify-center min-h-[160px] border-dashed border-2">
                <p className="text-center">
                  SELECT ANY NODE ON THE WORKFLOW CANVAS TO INSPECT ACTIVE CODE PARAMETERS
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
