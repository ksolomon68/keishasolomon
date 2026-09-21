import path from "node:path";
import { mkdir, access } from "node:fs/promises";
import bcrypt from "bcryptjs";
import { createFileStore } from "../lib/store/file";

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Test fixtures must not run in production.");
  const dir = path.resolve(".data/cohort-browser-test");
  try { await access(path.join(dir, "db.json")); throw new Error("Fixture already exists; refusing to overwrite it."); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  await mkdir(dir, { recursive: true });
  const store = createFileStore(dir);
  const password = "Cohort-demo-only-2026!";
  const passwordHash = await bcrypt.hash(password, 10);
  // Two cohorts so the browser test can prove one cannot see the other.
  const cohortA = await store.createCohort({ name: "Test cohort A", accessCode: "TEST-COHORT-A" });
  const cohortB = await store.createCohort({ name: "Test cohort B", accessCode: "TEST-COHORT-B", sessionDates: { s1: "2027-03-05" } });
  const participant = await store.createUser({ name: "Alex Example", email: "participant@example.invalid", organization: "Fictional Office", role: "participant", cohortId: cohortA.id, passwordHash });
  await store.createUser({ name: "Instructor Example", email: "instructor@example.invalid", organization: "Test cohort", role: "admin", cohortId: null, passwordHash });
  await store.createUser({ name: "Private Example", email: "other@example.invalid", organization: "Test cohort", role: "participant", cohortId: cohortA.id, passwordHash });
  await store.createUser({ name: "Other Cohort Example", email: "cohort-b@example.invalid", organization: "Test cohort", role: "participant", cohortId: cohortB.id, passwordHash });
  await store.addFriction(participant.id, { task: "Turn fictional meeting notes into a weekly action list", frequency: "weekly", minutes: 30, sessionId: "s3" });
  await store.upsertDeliverable(participant.id, "s1", { status: "submitted", linkUrl: "https://example.com/synthetic-audit", notes: "Synthetic test: 30 minutes weekly. Human checks owners and deadlines.", expectedVersion: 0 });
  console.log(`Synthetic fixtures ready in ${dir}. Accounts: participant@example.invalid, instructor@example.invalid, other@example.invalid (cohort A), cohort-b@example.invalid (cohort B). Test password: ${password}`);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
