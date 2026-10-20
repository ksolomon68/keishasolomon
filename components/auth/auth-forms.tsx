"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  joinCohortAction,
  loginAction,
  registerAction,
  registerStarterAction,
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/app/actions/auth";
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
      <p className="-mt-2 text-sm">
        <Link href="/forgot-password" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-amber-deep">
          Forgot your password?
        </Link>
      </p>
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}

/** `starter` creates a free account with no access code; `cohort` joins the cohort the code belongs to. */
export function RegisterForm({ mode = "cohort" }: { mode?: "cohort" | "starter" }) {
  const [state, action] = useActionState(mode === "starter" ? registerStarterAction : registerAction, initial);
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
      {mode === "cohort" && (
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
      )}
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Creating account…">
        {mode === "starter" ? "Create my free account" : "Create account"}
      </SubmitButton>
    </form>
  );
}

/** Lets a Starter member enter an access code from their dashboard instead of creating a second account. */
export function JoinCohortForm() {
  const [state, action] = useActionState(joinCohortAction, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage message={state.message} />
      <TextField
        id="join-access-code"
        name="accessCode"
        label="Cohort access code"
        hint="From your organization or program's welcome message."
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        errors={state.errors?.accessCode}
        required
      />
      <SubmitButton variant="secondary" pendingLabel="Joining…">
        Join my cohort
      </SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordResetAction, initial);
  if (state.ok) {
    return (
      <div className="space-y-4">
        <FormMessage ok message={state.message} />
        <p className="text-sm text-muted">You can close this page. The link in the email opens a page where you choose a new password.</p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage message={state.message} />
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        hint="The email you registered with."
        autoComplete="email"
        defaultValue={state.values?.email}
        errors={state.errors?.email}
        required
      />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Sending…">
        Email me a reset link
      </SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, initial);
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage message={state.message} />
      {state.message?.includes("Request a new one") && (
        <p className="-mt-3 text-sm">
          <Link href="/forgot-password" className="font-semibold text-navy-900 underline underline-offset-4">
            Request a new reset link
          </Link>
        </p>
      )}
      <TextField
        id="password"
        name="password"
        type="password"
        label="New password"
        hint="At least 10 characters."
        autoComplete="new-password"
        errors={state.errors?.password}
        required
      />
      <TextField
        id="confirm"
        name="confirm"
        type="password"
        label="Confirm new password"
        autoComplete="new-password"
        errors={state.errors?.confirm}
        required
      />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Saving…">
        Save new password and sign in
      </SubmitButton>
    </form>
  );
}
