import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, id, ...props }: FormInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-mono text-[#8892b0] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full bg-[#112240] border border-white/10 rounded-xl py-3 px-4 text-[#ccd6f6] placeholder-[#8892b0]/40 focus:outline-none focus:border-[#64ffda] transition font-mono text-sm"
        {...props}
      />
    </div>
  );
}
