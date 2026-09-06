import React from "react";

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextArea({ label, id, ...props }: FormTextAreaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-mono text-[#8892b0] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className="w-full liquid-glass-input rounded-xl py-3 px-4 text-[#ccd6f6] placeholder-[#8892b0]/40 focus:outline-none focus:border-[#64ffda] transition font-mono text-sm leading-relaxed"
        {...props}
      />
    </div>
  );
}
