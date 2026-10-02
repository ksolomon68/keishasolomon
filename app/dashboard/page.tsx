import { CapstoneTracker } from "@/components/dashboard/capstone-tracker";
import { DeliverableHub, type FileInfo } from "@/components/dashboard/deliverable-hub";
import { FrictionLog } from "@/components/dashboard/friction-log";
import { CoachingLog } from "@/components/dashboard/coaching-log";
import { MarketingToolkit } from "@/components/dashboard/marketing-toolkit";
import { RemoteCoaching } from "@/components/dashboard/remote-coaching";
import { SessionGrid } from "@/components/dashboard/session-grid";
import { NextStep } from "@/components/dashboard/next-step";
import { PromptWorkshop } from "@/components/dashboard/prompt-workshop";
import { ToolLibrary } from "@/components/dashboard/tool-library";
import { DashboardPath } from "@/components/dashboard/dashboard-path";
import { SectionNav } from "@/components/dashboard/section-nav";
import { SupportResources } from "@/components/dashboard/support-resources";
import { SupportCenter, type ParticipantSupportThread } from "@/components/dashboard/support-center";
import { capstoneSteps } from "@/data/cohortData";
import { requireUser } from "@/lib/auth/session";
import { cohortOf, resourcesFor } from "@/lib/cohort";
import { cohortSchedule, withDeliverables } from "@/lib/cohort-schedule";
import { getStore } from "@/lib/store";
import { ACCEPT_ATTR } from "@/lib/uploads";
import Link from "next/link";
import { ArrowRight, Award, Lock, CheckCircle2 } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import React from "react";

const formatBytes = (n: number) =>
  n < 1024 * 1024
    ? `${Math.max(1, Math.round(n / 1024))} KB`
    : `${(n / 1024 / 1024).toFixed(1)} MB`;

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const store = await getStore();
  const [friction, coachingNotes, deliverables, capstone, resources, cohort, supportRequests] = await Promise.all([
    store.listFriction(user.id),
    store.listCoachingNotes(user.id),
    store.listDeliverables(user.id),
    store.listCapstone(user.id),
    resourcesFor(store, user),
    cohortOf(store, user),
    store.listSupportRequests(user.id),
  ]);
  const supportThreads: ParticipantSupportThread[] = await Promise.all(
    supportRequests.map(async (request) => ({ ...request, messages: await store.listSupportMessages(request.id) })),
  );
  const activeSupport = supportThreads.filter((thread) => thread.status !== "resolved").length;
  const instructorReplies = supportThreads.filter((thread) => thread.status === "waiting_on_participant").length;
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
      <DashboardPath />
      <section data-surface="dark" className="grid-backdrop bg-navy-900 pb-8 pt-8 text-white sm:pb-10 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">
            Participant dashboard{cohort ? ` · ${cohort.name}` : ""}
          </p>
          <h1 className="mt-2 font-display text-4xl font-light sm:mt-3 sm:text-5xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] text-on-navy sm:mt-3 sm:text-base">
            Your workspace for the eight-month cohort: prep for the next session, log friction, submit
            deliverables and keep your capstone on track.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NextStep deliverables={deliverables} hasFriction={friction.length > 0} schedule={schedule} />
        <ul aria-label="Your progress" className="mt-3 grid grid-cols-3 gap-px border border-line bg-line sm:hidden">
          <CompactProgressLink href="#deliverables" label="Submitted" value={`${submitted}/${deliverableSessions.length}`} />
          <CompactProgressLink href="#capstone" label="Capstone" value={`${capstoneDone}/${totalCapstoneSteps}`} />
          <CompactProgressLink href="#friction" label="Open tasks" value={String(openFriction)} />
        </ul>
        <ul aria-label="Your progress" className="mt-4 hidden gap-px border border-line bg-line sm:grid sm:grid-cols-3">
          <ProgressTile href="#deliverables" label="Deliverables submitted" value={submitted} total={deliverableSessions.length} />
          <ProgressTile href="#capstone" label="Capstone steps done" value={capstoneDone} total={totalCapstoneSteps} />
          <ProgressTile href="#friction" label="Open friction tasks" value={openFriction} />
        </ul>
      </div>

      <SectionNav
        sections={[
          { id: "deliverables", label: "My work", badge: `${submitted}/${deliverableSessions.length}` },
          { id: "tools", label: "Tools" },
          { id: "progress", label: "Progress" },
          { id: "sessions", label: "Schedule" },
          { id: "support", label: "Help", badge: instructorReplies ? `${instructorReplies} replied` : activeSupport ? `${activeSupport} active` : undefined },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:space-y-14 sm:px-6 sm:py-16 lg:px-8">
        <DashSection
          id="deliverables"
          eyebrow="Start here"
          title="My work & feedback"
          intro="Follow three steps: prepare, use your tool, then save your work or submit it for feedback. Your current assignment is open below."
        >
          <DeliverableHub deliverables={deliverables} files={files} accept={ACCEPT_ATTR} schedule={schedule} />
        </DashSection>

        <DashSection id="tools" eyebrow="Use your workspace" title="Your cohort tools" intro="Open any tool here. When you finish, download your results and use the link back to your session submission.">
          <ToolLibrary />
        </DashSection>

        <DashSection id="progress" eyebrow="Track your learning" title="Your progress" intro="Check milestones or record a workplace problem when you need to. Your current work stays above.">
          <details id="capstone" className="scroll-mt-40 border border-line bg-white p-5">
            <summary className="min-h-11 cursor-pointer font-semibold">Capstone milestones · {capstoneDone}/{totalCapstoneSteps} complete</summary>
            <div className="mt-5"><CapstoneTracker doneIds={capstone.map((c) => c.stepId)} schedule={schedule} /></div>
          </details>
          <details id="friction" className="mt-4 scroll-mt-40 border border-line bg-white p-5">
            <summary className="min-h-11 cursor-pointer font-semibold">Workplace problem log · {openFriction} unresolved</summary>
            <div className="mt-5"><FrictionLog entries={friction} schedule={schedule} /></div>
          </details>
          <CertificateBanner unlocked={isCertUnlocked} done={capstoneDone} total={totalCapstoneSteps} />
        </DashSection>

        <DashSection id="sessions" eyebrow="Plan ahead" title="Session schedule & materials" intro="Dates, agendas, and session resources are here when you need them. Start assignments in My work.">
          <details className="border border-line bg-white p-5">
            <summary className="min-h-11 cursor-pointer font-semibold">View all {schedule.length} sessions and materials</summary>
            <div className="mt-5"><SessionGrid resources={resources} schedule={schedule} /></div>
          </details>
        </DashSection>

        <DashSection
          id="support"
          eyebrow="Use when needed"
          title="Help & resources"
          intro="Open one area when you need coaching, a stronger prompt, or communications support."
        >
          <div className="mb-10">
            <SupportCenter threads={supportThreads} />
          </div>
          <SupportResources
            coaching={
              <div className="space-y-10">
                <RemoteCoaching participantName={user.name} />
                <CoachingLog entries={coachingNotes} />
              </div>
            }
            toolkit={
              <div className="space-y-12">
                <div id="prompt-workshop" className="scroll-mt-40">
                  <h3 className="mb-4 font-display text-2xl text-navy-900">Better briefs. Better decisions.</h3>
                  <PromptWorkshop />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-navy-900">Marketing &amp; communications starters</h3>
                  <p className="mb-5 mt-2 max-w-3xl text-muted">Adapt these to your voice, audience, and real results. Replace bracketed prompts with specifics before publishing.</p>
                  <MarketingToolkit />
                </div>
              </div>
            }
          />
        </DashSection>
      </div>
    </>
  );
}

