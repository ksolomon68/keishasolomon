"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sessionById } from "@/data/cohortData";
import { defaultSessionDates } from "@/lib/cohort-schedule";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";
import { sendWelcomeEmail } from "@/lib/email";
import { getStore, isAccessCodeTaken, isEmailTaken } from "@/lib/store";
import { DeliverableError } from "@/lib/store/deliverable-state";
import { removeFile, saveUpload, UploadError } from "@/lib/uploads";
import {
  cohortSchema,
  createUserSchema,
  fieldErrors,
  newCohortSchema,
  resourceSchema,
  sessionDatesFrom,
  sessionIdSchema,
  textValues,
  type FormState,
} from "@/lib/validation";

const idSchema = z.uuid();

/** Unambiguous characters only (no 0/O, 1/I/L), grouped so it reads well in an email: SANDBOX-K7QX-M3TP. */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateAccessCode(): string {
  const chars = Array.from(randomBytes(8), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `SANDBOX-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

const CODE_TAKEN: FormState["errors"] = { accessCode: ["Another cohort already uses that access code."] };

/** The target must be a real participant; admins have no cohort progress to edit. */
async function participantId(userId: string): Promise<string> {
  const user = await (await getStore()).findUserById(idSchema.parse(userId));
  if (!user || user.role !== "participant") throw new Error("Unknown participant.");
  return user.id;
}

/* ---------- Cohorts ---------- */

export async function createCohortAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin("/admin");
  const values = textValues(formData);
  const parsed = newCohortSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  let id: string;
  try {
    const cohort = await (await getStore()).createCohort({
      name: parsed.data.name,
      accessCode: parsed.data.accessCode || generateAccessCode(),
      sessionDates: defaultSessionDates(),
    });
    id = cohort.id;
  } catch (error) {
    if (isAccessCodeTaken(error)) return { errors: CODE_TAKEN, values };
    throw error;
  }
  revalidatePath("/admin");
  // Land on the new cohort so its dates and code can be set straight away.
  redirect(`/admin?cohort=${id}`);
}

export async function updateCohortAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin("/admin");
  const values = textValues(formData);
  const id = idSchema.safeParse(values.cohortId);
  const parsed = cohortSchema.safeParse(values);
  if (!id.success) return { message: "Unknown cohort.", values };
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const store = await getStore();
  const current = await store.getCohort(id.data);
  if (!current) return { message: "Unknown cohort.", values };
  try {
    await store.updateCohort(id.data, {
      name: parsed.data.name,
      // Blank keeps the current code; use "New code" to rotate it.
      accessCode: parsed.data.accessCode || current.accessCode,
      completionDate: parsed.data.completionDate,
      sessionDates: sessionDatesFrom(parsed.data),
    });
  } catch (error) {
    if (isAccessCodeTaken(error)) return { errors: CODE_TAKEN, values };
    throw error;
  }
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/certificate");
  return { ok: true, message: `Saved ${parsed.data.name}.`, values };
}

export async function regenerateAccessCodeAction(cohortId: string): Promise<void> {
  await requireAdmin("/admin");
  await (await getStore()).updateCohort(idSchema.parse(cohortId), { accessCode: generateAccessCode() });
  revalidatePath("/admin");
}

export async function setCohortArchivedAction(cohortId: string, archived: boolean): Promise<void> {
  await requireAdmin("/admin");
  await (await getStore()).updateCohort(idSchema.parse(cohortId), { archived });
  revalidatePath("/admin");
}

export async function setAttendanceAction(userId: string, sessionId: string, present: boolean): Promise<void> {
  await requireAdmin("/admin");
  await (await getStore()).setAttendance(await participantId(userId), sessionIdSchema.parse(sessionId), present);
  revalidatePath("/admin");
}

export async function reviewDeliverableAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin("/admin");
  const values = textValues(formData);
  const parsed = z.object({
    userId: idSchema,
    sessionId: sessionIdSchema,
    status: z.enum(["reviewed", "needs_revision"]),
    feedback: z.string().trim().min(10, "Describe a strength and the next step (at least 10 characters).").max(4000),
    version: z.coerce.number().int().nonnegative(),
  }).safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { userId, sessionId, status, feedback, version } = parsed.data;
  if (!sessionById(sessionId)?.deliverable) return { message: "That session has no deliverable.", values };
  const store = await getStore();
  const id = await participantId(userId);
  const current = await store.getDeliverable(id, sessionId);
  if (!current?.linkUrl && !current?.fileId) return { message: "Wait for a link or file before reviewing this work.", values };
  try {
    await store.upsertDeliverable(id, sessionId, { status, feedback, expectedVersion: version });
  } catch (error) {
    if (error instanceof DeliverableError) return { message: error.message, values };
    throw error;
  }
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { ok: true, message: "Feedback saved. The participant can see your decision and next step." };
}

export async function uploadResourceAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin("/admin");
  const values = textValues(formData);
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const upload = formData.get("file");
  const hasFile = upload instanceof File && upload.size > 0;
  if (!hasFile && !parsed.data.linkUrl) {
    return { message: "Attach a file or paste a link.", values };
  }
  if (!(await (await getStore()).getCohort(parsed.data.cohortId))) {
    return { message: "Choose a cohort before publishing.", values };
  }

  let fileId: string | null = null;
  if (hasFile) {
    try {
      fileId = (await saveUpload(upload, admin.id)).id;
    } catch (error) {
      if (error instanceof UploadError) return { errors: { file: [error.message] }, values };
      throw error;
    }
  }

  const { cohortId, shared, ...resource } = parsed.data;
  await (await getStore()).createResource({
    ...resource,
    cohortId: shared ? null : cohortId,
    fileId,
    createdBy: admin.id,
  });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { ok: true, message: `Added "${parsed.data.title}".` };
}

export async function deleteResourceAction(id: string): Promise<void> {
  await requireAdmin("/admin");
  const removed = await (await getStore()).deleteResource(idSchema.parse(id));
  await removeFile(removed?.fileId ?? null);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function createUserAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin("/admin");
  const values = textValues(formData);
  const parsed = createUserSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { name, email, organization, role, cohortId, password } = parsed.data;
  const store = await getStore();

  let cohortName: string | undefined;
  if (role === "participant" && cohortId) {
    const cohort = await store.getCohort(cohortId);
    if (!cohort) return { errors: { cohortId: ["Selected cohort does not exist."] }, values };
    cohortName = cohort.name;
  }

  try {
    await store.createUser({
      email,
      name,
      organization,
      role,
      cohortId: role === "admin" ? null : cohortId,
      passwordHash: await hashPassword(password),
    });
  } catch (error) {
    if (isEmailTaken(error)) {
      return { errors: { email: ["An account with this email address already exists."] }, values };
    }
    throw error;
  }

  const emailResult = await sendWelcomeEmail({
    to: email,
    name,
    role,
    cohortName,
    password,
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  const note = emailResult.sent ? " A welcome email with login credentials was sent." : "";
  return {
    ok: true,
    message: `Successfully created ${role === "admin" ? "admin" : "participant"} account for ${name}.${note}`,
  };
}

