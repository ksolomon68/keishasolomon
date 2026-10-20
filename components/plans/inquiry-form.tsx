"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createInquiryAction } from "@/app/actions/inquiry";
import { FormMessage, SelectField, TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { inquiryPlanOptions, teamSizeOptions, type InquiryPlan } from "@/data/plans";
import type { FormState } from "@/lib/validation";

export function InquiryForm({ plan }: { plan: InquiryPlan }) {
  const [state, action] = useActionState(createInquiryAction, {} as FormState);
  const v = state.values ?? {};

  if (state.ok) {
    return (
      <div className="border-l-2 border-success bg-white p-6">
        <FormMessage ok message={state.message} />
        <p className="mt-3 text-sm text-muted">
          While you wait,{" "}
          <Link href="/start" className="font-semibold text-navy-900 underline underline-offset-4">
            try the free Starter tools
          </Link>{" "}
          to see how the program teaches.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormMessage message={state.message} />
      </div>
      <SelectField
        id="inquiry-plan"
        name="plan"
        label="I'm interested in"
        options={inquiryPlanOptions}
        defaultValue={v.plan ?? plan}
        errors={state.errors?.plan}
      />
      <SelectField
        id="inquiry-size"
        name="teamSize"
        label="How many people?"
        options={teamSizeOptions}
        defaultValue={v.teamSize ?? "1-10"}
        errors={state.errors?.teamSize}
      />
      <TextField id="inquiry-name" name="name" label="Your name" autoComplete="name" defaultValue={v.name} errors={state.errors?.name} required />
      <TextField
        id="inquiry-email"
        name="email"
        type="email"
        label="Work email"
        autoComplete="email"
        defaultValue={v.email}
        errors={state.errors?.email}
        required
      />
      <div className="sm:col-span-2">
        <TextField
          id="inquiry-organization"
          name="organization"
          label="Organization or program"
          autoComplete="organization"
          defaultValue={v.organization}
          errors={state.errors?.organization}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <TextAreaField
          id="inquiry-message"
          name="message"
          label="What would you like your people to be able to do?"
          hint="For example: use AI safely for writing and research, or build one workflow per department. Timing and format preferences help too."
          defaultValue={v.message}
          errors={state.errors?.message}
          optional
        />
      </div>
      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="inquiry-website">Website</label>
        <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton variant="secondary" pendingLabel="Sending…">
          Send my request
        </SubmitButton>
        <p className="mt-3 text-sm text-muted">No payment is taken on this site. You&rsquo;ll receive a proposal by email.</p>
      </div>
    </form>
  );
}
