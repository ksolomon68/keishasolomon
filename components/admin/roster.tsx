"use client";

import { Fragment, useOptimistic, useState, useTransition } from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";
import {
  setAttendanceAction,
  setDeliverableStatusAction,
} from "@/app/actions/admin";
import { Tag } from "@/components/ui/tag";
import {
  deliverableSessions,
  deliverableStatuses,
  sessions,
  type DeliverableStatus,
} from "@/data/cohortData";

export interface RosterDeliverable {
  sessionId: string;
  status: DeliverableStatus;
  linkUrl: string | null;
  fileId: string | null;
  notes: string;
}

export interface RosterEntry {
  id: string;
  name: string;
  email: string;
  organization: string;
  attended: string[];
  deliverables: RosterDeliverable[];
  capstoneDone: number;
  capstoneTotal: number;
}

type Change =
  | { type: "attendance"; userId: string; sessionId: string; present: boolean }
  | {
      type: "status";
      userId: string;
      sessionId: string;
      status: DeliverableStatus;
    };

const tone = {
  not_started: "neutral",
  in_progress: "cyan",
  submitted: "amber",
  reviewed: "success",
} as const;

export function Roster({ entries }: { entries: RosterEntry[] }) {
  const [, startTransition] = useTransition();
  const [rows, apply] = useOptimistic(entries, (current, change: Change) =>
    current.map((row) => {
      if (row.id !== change.userId) return row;
      if (change.type === "attendance") {
        const rest = row.attended.filter((s) => s !== change.sessionId);
        return {
          ...row,
          attended: change.present ? [...rest, change.sessionId] : rest,
        };
      }
      const existing = row.deliverables.find(
        (d) => d.sessionId === change.sessionId,
      );
      const deliverables = existing
        ? row.deliverables.map((d) =>
            d === existing ? { ...d, status: change.status } : d,
          )
        : [
            ...row.deliverables,
            {
              sessionId: change.sessionId,
              status: change.status,
              linkUrl: null,
              fileId: null,
              notes: "",
            },
          ];
      return { ...row, deliverables };
    }),
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const setAttendance = (userId: string, sessionId: string, present: boolean) =>
    startTransition(async () => {
      apply({ type: "attendance", userId, sessionId, present });
      await setAttendanceAction(userId, sessionId, present);
    });

  const setStatus = (
    userId: string,
    sessionId: string,
    status: DeliverableStatus,
  ) =>
    startTransition(async () => {
      apply({ type: "status", userId, sessionId, status });
      await setDeliverableStatusAction(userId, sessionId, status);
    });

  if (rows.length === 0) {
    return (
      <p className="border border-dashed border-edge p-8 text-muted">
        No participants have registered yet. Share the cohort access code from
        your environment settings.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">
          Cohort roster with attendance, deliverable and capstone progress
        </caption>
        <thead>
          <tr className="border-b-2 border-navy-900 bg-paper text-sm">
            <th scope="col" className="px-4 py-3 font-semibold">
              Participant
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Attendance
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Deliverables
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Capstone
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Manage</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const open = openId === row.id;
            const submitted = row.deliverables.filter(
              (d) => d.status === "submitted" || d.status === "reviewed",
            ).length;
            const percent = row.capstoneTotal
              ? Math.round((row.capstoneDone / row.capstoneTotal) * 100)
              : 0;
            return (
              <Fragment key={row.id}>
                <tr className="border-b border-line align-middle">
                  <th scope="row" className="px-4 py-4 text-left font-normal">
                    <span className="block font-semibold text-ink">
                      {row.name}
                    </span>
                    <span className="block text-sm text-muted">
                      {row.organization || row.email}
                    </span>
                  </th>
                  <td className="px-4 py-4 tabular-nums">
                    <span className="font-display text-2xl text-navy-900">
                      {row.attended.length}
                    </span>
                    <span className="text-muted"> / {sessions.length}</span>
                  </td>
                  <td className="px-4 py-4 tabular-nums">
                    <span className="font-display text-2xl text-navy-900">
                      {submitted}
                    </span>
                    <span className="text-muted">
                      {" "}
                      / {deliverableSessions.length}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <progress
                        className="h-2 w-24 overflow-hidden [&::-moz-progress-bar]:bg-navy-900 [&::-webkit-progress-bar]:bg-line [&::-webkit-progress-value]:bg-navy-900"
                        value={row.capstoneDone}
                        max={row.capstoneTotal}
                        aria-label={`${row.name} capstone progress`}
                      />
                      <span className="label text-ink">{percent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`manage-${row.id}`}
                      onClick={() => setOpenId(open ? null : row.id)}
                      className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-navy-900 underline underline-offset-4"
                    >
                      Manage
                      <span className="sr-only"> {row.name}</span>
                      <ChevronDown
                        className={`size-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                </tr>
                {open && (
                  <tr
                    id={`manage-${row.id}`}
                    className="border-b border-navy-900 bg-paper"
                  >
                    <td colSpan={5} className="p-4 sm:p-6">
                      {/* Sticky + viewport-bound so the panel stays in view instead of inheriting the table's min width on phones. */}
                      <div className="sticky left-0 w-[min(calc(100vw-4.5rem),100%)]">
                        <p className="mb-5 text-sm text-muted">
                          {row.email}
                          {row.organization && ` · ${row.organization}`}
                        </p>
                        <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr]">
                          <fieldset>
                            <legend className="label mb-3 text-ink">
                              Attendance
                            </legend>
                            <ul className="grid grid-cols-2 gap-2">
                              {sessions.map((s) => (
                                <li key={s.id}>
                                  <label className="flex min-h-11 cursor-pointer items-center gap-2.5 border border-line bg-white px-3 text-sm">
                                    <input
                                      type="checkbox"
                                      className="size-4 accent-navy-900"
                                      checked={row.attended.includes(s.id)}
                                      onChange={(e) =>
                                        setAttendance(
                                          row.id,
                                          s.id,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                    <span>
                                      S{s.number}{" "}
                                      <span className="text-muted">
                                        · {s.shortDate}
                                      </span>
                                    </span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </fieldset>

                          <div>
                            <p className="label mb-3 text-ink">Deliverables</p>
                            <ul className="space-y-2">
                              {deliverableSessions.map((s) => {
                                const d = row.deliverables.find(
                                  (x) => x.sessionId === s.id,
                                );
                                const status = d?.status ?? "not_started";
                                return (
                                  <li
                                    key={s.id}
                                    className="grid gap-3 border border-line bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-ink">
                                        S{s.number}: {s.deliverable.title}
                                      </p>
                                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                        <Tag tone={tone[status]}>
                                          {
                                            deliverableStatuses.find(
                                              (x) => x.value === status,
                                            )?.label
                                          }
                                        </Tag>
                                        {d?.linkUrl && (
                                          <a
                                            href={d.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 font-medium text-navy-900 underline underline-offset-4"
                                          >
                                            <ExternalLink
                                              className="size-3.5"
                                              aria-hidden="true"
                                            />{" "}
                                            Link
                                            <span className="sr-only">
                                              {" "}
                                              for session {s.number} (opens in a
                                              new tab)
                                            </span>
                                          </a>
                                        )}
                                        {d?.fileId && (
                                          <a
                                            href={`/api/files/${d.fileId}`}
                                            className="inline-flex items-center gap-1 font-medium text-navy-900 underline underline-offset-4"
                                          >
                                            <Download
                                              className="size-3.5"
                                              aria-hidden="true"
                                            />{" "}
                                            File
                                            <span className="sr-only">
                                              {" "}
                                              for session {s.number}
                                            </span>
                                          </a>
                                        )}
                                      </div>
                                      {d?.notes && (
                                        <p className="mt-2 text-sm text-muted">
                                          “{d.notes}”
                                        </p>
                                      )}
                                    </div>
                                    <div>
                                      <label
                                        htmlFor={`status-${row.id}-${s.id}`}
                                        className="sr-only"
                                      >
                                        Status for session {s.number}{" "}
                                        deliverable
                                      </label>
                                      <select
                                        id={`status-${row.id}-${s.id}`}
                                        value={status}
                                        onChange={(e) =>
                                          setStatus(
                                            row.id,
                                            s.id,
                                            e.target.value as DeliverableStatus,
                                          )
                                        }
                                        className="min-h-11 w-full border-[1.5px] border-edge bg-white px-2 text-sm"
                                      >
                                        {deliverableStatuses.map((o) => (
                                          <option key={o.value} value={o.value}>
                                            {o.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
