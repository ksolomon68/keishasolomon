import type { Session } from "@/data/cohortData";

export type SessionStatus = "upcoming" | "today" | "past" | "tba";

/** Local midnight at the start of the session day, or null when the date is TBA. */
export function sessionStart(session: Pick<Session, "date">): Date | null {
  if (!session.date) return null;
  const [y, m, d] = session.date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sessionStatus(session: Pick<Session, "date">, now: Date): SessionStatus {
  const start = sessionStart(session);
  if (!start) return "tba";
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (start.getTime() === startOfToday.getTime()) return "today";
  return start.getTime() < startOfToday.getTime() ? "past" : "upcoming";
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
}

export function countdownTo(target: Date, now: Date): CountdownParts {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalMinutes = Math.floor(ms / 60_000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

/** The first session that hasn't already passed (a TBA session counts as upcoming). */
export function nextSessionId(all: Pick<Session, "id" | "date">[], now: Date): string | null {
  return all.find((s) => sessionStatus(s, now) !== "past")?.id ?? null;
}

export const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
