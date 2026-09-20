const { randomUUID } = require("node:crypto");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function main() {
  const [name, email] = process.argv.slice(2);
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('Usage: ADMIN_PASSWORD=... node --env-file=.env.local scripts/create-admin.js "Full Name" email@example.com');
  }

  if (!email.includes("@")) {
    throw new Error("Invalid email address.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_NAME || !DB_USER) {
    throw new Error("MySQL is not configured: set DB_HOST, DB_NAME, DB_USER and DB_PASSWORD in .env.local.");
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD || "",
    charset: "utf8mb4",
  });

  try {
    const [existing] = await connection.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      throw new Error(`An account for ${email} already exists.`);
    }

    const id = randomUUID();
    const hash = await bcrypt.hash(password, 12);
    await connection.execute(
      "INSERT INTO users (id, email, name, organization, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
      [id, email, name, "EVOBRAND Concepts", "admin", hash]
    );

    console.log(`Created instructor ${name} <${email}>.`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
