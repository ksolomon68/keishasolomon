import { test } from "node:test";
import assert from "node:assert/strict";
import { programCompletion } from "../lib/program-completion";
import { capstoneSteps } from "../data/cohortData";
import { plans, planComparison, planFaqs } from "../data/plans";
import { answerPlatformQuestion } from "../lib/platform-chat";

test("only all distinct required milestones establish full-program completion", () => {
  const ids = capstoneSteps.map((step) => step.id);
  assert.ok(ids.length > 0);
  assert.deepEqual(programCompletion(ids), { done: ids.length, total: ids.length, complete: true });
  assert.equal(programCompletion([]).complete, false);
  assert.equal(programCompletion(ids.slice(1)).complete, false);
  assert.equal(programCompletion(Array(ids.length).fill(ids[0])).complete, false);
  const incomplete = programCompletion([...ids.slice(1), "unknown", "removed-milestone"]);
  assert.equal(incomplete.done, ids.length - 1);
  assert.equal(incomplete.complete, false);
  assert.equal(programCompletion([...ids, ...ids, "unknown"]).done, ids.length);
});

test("both full-program plans promise completion certificates and the same one-session coaching allowance", () => {
  for (const id of ["teams", "programs"]) {
    const plan = plans.find((item) => item.id === id)!;
    assert.ok(plan.features.some((feature) => /Certificate of Completion after completing the program/.test(feature)));
    assert.ok(plan.features.some((feature) => /One remote 1:1 coaching session per participant/.test(feature)));
  }
  assert.ok(!plans.find((plan) => plan.id === "starter")!.features.some((feature) => /certificate/i.test(feature)));
  const certificates = planComparison.find((row) => row.feature === "Capstone and certificate")!;
  assert.deepEqual([certificates.starter, certificates.teams, certificates.programs], [false, true, true]);
  const coaching = planComparison.find((row) => row.feature === "Remote 1:1 coaching")!;
  assert.equal(coaching.teams, "1 per participant");
  assert.equal(coaching.programs, "1 per participant");
  assert.ok(planFaqs.some((faq) => faq.a.includes("Teams or Leadership Programs") && faq.a.includes("capstone milestones")));
  assert.match(answerPlatformQuestion("How do I get my certificate?").text, /both Teams and Leadership Programs/);
});
