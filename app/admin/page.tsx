import { Roster, type RosterEntry } from "@/components/admin/roster";
import { ResourceManager } from "@/components/admin/resource-manager";
import { capstoneSteps, deliverableSessions, sessions } from "@/data/cohortData";
import { requireAdmin } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { ACCEPT_ATTR } from "@/lib/uploads";
import { buttonStyles } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default async function AdminPage() {
  await requireAdmin("/admin");
  const store = await getStore();
  const [users, attendance, deliverables, capstone, resources] = await Promise.all([
    store.listUsers(),
    store.listAttendance(),
    store.listDeliverables(),
    store.listCapstone(),
    store.listResources(),
  ]);

  const stepIds = new Set(capstoneSteps.map((s) => s.id));
  const entries: RosterEntry[] = users
    .filter((u) => u.role === "participant")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      organization: u.organization,
      attended: attendance.filter((a) => a.userId === u.id).map((a) => a.sessionId),
      deliverables: deliverables
        .filter((d) => d.userId === u.id)
        .map((d) => ({ sessionId: d.sessionId, status: d.status, linkUrl: d.linkUrl, fileId: d.fileId, notes: d.notes })),
      capstoneDone: capstone.filter((c) => c.userId === u.id && stepIds.has(c.stepId)).length,
      capstoneTotal: capstoneSteps.length,
    }));

  const n = entries.length;
  const avg = (total: number, denominator: number) => (n && denominator ? Math.round((total / (n * denominator)) * 100) : 0);
  const submittedTotal = entries.reduce(
    (sum, e) => sum + e.deliverables.filter((d) => d.status === "submitted" || d.status === "reviewed").length,
    0,
  );
  const toReview = entries.reduce((sum, e) => sum + e.deliverables.filter((d) => d.status === "submitted").length, 0);

  const stats = [
    { label: "Participants", value: String(n) },
    { label: "Avg. attendance", value: `${avg(entries.reduce((s, e) => s + e.attended.length, 0), sessions.length)}%` },
    { label: "Deliverables in", value: `${avg(submittedTotal, deliverableSessions.length)}%` },
    { label: "Awaiting review", value: String(toReview) },
  ];

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">Instructor view</p>
          <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">Cohort command center</h1>
          <dl className="mt-8 grid grid-cols-2 gap-px border border-white/20 bg-white/20 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end bg-navy-950 p-5">
                <dt className="text-sm text-on-navy">{s.label}</dt>
                <dd className="font-display text-4xl font-light text-amber">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <section aria-labelledby="roster-title">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="roster-title" className="font-display text-3xl text-navy-900 sm:text-4xl">
              Cohort roster
            </h2>
            <a
              href={`mailto:?subject=Welcome to the AI Executive Sandbox!&body=Hi everyone,%0D%0A%0D%0AWelcome to the AI Executive Sandbox!%0D%0A%0D%0APlease register for your account here:%0D%0Ahttps://keishasolomon.com/register%0D%0A%0D%0AAccess Code: ${process.env.COHORT_ACCESS_CODE || 'cohort-2026'}`}
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              <Mail className="size-4" />
              Email Invite
            </a>
          </div>
          <Roster entries={entries} />
        </section>

        <section aria-labelledby="resources-title">
          <h2 id="resources-title" className="mb-2 font-display text-3xl text-navy-900 sm:text-4xl">
            Resource manager
          </h2>
          <p className="mb-6 max-w-3xl text-muted">
            Prompt sheets, slide decks and templates published here appear on each participant&rsquo;s session card.
          </p>
          <ResourceManager resources={resources} accept={ACCEPT_ATTR} />
        </section>
      </div>
    </>
  );
}
