const fs = require("node:fs");
const path = require("node:path");

/** Strip Next's generated key while preserving every action reference and worker mapping. */
function sanitizeBuild(buildDir) {
  const manifestFile = path.join(buildDir, "server/server-reference-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  if (!manifest.node || !manifest.edge) throw new Error("Unexpected Server Actions manifest format.");
  const keys = [];
  if (manifest.encryptionKey) keys.push(manifest.encryptionKey);
  delete manifest.encryptionKey;
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  const scriptFile = path.join(buildDir, "server/server-reference-manifest.js");
  if (fs.existsSync(scriptFile)) {
    const source = fs.readFileSync(scriptFile, "utf8");
    const match = /^self\.__RSC_SERVER_MANIFEST=("(?:[^"\\]|\\.)*");?\s*$/.exec(source);
    if (!match) throw new Error("Unexpected Server Actions script manifest format.");
    const data = JSON.parse(JSON.parse(match[1]));
    if (data.encryptionKey) keys.push(data.encryptionKey);
    delete data.encryptionKey;
    fs.writeFileSync(scriptFile, `self.__RSC_SERVER_MANIFEST=${JSON.stringify(JSON.stringify(data))}`);
  }
  const generatedKeys = keys.filter((key) => typeof key === "string" && !key.includes("process.env"));
  function check(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === "cache" || item.name === "dev") continue;
      const file = path.join(dir, item.name);
      if (item.isDirectory()) check(file);
      else if (item.isFile()) {
        const content = fs.readFileSync(file);
        if (generatedKeys.some((key) => content.includes(Buffer.from(key)))) throw new Error("Generated action key remains in a build artifact; publication stopped.");
      }
    }
  }
  check(buildDir);
}

module.exports = { sanitizeBuild };
if (require.main === module) {
  try { sanitizeBuild(path.resolve(process.argv[2] || ".next")); console.log("Production artifacts sanitized; Server Actions key will be supplied privately at runtime."); }
  catch { console.error("Build sanitization failed. Do not commit or deploy the generated artifacts."); process.exitCode = 1; }
}
