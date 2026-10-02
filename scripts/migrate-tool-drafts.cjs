const { readFile } = require("node:fs/promises");
const path = require("node:path");
const mysql = require("mysql2/promise");

async function main() {
  if (process.env.DATA_BACKEND === "file") return;
  const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;
  if (!DB_HOST || !DB_NAME || !DB_USER) throw new Error("Database settings are missing; release activation stopped.");
  const connection = await mysql.createConnection({ host: DB_HOST, database: DB_NAME, user: DB_USER, password: DB_PASSWORD ?? "", port: Number(DB_PORT ?? 3306), charset: "utf8mb4" });
  try {
    await connection.query(await readFile(path.join(__dirname, "../db/tool-drafts.sql"), "utf8"));
    console.log("Participant draft table is ready.");
  } finally { await connection.end(); }
}
main().catch(() => { console.error("Draft database migration failed. Check database access and table creation permissions; the new release has not been activated."); process.exitCode = 1; });
