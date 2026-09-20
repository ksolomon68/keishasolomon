"use client";

import { useState } from "react";
import { sessions } from "@/data/cohortData";
import type { FrictionEntry } from "@/lib/store";
import { Tag } from "@/components/ui/tag";

export function FrictionReview({ entries }: { entries: (FrictionEntry & { participant: string })[] }) {
  const [session, setSession] = useState("all");
  const [openOnly, setOpenOnly] = useState(true);
  const visible = entries.filter((e) => (!openOnly || !e.done) && (session === "all" || (e.sessionId ?? "none") === session));
  return <div>
    <div className="mb-5 flex flex-wrap items-end gap-5">
      <label className="block text-sm font-semibold">Target session
        <select value={session} onChange={(e) => setSession(e.target.value)} className="mt-2 block min-h-11 max-w-full border border-edge bg-white px-3">
          <option value="all">All sessions</option><option value="none">No session selected</option>
          {sessions.filter((s) => s.deliverable).map((s) => <option key={s.id} value={s.id}>Session {s.number} · {s.shortDate}</option>)}
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} className="size-5 accent-navy-900" />Open problems only</label>
    </div>
    <p role="status" className="mb-3 text-sm text-muted">{visible.length} {visible.length === 1 ? "problem" : "problems"} to explore</p>
    {!visible.length ? <p className="border border-dashed border-edge p-6 text-muted">No matching friction points. Participant logs appear here when they save a task; try another session or include solved problems.</p> :
      <ul className="grid gap-4 md:grid-cols-2">{visible.map((entry) => <li key={entry.id} className="border border-line bg-white p-5">
        <p className="label text-amber-deep">{entry.sessionId ? `Session ${sessions.find((s) => s.id === entry.sessionId)?.number}` : "Choose a lab together"}</p>
        <h3 className="mt-3 break-words font-display text-xl">{entry.task}</h3>
        <p className="mt-2 text-sm text-muted">{entry.participant} · {entry.minutes} minutes, {entry.frequency}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3"><Tag tone={entry.done ? "success" : "cyan"}>{entry.done ? "Solved" : "Open"}</Tag>
          <span className="text-sm text-muted">≈ {(entry.minutes * ({ daily: 5, weekly: 1, monthly: 12 / 52 }[entry.frequency]) / 60).toFixed(1)} hrs/week baseline</span></div>
      </li>)}</ul>}
    <p className="mt-4 text-sm text-muted">Baseline estimates use five occurrences per week for daily tasks. These are planning estimates, not measured savings. Only instructors can see this cohort view.</p>
  </div>;
}
