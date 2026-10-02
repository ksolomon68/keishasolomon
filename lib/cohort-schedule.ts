import { sessionById, sessions, type Session } from "@/data/cohortData";
import type { Cohort } from "@/lib/store/types";

/** Session id -> ISO date (or null while a date is still to be announced). */
export type SessionDates = Cohort["sessionDates"];

// Dates are calendar days, not instants: format them in UTC so the viewer's zone can never shift the day.
const long = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const isoToUtc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const formatLongDate = (iso: string): string => long.format(isoToUtc(iso));

/** The program's default calendar, used to prefill a new cohort. */
export function defaultSessionDates(): SessionDates {
  return Object.fromEntries(sessions.map((s) => [s.id, s.date]));
}

/** Generate all eight dates without changing the curriculum or any existing cohort. */
export function repeatSessionDates(start: string, cadence: "weekly" | "monthly"): SessionDates | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !["weekly", "monthly"].includes(cadence)) return null;
  const [year, month, day] = start.split("-").map(Number);
  const first = isoToUtc(start);
  if (year < 1900 || year > 2099 || first.toISOString().slice(0, 10) !== start) return null;
  const dates = sessions.map((session, index) => {
    const date = cadence === "weekly" ? new Date(Date.UTC(year, month - 1, day + index * 7)) : (() => {
      const lastDay = new Date(Date.UTC(year, month + index, 0)).getUTCDate();
      return new Date(Date.UTC(year, month - 1 + index, Math.min(day, lastDay)));
    })();
    return [session.id, date.toISOString().slice(0, 10)] as const;
  });
  if (dates.some(([, date]) => Number(date.slice(0, 4)) > 2099)) return null;
  return Object.fromEntries(dates);
}

/**
 * The curriculum with one cohort's dates applied. A session the cohort doesn't mention keeps the
 * program default (including its own "March 2027 (Date TBA)" wording), so old cohorts stay valid if a
 * session is ever added. A date the cohort sets explicitly to null is plainly "to be announced": the
 * program's month hint belongs to the default calendar, not to every cohort.
 */
export function cohortSchedule(dates?: SessionDates | null): Session[] {
  return sessions.map((session) => {
    if (!dates || !Object.hasOwn(dates, session.id)) return session;
    const date = dates[session.id];
    if (date && date === session.date) return session;
    if (!date) return { ...session, date: null, dateLabel: "Date to be announced", shortDate: "TBA" };
    return { ...session, date, dateLabel: formatLongDate(date), shortDate: short.format(isoToUtc(date)) };
  });
}

/** The schedule's sessions that carry a deliverable (1 to 7), narrowed so `.deliverable` is non-null. */
export const withDeliverables = (schedule: Session[]) =>
  schedule.filter((s): s is Session & { deliverable: NonNullable<Session["deliverable"]> } => s.deliverable !== null);

/** Date printed on a certificate: the instructor's explicit choice, else the cohort's last session. */
export function certificateDate(cohort: Pick<Cohort, "completionDate" | "sessionDates"> | null): string {
  const explicit = cohort?.completionDate;
  if (explicit) return formatLongDate(explicit);
  const last = cohortSchedule(cohort?.sessionDates)
    .flatMap((s) => (s.date ? [s.date] : []))
    .sort()
    .at(-1);
  return formatLongDate(last ?? sessionById("s8")?.date ?? "2027-05-11");
}
