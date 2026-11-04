import { Video } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import type { SupportRequest } from "@/lib/store";
import { CoachingRequestForm } from "./coaching-request-form";

export function RemoteCoaching({ request, canRequest }: { request: SupportRequest | null; canRequest: boolean }) {
  const meetUrl = process.env.NEXT_PUBLIC_GOOGLE_MEET_URL?.trim();

  return (
    <div className="grid gap-px border border-navy-900 bg-navy-900 lg:grid-cols-[1.15fr_.85fr]">
      <div data-surface="dark" className="bg-navy-950 p-6 text-white sm:p-8">
        <p className="label text-cyan">Remote coaching room</p>
        <h3 className="mt-3 font-display text-3xl font-light">Meet face-to-face, wherever you are.</h3>
        <p className="mt-3 max-w-xl text-on-navy">
          Your course includes one remote 1:1 coaching session per participant. Use it to work through a decision,
          review a draft, or unblock the next step in your capstone. If you need a different time, reschedule your
          existing appointment rather than booking another session. A request is not a confirmed booking.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {meetUrl ? (
            <a href={meetUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "primary" })}>
              <Video className="size-4" aria-hidden="true" /> Join Google Meet
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center gap-2 border border-white/25 px-4 text-sm text-on-navy">
              <Video className="size-4" aria-hidden="true" /> Meet link appears after confirmation
            </span>
          )}
        </div>
      </div>
      <div className="bg-white p-6 sm:p-8">
        <p className="label text-amber-deep">Before you join</p>
        <ol className="mt-4 space-y-4 text-sm text-muted">
          <li><strong className="text-ink">1. Name the outcome.</strong> What should be clearer or finished by the end?</li>
          <li><strong className="text-ink">2. Bring the work.</strong> Open the draft, tool, or decision you want to review.</li>
          <li><strong className="text-ink">3. Log the next step.</strong> Capture the commitment below while it is fresh.</li>
        </ol>
        {request ? <div className="mt-6 border-t border-line pt-5">
          <p className="font-semibold text-ink">Your course coaching request is already on file.</p>
          <p className="mt-2 text-sm text-muted">Check your conversation for the confirmed time and Google Calendar invitation. Reply there for a time change; resolving the conversation does not unlock another session.</p>
          <a href={`#support-request-${request.id}`} className="mt-3 inline-block font-semibold text-cyan-deep underline underline-offset-4">Open my coaching conversation</a>
        </div> : canRequest ? <CoachingRequestForm /> : <p className="mt-6 text-sm text-muted">Coaching requests are available to cohort participants.</p>}
      </div>
    </div>
  );
}
