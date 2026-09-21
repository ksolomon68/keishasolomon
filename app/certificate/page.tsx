import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { capstoneSteps } from "@/data/cohortData";
import { cohortOf } from "@/lib/cohort";
import { certificateDate } from "@/lib/cohort-schedule";
import { CertificateSheet } from "./certificate-sheet";
import { PrintButton } from "./print-button";
import { Lock, ArrowLeft, Award, CheckCircle2 } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Certificate of Completion – The AI Executive Sandbox",
  description:
    "Certificate of Completion for the AI Executive Sandbox program, issued by EVOBRAND Concepts.",
};

export default async function CertificatePage() {
  const user = await requireUser("/certificate");
  const store = await getStore();
  const [capstone, cohort] = await Promise.all([store.listCapstone(user.id), cohortOf(store, user)]);
  const capstoneDone = capstone.filter((c) =>
    capstoneSteps.some((s) => s.id === c.stepId),
  ).length;
  const totalSteps = capstoneSteps.length;
  const isCompleted = user.role === "admin" || capstoneDone >= totalSteps;

  if (!isCompleted) {
    const percent = Math.round((capstoneDone / totalSteps) * 100);

    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber/30 bg-white p-8 text-center shadow-lg sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber/10 text-amber-deep">
            <Lock className="size-8" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-light text-navy-900 sm:text-4xl">
            Certificate Locked
          </h1>

          <p className="mt-3 text-lg leading-relaxed text-muted">
            The official <span className="font-semibold text-navy-900">EVOBRAND Concepts</span> Certificate
            of Completion is awarded upon finishing all milestones in your capstone project.
          </p>

          {/* Progress Box */}
          <div className="mx-auto mt-8 max-w-md rounded-lg border border-line bg-paper-deep p-6 text-left">
            <div className="flex items-center justify-between text-sm font-semibold text-navy-900">
              <span className="flex items-center gap-2">
                <Award className="size-4 text-amber-deep" />
                Capstone Progress
              </span>
              <span>{capstoneDone} / {totalSteps} steps ({percent}%)</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-amber-deep transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="mt-4 text-xs leading-normal text-muted">
              Complete the remaining {totalSteps - capstoneDone} capstone step{totalSteps - capstoneDone === 1 ? "" : "s"} on your participant dashboard to unlock your certificate.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard#capstone"
              className={buttonStyles({ variant: "primary" })}
            >
              <CheckCircle2 className="size-4" />
              Go to Capstone Tracker
            </Link>
            <Link
              href="/dashboard"
              className={buttonStyles({ variant: "secondary" })}
            >
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print / download button – hidden when printing */}
      <div className="no-print flex justify-center gap-4 bg-paper-deep py-6 border-b border-line">
        <PrintButton />
      </div>

      <CertificateSheet
        name={user.name}
        organization={user.organization}
        cohortName={cohort?.name}
        date={certificateDate(cohort)}
      />
    </>
  );
}

