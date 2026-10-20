import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/auth-forms";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Start free",
  description: "Create a free Starter account and learn when and how to use AI at work.",
};

export default async function StartPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="Starter plan · free"
      title="Start learning AI on your own"
      intro="Create a free account to check whether a task suits AI, write clearer requests, and learn the safety rules. No access code or card needed."
      footer={
        <div className="space-y-2">
          <p>
            Have an access code?{" "}
            <Link href="/register" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
              Activate your cohort account
            </Link>
          </p>
          <p>
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <RegisterForm mode="starter" />
      <p className="mt-5 text-sm text-muted">
        Training a team or running a leadership program?{" "}
        <Link href="/plans" className="font-semibold text-navy-900 underline underline-offset-4">Compare plans</Link>.
      </p>
    </AuthShell>
  );
}
