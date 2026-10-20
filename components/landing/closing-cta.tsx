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
          Not ready for a cohort? Start free on your own and learn when AI is worth using. Bringing a team or a
          leadership group? Tell us about it and get a proposal.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/start" className={buttonStyles({ variant: "primary" })}>
            Start free
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/plans#inquiry" className={buttonStyles({ variant: "outline" }) + " text-white"}>
            Plan training for my team
          </Link>
        </div>
        <p className="mt-6 text-sm text-on-navy">
          Have an access code?{" "}
          <Link href="/register" className="font-semibold text-white underline underline-offset-4 hover:text-amber">
            Activate your account
          </Link>
        </p>
        </div>
      </div>
    </section>
  );
}
