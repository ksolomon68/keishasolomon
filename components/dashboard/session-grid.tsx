import { ChevronDown, Download, ExternalLink, FileText } from "lucide-react";
import { resourceKinds, sessions, type Session } from "@/data/cohortData";
import { Tag } from "@/components/ui/tag";
import type { Resource } from "@/lib/store";
import { Countdown } from "./countdown";

const kindLabel = Object.fromEntries(resourceKinds.map((k) => [k.value, k.label]));

export function SessionGrid({ resources }: { resources: Resource[] }) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} resources={resources.filter((r) => r.sessionId === session.id)} />
      ))}
    </ol>
  );
}

function SessionCard({ session, resources }: { session: Session; resources: Resource[] }) {
  return (
    <li className="flex flex-col border border-line bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-line p-5">
        <div>
          <p className="label text-amber-deep">Session {String(session.number).padStart(2, "0")}</p>
          <p className="label mt-1 text-ink">{session.dateLabel}</p>
        </div>
        <Countdown date={session.date} />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div>
          <h3 className="font-display text-xl leading-snug text-navy-900">{session.theme}</h3>
          <p className="mt-2 text-sm text-muted">
            <span className="font-semibold text-ink">Hook:</span> {session.hook.name}
          </p>
          <p className="mt-1 text-sm text-muted">
            <span className="font-semibold text-ink">Lab:</span> {session.lab.name}
          </p>
        </div>

        <details className="group border border-line">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-ink marker:content-none hover:bg-paper [&::-webkit-details-marker]:hidden">
            90-minute run of show
            <ChevronDown
              className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <ol className="space-y-3 border-t border-line p-3">
            {session.agenda.map((block) => (
              <li key={block.title} className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm">
                <span className="label pt-0.5 text-muted">
                  {block.start}–{block.end}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{block.title}</span>
                  <span className="text-muted">{block.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </details>

        <div className="mt-auto">
          <p className="label text-ink">Session materials</p>
          {resources.length ? (
            <ul className="mt-2 space-y-1.5">
              {resources.map((r) => (
                <li key={r.id}>
                  <ResourceLink resource={r} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Prompt sheets, slides and templates are posted here before the session.</p>
          )}
        </div>
      </div>

      {session.deliverable && (
        <div className="flex items-center gap-2 border-t border-line bg-paper px-5 py-3">
          <Tag tone="amber">Deliverable</Tag>
          <span className="text-sm font-semibold text-ink">{session.deliverable.title}</span>
        </div>
      )}
    </li>
  );
}

function ResourceLink({ resource }: { resource: Resource }) {
  const label = (
    <>
      <span className="font-semibold">{resource.title}</span>
      <span className="label ml-2 text-muted">{kindLabel[resource.kind]}</span>
    </>
  );
  const classes =
    "group flex min-h-11 items-center gap-2.5 border border-line px-3 py-2 text-sm text-navy-900 transition-colors hover:border-navy-900 hover:bg-paper";

  if (resource.fileId) {
    return (
      <a href={`/api/files/${resource.fileId}`} className={classes}>
        <Download className="size-4 shrink-0 text-cyan-deep" aria-hidden="true" />
        <span>
          {label}
          <span className="sr-only"> (download)</span>
        </span>
      </a>
    );
  }
  return (
    <a href={resource.linkUrl ?? "#"} target="_blank" rel="noopener noreferrer" className={classes}>
      {resource.linkUrl ? (
        <ExternalLink className="size-4 shrink-0 text-cyan-deep" aria-hidden="true" />
      ) : (
        <FileText className="size-4 shrink-0" aria-hidden="true" />
      )}
      <span>
        {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}
