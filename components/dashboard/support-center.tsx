"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, ChevronDown, LifeBuoy, MessageCircle } from "lucide-react";
import {
  createSupportRequestAction,
  replyToSupportAction,
  resolveOwnSupportRequestAction,
} from "@/app/actions/dashboard";
import { FormMessage, SelectField, TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import type { SupportMessage, SupportRequest } from "@/lib/store";
import type { FormState } from "@/lib/validation";

export type ParticipantSupportThread = SupportRequest & { messages: SupportMessage[] };

const priorityOptions = [
  { value: "normal", label: "Normal — I can keep working" },
  { value: "urgent", label: "Urgent — I am blocked" },
] as const;

const statusLabel = {
  open: "Instructor reply needed",
  waiting_on_participant: "Instructor replied",
  resolved: "Resolved",
} as const;

export function SupportCenter({ threads }: { threads: ParticipantSupportThread[] }) {
  const [state, action] = useActionState(createSupportRequestAction, {} as FormState);
  const [showForm, setShowForm] = useState(threads.length === 0);
  const openCount = threads.filter((thread) => thread.status !== "resolved").length;
  const values = state.values ?? {};

  return (
    <div className="border border-navy-900 bg-white">
      <div className="grid gap-5 bg-navy-900 p-5 text-white sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="label text-cyan">Direct instructor support</p>
          <h3 className="mt-2 font-display text-2xl">Ask for help without waiting for the next session</h3>
          <p className="mt-2 max-w-2xl text-sm text-on-navy">
            Explain where you are stuck. Your instructor can reply here, ask a follow-up question, or confirm the next step.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-amber bg-amber px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-white"
          onClick={() => setShowForm((current) => !current)}
          aria-expanded={showForm}
          aria-controls="support-request-form"
        >
          <LifeBuoy className="size-4" aria-hidden="true" />
          {showForm ? "Close form" : "Ask your instructor"}
        </button>
      </div>

      {showForm && (
        <form id="support-request-form" action={action} noValidate className="grid gap-4 border-b border-line bg-paper p-5 sm:p-6 lg:grid-cols-2">
          <TextField
            id="support-subject"
            name="subject"
            label="What do you need help with?"
            placeholder="e.g. My prompt keeps losing the brand voice"
            maxLength={160}
            defaultValue={values.subject}
            errors={state.errors?.subject}
            required
          />
          <SelectField
            id="support-priority"
            name="priority"
            label="How blocked are you?"
            options={priorityOptions}
            defaultValue={values.priority ?? "normal"}
            errors={state.errors?.priority}
          />
          <div className="lg:col-span-2">
            <TextAreaField
              id="support-body"
              name="body"
              label="What have you tried, and what happened?"
              hint="Do not include customer, employee, password, or account data."
              placeholder="Share enough context for your instructor to suggest a useful next move."
              maxLength={4000}
              defaultValue={values.body}
              errors={state.errors?.body}
              required
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:col-span-2">
            <SubmitButton pendingLabel="Sending request…">Send help request</SubmitButton>
            <FormMessage ok={state.ok} message={state.message} />
          </div>
        </form>
      )}

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b-2 border-navy-900 pb-3">
          <div>
            <p className="label text-amber-deep">Your conversations</p>
            <p className="mt-1 text-sm text-muted">{openCount} active · replies stay private to you and the instructor team</p>
          </div>
        </div>
        {threads.length === 0 ? (
          <p className="border border-dashed border-edge p-6 text-muted">No help requests yet. Use the form above whenever you get stuck.</p>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => <ParticipantThread key={thread.id} thread={thread} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipantThread({ thread }: { thread: ParticipantSupportThread }) {
  const [pending, startTransition] = useTransition();
  const latest = thread.messages.at(-1);
  return (
    <details className="group border border-line bg-white" open={thread.status === "waiting_on_participant"}>
      <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <MessageCircle className="size-5 shrink-0 text-cyan-deep" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy-900">{thread.subject}</span>
          <span className="mt-0.5 block text-sm text-muted">
            Updated {formatDate(thread.updatedAt)}{latest ? ` · ${thread.messages.length} messages` : ""}
          </span>
        </span>
        {thread.priority === "urgent" && thread.status !== "resolved" && <Tag tone="amber">Urgent</Tag>}
        <Tag tone={thread.status === "resolved" ? "success" : thread.status === "waiting_on_participant" ? "cyan" : "amber"}>
          {statusLabel[thread.status]}
        </Tag>
        <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-line p-4 sm:p-5">
        <MessageHistory messages={thread.messages} />
        {thread.status !== "resolved" ? (
          <>
            <SupportReplyForm requestId={thread.id} />
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => resolveOwnSupportRequestAction(thread.id))}
              className="mt-3 inline-flex min-h-11 items-center gap-2 px-1 text-sm font-semibold text-success underline-offset-4 hover:underline disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {pending ? "Updating…" : "This solved my question"}
            </button>
          </>
        ) : null}
      </div>
    </details>
  );
}

function SupportReplyForm({ requestId }: { requestId: string }) {
  const [state, action] = useActionState(replyToSupportAction, {} as FormState);
  return (
    <form action={action} className="mt-5 border-t border-line pt-5" noValidate>
      <input type="hidden" name="requestId" value={requestId} />
      <TextAreaField
        id={`support-reply-${requestId}`}
        name="body"
        label="Reply to your instructor"
        placeholder="Add an answer, result, or follow-up question."
        maxLength={4000}
        errors={state.errors?.body}
        required
      />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <SubmitButton variant="secondary" pendingLabel="Sending…">Send reply</SubmitButton>
        <FormMessage ok={state.ok} message={state.message} />
      </div>
    </form>
  );
}

export function MessageHistory({ messages }: { messages: SupportMessage[] }) {
  return (
    <ol className="space-y-3" aria-label="Conversation history">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`max-w-3xl border-l-4 p-4 ${message.authorRole === "admin" ? "ml-auto border-cyan-deep bg-cyan/10" : "border-amber-deep bg-paper"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="label text-muted">{message.authorRole === "admin" ? "Instructor" : "You"}</p>
            <time className="text-xs text-muted" dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{message.body}</p>
        </li>
      ))}
    </ol>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
