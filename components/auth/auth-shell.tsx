import type { ReactNode } from "react";

/** Centered card layout shared by the sign-in and registration pages. */
export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid-backdrop bg-navy-900 px-4 py-14 sm:py-20" data-surface="dark">
      <div className="mx-auto max-w-md">
        <p className="label text-amber">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-light text-white">{title}</h1>
        <p className="mt-3 text-on-navy">{intro}</p>
        {/* The card itself is a light surface, so reset the focus ring color inside it. */}
        <div data-surface="light" className="mt-8 border border-white/20 bg-paper p-6 text-ink sm:p-8">
          {children}
        </div>
        <div className="mt-6 text-center text-on-navy">{footer}</div>
      </div>
    </div>
  );
}
