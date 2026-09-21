import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { Cohort } from "@/lib/store";

/**
 * Picks which cohort the instructor view is scoped to. Plain links keep the choice in the URL, so a
 * cohort's command center can be bookmarked or shared with a co-facilitator.
 */
export function CohortSwitcher({
  cohorts,
  selectedId,
  counts,
}: {
  cohorts: Cohort[];
  selectedId: string;
  counts: Record<string, number>;
}) {
  return (
    <nav aria-label="Cohorts" className="border-b border-line bg-paper-deep">
      <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {cohorts.map((c) => {
          const current = c.id === selectedId;
          return (
            <li key={c.id} className="shrink-0">
              <Link
                href={`/admin?cohort=${c.id}`}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 border px-4 py-2 text-sm font-semibold transition-colors ${
                  current
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-line bg-white text-navy-900 hover:border-navy-900"
                }`}
              >
                <span>{c.name}</span>
                <span className={`label ${current ? "text-on-navy" : "text-muted"}`}>
                  {counts[c.id] ?? 0} {(counts[c.id] ?? 0) === 1 ? "person" : "people"}
                </span>
                {c.archived && <Tag tone={current ? "dark" : "neutral"}>Archived</Tag>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
