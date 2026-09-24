"use client";

import { useActionState, useState, useTransition } from "react";
import {
  Edit3,
  KeyRound,
  Mail,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { createUserAction, deleteUserAction, updateUserAction } from "@/app/actions/admin";
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
  users,
  cohorts,
  currentCohortId,
  currentAdminId,
}: {
  users: User[];
  cohorts: Cohort[];
  currentCohortId: string;
  currentAdminId: string;
}) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "participant">("all");
  const [cohortFilter, setCohortFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const cohortMap = new Map(cohorts.map((c) => [c.id, c.name]));

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (cohortFilter !== "all" && u.cohortId !== cohortFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchOrg = u.organization?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchOrg) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("list");
              setEditingUser(null);
            }}
            className={`flex min-h-11 items-center gap-2 rounded-sm border px-4 text-sm font-semibold transition-colors ${
              activeTab === "list"
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-edge bg-white text-ink hover:border-navy-900"
            }`}
          >
            <Users className="size-4" />
            All Accounts ({users.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("create");
              setEditingUser(null);
            }}
            className={`flex min-h-11 items-center gap-2 rounded-sm border px-4 text-sm font-semibold transition-colors ${
              activeTab === "create"
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-edge bg-white text-ink hover:border-navy-900"
            }`}
          >
            <UserPlus className="size-4" />
            Add New User
          </button>
        </div>

        {activeTab === "list" && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, org..."
                className="min-h-10 w-full rounded-sm border border-edge bg-white pl-9 pr-3 text-sm placeholder:text-muted/70 focus:border-navy-900"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="min-h-10 rounded-sm border border-edge bg-white px-3 text-sm text-ink"
            >
              <option value="all">All Roles</option>
              <option value="participant">Participants</option>
              <option value="admin">Administrators</option>
            </select>

            {/* Cohort Filter */}
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="min-h-10 rounded-sm border border-edge bg-white px-3 text-sm text-ink"
            >
              <option value="all">All Cohorts</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "create" ? (
        <CreateUserForm
          cohorts={cohorts}
          currentCohortId={currentCohortId}
          onSuccess={() => setActiveTab("list")}
        />
      ) : editingUser ? (
        <EditUserForm
          user={editingUser}
          cohorts={cohorts}
          currentAdminId={currentAdminId}
          onClose={() => setEditingUser(null)}
        />
      ) : (
        <UserListTable
          users={filteredUsers}
          cohortMap={cohortMap}
          currentAdminId={currentAdminId}
          onEdit={(user) => setEditingUser(user)}
        />
      )}
    </div>
  );
}

