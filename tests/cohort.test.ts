import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { nextSessionId, sessionStatus } from "../lib/dates";
import { sessions, deliverableSessions } from "../data/cohortData";
import { learningGuides } from "../data/learning-guides";
import { buildPracticePrompt, exampleBrief, decisionPractice } from "../data/cohort-practice";
import { createFileStore } from "../lib/store/file";
import { mergeDeliverable, normalizeDeliverable } from "../lib/store/deliverable-state";
import { AccessCodeTakenError, DEFAULT_COHORT_ID } from "../lib/store/types";
import { certificateDate, cohortSchedule, defaultSessionDates } from "../lib/cohort-schedule";
import { cohortSchema, newCohortSchema, sessionDatesFrom } from "../lib/validation";

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

test("a cohort's calendar overrides the default dates without touching other cohorts or the curriculum", () => {
  assert.deepEqual(cohortSchedule(undefined), sessions);
  assert.deepEqual(cohortSchedule({}), sessions);
  // A new cohort starts from the default dates; an explicit "TBA" drops the program's "March 2027" hint.
  const seeded = cohortSchedule(defaultSessionDates());
  assert.deepEqual(seeded.map((s) => s.date), sessions.map((s) => s.date));
  assert.deepEqual(seeded.filter((s) => s.date), sessions.filter((s) => s.date), "confirmed dates are untouched");
  assert.equal(seeded[5].dateLabel, "Date to be announced");
  assert.equal(sessions[5].dateLabel, "March 2027 (Date TBA)");

  const shifted = cohortSchedule({ s1: "2027-01-15", s6: "2027-06-04", s8: null });
  assert.equal(shifted[0].date, "2027-01-15");
  assert.equal(shifted[0].dateLabel, "January 15, 2027");
  assert.equal(shifted[0].shortDate, "Jan 15");
  assert.equal(shifted[5].date, "2027-06-04", "a TBA session in the default calendar can be given a date");
  assert.equal(shifted[7].date, null);
  assert.equal(shifted[7].dateLabel, "Date to be announced");
  assert.equal(shifted[1].date, sessions[1].date, "sessions the cohort doesn't mention keep the default");
  assert.equal(shifted[0].theme, sessions[0].theme, "only dates change");
  assert.equal(sessions[0].date, "2026-10-16", "the shared curriculum is never mutated");
  assert.equal(nextSessionId(shifted, new Date(2027, 0, 1)), "s1");
});

test("certificate date: explicit choice, else the cohort's last confirmed session", () => {
  assert.equal(certificateDate({ completionDate: "2027-09-30", sessionDates: {} }), "September 30, 2027");
  assert.equal(certificateDate({ completionDate: null, sessionDates: {} }), "May 11, 2027");
  assert.equal(certificateDate({ completionDate: null, sessionDates: { s8: "2028-02-01" } }), "February 1, 2028");
  assert.equal(certificateDate({ completionDate: null, sessionDates: { s8: null } }), "April 16, 2027", "TBA sessions are skipped");
  assert.equal(certificateDate(null), "May 11, 2027");
});

test("cohort forms accept blank dates, reject impossible ones, and constrain access codes", () => {
  const blankDates = Object.fromEntries(sessions.map((s) => [`date-${s.id}`, ""]));
  const ok = cohortSchema.parse({ name: "  Chamber 2027 ", accessCode: "", completionDate: "", ...blankDates, "date-s1": "2027-01-15" });
  assert.equal(ok.name, "Chamber 2027");
  assert.equal(sessionDatesFrom(ok).s1, "2027-01-15");
  assert.equal(sessionDatesFrom(ok).s2, null);
  assert.ok(!cohortSchema.safeParse({ name: "X", accessCode: "", completionDate: "", ...blankDates }).success, "name needs 2+ characters");
  assert.ok(!cohortSchema.safeParse({ name: "Chamber", accessCode: "", completionDate: "2027-02-31", ...blankDates }).success);
  assert.ok(!newCohortSchema.safeParse({ name: "Chamber", accessCode: "has space" }).success);
  assert.ok(!newCohortSchema.safeParse({ name: "Chamber", accessCode: "short" }).success);
  assert.ok(newCohortSchema.safeParse({ name: "Chamber", accessCode: "" }).success, "blank means generate one");
});

