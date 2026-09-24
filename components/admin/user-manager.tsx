"use client";

import { useActionState, useState } from "react";
import { KeyRound, ShieldAlert, UserPlus, Users } from "lucide-react";
import { createUserAction } from "@/app/actions/admin";
import { FormMessage, SelectField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tag } from "@/components/ui/tag";
import type { Cohort, User } from "@/lib/store";

function generateRandomPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*";
  let pwd = "";
  for (let i = 0; i < 14; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export function UserManager({
  admins,
  cohorts,
  currentCohortId,
}: {
  admins: User[];
  cohorts: Cohort[];
  currentCohortId: string;
}) {
  const [role, setRole] = useState<"participant" | "admin">("participant");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [state, action] = useActionState(createUserAction, {});

  const handleGeneratePassword = () => {
    const pwd = generateRandomPassword();
    setPassword(pwd);
    setCopied(false);
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const cohortOptions = cohorts
    .filter((c) => !c.archived)
    .map((c) => ({
      value: c.id,
      label: `${c.name} (${c.accessCode})`,
    }));

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form to manually create a user */}
        <div className="border border-line bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-sm bg-navy-900 text-amber">
              <UserPlus className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl text-navy-900">Add user manually</h3>
              <p className="text-sm text-muted">Create a new participant or administrator account directly.</p>
            </div>
          </div>

          <form action={action} noValidate className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink">Account Role</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-sm border p-3 text-sm font-semibold transition-colors ${
                    role === "participant"
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-edge bg-paper text-ink hover:border-navy-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="participant"
                    checked={role === "participant"}
                    onChange={() => setRole("participant")}
                    className="sr-only"
                  />
                  <Users className="size-4" />
                  Participant
                </label>
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-sm border p-3 text-sm font-semibold transition-colors ${
                    role === "admin"
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-edge bg-paper text-ink hover:border-navy-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                    className="sr-only"
                  />
                  <ShieldAlert className="size-4" />
                  Admin / Instructor
                </label>
              </div>
            </div>

            {role === "participant" ? (
              <SelectField
                id="user-cohort"
                name="cohortId"
                label="Assign to Cohort"
                options={cohortOptions}
                defaultValue={state.values?.cohortId ?? currentCohortId}
                errors={state.errors?.cohortId}
                hint="The participant will immediately show in this cohort's roster and calendar."
              />
            ) : (
              <div className="rounded-sm border border-cyan/40 bg-cyan/10 p-3 text-sm text-cyan-deep">
                Admins have full access across all cohorts, curriculum, reviews, and settings.
              </div>
            )}

            <TextField
              id="user-name"
              name="name"
              label="Full Name"
              placeholder="e.g. Jane Doe"
              required
              defaultValue={state.values?.name ?? ""}
              errors={state.errors?.name}
            />

            <TextField
              id="user-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="jane@example.com"
              required
              defaultValue={state.values?.email ?? ""}
              errors={state.errors?.email}
            />

            <TextField
              id="user-org"
              name="organization"
              label="Organization / Company"
              placeholder="e.g. Acme Corp"
              optional
              defaultValue={state.values?.organization ?? ""}
              errors={state.errors?.organization}
            />

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="user-password" className="block text-sm font-semibold text-ink">
                  Initial Password
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-deep hover:underline"
                >
                  <KeyRound className="size-3.5" />
                  Generate secure password
                </button>
              </div>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="user-password"
                  name="password"
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 10 characters"
                  className="block min-h-11 w-full rounded-sm border-[1.5px] border-edge bg-white px-3 py-2 text-base text-ink placeholder:text-muted/70 aria-[invalid=true]:border-danger"
                  aria-invalid={state.errors?.password?.length ? true : undefined}
                />
                {password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="min-h-11 shrink-0 rounded-sm border border-navy-900 bg-paper px-3 text-xs font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              {state.errors?.password?.[0] && (
                <p className="mt-1.5 text-sm font-medium text-danger">{state.errors.password[0]}</p>
              )}
              <p className="mt-1 text-xs text-muted">
                Share this initial password with the user so they can sign in at /login.
              </p>
            </div>

            <FormMessage ok={state.ok} message={state.message} />

            <SubmitButton className="w-full">
              {role === "admin" ? "Create Admin Account" : "Add Participant to Cohort"}
            </SubmitButton>
          </form>
        </div>

        {/* Existing Administrators list */}
        <div className="border border-line bg-paper-deep p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-navy-900">Admin & Instructor Team</h3>
              <p className="text-sm text-muted">Users with full administrative rights.</p>
            </div>
            <Tag tone="cyan">{admins.length} {admins.length === 1 ? "Admin" : "Admins"}</Tag>
          </div>

          <div className="mt-6 space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy-900">{admin.name}</p>
                    <p className="text-sm text-muted">{admin.email}</p>
                    {admin.organization && (
                      <p className="mt-1 text-xs font-medium text-ink">{admin.organization}</p>
                    )}
                  </div>
                  <Tag tone="amber">Admin</Tag>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
