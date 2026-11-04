import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { buttonStyles } from "@/components/ui/button";
import { safeHarbor } from "@/data/cohortData";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Before Day 1: Participant Onboarding",
  description: "What to bring and which accounts to set up before your first session.",
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">Participant onboarding</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-light leading-tight sm:text-6xl">
            Welcome to the cohort. Here&rsquo;s how to be ready.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-on-navy">
            Across eight sessions, offered weekly or monthly, we&rsquo;ll cut through the noise, demystify AI and build tools you can use the very next
            day. Come ready to experiment, build and have fun.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <OnboardingChecklist />

        <section aria-labelledby="safe-harbor-notice" className="border-l-4 border-cyan-deep bg-white p-6 sm:p-8">
          <h2 id="safe-harbor-notice" className="flex items-center gap-3 font-display text-2xl text-navy-900">
            <ShieldCheck className="size-6 text-cyan-deep" aria-hidden="true" />
            Safe Harbor &amp; privacy notice
          </h2>
          <p className="mt-3 max-w-3xl text-muted">{safeHarbor.intro}</p>
          <ul className="mt-4 space-y-2 text-ink">
            {safeHarbor.commitments.slice(0, 2).map((c) => (
              <li key={c.title}>
                <span className="font-semibold">{c.title}.</span> {c.body}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="schedule-title" className="border border-line bg-white p-6 sm:p-8">
          <h2 id="schedule-title" className="font-display text-3xl text-navy-900">Plan your learning</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Guided sessions follow your organization&rsquo;s calendar. Your participant dashboard holds your cohort schedule.
            Check your instructor&rsquo;s welcome message for the confirmed time, time zone and location.
            Free Starter learning is self-paced.
          </p>
        </section>

        <div className="no-print flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <p className="font-display text-2xl text-navy-900">{user ? "Ready to put your learning into practice?" : "Choose your next step"}</p>
          <Link href={user ? "/dashboard" : "/register"} className={buttonStyles({ variant: "secondary" })}>
            {user ? "Go to my dashboard" : "Activate with an access code"}
          </Link>
          {!user && <Link href="/start" className={buttonStyles({ variant: "outline" })}>Start free without a code</Link>}
        </div>
      </div>
    </>
  );
}