function UserListTable({
  users,
  cohortMap,
  currentAdminId,
  onEdit,
}: {
  users: User[];
  cohortMap: Map<string, string>;
  currentAdminId: string;
  onEdit: (user: User) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (user: User) => {
    if (!confirm(`Are you sure you want to permanently delete the account for "${user.name}" (${user.email})?`)) {
      return;
    }
    setDeletingId(user.id);
    startTransition(async () => {
      const res = await deleteUserAction(user.id);
      setDeletingId(null);
      setFeedback({ id: user.id, message: res.message || "", ok: !!res.ok });
      setTimeout(() => setFeedback(null), 4000);
    });
  };

  if (users.length === 0) {
    return (
      <div className="border border-dashed border-edge bg-paper p-10 text-center text-muted">
        <Users className="mx-auto size-8 text-muted" />
        <p className="mt-2 font-medium">No accounts match your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-line bg-white shadow-sm">
      {feedback && (
        <div className={`p-4 text-sm font-medium ${feedback.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {feedback.message}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper-deep text-xs font-semibold uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Organization</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Cohort Assignment</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => {
              const isSelf = u.id === currentAdminId;
              const cohortName = u.cohortId ? cohortMap.get(u.cohortId) || "Unknown Cohort" : null;

              return (
                <tr key={u.id} className="hover:bg-paper/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-xs text-amber">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-navy-900">{u.name}</span>
                          {isSelf && (
                            <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-900">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Mail className="size-3" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted">{u.organization || "—"}</td>
                  <td className="px-5 py-4">
                    {u.role === "admin" ? (
                      <Tag tone="amber">Administrator</Tag>
                    ) : (
                      <Tag tone="cyan">Participant</Tag>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {cohortName ? (
                      <span className="font-medium text-ink">{cohortName}</span>
                    ) : u.role === "admin" ? (
                      <span className="text-xs text-muted">All Cohorts (Global)</span>
                    ) : (
                      <span className="text-xs text-danger">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        className="inline-flex items-center gap-1 rounded-sm border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-900 hover:border-navy-900"
                      >
                        <Edit3 className="size-3.5" />
                        Edit
                      </button>
                      {!isSelf && (
                        <button
                          type="button"
                          disabled={isPending && deletingId === u.id}
                          onClick={() => handleDelete(u)}
                          className="inline-flex items-center gap-1 rounded-sm border border-danger/30 bg-white px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger hover:text-white disabled:opacity-50"
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateUserForm({
  cohorts,
  currentCohortId,
  onSuccess,
}: {
  cohorts: Cohort[];
  currentCohortId: string;
  onSuccess: () => void;
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
    <div className="mx-auto max-w-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="grid size-10 place-items-center rounded-sm bg-navy-900 text-amber">
          <UserPlus className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl text-navy-900">Provision New Account</h3>
          <p className="text-sm text-muted">Add a participant or administrator directly to the system.</p>
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
              <Shield className="size-4" />
              Admin / Instructor
            </label>
          </div>
        </div>

        {role === "participant" ? (
          <SelectField
            id="create-cohort"
            name="cohortId"
            label="Assign to Cohort"
            options={cohortOptions}
            defaultValue={state.values?.cohortId ?? currentCohortId}
            errors={state.errors?.cohortId}
            hint="The participant will immediately show in this cohort's roster and syllabus."
          />
        ) : (
          <div className="rounded-sm border border-cyan/40 bg-cyan/10 p-3 text-sm text-cyan-deep">
            Admins have full access across all cohorts, curriculum, grading, and settings.
          </div>
        )}

        <TextField
          id="create-name"
          name="name"
          label="Full Name"
          placeholder="e.g. Jane Doe"
          required
          defaultValue={state.values?.name ?? ""}
          errors={state.errors?.name}
        />

        <TextField
          id="create-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="jane@example.com"
          required
          defaultValue={state.values?.email ?? ""}
          errors={state.errors?.email}
        />

        <TextField
          id="create-org"
          name="organization"
          label="Organization / Company"
          placeholder="e.g. Acme Corp"
          optional
          defaultValue={state.values?.organization ?? ""}
          errors={state.errors?.organization}
        />

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="create-password" className="block text-sm font-semibold text-ink">
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
              id="create-password"
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
            If SMTP is configured (e.g. info@evobrand.net), credentials will be emailed automatically. You can also copy it directly.
          </p>
        </div>

        <FormMessage ok={state.ok} message={state.message} />

        <div className="flex gap-3 pt-2">
          <SubmitButton className="flex-1">
            {role === "admin" ? "Create Admin Account" : "Create Participant Account"}
          </SubmitButton>
          <button
            type="button"
            onClick={onSuccess}
            className="min-h-11 rounded-sm border border-line bg-paper px-5 text-sm font-semibold text-ink hover:border-navy-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function EditUserForm({
  user,
  cohorts,
  currentAdminId,
  onClose,
}: {
  user: User;
  cohorts: Cohort[];
  currentAdminId: string;
  onClose: () => void;
}) {
  const [role, setRole] = useState<"participant" | "admin">(user.role);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [state, action] = useActionState(updateUserAction, {});

  const isSelf = user.id === currentAdminId;

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
    <div className="mx-auto max-w-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-sm bg-navy-900 text-amber">
            <Edit3 className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-2xl text-navy-900">Edit Account: {user.name}</h3>
            <p className="text-sm text-muted">Update details, cohort placement, or reset password.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted hover:bg-paper hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>

      <form action={action} noValidate className="mt-6 space-y-5">
        <input type="hidden" name="userId" value={user.id} />

        <div>
          <label className="block text-sm font-semibold text-ink">Account Role</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-sm border p-3 text-sm font-semibold transition-colors ${
                isSelf ? "cursor-not-allowed opacity-60" : ""
              } ${
                role === "participant"
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-edge bg-paper text-ink hover:border-navy-900"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="participant"
                disabled={isSelf}
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
              <Shield className="size-4" />
              Admin / Instructor
            </label>
          </div>
          {isSelf && (
            <p className="mt-1 text-xs text-muted">You cannot remove your own admin privileges.</p>
          )}
        </div>

        {role === "participant" && (
          <SelectField
            id="edit-cohort"
            name="cohortId"
            label="Cohort Assignment"
            options={cohortOptions}
            defaultValue={state.values?.cohortId ?? user.cohortId ?? cohorts[0]?.id ?? ""}
            errors={state.errors?.cohortId}
            hint="Moving a participant carries their attendance and submissions with them."
          />
        )}

        <TextField
          id="edit-name"
          name="name"
          label="Full Name"
          required
          defaultValue={state.values?.name ?? user.name}
          errors={state.errors?.name}
        />

        <TextField
          id="edit-email"
          name="email"
          type="email"
          label="Email Address"
          required
          defaultValue={state.values?.email ?? user.email}
          errors={state.errors?.email}
        />

        <TextField
          id="edit-org"
          name="organization"
          label="Organization / Company"
          optional
          defaultValue={state.values?.organization ?? user.organization ?? ""}
          errors={state.errors?.organization}
        />

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="edit-password" className="block text-sm font-semibold text-ink">
              Reset Password <span className="font-normal text-muted">(leave blank to keep current)</span>
            </label>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-deep hover:underline"
            >
              <KeyRound className="size-3.5" />
              Generate new password
            </button>
          </div>
          <div className="mt-1.5 flex gap-2">
            <input
              id="edit-password"
              name="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to leave unchanged"
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
        </div>

        <FormMessage ok={state.ok} message={state.message} />

        <div className="flex gap-3 pt-2">
          <SubmitButton className="flex-1">Save Account Changes</SubmitButton>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-sm border border-line bg-paper px-5 text-sm font-semibold text-ink hover:border-navy-900"
          >
            Done / Close
          </button>
        </div>
      </form>
    </div>
  );
}
