"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { ChevronDown } from "lucide-react";

export function SupportResources({ coaching, toolkit }: { coaching: ReactNode; toolkit: ReactNode }) {
  const coachingRef = useRef<HTMLDetailsElement>(null);
  const toolkitRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const reveal = () => {
      const target = window.location.hash === "#coaching"
        ? coachingRef.current
        : window.location.hash === "#toolkit"
          ? toolkitRef.current
          : null;
      if (!target) return;
      target.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  return (
    <div className="space-y-3">
      <SupportPanel
        panelRef={coachingRef}
        id="coaching"
        eyebrow="Private support"
        title="Remote 1:1 coaching"
        description="Schedule a conversation, prepare for it, and capture the decision and next step."
      >
        {coaching}
      </SupportPanel>
      <SupportPanel
        panelRef={toolkitRef}
        id="toolkit"
        eyebrow="Reusable tools"
        title="Prompt and communications toolkit"
        description="Build a stronger AI brief or adapt a ready-to-use communications starter."
      >
        {toolkit}
      </SupportPanel>
    </div>
  );
}

function SupportPanel({
  panelRef,
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  panelRef: RefObject<HTMLDetailsElement | null>;
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details ref={panelRef} name="dashboard-support" id={id} className="group scroll-mt-10 border border-line bg-white open:border-navy-900">
      <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 p-5 marker:content-none transition-colors hover:bg-paper group-open:bg-paper sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="label text-amber-deep">{eyebrow}</span>
          <span className="mt-1 block font-display text-2xl text-navy-900">{title}</span>
          <span className="mt-1 block text-sm text-muted">{description}</span>
        </span>
        <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </summary>
      <div className="border-t border-line p-4 sm:p-6">{children}</div>
    </details>
  );
}
