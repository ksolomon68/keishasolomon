"use client";

import { useActionState, useState, useTransition } from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";
import { reviewDeliverableAction, setAttendanceAction } from "@/app/actions/admin";
import { FormMessage, SelectField, TextAreaField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import { deliverableSessions, deliverableStatuses, sessions } from "@/data/cohortData";
import { learningGuides } from "@/data/learning-guides";
import type { Deliverable } from "@/lib/store";

export type RosterDeliverable = Pick<Deliverable, "sessionId" | "status" | "linkUrl" | "fileId" | "notes" | "feedback" | "feedbackRevision" | "revision" | "version">;
export interface RosterEntry {
  id: string;
  name: string;
  email: string;
  organization: string;
  attended: string[];
  deliverables: RosterDeliverable[];
  capstoneDone: number;
  capstoneTotal: number;
}

export function Roster({ entries }: { entries: RosterEntry[] }) {
  const [reviewOnly, setReviewOnly] = useState(false);
  const visible = entries.filter((entry) => !reviewOnly || entry.deliverables.some((d) => d.status === "submitted"));
  return <div className="space-y-4">
    <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
      <input type="checkbox" checked={reviewOnly} onChange={(e) => setReviewOnly(e.target.checked)} className="size-5 accent-navy-900" />
      Show participants awaiting review
    </label>
    {!visible.length && <p role="status" className="border border-dashed border-edge p-6 text-muted">
      {entries.length ? "No participants are awaiting review." : "No participants have activated their accounts yet."}
    </p>}
    {visible.map((entry) => <Participant key={entry.id} entry={entry} />)}
  </div>;
}

function Participant({ entry }: { entry: RosterEntry }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const waiting = entry.deliverables.filter((d) => d.status === "submitted").length;
  return <details className="group border border-line bg-white open:border-navy-900">
    <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
      <span className="min-w-0 flex-1"><span className="block font-display text-2xl">{entry.name}</span>
        <span className="block break-words text-sm text-muted">{entry.organization || entry.email}</span></span>
      {waiting > 0 && <Tag tone="amber">{waiting} to review</Tag>}
      <span className="text-sm text-muted">{entry.capstoneDone}/{entry.capstoneTotal} capstone steps</span>
      <ChevronDown aria-hidden="true" className="size-5 group-open:rotate-180" />
    </summary>
    <div className="space-y-8 border-t border-line p-4 sm:p-6">
      <p className="break-words text-sm text-muted">{entry.email}</p>
      <fieldset disabled={pending}>
        <legend className="label mb-3">Attendance · {entry.attended.length}/{sessions.length}</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{sessions.map((s) => <label key={s.id} className="flex min-h-11 items-center gap-2 border border-line px-3 text-sm">
          <input type="checkbox" className="size-4 accent-navy-900" checked={entry.attended.includes(s.id)} onChange={(e) => {
            const present = e.target.checked;
            startTransition(async () => {
              setError("");
              try { await setAttendanceAction(entry.id, s.id, present); }
              catch { setError("Attendance could not be saved. Try again."); }
            });
          }} />Session {s.number} · {s.shortDate}
        </label>)}</div>
        <FormMessage message={error} />
      </fieldset>
      <div className="space-y-4">{deliverableSessions.map((s) => {
        const d = entry.deliverables.find((item) => item.sessionId === s.id);
        return <section key={s.id} aria-labelledby={`review-${entry.id}-${s.id}`} className="border border-line bg-paper p-4 sm:p-5">
          <h3 id={`review-${entry.id}-${s.id}`} className="font-semibold">Session {s.number} · {s.deliverable.title}</h3>
          <p className="mt-1 text-sm text-muted">{deliverableStatuses.find((status) => status.value === (d?.status ?? "not_started"))?.label}
            {d && ` · Revision ${d.revision}`}</p>
          {d?.notes && <p className="mt-3 whitespace-pre-wrap break-words text-sm">Participant notes: {d.notes}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
            {d?.linkUrl && <a href={d.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"><ExternalLink className="size-4" aria-hidden="true" />Open work<span className="sr-only"> (new tab)</span></a>}
            {d?.fileId && <a href={`/api/files/${d.fileId}`} className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"><Download className="size-4" aria-hidden="true" />Download work</a>}
          </div>
          {d && (d.linkUrl || d.fileId) ? <ReviewForm userId={entry.id} deliverable={d} /> : <p className="mt-2 text-sm text-muted">A link or file is needed before this work can be reviewed.</p>}
        </section>;
      })}</div>
    </div>
  </details>;
}

function ReviewForm({ userId, deliverable: d }: { userId: string; deliverable: RosterDeliverable }) {
  const [state, action] = useActionState(reviewDeliverableAction, {});
  const id = `feedback-${userId}-${d.sessionId}`;
  return <form action={action} noValidate className="mt-4 space-y-4">
    <input type="hidden" name="userId" value={userId} />
    <input type="hidden" name="sessionId" value={d.sessionId} />
    <input type="hidden" name="version" value={d.version} />
    <details className="border border-line bg-white p-3">
      <summary className="cursor-pointer text-sm font-semibold">Review criteria</summary>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{learningGuides[d.sessionId]?.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
    </details>
    {d.feedback && d.feedbackRevision !== d.revision && <p className="text-sm text-amber-deep">Previous feedback was for revision {d.feedbackRevision}. Check the new work before saving a decision.</p>}
    <TextAreaField id={id} name="feedback" label="Feedback for this revision" hint="Name a strength, explain what to improve, and give one concrete next step. Visible to the participant."
      maxLength={4000} required defaultValue={state.values?.feedback ?? d.feedback} errors={state.errors?.feedback} />
    <SelectField id={`${id}-decision`} name="status" label="Review decision" options={[
      { value: "needs_revision", label: "Needs revision — give a next step" },
      { value: "reviewed", label: "Reviewed — meets the criteria" },
    ]} defaultValue={state.values?.status ?? (d.status === "reviewed" ? "reviewed" : "needs_revision")} errors={state.errors?.status} />
    <SubmitButton variant="secondary" pendingLabel="Saving feedback…">Save feedback</SubmitButton>
    <FormMessage ok={state.ok} message={state.message ?? (state.errors ? "Check the feedback fields above." : undefined)} />
  </form>;
}
