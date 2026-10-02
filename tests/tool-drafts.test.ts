import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Pool } from "mysql2/promise";
import { createFileStore } from "../lib/store/file";
import { createMysqlStore } from "../lib/store/mysql";
import { parseToolDraft } from "../lib/tool-drafts";
import { measureOutcome } from "../lib/outcomes";

test("drafts survive reopening, isolate owners, and reject competing first saves", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "cohort-drafts-"));
  try {
    const store = createFileStore(dir);
    assert.deepEqual(await store.listToolDrafts("a"), []);
    const results = await Promise.allSettled([store.saveToolDraft("a", "s3", { task: "First" }, 0), store.saveToolDraft("a", "s3", { task: "Stale" }, 0)]);
    assert.equal(results[0].status, "fulfilled"); assert.equal(results[1].status, "rejected");
    const reopened = createFileStore(dir);
    assert.equal((await reopened.listToolDrafts("a"))[0].data.task, "First");
    assert.deepEqual(await reopened.listToolDrafts("b"), []);
    await reopened.saveToolDraft("b", "s3", { task: "Other" }, 0);
    await reopened.saveToolDraft("a", "s3", { task: "Revised" }, 1);
    assert.equal((await reopened.listToolDrafts("b"))[0].data.task, "Other");
    await assert.rejects(reopened.saveToolDraft("a", "s3", { task: "Old" }, 1), /newer draft/);
    assert.equal((await reopened.listToolDrafts("a"))[0].version, 2);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("draft validation bounds data, rejects extra keys and unsupported tools", () => {
  for (const id of ["s1", "s3", "s4", "s5", "s7"]) assert.ok(parseToolDraft(id, {}));
  assert.equal(parseToolDraft("s2", {}), null);
  assert.equal(parseToolDraft("s1", { userId: "another-account" }), null);
  assert.equal(parseToolDraft("s3", { result: "a".repeat(12001) }), null);
  assert.equal(parseToolDraft("s4", { leads: [{ name: "A", need: "B", fit: 9, urgency: 0, readiness: 0, followUp: "", id: 1, done: false }] }), null);
  assert.ok(parseToolDraft("s5", { drafts: [{ channel: "Email", text: "Edited content" }] }));
});

test("MySQL locks drafts by owner and rolls back stale writes", async () => {
  const calls: { sql: string; values?: unknown[] }[] = [];
  let current = 0;
  const connection = {
    beginTransaction: async () => { calls.push({ sql: "begin" }); },
    execute: async (sql: string, values: unknown[]) => { calls.push({ sql, values }); return [sql.startsWith("SELECT") ? [{ version: current }] : {}]; },
    commit: async () => { calls.push({ sql: "commit" }); },
    rollback: async () => { calls.push({ sql: "rollback" }); },
    release: () => { calls.push({ sql: "release" }); },
  };
  const store = createMysqlStore({ getConnection: async () => connection } as unknown as Pool);
  assert.equal((await store.saveToolDraft("owner", "s7", { task: "Pilot" }, 0)).version, 1);
  const lock = calls.find((call) => call.sql.includes("FOR UPDATE"))!;
  assert.deepEqual(lock.values, ["owner", "s7"]);
  assert.deepEqual(calls.find((call) => call.sql.startsWith("UPDATE"))!.values!.slice(-2), ["owner", "s7"]);
  current = 2; calls.length = 0;
  await assert.rejects(store.saveToolDraft("owner", "s7", {}, 1), /newer draft/);
  assert.ok(calls.some((call) => call.sql === "rollback"));
  assert.ok(!calls.some((call) => call.sql.startsWith("UPDATE") || call.sql === "commit"));
  assert.equal(calls.at(-1)!.sql, "release");
});

test("outcomes include all effort and retain losses without accepting incomplete trials", () => {
  assert.deepEqual(measureOutcome("20", "5", "5, 10, 4, 1\n0, 12, 5, 3"), { count: 2, average: 20, saved: 0, weekly: 0 });
  assert.equal(measureOutcome("10", "5", "5,10,4,1")!.weekly, -50);
  for (const trials of ["", "1,2,3", "1,2,3,", "-1,2,3,4", "x,2,3,4"]) assert.equal(measureOutcome("20", "5", trials), null);
  assert.equal(measureOutcome("", "5", "0,1,0,0"), null);
});

test("deployment creates only the additive draft table before activating a release", async () => {
  const sql = await readFile("db/tool-drafts.sql", "utf8");
  const script = await readFile("scripts/cpanel-deploy.sh", "utf8");
  assert.match(sql, /CREATE TABLE IF NOT EXISTS tool_drafts/);
  assert.match(sql, /PRIMARY KEY \(user_id, session_id\)/);
  assert.match(sql, /ON DELETE CASCADE/);
  assert.doesNotMatch(sql, /\b(DROP|ALTER)\b|DELETE FROM/);
  const migration = script.indexOf("UV_THREADPOOL_SIZE=1 node --v8-pool-size=1 --max-old-space-size=256 --env-file=.env.local scripts/migrate-tool-drafts.cjs");
  assert.ok(migration >= 0 && migration < script.indexOf('mv -Tf "$NEXT_LINK"'));
});
