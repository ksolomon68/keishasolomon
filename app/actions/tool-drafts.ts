"use server";

import { requireUser } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { parseToolDraft } from "@/lib/tool-drafts";

export async function saveToolDraftAction(sessionId: string, data: Record<string, unknown>, version: number) {
  const user = await requireUser("/dashboard");
  const parsed = parseToolDraft(sessionId, data);
  if (!parsed || !Number.isSafeInteger(version) || version < 0) return { ok: false as const, message: "Check your draft. A field is too long or contains an invalid value." };
  try {
    const saved = await (await getStore()).saveToolDraft(user.id, sessionId, parsed, version);
    return { ok: true as const, version: saved.version, updatedAt: saved.updatedAt };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error && error.name === "DraftConflictError" ? error.message : "Your draft could not be saved. Keep this page open and try again, or download a copy." };
  }
}