test("file store keeps cohorts separate: roster, resources, and unique case-insensitive access codes", async () => {
  const store = createFileStore(await mkdtemp(path.join(tmpdir(), "cohort-multi-")));
  const a = await store.createCohort({ name: "Cohort A", accessCode: "ALPHA-2026" });
  const b = await store.createCohort({ name: "Cohort B", accessCode: "BRAVO-2026", sessionDates: { s1: "2027-01-15" } });

  assert.equal((await store.findCohortByAccessCode("alpha-2026"))?.id, a.id);
  assert.equal((await store.findCohortByAccessCode("  BRAVO-2026 "))?.id, b.id);
  assert.equal(await store.findCohortByAccessCode("CHARLIE-2026"), null);
  await assert.rejects(store.createCohort({ name: "Dup", accessCode: "alpha-2026" }), AccessCodeTakenError);
  await assert.rejects(store.updateCohort(b.id, { accessCode: "Alpha-2026" }), AccessCodeTakenError);
  assert.equal((await store.updateCohort(b.id, { accessCode: "bravo-2026" }))?.accessCode, "bravo-2026", "keeping your own code is not a clash");
  assert.deepEqual((await store.listCohorts()).map((c) => c.id), [b.id, a.id], "newest first");

  const mk = (email: string, cohortId: string | null, role: "participant" | "admin" = "participant") =>
    store.createUser({ email, name: email, organization: "", role, cohortId, passwordHash: "x" });
  const ann = await mk("ann@example.invalid", a.id);
  const ben = await mk("ben@example.invalid", b.id);
  await mk("teacher@example.invalid", null, "admin");
  assert.deepEqual((await store.listUsers(a.id)).map((u) => u.id), [ann.id]);
  assert.deepEqual((await store.listUsers(b.id)).map((u) => u.id), [ben.id]);
  assert.equal((await store.listUsers()).length, 3);
  assert.equal((await store.findUserById(ann.id))?.cohortId, a.id);

  const res = (cohortId: string | null, title: string) =>
    store.createResource({ cohortId, sessionId: "s1", title, kind: "prompt_sheet", linkUrl: "https://example.com", fileId: null, createdBy: "t" });
  await res(a.id, "Only A");
  await res(b.id, "Only B");
  await res(null, "Everyone");
  const titles = async (id?: string) => (await store.listResources(id)).map((r) => r.title).sort();
  assert.deepEqual(await titles(a.id), ["Everyone", "Only A"]);
  assert.deepEqual(await titles(b.id), ["Everyone", "Only B"]);
  assert.deepEqual(await titles(), ["Everyone", "Only A", "Only B"]);

  const archived = await store.updateCohort(a.id, { archived: true, completionDate: "2027-05-11", name: "Renamed" });
  assert.equal(archived?.archived, true);
  assert.equal(archived?.completionDate, "2027-05-11");
  assert.equal((await store.getCohort(a.id))?.name, "Renamed");
  assert.equal(await store.updateCohort("00000000-0000-4000-8000-0000000000ff", { name: "Nope" }), null);
});

