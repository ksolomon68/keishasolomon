"use client";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { toolLabs } from "@/data/tool-labs";
import { outcomeFromResult, toolResultText } from "@/lib/tool-results";
import { resultCounts, type InstructorResultEntry } from "@/lib/instructor-results";
import type { ToolResult } from "@/lib/store";

const decisionLabels: Record<string, string> = { adopt: "Adopt with review", revise: "Revise and test again", stop: "Stop" };
const fieldStyle = "mt-1 block min-h-11 w-full border border-edge bg-white px-3 py-2 text-sm font-normal";
const number = (value: number) => value.toFixed(1);

function Result({ result, participant }: { result: ToolResult; participant: string }) {
  const outcome = result.sessionId === "s7" ? outcomeFromResult(result.data) : null;
  const text = toolResultText(result.sessionId, result.data);
  return <div className="border-t border-line pt-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="font-semibold">Session {result.sessionId.slice(1)} · {toolLabs[result.sessionId]?.tool ?? "Tool results"}</h4>
      <p className="text-xs text-muted">Shared {new Date(result.updatedAt).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" })} · Central time</p>
    </div>
    {outcome && <div className="mt-3">
      <p className="break-words font-semibold">{String(result.data.task)}</p>
      <p className="mt-1 text-sm">{decisionLabels[String(result.data.decision)] ?? "Decision pending"} · {outcome.count} trial{outcome.count === 1 ? "" : "s"}{outcome.count < 3 ? " · Preliminary: fewer than three trials" : ""}</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[ ["Baseline / task", `${result.data.baseline} min`], ["Average total trial", `${number(outcome.average)} min`], ["Net saved / task", `${number(outcome.saved)} min`], ["Estimated weekly impact", `${number(outcome.weekly)} min saved`] ].map(([label, value]) => <div key={label} className="bg-paper p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 break-words font-semibold">{value}</dd></div>)}
      </dl>
      <p className="mt-2 text-xs text-muted">Participant-reported timings include setup, execution, review, and corrections. Weekly impact assumes {String(result.data.frequency)} occurrences; review their quality evidence before accepting the result.</p>
    </div>}
    <details className="mt-3">
      <summary className="min-h-11 cursor-pointer font-semibold text-cyan-deep">View {participant}&rsquo;s {toolLabs[result.sessionId]?.tool ?? "tool"} results</summary>
      <pre className="whitespace-pre-wrap break-words border border-line bg-paper p-4 font-sans text-sm">{text}</pre>
      <a className={`${buttonStyles({ variant: "outline" })} mt-3`} href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${participant}\nSession ${result.sessionId.slice(1)} · shared saved version ${result.version}\n\n${text}`)}`} download={`session-${result.sessionId.slice(1)}-results.txt`}>Download this result</a>
    </details>
  </div>;
}

export function ResultReview({ entries, cohortName, refreshHref }: { entries: InstructorResultEntry[]; cohortName: string; refreshHref: string }) {
  const [search, setSearch] = useState("");
  const [session, setSession] = useState("all");
  const [sharedOnly, setSharedOnly] = useState(false);
  const counts = resultCounts(entries);
  const filtered = entries.map((entry) => ({ ...entry, results: entry.results.filter((result) => session === "all" || result.sessionId === session) })).filter((entry) => `${entry.name} ${entry.organization}`.toLowerCase().includes(search.trim().toLowerCase()) && (!sharedOnly || entry.results.length > 0));
  const download = `PARTICIPANT RESULTS — ${cohortName}\nPrivate instructor copy. Includes only explicitly shared snapshots matching your filters.\n\n${filtered.map((entry) => `${entry.name} · ${entry.organization}\n${entry.results.length ? entry.results.map((result) => `Session ${result.sessionId.slice(1)} — ${toolLabs[result.sessionId]?.tool}\nShared: ${result.updatedAt}\n${toolResultText(result.sessionId, result.data)}`).join("\n\n") : "No shared results for this selection."}`).join("\n\n--------------------\n\n")}`;
  return <div>
    <dl aria-label="Entire cohort result summary" className="grid gap-3 sm:grid-cols-3">
      {[ ["Participants sharing results", `${counts.shared}/${entries.length}`], ["Measured capstone records", String(counts.measured)], ["Capstones to revise or stop", String(counts.followUp)] ].map(([label, value]) => <div key={label} className="border border-line bg-paper p-4"><dt className="text-sm text-muted">{label}</dt><dd className="mt-1 font-display text-3xl">{value}</dd></div>)}
    </dl>
    <div className="my-5 flex flex-wrap gap-3">
      <a href={refreshHref} className={buttonStyles({ variant: "outline" })}>Refresh results</a>
      <a className={buttonStyles({ variant: "outline" })} href={`data:text/plain;charset=utf-8,${encodeURIComponent(download)}`} download="cohort-participant-results.txt">Download displayed results</a>
    </div>
    <div className="grid items-end gap-4 sm:grid-cols-3">
      <label className="text-sm font-semibold">Find a participant<input type="search" className={fieldStyle} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or organization" /></label>
      <label className="text-sm font-semibold">Result session<select className={fieldStyle} value={session} onChange={(e) => setSession(e.target.value)}><option value="all">All tool sessions</option>{Object.entries(toolLabs).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1))).map(([id, lab]) => <option key={id} value={id}>Session {id.slice(1)} · {lab.tool}</option>)}</select></label>
      <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={sharedOnly} onChange={(e) => setSharedOnly(e.target.checked)} />Only participants with shared results</label>
    </div>
    <p role="status" className="my-4 text-sm text-muted">{filtered.length} participant{filtered.length === 1 ? "" : "s"} shown · summary counts cover the entire cohort</p>
    {!filtered.length ? <p className="border border-dashed border-edge p-6 text-muted">{entries.length ? "No participants match these filters. Change the session, search, or sharing filter." : "No participants have joined this cohort yet."}</p> : <ul className="space-y-4">{filtered.map((entry) => <li key={entry.id} className="border border-line bg-white p-4 sm:p-5">
      <h3 className="font-display text-2xl">{entry.name}</h3>
      {entry.organization && <p className="mt-1 text-sm text-muted">{entry.organization}</p>}
      {!entry.results.length ? <p className="mt-3 text-sm text-muted">No results shared{session === "all" ? " yet" : " for this session"}. Their drafts remain private.</p> : <div className="mt-4 space-y-4">{entry.results.map((result) => <Result key={result.sessionId} result={result} participant={entry.name} />)}</div>}
    </li>)}</ul>}
  </div>;
}
