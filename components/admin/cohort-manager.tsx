"use client";

import { useActionState, useTransition } from "react";
import { Archive, KeyRound, Mail, RotateCcw } from "lucide-react";
import {
  createCohortAction,
  regenerateAccessCodeAction,
  setCohortArchivedAction,
  updateCohortAction,
} from "@/app/actions/admin";
import { Button, buttonStyles } from "@/components/ui/button";
import { FormMessage, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import type { Session } from "@/data/cohortData";
import type { Cohort } from "@/lib/store";
import type { FormState } from "@/lib/validation";

/** Settings for the selected cohort. Remount it (via `key`) when the cohort or its code changes. */
export function CohortSettings({
  cohort,
  schedule,
  participantCount,
  inviteHref,
}: {
  cohort: Cohort;
  schedule: Session[];
  participantCount: number;
  inviteHref: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(updateCohortAction, {});
  const [pending, startTransition] = useTransition();
  const v = state.values ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-muted">
          {participantCount} {participantCount === 1 ? "participant" : "participants"}
        </p>
        {cohort.archived ? <Tag tone="amber">Archived · registration closed</Tag> : <Tag tone="cyan">Open for registration</Tag>}
      </div>

      <form action={action} noValidate className="space-y-6 border border-line bg-white p-5 sm:p-6">
        <input type="hidden" name="cohortId" value={cohort.id} />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            id="cohort-name"
            name="name"
            label="Cohort name"
            hint="Shown to participants and printed on their certificate."
            defaultValue={v.name ?? cohort.name}
            errors={state.errors?.name}
            maxLength={120}
            required
          />
          <TextField
            id="cohort-code"
            name="accessCode"
            label="Access code"
            hint="Participants enter this on the register page to join this cohort."
            defaultValue={v.accessCode ?? cohort.accessCode}
            errors={state.errors?.accessCode}
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={64}
            required
          />
          <TextField
            id="cohort-completion"
            name="completionDate"
            type="date"
            label="Certificate date"
            hint="Leave blank to use this cohort's last session date."
            defaultValue={v.completionDate ?? cohort.completionDate ?? ""}
            errors={state.errors?.completionDate}
            optional
          />
        </div>

        <fieldset>
          <legend className="label mb-3 text-ink">Session dates</legend>
          <p className="mb-4 text-sm text-muted">
            Each cohort keeps its own calendar. Leave a date blank while it is still to be announced.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {schedule.map((s) => (
              <TextField
                key={s.id}
                id={`cohort-date-${s.id}`}
                name={`date-${s.id}`}
                type="date"
                label={`Session ${s.number}`}
                defaultValue={v[`date-${s.id}`] ?? s.date ?? ""}
                errors={state.errors?.[`date-${s.id}`]}
                optional
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton variant="secondary" pendingLabel="Saving…">
            Save cohort
          </SubmitButton>
          <FormMessage ok={state.ok} message={state.message ?? (state.errors ? "Check the fields above." : undefined)} />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <a href={inviteHref} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          <Mail className="size-4" aria-hidden="true" />
          Email invite
        </a>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => {
            if (!window.confirm(`Create a new access code for ${cohort.name}? The current code will stop working for new registrations.`)) return;
            startTransition(() => regenerateAccessCodeAction(cohort.id));
          }}
        >
          <KeyRound className="size-4" aria-hidden="true" />
          New code
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => {
            if (!cohort.archived && !window.confirm(`Archive ${cohort.name}? Registration closes; current participants keep their access.`)) return;
            startTransition(() => setCohortArchivedAction(cohort.id, !cohort.archived));
          }}
        >
          {cohort.archived ? <RotateCcw className="size-4" aria-hidden="true" /> : <Archive className="size-4" aria-hidden="true" />}
          {cohort.archived ? "Reopen cohort" : "Archive cohort"}
        </Button>
      </div>
    </div>
  );
}

export function NewCohortForm({ firstCohort = false }: { firstCohort?: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(createCohortAction, {});
  const v = state.values ?? {};

  return (
    <form action={action} noValidate className="grid gap-5 border border-line bg-white p-5 sm:p-6 md:grid-cols-[1fr_1fr_auto] md:items-start">
      <TextField
        id="new-cohort-name"
        name="name"
        label="Cohort name"
        placeholder="e.g. Chamber Leadership Program 2027"
        defaultValue={v.name}
        errors={state.errors?.name}
        maxLength={120}
        required
      />
      <TextField
        id="new-cohort-code"
        name="accessCode"
        label="Access code"
        hint="Leave blank and we'll generate a random one."
        defaultValue={v.accessCode}
        errors={state.errors?.accessCode}
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={64}
        optional
      />
      <div className="md:pt-[1.625rem]">
        <SubmitButton variant={firstCohort ? "primary" : "secondary"} className="w-full" pendingLabel="Creating…">
          Create cohort
        </SubmitButton>
      </div>
      <div className="md:col-span-3">
        <FormMessage ok={state.ok} message={state.message} />
        <p className="text-sm text-muted">
          New cohorts start with the standard session calendar; edit the dates once it is created.
        </p>
      </div>
    </form>
  );
}