test("a single-cohort database upgrades into a Founding cohort on read, and stays put", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "cohort-legacy-"));
  const legacyUser = (id: string, role: string) => ({ id, email: `${id}@example.invalid`, name: id, organization: "", role, passwordHash: "x", createdAt: "2026-09-01T00:00:00.000Z" });
  await writeFile(path.join(dir, "db.json"), JSON.stringify({
    users: [legacyUser("p1", "participant"), legacyUser("p2", "participant"), legacyUser("admin", "admin")],
    resources: [{ id: "r1", sessionId: "s1", title: "Old sheet", kind: "prompt_sheet", linkUrl: "https://example.com", fileId: null, createdBy: "admin", createdAt: "2026-09-02T00:00:00.000Z" }],
  }));
  const store = createFileStore(dir);

  const cohorts = await store.listCohorts();
  assert.equal(cohorts.length, 1);
  assert.equal(cohorts[0].id, DEFAULT_COHORT_ID);
  assert.deepEqual((await store.listUsers(DEFAULT_COHORT_ID)).map((u) => u.id).sort(), ["p1", "p2"]);
  assert.equal((await store.findUserById("admin"))?.cohortId, null, "instructors stay above every cohort");
  assert.deepEqual((await store.listResources(DEFAULT_COHORT_ID)).map((r) => r.id), ["r1"]);

  // Persisting (any write) must not duplicate the founding cohort or reshuffle anyone.
  const next = await store.createCohort({ name: "Second", accessCode: "SECOND-2026" });
  await store.createUser({ email: "new@example.invalid", name: "New", organization: "", role: "participant", cohortId: next.id, passwordHash: "x" });
  const reopened = createFileStore(dir);
  assert.equal((await reopened.listCohorts()).filter((c) => c.id === DEFAULT_COHORT_ID).length, 1);
  assert.equal((await reopened.listCohorts()).length, 2);
  assert.deepEqual((await reopened.listUsers(DEFAULT_COHORT_ID)).map((u) => u.id).sort(), ["p1", "p2"]);
  assert.deepEqual((await reopened.listUsers(next.id)).length, 1);
  assert.equal((await reopened.listResources(next.id)).length, 0, "the old resource stays with the founding cohort only");

  // An empty legacy database gets no phantom cohort.
  const fresh = createFileStore(await mkdtemp(path.join(tmpdir(), "cohort-fresh-")));
  assert.equal((await fresh.listCohorts()).length, 0);
});

/** A tiny stand-in for a mysql2 connection that tracks which cohort columns exist and records every statement. */
function fakeDb({ hasColumns, participants, resources }: { hasColumns: boolean; participants: number; resources: number }) {
  const state = { users: hasColumns, resources: hasColumns, statements: [] as string[], params: [] as unknown[][] };
  const connection = {
    async query(sql: string, params: unknown[] = []) {
      const text = sql.replace(/\s+/g, " ").trim();
      if (text.startsWith("SELECT 1 FROM information_schema.columns")) {
        const present = params[0] === "users" ? state.users : state.resources;
        return [present ? [{ 1: 1 }] : []];
      }
      state.statements.push(text);
      state.params.push(params);
      if (text.startsWith("ALTER TABLE users")) state.users = true;
      if (text.startsWith("ALTER TABLE resources")) state.resources = true;
      if (text.includes("FROM users WHERE role = 'participant'")) return [[{ n: participants }]];
      if (text.includes("FROM resources")) return [[{ n: resources }]];
      return [[]];
    },
  };
  return { state, connection };
}

