import Image from "next/image";
import type { ReactNode } from "react";
import {
  capstoneSteps,
  cohortStats,
  focusAreas,
  instructor,
  onboardingChecklist,
  safeHarbor,
  site,
  valueMatrix,
  type Session,
} from "@/data/cohortData";
import { decisionPractice } from "@/data/cohort-practice";
import {
  afterSession,
  beforeSession,
  blockPlaybook,
  facilitationPrinciples,
  feedbackProtocol,
  sessionFacilitation,
  showcaseFacilitation,
} from "@/data/instructor-guide";
import { learningGuides } from "@/data/learning-guides";
import { withDeliverables } from "@/lib/cohort-schedule";
import type { Cohort } from "@/lib/store";

/** The 60-minute demo block holds five-minute demos with a one-minute changeover. */
const DEMO_BLOCK_MINUTES = 60;
const DEMO_SLOT_MINUTES = 6;
const LAB_SPLIT = [10, 15, 10] as const;

interface GuideProps {
  cohort: Cohort | null;
  schedule: Session[];
  participantCount: number;
  /** Participants who have ticked every capstone step. */
  capstoneComplete: number;
}

export function InstructorGuide({ cohort, schedule, participantCount, capstoneComplete }: GuideProps) {
  const deliverables = withDeliverables(schedule);
  return (
    <div className="guide">
      <Cover cohort={cohort} schedule={schedule} />
      <Contents schedule={schedule} />
      <HowToUse cohort={cohort} schedule={schedule} participantCount={participantCount} />
      <RunOfShow schedule={schedule} />
      <FeedbackChapter />
      {schedule.slice(0, 7).map((session, i) => (
        <SessionChapter key={session.id} session={session} next={schedule[i + 1]} />
      ))}
      <ShowcaseChapter
        session={schedule[7]}
        participantCount={participantCount}
        capstoneComplete={capstoneComplete}
      />
      <Appendix schedule={schedule} deliverables={deliverables} />
      <GuideStyles />
    </div>
  );
}

/* ---------- Building blocks ---------- */

function Sheet({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`guide-sheet ${className}`}>
      {children}
    </section>
  );
}

function H2({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="guide-heading mt-8 first:mt-0">
      {eyebrow && <p className="label text-amber-deep">{eyebrow}</p>}
      <h2 className="mt-1 border-b-2 border-navy-900 pb-1.5 font-display text-2xl text-navy-900">{children}</h2>
    </div>
  );
}

function Checklist({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="guide-avoid flex gap-3 text-[0.9375rem] leading-snug">
          <span aria-hidden="true" className="mt-[0.3rem] inline-block size-3.5 shrink-0 border-[1.5px] border-navy-900" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-snug marker:text-amber-deep">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="guide-avoid mt-4 border-l-4 border-amber-deep bg-paper px-4 py-3">
      <p className="label text-amber-deep">{label}</p>
      <div className="mt-1 text-[0.9375rem] leading-snug text-ink">{children}</div>
    </aside>
  );
}

function Notes({ label = "Notes" }: { label?: string }) {
  return (
    <div className="guide-avoid mt-6">
      <p className="label text-muted">{label}</p>
      <div className="mt-2 space-y-5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-b border-line" />
        ))}
      </div>
    </div>
  );
}

const dateRange = (schedule: Session[]) => {
  const dated = schedule.filter((s) => s.date);
  return dated.length ? `${dated[0].dateLabel} to ${dated[dated.length - 1].dateLabel}` : "Dates to be announced";
};

/* ---------- Front matter ---------- */

