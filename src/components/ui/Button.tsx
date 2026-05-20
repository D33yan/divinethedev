"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "header";
  className?: string;
  download?: boolean;
};

const variants = {
  primary:
    "bg-white text-black border border-white/20 hover:bg-[#e8e8e8] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]",
  secondary:
    "bg-transparent text-white border border-white/25 hover:border-white/40 hover:bg-white/5",
  header:
    "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 text-sm py-2 px-6",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  download,
}: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        download={download}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium transition-all duration-250 ${variants[variant]} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
