"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTactileAudio } from "@/hooks/useTactileAudio";
import { useUserRole } from "@/hooks/useUserRole";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Loader2, Plus, Trash2, Cpu, HelpCircle, ListOrdered } from "lucide-react";
import * as Icons from "lucide-react";

interface WorkflowNode {
  id: string;
  node_id: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
}

interface WorkflowStep {
  id: string;
  node_id: string;
  log: string;
  sort_order: number;
}

export default function WorkflowsManager() {
  const { isAdmin } = useUserRole();
  const { triggerSound } = useTactileAudio();

  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Node form states
  const [nodeId, setNodeId] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("Webhook");
  const [color, setColor] = useState("text-blue-400 border-blue-500/20 bg-blue-500/5");
  const [desc, setDesc] = useState("");
  const [nodeSubmitting, setNodeSubmitting] = useState(false);

  // Step form states
  const [stepNodeId, setStepNodeId] = useState("");
  const [stepLog, setStepLog] = useState("");
  const [stepSubmitting, setStepSubmitting] = useState(false);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: dbNodes, error: nErr } = await supabase
        .from("workflow_nodes")
        .select("*")
        .order("created_at", { ascending: true });
      if (nErr) throw nErr;
      setNodes(dbNodes || []);

      const { data: dbSteps, error: sErr } = await supabase
        .from("workflow_steps")
        .select("*")
        .order("sort_order", { ascending: true });
      if (sErr) throw sErr;
      setSteps(dbSteps || []);

      if (dbNodes && dbNodes.length > 0 && !stepNodeId) {
        setStepNodeId(dbNodes[0].node_id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load workflow parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required.");
      return;
    }

    setNodeSubmitting(true);
    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase.from("workflow_nodes").insert({
        node_id: nodeId.toLowerCase().trim(),
        title,
        icon,
        color,
        desc
      });
      if (err) throw err;

      setSuccess("Workflow node created successfully!");
      setNodeId("");
      setTitle("");
      setDesc("");
      triggerSound("success");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Could not create workflow node.");
      triggerSound("glitch");
    } finally {
      setNodeSubmitting(false);
    }
  };

  const handleDeleteNode = async (id: string) => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required to delete.");
      return;
    }

    if (!confirm("Deleting this node will automatically remove all associated simulation sequence steps. Proceed?")) return;

    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase.from("workflow_nodes").delete().eq("id", id);
      if (err) throw err;

      setSuccess("Workflow node deleted successfully.");
      triggerSound("success");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Could not delete workflow node.");
      triggerSound("glitch");
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required.");
      return;
    }

    if (!stepNodeId) {
      setError("Please select a target workflow node for this step.");
      return;
    }

    setStepSubmitting(true);
    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const nextSortOrder = steps.length;
      const { error: err } = await supabase.from("workflow_steps").insert({
        node_id: stepNodeId,
        log: stepLog,
        sort_order: nextSortOrder
      });
      if (err) throw err;

      setSuccess("Workflow step appended successfully!");
      setStepLog("");
      triggerSound("success");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Could not create workflow step.");
      triggerSound("glitch");
    } finally {
      setStepSubmitting(false);
    }
  };

  const handleDeleteStep = async (id: string) => {
    if (!supabase || !isAdmin) {
      triggerSound("glitch");
      setError("Admin write privilege required to delete.");
      return;
    }

    setError("");
    setSuccess("");
    triggerSound("click");

    try {
      const { error: err } = await supabase.from("workflow_steps").delete().eq("id", id);
      if (err) throw err;

      setSuccess("Workflow step deleted successfully.");
      triggerSound("success");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Could not delete workflow step.");
      triggerSound("glitch");
    }
  };

  const iconOptions = ["Webhook", "Bot", "Database", "BellRing", "Cpu", "Code", "Server", "Mail", "MessageSquare", "Send", "GitBranch", "Terminal"];
  const colorOptions = [
    { label: "Teal (Custom Accent)", value: "text-[#64ffda] border-[#64ffda]/20 bg-[#64ffda]/5" },
    { label: "Blue", value: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
    { label: "Purple", value: "text-purple-400 border-purple-500/20 bg-purple-500/5" },
    { label: "Amber", value: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
    { label: "Rose", value: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
    { label: "Emerald", value: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#ccd6f6] font-mono">WORKFLOWS_MANAGER</h1>
        <p className="text-sm text-[#8892b0] mt-1 font-mono uppercase tracking-widest">
          Manage dynamic workflow pipeline nodes and simulated transition steps
        </p>
      </div>

      <SystemAlert type="error" message={error} />
      <SystemAlert type="success" message={success} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-[#64ffda] animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Nodes & Steps lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Nodes Card */}
            <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#64ffda]" />
                <span>ACTIVE_NODES</span>
              </h2>

              {nodes.length === 0 ? (
                <div className="text-center py-10 text-[#8892b0] font-mono text-xs border border-dashed border-white/5 rounded-xl">
                  NO ACTIVE WORKFLOW NODES DEFINED. SECTION HIDE ACTIVATED.
                </div>
              ) : (
                <div className="divide-y divide-white/5 space-y-4">
                  {nodes.map((node) => {
                    const IconComponent = (Icons as any)[node.icon] || HelpCircle;
                    return (
                      <div key={node.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${node.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 text-left">
                            <h3 className="text-sm font-bold font-mono text-[#ccd6f6]">{node.title}</h3>
                            <p className="text-xs text-[#8892b0] leading-relaxed">{node.desc}</p>
                            <div className="font-mono text-[9px] text-[#64ffda] uppercase tracking-wide">
                              NODE_ID: {node.node_id} &middot; ICON: {node.icon}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteNode(node.id)}
                          disabled={!isAdmin}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
                          title="Delete node"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sequence Steps Card */}
            <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
              <h2 className="text-lg font-bold font-mono text-[#ccd6f6] mb-4 flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-[#64ffda]" />
                <span>SIMULATION_STEPS_SEQUENCE</span>
              </h2>

              {steps.length === 0 ? (
                <div className="text-center py-10 text-[#8892b0] font-mono text-xs border border-dashed border-white/5 rounded-xl">
                  NO TRANSITION SEQUENCE STEPS DEFINED.
                </div>
              ) : (
                <div className="divide-y divide-white/5 space-y-3 font-mono text-xs">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-left">
                      <div className="space-y-1">
                        <div className="text-[#8892b0]">
                          <span className="text-white font-bold font-mono">[{idx + 1}]</span> Node: <span className="text-[#64ffda] font-bold">{step.node_id}</span>
                        </div>
                        <p className="text-[11px] text-[#ccd6f6] leading-relaxed italic">{step.log}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteStep(step.id)}
                        disabled={!isAdmin}
                        className="text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded transition disabled:opacity-50 cursor-pointer shrink-0"
                        title="Delete step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Side Column */}
          <div className="space-y-6">
            {/* Create Node Form */}
            <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
              <h2 className="text-sm font-bold font-mono text-[#ccd6f6] mb-4">CREATE_WORKFLOW_NODE</h2>

              <form onSubmit={handleAddNode} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Node unique ID</label>
                  <input
                    type="text"
                    required
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    placeholder="e.g. webhook (no spaces)"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Node Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Capture Lead"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Icon</label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Color Style</label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition text-left"
                    >
                      {colorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Node Description</label>
                  <textarea
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe node execution logs..."
                    rows={3}
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition resize-none text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={nodeSubmitting || !isAdmin}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#64ffda] text-black hover:bg-[#64ffda]/80 font-bold font-mono text-xs py-3 px-4 shadow-lg shadow-[#64ffda]/10 transition disabled:opacity-50 cursor-pointer"
                >
                  {nodeSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>CREATE_NODE</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Create Step Form */}
            <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/50 backdrop-blur-md">
              <h2 className="text-sm font-bold font-mono text-[#ccd6f6] mb-4">APPEND_SIMULATION_STEP</h2>

              <form onSubmit={handleAddStep} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Target Node ID</label>
                  <select
                    value={stepNodeId}
                    onChange={(e) => setStepNodeId(e.target.value)}
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.node_id}>{n.title} ({n.node_id})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-[#8892b0] uppercase tracking-wider block">Simulation Log Output</label>
                  <input
                    type="text"
                    required
                    value={stepLog}
                    onChange={(e) => setStepLog(e.target.value)}
                    placeholder="e.g. ▸ INCOMING_WEBHOOK: parsed fields"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#ccd6f6] focus:border-[#64ffda] outline-none transition font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={stepSubmitting || !isAdmin || nodes.length === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#64ffda] text-black hover:bg-[#64ffda]/80 font-bold font-mono text-xs py-3 px-4 shadow-lg shadow-[#64ffda]/10 transition disabled:opacity-50 cursor-pointer"
                >
                  {stepSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>APPEND_STEP</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
