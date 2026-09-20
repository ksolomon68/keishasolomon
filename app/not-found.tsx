import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="label text-amber-deep">Error 404</p>
      <h1 className="mt-3 font-display text-5xl font-light text-navy-900">This page isn&rsquo;t in the sandbox.</h1>
      <p className="mt-4 text-muted">The link may be out of date, or the page may have moved.</p>
      <Link href="/" className={`${buttonStyles({ variant: "secondary" })} mt-8`}>
        Back to the home page
      </Link>
    </div>
  );
}