function Cover({ cohort, schedule }: { cohort: Cohort | null; schedule: Session[] }) {
  return (
    <Sheet className="guide-cover !bg-navy-900 text-white">
      <div data-surface="dark" className="grid-backdrop flex min-h-[9.4in] flex-col justify-between p-10 sm:p-14">
        <div className="flex items-center gap-4">
          <Image src="/favicon-source.png" alt="" width={56} height={56} className="size-14" priority />
          <p className="label text-on-navy">
            <a
              href={instructor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber hover:underline"
            >
              {instructor.company}
            </a>
          </p>
        </div>
        <div>
          <p className="label text-amber">Instructor guide</p>
          <h1 className="mt-4 font-display text-5xl font-light leading-[1.05] sm:text-6xl">{site.name}</h1>
          <p className="mt-4 text-xl text-on-navy">{site.tagline}</p>
          <div className="mt-10 h-px w-40 bg-amber" aria-hidden="true" />
          <p className="mt-6 font-display text-2xl">A facilitation booklet for eight sessions</p>
          <p className="mt-2 max-w-xl text-on-navy">
            How to run each 90-minute session, what to watch for in the room, and how to review the work that comes
            out of it.
          </p>
        </div>
        <dl className="grid gap-4 border-t border-white/20 pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="label text-amber">Cohort</dt>
            <dd className="mt-1 text-base">{cohort?.name ?? "Program default"}</dd>
          </div>
          <div>
            <dt className="label text-amber">Calendar</dt>
            <dd className="mt-1 text-base">{dateRange(schedule)}</dd>
          </div>
          <div>
            <dt className="label text-amber">Lead instructor</dt>
            <dd className="mt-1 text-base">{instructor.name}</dd>
          </div>
        </dl>
      </div>
    </Sheet>
  );
}

function Contents({ schedule }: { schedule: Session[] }) {
  const front = [
    { href: "#how-to-use", label: "How to use this guide" },
    { href: "#run-of-show", label: "The 90-minute run of show" },
    { href: "#feedback", label: "Reviewing work and giving feedback" },
  ];
  return (
    <Sheet>
      <H2 eyebrow="Contents">What&rsquo;s inside</H2>
      <ol className="mt-4 divide-y divide-line border-y border-line">
        {front.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="flex min-h-11 items-center py-2 text-navy-900 hover:underline">
              {item.label}
            </a>
          </li>
        ))}
        {schedule.map((s) => (
          <li key={s.id}>
            <a href={`#session-${s.id}`} className="flex min-h-11 items-baseline gap-4 py-2 text-navy-900 hover:underline">
              <span className="label w-24 shrink-0 text-amber-deep">Session {s.number}</span>
              <span className="flex-1">{s.theme}</span>
              <span className="label shrink-0 text-muted">{s.shortDate}</span>
            </a>
          </li>
        ))}
        <li>
          <a href="#appendix" className="flex min-h-11 items-center py-2 text-navy-900 hover:underline">
            Appendix: capstone path and review criteria at a glance
          </a>
        </li>
      </ol>
      <Callout label="Suggestions, not scripts">
        The timings, prompts and warnings here are starting points built from each session&rsquo;s own hook, lab and
        review criteria. Adapt them to the room. Where this guide says something must happen (approval, invented
        data, human review), that comes straight from the program&rsquo;s Safe Harbor commitments.
      </Callout>
    </Sheet>
  );
}

