/** Each trial includes setup, execution, review, and correction time. */
export function measureOutcome(baseline: string, frequency: string, trials: string) {
  const lines = trials.trim().split(/\n/);
  if (!baseline.trim() || !frequency.trim() || !trials.trim()) return null;
  const base = Number(baseline), times = Number(frequency);
  const totals = lines.map((line) => {
    const parts = line.split(",").map((value) => value.trim());
    if (parts.length !== 4 || parts.some((value) => !value || !Number.isFinite(Number(value)) || Number(value) < 0)) return NaN;
    return parts.reduce((total, value) => total + Number(value), 0);
  });
  if (!Number.isFinite(base) || base <= 0 || !Number.isFinite(times) || times <= 0 || totals.some((value) => !Number.isFinite(value))) return null;
  const average = totals.reduce((sum, total) => sum + total, 0) / totals.length;
  return { count: totals.length, average, saved: base - average, weekly: (base - average) * times };
}
