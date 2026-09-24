import { CalendarDays, ExternalLink, Video } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export function RemoteCoaching({ participantName }: { participantName: string }) {
  const meetUrl = process.env.NEXT_PUBLIC_GOOGLE_MEET_URL?.trim();
  const bookingUrl = process.env.NEXT_PUBLIC_COACHING_BOOKING_URL?.trim();
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const requestHref = bookingUrl || (contact
    ? `mailto:${contact}?subject=${encodeURIComponent(`1:1 coaching request from ${participantName}`)}`
    : null);

  return (
    <div className="grid gap-px border border-navy-900 bg-navy-900 lg:grid-cols-[1.15fr_.85fr]">
      <div data-surface="dark" className="bg-navy-950 p-6 text-white sm:p-8">
        <p className="label text-cyan">Remote coaching room</p>
        <h3 className="mt-3 font-display text-3xl font-light">Meet face-to-face, wherever you are.</h3>
        <p className="mt-3 max-w-xl text-on-navy">
          Use your private 1:1 to work through a decision, review a draft, or unblock the next step in your capstone.
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
          {requestHref && (
            <a href={requestHref} target={bookingUrl ? "_blank" : undefined} rel={bookingUrl ? "noopener noreferrer" : undefined} className={buttonStyles({ variant: "outline" }) + " text-white"}>
              <CalendarDays className="size-4" aria-hidden="true" /> Schedule a 1:1
            </a>
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
        {bookingUrl && <p className="mt-5 flex items-center gap-2 text-xs text-muted"><ExternalLink className="size-3" /> Scheduling opens in a new tab.</p>}
      </div>
    </div>
  );
}
