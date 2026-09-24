"use client";

import { useActionState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { addCoachingNoteAction, deleteCoachingNoteAction } from "@/app/actions/dashboard";
import { FormMessage, TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import type { CoachingNote } from "@/lib/store";
import type { FormState } from "@/lib/validation";

export function CoachingLog({ entries }: { entries: CoachingNote[] }) {
  const [state, action] = useActionState(addCoachingNoteAction, {} as FormState);
  const [, startTransition] = useTransition();
  const values = state.values ?? {};

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,23rem)_1fr]">
      <form action={action} className="h-fit space-y-4 border border-line bg-white p-5 sm:p-6" noValidate>
        <h3 className="font-display text-2xl text-navy-900">Capture the conversation</h3>
        <p className="text-sm text-muted">Visible only to you and your instructors. Do not include private customer, employee, or account data.</p>
        <TextField id="coaching-topic" name="topic" label="Session focus" placeholder="e.g. Client onboarding workflow" maxLength={160} defaultValue={values.topic} errors={state.errors?.topic} required />
        <TextAreaField id="coaching-note" name="note" label="What became clear?" placeholder="Record the useful decision, feedback, or insight." maxLength={3000} defaultValue={values.note} errors={state.errors?.note} required />
        <TextAreaField id="coaching-next-step" name="nextStep" label="Next step" placeholder="What will you do before the next session?" maxLength={500} defaultValue={values.nextStep} errors={state.errors?.nextStep} optional />
        <SubmitButton className="w-full" pendingLabel="Saving…">Save coaching note</SubmitButton>
        <FormMessage ok={state.ok} message={state.message} />
      </form>
      <div>
        <div className="border-b-2 border-navy-900 pb-3">
          <p className="label text-amber-deep">Your history</p>
          <p className="mt-1 text-sm text-muted">{entries.length} {entries.length === 1 ? "reflection" : "reflections"} saved</p>
        </div>
        {entries.length === 0 ? (
          <p className="mt-6 border border-dashed border-edge p-6 text-muted">No coaching notes yet. After your next 1:1, capture the decision and one concrete follow-through.</p>
        ) : (
          <ul className="divide-y divide-line">
            {entries.map((entry) => <li key={entry.id} className="group relative py-5 pr-12">
              <p className="label text-cyan-deep">{new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              <h3 className="mt-2 font-display text-2xl text-navy-900">{entry.topic}</h3>
              <p className="mt-2 whitespace-pre-wrap text-ink">{entry.note}</p>
              {entry.nextStep && <p className="mt-3 border-l-2 border-amber pl-3 text-sm"><strong>Next:</strong> {entry.nextStep}</p>}
              <button type="button" className="absolute right-0 top-4 grid size-11 place-items-center text-muted hover:text-danger" onClick={() => startTransition(() => deleteCoachingNoteAction(entry.id))}>
                <Trash2 className="size-4" aria-hidden="true" /><span className="sr-only">Delete coaching note: {entry.topic}</span>
              </button>
            </li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
