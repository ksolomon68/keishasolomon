"use client";

import { useSyncExternalStore } from "react";
import type { Session } from "@/data/cohortData";
import { countdownTo, nextSessionId, sessionStart, sessionStatus } from "@/lib/dates";

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
  if (status === "past") return <p className={`label ${onDark ? "text-cyan" : "text-success"}`}>Completed</p>;
  if (status === "today") return <p className={`label ${onDark ? "text-amber" : "text-amber-deep"}`}>Session day is here</p>;

  const { days, hours, minutes } = countdownTo(start, now);
  const parts = [
    { value: days, unit: "days" },
    { value: hours, unit: "hrs" },
    { value: minutes, unit: "min" },
  ];
  return (
    <div role="timer" aria-label={`${days} days, ${hours} hours, ${minutes} minutes until session day`} className="flex gap-2">
      {parts.map((p) => (
        <div key={p.unit} aria-hidden="true" className={`min-w-14 border px-2 py-1.5 text-center text-white ${onDark ? "border-white/30 bg-navy-950" : "border-navy-900 bg-navy-900"}`}>
          <p className="font-display text-2xl leading-none text-amber tabular-nums">{p.value}</p>
          <p className="label mt-1 !text-[0.625rem] text-on-navy">{p.unit}</p>
        </div>
      ))}
    </div>
  );
}

type NextInput = Pick<Session, "id" | "number" | "date" | "dateLabel" | "theme">;

/** "Next up" block for the dashboard summary strip. */
export function NextSessionSummary({ sessions }: { sessions: NextInput[] }) {
  const now = useMinuteClock();
  const next = now ? sessions.find((s) => s.id === nextSessionId(sessions, now)) : undefined;

  if (!now) return <div className="h-20" aria-hidden="true" />;
  if (!next) return <p className="font-display text-2xl">Cohort complete. Congratulations!</p>;

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
