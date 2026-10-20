import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { AiFitCheck } from "@/components/dashboard/ai-fit-check";
import { DecisionPractice } from "@/components/dashboard/decision-practice";
import { FrictionLog } from "@/components/dashboard/friction-log";
import { PromptWorkshop } from "@/components/dashboard/prompt-workshop";
import { JoinCohortForm } from "@/components/auth/auth-forms";
import { buttonStyles } from "@/components/ui/button";
import { safeHarbor, sessions } from "@/data/cohortData";
import { plans } from "@/data/plans";
import type { FrictionEntry, User } from "@/lib/store";

const steps = [
  { href: "#fit-check", title: "Check a task", body: "Answer six quick questions to see if AI is a good fit." },
  { href: "#prompt-workshop", title: "Write a clear request", body: "Build a request an AI tool can follow, and you can check." },
  { href: "#safe-rules", title: "Know the safety rules", body: "What never goes into a public AI tool, and why." },
];

const safetyRules = [
  "Never paste customer, employee, health or financial records into a public AI tool.",
  "Treat every answer as a draft. Check names, numbers, dates and quotes yourself.",
  "If AI helped make something important, a person still decides and owns it.",
  "Use the AI tools your organization has approved, and follow its policy.",
];

/** Free Starter workspace: self-guided tools only, plus clear routes to a cohort. */
export function StarterDashboard({ user, friction }: { user: User; friction: FrictionEntry[] }) {
  const firstName = user.name.split(" ")[0];
  const cohortPlans = plans.filter((p) => p.id !== "starter");

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 pb-14 pt-8 text-white sm:pb-16 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">Starter plan · free</p>
          <h1 className="mt-2 font-display text-4xl font-light sm:mt-3 sm:text-5xl">Welcome, {firstName}.</h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] text-on-navy sm:mt-3 sm:text-base">
            This is your space to get comfortable with AI: learn which tasks it suits, how to ask for what you need,
            and how to stay safe. Start with step 1. Each step takes about five minutes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Your first steps" className="-mt-8">
          <ol className="grid gap-px border border-navy-900 bg-line sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.href} className="bg-white">
                <a href={step.href} className="group flex h-full gap-4 p-5 hover:bg-paper sm:p-6">
                  <span className="grid size-9 shrink-0 place-items-center border border-navy-900 font-display text-lg text-navy-900">
                    {index + 1}
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-semibold text-navy-900">
                      {step.title}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm text-muted">{step.body}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:space-y-16 sm:px-6 sm:py-16 lg:px-8">
        <StarterSection id="fit-check" eyebrow="Step 1" title="Is AI right for this task?" intro="Think of something you did this week. The check explains its answer, so you learn how to decide on your own next time.">
          <AiFitCheck />
        </StarterSection>

        <StarterSection id="prompt-workshop" eyebrow="Step 2" title="Write a request AI can follow" intro="Clear requests get useful answers. Fill in each part, then copy the result into the AI tool you're allowed to use.">
          <PromptWorkshop />
        </StarterSection>

        <StarterSection id="safe-rules" eyebrow="Step 3" title="Four rules that keep you safe">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <ol className="space-y-3">
              {safetyRules.map((rule, index) => (
                <li key={rule} className="flex gap-4 border border-line bg-white p-4">
                  <span className="font-display text-2xl text-amber-deep">{index + 1}</span>
                  <span className="pt-1">{rule}</span>
                </li>
              ))}
            </ol>
            <div className="border border-line bg-paper p-5">
              <p className="label flex items-center gap-2 text-cyan-deep">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {safeHarbor.title}
              </p>
              <ul className="mt-4 space-y-4">
                {safeHarbor.commitments.slice(0, 2).map((c) => (
                  <li key={c.title}>
                    <p className="font-semibold">{c.title}</p>
                    <p className="mt-1 text-sm text-muted">{c.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StarterSection>

        <StarterSection id="practice" eyebrow="Keep practicing" title="Practice a decision" intro="Short scenarios with instant feedback. Nothing is graded or saved.">
          <div className="space-y-4">
            <DecisionPractice sessionId="s1" />
            <DecisionPractice sessionId="s2" />
          </div>
        </StarterSection>

        <StarterSection id="friction" eyebrow="Your list" title="Tasks you could try with AI" intro="Keep a list of tasks that eat your time. It comes with you if you join a cohort later.">
          <FrictionLog entries={friction} schedule={[]} starter />
        </StarterSection>

        <StarterSection id="upgrade" eyebrow="Ready for more?" title="Learn alongside others, with feedback">
          <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.4fr_1fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="text-muted">
                Starter covers the basics. Teams and Leadership Programs add the full eight-session path, with tools
                that save your drafts and an instructor who reviews your work.
              </p>
              <ul className="mt-5 space-y-2 text-[0.9375rem]">
                {sessions.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center gap-3 text-muted">
                    <Lock className="size-4 shrink-0" aria-hidden="true" />
                    <span>Session {s.number}: {s.theme}</span>
                  </li>
                ))}
                <li className="pl-7 text-sm text-muted">…and {sessions.length - 4} more sessions</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {cohortPlans.map((p) => (
                  <Link key={p.id} href={p.cta.href} className={buttonStyles({ variant: p.highlighted ? "secondary" : "outline" })}>
                    {p.cta.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
              <Link href="/plans" className="mt-4 inline-block text-sm font-semibold text-navy-900 underline underline-offset-4">
                Compare all plans
              </Link>
            </div>
            <div className="bg-paper p-6 sm:p-8">
              <h3 className="font-display text-2xl text-navy-900">Have an access code?</h3>
              <p className="mt-2 text-sm text-muted">
                Enter it to join your organization&rsquo;s or program&rsquo;s cohort. You keep this account and your task list.
              </p>
              <div className="mt-5">
                <JoinCohortForm />
              </div>
            </div>
          </div>
        </StarterSection>
      </div>
    </>
  );
}

function StarterSection({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <p className="label text-amber-deep">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl text-navy-900 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-3 max-w-3xl text-muted">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
