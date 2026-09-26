import { ShieldCheck } from "lucide-react";
import { safeHarbor } from "@/data/cohortData";

export function SafeHarborPledge() {
  return (
    <section
      id="safe-harbor"
      data-surface="dark"
      aria-labelledby="safe-harbor-title"
      className="home-section text-white"
    >
      <div className="home-shell home-surface-dark">
        <div className="border-l-4 border-amber pl-6 sm:pl-10">
          <p className="label flex items-center gap-2 text-amber">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Our promise
          </p>
          <h2
            id="safe-harbor-title"
            className="mt-4 max-w-4xl font-display text-4xl font-light leading-[1.08] tracking-tight text-balance sm:text-5xl"
          >
            {safeHarbor.title}
          </h2>
          <p className="mt-6 max-w-3xl font-display text-2xl font-light leading-snug text-on-navy sm:text-[1.75rem]">
            {safeHarbor.intro}
          </p>
        </div>

        <ul className="mt-14 grid gap-px border border-white/15 bg-white/15 md:grid-cols-3">
          {safeHarbor.commitments.map((c) => (
            <li key={c.title} className="bg-navy-950/85 backdrop-blur-sm p-7 sm:p-9">
              <h3 className="font-display text-xl text-amber">{c.title}</h3>
              <p className="mt-3 text-on-navy">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
