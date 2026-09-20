import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { readUpload } from "@/lib/uploads";

/**
 * Authenticated file download.
 * Allowed: the uploader, any instructor, or any signed-in participant when the file is a shared cohort resource.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new Response("Please sign in.", { status: 401 });

  const parsed = z.uuid().safeParse((await ctx.params).id);
  if (!parsed.success) return new Response("Not found.", { status: 404 });

  const store = await getStore();
  const file = await store.getFile(parsed.data);
  if (!file) return new Response("Not found.", { status: 404 });

  const allowed =
    user.role === "admin" ||
    file.ownerId === user.id ||
    (await store.listResources()).some((r) => r.fileId === file.id);
  if (!allowed) return new Response("Not found.", { status: 404 });

  let body: Buffer;
  try {
    body = await readUpload(file);
  } catch {
    return new Response("Not found.", { status: 404 });
  }

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(body.length),
      // Always download; never render uploaded content inline in our origin.
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
