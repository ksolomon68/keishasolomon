import { site } from "@/data/cohortData";

export function ParticipantHelp() {
  return <aside className="mt-6 border-t border-line pt-5 text-sm text-muted" aria-label="Account help">
    <p className="font-semibold text-ink">Need an access code or help signing in?</p>
    <p className="mt-2">{site.contactEmail ? <>
      <a className="font-semibold text-cyan-deep underline underline-offset-4" href={`mailto:${site.contactEmail}?subject=AI%20Executive%20Sandbox%20account%20help`}>Email your instructor</a> for help with your invitation or account access. Never send your password.
    </> : <>Reply to the instructor&rsquo;s welcome message or contact the organizer who invited you. A public support email has not been posted yet. Never send your password.</>}</p>
  </aside>;
}

export function SessionLogistics() {
  return <aside className="border-l-4 border-cyan-deep bg-white p-5 sm:p-6" aria-label="Session logistics">
    <p className="font-semibold text-ink">Before you travel</p>
    <p className="mt-2 text-sm text-muted">Session dates are listed below. Start time, time zone, and venue are awaiting confirmation on this site. Check your welcome message or contact your instructor for confirmed details before travelling.</p>
    <ParticipantHelp />
  </aside>;
}
