import Link from "next/link";
import { ArrowRight, NotebookPen, Video } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export function CoachingSupport() {
  return (
    <section aria-labelledby="coaching-support-title" className="relative bg-paper/85 backdrop-blur-[2px] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-px border border-navy-900 bg-navy-900/80 px-0 sm:grid-cols-[1.08fr_.92fr] lg:grid-cols-[1.2fr_.8fr]">
        <div className="bg-white/95 backdrop-blur-sm p-7 sm:p-10 lg:p-14">
          <p className="label text-cyan-deep">Support between sessions</p>
          <h2 id="coaching-support-title" className="mt-3 max-w-2xl font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
            Your build does not have to wait until next month.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Participants can schedule a remote 1:1 coaching session when a decision, draft or workflow needs focused
            attention. Bring the real work; leave with one clear next step.
          </p>
          <Link href="/register" className={`${buttonStyles({ variant: "secondary" })} mt-8`}>
            Create your participant account
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div data-surface="dark" className="grid-backdrop bg-navy-950/90 backdrop-blur-sm p-7 text-white sm:p-10 lg:p-14">
          <ol className="space-y-8">
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center border border-cyan/50 text-cyan" aria-hidden="true">
                <Video className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-2xl">Meet remotely</h3>
                <p className="mt-2 text-on-navy">Schedule through the participant dashboard and join the confirmed Google Meet room.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center border border-amber/50 text-amber" aria-hidden="true">
                <NotebookPen className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-2xl">Keep the thread</h3>
                <p className="mt-2 text-on-navy">Use the private coaching log to capture the decision, feedback and next commitment.</p>
              </div>
            </li>
          </ol>
          <p className="mt-10 border-t border-white/15 pt-5 text-sm text-on-navy">
            Coaching notes are visible only to the participant and authorized instructors.
          </p>
        </div>
      </div>
    </section>
  );
}
