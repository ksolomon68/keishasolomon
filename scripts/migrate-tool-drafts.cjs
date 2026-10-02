const { readFileSync } = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

async function migrateToolDrafts(options = {}) {
  const env = options.env ?? process.env;
  const log = options.log ?? console.log;
  if (env.DATA_BACKEND === "file") { log("==> File backend: no draft database migration required."); return; }
  const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = env;
  if (!DB_HOST || !DB_NAME || !DB_USER) throw new Error("Database settings are missing; release activation stopped.");
  // This tiny read does not need libuv filesystem workers on process-limited shared hosting.
  const sql = (options.readSql ?? (() => readFileSync(path.join(__dirname, "../db/tool-drafts.sql"), "utf8")))();
  log("==> Connecting to the draft database (10-second connection limit). ");
  const connection = await (options.connect ?? mysql.createConnection)({ host: DB_HOST, database: DB_NAME, user: DB_USER, password: DB_PASSWORD ?? "", port: Number(DB_PORT ?? 3306), charset: "utf8mb4", connectTimeout: 10000 });
  try {
    // Metadata locks can otherwise wait for hours behind another transaction.
    await connection.query({ sql: "SET SESSION lock_wait_timeout = 15", timeout: 20000 });
    log("==> Preparing participant draft table (20-second query limit).");
    await connection.query({ sql, timeout: 20000 });
    log("Participant draft table is ready.");
  } finally {
    // No pending writes remain after awaited queries; destroy avoids an unbounded close handshake.
    connection.destroy();
  }
}

module.exports = { migrateToolDrafts };
if (require.main === module) {
  const deadline = setTimeout(() => {
    console.error("Draft database migration exceeded 45 seconds. Release activation stopped.");
    process.exit(1);
  }, 45000);
  migrateToolDrafts().catch((error) => {
    const code = /^[A-Z0-9_]+$/.test(error?.code ?? "") ? ` (${error.code})` : "";
    console.error(`Draft database migration failed${code}. Check database access and table creation permissions; the new release has not been activated.`);
    process.exitCode = 1;
  }).finally(() => clearTimeout(deadline));
}
