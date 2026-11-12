import type { PromptBrief } from "../data/cohort-practice";

export const promptRecipes = {
  plan: { label: "Make a plan", role: "Practical planning partner", task: "Create a small, achievable plan", output: "A numbered plan with action, owner, estimated effort, and a way to check success." },
  summarize: { label: "Summarize notes", role: "Careful research assistant", task: "Summarize the supplied notes for a decision", output: "Key points, supporting evidence, unanswered questions, and suggested next steps." },
  write: { label: "Draft a message", role: "Clear communications editor", task: "Draft a useful message for my audience", output: "A subject line, a concise draft, a clear call to action, and facts to verify." },
  challenge: { label: "Stress-test an idea", role: "Constructive critical thinking partner", task: "Test my idea before I invest more effort", output: "Assumptions, failure scenarios, missing evidence, and one low-cost experiment." },
} as const;

export function recipeBrief(recipe: keyof typeof promptRecipes, task: string, audience: string, input: string): PromptBrief {
  const chosen = promptRecipes[recipe];
  return { role: chosen.role, task: task.trim(), context: `Audience: ${audience.trim()}\n\n${input.trim()}`,
    constraints: "Use only supplied facts. Mark missing information clearly. Do not invent results, dates, or sources. Produce a draft for human review; do not send messages or take actions in other tools.",
    output: chosen.output, challenge: true };
}

/** Treat browser data as untrusted and award each real module only once. */
export function readLearningProgress(raw: string | null, sessionIds: string[]): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? sessionIds.filter(id => parsed.includes(id)) : [];
  } catch { return []; }
}

export function learningRewards(completed: number, total: number) {
  const done = Math.max(0, Math.min(total, completed));
  return { xp: done * 100, level: done === total && total > 0 ? "Trailblazer" : done >= 3 ? "Builder" : "Explorer",
    badges: [
      { name: "First spark", description: "Complete your first module", earned: done >= 1 },
      { name: "Building momentum", description: "Complete three modules", earned: done >= 3 },
      { name: "Trailblazer", description: "Complete every module", earned: total > 0 && done === total },
    ] };
}
