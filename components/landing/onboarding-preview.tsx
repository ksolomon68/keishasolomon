import Link from "next/link";
import { ArrowRight, Laptop, ListChecks } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { onboardingChecklist } from "@/data/cohortData";
import { SectionHeading } from "./section-heading";

export function OnboardingPreview() {
  const bring = onboardingChecklist.filter((i) => i.group === "bring");
  const accounts = onboardingChecklist.filter((i) => i.group === "accounts");

  return (
    <section id="onboarding" aria-labelledby="onboarding-title" className="home-section">
      <div className="home-shell home-surface-light">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="onboarding-title"
            eyebrow="Before Day 1"
            title="Arrive ready to build"
            intro="Five things to bring and set up before Session 1, so the first session is spent building, not signing up."
          />
          <Link href="/onboarding" className={buttonStyles({ variant: "secondary" })}>
            Open the interactive checklist
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="border border-line bg-white/94 p-6 sm:p-8">
            <h3 className="flex items-center gap-3 font-display text-2xl text-navy-900">
              <Laptop className="size-6 text-amber-deep" aria-hidden="true" />
              Bring to every session
            </h3>
            <ul className="mt-5 space-y-4">
              {bring.map((i) => (
                <li key={i.id}>
                  <p className="font-semibold text-ink">{i.title}</p>
                  <p className="text-[0.9375rem] text-muted">{i.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-white/94 p-6 sm:p-8">
            <h3 className="flex items-center gap-3 font-display text-2xl text-navy-900">
              <ListChecks className="size-6 text-cyan-deep" aria-hidden="true" />
              Pre-course tech checklist
            </h3>
            <ul className="mt-5 space-y-4">
              {accounts.map((i) => (
                <li key={i.id}>
                  <p className="font-semibold text-ink">{i.title}</p>
                  <p className="text-[0.9375rem] text-muted">{i.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
