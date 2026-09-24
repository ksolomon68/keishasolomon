import type { CoachingNote } from "@/lib/store";

export function CoachingReview({ entries }: { entries: (CoachingNote & { participant: string })[] }) {
  return entries.length === 0 ? (
    <p className="border border-dashed border-edge p-6 text-muted">No coaching reflections have been logged for this cohort yet.</p>
  ) : (
    <ul className="grid gap-4 md:grid-cols-2">
      {entries.map((entry) => <li key={entry.id} className="border border-line bg-white p-5">
        <p className="label text-cyan-deep">{entry.participant} · {new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
        <h3 className="mt-2 font-display text-2xl text-navy-900">{entry.topic}</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{entry.note}</p>
        {entry.nextStep && <p className="mt-4 border-l-2 border-amber pl-3 text-sm"><strong>Next:</strong> {entry.nextStep}</p>}
      </li>)}
    </ul>
  );
}
