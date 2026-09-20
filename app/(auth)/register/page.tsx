import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/auth-forms";
import { getCurrentUser } from "@/lib/auth/session";
import { ParticipantHelp } from "@/components/layout/participant-help";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="For invited participants"
      title="Activate your participant account"
      intro="Enter the access code from your welcome message to open your participant portal."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
      <ParticipantHelp />
    </AuthShell>
  );
}
