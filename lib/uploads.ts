import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore, type StoredFile } from "@/lib/store";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Extension allowlist. The served Content-Type comes from here, never from the client. */
const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv": "text/csv",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

export const ACCEPT_ATTR = Object.keys(TYPES).join(",");

// The directory is a deployment setting (a persistent volume in production), so it is resolved at runtime on purpose.
const uploadDir = () => path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "./storage");

/** Resolve a stored name inside the upload dir, refusing anything that escapes it. */
function resolveStored(storedName: string): string {
  const dir = uploadDir();
  const full = path.resolve(dir, storedName);
  if (path.dirname(full) !== dir) throw new Error("Invalid stored file name.");
  return full;
}

export class UploadError extends Error {}

/** Validate, write to disk under a random name, and record it. `file` must be non-empty. */
export async function saveUpload(file: File, ownerId: string): Promise<StoredFile> {
  if (file.size === 0) throw new UploadError("That file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Files must be 10 MB or smaller.");

  const ext = path.extname(file.name).toLowerCase();
  const mime = TYPES[ext];
  if (!mime) {
    throw new UploadError("That file type isn't supported. Use PDF, Office, CSV, text or image files.");
  }

  const storedName = `${randomUUID()}${ext}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(resolveStored(storedName), Buffer.from(await file.arrayBuffer()));

  // Keep only the base name; never trust directory parts from the client.
  const originalName = path.basename(file.name).slice(0, 255);
  return (await getStore()).createFile({ ownerId, originalName, storedName, mime, size: file.size });
}

export async function readUpload(file: StoredFile): Promise<Buffer> {
  return readFile(resolveStored(file.storedName));
}

/** Delete the file record and its bytes. Safe to call with an id that no longer exists. */
export async function removeFile(fileId: string | null): Promise<void> {
  if (!fileId) return;
  const removed = await (await getStore()).deleteFile(fileId);
  if (!removed) return;
  try {
    await unlink(resolveStored(removed.storedName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
