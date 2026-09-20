import Link from "next/link";

/** Wordmark: a sandbox-corner glyph plus the program name. */
export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label="The AI Executive Sandbox, home">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 22h9v9" fill="none" stroke="var(--color-amber)" strokeWidth="2" />
        <circle cx="21" cy="11" r="4" fill="var(--color-amber)" />
      </svg>
      <span className="font-display text-lg leading-none tracking-tight">
        <span className="block text-[0.6875rem] font-sans font-medium uppercase tracking-[0.18em] text-on-navy">
          The
        </span>
        AI Executive Sandbox
      </span>
    </Link>
  );
}
