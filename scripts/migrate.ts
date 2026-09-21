/**
 * Applies db/schema.sql to the configured MySQL database (idempotent), then upgrades databases that
 * predate multi-cohort support.
 * Usage: npm run db:migrate
 */
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql, { type Connection, type RowDataPacket } from "mysql2/promise";
import { mysqlConfig } from "../lib/store/mysql";
import { DEFAULT_COHORT_ID } from "../lib/store/types";

async function columnExists(connection: Connection, table: string, column: string): Promise<boolean> {
  const [found] = await connection.query<RowDataPacket[]>(
    "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
    [table, column],
  );
  return found.length > 0;
}

async function count(connection: Connection, sql: string): Promise<number> {
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return Number(rows[0]?.n ?? 0);
}

/**
 * Before cohorts existed there was one implicit cohort. Add the cohort columns and move every
 * existing participant and resource into a "Founding cohort" so nothing is orphaned or shared by
 * accident. Runs its data steps only on the run that adds each column, so it never overwrites later edits.
 */
async function upgradeToCohorts(connection: Connection): Promise<string[]> {
  const notes: string[] = [];
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

  const participants = usersMigrated ? await count(connection, "SELECT COUNT(*) AS n FROM users WHERE role = 'participant'") : 0;
  const resources = resourcesMigrated ? await count(connection, "SELECT COUNT(*) AS n FROM resources") : 0;
  if (participants + resources === 0) return notes;

  // Keep the code participants already know; fall back to a fresh one if the env var is gone.
  const existingCode = process.env.COHORT_ACCESS_CODE?.trim();
  const accessCode = existingCode || `cohort-${randomBytes(4).toString("hex")}`;
  await connection.query(
    `INSERT IGNORE INTO cohorts (id, name, access_code, session_dates) VALUES (?, 'Founding cohort', ?, '{}')`,
    [DEFAULT_COHORT_ID, accessCode],
  );
  if (usersMigrated) {
    await connection.query("UPDATE users SET cohort_id = ? WHERE role = 'participant' AND cohort_id IS NULL", [DEFAULT_COHORT_ID]);
    notes.push(`Moved ${participants} participant(s) into the "Founding cohort".`);
  }
  if (resourcesMigrated) {
    await connection.query("UPDATE resources SET cohort_id = ? WHERE cohort_id IS NULL", [DEFAULT_COHORT_ID]);
    notes.push(`Moved ${resources} resource(s) into the "Founding cohort".`);
  }
  notes.push(
    existingCode
      ? `Founding cohort access code kept from COHORT_ACCESS_CODE. Cohort codes now live in the database; manage them in /admin.`
      : `Founding cohort access code: ${accessCode} (COHORT_ACCESS_CODE was not set). Manage cohort codes in /admin.`,
  );
  return notes;
}

async function main() {
  const sql = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const connection = await mysql.createConnection({ ...mysqlConfig(), multipleStatements: true });
  try {
    await connection.query(sql);
    for (const note of await upgradeToCohorts(connection)) console.log(note);
    const [tables] = await connection.query("SHOW TABLES");
    console.log(`Schema applied. Tables: ${(tables as Record<string, string>[]).map((r) => Object.values(r)[0]).join(", ")}`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
