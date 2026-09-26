import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export function ClosingCta() {
  return (
    <section data-surface="dark" aria-labelledby="cta-title" className="home-section text-white">
      <div className="home-shell home-surface-dark grid-backdrop text-center">
        <div className="mx-auto max-w-4xl">
        <h2 id="cta-title" className="font-display text-4xl font-light leading-tight text-balance sm:text-5xl">
          Bring one real problem. Leave with a working solution.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-on-navy">
          Registered participants use the portal to log workplace friction, submit deliverables and track their path
          to the final showcase.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/register" className={buttonStyles({ variant: "primary" })}>
            Create your participant account
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/login" className={buttonStyles({ variant: "outline" }) + " text-white"}>
            Sign in
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}
