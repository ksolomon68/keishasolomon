import { test } from "node:test";
import assert from "node:assert/strict";
import restartHelper from "../scripts/restart-cpanel-app.cjs";
const { matchesWorker, restartApp } = restartHelper;
const app = "/home/keisha/sandbox-app";
const worker = { pid: 123, uid: 1000, title: `lsnode:${app}/`, started: "10" };

test("restart matches only this user's exact LiteSpeed app", () => {
  assert.equal(matchesWorker(worker, app, 1000), true);
  for (const other of [
    { ...worker, uid: 2000 },
    { ...worker, title: `lsnode:${app}-other/` },
    { ...worker, title: "node unrelated.js" },
    { ...worker, title: `lsnode:${app}/ nested` },
  ]) assert.equal(matchesWorker(other, app, 1000), false);
});

test("sends TERM once and waits for old worker to exit", async () => {
  let running = true;
  const signals = [];
  const count = await restartApp(app, {
    uid: 1000, list: () => [worker, { ...worker, pid: 999, title: "node other.js" }],
    read: () => running ? worker : null,
    signal: (pid) => signals.push(pid), wait: async () => { running = false; },
  });
  assert.equal(count, 1);
  assert.deepEqual(signals, [123]);
});

test("does not signal a reused PID", async () => {
  await restartApp(app, {
    uid: 1000, list: () => [worker], read: () => ({ ...worker, started: "20" }),
    signal: () => assert.fail("reused PID must not be signaled"),
  });
});

test("timeout fails deployment without escalating to a forced kill", async () => {
  let time = 0;
  const signals = [];
  await assert.rejects(restartApp(app, {
    uid: 1000, list: () => [worker], read: () => worker,
    signal: (pid) => signals.push(pid), now: () => time,
    wait: async () => { time += 1000; }, timeoutMs: 1000,
  }), /did not exit/);
  assert.deepEqual(signals, [123]);
});

test("no running app is a valid deployment", async () => {
  assert.equal(await restartApp(app, { uid: 1000, list: () => [] }), 0);
});
