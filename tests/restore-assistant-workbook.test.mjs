import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { restoreAssistantWorkbook, FILE_ID, TITLE } from "../scripts/restore-assistant-workbook.cjs";

test("restores the exact original workbook at its existing file id and shares only the matching resource", async () => {
  const storage = await mkdtemp(path.join(os.tmpdir(), "assistant-restore-"));
  const source = fileURLToPath(new URL("../session-materials/session-1/Personal-AI-Assistant-Workbook.docx", import.meta.url));
  const changes = [];
  const connection = { async query({ sql, values }) {
    if (sql.startsWith("SELECT")) {
      assert.deepEqual(values, [FILE_ID, TITLE]);
      assert.match(sql, /r.session_id = 's1'/);
      return [[{ id: FILE_ID }]];
    }
    changes.push({ sql, values });
    return [{}];
  } };
  try {
    assert.equal(await restoreAssistantWorkbook(connection, storage, source), true);
    const metadata = changes[0].values;
    assert.equal(metadata[0], "Personal-AI-Assistant-Workbook.docx");
    assert.ok(metadata[1].length <= 80);
    assert.equal(metadata[4], FILE_ID);
    assert.deepEqual(await readFile(path.join(storage, metadata[1])), await readFile(source));
    assert.match(changes[1].sql, /cohort_id = NULL/);
    assert.deepEqual(changes[1].values, [FILE_ID, TITLE]);
    assert.equal(await restoreAssistantWorkbook(connection, storage, source), true);
    assert.equal(changes[2].values[1], metadata[1]);
  } finally { await rm(storage, { recursive: true, force: true }); }
});

test("an absent or differently named resource is left untouched", async () => {
  let calls = 0;
  const connection = { async query() { calls++; return [[]]; } };
  assert.equal(await restoreAssistantWorkbook(connection, "/not-used", "/not-used"), false);
  assert.equal(calls, 1);
});
