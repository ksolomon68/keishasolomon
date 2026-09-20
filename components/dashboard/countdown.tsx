"use client";

import { useSyncExternalStore } from "react";
import type { Session } from "@/data/cohortData";
import { nextSessionId, sessionStart, sessionStatus } from "@/lib/dates";

/** Ticks once a minute. The server snapshot is null so the first paint never disagrees with hydration. */
function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 60_000);
  return () => window.clearInterval(id);
}
const minuteBucket = () => Math.floor(Date.now() / 60_000);

export function useMinuteClock(): Date | null {
  const bucket = useSyncExternalStore(subscribe, minuteBucket, () => null);
  return bucket === null ? null : new Date(bucket * 60_000);
}

/**
 * Status + countdown for one session, in the viewer's local time.
 * Class start time isn't part of the schedule yet, so the count runs to the start of the session day.
 */
export function Countdown({ date, onDark = false }: { date: string | null; onDark?: boolean }) {
  const now = useMinuteClock();
  const session = { date };
  const start = sessionStart(session);

  if (!start) {
    return <p className={`label ${onDark ? "text-amber" : "text-amber-deep"}`}>Date to be announced</p>;
  }
  if (!now) {
    return <div className="h-14" aria-hidden="true" />; // reserve space until the client clock is available
  }

  const status = sessionStatus(session, now);
  if (status === "past") return <p className={`label ${onDark ? "text-on-navy" : "text-muted"}`}>Session has passed</p>;
  if (status === "today") return <p className={`label ${onDark ? "text-amber" : "text-amber-deep"}`}>Session day is here</p>;

  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const target = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const days = Math.round((target - today) / 86_400_000);
  return (
    <p className={`text-sm font-semibold ${onDark ? "text-amber" : "text-amber-deep"}`}>
      {days === 1 ? "Tomorrow" : `In ${days} days`} · session date
    </p>
  );
}

type NextInput = Pick<Session, "id" | "number" | "date" | "dateLabel" | "theme">;

/** "Next up" block for the dashboard summary strip. */
export function NextSessionSummary({ sessions }: { sessions: NextInput[] }) {
  const now = useMinuteClock();
  const next = now ? sessions.find((s) => s.id === nextSessionId(sessions, now)) : undefined;

  if (!now) return <div className="h-20" aria-hidden="true" />;
  if (!next) return <p className="text-sm">No upcoming confirmed dates.{sessions.some((s) => !s.date) ? " A session date is still awaiting confirmation." : " Your work and feedback remain available below."}</p>;

  return (
    <div>
      <p className="font-display text-xl leading-snug">
        Session {next.number}: {next.dateLabel}
      </p>
      <p className="mt-1 text-sm text-muted">{next.theme}</p>
      <div className="mt-3">
        <Countdown date={next.date} />
      </div>
    </div>
  );
}
