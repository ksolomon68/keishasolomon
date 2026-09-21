/**
 * Upgrade a single-cohort MySQL database to the multi-cohort schema. Shared by scripts/migrate.js
 * (what `npm run db:migrate` runs) and scripts/migrate.ts so the two can never drift apart.
 * Plain CommonJS on purpose: the production host runs it with `node`, without a TypeScript loader.
 */
const { randomBytes } = require("node:crypto");

/** Fixed id for the cohort that pre-existing participants move into (matches lib/store/types.ts). */
const DEFAULT_COHORT_ID = "00000000-0000-4000-8000-000000000001";

async function columnExists(connection, table, column) {
  const [found] = await connection.query(
    "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
    [table, column],
  );
  return found.length > 0;
}

async function count(connection, sql) {
  const [rows] = await connection.query(sql);
  return Number((rows[0] && rows[0].n) || 0);
}

/**
 * Before cohorts existed there was one implicit cohort. Add the cohort columns, then move every
 * existing participant and resource into a "Founding cohort" so nothing is orphaned or shared by
 * accident. The data steps run only on the run that adds each column, so re-running never overwrites
 * later edits. Returns human-readable notes describing what changed.
 */
async function upgradeToCohorts(connection, env = process.env) {
  const notes = [];
  const usersMigrated = !(await columnExists(connection, "users", "cohort_id"));
  const resourcesMigrated = !(await columnExists(connection, "resources", "cohort_id"));

  if (usersMigrated) {
    await connection.query(
      `ALTER TABLE users
         ADD COLUMN cohort_id CHAR(36) NULL AFTER role,
         ADD KEY idx_users_cohort (cohort_id),
         ADD CONSTRAINT fk_users_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts (id)`,
    );
  }
  if (resourcesMigrated) {
    await connection.query(
      `ALTER TABLE resources
         ADD COLUMN cohort_id CHAR(36) NULL AFTER id,
         ADD KEY idx_resources_cohort (cohort_id),
         ADD CONSTRAINT fk_resources_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts (id)`,
    );
  }
  if (!usersMigrated && !resourcesMigrated) return notes;

  const participants = usersMigrated
    ? await count(connection, "SELECT COUNT(*) AS n FROM users WHERE role = 'participant'")
    : 0;
  const resources = resourcesMigrated ? await count(connection, "SELECT COUNT(*) AS n FROM resources") : 0;
  if (participants + resources === 0) return notes;

  // Keep the code participants already know; fall back to a fresh one if the env var is gone.
  const existingCode = (env.COHORT_ACCESS_CODE || "").trim();
  const accessCode = existingCode || `cohort-${randomBytes(4).toString("hex")}`;
  await connection.query(
    "INSERT IGNORE INTO cohorts (id, name, access_code, session_dates) VALUES (?, 'Founding cohort', ?, '{}')",
    [DEFAULT_COHORT_ID, accessCode],
  );
  if (usersMigrated) {
    await connection.query("UPDATE users SET cohort_id = ? WHERE role = 'participant' AND cohort_id IS NULL", [
      DEFAULT_COHORT_ID,
    ]);
    notes.push(`Moved ${participants} participant(s) into the "Founding cohort".`);
  }
  if (resourcesMigrated) {
    await connection.query("UPDATE resources SET cohort_id = ? WHERE cohort_id IS NULL", [DEFAULT_COHORT_ID]);
    notes.push(`Moved ${resources} resource(s) into the "Founding cohort".`);
  }
  notes.push(
    existingCode
      ? "Founding cohort access code kept from COHORT_ACCESS_CODE. Cohort codes now live in the database; manage them in /admin."
      : `Founding cohort access code: ${accessCode} (COHORT_ACCESS_CODE was not set). Manage cohort codes in /admin.`,
  );
  return notes;
}

module.exports = { upgradeToCohorts, DEFAULT_COHORT_ID };
