"use client";

import { useActionState } from "react";
import { requestCoachingSessionAction } from "@/app/actions/dashboard";
import { FormMessage, TextAreaField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import type { FormState } from "@/lib/validation";

export function CoachingRequestForm() {
  const [state, action] = useActionState(requestCoachingSessionAction, {} as FormState);
  if (state.ok) return <FormMessage ok message={state.message} />;
  return <form action={action} noValidate className="mt-6 space-y-4">
    <FormMessage message={state.message} />
    <TextAreaField id="coaching-request-body" name="body" label="What would you like to work on, and when are you available?"
      hint="Suggest a few dates and times, including your time zone. Your instructor will confirm one appointment in this platform."
      defaultValue={state.values?.body} errors={state.errors?.body} minLength={10} maxLength={3000} required />
    <SubmitButton pendingLabel="Requesting…">Request my one coaching session</SubmitButton>
  </form>;
}
