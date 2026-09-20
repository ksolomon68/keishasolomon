const { readFile } = require("node:fs/promises");
const path = require("node:path");
const mysql = require("mysql2/promise");

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
  const connection = await mysql.createConnection(config);
  try {
    await connection.query(sql);
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
