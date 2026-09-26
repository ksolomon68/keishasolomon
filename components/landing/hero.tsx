import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { cohortStats, instructor, site } from "@/data/cohortData";
import { VideoCta } from "@/components/landing/video-cta";
import { HeroRoadmap } from "@/components/landing/hero-roadmap";

export function Hero() {
  return (
    <section data-surface="dark" className="grid-backdrop relative isolate overflow-hidden bg-navy-950/50 backdrop-blur-[1px] text-white">
      <div
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-amber/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="animate-rise">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-amber">
            <span>Cohort 01</span>
            <span aria-hidden="true" className="h-px w-8 bg-amber/60" />
            <span>8-Month Executive Cohort</span>
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,6.2vw,4.75rem)] font-light leading-[1.02] tracking-tight text-balance">
            <span className="text-amber">Applied AI</span> for Leadership &amp; Business Innovation
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-navy sm:text-xl">
            {site.name}: an eight-month cohort where leaders don&rsquo;t watch demos. They build. Every 90-minute,
            in-person session ends with a working asset you can deploy the next morning, with remote 1:1 coaching to
            help you work through decisions and keep moving between sessions.
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
            <VideoCta />
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
                {instructor.role} ·{" "}
                <a
                  href={instructor.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-amber"
                >
                  {instructor.company}
                </a>
              </p>
            </figcaption>
          </figure>
        </div>

        <div className="animate-rise self-center [animation-delay:120ms]">
          <HeroRoadmap />
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
