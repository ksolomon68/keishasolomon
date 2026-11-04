const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");

const FILE_ID = "918228eb-a346-4b47-9e41-04f7262d7c1e";
const TITLE = "Build Your Personal AI Assistant";

/** Called inside the library publisher's transaction. Restores only this known blank workbook. */
async function restoreAssistantWorkbook(connection, storage, source) {
  const [rows] = await connection.query({ sql: "SELECT f.id FROM files f JOIN resources r ON r.file_id = f.id WHERE f.id = ? AND r.session_id = 's1' AND r.title = ? LIMIT 1", values: [FILE_ID, TITLE], timeout: 20000 });
  if (!rows.length) return false;
  const content = await fs.readFile(source);
  const digest = createHash("sha256").update(content).digest("hex");
  const storedName = `assistant-workbook-${digest.slice(0, 40)}.docx`;
  const destination = path.join(storage, storedName);
  try { await fs.writeFile(destination, content, { flag: "wx", mode: 0o600 }); }
  catch (error) {
    if (error.code !== "EEXIST") throw error;
    if (!content.equals(await fs.readFile(destination))) throw new Error("Restored assistant workbook integrity check failed.");
  }
  await connection.query({ sql: "UPDATE files SET original_name = ?, stored_name = ?, mime = ?, size = ? WHERE id = ?", values: ["Personal-AI-Assistant-Workbook.docx", storedName, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", content.length, FILE_ID], timeout: 20000 });
  // This specific blank course workbook is part of the requested all-cohort library.
  await connection.query({ sql: "UPDATE resources SET cohort_id = NULL WHERE file_id = ? AND session_id = 's1' AND title = ?", values: [FILE_ID, TITLE], timeout: 20000 });
  return true;
}

module.exports = { restoreAssistantWorkbook, FILE_ID, TITLE };
