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
const cohortA = initial.cohorts.find((c) => c.accessCode === "TEST-COHORT-A");
const cohortB = initial.cohorts.find((c) => c.accessCode === "TEST-COHORT-B");
assert.ok(cohortA && cohortB, "Fixture must contain the two test cohorts; re-run seed-cohort-test.ts");

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
const admin = await page(`/admin?cohort=${cohortA.id}`, instructor);
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

/* ---------- Multiple cohorts stay separate ---------- */
const stamp = Date.now();
const cohortBParticipant = await login("cohort-b@example.invalid");

// Each participant sees their own cohort's name and calendar.
const dashA = await page("/dashboard", participant);
const dashB = await page("/dashboard", cohortBParticipant);
assert.ok(dashA.text.includes("Test cohort A") && dashA.text.includes("October 16, 2026"));
assert.ok(!dashA.text.includes("March 5, 2027"), "cohort A must not get cohort B's session 1 date");
assert.ok(dashB.text.includes("Test cohort B") && dashB.text.includes("March 5, 2027"));
assert.ok(!dashB.text.includes("October 16, 2026"), "cohort B must not get the default session 1 date");
assert.ok(!dashB.text.includes("Turn fictional meeting notes"));

// The instructor's view is scoped to the selected cohort.
const adminA = (await page(`/admin?cohort=${cohortA.id}`, instructor)).text;
const adminB = (await page(`/admin?cohort=${cohortB.id}`, instructor)).text;
assert.ok(adminA.includes("Alex Example") && adminA.includes("Turn fictional meeting notes"));
assert.ok(!adminA.includes("Other Cohort Example"));
assert.ok(adminB.includes("Other Cohort Example"));
assert.ok(!adminB.includes("Alex Example") && !adminB.includes("Turn fictional meeting notes"), "cohort B's roster must not include cohort A");
assert.ok(adminA.includes("TEST-COHORT-A") && !adminA.includes("TEST-COHORT-B"), "only the selected cohort's access code is shown");
console.log("PASS: dashboards use each cohort's calendar; instructor roster, friction and codes are scoped per cohort");

// The printable instructor guide is instructor-only and reflects the selected cohort's calendar and headcount.
assert.equal((await page("/admin/guide")).response.status, 307, "signed-out visitors are sent to sign in");
assert.equal((await page("/admin/guide", participant)).response.status, 307, "participants are sent back to their dashboard");
const guideB = await page(`/admin/guide?cohort=${cohortB.id}`, instructor);
assert.equal(guideB.response.status, 200);
assert.ok(guideB.text.includes("Test cohort B") && guideB.text.includes("March 5, 2027"), "guide uses the selected cohort's name and dates");
assert.ok(guideB.text.includes("The Prompt Duel") && guideB.text.includes("Final Showcase"), "guide covers the sessions");
assert.ok(guideB.text.includes("March 5, 2027 to"), "cover calendar starts at cohort B's first session");
assert.ok(!guideB.text.includes("October 16, 2026"), "guide for cohort B must not use the default session 1 date");
console.log("PASS: instructor guide is instructor-only and scoped to the selected cohort");

// Registration is routed by access code (case-insensitive) and wrong codes are refused.
await page("/register");
const register = (accessCode, email) => action("registerAction", "/register", [{}, form({
  name: "Smoke Registrant", email, organization: "", password: "Cohort-demo-only-2026!", accessCode,
})]);
const wrongCode = await register("NOT-A-REAL-CODE", `wrong-${stamp}@example.invalid`);
assert.ok(wrongCode.text.includes("isn't valid"));
assert.ok(!(await db()).users.some((u) => u.email === `wrong-${stamp}@example.invalid`), "no account for a bad code");
const registered = await register("test-cohort-b", `joined-b-${stamp}@example.invalid`);
assert.ok(registered.response.headers.get("x-action-redirect")?.includes("/onboarding"));
assert.equal((await db()).users.find((u) => u.email === `joined-b-${stamp}@example.invalid`)?.cohortId, cohortB.id);
const duplicate = await register("TEST-COHORT-A", `joined-b-${stamp}@example.invalid`);
assert.ok(duplicate.text.includes("already exists"), "a taken email is a friendly error, not a crash");
assert.equal((await db()).users.filter((u) => u.email === `joined-b-${stamp}@example.invalid`).length, 1);
console.log("PASS: access code decides the cohort; invalid codes create nothing");

