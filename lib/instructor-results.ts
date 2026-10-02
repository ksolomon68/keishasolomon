import type { ToolResult, User } from "./store/types";
import { outcomeFromResult } from "./tool-results";

export function instructorResults(cohortId: string, users: User[], results: ToolResult[]) {
  return users.filter((user) => user.role === "participant" && user.cohortId === cohortId).map((user) => ({
    id: user.id, name: user.name, organization: user.organization,
    results: results.filter((result) => result.userId === user.id).sort((a, b) => Number(a.sessionId.slice(1)) - Number(b.sessionId.slice(1))),
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export type InstructorResultEntry = ReturnType<typeof instructorResults>[number];

export function resultCounts(entries: InstructorResultEntry[]) {
  const capstones = entries.flatMap((entry) => entry.results.filter((result) => result.sessionId === "s7" && outcomeFromResult(result.data)));
  return { shared: entries.filter((entry) => entry.results.length > 0).length, measured: capstones.length, followUp: capstones.filter((result) => result.data.decision === "revise" || result.data.decision === "stop").length };
}
