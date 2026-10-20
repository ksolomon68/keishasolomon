import assert from "node:assert/strict";
import test from "node:test";
import { assessFit, isComplete, type FitAnswers } from "../lib/ai-fit";

const ideal: FitAnswers = { frequency: "often", kind: "yes", data: "public", risk: "low", verify: "easy", judgment: "little" };

test("a frequent, low-risk, checkable task is a good fit", () => {
  assert.equal(assessFit(ideal).verdict, "good");
  assert.ok(isComplete(ideal));
});

test("sensitive data blocks a go verdict even when everything else is ideal", () => {
  assert.equal(assessFit({ ...ideal, data: "sensitive" }).verdict, "protect");
});

test("high stakes with no way to check says avoid, ahead of the data rule", () => {
  assert.equal(assessFit({ ...ideal, risk: "high", verify: "no", data: "sensitive" }).verdict, "avoid");
});

test("judgment-heavy work stays human", () => {
  assert.equal(assessFit({ ...ideal, judgment: "mostly" }).verdict, "human");
});

test("mixed answers advise care", () => {
  assert.equal(assessFit({ ...ideal, frequency: "rarely", verify: "effort", risk: "medium" }).verdict, "care");
});

test("incomplete answers are reported as incomplete", () => {
  assert.equal(isComplete({ frequency: "often" }), false);
});
