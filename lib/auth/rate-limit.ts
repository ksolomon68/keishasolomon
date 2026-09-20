/**
 * Minimal in-memory failed-login limiter (per server process).
 * Good enough to blunt password guessing on a single-node deployment; use a shared store if you scale out.
 */
const WINDOW_MS = 15 * 60_000;
const MAX_FAILURES = 8;

const failures = new Map<string, number[]>();

function recent(key: string, now: number): number[] {
  const list = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length) failures.set(key, list);
  else failures.delete(key);
  return list;
}

export function isLocked(key: string): boolean {
  return recent(key, Date.now()).length >= MAX_FAILURES;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  failures.set(key, [...recent(key, now), now]);
}

export function clearFailures(key: string): void {
  failures.delete(key);
}
