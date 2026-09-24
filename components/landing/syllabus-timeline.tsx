"use client";

import { useId, useState } from "react";
import { ChevronDown, FlaskConical, PackageCheck, Sparkles } from "lucide-react";
import { focusAreas, sessions, type Focus, type Session } from "@/data/cohortData";
import { Tag } from "@/components/ui/tag";
import { SectionHeading } from "./section-heading";

type Filter = "all" | Focus;

export function SyllabusTimeline() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIds, setOpenIds] = useState<string[]>(["s1"]);
  const groupId = useId();

  const visible = sessions.filter((s) => filter === "all" || s.focus === filter);
  const allOpen = visible.length > 0 && visible.every((s) => openIds.includes(s.id));

  const toggle = (id: string) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const toggleAll = () =>
    setOpenIds((ids) =>
      allOpen ? ids.filter((id) => !visible.some((s) => s.id === id)) : [...new Set([...ids, ...visible.map((s) => s.id)])],
    );

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All sessions", count: sessions.length },
    ...focusAreas.map((f) => ({ value: f, label: f, count: sessions.filter((s) => s.focus === f).length })),
  ];

  return (
    <section id="syllabus" aria-labelledby="syllabus-title" className="bg-paper-deep py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="syllabus-title"
          eyebrow="Curriculum & Roadmap"
          title="Eight sessions. Seven working assets. One showcase."
          intro="Each session pairs a hook, a strategy framework and a live build lab. Filter by focus area and open a session to see what you'll build."
        />

        <div className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div role="group" aria-labelledby={groupId}>
            <p id={groupId} className="label mb-3 text-muted">
              Filter by focus
            </p>
            <div className="flex flex-wrap gap-2 lg:flex-nowrap">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={filter === o.value}
                  onClick={() => setFilter(o.value)}
                  className={`min-h-11 whitespace-nowrap rounded-sm border px-4 text-[0.9375rem] font-medium transition-colors ${
                    filter === o.value
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-edge bg-white text-ink hover:border-navy-900"
                  }`}
                >
                  {o.label} <span className="label ml-1 opacity-80">{o.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <p role="status" className="text-sm text-muted">
              Showing {visible.length} of {sessions.length} sessions
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="min-h-11 text-sm font-semibold text-navy-900 underline underline-offset-4 hover:text-cyan-deep"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
        </div>

        <ol className="relative mt-10 space-y-5 before:absolute before:bottom-4 before:left-[1.4375rem] before:top-4 before:w-px before:bg-edge/60 sm:before:left-[1.9375rem]">
          {visible.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              open={openIds.includes(session.id)}
              onToggle={() => toggle(session.id)}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function SessionCard({ session, open, onToggle }: { session: Session; open: boolean; onToggle: () => void }) {
  const uid = useId();
  const buttonId = `${uid}-button`;
  const panelId = `${uid}-panel`;
  const isFinal = session.deliverable === null;

  return (
    <li className="relative grid grid-cols-[3rem_1fr] gap-3 sm:grid-cols-[4rem_1fr] sm:gap-4">
      <div
        className={`z-10 mt-5 grid size-12 place-items-center border-2 font-display text-xl sm:size-16 sm:text-2xl ${
          open ? "border-navy-900 bg-navy-900 text-amber" : "border-navy-900 bg-paper-deep text-navy-900"
        }`}
        aria-hidden="true"
      >
        {session.number}
      </div>

      <article
        className={`border bg-white transition-colors ${open ? "border-navy-900 border-l-[5px] border-l-amber" : "border-line hover:border-navy-900"}`}
      >
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
          >
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="label text-ink">
                  Session {session.number} · Month {session.number}
                </span>
                <Tag tone="cyan">{session.focus}</Tag>
              </span>
              <span className="mt-2.5 block font-display text-2xl leading-tight text-navy-900 sm:text-[1.75rem]">
                {session.theme}
              </span>
              <span className="mt-2 flex items-center gap-2 text-[0.9375rem] text-muted">
                <PackageCheck className="size-4 shrink-0 text-amber-deep" aria-hidden="true" />
                <span>
                  {isFinal ? "Outcome: " : "Deliverable: "}
                  <span className="font-semibold text-ink">
                    {session.deliverable?.title ?? "5-minute lightning presentation & graduation"}
                  </span>
                </span>
              </span>
            </span>
            <ChevronDown
              className={`mt-1 size-6 shrink-0 text-navy-900 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </h3>

        <div className="expander" data-open={open}>
          <div inert={!open}>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="border-t border-line p-5 sm:p-6">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <p className="label flex items-center gap-2 text-amber-deep">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                      The hook
                    </p>
                    <p className="mt-2 font-display text-xl text-navy-900">&ldquo;{session.hook.name}&rdquo;</p>
                    <p className="mt-1 text-muted">{session.hook.description}</p>
                  </div>
                  <div>
                    <p className="label flex items-center gap-2 text-cyan-deep">
                      <FlaskConical className="size-3.5" aria-hidden="true" />
                      Hands-on lab
                    </p>
                    <p className="mt-2 font-display text-xl text-navy-900">{session.lab.name}</p>
                    <p className="mt-1 text-muted">{session.lab.description}</p>
                  </div>
                </div>

                <div>
                  <p className="label text-ink">Core topics</p>
                  <ul className="mt-3 space-y-2.5">
                    {session.concepts.map((c) => (
                      <li key={c} className="flex gap-3 text-ink">
                        <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-amber-deep" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {session.deliverable && (
                <div className="mt-7 border border-navy-900 bg-navy-900 p-5 text-white" data-surface="dark">
                  <p className="label text-amber">Tangible takeaway</p>
                  <p className="mt-1.5 font-display text-xl">{session.deliverable.title}</p>
                  <p className="mt-1 text-on-navy">{session.deliverable.description}</p>
                </div>
              )}

              <div className="mt-7">
                <p className="label text-ink">90-minute run of show</p>
                <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {session.agenda.map((b) => (
                    <li key={b.title} className="border border-line bg-paper p-3">
                      <p className="label text-muted">
                        {b.start}–{b.end}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-ink">{b.title}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
