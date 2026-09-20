import type { ReactNode } from "react";

type Tone = "neutral" | "amber" | "cyan" | "success" | "dark";

const tones: Record<Tone, string> = {
  neutral: "border-ink/40 text-ink",
  amber: "border-amber-deep text-amber-deep",
  cyan: "border-cyan-deep text-cyan-deep",
  success: "border-success text-success",
  dark: "border-amber text-amber",
};

/** Small mono tag with a hard 1px border. Use `tone="dark"` on navy surfaces. */
export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`label inline-flex items-center gap-1 border px-2 py-1 ${tones[tone]}`}>{children}</span>
  );
}
