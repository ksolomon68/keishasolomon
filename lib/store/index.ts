import type { Store } from "./types";

export * from "./types";

const globalForStore = globalThis as unknown as { __sandboxStore?: Promise<Store> };

async function create(): Promise<Store> {
  const backend = process.env.DATA_BACKEND ?? "mysql";

  if (backend === "file") {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_FILE_BACKEND !== "true") {
      throw new Error('DATA_BACKEND="file" is for local development only. Use "mysql" in production.');
    }
    return (await import("./file")).createFileStore(process.env.LOCAL_DATA_DIR);
  }
  if (backend === "mysql") {
    return (await import("./mysql")).createMysqlStore();
  }
  throw new Error(`Unknown DATA_BACKEND "${backend}". Expected "mysql" or "file".`);
}

/** Lazily create one store per server process (survives dev hot reloads). */
export function getStore(): Promise<Store> {
  return (globalForStore.__sandboxStore ??= create());
}
