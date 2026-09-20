"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deliverableStatuses, sessionById } from "@/data/cohortData";
import { requireAdmin } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
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

export async function setDeliverableStatusAction(
  userId: string,
  sessionId: string,
  status: string,
): Promise<void> {
  await requireAdmin("/admin");
  const parsedStatus = z.enum(deliverableStatuses.map((s) => s.value) as [string, ...string[]]).parse(status);
  const parsedSession = sessionIdSchema.parse(sessionId);
  if (!sessionById(parsedSession)?.deliverable) throw new Error("That session has no deliverable.");
  await (await getStore()).upsertDeliverable(await participantId(userId), parsedSession, {
    status: parsedStatus as (typeof deliverableStatuses)[number]["value"],
  });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
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
