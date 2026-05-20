"use client";

import { useEffect, useState } from "react";

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function useDebouncedMouse(delay = 16) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = debounce((e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    }, delay);

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [delay]);

  return pos;
}