// Resources are published per cohort, or shared with everyone.
const publish = (cohortId, title, extra = {}) => {
  const data = form({ cohortId, sessionId: "s1", title, kind: "prompt_sheet", linkUrl: "https://example.com/r", ...extra });
  return action("uploadResourceAction", "/admin", [{}, data], instructor);
};
await publish(cohortA.id, `Only-A-${stamp}`);
await publish(cohortB.id, `Only-B-${stamp}`);
await publish(cohortA.id, `Everyone-${stamp}`, { shared: "on" });
const [resA, resB] = [(await page("/dashboard", participant)).text, (await page("/dashboard", cohortBParticipant)).text];
assert.ok(resA.includes(`Only-A-${stamp}`) && resA.includes(`Everyone-${stamp}`) && !resA.includes(`Only-B-${stamp}`));
assert.ok(resB.includes(`Only-B-${stamp}`) && resB.includes(`Everyone-${stamp}`) && !resB.includes(`Only-A-${stamp}`));
console.log("PASS: resources reach only their own cohort unless shared");

// File downloads follow the same boundary.
const upload = form({ cohortId: cohortA.id, sessionId: "s1", title: `File-A-${stamp}`, kind: "prompt_sheet", linkUrl: "" });
upload.set("file", new File(["cohort A only"], `a-only-${stamp}.txt`, { type: "text/plain" }));
const uploaded = await action("uploadResourceAction", "/admin", [{}, upload], instructor);
assert.ok(uploaded.text.includes("Added"), `upload should succeed: ${uploaded.text.slice(0, 300)}`);
const fileId = (await db()).resources.find((r) => r.title === `File-A-${stamp}`)?.fileId;
assert.ok(fileId, "the file resource should have been stored");
const download = (cookie) => fetch(`${origin}/api/files/${fileId}`, { headers: { cookie } }).then((r) => r.status);
assert.equal(await download(participant), 200, "cohort A participant can download its own cohort's file");
assert.equal(await download(cohortBParticipant), 404, "cohort B participant must not reach cohort A's file");
assert.equal(await download(instructor), 200);
assert.equal(await download(""), 401);
console.log("PASS: file downloads are limited to the resource's own cohort");

// Instructor cohort management: create, edit dates, rotate code, archive (which closes registration).
await page("/admin", instructor);
const codeNew = `SMOKE-${stamp}`;
const created = await action("createCohortAction", "/admin", [{}, form({ name: `Smoke ${stamp}`, accessCode: codeNew })], instructor);
assert.ok(created.response.headers.get("x-action-redirect")?.includes("/admin?cohort="));
const cohortC = (await db()).cohorts.find((c) => c.accessCode === codeNew);
assert.ok(cohortC, "cohort should be created");
const dup = await action("createCohortAction", "/admin", [{}, form({ name: "Clash", accessCode: codeNew.toLowerCase() })], instructor);
assert.ok(dup.text.includes("already uses that access code"));
const dates = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`date-s${i + 1}`, ""]));
await action("updateCohortAction", "/admin", [{}, form({ cohortId: cohortC.id, name: `Smoke ${stamp}`, accessCode: codeNew, completionDate: "2028-06-01", ...dates, "date-s1": "2028-01-10" })], instructor);
const savedC = (await db()).cohorts.find((c) => c.id === cohortC.id);
assert.equal(savedC.completionDate, "2028-06-01");
assert.equal(savedC.sessionDates.s1, "2028-01-10");
assert.equal(savedC.sessionDates.s2, null);
await action("setCohortArchivedAction", "/admin", [cohortC.id, true], instructor);
const closed = await register(codeNew, `closed-${stamp}@example.invalid`);
assert.ok(closed.text.includes("has closed"));
assert.ok(!(await db()).users.some((u) => u.email === `closed-${stamp}@example.invalid`));
assert.equal((await action("createCohortAction", "/admin", [{}, form({ name: "By participant", accessCode: "" })], participant)).response.headers.get("x-action-redirect")?.includes("/dashboard"), true, "participants cannot manage cohorts");
console.log("PASS: instructor can create, edit, rotate and archive cohorts; archived cohorts refuse registration; participants cannot manage cohorts");
