"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { capstoneSteps, sessionById } from "@/data/cohortData";
import { requireUser } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { DeliverableError } from "@/lib/store/deliverable-state";
import { removeFile, saveUpload, UploadError } from "@/lib/uploads";
import {
  deliverableSchema,
  coachingNoteSchema,
  fieldErrors,
  frictionSchema,
  textValues,
  type FormState,
} from "@/lib/validation";

const idSchema = z.uuid();

/* ---------- Coaching log ---------- */

export async function addCoachingNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/dashboard");
  const values = textValues(formData);
  const parsed = coachingNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  await (await getStore()).addCoachingNote(user.id, parsed.data);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { ok: true, message: "Added to your coaching log." };
}

export async function deleteCoachingNoteAction(id: string): Promise<void> {
  const user = await requireUser("/dashboard");
  await (await getStore()).deleteCoachingNote(user.id, idSchema.parse(id));
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

/* ---------- Workplace Friction log ---------- */

export async function addFrictionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/dashboard");
  const parsed = frictionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: textValues(formData) };

  await (await getStore()).addFriction(user.id, parsed.data);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { ok: true, message: "Added to your friction log." };
}

export async function setFrictionDoneAction(id: string, done: boolean): Promise<void> {
  const user = await requireUser("/dashboard");
  await (await getStore()).setFrictionDone(user.id, idSchema.parse(id), done);
  revalidatePath("/dashboard");
}

export async function deleteFrictionAction(id: string): Promise<void> {
  const user = await requireUser("/dashboard");
  await (await getStore()).deleteFriction(user.id, idSchema.parse(id));
  revalidatePath("/dashboard");
}

/* ---------- Deliverable submission hub ---------- */

export async function saveDeliverableAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/dashboard");
  const values = textValues(formData);
  const parsed = deliverableSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { sessionId, linkUrl, notes } = parsed.data;
  if (!sessionById(sessionId)?.deliverable) {
    return { message: "That session doesn't have a deliverable.", values };
  }
  const store = await getStore();
  const current = await store.getDeliverable(user.id, sessionId);
  // Instructors mark work "reviewed"; participants can only carry an existing review through unchanged.
  if (parsed.data.status === "reviewed" && current?.status !== "reviewed") {
    return { message: "Only your instructor can mark work as reviewed.", values };
  }
  if (parsed.data.status === "needs_revision" && current?.status !== "needs_revision") {
    return { message: "Only your instructor can request revisions.", values };
  }
  const version = z.coerce.number().int().nonnegative().safeParse(formData.get("version"));
  if (!version.success) return { message: "Reload this page before saving.", values };
  const upload = formData.get("file");
  const hasNewFile = upload instanceof File && upload.size > 0;
  const removeExisting = formData.get("removeFile") === "on";

  const keepsFile = hasNewFile || (!!current?.fileId && !removeExisting);
  if ((parsed.data.status === "submitted" || parsed.data.status === "reviewed") && !linkUrl && !keepsFile) {
    return { errors: { linkUrl: ["Add a link or upload a file before marking this submitted."] }, values };
  }

  let newFileId: string | null | undefined;
  if (hasNewFile) {
    try {
      newFileId = (await saveUpload(upload, user.id)).id;
    } catch (error) {
      if (error instanceof UploadError) return { errors: { file: [error.message] }, values };
      throw error;
    }
  } else if (removeExisting) {
    newFileId = null;
  }

  try {
    await store.upsertDeliverable(user.id, sessionId, {
      status: parsed.data.status,
      linkUrl,
      notes,
      expectedVersion: version.data,
      ...(newFileId !== undefined && { fileId: newFileId }),
    });
  } catch (error) {
    if (newFileId) await removeFile(newFileId);
    if (error instanceof DeliverableError) return { message: error.message, values };
    throw error;
  }
  // Only drop the old bytes once the row points at the new file.
  if (newFileId !== undefined) await removeFile(current?.fileId ?? null);

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { ok: true, message: "Saved.", values: { sessionId } };
}

/* ---------- Capstone tracker ---------- */

export async function setCapstoneStepAction(stepId: string, done: boolean): Promise<void> {
  const user = await requireUser("/dashboard");
  if (!capstoneSteps.some((s) => s.id === stepId)) throw new Error("Unknown capstone step.");
  await (await getStore()).setCapstoneStep(user.id, stepId, done);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
