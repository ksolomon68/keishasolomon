import { parseToolDraft } from "./tool-drafts";
import { measureOutcome } from "./outcomes";
import { scoreLead, type LeadInput } from "./internal-tools";

export class IncompleteToolResultError extends Error {
  constructor() { super("Complete your results before sharing. Capstone results need valid timing, quality checks, and a decision reason."); this.name = "IncompleteToolResultError"; }
}

/** An explicit snapshot; never expose a participant's later edits or unfinished lead input. */
export function sharedToolData(sessionId: string, input: unknown): Record<string, unknown> {
  const data = parseToolDraft(sessionId, input);
  if (!data) throw new IncompleteToolResultError();
  const record = data as Record<string, unknown>;
  const present = (key: string) => typeof record[key] === "string" && (record[key] as string).trim().length > 0;
  let complete = false;
  if (sessionId === "s1" || sessionId === "s3") complete = present("result");
  if (sessionId === "s4") complete = Array.isArray(record.leads) && record.leads.length > 0;
  if (sessionId === "s5") complete = Array.isArray(record.drafts) && record.drafts.length === 3 && record.drafts.every((draft) => draft.text.trim());
  if (sessionId === "s7") complete = ["task", "quality", "reason"].every(present) && !!measureOutcome(String(record.baseline ?? ""), String(record.frequency ?? ""), String(record.trials ?? ""));
  if (!complete) throw new IncompleteToolResultError();
  if (sessionId === "s4") return { leads: record.leads };
  return sessionId === "s7" ? { ...record, decision: record.decision ?? "revise" } : { ...record };
}

export function outcomeFromResult(data: Record<string, unknown>) {
  return measureOutcome(String(data.baseline ?? ""), String(data.frequency ?? ""), String(data.trials ?? ""));
}

export function toolResultText(sessionId: string, data: Record<string, unknown>): string {
  if (sessionId === "s1" || sessionId === "s3") return String(data.result ?? "");
  if (sessionId === "s4") return (data.leads as (LeadInput & { done: boolean })[]).map((lead) => `${lead.name}\n${lead.need}\nPriority: ${scoreLead(lead).priority} (${scoreLead(lead).score}/100)\n${scoreLead(lead).reason}\nFollow-up: ${lead.followUp} / ${lead.done ? "completed" : "pending"}`).join("\n\n");
  if (sessionId === "s5") return `Source idea: ${data.idea ?? ""}\nAudience: ${data.audience ?? ""}\nSupported takeaway: ${data.takeaway ?? ""}\nCall to action: ${data.action ?? ""}\n\n${(data.drafts as { channel: string; text: string }[]).map((draft) => `${draft.channel.toUpperCase()} — DRAFT\n${draft.text}`).join("\n\n")}`;
  const outcome = outcomeFromResult(data);
  return `Task: ${data.task}\nBaseline minutes per task: ${data.baseline}\nOccurrences per week: ${data.frequency}\n\nTrials (setup, execution, review, correction):\n${data.trials}\n\nQuality checks and evidence:\n${data.quality}\n\n${outcome ? `Trials: ${outcome.count}\nAverage total minutes: ${outcome.average.toFixed(1)}\nNet minutes saved per task: ${outcome.saved.toFixed(1)}\nEstimated weekly minutes saved: ${outcome.weekly.toFixed(1)}` : "Timing unavailable"}\nDecision: ${data.decision}\nReason and next step: ${data.reason}\nWeekly impact is estimated. Timing includes all four stages; retain zero and negative results.`;
}
