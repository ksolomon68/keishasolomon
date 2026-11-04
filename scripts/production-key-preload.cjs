const { loadEnvConfig } = require("@next/env");
const { ensureServerActionKey } = require("./server-action-key.cjs");

loadEnvConfig(process.cwd());
ensureServerActionKey(process.cwd());
