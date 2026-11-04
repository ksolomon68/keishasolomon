/** Publish the bundled participant pack to every cohort. No Next build required. */
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const mysql = require("mysql2/promise");

const mimeTypes = { ".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".txt": "text/plain", ".csv": "text/csv" };
const hash = (value) => createHash("sha256").update(value).digest("hex");
function libraryId(type, file) {
  const hex = hash(`participant-library-v1:${type}:${file}`);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

async function readCatalog(root) {
  const actualRoot = await fs.realpath(root);
  const catalog = JSON.parse(await fs.readFile(path.join(actualRoot, "catalog.json"), "utf8"));
  if (!Array.isArray(catalog) || catalog.length !== 27) throw new Error("Expected the complete 27-item participant resource pack.");
  const seen = new Set();
  return Promise.all(catalog.map(async (item) => {
    if (!/^s[1-8]$/.test(item.sessionId) || !["guide", "template", "prompt_sheet"].includes(item.kind)
      || typeof item.title !== "string" || item.title.length < 2 || item.title.length > 160
      || typeof item.file !== "string" || seen.has(item.file)) throw new Error("Invalid or duplicate resource catalog entry.");
    seen.add(item.file);
    const filename = await fs.realpath(path.resolve(actualRoot, item.file));
    if (!filename.startsWith(actualRoot + path.sep)) throw new Error("Resource file must stay inside the library.");
    const extension = path.extname(filename);
    const mime = mimeTypes[extension];
    if (!mime) throw new Error("Unsupported library file type.");
    const content = await fs.readFile(filename);
    if (!content.length || content.length > 10 * 1024 * 1024 || hash(content) !== item.sha256) throw new Error("Resource integrity check failed.");
    return { ...item, content, mime, originalName: path.basename(filename), storedName: `library-${hash(item.file).slice(0, 16)}-${item.sha256}${extension}`, fileId: libraryId("file", item.file), resourceId: libraryId("resource", item.file) };
  }));
}

async function publishSharedResources(options = {}) {
  const env = options.env ?? process.env;
  const log = options.log ?? console.log;
  if (env.PUBLISH_SHARED_RESOURCES === "0") { log("==> Shared participant resource publication disabled."); return { skipped: true }; }
  if (env.DATA_BACKEND !== "mysql") { log("==> Shared participant resource publisher requires the MySQL backend; skipped."); return { skipped: true }; }
  if (!env.DB_HOST || !env.DB_NAME || !env.DB_USER) throw new Error("Database settings are missing for resource publication.");
  const root = options.root ?? path.resolve(__dirname, "../resource-library");
  const assets = await readCatalog(root);
  const storage = path.resolve(options.storage ?? env.UPLOAD_DIR ?? "./storage");
  const connection = await (options.connect ?? mysql.createConnection)({ host: env.DB_HOST, port: Number(env.DB_PORT ?? 3306), database: env.DB_NAME, user: env.DB_USER, password: env.DB_PASSWORD ?? "", connectTimeout: 10000, charset: "utf8mb4" });
  let transaction = false;
  let lockHeld = false;
  try {
    // Serialize publishers without altering manual uploads or requiring a new database table.
    const lock = `participant-library:${hash(env.DB_NAME).slice(0, 32)}`;
    const [locks] = await connection.query({ sql: "SELECT GET_LOCK(?, 10) AS acquired", values: [lock], timeout: 15000 });
    if (Number(locks[0]?.acquired) !== 1) throw new Error("Another resource publisher is active. Retry after it finishes.");
    lockHeld = true;
    await connection.beginTransaction();
    transaction = true;
    const [admins] = await connection.query({ sql: "SELECT id FROM users WHERE role = 'admin' ORDER BY created_at, id LIMIT 1", timeout: 20000 });
    if (!admins.length) throw new Error("Create an instructor account before publishing the shared resource pack.");
    const owner = admins[0].id;
    await fs.mkdir(storage, { recursive: true });
    let added = 0, existing = 0;
    for (const asset of assets) {
      const [current] = await connection.query({ sql: "SELECT id FROM resources WHERE id = ?", values: [asset.resourceId], timeout: 20000 });
      if (current.length) { existing++; continue; }
      const destination = path.join(storage, asset.storedName);
      try { await fs.writeFile(destination, asset.content, { flag: "wx", mode: 0o600 }); }
      catch (error) {
        if (error.code !== "EEXIST") throw error;
        if (hash(await fs.readFile(destination)) !== asset.sha256) throw new Error("Stored library file integrity check failed.");
      }
      const [files] = await connection.query({ sql: "SELECT stored_name, size FROM files WHERE id = ?", values: [asset.fileId], timeout: 20000 });
      if (files.length) {
        if (files[0].stored_name !== asset.storedName || Number(files[0].size) !== asset.content.length) throw new Error("Existing library file metadata differs; no records were changed.");
      } else {
        await connection.query({ sql: "INSERT INTO files (id, owner_id, original_name, stored_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)", values: [asset.fileId, owner, asset.originalName, asset.storedName, asset.mime, asset.content.length], timeout: 20000 });
      }
      await connection.query({ sql: "INSERT INTO resources (id, cohort_id, session_id, title, kind, link_url, file_id, created_by) VALUES (?, NULL, ?, ?, ?, NULL, ?, ?)", values: [asset.resourceId, asset.sessionId, asset.title, asset.kind, asset.fileId, owner], timeout: 20000 });
      added++;
    }
    await connection.commit();
    transaction = false;
    log(`==> Shared participant library: ${added} added, ${existing} already present. Available to every existing and future cohort.`);
    return { added, existing };
  } catch (error) {
    if (transaction) await connection.rollback();
    throw error;
  } finally {
    // Closing this dedicated connection also releases its advisory lock on every failure path.
    if (lockHeld) {
      try { await connection.query({ sql: "SELECT RELEASE_LOCK(?)", values: [`participant-library:${hash(env.DB_NAME).slice(0, 32)}`], timeout: 5000 }); } catch { /* destroy below releases it */ }
    }
    connection.destroy();
  }
}

module.exports = { publishSharedResources, readCatalog, libraryId };
if (require.main === module) {
  const deadline = setTimeout(() => { console.error("Shared resource publication exceeded its time limit. Retry deployment after checking database and storage access."); process.exit(1); }, 120000);
  publishSharedResources().catch((error) => {
    const code = /^[A-Z0-9_]+$/.test(error?.code ?? "") ? ` (${error.code})` : "";
    // Do not log driver messages, connection options, or credential-bearing configuration.
    console.error(`Shared resource publication failed${code}. Verify the instructor account, catalog, database permissions and UPLOAD_DIR. No partial resource batch was committed.`);
    process.exitCode = 1;
  }).finally(() => clearTimeout(deadline));
}
