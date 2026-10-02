const { test } = require("node:test");
const assert = require("node:assert/strict");
const { migrateToolDrafts } = require("../scripts/migrate-tool-drafts.cjs");
const env = { DB_HOST: "localhost", DB_NAME: "fictional", DB_USER: "fictional", DB_PASSWORD: "test-only" };

test("migration limits connection and metadata waits, creates the table, and closes its connection", async () => {
  const calls = [], logs = [];
  await migrateToolDrafts({ env, readSql: () => "CREATE TABLE IF NOT EXISTS tool_drafts (...)" , log: (line) => logs.push(line), connect: async (config) => {
    assert.equal(config.connectTimeout, 10000);
    return { query: async (query) => calls.push(query), destroy: () => calls.push("destroy") };
  } });
  assert.deepEqual(calls[0], { sql: "SET SESSION lock_wait_timeout = 15", timeout: 20000 });
  assert.deepEqual(calls[1], { sql: "CREATE TABLE IF NOT EXISTS tool_drafts (...)", timeout: 20000 });
  assert.equal(calls.at(-1), "destroy");
  assert.equal(logs.at(-1), "Participant draft table is ready.");
  assert.ok(logs.every((line) => !line.includes("test-only")));
});

test("failed queries close the connection and never report success", async () => {
  let closed = false;
  const logs = [];
  await assert.rejects(migrateToolDrafts({ env, readSql: () => "CREATE TABLE test", log: (line) => logs.push(line), connect: async () => ({
    query: async () => { throw Object.assign(new Error("test timeout"), { code: "PROTOCOL_SEQUENCE_TIMEOUT" }); },
    destroy: () => { closed = true; },
  }) }), /test timeout/);
  assert.ok(closed);
  assert.ok(!logs.includes("Participant draft table is ready."));
});

test("file backend skips MySQL; missing credentials fail before connection", async () => {
  const connect = async () => { throw new Error("Must not connect"); };
  await migrateToolDrafts({ env: { DATA_BACKEND: "file" }, connect, log: () => {} });
  await assert.rejects(migrateToolDrafts({ env: {}, connect }), /settings are missing/);
});
