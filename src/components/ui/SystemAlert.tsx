import React from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface SystemAlertProps {
  type: "success" | "error" | "info";
  message: string;
}

export function SystemAlert({ type, message }: SystemAlertProps) {
  if (!message) return null;

  const config = {
    success: {
      bg: "bg-[#64ffda]/10 border-[#64ffda]/20 text-[#64ffda]",
      icon: CheckCircle,
      prefix: "[SYSTEM_SUCCESS]"
    },
    error: {
      bg: "bg-red-500/10 border-red-500/20 text-red-400",
      icon: AlertCircle,
      prefix: "[SYSTEM_ERROR]"
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      icon: Info,
      prefix: "[SYSTEM_ALERT]"
    }
  };

  const selected = config[type] || config.info;
  const Icon = selected.icon;

  return (
    <div className={`border rounded-xl p-4 text-xs font-mono flex items-start gap-2.5 ${selected.bg}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{selected.prefix}: {message}</span>
    </div>
  );
}
