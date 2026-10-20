import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { InquiryForm } from "@/components/plans/inquiry-form";
import { PlanCards } from "@/components/plans/plan-cards";
import { inquiryPlanOptions, planComparison, planFaqs, plans, type InquiryPlan } from "@/data/plans";

export const metadata: Metadata = {
  title: "Plans: Starter, Teams and Leadership Programs",
  description:
    "Learn when and how to use AI. Start free on your own, train your team, or bring the AI Executive Sandbox to your leadership program.",
};

const cell = (value: boolean | string) =>
  value === true ? (
    <><Check className="mx-auto size-5 text-cyan-deep" aria-hidden="true" /><span className="sr-only">Included</span></>
  ) : value === false ? (
    <><Minus className="mx-auto size-5 text-edge" aria-hidden="true" /><span className="sr-only">Not included</span></>
  ) : (
    <span className="text-xs font-semibold sm:text-sm">{value}</span>
  );

export default async function PlansPage({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const requested = (await searchParams).plan;
  const plan: InquiryPlan = inquiryPlanOptions.some((o) => o.value === requested) ? (requested as InquiryPlan) : "teams";

  return (
    <>
      <section data-surface="dark" className="grid-backdrop bg-navy-900 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="label text-amber">Plans</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-light leading-tight sm:text-6xl">
            Get comfortable with AI. Learn when to use it, and when not to.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-on-navy">
            Start on your own for free, train your whole team together, or bring the full in-person Sandbox to your
            leadership program. No coding, no jargon, and no customer data in public tools.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <section aria-label="Choose a plan">
          <PlanCards headingLevel="h2" />
          <p className="mt-4 text-sm text-muted">
            Have an access code from your organization or program?{" "}
            <Link href="/register" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-amber-deep">
              Activate your cohort account
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="compare-title">
          <h2 id="compare-title" className="font-display text-3xl text-navy-900 sm:text-4xl">Compare plans</h2>
          <div className="relative mt-6 overflow-x-auto border border-line bg-white">
            <table className="w-full text-left text-sm sm:text-base">
              <caption className="sr-only">What each plan includes</caption>
              <thead className="bg-paper">
                <tr>
                  <th scope="col" className="p-2 text-sm font-semibold sm:p-4">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="p-2 text-center text-sm font-semibold sm:p-4">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planComparison.map((row) => (
                  <tr key={row.feature} className="border-t border-line">
                    <th scope="row" className="p-2 font-normal sm:p-4">{row.feature}</th>
                    <td className="relative p-2 text-center sm:p-4">{cell(row.starter)}</td>
                    <td className="relative p-2 text-center sm:p-4">{cell(row.teams)}</td>
                    <td className="relative p-2 text-center sm:p-4">{cell(row.programs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="inquiry" aria-labelledby="inquiry-title" className="scroll-mt-24 grid gap-10 border border-navy-900 bg-paper p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="label text-amber-deep">Teams &amp; Leadership Programs</p>
            <h2 id="inquiry-title" className="mt-2 font-display text-3xl text-navy-900 sm:text-4xl">Tell us about your group</h2>
            <p className="mt-4 text-muted">
              Share a few details and you&rsquo;ll receive a proposal with format options, dates and pricing for your group.
              It takes about two minutes.
            </p>
            <ol className="mt-6 space-y-3 text-[0.9375rem]">
              <li><strong>1.</strong> Send your request.</li>
              <li><strong>2.</strong> Get a short call to agree goals and format.</li>
              <li><strong>3.</strong> Your people receive an access code and start learning.</li>
            </ol>
          </div>
          <InquiryForm plan={plan} />
        </section>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-display text-3xl text-navy-900 sm:text-4xl">Questions</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {planFaqs.map((faq) => (
              <details key={faq.q} className="group py-2">
                <summary className="flex min-h-12 cursor-pointer items-center font-semibold text-navy-900">{faq.q}</summary>
                <p className="pb-4 text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
