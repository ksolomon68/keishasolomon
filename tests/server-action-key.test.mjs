import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, statSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomBytes } from "node:crypto";
import { ensureServerActionKey, validKey } from "../scripts/server-action-key.cjs";
import { sanitizeBuild } from "../scripts/sanitize-build.cjs";

test("creates a private persistent runtime key and preserves explicitly configured keys", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "runtime-key-"));
  try {
    const first = {};
    ensureServerActionKey(dir, first);
    assert.ok(validKey(first.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY));
    assert.equal(statSync(path.join(dir, "storage/.server-actions-key")).mode & 0o777, 0o600);
    const restarted = {};
    ensureServerActionKey(dir, restarted);
    assert.equal(restarted.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY, first.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY);
    const explicit = { NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: randomBytes(32).toString("base64") };
    const original = explicit.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY;
    ensureServerActionKey(dir, explicit);
    assert.equal(explicit.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY, original);
    assert.throws(() => ensureServerActionKey(dir, { NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: "invalid" }), /Invalid/);
    assert.ok(!validKey("password"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("sanitizes both Next manifests without changing action mappings and is repeatable", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "sanitized-build-"));
  const key = randomBytes(32).toString("base64");
  const manifest = { node: { action: { workers: { "app/page": { moduleId: "1", async: false } } } }, edge: {}, encryptionKey: key };
  try {
    mkdirSync(path.join(dir, "server"));
    const json = path.join(dir, "server/server-reference-manifest.json");
    const js = path.join(dir, "server/server-reference-manifest.js");
    writeFileSync(json, JSON.stringify(manifest));
    writeFileSync(js, `self.__RSC_SERVER_MANIFEST=${JSON.stringify(JSON.stringify(manifest))}`);
    sanitizeBuild(dir);
    const clean = JSON.parse(readFileSync(json, "utf8"));
    assert.ok(!("encryptionKey" in clean));
    assert.deepEqual(clean.node, manifest.node);
    assert.ok(!readFileSync(js, "utf8").includes(key));
    sanitizeBuild(dir);
    writeFileSync(path.join(dir, "server/unexpected.js"), `const key=${JSON.stringify(key)}`);
    writeFileSync(json, JSON.stringify(manifest));
    assert.throws(() => sanitizeBuild(dir), /remains in a build artifact/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
