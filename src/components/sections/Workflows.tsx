"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import * as Icons from "lucide-react";
import { Play, Settings, ShieldCheck, CheckCircle } from "lucide-react";
import { playClick, playSuccess, playGlitch } from "@/lib/audio";
import { usePortfolioData } from "@/components/providers/PortfolioDataContext";

interface WorkflowNode {
  id: string;
  title: string;
  icon: any;
  color: string;
  desc: string;
  status: "idle" | "running" | "success";
}

export function Workflows() {
  const { workflowNodes, workflowSteps } = usePortfolioData();

  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string>("SYSTEM_IDLE // Standby for workflow initiation");

  // Sync context rows with workflow simulator state
  useEffect(() => {
    if (workflowNodes && workflowNodes.length > 0) {
      setNodes(
        workflowNodes.map((node) => ({
          id: node.node_id || node.id,
          title: node.title,
          icon: (Icons as any)[node.icon] || Icons.HelpCircle,
          color: node.color || "text-[#64ffda] border-[#64ffda]/20 bg-[#64ffda]/5",
          desc: node.desc,
          status: "idle"
        }))
      );
    }
  }, [workflowNodes]);

  // Hide component completely if empty
  if (!workflowNodes || workflowNodes.length === 0) return null;

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    playClick();

    // Reset nodes status
    setNodes((prev) => prev.map((n) => ({ ...n, status: "idle" })));

    const steps = workflowSteps && workflowSteps.length > 0 ? workflowSteps.map(s => ({
      id: s.node_id,
      log: s.log
    })) : [];

    if (steps.length === 0) {
      setSimulationLog("▸ SIMULATION_ABORT: Zero transition execution steps defined.");
      setIsRunning(false);
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Highlight current executing node
      setNodes((prev) =>
        prev.map((n) => (n.id === step.id ? { ...n, status: "running" } : n))
      );
      setSimulationLog(step.log);
      playClick();

      // Artificial node pipeline latency
      await new Promise((res) => setTimeout(res, 1200));

      // Mark current executing node as success
      setNodes((prev) =>
        prev.map((n) => (n.id === step.id ? { ...n, status: "success" } : n))
      );
    }

    setSimulationLog("✔ PIPELINE_SUCCESS // Execution sequence finished");
    playSuccess();
    setIsRunning(false);
  };

  return (
    <section id="workflows" className="px-6 py-24 lg:px-12" aria-labelledby="workflows-heading">
      <SectionHeading number="05" title="Workflow Automations" />

      <div className="max-w-5xl mx-auto mt-6 grid gap-8 lg:grid-cols-3">
        {/* Connection pipeline canvas */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/30 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          {/* Animated SVG Connector pipes */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Connector from Node 0 to Node 1 */}
              <path
                d="M 120,80 L 320,80"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 120,80 L 320,80"
                stroke="var(--color-accent)"
                strokeWidth="2"
                fill="none"
                className={`transition-all duration-500 ${
                  isRunning ? "animate-workflow-dash opacity-30" : "opacity-0"
                }`}
              />

              {/* Connector from Node 1 to Node 2 */}
              <path
                d="M 380,120 L 380,240"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 380,120 L 380,240"
                stroke="var(--color-accent)"
                strokeWidth="2"
                fill="none"
                className={`transition-all duration-500 ${
                  isRunning ? "animate-workflow-dash opacity-30" : "opacity-0"
                }`}
              />

              {/* Connector from Node 2 to Node 3 */}
              <path
                d="M 320,280 L 120,280"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 320,280 L 120,280"
                stroke="var(--color-accent)"
                strokeWidth="2"
                fill="none"
                className={`transition-all duration-500 ${
                  isRunning ? "animate-workflow-dash opacity-30" : "opacity-0"
                }`}
              />
            </svg>
          </div>

          {/* Dynamic Nodes layout */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 relative z-10 w-full">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setActiveNode(node.id);
                    playClick();
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 relative group cursor-pointer max-w-[160px] mx-auto w-full ${
                    activeNode === node.id
                      ? "border-[#64ffda] bg-[#64ffda]/5 shadow-[0_0_15px_rgba(100,255,218,0.1)]"
                      : "border-white/5 bg-[#0a192f]/45 hover:border-white/15"
                  }`}
                >
                  {/* Pipeline Status Indicator */}
                  {node.status === "running" && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                  )}
                  {node.status === "success" && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 rounded-full bg-[#64ffda] text-black justify-center items-center font-bold text-[8px]">
                      ✔
                    </span>
                  )}

                  <div className={`p-3 rounded-lg border ${node.color} mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-[11px] font-bold font-mono text-[#ccd6f6] tracking-wider block uppercase">
                    {node.title}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Simulator Controls & Watermark */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
            <div className="font-mono text-[10px] text-left text-neutral-500 uppercase tracking-widest max-w-[280px]">
              {simulationLog}
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 rounded border border-[#64ffda] bg-[#64ffda]/10 px-4 py-2 font-mono text-[11px] text-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.1)] hover:bg-[#64ffda]/20 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-[#64ffda]" />
              <span>RUN_SIMULATION</span>
            </button>
          </div>
        </div>

        {/* Node inspector panel */}
        <div className="font-mono text-xs text-left">
          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/30 backdrop-blur-md space-y-4 h-full flex flex-col justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#64ffda]">
                    {(() => {
                      const Icon = nodes.find((n) => n.id === activeNode)?.icon || Icons.HelpCircle;
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#ccd6f6] text-sm uppercase">
                      {nodes.find((n) => n.id === activeNode)?.title}
                    </h3>
                    <span className="text-[9px] text-[#64ffda] uppercase block tracking-wider">
                      NODE_ID: {activeNode}
                    </span>
                  </div>
                </div>

                <p className="text-[#8892b0] leading-relaxed text-[11px]">
                  {nodes.find((n) => n.id === activeNode)?.desc}
                </p>
                
                <div className="pt-2 border-t border-white/5 text-[9px] text-neutral-500 uppercase tracking-widest mt-auto">
                  Status: {nodes.find((n) => n.id === activeNode)?.status.toUpperCase()}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl border border-white/5 p-6 bg-[#0a192f]/20 text-left font-mono text-xs text-[#8892b0]/55 flex items-center justify-center min-h-[160px] border-dashed border-2 h-full">
                <p className="text-center text-[11px] leading-relaxed uppercase tracking-wider">
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
