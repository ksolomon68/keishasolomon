"use client";

import { useTransition } from "react";
import { setInquiryStatusAction } from "@/app/actions/inquiry";
import { Tag } from "@/components/ui/tag";
import { inquiryPlanOptions, teamSizeOptions } from "@/data/plans";
import type { InquiryStatus, PlanInquiry } from "@/lib/store";

const statusOptions: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const label = <T extends { value: string; label: string }>(options: readonly T[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

export function InquiryReview({ inquiries }: { inquiries: PlanInquiry[] }) {
  const [isPending, startTransition] = useTransition();
  if (inquiries.length === 0) {
    return (
      <p className="border border-dashed border-edge p-6 text-muted">
        No requests yet. They arrive here from the form on the public Plans page.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-line border border-line bg-white" aria-busy={isPending}>
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{inquiry.organization}</p>
              <Tag tone={inquiry.status === "new" ? "amber" : "neutral"}>{label(statusOptions, inquiry.status)}</Tag>
            </div>
            <p className="mt-1 text-sm text-muted">
              {label(inquiryPlanOptions, inquiry.plan)} · {label(teamSizeOptions, inquiry.teamSize)} ·{" "}
              {new Date(inquiry.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </p>
            <p className="mt-2 text-sm">
              {inquiry.name} ·{" "}
              <a href={`mailto:${inquiry.email}`} className="font-semibold underline underline-offset-4">
                {inquiry.email}
              </a>
            </p>
            {inquiry.message && <p className="mt-3 whitespace-pre-wrap break-words text-[0.9375rem] text-ink">{inquiry.message}</p>}
          </div>
          <label className="text-sm font-semibold">
            Status
            <select
              className="mt-1 block min-h-11 border border-edge bg-white px-3"
              defaultValue={inquiry.status}
              onChange={(event) => {
                const status = event.target.value as InquiryStatus;
                startTransition(() => setInquiryStatusAction(inquiry.id, status));
              }}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </li>
      ))}
    </ul>
  );
}
