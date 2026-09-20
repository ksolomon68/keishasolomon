"use client";

import { useActionState } from "react";
import { CheckCircle2, ChevronDown, Download } from "lucide-react";
import { saveDeliverableAction } from "@/app/actions/dashboard";
import { FormMessage, SelectField, TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import { deliverableSessions, deliverableStatuses, type DeliverableStatus } from "@/data/cohortData";
import type { Deliverable } from "@/lib/store";
import type { FormState } from "@/lib/validation";

export interface FileInfo {
  name: string;
  sizeLabel: string;
}

const statusTone = {
  not_started: "neutral",
  in_progress: "cyan",
  submitted: "amber",
  reviewed: "success",
} as const satisfies Record<DeliverableStatus, string>;

const statusLabel = Object.fromEntries(deliverableStatuses.map((s) => [s.value, s.label])) as Record<
  DeliverableStatus,
  string
>;

/** Reviewed is set by the instructor, so it only appears as a choice once it applies. */
const participantStatuses = deliverableStatuses.filter((s) => s.value !== "reviewed");

export function DeliverableHub({
  deliverables,
  files,
  accept,
}: {
  deliverables: Deliverable[];
  files: Record<string, FileInfo>;
  accept: string;
}) {
  const bySession = new Map(deliverables.map((d) => [d.sessionId, d]));
  const total = deliverableSessions.length;
  const submitted = deliverables.filter((d) => d.status === "submitted" || d.status === "reviewed").length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p role="status" className="text-ink">
          <span className="font-display text-3xl text-navy-900">{submitted}</span> of {total} deliverables submitted
        </p>
        <progress
          className="h-2 min-w-40 flex-1 overflow-hidden [&::-moz-progress-bar]:bg-navy-900 [&::-webkit-progress-bar]:bg-line [&::-webkit-progress-value]:bg-navy-900"
          value={submitted}
          max={total}
          aria-label="Deliverables submitted"
        />
      </div>

      <ol className="mt-6 space-y-3">
        {deliverableSessions.map((session) => (
          <DeliverableRow
            key={session.id}
            session={session}
            deliverable={bySession.get(session.id)}
            file={bySession.get(session.id)?.fileId ? files[bySession.get(session.id)!.fileId!] : undefined}
            accept={accept}
          />
        ))}
      </ol>
    </div>
  );
}

function DeliverableRow({
  session,
  deliverable,
  file,
  accept,
}: {
  session: (typeof deliverableSessions)[number];
  deliverable?: Deliverable;
  file?: FileInfo;
  accept: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveDeliverableAction, {});
  const status = deliverable?.status ?? "not_started";
  const isReviewed = status === "reviewed";
  const v = state.values ?? {};
  const id = `deliv-${session.id}`;

  return (
    <li>
      <details className="group border border-line bg-white open:border-navy-900">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 p-4 marker:content-none hover:bg-paper sm:px-5 [&::-webkit-details-marker]:hidden">
          <span className="grid size-10 shrink-0 place-items-center border border-navy-900 font-display text-lg text-navy-900" aria-hidden="true">
            {session.number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">{session.deliverable.title}</span>
            <span className="label mt-0.5 block text-muted">
              Session {session.number} · {session.shortDate}
            </span>
          </span>
          <Tag tone={statusTone[status]}>
            {(status === "submitted" || isReviewed) && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
            {statusLabel[status]}
          </Tag>
          <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>

        <form action={action} noValidate className="space-y-4 border-t border-line p-4 sm:p-5">
          <p className="max-w-2xl text-sm text-muted">{session.deliverable.description}</p>
          <input type="hidden" name="sessionId" value={session.id} />

          <div className="grid gap-4 md:grid-cols-2">
            {isReviewed ? (
              <div>
                <p className="text-sm font-semibold text-ink">Status</p>
                <p className="mt-2 text-success">Reviewed by your instructor</p>
                <input type="hidden" name="status" value="reviewed" />
              </div>
            ) : (
              <SelectField
                id={`${id}-status`}
                name="status"
                label="Status"
                options={participantStatuses}
                defaultValue={v.status ?? status}
                errors={state.errors?.status}
              />
            )}
            <TextField
              id={`${id}-link`}
              name="linkUrl"
              type="url"
              label="Link to your work"
              hint="Google Doc, Notion page, prototype URL… make sure Keisha has view access."
              defaultValue={v.linkUrl ?? deliverable?.linkUrl ?? ""}
              errors={state.errors?.linkUrl}
              optional
            />
          </div>

          <TextAreaField
            id={`${id}-notes`}
            name="notes"
            label="Progress notes"
            hint="What's done, what's blocking you, what you'd like feedback on."
            defaultValue={v.notes ?? deliverable?.notes ?? ""}
            errors={state.errors?.notes}
            maxLength={2000}
            optional
          />

          <div className="space-y-2">
            <label htmlFor={`${id}-file`} className="block text-sm font-semibold text-ink">
              Upload a file <span className="font-normal text-muted">(optional · PDF, Office, CSV, text or image · max 10 MB)</span>
            </label>
            <input
              id={`${id}-file`}
              type="file"
              name="file"
              accept={accept}
              aria-describedby={state.errors?.file ? `${id}-file-error` : undefined}
              aria-invalid={state.errors?.file ? true : undefined}
              className="block w-full text-sm file:mr-4 file:min-h-11 file:cursor-pointer file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-navy-700"
            />
            {state.errors?.file && (
              <p id={`${id}-file-error`} className="text-sm font-medium text-danger">
                {state.errors.file[0]}
              </p>
            )}
            {file && deliverable?.fileId && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border border-line bg-paper p-3 text-sm">
                <a
                  href={`/api/files/${deliverable.fileId}`}
                  className="inline-flex items-center gap-2 font-semibold text-navy-900 underline underline-offset-4"
                >
                  <Download className="size-4" aria-hidden="true" />
                  {file.name}
                  <span className="font-normal text-muted">({file.sizeLabel})</span>
                </a>
                <label className="inline-flex min-h-11 items-center gap-2 text-ink">
                  <input type="checkbox" name="removeFile" className="size-4 accent-navy-900" />
                  Remove this file
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton variant="secondary">Save deliverable</SubmitButton>
            <FormMessage ok={state.ok} message={state.message} />
          </div>
        </form>
      </details>
    </li>
  );
}
