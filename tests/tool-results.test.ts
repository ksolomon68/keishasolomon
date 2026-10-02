import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import type { Pool } from "mysql2/promise";
import { createFileStore } from "../lib/store/file";
import { createMysqlStore } from "../lib/store/mysql";
import { sharedToolData, toolResultText } from "../lib/tool-results";
import { instructorResults, resultCounts } from "../lib/instructor-results";
import { measureOutcome } from "../lib/outcomes";
import type { User, ToolResult } from "../lib/store/types";

const outcome = { task: "Fictional report", baseline: "10", frequency: "5", trials: "5,10,4,1\n0,10,5,5\n2,12,3,3", quality: "Corrections verified against fictional input.", reason: "Simplify and retest.", decision: "revise" };

test("saving remains private; sharing freezes a snapshot until an explicit update; withdrawal preserves drafts", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "cohort-results-"));
  try {
    const store = createFileStore(dir);
    await store.saveToolDraft("a", "s7", outcome, 0);
    assert.deepEqual(await store.listToolResults(), []);
    await assert.rejects(store.shareToolResult("b", "s7", 1), /newer draft/);
    await store.shareToolResult("a", "s7", 1);
    await store.saveToolDraft("a", "s7", { ...outcome, task: "Private next draft" }, 1);
    const reopened = createFileStore(dir);
    assert.equal((await reopened.listToolResults("a"))[0].data.task, "Fictional report");
    assert.deepEqual(await reopened.listToolResults("b"), []);
    await assert.rejects(reopened.shareToolResult("a", "s7", 1), /newer draft/);
    await reopened.shareToolResult("a", "s7", 2);
    await assert.rejects(reopened.withdrawToolResult("a", "s7", 1), /newer draft/);
    await reopened.withdrawToolResult("b", "s7", 2);
    assert.equal((await reopened.listToolResults("a")).length, 1);
    await reopened.withdrawToolResult("a", "s7", 2);
    assert.deepEqual(await reopened.listToolResults(), []);
    assert.equal((await reopened.listToolDrafts("a"))[0].data.task, "Private next draft");
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("share validation rejects unfinished results and keeps unfinished lead input private", () => {
  for (const session of ["s1", "s3", "s4", "s5", "s7"]) assert.throws(() => sharedToolData(session, {}), /Complete your results/);
  assert.throws(() => sharedToolData("s7", { ...outcome, quality: "" }), /Complete/);
  assert.throws(() => sharedToolData("s7", { ...outcome, trials: "10,5" }), /Complete/);
  assert.equal(measureOutcome("1e308", "1e308", "0,1,0,0"), null);
  const lead = { name: "Fictional", need: "A plan", fit: 1, urgency: 1, readiness: 1, followUp: "2026-10-15" };
  const data = sharedToolData("s4", { draft: { ...lead, name: "Unfinished private input" }, leads: [{ ...lead, id: 1, done: false }] });
  assert.equal(data.draft, undefined);
  assert.doesNotMatch(toolResultText("s4", data), /Unfinished private input/);
  assert.equal(sharedToolData("s7", { ...outcome, decision: undefined }).decision, "revise");
});

test("instructor view scopes results to cohort members and includes participants who have not shared", () => {
  const users = [
    { id: "a", name: "Alex", organization: "A", role: "participant", cohortId: "one" },
    { id: "b", name: "Blair", organization: "B", role: "participant", cohortId: "one" },
    { id: "c", name: "Casey", role: "participant", cohortId: "two" },
    { id: "admin", name: "Instructor", role: "admin", cohortId: "one" },
  ] as User[];
  const results = ["a", "c", "admin"].map((userId) => ({ userId, sessionId: "s7", data: outcome, version: 1, updatedAt: new Date().toISOString() })) as ToolResult[];
  const entries = instructorResults("one", users, results);
  assert.deepEqual(entries.map((entry) => entry.name), ["Alex", "Blair"]);
  assert.equal(entries[1].results.length, 0);
  assert.deepEqual(resultCounts(entries), { shared: 1, measured: 1, followUp: 1 });
  assert.match(toolResultText("s7", outcome), /Net minutes saved per task: -10.0/);
  assert.match(toolResultText("s7", outcome), /Estimated weekly minutes saved: -50.0/);
});

test("MySQL shares only the locked owner draft and rejects stale versions before publishing", async () => {
  const calls: { sql: string; values?: unknown[] }[] = [];
  let version = 1;
  const connection = {
    beginTransaction: async () => {},
    execute: async (sql: string, values: unknown[]) => { calls.push({ sql, values }); return [sql.startsWith("SELECT") ? [{ version, data: JSON.stringify(outcome) }] : {}]; },
    commit: async () => { calls.push({ sql: "commit" }); },
    rollback: async () => { calls.push({ sql: "rollback" }); }, release: () => {},
  };
  const store = createMysqlStore({ getConnection: async () => connection } as unknown as Pool);
  await store.shareToolResult("a", "s7", 1);
  assert.deepEqual(calls[0].values, ["a", "s7"]);
  assert.match(calls[0].sql, /FOR UPDATE/);
  assert.deepEqual(calls[1].values!.slice(0, 2), ["a", "s7"]);
  assert.equal(JSON.parse(String(calls[1].values![2])).task, outcome.task);
  calls.length = 0; version = 2;
  await assert.rejects(store.shareToolResult("a", "s7", 1), /newer draft/);
  assert.ok(calls.some((call) => call.sql === "rollback"));
  assert.ok(!calls.some((call) => call.sql.startsWith("INSERT")));
  calls.length = 0;
  await assert.rejects(store.withdrawToolResult("a", "s7", 1), /newer draft/);
  assert.ok(!calls.some((call) => call.sql.startsWith("DELETE")));
});
