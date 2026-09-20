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
      eyebrow="Participant portal"
      title="Welcome back"
      intro="Sign in to log friction, submit deliverables and track your capstone."
      footer={
        <>
          New to the cohort?{" "}
          <Link href="/register" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
            Create your account
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
      <ParticipantHelp />
    </AuthShell>
  );
}
