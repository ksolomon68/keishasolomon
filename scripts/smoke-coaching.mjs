/** Only for the fictional-account fixture server; never point this at production. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { encodeReply } = require("next/dist/compiled/react-server-dom-webpack/client.node");
const origin = "http://localhost:3200";
const db = async () => JSON.parse(await readFile(".data/cohort-browser-test/db.json", "utf8"));
const fixture = await db();
assert.ok(fixture.users.length && fixture.users.every((u) => u.email.endsWith("@example.invalid")), "Synthetic fixtures only");
const participant = fixture.users.find((u) => u.email === "participant@example.invalid");
assert.ok(participant?.cohortId);
const original = fixture.supportRequests.find((r) => r.userId === participant.id && r.subject === "My one course coaching session");
const expectedMessages = original ? fixture.supportMessages.filter((m) => m.requestId === original.id).length : 1;
const page = async (path, cookie = "") => {
  const response = await fetch(origin + path, { headers: { cookie }, redirect: "manual" });
  return { response, html: await response.text() };
};
const form = (values) => {
  const result = new FormData();
  for (const [key, value] of Object.entries(values)) result.set(key, value);
  return result;
};
async function action(name, args, cookie = "", path = "/dashboard") {
  const manifest = JSON.parse(await readFile(".next-cohort-test/dev/server/server-reference-manifest.json", "utf8"));
  const id = Object.entries(manifest.node).find(([, entry]) => entry.exportedName === name)?.[0];
  assert.ok(id, `Action ${name} must be compiled`);
  const response = await fetch(origin + path, { method: "POST", redirect: "manual", headers: { cookie, Origin: origin, "Next-Action": id, Accept: "text/x-component" }, body: await encodeReply(args) });
  const html = await response.text();
  assert.ok(response.status < 500, html.slice(0, 400));
  return { response, html };
}
async function login(email) {
  await page("/login");
  const result = await action("loginAction", [{}, form({ email, password: "Cohort-demo-only-2026!" })], "", "/login");
  const cookie = result.response.headers.getSetCookie().find((v) => v.startsWith("sandbox_session="))?.split(";")[0];
  assert.ok(cookie);
  return cookie;
}
const cookie = await login(participant.email);
assert.equal((await page("/dashboard", cookie)).response.status, 200);
const invalid = await action("requestCoachingSessionAction", [{}, form({ body: "" })], cookie);
assert.ok(invalid.html.includes("Add your focus"));
const request = () => action("requestCoachingSessionAction", [{}, form({ body: "Review my fictional workflow. Tuesday 10am UTC or Thursday 2pm UTC.", userId: "someone-else", cohortId: "someone-else" })], cookie);
await Promise.all([request(), request()]);
const requests = (await db()).supportRequests.filter((r) => r.userId === participant.id && r.subject === "My one course coaching session");
assert.equal(requests.length, 1);
const id = requests[0].id;
assert.equal((await db()).supportMessages.filter((m) => m.requestId === id).length, expectedMessages);
const dashboard = await page("/dashboard", cookie);
assert.ok(dashboard.html.includes("Your course coaching request is already on file."));
assert.ok(!dashboard.html.includes("Request my one coaching session</button>"));
await action("resolveOwnSupportRequestAction", [id], cookie);
await request();
assert.equal((await db()).supportRequests.find((r) => r.id === id).status, "resolved");
assert.equal((await db()).supportMessages.filter((m) => m.requestId === id).length, expectedMessages);
await action("replyToSupportAction", [{}, form({ requestId: id, body: "Please reschedule my existing appointment to Thursday." })], cookie);
assert.equal((await db()).supportRequests.find((r) => r.id === id).status, "open");
const otherCookie = await login("other@example.invalid");
assert.ok(!(await page("/dashboard", otherCookie)).html.includes(`href="#support-request-${id}"`));
const instructorCookie = await login("instructor@example.invalid");
const admin = await page(`/admin?cohort=${participant.cohortId}`, instructorCookie);
assert.ok(admin.html.includes("My one course coaching session"));
assert.ok(admin.html.includes("Please reschedule my existing appointment"));
assert.ok((await action("requestCoachingSessionAction", [{}, form({ body: "No authenticated session may request this." })])).response.headers.get("x-action-redirect")?.includes("/login"));
console.log("PASS: validation, authenticated identity, concurrent duplicate requests, persistent quota after resolution, same-thread rescheduling, participant isolation, instructor visibility and signed-out rejection");
