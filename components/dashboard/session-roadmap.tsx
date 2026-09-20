"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SessionRoadmap({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const reveal = () => {
      if (!window.location.hash.startsWith("#session-")) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target || !disclosure.current?.contains(target)) return;
      disclosure.current.open = true;
      const guide = target.querySelector<HTMLDetailsElement>("details[data-session-guide]");
      if (guide) guide.open = true;
      target.scrollIntoView({ block: "start" });
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return <details ref={disclosure} className="border border-line bg-white p-4 sm:p-6">
    <summary className="min-h-11 cursor-pointer font-semibold text-navy-900">Browse all eight session modules</summary>
    <p className="mb-5 mt-2 text-sm text-muted">Open a module for its preparation, starter, practice exercise, and materials. Your next recommended action is above.</p>
    {children}
  </details>;
}
