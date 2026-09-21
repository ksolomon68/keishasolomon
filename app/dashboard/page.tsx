import { CapstoneTracker } from "@/components/dashboard/capstone-tracker";
import { NextSessionSummary } from "@/components/dashboard/countdown";
import { DeliverableHub, type FileInfo } from "@/components/dashboard/deliverable-hub";
import { FrictionLog } from "@/components/dashboard/friction-log";
import { SessionGrid } from "@/components/dashboard/session-grid";
import { NextStep } from "@/components/dashboard/next-step";
import { PromptWorkshop } from "@/components/dashboard/prompt-workshop";
import { SessionRoadmap } from "@/components/dashboard/session-roadmap";
import { capstoneSteps } from "@/data/cohortData";
import { requireUser } from "@/lib/auth/session";
import { cohortOf, resourcesFor } from "@/lib/cohort";
import { cohortSchedule, withDeliverables } from "@/lib/cohort-schedule";
import { getStore } from "@/lib/store";
import { ACCEPT_ATTR } from "@/lib/uploads";
import Link from "next/link";
import { Award, Lock, CheckCircle2 } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import React from "react";

const sections = [
  { id: "sessions", label: "Sessions" },
  { id: "practice", label: "Practice" },
  { id: "friction", label: "Friction log" },
  { id: "deliverables", label: "Deliverables" },
  { id: "capstone", label: "Capstone" },
];

const formatBytes = (n: number) =>
  n < 1024 * 1024
    ? `${Math.max(1, Math.round(n / 1024))} KB`
    : `${(n / 1024 / 1024).toFixed(1)} MB`;

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const store = await getStore();
  const [friction, deliverables, capstone, resources, cohort] = await Promise.all([
    store.listFriction(user.id),
    store.listDeliverables(user.id),
    store.listCapstone(user.id),
    resourcesFor(store, user),
    cohortOf(store, user),
  ]);
  const schedule = cohortSchedule(cohort?.sessionDates);
  const deliverableSessions = withDeliverables(schedule);

  const files: Record<string, FileInfo> = {};
  await Promise.all(
    deliverables.map(async (d) => {
      const file = d.fileId ? await store.getFile(d.fileId) : null;
      if (file) files[file.id] = { name: file.originalName, sizeLabel: formatBytes(file.size) };
    }),
  );

  const submitted = deliverables.filter(
    (d) => d.status === "submitted" || d.status === "reviewed",
  ).length;
  const capstoneDone = capstone.filter((c) =>
    capstoneSteps.some((s) => s.id === c.stepId),
  ).length;
  const totalCapstoneSteps = capstoneSteps.length;
  const isCertUnlocked = user.role === "admin" || capstoneDone >= totalCapstoneSteps;
  const openFriction = friction.filter((f) => !f.done).length;
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 pb-10 pt-12 text-white sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">
            Participant dashboard{cohort ? ` · ${cohort.name}` : ""}
          </p>
          <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-3 max-w-2xl text-on-navy">
            Your workspace for the eight-month cohort: prep for the next session, log friction, submit
            deliverables and keep your capstone on track.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="-mt-6 grid grid-cols-3 gap-px border border-navy-900 bg-navy-900 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-3 bg-white p-5 lg:col-span-1">
            <dt className="label mb-3 text-amber-deep">Next session</dt>
            <dd>
              <NextSessionSummary
                sessions={schedule.map(({ id, number, date, dateLabel, theme }) => ({
                  id,
                  number,
                  date,
                  dateLabel,
                  theme,
                }))}
              />
            </dd>
          </div>
          <Stat label="Deliverables submitted" value={`${submitted}/${deliverableSessions.length}`} />
          <Stat label="Capstone steps done" value={`${capstoneDone}/${totalCapstoneSteps}`} />
          <Stat label="Open friction tasks" value={String(openFriction)} />
        </dl>
        <NextStep deliverables={deliverables} hasFriction={friction.length > 0} schedule={schedule} />
      </div>

      <nav
        aria-label="Dashboard sections"
        className="sticky top-16 z-30 mt-10 border-y border-line bg-paper/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-12 items-center whitespace-nowrap px-4 text-[0.9375rem] font-semibold text-navy-900 hover:bg-paper-deep"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <DashSection id="sessions" eyebrow="The roadmap" title="Session modules">
          <SessionRoadmap><SessionGrid resources={resources} schedule={schedule} /></SessionRoadmap>
        </DashSection>

        <DashSection id="practice" eyebrow="Build your own playbook" title="Better briefs. Better decisions.">
          <PromptWorkshop />
        </DashSection>

        <DashSection id="friction" eyebrow="Steer the labs" title="Workplace Friction log">
          <FrictionLog entries={friction} schedule={schedule} />
        </DashSection>

        <DashSection id="deliverables" eyebrow="Monthly assets" title="Deliverable submission hub">
          <p className="mb-6 max-w-3xl text-muted">
            Mark each deliverable as you go and attach a link or file when it&rsquo;s ready.
            Sanitize anything sensitive first, per the Safe Harbor pledge.
          </p>
          <DeliverableHub deliverables={deliverables} files={files} accept={ACCEPT_ATTR} />
        </DashSection>

        <DashSection id="capstone" eyebrow="Toward the showcase" title="Capstone tracker">
          <CapstoneTracker doneIds={capstone.map((c) => c.stepId)} schedule={schedule} />
        </DashSection>

        {/* Certificate download */}
        <section
          id="certificate"
          aria-labelledby="certificate-title"
          className="scroll-mt-32 rounded-sm border border-amber/40 bg-amber/5 p-8 sm:p-10"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="label text-amber-deep">Program credential</p>
                {isCertUnlocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="size-3" /> Unlocked & Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2.5 py-0.5 text-xs font-semibold text-amber-deep">
                    <Lock className="size-3" /> Locked ({capstoneDone}/{totalCapstoneSteps} steps)
                  </span>
                )}
              </div>
              <h2
                id="certificate-title"
                className="mt-2 font-display text-3xl text-navy-900 sm:text-4xl"
              >
                Certificate of Completion
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                {isCertUnlocked ? (
                  <>
                    Congratulations! Your official{" "}
                    <a
                      href="https://evobrand.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy-900 underline underline-offset-2 hover:text-amber-deep"
                    >
                      EVOBRAND Concepts
                    </a>{" "}
                    certificate is ready for download — share on LinkedIn or save for your records.
                  </>
                ) : (
                  <>
                    Complete all {totalCapstoneSteps} capstone steps to unlock your official{" "}
                    <a
                      href="https://evobrand.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy-900 underline underline-offset-2 hover:text-amber-deep"
                    >
                      EVOBRAND Concepts
                    </a>{" "}
                    certificate of completion.
                  </>
                )}
              </p>
            </div>
            {isCertUnlocked ? (
              <Link
                href="/certificate"
                id="download-certificate-link"
                className={buttonStyles({ variant: "primary" })}
              >
                <Award className="size-4" />
                View & Download Certificate
              </Link>
            ) : (
              <a
                href="#capstone"
                className={buttonStyles({ variant: "secondary" })}
              >
                <Lock className="size-4" />
                Complete Capstone ({capstoneDone}/{totalCapstoneSteps})
              </a>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-between bg-white p-4 sm:p-5">
      <dt className="label !text-[0.6875rem] text-amber-deep sm:!text-xs">{label}</dt>
      <dd className="mt-3 font-display text-4xl font-light text-navy-900 sm:text-5xl">{value}</dd>
    </div>
  );
}

function DashSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32">
      <p className="label text-amber-deep">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mb-6 mt-2 font-display text-3xl text-navy-900 sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
