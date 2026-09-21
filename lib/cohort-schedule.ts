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

/** The programme's default calendar, used to prefill a new cohort. */
export function defaultSessionDates(): SessionDates {
  return Object.fromEntries(sessions.map((s) => [s.id, s.date]));
}

/**
 * The curriculum with one cohort's dates applied. A session the cohort doesn't mention keeps the
 * programme default (including its own "March 2027 (Date TBA)" wording), so old cohorts stay valid if a
 * session is ever added. A date the cohort sets explicitly to null is plainly "to be announced": the
 * programme's month hint belongs to the default calendar, not to every cohort.
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
