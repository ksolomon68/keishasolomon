import { PlanCards } from "@/components/plans/plan-cards";
import { SectionHeading } from "@/components/landing/section-heading";

export function PlansOverview() {
  return (
    <section id="plans" aria-labelledby="plans-title" className="home-section">
      <div className="home-shell home-surface-light">
        <SectionHeading
          id="plans-title"
          eyebrow="Ways to learn"
          title="Start on your own. Grow with your team."
          intro="Everyone starts in the same place: learning when AI helps, when it doesn't, and how to use it safely. Choose the level that fits you."
        />
        <div className="mt-10">
          <PlanCards />
        </div>
      </div>
    </section>
  );
}
