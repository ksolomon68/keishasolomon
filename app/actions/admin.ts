"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sessionById } from "@/data/cohortData";
import { requireAdmin } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { DeliverableError } from "@/lib/store/deliverable-state";
import { removeFile, saveUpload, UploadError } from "@/lib/uploads";
import {
  fieldErrors,
  resourceSchema,
  sessionIdSchema,
  textValues,
  type FormState,
} from "@/lib/validation";

const idSchema = z.uuid();

/** The target must be a real participant; admins have no cohort progress to edit. */
async function participantId(userId: string): Promise<string> {
  const user = await (await getStore()).findUserById(idSchema.parse(userId));
  if (!user || user.role !== "participant") throw new Error("Unknown participant.");
  return user.id;
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

  let fileId: string | null = null;
  if (hasFile) {
    try {
      fileId = (await saveUpload(upload, admin.id)).id;
    } catch (error) {
      if (error instanceof UploadError) return { errors: { file: [error.message] }, values };
      throw error;
    }
  }

  await (await getStore()).createResource({ ...parsed.data, fileId, createdBy: admin.id });
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
