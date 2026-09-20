"use client";

import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import { FormMessage, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import type { FormState } from "@/lib/validation";

const initial: FormState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, initial);
  const v = state.values ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormMessage message={state.message} />
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        defaultValue={v.email}
        errors={state.errors?.email}
        required
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        errors={state.errors?.password}
        required
      />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, initial);
  const v = state.values ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage message={state.message} />
      <TextField
        id="name"
        name="name"
        label="Full name"
        autoComplete="name"
        defaultValue={v.name}
        errors={state.errors?.name}
        required
      />
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        defaultValue={v.email}
        errors={state.errors?.email}
        required
      />
      <TextField
        id="organization"
        name="organization"
        label="Organization or business"
        autoComplete="organization"
        defaultValue={v.organization}
        errors={state.errors?.organization}
        optional
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        hint="At least 10 characters."
        autoComplete="new-password"
        errors={state.errors?.password}
        required
      />
      <TextField
        id="accessCode"
        name="accessCode"
        label="Cohort access code"
        hint="Included in your welcome message from Keisha."
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        errors={state.errors?.accessCode}
        required
      />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
