import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/auth-forms";
import { getCurrentUser } from "@/lib/auth/session";
import { ParticipantHelp } from "@/components/layout/participant-help";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [{ next }, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <AuthShell
      eyebrow="Your account"
      title="Welcome back"
      intro="Sign in to pick up where you left off: your tools, your work and your progress."
      footer={
        <>
          New here?{" "}
          <Link href="/start" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
            Start free
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
            activate with an access code
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
      <ParticipantHelp />
    </AuthShell>
  );
}
