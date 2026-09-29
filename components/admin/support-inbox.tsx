"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, ChevronDown, Mail, MessageSquareReply, RotateCcw } from "lucide-react";
import { replyAsInstructorAction, setSupportStatusAction } from "@/app/actions/admin";
import { FormMessage, TextAreaField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import type { SupportMessage, SupportRequest } from "@/lib/store";
import type { FormState } from "@/lib/validation";

export type InstructorSupportThread = SupportRequest & {
  participant: { name: string; email: string; organization: string };
  messages: SupportMessage[];
};

const filters = [
  { value: "needs_reply", label: "Needs reply" },
  { value: "active", label: "All active" },
  { value: "resolved", label: "Resolved" },
] as const;

export function SupportInbox({ threads }: { threads: InstructorSupportThread[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("needs_reply");
  const visible = threads.filter((thread) => {
    if (filter === "needs_reply") return thread.status === "open";
    if (filter === "active") return thread.status !== "resolved";
    return thread.status === "resolved";
  });
  const needsReply = threads.filter((thread) => thread.status === "open").length;
  const urgent = threads.filter((thread) => thread.status === "open" && thread.priority === "urgent").length;

  return (
    <div className="border border-navy-900 bg-white">
      <div className="grid gap-px bg-navy-900 md:grid-cols-[1fr_auto_auto]">
        <div className="p-5 text-white sm:p-6">
          <p className="label text-cyan">Support queue</p>
          <h3 className="mt-2 font-display text-2xl">Participant conversations</h3>
          <p className="mt-2 max-w-xl text-sm text-on-navy">Open a request, see the full context, and reply without leaving the cohort workspace.</p>
        </div>
        <QueueStat label="Needs reply" value={needsReply} />
        <QueueStat label="Urgent blockers" value={urgent} accent={urgent > 0} />
      </div>

      <div className="border-b border-line p-4 sm:px-6">
        <div className="flex flex-wrap gap-2" aria-label="Filter support requests">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`min-h-10 border px-3 py-2 text-sm font-semibold ${filter === item.value ? "border-navy-900 bg-navy-900 text-white" : "border-edge bg-white text-ink hover:bg-paper"}`}
            >
              {item.label}
              {item.value === "needs_reply" && needsReply > 0 ? ` (${needsReply})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <p role="status" className="mb-3 text-sm text-muted">{visible.length} {visible.length === 1 ? "conversation" : "conversations"} shown</p>
        {visible.length === 0 ? (
          <p className="border border-dashed border-edge p-6 text-muted">
            {filter === "needs_reply" ? "You are caught up. No participants are waiting for a reply." : "No conversations match this view."}
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((thread, index) => <SupportConversation key={thread.id} thread={thread} open={index === 0 && filter === "needs_reply"} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function QueueStat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex min-w-40 flex-col-reverse justify-center bg-navy-950 p-5 sm:p-6">
      <span className="text-sm text-on-navy">{label}</span>
      <strong className={`font-display text-4xl font-light ${accent ? "text-amber" : "text-white"}`}>{value}</strong>
    </div>
  );
}

function SupportConversation({ thread, open }: { thread: InstructorSupportThread; open: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <details className="group border border-line open:border-navy-900" open={open}>
      <summary className="flex min-h-20 cursor-pointer list-none flex-wrap items-center gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className={`size-2.5 shrink-0 rounded-full ${thread.status === "open" ? "bg-amber-deep" : thread.status === "waiting_on_participant" ? "bg-cyan-deep" : "bg-success"}`} aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy-900">{thread.subject}</span>
          <span className="mt-1 block text-sm text-muted">
            {thread.participant.name}{thread.participant.organization ? ` · ${thread.participant.organization}` : ""} · updated {formatDate(thread.updatedAt)}
          </span>
        </span>
        {thread.priority === "urgent" && thread.status !== "resolved" && <Tag tone="amber">Urgent blocker</Tag>}
        <Tag tone={thread.status === "resolved" ? "success" : thread.status === "waiting_on_participant" ? "cyan" : "amber"}>
          {thread.status === "open" ? "Reply needed" : thread.status === "waiting_on_participant" ? "Waiting on participant" : "Resolved"}
        </Tag>
        <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-line p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">{thread.participant.name}</p>
            <a className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-deep underline underline-offset-4" href={`mailto:${thread.participant.email}`}>
              <Mail className="size-4" aria-hidden="true" />{thread.participant.email}
            </a>
          </div>
          <p className="text-sm text-muted">Opened {formatDate(thread.createdAt)} · {thread.messages.length} messages</p>
        </div>

        <ol className="space-y-3" aria-label={`Conversation with ${thread.participant.name}`}>
          {thread.messages.map((message) => (
            <li key={message.id} className={`max-w-3xl border-l-4 p-4 ${message.authorRole === "admin" ? "ml-auto border-cyan-deep bg-cyan/10" : "border-amber-deep bg-paper"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="label text-muted">{message.authorRole === "admin" ? "Instructor team" : thread.participant.name}</p>
                <time className="text-xs text-muted" dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{message.body}</p>
            </li>
          ))}
        </ol>

        {thread.status !== "resolved" ? (
          <>
            <InstructorReplyForm requestId={thread.id} participantName={thread.participant.name} />
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => setSupportStatusAction(thread.id, "resolved"))}
              className="mt-3 inline-flex min-h-11 items-center gap-2 px-1 text-sm font-semibold text-success underline-offset-4 hover:underline disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {pending ? "Updating…" : "Mark conversation resolved"}
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => setSupportStatusAction(thread.id, "open"))}
            className="mt-5 inline-flex min-h-11 items-center gap-2 border border-edge px-4 text-sm font-semibold hover:bg-paper disabled:opacity-60"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {pending ? "Reopening…" : "Reopen conversation"}
          </button>
        )}
      </div>
    </details>
  );
}

function InstructorReplyForm({ requestId, participantName }: { requestId: string; participantName: string }) {
  const [state, action] = useActionState(replyAsInstructorAction, {} as FormState);
  return (
    <form action={action} noValidate className="mt-6 border-t border-line pt-5">
      <input type="hidden" name="requestId" value={requestId} />
      <TextAreaField
        id={`instructor-support-reply-${requestId}`}
        name="body"
        label={`Reply to ${participantName}`}
        hint="Give one clear next step or ask one focused follow-up question."
        placeholder="Try this next…"
        maxLength={4000}
        errors={state.errors?.body}
        required
      />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <SubmitButton variant="secondary" pendingLabel="Sending reply…">
          <MessageSquareReply className="size-4" aria-hidden="true" />Send reply
        </SubmitButton>
        <FormMessage ok={state.ok} message={state.message} />
      </div>
    </form>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
