import { z } from "zod";
import {
  deliverableStatuses,
  frictionFrequencies,
  resourceKinds,
  sessions,
} from "@/data/cohortData";

const tuple = <T extends string>(values: readonly T[]) => values as unknown as [T, ...T[]];

export const sessionIdSchema = z.enum(tuple(sessions.map((s) => s.id)));

/** Only http(s) links are ever stored or rendered as hrefs (blocks `javascript:` and `data:` URLs). */
export const httpUrlSchema = z
  .string()
  .trim()
  .max(2048, "That link is too long.")
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a full link starting with https://");

const optionalUrl = z
  .union([z.literal(""), httpUrlSchema])
  .transform((v) => (v === "" ? null : v));

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.").max(190)),
  organization: z.string().trim().max(160).default(""),
  // bcrypt only hashes the first 72 bytes, so cap there rather than silently truncating.
  password: z
    .string()
    .min(10, "Use at least 10 characters.")
    .refine((v) => new TextEncoder().encode(v).length <= 72, "Use 72 bytes or fewer."),
  accessCode: z.string().trim().min(1, "Enter the cohort access code."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password."),
});

export const frictionSchema = z.object({
  task: z.string().trim().min(3, "Describe the task in a few words.").max(500),
  frequency: z.enum(tuple(frictionFrequencies.map((f) => f.value))),
  minutes: z.coerce.number().int("Use whole minutes.").min(1, "Enter at least 1 minute.").max(600),
  sessionId: z
    .union([z.literal(""), sessionIdSchema])
    .transform((v) => (v === "" ? null : v)),
});

export const coachingNoteSchema = z.object({
  topic: z.string().trim().min(2, "Name the focus of the session.").max(160),
  note: z.string().trim().min(3, "Add a short coaching note.").max(3000),
  nextStep: z.string().trim().max(500, "Keep the next step under 500 characters.").default(""),
});

export const deliverableSchema = z.object({
  sessionId: sessionIdSchema,
  status: z.enum(tuple(deliverableStatuses.map((s) => s.value))),
  linkUrl: optionalUrl,
  notes: z.string().trim().max(2000, "Keep notes under 2,000 characters.").default(""),
});

export const resourceSchema = z.object({
  sessionId: sessionIdSchema,
  title: z.string().trim().min(2, "Give the resource a title.").max(160),
  kind: z.enum(tuple(resourceKinds.map((k) => k.value))),
  linkUrl: optionalUrl,
  cohortId: z.uuid(),
  /** Checkbox: publish to every cohort instead of just `cohortId`. */
  shared: z.literal("on").optional(),
});

/** A real calendar day as YYYY-MM-DD (rejects 2026-02-31). */
const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
  .refine((value) => {
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }, "Enter a valid date.");

const optionalDate = z.union([z.literal(""), isoDate]).transform((v) => (v === "" ? null : v));

/** Participants type this from an email, so keep it to characters that survive copy/paste. */
export const accessCodeSchema = z
  .string()
  .trim()
  .min(6, "Use at least 6 characters.")
  .max(64, "Use 64 characters or fewer.")
  .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens and underscores.");

/** Form fields `date-s1` … `date-s8`, one per session; blank means "to be announced". */
const sessionDateFields = Object.fromEntries(sessions.map((s) => [`date-${s.id}`, optionalDate]));

export const cohortSchema = z.object({
  name: z.string().trim().min(2, "Give the cohort a name.").max(120, "Use 120 characters or fewer."),
  /** Blank on create means "generate one for me". */
  accessCode: z.union([z.literal(""), accessCodeSchema]),
  completionDate: optionalDate,
  ...sessionDateFields,
});

/** Creating a cohort only needs a name and (optionally) a code; dates are edited afterwards. */
export const newCohortSchema = cohortSchema.pick({ name: true, accessCode: true });

/** Pull the per-session dates out of a parsed cohort form. */
export function sessionDatesFrom(parsed: Record<string, unknown>): Record<string, string | null> {
  return Object.fromEntries(sessions.map((s) => [s.id, (parsed[`date-${s.id}`] as string | null) ?? null]));
}

export type FieldErrors = Record<string, string[] | undefined>;

/** Flatten a ZodError into `{ field: [messages] }` for form display. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors as FieldErrors;
}

export interface FormState {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
  /** Submitted values, echoed back on error because React resets uncontrolled forms after an action. */
  values?: Record<string, string>;
}

/** Text fields from FormData as plain strings (File entries are skipped). */
export function textValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) if (typeof value === "string") out[key] = value;
  return out;
}
