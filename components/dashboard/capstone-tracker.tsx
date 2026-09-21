"use client";

import { useOptimistic, useTransition } from "react";
import { Check } from "lucide-react";
import { setCapstoneStepAction } from "@/app/actions/dashboard";
import { Tag } from "@/components/ui/tag";
import { capstoneSteps, type Session } from "@/data/cohortData";
import { Countdown } from "./countdown";

export function CapstoneTracker({ doneIds, schedule }: { doneIds: string[]; schedule: Session[] }) {
  const [, startTransition] = useTransition();
  const showcase = schedule.find((s) => s.id === "s8")!;
  const [done, apply] = useOptimistic(doneIds, (current, update: { id: string; done: boolean }) =>
    update.done ? [...new Set([...current, update.id])] : current.filter((id) => id !== update.id),
  );

  const total = capstoneSteps.length;
  const count = capstoneSteps.filter((s) => done.includes(s.id)).length;
  const percent = Math.round((count / total) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <aside className="h-fit space-y-5 border border-navy-900 bg-navy-900 p-6 text-white lg:sticky lg:top-36" data-surface="dark">
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
        </div>
      </aside>

      <ol className="space-y-3">
        {capstoneSteps.map((step, i) => {
          const isDone = done.includes(step.id);
          const session = schedule.find((s) => s.id === step.bySessionId);
          return (
            <li key={step.id}>
              <label
                className={`flex cursor-pointer gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy-900 sm:p-5 ${
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
                  <span className="mt-1 block text-[0.9375rem] text-muted">{step.detail}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
