/** HTTP integration checks for the isolated fixture server only. No production URL option. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { encodeReply } = require("next/dist/compiled/react-server-dom-webpack/client.node");
const origin = "http://localhost:3100";
const fixturePath = ".data/cohort-browser-test/db.json";
const manifestPath = ".next-cohort-test/dev/server/server-reference-manifest.json";
const db = () => readFile(fixturePath, "utf8").then(JSON.parse);
const initial = await db();
assert.ok(initial.users.every((user) => user.email.endsWith("@example.invalid")), "Only synthetic fixtures are allowed");
const participantId = initial.users.find((user) => user.email === "participant@example.invalid").id;

async function page(path, cookie = "") {
  const response = await fetch(origin + path, { headers: { cookie }, redirect: "manual" });
  return { response, text: await response.text() };
}
async function action(name, path, args, cookie = "") {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const id = Object.entries(manifest.node).find(([, entry]) => entry.exportedName === name)?.[0];
  assert.ok(id, `Compiled action ${name} must exist`);
  const response = await fetch(origin + path, {
    method: "POST", redirect: "manual",
    headers: { "Next-Action": id, Accept: "text/x-component", Origin: origin, cookie },
    body: await encodeReply(args),
  });
  const text = await response.text();
  assert.ok(response.status < 500, `${name} failed: ${response.status} ${text.slice(0,400)}`);
  return { response, text };
}
function form(values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, String(value));
  return data;
}
async function login(email) {
  const result = await action("loginAction", "/login", [{}, form({ email, password: "Cohort-demo-only-2026!" })]);
  const cookie = result.response.headers.getSetCookie().find((value) => value.startsWith("sandbox_session="))?.split(";")[0];
  assert.ok(cookie, `Synthetic login failed for ${email}`);
  return cookie;
}
async function current() {
  return (await db()).deliverables.find((d) => d.userId === participantId && d.sessionId === "s1");
}
async function save(cookie, row, changes = {}) {
  return action("saveDeliverableAction", "/dashboard", [{}, form({
    sessionId: "s1", status: row.status, linkUrl: row.linkUrl ?? "", notes: row.notes,
    version: row.version, ...changes,
  })], cookie);
}

assert.equal((await page("/login")).response.status, 200);
assert.equal((await page("/dashboard")).response.status, 307);
const participant = await login("participant@example.invalid");
const dashboard = await page("/dashboard", participant);
assert.equal(dashboard.response.status, 200);
assert.ok(dashboard.text.includes("Turn fictional meeting notes"));
assert.ok(dashboard.text.includes("Build a reusable prompt"));
assert.ok(dashboard.text.includes("Decision lab"));
assert.equal((await page("/admin", participant)).response.status, 307);
const other = await login("other@example.invalid");
assert.ok(!(await page("/dashboard", other)).text.includes("Turn fictional meeting notes"));
const instructor = await login("instructor@example.invalid");
const admin = await page("/admin", instructor);
assert.equal(admin.response.status, 200);
assert.ok(admin.text.includes("Turn fictional meeting notes"));
assert.ok(admin.text.includes("Feedback for this revision"));
console.log("PASS: real sign-in, route protection, participant isolation, instructor friction view, and practice content");

let row = await current();
const unauthorized = await action("reviewDeliverableAction", "/admin", [{}, form({ userId: participantId, sessionId: "s1", status: "reviewed", feedback: "Unauthorized feedback must not be stored.", version: row.version })], participant);
assert.ok(unauthorized.response.headers.get("x-action-redirect")?.includes("/dashboard"));
assert.equal((await current()).version, row.version);
const empty = await save(participant, row, { status: "submitted", linkUrl: "", removeFile: "on" });
assert.ok(empty.text.includes("Add a link or upload a file"));
assert.equal((await current()).version, row.version);
console.log("PASS: server rejects unauthorized reviews and submissions without evidence");

await action("reviewDeliverableAction", "/admin", [{}, form({ userId: participantId, sessionId: "s1", status: "needs_revision", feedback: "Clear baseline. Add a second synthetic example and include review time.", version: row.version })], instructor);
row = await current();
assert.equal(row.status, "needs_revision");
assert.ok((await page("/dashboard", participant)).text.includes("Add a second synthetic example"));
await save(participant, row, { status: "submitted", notes: `${row.notes}\nSecond test includes human review time.` });
row = await current();
assert.equal(row.status, "submitted");
await action("reviewDeliverableAction", "/admin", [{}, form({ userId: participantId, sessionId: "s1", status: "reviewed", feedback: "Both examples meet the criteria. Carry the missing-data rule into your next lab.", version: row.version })], instructor);
row = await current();
assert.equal(row.status, "reviewed");
assert.equal(row.feedbackRevision, row.revision);
const reviewed = { ...row };
await save(participant, row);
row = await current();
assert.equal(row.status, "reviewed");
assert.equal(row.revision, reviewed.revision);
await save(participant, row, { notes: `${row.notes}\nNew evidence for instructor review.` });
row = await current();
assert.equal(row.status, "submitted");
assert.ok(row.revision > row.feedbackRevision);
const conflict = await save(participant, reviewed, { notes: "Stale tab must not overwrite the newer work." });
assert.ok(conflict.text.includes("another window") || conflict.text.includes("Only your instructor"));
assert.equal((await current()).version, row.version);
console.log("PASS: feedback → revision → resubmission → review → unchanged save → edited work returns to review; stale save rejected");
