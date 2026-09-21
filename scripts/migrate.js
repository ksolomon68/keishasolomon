const { readFile } = require("node:fs/promises");
const path = require("node:path");
const mysql = require("mysql2/promise");
const { upgradeToCohorts } = require("./cohort-upgrade");

async function main() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_NAME || !DB_USER) {
    throw new Error("MySQL is not configured: set DB_HOST, DB_NAME, DB_USER and DB_PASSWORD in .env.local.");
  }
  const config = {
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD || "",
    charset: "utf8mb4",
    multipleStatements: true,
  };
  const sql = await readFile(path.join(__dirname, "..", "db", "schema.sql"), "utf8");
  console.log(`Applying schema to database "${DB_NAME}" on ${DB_HOST}:${config.port}…`);
  const connection = await mysql.createConnection(config);
  try {
    await connection.query(sql);
    // CREATE TABLE IF NOT EXISTS does not upgrade existing installations.
    const [columns] = await connection.query("SHOW COLUMNS FROM deliverables");
    const present = new Set(columns.map((column) => column.Field));
    const additions = {
      version: "INT UNSIGNED NOT NULL DEFAULT 0",
      revision: "INT UNSIGNED NOT NULL DEFAULT 1",
      feedback: "TEXT NULL",
      feedback_revision: "INT UNSIGNED NULL",
    };
    for (const [name, definition] of Object.entries(additions)) {
      if (!present.has(name)) await connection.query(`ALTER TABLE deliverables ADD COLUMN ${name} ${definition}`);
    }
    for (const note of await upgradeToCohorts(connection)) console.log(note);
    const [tables] = await connection.query("SHOW TABLES");
    console.log(`Schema applied. Tables: ${tables.map((r) => Object.values(r)[0]).join(", ")}`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
