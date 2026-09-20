/**
 * Applies db/schema.sql to the configured MySQL database (idempotent).
 * Usage: npm run db:migrate
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { mysqlConfig } from "../lib/store/mysql";

async function main() {
  const sql = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const connection = await mysql.createConnection({ ...mysqlConfig(), multipleStatements: true });
  try {
    await connection.query(sql);
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
