import type { ReactNode } from "react";

interface Props {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Use on navy surfaces. */
  dark?: boolean;
}

export function SectionHeading({ id, eyebrow, title, intro, dark = false }: Props) {
  return (
    <div className="max-w-3xl">
      <p className={`label ${dark ? "text-amber" : "text-amber-deep"}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`mt-3 font-display text-4xl font-light leading-[1.08] tracking-tight text-balance sm:text-5xl ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-on-navy" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
