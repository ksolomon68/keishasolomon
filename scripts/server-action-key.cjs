const fs = require("node:fs");
const path = require("node:path");
const { randomBytes } = require("node:crypto");

function validKey(value) {
  return typeof value === "string" && /^[A-Za-z0-9+/]+={0,2}$/.test(value)
    && [16, 24, 32].includes(Buffer.from(value, "base64").length)
    && Buffer.from(value, "base64").toString("base64") === value;
}

/** Use Next's supported runtime override; never put the key in a tracked build. */
function ensureServerActionKey(appDir, env = process.env) {
  if (env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY) {
    if (!validKey(env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY)) throw new Error("Invalid Server Actions encryption key configuration.");
    return;
  }
  const storage = path.resolve(appDir, env.UPLOAD_DIR || "storage");
  fs.mkdirSync(storage, { recursive: true });
  const file = path.join(storage, ".server-actions-key");
  try { fs.writeFileSync(file, randomBytes(32).toString("base64"), { flag: "wx", mode: 0o600 }); }
  catch (error) { if (error.code !== "EEXIST") throw error; }
  fs.chmodSync(file, 0o600);
  const key = fs.readFileSync(file, "utf8").trim();
  if (!validKey(key)) throw new Error("Stored Server Actions encryption key is invalid.");
  env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY = key;
}

module.exports = { ensureServerActionKey, validKey };
