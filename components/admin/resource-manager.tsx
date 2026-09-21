"use client";

import { useActionState, useTransition } from "react";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { deleteResourceAction, uploadResourceAction } from "@/app/actions/admin";
import { FormMessage, SelectField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import { resourceKinds, type Session } from "@/data/cohortData";
import type { Resource } from "@/lib/store";
import type { FormState } from "@/lib/validation";

const kindLabel = Object.fromEntries(resourceKinds.map((k) => [k.value, k.label]));

export function ResourceManager({
  resources,
  accept,
  cohortId,
  cohortName,
  schedule,
}: {
  resources: Resource[];
  accept: string;
  cohortId: string;
  cohortName: string;
  schedule: Session[];
}) {
  const [state, action] = useActionState<FormState, FormData>(uploadResourceAction, {});
  const [pending, startTransition] = useTransition();
  const v = state.values ?? {};
  const sessionOptions = schedule.map((s) => ({ value: s.id, label: `Session ${s.number} · ${s.dateLabel}` }));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
      <form action={action} noValidate className="h-fit space-y-4 border border-line bg-white p-5 sm:p-6">
        <h3 className="font-display text-xl text-navy-900">Add a resource</h3>
        <input type="hidden" name="cohortId" value={cohortId} />
        <SelectField
          id="res-session"
          name="sessionId"
          label="Session"
          options={sessionOptions}
          defaultValue={v.sessionId ?? schedule[0].id}
          errors={state.errors?.sessionId}
        />
        <TextField
          id="res-title"
          name="title"
          label="Title"
          placeholder="e.g. Prompt Duel starter sheet"
          defaultValue={v.title}
          errors={state.errors?.title}
          required
        />
        <SelectField
          id="res-kind"
          name="kind"
          label="Type"
          options={resourceKinds}
          defaultValue={v.kind ?? "prompt_sheet"}
          errors={state.errors?.kind}
        />
        <div className="space-y-2">
          <label htmlFor="res-file" className="block text-sm font-semibold text-ink">
            File <span className="font-normal text-muted">(max 10 MB)</span>
          </label>
          <input
            id="res-file"
            type="file"
            name="file"
            accept={accept}
            aria-invalid={state.errors?.file ? true : undefined}
            aria-describedby={state.errors?.file ? "res-file-error" : undefined}
            className="block w-full text-sm file:mr-4 file:min-h-11 file:cursor-pointer file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-navy-700"
          />
          {state.errors?.file && (
            <p id="res-file-error" className="text-sm font-medium text-danger">
              {state.errors.file[0]}
            </p>
          )}
        </div>
        <TextField
          id="res-link"
          name="linkUrl"
          type="url"
          label="…or link to a hosted file"
          hint="Use a link for Google Docs, Slides or anything already online."
          defaultValue={v.linkUrl}
          errors={state.errors?.linkUrl}
          optional
        />
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="shared" defaultChecked={v.shared === "on"} className="mt-0.5 size-5 shrink-0 accent-navy-900" />
          <span>
            <span className="font-semibold text-ink">Share with every cohort</span>
            <span className="block text-muted">
              Leave unchecked to publish only to {cohortName}.
            </span>
          </span>
        </label>
        <SubmitButton variant="secondary" className="w-full" pendingLabel="Uploading…">
          Publish to {cohortName}
        </SubmitButton>
        <FormMessage ok={state.ok} message={state.message} />
      </form>

      <div className="space-y-6">
        {schedule.map((session) => {
          const list = resources.filter((r) => r.sessionId === session.id);
          return (
            <section key={session.id} aria-labelledby={`res-${session.id}`}>
              <h3 id={`res-${session.id}`} className="label border-b border-line pb-2 text-ink">
                Session {session.number} · {session.shortDate}
              </h3>
              {list.length === 0 ? (
                <p className="py-3 text-sm text-muted">Nothing published yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {list.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 py-2.5">
                      {r.fileId ? (
                        <Download className="size-4 shrink-0 text-cyan-deep" aria-hidden="true" />
                      ) : (
                        <ExternalLink className="size-4 shrink-0 text-cyan-deep" aria-hidden="true" />
                      )}
                      <a
                        href={r.fileId ? `/api/files/${r.fileId}` : (r.linkUrl ?? "#")}
                        {...(r.fileId ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                        className="min-w-0 flex-1 truncate font-medium text-navy-900 underline underline-offset-4"
                      >
                        {r.title}
                      </a>
                      {r.cohortId === null && <Tag tone="cyan">All cohorts</Tag>}
                      <Tag>{kindLabel[r.kind]}</Tag>
                      <button
                        type="button"
                        disabled={pending}
                        className="grid size-11 shrink-0 place-items-center text-muted hover:text-danger disabled:opacity-50"
                        onClick={() => {
                          if (!window.confirm(`Delete “${r.title}”? Participants will lose access immediately.`)) return;
                          startTransition(() => deleteResourceAction(r.id));
                        }}
                      >
                        <Trash2 className="size-5" aria-hidden="true" />
                        <span className="sr-only">Delete {r.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
