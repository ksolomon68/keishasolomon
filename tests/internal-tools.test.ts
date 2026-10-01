import { test } from "node:test";
import assert from "node:assert/strict";
import { assistantPlan, contentDrafts, scoreLead } from "../lib/internal-tools";

test("lead score respects boundaries and makes unknown data low priority", () => {
  assert.equal(scoreLead({ name: "A", need: "B", followUp: "", fit: 2, urgency: 2, readiness: 2 }).score, 100);
  assert.equal(scoreLead({ name: "A", need: "B", followUp: "", fit: NaN, urgency: -10, readiness: 0 }).priority, "Low");
  assert.equal(scoreLead({ name: "A", need: "B", followUp: "", fit: 20, urgency: 2, readiness: 2 }).score, 100);
});

test("restricted-data recommendation preserves the approval boundary", () => {
  assert.match(assistantPlan("research", "restricted", "free", "team"), /Until approved, test only fictional inputs/);
  assert.match(assistantPlan("research", "restricted", "free", "team"), /offboarding/);
});

test("content templates retain supplied facts and do not invent claims", () => {
  const drafts = contentDrafts("Office hours", "local owners", "Meet Thursday at 3", "Reserve a place");
  assert.equal(drafts.length, 3);
  for (const draft of drafts) {
    assert.match(draft.text, /Meet Thursday at 3/);
    assert.match(draft.text, /Reserve a place/);
  }
});
