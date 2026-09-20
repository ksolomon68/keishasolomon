import { CapstoneTracker } from "@/components/dashboard/capstone-tracker";
import { NextSessionSummary } from "@/components/dashboard/countdown";
import { DeliverableHub, type FileInfo } from "@/components/dashboard/deliverable-hub";
import { FrictionLog } from "@/components/dashboard/friction-log";
import { SessionGrid } from "@/components/dashboard/session-grid";
import { capstoneSteps, deliverableSessions, sessions } from "@/data/cohortData";
import { requireUser } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { ACCEPT_ATTR } from "@/lib/uploads";

const sections = [
  { id: "sessions", label: "Sessions" },
  { id: "friction", label: "Friction log" },
  { id: "deliverables", label: "Deliverables" },
  { id: "capstone", label: "Capstone" },
];

const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const store = await getStore();
  const [friction, deliverables, capstone, resources] = await Promise.all([
    store.listFriction(user.id),
    store.listDeliverables(user.id),
    store.listCapstone(user.id),
    store.listResources(),
  ]);

  const files: Record<string, FileInfo> = {};
  await Promise.all(
    deliverables.map(async (d) => {
      const file = d.fileId ? await store.getFile(d.fileId) : null;
      if (file) files[file.id] = { name: file.originalName, sizeLabel: formatBytes(file.size) };
    }),
  );

  const submitted = deliverables.filter((d) => d.status === "submitted" || d.status === "reviewed").length;
  const capstoneDone = capstone.filter((c) => capstoneSteps.some((s) => s.id === c.stepId)).length;
  const openFriction = friction.filter((f) => !f.done).length;
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 pb-10 pt-12 text-white sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">Participant dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">Welcome back, {firstName}.</h1>
          <p className="mt-3 max-w-2xl text-on-navy">
            Your workspace for the eight-month cohort: prep for the next session, log friction, submit deliverables and
            keep your capstone on track.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="-mt-6 grid grid-cols-3 gap-px border border-navy-900 bg-navy-900 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-3 bg-white p-5 lg:col-span-1">
            <dt className="label mb-3 text-amber-deep">Next session</dt>
            <dd>
              <NextSessionSummary
                sessions={sessions.map(({ id, number, date, dateLabel, theme }) => ({ id, number, date, dateLabel, theme }))}
              />
            </dd>
          </div>
          <Stat label="Deliverables submitted" value={`${submitted}/${deliverableSessions.length}`} />
          <Stat label="Capstone steps done" value={`${capstoneDone}/${capstoneSteps.length}`} />
          <Stat label="Open friction tasks" value={String(openFriction)} />
        </dl>
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
          <SessionGrid resources={resources} />
        </DashSection>

        <DashSection id="friction" eyebrow="Steer the labs" title="Workplace Friction log">
          <FrictionLog entries={friction} />
        </DashSection>

        <DashSection id="deliverables" eyebrow="Monthly assets" title="Deliverable submission hub">
          <p className="mb-6 max-w-3xl text-muted">
            Mark each deliverable as you go and attach a link or file when it&rsquo;s ready. Sanitize anything sensitive
            first, per the Safe Harbor pledge.
          </p>
          <DeliverableHub deliverables={deliverables} files={files} accept={ACCEPT_ATTR} />
        </DashSection>

        <DashSection id="capstone" eyebrow="Toward the showcase" title="Capstone tracker">
          <CapstoneTracker doneIds={capstone.map((c) => c.stepId)} />
        </DashSection>
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
