import Link from "next/link";
import { BookOpen } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { CohortSettings, NewCohortForm } from "@/components/admin/cohort-manager";
import { CohortSwitcher } from "@/components/admin/cohort-switcher";
import { Roster, type RosterEntry } from "@/components/admin/roster";
import { ResourceManager } from "@/components/admin/resource-manager";
import { FrictionReview } from "@/components/admin/friction-review";
import { capstoneSteps, site } from "@/data/cohortData";
import { requireAdmin } from "@/lib/auth/session";
import { cohortSchedule } from "@/lib/cohort-schedule";
import { getStore, type Cohort } from "@/lib/store";
import { ACCEPT_ATTR } from "@/lib/uploads";

const inviteHref = (cohort: Cohort) => {
  const subject = `Welcome to ${site.name}: ${cohort.name}`;
  const body =
    `Hi everyone,\r\n\r\nWelcome to ${site.name}!\r\n\r\n` +
    `Please register for your account here:\r\n${site.url}/register\r\n\r\nAccess code: ${cohort.accessCode}\r\n`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ cohort?: string | string[] }> }) {
  await requireAdmin("/admin");
  const store = await getStore();
  const [cohorts, users] = await Promise.all([store.listCohorts(), store.listUsers()]);

  // The URL picks the cohort; otherwise the newest open one, so a fresh cohort is what you land on.
  const requested = (await searchParams).cohort;
  const selected =
    cohorts.find((c) => c.id === requested) ?? cohorts.find((c) => !c.archived) ?? cohorts[0] ?? null;

  if (!selected) {
    return (
      <>
        <Hero eyebrow="Instructor view" title="Set up your first cohort" />
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="max-w-2xl text-muted">
            Every participant joins through a cohort. Create one, share its access code, and the roster, resources and
            certificate dates for that group stay separate from every other cohort you run.
          </p>
          <NewCohortForm firstCohort />
        </div>
      </>
    );
  }

  const participants = users.filter((u) => u.role === "participant" && u.cohortId === selected.id);
  const ids = new Set(participants.map((u) => u.id));
  const counts: Record<string, number> = {};
  for (const u of users) if (u.role === "participant" && u.cohortId) counts[u.cohortId] = (counts[u.cohortId] ?? 0) + 1;

  const [allAttendance, allDeliverables, allCapstone, resources] = await Promise.all([
    store.listAttendance(),
    store.listDeliverables(),
    store.listCapstone(),
    store.listResources(selected.id),
  ]);
  const attendance = allAttendance.filter((a) => ids.has(a.userId));
  const deliverables = allDeliverables.filter((d) => ids.has(d.userId));
  const capstone = allCapstone.filter((c) => ids.has(c.userId));

  const schedule = cohortSchedule(selected.sessionDates);
  const deliverableCount = schedule.filter((s) => s.deliverable).length;
  const stepIds = new Set(capstoneSteps.map((s) => s.id));
  const entries: RosterEntry[] = participants.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    organization: u.organization,
    attended: attendance.filter((a) => a.userId === u.id).map((a) => a.sessionId),
    deliverables: deliverables
      .filter((d) => d.userId === u.id)
      .map((d) => ({ sessionId: d.sessionId, status: d.status, linkUrl: d.linkUrl, fileId: d.fileId, notes: d.notes,
        version: d.version, revision: d.revision, feedback: d.feedback, feedbackRevision: d.feedbackRevision })),
    capstoneDone: capstone.filter((c) => c.userId === u.id && stepIds.has(c.stepId)).length,
    capstoneTotal: capstoneSteps.length,
  }));

  const n = entries.length;
  const friction = (await Promise.all(participants.map(async (u) =>
    (await store.listFriction(u.id)).map((entry) => ({ ...entry, participant: u.name })),
  ))).flat();
  const avg = (total: number, denominator: number) => (n && denominator ? Math.round((total / (n * denominator)) * 100) : 0);
  const submittedTotal = entries.reduce(
    (sum, e) => sum + e.deliverables.filter((d) => d.status === "submitted" || d.status === "reviewed").length,
    0,
  );
  const toReview = entries.reduce((sum, e) => sum + e.deliverables.filter((d) => d.status === "submitted").length, 0);

  const stats = [
    { label: "Participants", value: String(n) },
    { label: "Avg. attendance", value: `${avg(entries.reduce((s, e) => s + e.attended.length, 0), schedule.length)}%` },
    { label: "Deliverables in", value: `${avg(submittedTotal, deliverableCount)}%` },
    { label: "Awaiting review", value: String(toReview) },
  ];

  return (
    <>
      <Hero eyebrow={`Instructor view · ${selected.name}`} title="Cohort command center">
        <Link href={`/admin/guide?cohort=${selected.id}`} className={`${buttonStyles({ variant: "primary" })} mt-6`}>
          <BookOpen className="size-4" aria-hidden="true" />
          Instructor guide (printable booklet)
        </Link>
        <dl className="mt-8 grid grid-cols-2 gap-px border border-white/20 bg-white/20 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end bg-navy-950 p-5">
              <dt className="text-sm text-on-navy">{s.label}</dt>
              <dd className="font-display text-4xl font-light text-amber">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Hero>

      <CohortSwitcher cohorts={cohorts} selectedId={selected.id} counts={counts} />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <section aria-labelledby="settings-title">
          <p className="label text-amber-deep">This cohort</p>
          <h2 id="settings-title" className="mb-6 mt-2 font-display text-3xl text-navy-900 sm:text-4xl">
            Cohort settings
          </h2>
          <CohortSettings
            key={`${selected.id}:${selected.accessCode}:${selected.archived}`}
            cohort={selected}
            schedule={schedule}
            participantCount={n}
            inviteHref={inviteHref(selected)}
          />
          <details className="mt-8 border border-line bg-paper-deep p-4 sm:p-5">
            <summary className="min-h-11 cursor-pointer font-semibold text-navy-900">
              Run another program: create a new cohort
            </summary>
            <div className="mt-4">
              <NewCohortForm />
            </div>
          </details>
        </section>

        <section aria-labelledby="lab-needs-title">
          <p className="label text-amber-deep">Plan the next build lab</p>
          <h2 id="lab-needs-title" className="mb-3 mt-2 font-display text-3xl sm:text-4xl">What the cohort needs help with</h2>
          <p className="mb-6 max-w-3xl text-muted">Use participants&rsquo; workplace problems to choose examples, pair exercises, and follow-up support. Do not share their private entries with the group.</p>
          <FrictionReview entries={friction} schedule={schedule} />
        </section>
        <section aria-labelledby="roster-title">
          <h2 id="roster-title" className="mb-6 font-display text-3xl text-navy-900 sm:text-4xl">
            Cohort roster
          </h2>
          <Roster entries={entries} schedule={schedule} />
        </section>

        <section aria-labelledby="resources-title">
          <h2 id="resources-title" className="mb-2 font-display text-3xl text-navy-900 sm:text-4xl">
            Resource manager
          </h2>
          <p className="mb-6 max-w-3xl text-muted">
            Prompt sheets, slide decks and templates published here appear on the session cards of{" "}
            {selected.name} only, unless you share them with every cohort.
          </p>
          <ResourceManager
            resources={resources}
            accept={ACCEPT_ATTR}
            cohortId={selected.id}
            cohortName={selected.name}
            schedule={schedule}
          />
        </section>
      </div>
    </>
  );
}

function Hero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section data-surface="dark" className="grid-backdrop bg-navy-900 py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="label text-amber">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}
