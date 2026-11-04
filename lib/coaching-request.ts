import { createHash } from "node:crypto";

/** A stable primary key makes repeat clicks and concurrent requests the same conversation. */
export function coachingRequestId(userId: string, cohortId: string): string {
  const hex = createHash("sha256").update(JSON.stringify(["course-coaching-v1", userId, cohortId])).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export const COACHING_REQUEST_SUBJECT = "My one course coaching session";
