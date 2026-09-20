import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Instructor view", robots: { index: false, follow: false } };

/** Instructor-only gate; participants are redirected to their dashboard. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin("/admin");
  return children;
}
