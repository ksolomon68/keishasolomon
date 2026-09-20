import type { Deliverable, DeliverablePatch } from "./types";

export class DeliverableError extends Error {}

/** Shared by both stores; invoked under their write lock/transaction. */
export function mergeDeliverable(current: Deliverable, patch: DeliverablePatch): Deliverable {
  if (patch.expectedVersion !== current.version) {
    throw new DeliverableError("This work changed in another window. Copy your notes, then reload to see the latest version before saving again.");
  }
  const next = { ...current };
  if (patch.status !== undefined) next.status = patch.status;
  if (patch.linkUrl !== undefined) next.linkUrl = patch.linkUrl;
  if (patch.fileId !== undefined) next.fileId = patch.fileId;
  if (patch.notes !== undefined) next.notes = patch.notes;
  if (patch.feedback !== undefined) next.feedback = patch.feedback;
  const changed = next.linkUrl !== current.linkUrl || next.fileId !== current.fileId || next.notes !== current.notes;
  next.revision = current.revision + (changed ? 1 : 0);
  if (changed && next.status === "reviewed") next.status = "submitted";
  if ((next.status === "submitted" || next.status === "reviewed") && !next.linkUrl && !next.fileId) {
    throw new DeliverableError("Add a link or file before submitting or reviewing this work.");
  }
  if (patch.feedback !== undefined) {
    if (!patch.feedback.trim()) throw new DeliverableError("Add feedback with a strength and a clear next step.");
    next.feedbackRevision = next.revision;
  }
  if ((next.status === "reviewed" || next.status === "needs_revision") && (next.status !== current.status || patch.feedback !== undefined) &&
      (next.feedbackRevision !== next.revision || !next.feedback.trim())) {
    throw new DeliverableError("Add feedback for the current revision before making a review decision.");
  }
  next.version += 1;
  next.updatedAt = new Date().toISOString();
  return next;
}

/** Defaults also allow existing local-file records to be read without destructive migration. */
export function normalizeDeliverable(row: Omit<Deliverable, "version" | "revision" | "feedback" | "feedbackRevision"> & Partial<Deliverable>): Deliverable {
  return { version: 0, revision: 1, feedback: "", feedbackRevision: null, ...row };
}
