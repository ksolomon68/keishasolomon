"use client";

import { useActionState, useOptimistic, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { addFrictionAction, deleteFrictionAction, setFrictionDoneAction } from "@/app/actions/dashboard";
import { FormMessage, SelectField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import { frictionFrequencies, sessionById, type Session } from "@/data/cohortData";
import type { FrictionEntry } from "@/lib/store";
import type { FormState } from "@/lib/validation";

const occurrencesPerWeek = { daily: 5, weekly: 1, monthly: 12 / 52 } as const;

type Update = { type: "done"; id: string; done: boolean } | { type: "remove"; id: string };

const initial: FormState = {};

export function FrictionLog({ entries, schedule }: { entries: FrictionEntry[]; schedule: Session[] }) {
  const targetOptions = [
    { value: "", label: "No specific session" },
    ...schedule
      .filter((s) => s.deliverable)
      .map((s) => ({ value: s.id, label: `Session ${s.number} · ${s.shortDate}: ${s.lab.name}` })),
  ];
  const [state, action] = useActionState(addFrictionAction, initial);
  const [, startTransition] = useTransition();
  const [items, apply] = useOptimistic(entries, (current, update: Update) =>
    update.type === "remove"
      ? current.filter((e) => e.id !== update.id)
      : current.map((e) => (e.id === update.id ? { ...e, done: update.done } : e)),
  );

  const open = items.filter((e) => !e.done);
  const weeklyHours =
    open.reduce((sum, e) => sum + e.minutes * occurrencesPerWeek[e.frequency], 0) / 60;
  const v = state.values ?? {};

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <form action={action} noValidate className="h-fit space-y-4 border border-line bg-white p-5 sm:p-6">
        <h3 className="font-display text-xl text-navy-900">Log a friction point</h3>
        <p className="text-sm text-muted">Visible to you and your instructors so they can plan the labs. Use a task description, not private customer or employee data.</p>
        <TextField
          id="friction-task"
          name="task"
          label="What's the repetitive task?"
          placeholder="e.g. Sorting the Monday inbox into priorities"
          defaultValue={v.task}
          errors={state.errors?.task}
          maxLength={500}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="friction-frequency"
            name="frequency"
            label="How often?"
            options={frictionFrequencies}
            defaultValue={v.frequency ?? "weekly"}
            errors={state.errors?.frequency}
          />
          <TextField
            id="friction-minutes"
            name="minutes"
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            label="Minutes each time"
            defaultValue={v.minutes}
            errors={state.errors?.minutes}
            required
          />
        </div>
        <SelectField
          id="friction-session"
          name="sessionId"
          label="Target in which build lab?"
          options={targetOptions}
          defaultValue={v.sessionId ?? ""}
          errors={state.errors?.sessionId}
        />
        <SubmitButton variant="secondary" className="w-full" pendingLabel="Adding…">
          Add to my log
        </SubmitButton>
        <FormMessage ok={state.ok} message={state.message} />
      </form>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-navy-900 pb-3">
          <p role="status" className="text-ink">
            <span className="font-display text-3xl text-navy-900">{open.length}</span> open{" "}
            {open.length === 1 ? "task" : "tasks"}
          </p>
          <p className="text-sm text-muted">
            ≈ <span className="font-semibold text-ink">{weeklyHours.toFixed(1)} hrs/week</span> to reclaim
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-6 border border-dashed border-edge p-6 text-muted">
            Nothing logged yet. Start with the last thing that made you sigh at your desk. These entries steer the
            build labs.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((entry) => {
              const session = entry.sessionId ? sessionById(entry.sessionId) : undefined;
              return (
                <li key={entry.id} className="flex items-start gap-4 py-4">
                  <input
                    type="checkbox"
                    id={`done-${entry.id}`}
                    checked={entry.done}
                    onChange={(e) =>
                      startTransition(async () => {
                        apply({ type: "done", id: entry.id, done: e.target.checked });
                        await setFrictionDoneAction(entry.id, e.target.checked);
                      })
                    }
                    className="mt-1 size-5 shrink-0 accent-navy-900"
                  />
                  <label htmlFor={`done-${entry.id}`} className="min-w-0 flex-1 cursor-pointer">
                    <span className={`block text-ink ${entry.done ? "line-through decoration-2" : "font-medium"}`}>
                      {entry.task}
                    </span>
                    <span className="sr-only">{entry.done ? " (solved)" : " (open). Check to mark solved."}</span>
                    <span className="mt-2 flex flex-wrap gap-2">
                      <Tag>
                        {entry.minutes} min · {entry.frequency}
                      </Tag>
                      {session && <Tag tone="cyan">Lab: Session {session.number}</Tag>}
                      {entry.done && <Tag tone="success">Solved</Tag>}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="grid size-11 shrink-0 place-items-center text-muted hover:text-danger"
                    onClick={() =>
                      startTransition(async () => {
                        apply({ type: "remove", id: entry.id });
                        await deleteFrictionAction(entry.id);
                      })
                    }
                  >
                    <Trash2 className="size-5" aria-hidden="true" />
                    <span className="sr-only">Delete “{entry.task}”</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
