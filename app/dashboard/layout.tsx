import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Participant dashboard", robots: { index: false, follow: false } };

/** Authoritative gate for everything under /dashboard; pages and actions re-check the session too. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/dashboard");
  return children;
}
