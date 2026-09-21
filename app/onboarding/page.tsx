import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { buttonStyles } from "@/components/ui/button";
import { safeHarbor } from "@/data/cohortData";
import { SessionLogistics } from "@/components/layout/participant-help";
import { getCurrentUser } from "@/lib/auth/session";
import { cohortOf } from "@/lib/cohort";
import { cohortSchedule } from "@/lib/cohort-schedule";
import { getStore } from "@/lib/store";

export const metadata: Metadata = {
  title: "Before Day 1: Participant Onboarding",
  description: "What to bring and which accounts to set up before your first session.",
};

export default async function OnboardingPage() {
  // Public page, but a signed-in participant sees their own cohort's calendar.
  const user = await getCurrentUser();
  const cohort = user ? await cohortOf(await getStore(), user) : null;
  const sessions = cohortSchedule(cohort?.sessionDates);

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">Participant onboarding</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-light leading-tight sm:text-6xl">
            Welcome to the cohort. Here&rsquo;s how to be ready.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-on-navy">
            Over eight months we&rsquo;ll cut through the noise, demystify AI and build tools you can use the very next
            day. Come ready to experiment, build and have fun.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <OnboardingChecklist />
        <SessionLogistics />

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

        <section aria-labelledby="dates-title">
          <h2 id="dates-title" className="font-display text-3xl text-navy-900">
            Cohort dates &amp; milestone schedule
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Session dates, themes and hands-on focus</caption>
              <thead>
                <tr className="border-b-2 border-navy-900 text-sm">
                  <th scope="col" className="py-3 pr-4 font-semibold">Session date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Theme</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Hands-on focus</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-line align-top">
                    <th scope="row" className="label py-4 pr-4 text-left font-medium text-ink">
                      {s.dateLabel}
                    </th>
                    <td className="px-4 py-4 text-ink">{s.theme}</td>
                    <td className="px-4 py-4 text-muted">{s.lab.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="no-print flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <p className="font-display text-2xl text-navy-900">Ready to log your first friction point?</p>
          <Link href="/register" className={buttonStyles({ variant: "secondary" })}>
            Create your account
          </Link>
        </div>
      </div>
    </>
  );
}
