"use client";

import { useEffect } from "react";
import { InternalTool } from "./internal-tools";
import { toolLabs } from "@/data/tool-labs";

export function ToolLibrary() {
  useEffect(() => {
    const reveal = () => {
      if (!window.location.hash.startsWith("#tool-")) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (!(target instanceof HTMLDetailsElement)) return;
      target.open = true;
      target.scrollIntoView({ block: "start" });
      target.querySelector("summary")?.focus();
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return <div className="space-y-4">
    {Object.entries(toolLabs).map(([sessionId, lab]) => <details key={sessionId} id={`tool-${sessionId}`} className="group scroll-mt-40 border border-line bg-white open:border-navy-900">
      <summary className="flex min-h-24 cursor-pointer flex-wrap items-center justify-between gap-4 p-5">
        <span className="min-w-0 flex-1"><span className="label block text-amber-deep">Session {sessionId.slice(1)} tool</span><span className="mt-2 block font-display text-xl text-navy-900 sm:text-2xl">{lab.tool}</span><span className="mt-2 block text-sm text-muted">{lab.purpose}</span></span>
        <span className="border border-edge px-4 py-2 text-sm font-semibold text-cyan-deep"><span className="group-open:hidden">Open tool</span><span className="hidden group-open:inline">Close tool</span></span>
      </summary>
      <div className="border-t border-line px-4 pb-5 sm:px-5"><InternalTool sessionId={sessionId} /><p className="text-sm text-muted">{lab.evidence}</p><a className="mt-3 inline-flex min-h-11 items-center font-semibold text-cyan-deep underline" href={`#submission-${sessionId}`}>Go to Session {sessionId.slice(1)} submission and feedback</a></div>
    </details>)}
  </div>;
}
