import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { nextSessionId, sessionStatus } from "../lib/dates";
import { sessions, deliverableSessions } from "../data/cohortData";
import { learningGuides } from "../data/learning-guides";
import { createFileStore } from "../lib/store/file";
import { mergeDeliverable, normalizeDeliverable } from "../lib/store/deliverable-state";

test("pending dates do not hide confirmed sessions or end of schedule", () => {
  assert.equal(nextSessionId(sessions, new Date(2027, 3, 1)), "s7");
  assert.equal(nextSessionId(sessions, new Date(2027, 4, 11)), "s8");
  assert.equal(nextSessionId(sessions, new Date(2027, 5, 1)), null);
  assert.equal(nextSessionId([{ id: "pending", date: null }], new Date()), null);
  assert.equal(nextSessionId([...sessions].reverse(), new Date(2026, 8, 20)), "s1");
  assert.equal(sessionStatus({ date: "2027-05-11" }, new Date(2027, 4, 11, 23)), "today");
});

test("reviews stay with their revision; changed evidence requires review; stale writes fail", () => {
  const initial = normalizeDeliverable({ userId: "p", sessionId: "s1", status: "submitted", linkUrl: "https://example.com/v1", fileId: null, notes: "baseline", updatedAt: new Date().toISOString() });
  const reviewed = mergeDeliverable(initial, { status: "reviewed", feedback: "Clear baseline. Test a second example next.", expectedVersion: 0 });
  assert.equal(reviewed.feedbackRevision, reviewed.revision);
  const unchanged = mergeDeliverable(reviewed, { status: "reviewed", notes: "baseline", expectedVersion: reviewed.version });
  assert.equal(unchanged.status, "reviewed");
  assert.equal(unchanged.revision, reviewed.revision);
  const changed = mergeDeliverable(unchanged, { linkUrl: "https://example.com/v2", expectedVersion: unchanged.version });
  assert.equal(changed.status, "submitted");
  assert.equal(changed.revision, unchanged.revision + 1);
  assert.equal(changed.feedbackRevision, reviewed.revision);
  assert.throws(() => mergeDeliverable(changed, { status: "reviewed", feedback: "Stale review", expectedVersion: reviewed.version }), /another window/);
  assert.throws(() => mergeDeliverable(changed, { status: "reviewed", expectedVersion: changed.version }), /current revision/);
  assert.throws(() => mergeDeliverable(reviewed, { linkUrl: null, expectedVersion: reviewed.version }), /link or file/);
  assert.throws(() => mergeDeliverable(initial, { status: "needs_revision", feedback: "", expectedVersion: 0 }), /feedback/);
  const revise = mergeDeliverable(initial, { status: "needs_revision", feedback: "Add a second test and include review time.", expectedVersion: 0 });
  const resubmit = mergeDeliverable(revise, { status: "submitted", notes: "Added second test", expectedVersion: revise.version });
  assert.equal(resubmit.status, "submitted");
  assert.equal(resubmit.feedbackRevision, revise.revision);
});

test("file store persists feedback, isolates users, rejects concurrent saves, and reads legacy rows", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "cohort-test-"));
  const store = createFileStore(dir);
  const draft = await store.upsertDeliverable("participant-a", "s1", { notes: "draft", expectedVersion: 0 });
  await store.addFriction("participant-a", { task: "Synthetic triage", frequency: "weekly", minutes: 30, sessionId: "s3" });
  assert.equal((await store.listFriction("participant-b")).length, 0);
  assert.equal((await store.listDeliverables("participant-b")).length, 0);
  const saves = await Promise.allSettled([
    store.upsertDeliverable("participant-a", "s1", { status: "submitted", linkUrl: "https://example.com/test", expectedVersion: draft.version }),
    store.upsertDeliverable("participant-a", "s1", { notes: "stale", expectedVersion: draft.version }),
  ]);
  assert.equal(saves.filter((s) => s.status === "fulfilled").length, 1);
  const current = (await store.getDeliverable("participant-a", "s1"))!;
  await store.upsertDeliverable("participant-a", "s1", { status: "reviewed", feedback: "Evidence is clear. Continue to the next lab.", expectedVersion: current.version });
  const reopened = (await createFileStore(dir).getDeliverable("participant-a", "s1"))!;
  assert.equal(reopened.status, "reviewed");
  assert.equal(reopened.feedbackRevision, reopened.revision);
  const db = JSON.parse(await readFile(path.join(dir, "db.json"), "utf8"));
  for (const field of ["version", "revision", "feedback", "feedbackRevision"]) delete db.deliverables[0][field];
  await writeFile(path.join(dir, "db.json"), JSON.stringify(db));
  assert.equal((await store.getDeliverable("participant-a", "s1"))?.version, 0);
  assert.equal((await store.getDeliverable("participant-a", "s1"))?.feedback, "");
});

test("all deliverables have preparation, a starter, a worked example, and review criteria", () => {
  for (const session of deliverableSessions) {
    const guide = learningGuides[session.id];
    assert.ok(guide?.prepare && guide.example && guide.starter && guide.practice);
    assert.equal(guide.steps.length, 3);
    assert.ok(guide.criteria.length >= 3);
  }
});