test("db:migrate's cohort upgrade moves existing people into a Founding cohort once, and is safe to re-run", async () => {
  const { createRequire } = await import("node:module");
  const { upgradeToCohorts, DEFAULT_COHORT_ID: jsId } = createRequire(import.meta.url)("../scripts/cohort-upgrade.js");
  assert.equal(jsId, DEFAULT_COHORT_ID, "the plain-JS migrate script and the app must agree on the founding cohort id");

  // Legacy database: no cohort columns yet, 3 participants and 2 resources.
  const legacy = fakeDb({ hasColumns: false, participants: 3, resources: 2 });
  const notes: string[] = await upgradeToCohorts(legacy.connection, { COHORT_ACCESS_CODE: "  spring-2026 " });
  const sqlOf = (prefix: string) => legacy.state.statements.filter((s) => s.startsWith(prefix));
  assert.equal(sqlOf("ALTER TABLE users").length, 1);
  assert.equal(sqlOf("ALTER TABLE resources").length, 1);
  assert.match(sqlOf("ALTER TABLE users")[0], /ADD COLUMN cohort_id CHAR\(36\) NULL/);
  assert.match(sqlOf("ALTER TABLE users")[0], /FOREIGN KEY \(cohort_id\) REFERENCES cohorts \(id\)/);
  const insertAt = legacy.state.statements.findIndex((s) => s.startsWith("INSERT IGNORE INTO cohorts"));
  assert.deepEqual(legacy.state.params[insertAt], [DEFAULT_COHORT_ID, "spring-2026"], "keeps the existing code, trimmed");
  assert.deepEqual(legacy.state.params[legacy.state.statements.findIndex((s) => s.startsWith("UPDATE users"))], [DEFAULT_COHORT_ID]);
  assert.ok(legacy.state.statements.find((s) => s.startsWith("UPDATE users"))!.includes("role = 'participant'"), "instructors are not moved");
  assert.ok(insertAt < legacy.state.statements.findIndex((s) => s.startsWith("UPDATE users")), "cohort exists before anyone is pointed at it");
  assert.ok(notes.some((n) => n.includes("3 participant(s)")) && notes.some((n) => n.includes("2 resource(s)")));

  // Running again on the upgraded database changes nothing.
  legacy.state.statements.length = 0;
  assert.deepEqual(await upgradeToCohorts(legacy.connection, {}), []);
  assert.deepEqual(legacy.state.statements, [], "no ALTER, INSERT or UPDATE on a second run");

  // A fresh install already has the columns (from schema.sql): nothing to do.
  const fresh = fakeDb({ hasColumns: true, participants: 0, resources: 0 });
  assert.deepEqual(await upgradeToCohorts(fresh.connection, {}), []);
  assert.deepEqual(fresh.state.statements, []);

  // Legacy but empty (only an instructor): columns are added, no phantom cohort is created.
  const empty = fakeDb({ hasColumns: false, participants: 0, resources: 0 });
  assert.deepEqual(await upgradeToCohorts(empty.connection, {}), []);
  assert.ok(empty.state.statements.every((s) => !s.startsWith("INSERT") && !s.startsWith("UPDATE")));

  // No COHORT_ACCESS_CODE: a fresh code is generated and reported so it isn't lost.
  const noEnv = fakeDb({ hasColumns: false, participants: 1, resources: 0 });
  const generated: string[] = await upgradeToCohorts(noEnv.connection, {});
  const code = noEnv.state.params[noEnv.state.statements.findIndex((s) => s.startsWith("INSERT IGNORE INTO cohorts"))][1] as string;
  assert.match(code, /^cohort-[0-9a-f]{8}$/);
  assert.ok(generated.some((n) => n.includes(code)));
});

test("all deliverables have preparation, a starter, a worked example, and review criteria", () => {
  for (const session of deliverableSessions) {
    const guide = learningGuides[session.id];
    assert.ok(guide?.prepare && guide.example && guide.starter && guide.practice);
    assert.equal(guide.steps.length, 3);
    assert.ok(guide.criteria.length >= 3);
    const practice = decisionPractice[session.id];
    assert.equal(practice.choices.filter((choice) => choice.recommended).length, 1);
    assert.ok(practice.choices.every((choice) => choice.feedback.length > 20));
  }
});

test("prompt builder preserves the brief, adds clarification, and switches challenge mode", () => {
  const prompt = buildPracticePrompt({ ...exampleBrief, task: "  Draft only. Do not publish.  " });
  assert.ok(prompt.includes("TASK\nDraft only. Do not publish."));
  assert.ok(prompt.includes(exampleBrief.constraints));
  assert.ok(prompt.includes("CLARIFY BEFORE PROCEEDING"));
  assert.ok(prompt.includes("CHALLENGE THE PLAN"));
  const simpler = buildPracticePrompt({ ...exampleBrief, challenge: false });
  assert.ok(!simpler.includes("CHALLENGE THE PLAN"));
  assert.ok(simpler.includes("REVIEW\nList what a person should verify"));
});
