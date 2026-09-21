import Link from "next/link";
import Image from "next/image";

/** Official site logo: EVOBRAND sphere + program name. */
export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="The AI Executive Sandbox, home">
      <Image
        src="/favicon-source.png"
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 object-contain"
        priority
      />
      <span className="font-display text-lg leading-none tracking-tight">
        <span className="block text-[0.6875rem] font-sans font-medium uppercase tracking-[0.18em] text-on-navy">
          The
        </span>
        AI Executive Sandbox
      </span>
    </Link>
  );
}
