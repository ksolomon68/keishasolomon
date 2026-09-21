/**
 * Applies db/schema.sql to the configured MySQL database (idempotent), then upgrades databases that
 * predate multi-cohort support. `npm run db:migrate` runs scripts/migrate.js (plain Node, for the
 * production host); this TypeScript entry point does the same job and shares its cohort upgrade.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { mysqlConfig } from "../lib/store/mysql";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { upgradeToCohorts } = require("./cohort-upgrade.js") as {
  upgradeToCohorts: (connection: mysql.Connection) => Promise<string[]>;
};

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
