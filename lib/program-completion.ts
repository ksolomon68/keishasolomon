import { capstoneSteps } from "../data/cohortData";

/** Every cohort uses the same completion rule, regardless of the marketing plan. */
export function programCompletion(completedStepIds: Iterable<string>) {
  const completed = new Set(completedStepIds);
  const total = capstoneSteps.length;
  const done = capstoneSteps.filter((step) => completed.has(step.id)).length;
  return { done, total, complete: total > 0 && done === total };
}
