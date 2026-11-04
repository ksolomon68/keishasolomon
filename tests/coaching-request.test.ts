import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createFileStore } from "../lib/store/file";
import { coachingRequestId } from "../lib/coaching-request";

test("one durable coaching conversation survives double clicks, resolution, replies and note deletion", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "coaching-request-"));
  try {
    const store = createFileStore(dir);
    const cohort = await store.createCohort({ name: "Test", accessCode: "TEST" });
    const participant = await store.createUser({ name: "Test", email: "one@example.invalid", organization: "", role: "participant", cohortId: cohort.id, passwordHash: "fixture" });
    const requests = await Promise.all(Array.from({ length: 12 }, () => store.requestCoachingSession(participant.id, cohort.id, "Review my workflow. Tuesday 10am UTC.")));
    assert.equal(new Set(requests.map((r) => r.id)).size, 1);
    const id = requests[0].id;
    assert.equal((await store.listSupportRequests(participant.id)).length, 1);
    assert.equal((await store.listSupportMessages(id)).length, 1);
    await store.setSupportRequestStatus(id, "resolved");
    const note = await store.addCoachingNote(participant.id, { topic: "Workflow", note: "Agreed next steps", nextStep: "Practice" });
    await store.deleteCoachingNote(participant.id, note.id);
    const restored = createFileStore(dir);
    assert.equal((await restored.requestCoachingSession(participant.id, cohort.id, "Please book another session")).id, id);
    assert.equal((await restored.getSupportRequest(id))?.status, "resolved");
    assert.equal((await restored.listSupportMessages(id)).length, 1);
    await restored.addSupportMessage(id, participant.id, "participant", "Please change my existing appointment time.", "open");
    assert.equal((await restored.getSupportRequest(id))?.status, "open");
    assert.equal((await restored.listSupportMessages(id)).length, 2);
    assert.equal((await restored.listSupportRequests(participant.id)).length, 1);
    assert.equal((await restored.listSupportRequests())[0].subject, "My one course coaching session");
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("eligibility and quotas are isolated by participant and cohort", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "coaching-eligibility-"));
  try {
    const store = createFileStore(dir);
    const a = await store.createCohort({ name: "A", accessCode: "A" });
    const b = await store.createCohort({ name: "B", accessCode: "B" });
    const makeUser = (email: string, role: "participant" | "admin", cohortId: string | null) => store.createUser({ name: "Test", email, role, cohortId, organization: "", passwordHash: "fixture" });
    const one = await makeUser("one@example.invalid", "participant", a.id);
    const two = await makeUser("two@example.invalid", "participant", a.id);
    const starter = await makeUser("starter@example.invalid", "participant", null);
    const admin = await makeUser("admin@example.invalid", "admin", null);
    const first = await store.requestCoachingSession(one.id, a.id, "One request");
    const second = await store.requestCoachingSession(two.id, a.id, "Another participant");
    assert.notEqual(first.id, second.id);
    for (const id of [starter.id, admin.id, "missing"]) await assert.rejects(store.requestCoachingSession(id, a.id, "Not eligible"), /participant cohort account/);
    await assert.rejects(store.requestCoachingSession(one.id, b.id, "Wrong cohort"), /participant cohort account/);
    await store.updateUser(one.id, { cohortId: b.id });
    const nextCourse = await store.requestCoachingSession(one.id, b.id, "A separate course");
    assert.notEqual(nextCourse.id, first.id);
    await store.updateUser(one.id, { cohortId: a.id });
    assert.equal((await store.requestCoachingSession(one.id, a.id, "Back to first course")).id, first.id);
    assert.equal(first.id, coachingRequestId(one.id, a.id));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
