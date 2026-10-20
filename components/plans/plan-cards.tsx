import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { plans } from "@/data/plans";

/** The three plans side by side. Used on the landing page and the plans page. */
export function PlanCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-px border border-line bg-line lg:grid-cols-3">
      {plans.map((plan) => (
        <li
          key={plan.id}
          className={`relative flex flex-col p-6 sm:p-8 ${plan.highlighted ? "bg-navy-900 text-white" : "bg-white text-ink"}`}
          data-surface={plan.highlighted ? "dark" : "light"}
        >
          {plan.highlighted && (
            <span className="label mb-4 self-start bg-amber px-2 py-0.5 !text-[0.6875rem] text-navy-950">Recommended for organizations</span>
          )}
          <p className={`label ${plan.highlighted ? "text-amber" : "text-amber-deep"}`}>{plan.audience}</p>
          <Heading className="mt-2 font-display text-3xl">{plan.name}</Heading>
          <p className="mt-4 font-display text-4xl font-light">{plan.price}</p>
          <p className={`mt-1 text-sm ${plan.highlighted ? "text-on-navy" : "text-muted"}`}>{plan.priceNote}</p>
          <p className={`mt-5 ${plan.highlighted ? "text-white/85" : "text-muted"}`}>{plan.summary}</p>
          <ul className="mt-6 flex-1 space-y-3 text-[0.9375rem]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <Check className={`mt-0.5 size-4 shrink-0 ${plan.highlighted ? "text-amber" : "text-cyan-deep"}`} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href={plan.cta.href}
            className={`${buttonStyles({ variant: plan.highlighted ? "primary" : plan.id === "starter" ? "secondary" : "outline" })} mt-8 w-full`}
          >
            {plan.cta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