function ProgressTile({ href, label, value, total }: { href: string; label: string; value: number; total?: number }) {
  return (
    <li className="bg-white">
      <a href={href} className="group flex h-full flex-col gap-2 p-4 hover:bg-paper sm:p-5">
        <span className="label flex items-center justify-between gap-2 !text-[0.6875rem] text-amber-deep sm:!text-xs">
          {label}
          <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </span>
        <span className="font-display text-3xl font-light text-navy-900">
          {value}
          {total !== undefined && <span className="text-xl text-muted">/{total}</span>}
        </span>
        {total !== undefined && (
          <progress
            className="h-1.5 w-full overflow-hidden [&::-moz-progress-bar]:bg-navy-900 [&::-webkit-progress-bar]:bg-line [&::-webkit-progress-value]:bg-navy-900"
            value={value}
            max={total}
            aria-label={label}
          />
        )}
      </a>
    </li>
  );
}

function CompactProgressLink({ href, label, value }: { href: string; label: string; value: string }) {
  return (
    <li className="min-w-0 bg-white">
      <a href={href} className="flex min-h-20 flex-col justify-center px-3 py-2 hover:bg-paper">
        <span className="font-display text-2xl leading-none text-navy-900">{value}</span>
        <span className="mt-1 truncate text-xs font-semibold text-muted">{label}</span>
      </a>
    </li>
  );
}

function CertificateBanner({ unlocked, done, total }: { unlocked: boolean; done: number; total: number }) {
  const remaining = total - done;
  return (
    <div
      id="certificate"
      className="mt-8 flex flex-col items-start gap-5 border border-amber/40 bg-amber/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="label text-amber-deep">Program credential</p>
          {unlocked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="size-3" aria-hidden="true" /> Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2.5 py-0.5 text-xs font-semibold text-amber-deep">
              <Lock className="size-3" aria-hidden="true" /> {remaining} {remaining === 1 ? "step" : "steps"} to go
            </span>
          )}
        </div>
        <h3 className="mt-2 font-display text-2xl text-navy-900">Certificate of Completion</h3>
        <p className="mt-1 max-w-lg text-sm text-muted">
          {unlocked
            ? "Your official EVOBRAND Concepts certificate is ready. Share it on LinkedIn or save it for your records."
            : `Complete all ${total} capstone steps above to unlock your official EVOBRAND Concepts certificate.`}
        </p>
      </div>
      {unlocked && (
        <Link href="/certificate" id="download-certificate-link" className={buttonStyles({ variant: "primary" })}>
          <Award className="size-4" aria-hidden="true" />
          View &amp; download
        </Link>
      )}
    </div>
  );
}

function DashSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-10">
      <p className="label text-amber-deep">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl text-navy-900 sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-3xl text-muted">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
