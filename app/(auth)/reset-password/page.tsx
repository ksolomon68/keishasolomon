import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/auth-forms";

// The token is in the URL, so never send it onward in a Referer header.
export const metadata: Metadata = { title: "Choose a new password", referrer: "no-referrer", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);

  return (
    <AuthShell
      eyebrow="Account help"
      title="Choose a new password"
      intro={valid ? "Pick a password you don't use on any other site." : "This reset link is incomplete. Request a new one below."}
      footer={
        <Link href="/login" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
          Back to sign in
        </Link>
      }
    >
      {valid ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Link href="/forgot-password" className="font-semibold text-navy-900 underline underline-offset-4">
          Request a new reset link
        </Link>
      )}
    </AuthShell>
  );
}
