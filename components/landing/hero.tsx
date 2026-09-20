import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { cohortStats, instructor, sessions, site } from "@/data/cohortData";

const first = sessions[0];
const blockTones = ["bg-navy-700", "bg-cyan", "bg-amber", "bg-cyan", "bg-navy-700"];
const blockText = ["text-white", "text-navy-950", "text-navy-950", "text-navy-950", "text-white"];

export function Hero() {
  const agenda = first.agenda;
  return (
    <section data-surface="dark" className="grid-backdrop relative isolate overflow-hidden bg-navy-900 text-white">
      <div
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-amber/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="animate-rise">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-amber">
            <span>Cohort 01</span>
            <span aria-hidden="true" className="h-px w-8 bg-amber/60" />
            <span>Oct 2026 – May 2027</span>
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,6.2vw,4.75rem)] font-light leading-[1.02] tracking-tight text-balance">
            <span className="text-amber">Applied AI</span> for Leadership &amp; Business Innovation
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-navy sm:text-xl">
            {site.name}: an eight-month, in-person cohort where leaders don&rsquo;t watch demos. They build. Every
            90-minute session ends with a working asset (a policy, a workflow, a pipeline, a prototype) you can deploy
            the next morning.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/#syllabus" className={buttonStyles({ variant: "primary" })}>
              See the 8-session roadmap
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/onboarding" className={buttonStyles({ variant: "outline" }) + " text-white"}>
              <ClipboardCheck className="size-4" aria-hidden="true" />
              Before Day 1 checklist
            </Link>
          </div>

          <figure className="mt-12 flex max-w-xl items-center gap-4 border-l-2 border-amber pl-5">
            <div
              className="grid size-14 shrink-0 place-items-center border border-white/30 font-display text-xl text-amber"
              aria-hidden="true"
            >
              KS
            </div>
            <figcaption>
              <p className="font-display text-xl">{instructor.name}</p>
              <p className="text-sm text-on-navy">
                {instructor.role} · {instructor.company}
              </p>
            </figcaption>
          </figure>
        </div>

        <div className="animate-rise self-center [animation-delay:120ms]">
          <div className="border border-white/20 bg-navy-950/70 p-6 backdrop-blur-sm sm:p-8">
            <p className="label text-amber">The 90-minute run of show</p>
            <p className="mt-2 font-display text-2xl leading-snug">
              Twenty-five minutes of framework. Fifty of building and stress-testing.
            </p>

            {/* Proportional bar (decorative): each block's width is its share of the 90 minutes. The list below carries the same information for assistive tech. */}
            <div className="mt-7 flex h-14 gap-1" aria-hidden="true">
              {agenda.map((block, i) => (
                <div
                  key={block.title}
                  style={{ flexGrow: block.minutes }}
                  className={`${blockTones[i]} ${blockText[i]} relative min-w-0`}
                >
                  <span className="label absolute inset-x-1.5 top-1.5 !text-[0.625rem] !tracking-wider">
                    {block.minutes}m
                  </span>
                </div>
              ))}
            </div>
            <ol className="mt-5 space-y-2.5 text-sm">
              {agenda.map((block, i) => (
                <li key={block.title} className="flex items-baseline gap-3">
                  <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 ${blockTones[i]}`} />
                  <span>
                    <span className="font-medium text-white">{block.title}</span>
                    <span className="text-on-navy">
                      {" "}
                      · {block.minutes} min · {block.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <dl className="mx-auto grid max-w-7xl grid-cols-2 border-t border-white/15 sm:grid-cols-4">
        {cohortStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse justify-end border-b border-white/10 px-4 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0 lg:px-8"
          >
            <dt className="text-sm text-on-navy">{stat.label}</dt>
            <dd className="font-display text-4xl font-light text-amber">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
