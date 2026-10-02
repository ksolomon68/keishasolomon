import { test } from "node:test";
import assert from "node:assert/strict";
import { currentWorkSession } from "../lib/participant-path";
import { cohortSchedule, withDeliverables } from "../lib/cohort-schedule";

test("next action prioritizes feedback, then unfinished drafts", () => {
  const schedule = cohortSchedule();
  assert.equal(currentWorkSession(schedule, [{ sessionId: "s4", status: "in_progress" }, { sessionId: "s2", status: "needs_revision" }])?.id, "s2");
  assert.equal(currentWorkSession(schedule, [{ sessionId: "s4", status: "in_progress" }])?.id, "s4");
});

test("submitted work is not chosen again as the current assignment", () => {
  const schedule = cohortSchedule({ s2: "2027-03-12" });
  const current = currentWorkSession(schedule, [{ sessionId: "s1", status: "submitted" }]);
  assert.equal(current?.id, "s2");
  assert.equal(current?.date, "2027-03-12");
  assert.equal(currentWorkSession(schedule, withDeliverables(schedule).map((session) => ({ sessionId: session.id, status: "reviewed" }))), null);
});