function HowToUse({
  cohort,
  schedule,
  participantCount,
}: {
  cohort: Cohort | null;
  schedule: Session[];
  participantCount: number;
}) {
  return (
    <Sheet id="how-to-use">
      <H2 eyebrow="Start here">How to use this guide</H2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        Read the run of show and feedback chapters once. Then, before each session, read that session&rsquo;s chapter:
        prep, run of show, coaching notes and review criteria fit on two pages you can print and carry.
        {cohort ? ` This copy uses ${cohort.name}'s calendar and headcount.` : ""}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="guide-table w-full text-left text-sm">
          <caption className="sr-only">The eight sessions at a glance</caption>
          <thead>
            <tr>
              <th scope="col">Session</th>
              <th scope="col">Date</th>
              <th scope="col">Hook</th>
              <th scope="col">Build lab</th>
              <th scope="col">Deliverable</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((s) => (
              <tr key={s.id}>
                <th scope="row">{s.number}</th>
                <td className="whitespace-nowrap">{s.shortDate}</td>
                <td>{s.hook.name}</td>
                <td>{s.lab.name}</td>
                <td>{s.deliverable?.title ?? "Live showcase"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-muted">
        {cohortStats[0].value} sessions of {cohortStats[1].value} minutes, {cohortStats[2].value} working assets, one
        showcase. Focus areas: {focusAreas.join(", ")}.
        {participantCount ? ` Registered participants: ${participantCount}.` : ""}
      </p>

      <H2>Four principles</H2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {facilitationPrinciples.map((p) => (
          <div key={p.title} className="guide-avoid border border-line p-4">
            <p className="font-semibold text-navy-900">{p.title}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{p.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        The program promises participants: {valueMatrix.pillars.map((p) => p.title.toLowerCase()).join("; ")}.
      </p>

      <H2>Room and technology</H2>
      <Checklist
        items={onboardingChecklist.map((item) => (
          <>
            <strong>{item.title}.</strong> {item.detail}
          </>
        ))}
      />
      <Checklist items={["A projector or shared screen, and a visible timer.", "Reliable wifi for every laptop in the room."]} />

      <H2>Safe Harbor in the room</H2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{safeHarbor.intro}</p>
      <Bullets items={safeHarbor.commitments.map((c) => (<><strong>{c.title}.</strong> {c.body}</>))} />
      <Callout label="If someone pastes real data">
        Pause the exercise, thank them for catching it, and switch to an invented example. Treat it as a teaching
        moment for everyone, not a mistake to single out.
      </Callout>
    </Sheet>
  );
}

function RunOfShow({ schedule }: { schedule: Session[] }) {
  const agenda = schedule[0].agenda;
  return (
    <Sheet id="run-of-show">
      <H2 eyebrow="Opening day">Session 1: the 90-minute run of show</H2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        Session 1 opens with the welcome and readiness baseline. Starting with Session 2, that first ten-minute block
        becomes the Brag Board so participants can share wins and troubleshooting from work completed between sessions.
      </p>
      <ol className="mt-4 space-y-4">
        {agenda.map((block) => {
          const play = blockPlaybook[block.title];
          return (
            <li key={block.title} className="guide-avoid grid gap-x-5 gap-y-1 border border-line p-4 sm:grid-cols-[6.5rem_1fr]">
              <div>
                <p className="label text-amber-deep">
                  {block.start}–{block.end}
                </p>
                <p className="label mt-1 text-muted">{block.minutes} min</p>
              </div>
              <div>
                <p className="font-display text-lg leading-snug text-navy-900">{block.title}</p>
                <p className="mt-1 text-sm text-muted">{block.detail}</p>
                {play && (
                  <>
                    <p className="mt-2 text-[0.9375rem] leading-snug">
                      <strong>Your move:</strong> {play.move}
                    </p>
                    <p className="mt-1 text-[0.9375rem] leading-snug text-muted">
                      <strong className="text-ink">Watch for:</strong> {play.watch}
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <Callout label="Time cues">
        Use the clock to protect the build lab. If the welcome or concept block runs long, shorten the framework, not
        the lab or peer review. From Session 2 onward, apply the same rule to the Brag Board.
      </Callout>
      <H2>Before every session</H2>
      <Checklist items={beforeSession} />
      <H2>After every session</H2>
      <Checklist items={afterSession} />
    </Sheet>
  );
}

function FeedbackChapter() {
  return (
    <Sheet id="feedback">
      <H2 eyebrow="Instructor view">Reviewing work and giving feedback</H2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        Participants submit a link or a file for each deliverable. You review it in the instructor view against the
        session&rsquo;s criteria (printed in each chapter and again in the appendix).
      </p>
      <H2>The feedback formula</H2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-snug marker:font-semibold marker:text-amber-deep">
        {feedbackProtocol.formula.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ol>
      <H2>Two decisions</H2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {feedbackProtocol.decisions.map((d) => (
          <div key={d.label} className="guide-avoid border border-line p-4">
            <p className="font-semibold text-navy-900">{d.label}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{d.when}</p>
          </div>
        ))}
      </div>
      <H2>How the platform behaves</H2>
      <Bullets items={feedbackProtocol.rules} />
      <Callout label="Example of useful feedback">
        “Your baseline is clear and the missing-owner rule is a strong idea. The output still invents a deadline in the
        second test: add ‘mark missing deadlines as not specified’ to the playbook and rerun that case this week.”
      </Callout>
      <Notes label="Feedback phrases I want to reuse" />
    </Sheet>
  );
}

/* ---------- Session chapter ---------- */

function SessionChapter({ session, next }: { session: Session; next?: Session }) {
  const fac = sessionFacilitation[session.id];
  const guide = learningGuides[session.id];
  const practice = decisionPractice[session.id];
  const dueSteps = capstoneSteps.filter((s) => s.bySessionId === session.id);
  const nextDue = next ? capstoneSteps.filter((s) => s.bySessionId === next.id) : [];
  if (!fac || !guide) return null;
  const wrongTurns = practice?.choices.filter((c) => !c.recommended) ?? [];
  const recommended = practice?.choices.find((c) => c.recommended);

  return (
    <article id={`session-${session.id}`} className="guide-chapter">
      <Sheet>
        <p className="label text-amber-deep">
          Session {session.number} · {session.dateLabel} · {session.focus}
        </p>
        <h2 className="mt-2 font-display text-4xl font-light leading-tight text-navy-900">{session.theme}</h2>

        <dl className="mt-5 grid gap-px border border-navy-900 bg-navy-900 text-sm sm:grid-cols-3">
          {[
            ["Hook", session.hook.name, session.hook.description],
            ["Build lab", session.lab.name, session.lab.description],
            ["Deliverable", session.deliverable?.title ?? "", session.deliverable?.description ?? ""],
          ].map(([label, title, body]) => (
            <div key={label} className="bg-white p-3">
              <dt className="label text-amber-deep">{label}</dt>
              <dd className="mt-1 font-semibold text-navy-900">{title}</dd>
              <dd className="mt-1 text-[0.8125rem] leading-snug text-muted">{body}</dd>
            </div>
          ))}
        </dl>

        <Callout label="Leave them believing">{fac.keyMessage}</Callout>

        <H2>Prepare</H2>
        <Checklist items={fac.prep} />

        <H2>What participants will learn</H2>
        <Bullets items={session.concepts} />

        <H2 eyebrow="90 minutes">Run of show</H2>
        <div className="mt-3 space-y-3">
          {session.agenda.map((block, i) => (
            <div key={block.title} className="guide-avoid grid gap-x-4 border-t border-line pt-3 sm:grid-cols-[5.5rem_1fr]">
              <p className="label pt-0.5 text-amber-deep">
                {block.start}–{block.end}
              </p>
              <div className="text-[0.9375rem] leading-snug">
                <p className="font-semibold text-navy-900">{block.title}</p>
                {i === 0 && (
                  <p className="mt-1 text-muted">
                    Ask about last month&rsquo;s deliverable and what people measured. Follow up with anyone who
                    didn&rsquo;t submit.
                  </p>
                )}
                {i === 1 && (
                  <>
                    <p className="mt-1 text-muted">Run the hook (about ten minutes), then the framework.</p>
                    <ol className="mt-1 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-amber-deep">
                      {fac.runHook.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}
                {i === 2 && (
                  <>
                    <p className="mt-1 text-muted">
                      <strong className="text-ink">{session.lab.name}.</strong> {session.lab.description}
                    </p>
                    <ol className="mt-1 space-y-1 pl-0">
                      {guide.steps.map((step, n) => (
                        <li key={step} className="flex gap-2">
                          <span className="label mt-0.5 w-14 shrink-0 text-amber-deep">~{LAB_SPLIT[n]} min</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
                {i === 3 && (
                  <>
                    <p className="mt-1 text-muted">Pairs swap laptops and try to break the work. Suggested challenges:</p>
                    <Bullets items={fac.stressTest} />
                  </>
                )}
                {i === 4 && (
                  <p className="mt-1 text-muted">
                    Submit <strong className="text-ink">{session.deliverable?.title}</strong> in the deliverable hub
                    {dueSteps.length ? (
                      <>
                        ; capstone {dueSteps.length === 1 ? "step" : "steps"} due by this session:{" "}
                        {dueSteps.map((s) => s.title).join("; ")}
                      </>
                    ) : null}
                    .
                    {next && guide && learningGuides[next.id] ? ` To prepare for Session ${next.number}: ${learningGuides[next.id].prepare}` : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Sheet>

      <Sheet>
        <H2 eyebrow="During the lab">Coach for these</H2>
        <Bullets items={fac.coach} />

        {practice && (
          <>
            <H2 eyebrow="Discussion case">{practice.title}</H2>
            <p className="mt-3 text-[0.9375rem] leading-snug">{practice.situation}</p>
            {wrongTurns.length > 0 && (
              <>
                <p className="label mt-3 text-muted">Tempting wrong turns</p>
                <ul className="mt-2 space-y-2">
                  {wrongTurns.map((c) => (
                    <li key={c.label} className="guide-avoid text-[0.9375rem] leading-snug">
                      <strong>“{c.label}”</strong> <span className="text-muted">{c.feedback}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {recommended && (
              <p className="mt-3 text-[0.9375rem] leading-snug">
                <strong>Stronger move:</strong> {recommended.label}{" "}
                <span className="text-muted">{recommended.feedback}</span>
              </p>
            )}
            <Callout label="Takeaway">{practice.takeaway}</Callout>
          </>
        )}

        <H2 eyebrow="When reviewing">Criteria: work that meets this session</H2>
        <Checklist items={guide.criteria} />

        <H2>What good looks like</H2>
        <p className="mt-3 text-[0.9375rem] italic leading-snug text-muted">{guide.example}</p>

        {nextDue.length > 0 && next && (
          <Callout label={`Capstone due by Session ${next.number}`}>
            {nextDue.map((s) => `${s.title}: ${s.detail}`).join(" ")}
          </Callout>
        )}

        <p className="guide-avoid mt-6 text-sm text-muted">
          <strong className="text-ink">After the session:</strong> follow the after-every-session checklist in the run
          of show chapter (attendance, feedback, follow-ups).
        </p>
        <Notes label={`Session ${session.number} notes: wins to share, who needs follow-up`} />
      </Sheet>
    </article>
  );
}

/* ---------- Showcase ---------- */

function ShowcaseChapter({
  session,
  participantCount,
  capstoneComplete,
}: {
  session: Session;
  participantCount: number;
  capstoneComplete: number;
}) {
  const slotsNeeded = participantCount * DEMO_SLOT_MINUTES;
  const overflow = slotsNeeded > DEMO_BLOCK_MINUTES;
  const maxDemos = Math.floor(DEMO_BLOCK_MINUTES / DEMO_SLOT_MINUTES);
  const f = showcaseFacilitation;
  return (
    <article id={`session-${session.id}`} className="guide-chapter">
      <Sheet>
        <p className="label text-amber-deep">
          Session {session.number} · {session.dateLabel} · {session.focus}
        </p>
        <h2 className="mt-2 font-display text-4xl font-light leading-tight text-navy-900">{session.theme}</h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          The final session has no build lab and no deliverable. It is a showcase: each participant demonstrates
          their working capstone, the cohort gives peer feedback, and the group graduates together.
        </p>

        <H2>Your numbers</H2>
        <dl className="mt-3 grid gap-px border border-navy-900 bg-navy-900 text-sm sm:grid-cols-3">
          <div className="bg-white p-3">
            <dt className="label text-amber-deep">Participants</dt>
            <dd className="mt-1 font-display text-3xl text-navy-900">{participantCount}</dd>
          </div>
          <div className="bg-white p-3">
            <dt className="label text-amber-deep">Demo time needed</dt>
            <dd className="mt-1 font-display text-3xl text-navy-900">{participantCount ? `${slotsNeeded} min` : "n/a"}</dd>
            <dd className="text-[0.8125rem] text-muted">
              {DEMO_SLOT_MINUTES} min each (5-minute demo plus a 1-minute changeover)
            </dd>
          </div>
          <div className="bg-white p-3">
            <dt className="label text-amber-deep">Capstone complete</dt>
            <dd className="mt-1 font-display text-3xl text-navy-900">
              {participantCount ? `${capstoneComplete}/${participantCount}` : "n/a"}
            </dd>
            <dd className="text-[0.8125rem] text-muted">Every step ticked, so the certificate is unlocked</dd>
          </div>
        </dl>
        {participantCount === 0 ? (
          <Callout label="Timing">
            The standard 60-minute demo block fits {maxDemos} demos (a 5-minute demo plus a 1-minute changeover each).
            If your cohort is larger, add time, run two rooms in parallel, or shorten each slot, and decide a week ahead.
          </Callout>
        ) : overflow ? (
          <Callout label="Plan for overflow">
            The standard 60-minute demo block fits {maxDemos} demos. With {participantCount} participants you will need to
            add time, run two rooms in parallel, or hold some demos to a shorter slot. Decide this at least a week
            ahead and tell participants.
          </Callout>
        ) : (
          <Callout label="Timing">
            All {participantCount} demos fit in the standard 60-minute block with{" "}
            {DEMO_BLOCK_MINUTES - slotsNeeded} minutes spare. Use the spare time for questions, never to loosen the
            timer.
          </Callout>
        )}

        <H2>Prepare</H2>
        <Checklist items={f.prep} />

        <H2 eyebrow="90 minutes">Run of show</H2>
        <div className="mt-3 space-y-3">
          {session.agenda.map((block) => {
            const play = blockPlaybook[block.title];
            return (
              <div key={block.title} className="guide-avoid grid gap-x-4 border-t border-line pt-3 sm:grid-cols-[5.5rem_1fr]">
                <p className="label pt-0.5 text-amber-deep">
                  {block.start}–{block.end}
                </p>
                <div className="text-[0.9375rem] leading-snug">
                  <p className="font-semibold text-navy-900">{block.title}</p>
                  <p className="mt-1 text-muted">{block.detail}</p>
                  {play && <p className="mt-1">{play.move}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </Sheet>

      <Sheet>
        <H2>Opening remarks</H2>
        <Bullets items={f.opening} />
        <H2>The demo format</H2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-snug marker:font-semibold marker:text-amber-deep">
          {f.demoFormat.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <H2>Peer feedback themes</H2>
        <Bullets items={f.peerFeedback} />
        <H2>Future-proofing discussion</H2>
        <Bullets items={f.futureProofing} />
        <H2>Awards and graduation</H2>
        <Bullets items={f.closing} />
        <Notes label="Awards ballot and follow-ups" />
      </Sheet>
    </article>
  );
}

/* ---------- Appendix ---------- */

function Appendix({ schedule, deliverables }: { schedule: Session[]; deliverables: ReturnType<typeof withDeliverables> }) {
  return (
    <article id="appendix" className="guide-chapter">
      <Sheet>
        <H2 eyebrow="Appendix">The capstone path</H2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          Each participant works toward one capstone problem across the program. Use this to check progress at every
          session.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="guide-table w-full text-left text-sm">
            <caption className="sr-only">Capstone steps and the session each is due</caption>
            <thead>
              <tr>
                <th scope="col">Due by</th>
                <th scope="col">Step</th>
                <th scope="col">What it means</th>
              </tr>
            </thead>
            <tbody>
              {capstoneSteps.map((step) => {
                const due = schedule.find((s) => s.id === step.bySessionId);
                return (
                  <tr key={step.id} className="guide-avoid">
                    <th scope="row" className="whitespace-nowrap">
                      S{due?.number} · {due?.shortDate}
                    </th>
                    <td className="font-semibold text-navy-900">{step.title}</td>
                    <td>{step.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Sheet>

      <Sheet>
        <H2 eyebrow="Appendix">Review criteria at a glance</H2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          Work meets the session when every criterion is satisfied. If one is missing, request a revision with a
          concrete next step.
        </p>
        <div className="mt-4 space-y-5">
          {deliverables.map((s) => (
            <div key={s.id} className="guide-avoid">
              <p className="font-semibold text-navy-900">
                Session {s.number} · {s.deliverable.title}
              </p>
              <Checklist items={learningGuides[s.id]?.criteria ?? []} />
            </div>
          ))}
        </div>
      </Sheet>
    </article>
  );
}

/* ---------- Print stylesheet ---------- */

function GuideStyles() {
  return (
    <style>{`
      .guide { display: grid; gap: 1.5rem; }
      .guide-sheet { background: #fff; border: 1px solid var(--color-line); padding: 2.5rem 2.75rem; }
      .guide-cover { padding: 0; border: 0; }
      .guide-chapter { display: grid; gap: 1.5rem; }
      .guide-table { border-collapse: collapse; }
      .guide-table th, .guide-table td { border-bottom: 1px solid var(--color-line); padding: 0.5rem 0.6rem 0.5rem 0; vertical-align: top; line-height: 1.35; }
      .guide-table thead th { border-bottom: 2px solid var(--color-navy-900); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; }
      .guide-table tbody th { font-weight: 600; color: var(--color-navy-900); }
      .guide-avoid { break-inside: avoid; }
      .guide-heading { break-inside: avoid; break-after: avoid; }

      @page {
        size: 8.5in 11in;
        margin: 0.6in 0.65in 0.75in;
        @bottom-left { content: "${"The AI Executive Sandbox · Instructor guide"}"; font: 8pt sans-serif; color: #46566e; }
        @bottom-right { content: counter(page); font: 8pt sans-serif; color: #46566e; }
      }
      @page :first { @bottom-left { content: none; } @bottom-right { content: none; } }

      @media print {
        html, body { background: #fff !important; font-size: 10.5pt; }
        .guide { display: block; }
        .guide-sheet { border: 0; padding: 0; break-before: page; }
        .guide-cover { break-before: auto; }
        /* A chapter starts on a fresh page, then flows: its second sheet continues where the first ends. */
        .guide-chapter > .guide-sheet + .guide-sheet { break-before: auto; padding-top: 1.5rem; }
        .guide-cover, .guide-cover * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        /* Page content area is 9.65in tall (11in less the 0.6in and 0.75in margins); stay just inside it. */
        .guide-cover { height: 9.55in !important; overflow: hidden; }
        .guide-cover > div { height: 100% !important; min-height: 0 !important; }
        aside, .guide-avoid { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        a { color: inherit; text-decoration: none; }
      }
    `}</style>
  );
}
