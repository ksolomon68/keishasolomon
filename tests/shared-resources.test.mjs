import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { publishSharedResources, readCatalog } from "../scripts/publish-shared-resources.cjs";
const root = fileURLToPath(new URL("../resource-library", import.meta.url));
const env = { DATA_BACKEND: "mysql", DB_HOST: "localhost", DB_NAME: "fictional", DB_USER: "fictional", DB_PASSWORD: "never-print-this" };

function database({ admin = true, failAt = -1 } = {}) {
  const state = { resources: new Map(), files: new Map(), rollbacks: 0, commits: 0, closed: 0, locks: 0 };
  let snapshot;
  const connect = async () => ({
    async beginTransaction() { snapshot = { resources: new Map(state.resources), files: new Map(state.files) }; },
    async commit() { state.commits++; },
    async rollback() { state.resources = snapshot.resources; state.files = snapshot.files; state.rollbacks++; },
    destroy() { state.closed++; },
    async query({ sql, values = [] }) {
      if (sql.includes("GET_LOCK")) { state.locks++; return [[{ acquired: 1 }]]; }
      if (sql.includes("RELEASE_LOCK")) return [[{ released: 1 }]];
      if (sql.startsWith("SELECT id FROM users")) return [admin ? [{ id: "instructor-id" }] : []];
      if (sql.startsWith("SELECT id FROM resources")) return [state.resources.has(values[0]) ? [{ id: values[0] }] : []];
      if (sql.startsWith("SELECT stored_name")) return [state.files.has(values[0]) ? [state.files.get(values[0])] : []];
      if (sql.startsWith("INSERT INTO files")) { state.files.set(values[0], { stored_name: values[3], size: values[5] }); return [{}]; }
      if (sql.startsWith("INSERT INTO resources")) {
        assert.match(sql, /VALUES \(\?, NULL, \?, \?, \?, NULL, \?, \?\)/, "every item is shared, with no external link");
        if (state.resources.size === failAt) throw Object.assign(new Error("synthetic database failure"), { code: "TEST_FAILURE" });
        assert.ok(state.files.has(values[4]), "resource file exists before resource row");
        state.resources.set(values[0], { session: values[1], title: values[2], kind: values[3], fileId: values[4], owner: values[5] });
        return [{}];
      }
      throw new Error("Unexpected query");
    },
  });
  return { state, connect };
}

test("publishes all 27 checked files as shared resources, preserves existing rows, and reruns without duplicates", async () => {
  const storage = await mkdtemp(path.join(os.tmpdir(), "shared-library-"));
  try {
    const db = database();
    const logs = [];
    const opts = { env, root, storage, connect: db.connect, log: (line) => logs.push(line) };
    assert.deepEqual(await publishSharedResources(opts), { added: 27, existing: 0 });
    assert.equal(db.state.files.size, 27);
    assert.equal(db.state.resources.size, 27);
    assert.equal(new Set([...db.state.resources.values()].map((r) => r.session)).size, 8);
    for (const item of await readCatalog(root)) assert.deepEqual(await readFile(path.join(storage, item.storedName)), item.content);
    const first = db.state.resources.values().next().value;
    first.title = "Instructor-edited title";
    assert.deepEqual(await publishSharedResources(opts), { added: 0, existing: 27 });
    assert.equal(first.title, "Instructor-edited title");
    assert.equal(db.state.commits, 2);
    assert.equal(db.state.closed, 2);
    assert.ok(logs.every((line) => !line.includes(env.DB_PASSWORD)));
  } finally { await rm(storage, { recursive: true, force: true }); }
});

test("a failed batch rolls back all resource and file rows; a retry safely reuses verified storage files", async () => {
  const storage = await mkdtemp(path.join(os.tmpdir(), "shared-rollback-"));
  try {
    const failed = database({ failAt: 3 });
    await assert.rejects(publishSharedResources({ env, root, storage, connect: failed.connect, log: () => {} }), /synthetic database failure/);
    assert.equal(failed.state.resources.size, 0);
    assert.equal(failed.state.files.size, 0);
    assert.equal(failed.state.rollbacks, 1);
    assert.equal(failed.state.closed, 1);
    const retry = database();
    assert.deepEqual(await publishSharedResources({ env, root, storage, connect: retry.connect, log: () => {} }), { added: 27, existing: 0 });
  } finally { await rm(storage, { recursive: true, force: true }); }
});

test("missing instructor prevents publication, and disabled publication never connects", async () => {
  const storage = await mkdtemp(path.join(os.tmpdir(), "shared-no-admin-"));
  try {
    const db = database({ admin: false });
    await assert.rejects(publishSharedResources({ env, root, storage, connect: db.connect, log: () => {} }), /Create an instructor account/);
    assert.equal(db.state.commits, 0);
    assert.equal(db.state.resources.size, 0);
    assert.equal(db.state.closed, 1);
    await publishSharedResources({ env: { ...env, PUBLISH_SHARED_RESOURCES: "0" }, connect: () => { throw new Error("Must not connect"); }, log: () => {} });
  } finally { await rm(storage, { recursive: true, force: true }); }
});
