import { withDeliverables } from "./cohort-schedule";
import type { Session } from "@/data/cohortData";
import type { Deliverable } from "./store/types";

/** The next-step panel and open assignment must point to the same work. */
export function currentWorkSession(schedule: Session[], deliverables: Pick<Deliverable, "sessionId" | "status">[]) {
  const sessions = withDeliverables(schedule);
  const status = (id: string) => deliverables.find((item) => item.sessionId === id)?.status ?? "not_started";
  return sessions.find((session) => status(session.id) === "needs_revision")
    ?? sessions.find((session) => status(session.id) === "in_progress")
    ?? sessions.find((session) => status(session.id) === "not_started")
    ?? null;
}
