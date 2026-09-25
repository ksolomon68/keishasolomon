"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { nextSessionId } from "@/lib/dates";
import { useMinuteClock } from "./countdown";

export interface RoadmapSession {
  id: string;
  date: string | null;
  card: ReactNode;
}

/**
 * Shows the next two sessions up front and tucks the rest behind a disclosure.
 * `initialNextId` is the server's guess so the first paint matches hydration; the viewer's clock refines it.
 */
export function SessionRoadmap({ sessions, initialNextId }: { sessions: RoadmapSession[]; initialNextId: string | null }) {
  const now = useMinuteClock();
  const nextId = now ? nextSessionId(sessions, now) : initialNextId;
  let start = sessions.findIndex((s) => s.id === nextId);
  // No upcoming confirmed date: the cohort is either finished (show the last two) or entirely unscheduled (show the first two).
  if (start < 0) start = sessions.some((s) => s.date) ? Math.max(0, sessions.length - 2) : 0;
  const featured = sessions.slice(start, start + 2);
  const rest = sessions.filter((s) => !featured.includes(s));

  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const reveal = () => {
      if (!window.location.hash.startsWith("#session-")) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target) return;
      if (disclosure.current?.contains(target)) disclosure.current.open = true;
      const guide = target.querySelector<HTMLDetailsElement>("details[data-session-guide]");
      if (guide) guide.open = true;
      target.scrollIntoView({ block: "start" });
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  return <div>
    <p className="label mb-4 text-cyan-deep">{nextId ? "Coming up" : start > 0 ? "Latest sessions" : "First sessions"}</p>
    <ol className="grid gap-5 md:grid-cols-2">{featured.map((s) => <Fragment key={s.id}>{s.card}</Fragment>)}</ol>
    {rest.length > 0 && <details ref={disclosure} className="group mt-6 border border-line bg-white p-4 sm:p-6">
      <summary className="min-h-11 cursor-pointer font-semibold text-navy-900">
        <span className="group-open:hidden">Show the other {rest.length} sessions</span>
        <span className="hidden group-open:inline">Hide the other {rest.length} sessions</span>
      </summary>
      <p className="mb-5 mt-2 text-sm text-muted">Open a module for its preparation, starter, practice exercise, and materials.</p>
      <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{rest.map((s) => <Fragment key={s.id}>{s.card}</Fragment>)}</ol>
    </details>}
  </div>;
}
