import { type ReactNode } from "react";

type SectionHeadingProps = {
  number: string;
  title: string;
  children?: ReactNode;
};

export function SectionHeading({ number, title, children }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex items-end gap-4">
      <h2 className="flex items-center gap-4 text-[clamp(1.5rem,4vw,2rem)] font-semibold text-[#ccd6f6]">
        <span className="font-mono text-[#64ffda]">{number}.</span>
        <span>{title}</span>
        <span className="hidden h-px flex-1 max-w-xs bg-white/10 sm:block" aria-hidden />
      </h2>
      {children}
    </div>
  );
}
