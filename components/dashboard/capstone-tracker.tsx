"use client";

import { useOptimistic, useTransition } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { setCapstoneStepAction } from "@/app/actions/dashboard";
import { Tag } from "@/components/ui/tag";
import { capstoneSteps, type Session } from "@/data/cohortData";
import { Countdown } from "./countdown";

export function CapstoneTracker({ doneIds, schedule }: { doneIds: string[]; schedule: Session[] }) {
  const [isPending, startTransition] = useTransition();
  const showcase = schedule.find((s) => s.id === "s8")!;
  const [done, apply] = useOptimistic(doneIds, (current, update: { id: string; done: boolean }) =>
    update.done ? [...new Set([...current, update.id])] : current.filter((id) => id !== update.id),
  );

  const total = capstoneSteps.length;
  const count = capstoneSteps.filter((s) => done.includes(s.id)).length;
  const percent = Math.round((count / total) * 100);
  const firstIncomplete = capstoneSteps.findIndex((step) => !done.includes(step.id));
  const featuredStart = firstIncomplete < 0 ? Math.max(0, total - 3) : firstIncomplete;
  const featured = capstoneSteps.slice(featuredStart, featuredStart + 3);
  const remaining = capstoneSteps.filter((step) => !featured.includes(step));

  const renderStep = (step: (typeof capstoneSteps)[number]) => {
    const i = capstoneSteps.indexOf(step);
    const isDone = done.includes(step.id);
    const session = schedule.find((s) => s.id === step.bySessionId);
    return (
      <li key={step.id}>
        <label
          className={`flex cursor-pointer gap-3 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy-900 sm:gap-4 sm:p-5 ${
            isDone ? "border-success bg-success/5" : "border-line bg-white hover:border-navy-900"
          }`}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={isDone}
            onChange={(e) => {
              const next = e.target.checked;
              startTransition(async () => {
                apply({ id: step.id, done: next });
                await setCapstoneStepAction(step.id, next);
              });
            }}
          />
          <span
            aria-hidden="true"
            className={`mt-0.5 grid size-8 shrink-0 place-items-center border-2 font-display text-sm ${
              isDone ? "border-success bg-success text-white" : "border-navy-900 text-navy-900"
            }`}
          >
            {isDone ? <Check className="size-5" strokeWidth={3} /> : i + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className={`font-semibold ${isDone ? "text-success" : "text-ink"}`}>{step.title}</span>
              {session && (
                <Tag tone="cyan">
                  By session {session.number} · {session.shortDate}
                </Tag>
              )}
            </span>
            <span className="mt-1 block text-sm text-muted sm:text-[0.9375rem]">{step.detail}</span>
          </span>
        </label>
      </li>
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <aside className="h-fit space-y-5 border border-navy-900 bg-navy-900 p-6 text-white lg:sticky lg:top-36" data-surface="dark" aria-busy={isPending}>
        <p className="label text-amber">Road to {showcase.dateLabel}</p>
        <p className="font-display text-2xl leading-snug">5-minute lightning presentation</p>
        <Countdown date={showcase.date} onDark />
        <div>
          <div className="flex items-baseline justify-between">
            <p role="status" className="text-on-navy">
              <span className="font-display text-3xl text-amber">{count}</span> of {total} steps
            </p>
            <p className="label text-white">{percent}%</p>
          </div>
          <progress
            className="mt-2 h-2 w-full overflow-hidden bg-white/20 [&::-moz-progress-bar]:bg-amber [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-amber"
            value={count}
            max={total}
            aria-label="Capstone progress"
          />
          <p aria-live="polite" className="mt-2 min-h-5 text-sm text-on-navy">
            {isPending && <span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />Saving progress…</span>}
          </p>
        </div>
      </aside>

      <div>
        <p className="label mb-3 text-cyan-deep">{firstIncomplete < 0 ? "Latest milestones" : "Up next"}</p>
        <ol className="space-y-3">{featured.map(renderStep)}</ol>
        {remaining.length > 0 && (
          <details className="group mt-4 border border-line bg-white transition-colors open:border-navy-900">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 font-semibold text-navy-900 transition-colors hover:bg-paper marker:content-none sm:px-5 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="group-open:hidden">Show {remaining.length} other milestones</span>
                <span className="hidden group-open:inline">Hide other milestones</span>
              </span>
              <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <ol className="space-y-3 border-t border-line p-4 sm:p-5">{remaining.map(renderStep)}</ol>
          </details>
        )}
      </div>
    </div>
  );
}
