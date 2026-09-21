import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/app/certificate/print-button";
import { InstructorGuide } from "@/components/admin/instructor-guide";
import { buttonStyles } from "@/components/ui/button";
import { capstoneSteps } from "@/data/cohortData";
import { requireAdmin } from "@/lib/auth/session";
import { cohortSchedule } from "@/lib/cohort-schedule";
import { getStore } from "@/lib/store";

export const metadata: Metadata = {
  title: "Instructor guide",
  robots: { index: false, follow: false },
};

export default async function InstructorGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ cohort?: string | string[] }>;
}) {
  await requireAdmin("/admin/guide");
  const store = await getStore();
  const [cohorts, users] = await Promise.all([store.listCohorts(), store.listUsers()]);

  // Same selection rule as the command center, so the booklet matches the cohort you were just viewing.
  const requested = (await searchParams).cohort;
  const cohort = cohorts.find((c) => c.id === requested) ?? cohorts.find((c) => !c.archived) ?? cohorts[0] ?? null;

  const participants = users.filter((u) => u.role === "participant" && u.cohortId === cohort?.id);
  const ids = new Set(participants.map((u) => u.id));
  const stepIds = new Set(capstoneSteps.map((s) => s.id));
  const done = new Map<string, number>();
  for (const c of await store.listCapstone()) {
    if (ids.has(c.userId) && stepIds.has(c.stepId)) done.set(c.userId, (done.get(c.userId) ?? 0) + 1);
  }
  const capstoneComplete = participants.filter((u) => (done.get(u.id) ?? 0) >= capstoneSteps.length).length;

  return (
    <>
      <div className="no-print border-b border-line bg-paper-deep">
        <div className="mx-auto flex max-w-[8.5in] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href={cohort ? `/admin?cohort=${cohort.id}` : "/admin"} className={buttonStyles({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to command center
          </Link>
          <PrintButton />
        </div>
        {cohorts.length > 1 && (
          <nav aria-label="Choose a cohort for dates and headcount" className="mx-auto max-w-[8.5in] px-4 pb-4 sm:px-6">
            <p className="label mb-2 text-muted">Dates and headcount for</p>
            <ul className="flex flex-wrap gap-2">
              {cohorts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/guide?cohort=${c.id}`}
                    aria-current={c.id === cohort?.id ? "page" : undefined}
                    className={`inline-flex min-h-9 items-center border px-3 text-sm font-semibold ${
                      c.id === cohort?.id ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-navy-900 hover:border-navy-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className="mx-auto max-w-[8.5in] px-4 pb-4 text-sm text-muted sm:px-6">
          Use <strong>Print / Save as PDF</strong> and choose Letter, portrait, margins &ldquo;Default&rdquo;, and
          &ldquo;Background graphics&rdquo; on for the cover.
        </p>
      </div>

      <div className="mx-auto max-w-[8.5in] px-4 py-8 sm:px-6 print:max-w-none print:p-0">
        <InstructorGuide
          cohort={cohort}
          schedule={cohortSchedule(cohort?.sessionDates)}
          participantCount={participants.length}
          capstoneComplete={capstoneComplete}
        />
      </div>
    </>
  );
}
