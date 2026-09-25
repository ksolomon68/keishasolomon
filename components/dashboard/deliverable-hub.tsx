"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronDown, Download } from "lucide-react";
import { saveDeliverableAction } from "@/app/actions/dashboard";
import { FormMessage, SelectField, TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import { deliverableSessions, deliverableStatuses, type DeliverableStatus } from "@/data/cohortData";
import type { Deliverable } from "@/lib/store";
import type { FormState } from "@/lib/validation";
import { LearningGuide } from "./learning-guide";

export interface FileInfo {
  name: string;
  sizeLabel: string;
}

const statusTone = {
  not_started: "neutral",
  in_progress: "cyan",
  submitted: "amber",
  reviewed: "success",
  needs_revision: "cyan",
} as const satisfies Record<DeliverableStatus, string>;

const actionStatusLabel: Record<DeliverableStatus, string> = {
  not_started: "Ready to start",
  in_progress: "Continue draft",
  submitted: "Awaiting feedback",
  reviewed: "Reviewed",
  needs_revision: "Revision requested",
};

/** Reviewed is set by the instructor, so it only appears as a choice once it applies. */
const participantStatuses = deliverableStatuses.filter((s) => s.value !== "reviewed" && s.value !== "needs_revision");

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
  const otherWork = useRef<HTMLDetailsElement>(null);
  const statusFor = (sessionId: string): DeliverableStatus => bySession.get(sessionId)?.status ?? "not_started";
  const priority = deliverableSessions.find((session) => statusFor(session.id) === "needs_revision")
    ?? deliverableSessions.find((session) => statusFor(session.id) === "in_progress")
    ?? deliverableSessions.find((session) => statusFor(session.id) === "not_started");
  const start = priority
    ? deliverableSessions.findIndex((session) => session.id === priority.id)
    : Math.max(0, deliverableSessions.length - 2);
  const featured = deliverableSessions.slice(start, start + 2);
  const remaining = deliverableSessions.filter((session) => !featured.includes(session));

  useEffect(() => {
    const reveal = () => {
      const target = window.location.hash.startsWith("#deliverable-")
        ? document.getElementById(window.location.hash.slice(1))
        : null;
      if (!target || !otherWork.current?.contains(target)) return;
      otherWork.current.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  const row = (session: (typeof deliverableSessions)[number]) => (
    <DeliverableRow
      key={session.id}
      session={session}
      deliverable={bySession.get(session.id)}
      file={bySession.get(session.id)?.fileId ? files[bySession.get(session.id)!.fileId!] : undefined}
      accept={accept}
    />
  );

  return (
    <div>
      <p className="label mb-3 text-cyan-deep">{priority ? "Current work" : "Latest work"}</p>
      <ol className="space-y-3">{featured.map(row)}</ol>
      {remaining.length > 0 && (
        <details ref={otherWork} className="group mt-4 border border-line bg-white transition-colors open:border-navy-900">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 font-semibold text-navy-900 transition-colors hover:bg-paper marker:content-none sm:px-5 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="group-open:hidden">Show {remaining.length} other deliverables</span>
              <span className="hidden group-open:inline">Hide other deliverables</span>
            </span>
            <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
          </summary>
          <ol className="space-y-3 border-t border-line p-4 sm:p-5">{remaining.map(row)}</ol>
        </details>
      )}
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
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const reveal = () => {
      if (window.location.hash === `#deliverable-${session.id}` && disclosure.current) {
        disclosure.current.open = true;
        disclosure.current.scrollIntoView({ block: "start" });
      }
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [session.id]);

  return (
    <li>
      <details ref={disclosure} name="deliverables" id={`deliverable-${session.id}`} className="group scroll-mt-10 border border-line bg-white open:border-navy-900">
        <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 p-4 marker:content-none transition-colors hover:bg-paper group-open:bg-paper sm:flex sm:flex-wrap sm:gap-3 sm:px-5 [&::-webkit-details-marker]:hidden">
          <span className="row-span-2 grid size-10 shrink-0 place-items-center border border-navy-900 font-display text-lg text-navy-900 sm:row-auto" aria-hidden="true">
            {session.number}
          </span>
          <span className="min-w-0 sm:flex-1">
            <span className="block font-semibold text-ink">{session.deliverable.title}</span>
            <span className="label mt-1 hidden text-muted sm:block">
              Session {session.number} · {session.shortDate}
            </span>
          </span>
          <ChevronDown className="col-start-3 row-span-2 row-start-1 size-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none sm:order-last sm:row-auto" aria-hidden="true" />
          <span className="col-start-2 flex min-w-0 flex-wrap items-center gap-2 sm:contents">
            <span className="label text-muted sm:hidden">Session {session.number} · {session.shortDate}</span>
            <Tag tone={statusTone[status]}>
              {(status === "submitted" || isReviewed) && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
              {actionStatusLabel[status]}
            </Tag>
          </span>
        </summary>

        <div className="border-t border-line p-4 sm:p-5">
          {deliverable?.feedback && <aside aria-label="Instructor feedback" className="mb-5 border-l-4 border-cyan-deep bg-paper p-4">
            <p className="label text-cyan-deep">Instructor feedback · revision {deliverable.feedbackRevision}</p>
            <p className="mt-3 whitespace-pre-wrap break-words">{deliverable.feedback}</p>
            {deliverable.feedbackRevision !== deliverable.revision && <p className="mt-3 text-sm text-muted">This feedback is for an earlier revision. Your updated work has not been reviewed yet.</p>}
          </aside>}
          <details className="border border-line p-4"><summary className="min-h-7 cursor-pointer font-semibold">Build guide &amp; submission checklist</summary>
            <div className="mt-5"><LearningGuide sessionId={session.id} /></div>
          </details>
        </div>

        <form action={action} noValidate className="space-y-4 border-t border-line p-4 sm:p-5">
          <p className="max-w-2xl text-sm text-muted">{session.deliverable.description}</p>
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="version" value={deliverable?.version ?? 0} />
          <p className="text-sm text-muted">{deliverable ? `Current revision: ${deliverable.revision}. ` : ""}Changes to your link, file, or notes create a new revision. Editing reviewed work sends it back for review. For changes within a linked document, describe the changes in your notes when resubmitting.</p>

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
                defaultValue={v.status ?? (status === "needs_revision" ? "in_progress" : status)}
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
            <FormMessage ok={state.ok} message={state.message ?? (state.errors ? "Check the fields above. Reattach any selected upload before trying again." : undefined)} />
          </div>
        </form>
      </details>
    </li>
  );
}
