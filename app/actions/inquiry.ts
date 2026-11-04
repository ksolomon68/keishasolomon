"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { isLocked, recordFailure } from "@/lib/auth/rate-limit";
import { getStore, type InquiryStatus } from "@/lib/store";
import { fieldErrors, inquirySchema, textValues, type FormState } from "@/lib/validation";

/** Public form, so each address gets a small budget of inquiries rather than unlimited writes. */
export async function createInquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = textValues(formData);
  // Bots fill every field; people never see this one.
  if (values.website) return { ok: true, message: "Thank you. Your request has been received." };
  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limitKey = `inquiry|${ip}`;
  if (isLocked(limitKey)) return { message: "Too many requests from this connection. Please try again later.", values };
  recordFailure(limitKey);

  await (await getStore()).createInquiry(parsed.data);
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return {
    ok: true,
    message: "Thank you. Your request has been received, and you'll get a reply by email with next steps and a proposal.",
  };
}

const statusSchema = z.enum(["new", "contacted", "closed"]);

export async function setInquiryStatusAction(id: string, status: InquiryStatus): Promise<void> {
  await requireAdmin("/admin");
  await (await getStore()).setInquiryStatus(z.uuid().parse(id), statusSchema.parse(status));
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}
