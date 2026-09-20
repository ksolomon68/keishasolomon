"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import { deliverableSessions, sessions } from "@/data/cohortData";
import { learningGuides } from "@/data/learning-guides";
import type { Deliverable } from "@/lib/store";
import { nextSessionId, sessionStatus } from "@/lib/dates";
import { useMinuteClock } from "./countdown";
import { buttonStyles } from "@/components/ui/button";

export function NextStep({ deliverables, hasFriction }: { deliverables: Deliverable[]; hasFriction: boolean }) {
  const now = useMinuteClock();
  const next = now ? sessions.find((s) => s.id === nextSessionId(sessions, now)) : undefined;
  const revision = deliverables.find((d) => d.status === "needs_revision");
  const outstanding = deliverableSessions.find((s) => {
    const d = deliverables.find((item) => item.sessionId === s.id);
    return d?.status !== "submitted" && d?.status !== "reviewed" &&
      (d?.status === "in_progress" || (now && sessionStatus(s, now) === "past"));
  });
  const action = revision ? {
    title: "Turn feedback into your next improvement.",
    body: revision.feedback || "Your instructor has requested a revision. Open the deliverable to review the criteria and update your work.",
    label: "Review feedback", target: `deliverable-${revision.sessionId}`,
  } : !hasFriction ? {
    title: "Start with one task you want to improve.",
    body: "Think of a repetitive task from this week. Record how often you do it and the minutes it takes. Your instructor will use this to shape the labs.",
    label: "Log my first problem", target: "friction",
  } : outstanding ? {
    title: `Continue your ${outstanding.deliverable.title}.`,
    body: "Open the starter and success checklist, then save a draft or send your work for instructor feedback.",
    label: "Continue my work", target: `deliverable-${outstanding.id}`,
  } : next ? {
    title: `Get ready for Session ${next.number}.`,
    body: learningGuides[next.id]?.prepare ?? "Prepare your five-minute demonstration: the problem, your working solution, the measured result, and what you learned.",
    label: "Open session guide", target: `session-${next.id}`,
  } : {
    title: "Bring your evidence together.",
    body: "Review your capstone milestones and remaining feedback. Your saved work stays available after the last confirmed session.",
    label: "Review my capstone", target: "capstone",
  };
  return <section aria-labelledby="next-step-title" className="mt-8 grid border border-navy-900 bg-white lg:grid-cols-[1.5fr_1fr]">
    <div className="p-6 sm:p-8">
      <p className="label text-amber-deep">Your next step</p>
      <h2 id="next-step-title" className="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">{action.title}</h2>
      <p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-muted">{action.body}</p>
      <a href={`#${action.target}`} className={`${buttonStyles({ variant: "secondary" })} mt-6`} onClick={() => {
        const target = document.getElementById(action.target);
        if (target instanceof HTMLDetailsElement) target.open = true;
        const roadmap = target?.closest("details");
        if (roadmap) roadmap.open = true;
        const guide = target?.querySelector<HTMLDetailsElement>("details[data-session-guide]");
        if (guide) guide.open = true;
      }}>{action.label}<ArrowRight className="size-4" aria-hidden="true" /></a>
    </div>
    <aside className="border-t border-line bg-paper p-6 sm:p-8 lg:border-l lg:border-t-0">
      <p className="label flex items-center gap-2 text-cyan-deep"><CalendarDays className="size-4" aria-hidden="true" />Next confirmed session</p>
      {!now ? <p className="mt-4 text-muted">Checking the schedule…</p> : next ? <>
        <p className="mt-4 font-display text-2xl">{next.dateLabel}</p><p className="mt-2 text-sm text-muted">{next.theme}</p>
      </> : <p className="mt-4 text-muted">No upcoming confirmed dates. Check the pending notice below.</p>}
      <p className="mt-4 text-sm text-muted">Time and venue are awaiting confirmation. Check your welcome message or contact your instructor before travelling.</p>
      {sessions.filter((s) => !s.date).map((s) => <p key={s.id} className="mt-4 border-t border-line pt-4 text-sm"><strong>Pending:</strong> Session {s.number} · {s.dateLabel}. This does not change the other confirmed dates.</p>)}
    </aside>
  </section>;
}
