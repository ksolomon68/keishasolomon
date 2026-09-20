"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center" role="alert">
      <p className="label text-danger">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl font-light text-navy-900">We couldn&rsquo;t load this page.</h1>
      <p className="mt-4 text-muted">Please try again. If it keeps happening, let your instructor know.</p>
      <Button variant="secondary" className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
