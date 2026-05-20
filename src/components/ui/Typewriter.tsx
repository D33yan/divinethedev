"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type TypewriterProps = {
  phrases: readonly string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
};

export function Typewriter({
  phrases,
  className = "",
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseMs = 2000,
}: TypewriterProps) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(phrases[0] ?? "");
      return;
    }

    const phrase = phrases[index] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === phrase) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
    } else if (deleting) {
      timeout = setTimeout(() => setText(phrase.slice(0, text.length - 1)), deletingSpeed);
    } else {
      timeout = setTimeout(() => setText(phrase.slice(0, text.length + 1)), typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, typingSpeed, deletingSpeed, pauseMs, reduced]);

  return (
    <span className={className}>
      {reduced ? phrases[0] : text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[#64ffda]" aria-hidden>
        |
      </span>
    </span>
  );
}
