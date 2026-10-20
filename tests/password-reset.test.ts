import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createFileStore } from "../lib/store/file";
import { resetPasswordSchema } from "../lib/validation";

const inAnHour = () => new Date(Date.now() + 3_600_000).toISOString();

test("reset tokens work once, expire, and a newer request replaces older ones", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "cohort-resets-"));
  try {
    const store = createFileStore(dir);
    await store.createPasswordReset("u1", "a".repeat(64), inAnHour());
    assert.equal(await store.consumePasswordReset("a".repeat(64)), "u1");
    assert.equal(await store.consumePasswordReset("a".repeat(64)), null, "second use is refused");

    await store.createPasswordReset("u1", "b".repeat(64), new Date(Date.now() - 1000).toISOString());
    assert.equal(await store.consumePasswordReset("b".repeat(64)), null, "expired token is refused");

    await store.createPasswordReset("u1", "c".repeat(64), inAnHour());
    await store.createPasswordReset("u1", "d".repeat(64), inAnHour());
    assert.equal(await store.consumePasswordReset("c".repeat(64)), null, "older token is invalidated");
    assert.equal(await store.consumePasswordReset("d".repeat(64)), "u1");
    assert.equal(await store.consumePasswordReset("unknown"), null);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("reset form requires a well-formed token and matching passwords", () => {
  const token = "x".repeat(43);
  assert.ok(resetPasswordSchema.safeParse({ token, password: "long-enough-1", confirm: "long-enough-1" }).success);
  assert.equal(resetPasswordSchema.safeParse({ token, password: "long-enough-1", confirm: "different-1" }).success, false);
  assert.equal(resetPasswordSchema.safeParse({ token: "short", password: "long-enough-1", confirm: "long-enough-1" }).success, false);
  assert.equal(resetPasswordSchema.safeParse({ token, password: "short", confirm: "short" }).success, false);
});
