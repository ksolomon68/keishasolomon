"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const templates = [
  { id: "launch", label: "Launch announcement", channel: "LinkedIn", copy: "I’m putting a new AI-assisted workflow into practice through the AI Executive Sandbox. The goal is simple: spend less time on repetitive work and more time making better decisions. I’ll share what works, what changes, and what I learn along the way." },
  { id: "lesson", label: "Learning reflection", channel: "LinkedIn / email", copy: "This week’s lesson: AI gets more useful when the brief gets more specific. Naming the audience, desired outcome, constraints, and definition of done changed the quality of the result—and made review much faster." },
  { id: "case", label: "Mini case study", channel: "Website / newsletter", copy: "The problem: [repetitive task]. The old process took [time]. I redesigned the workflow using [tool or method], added a human review step, and reduced the work to [new time]. The biggest lesson was [insight]." },
  { id: "invite", label: "Conversation starter", channel: "Social", copy: "What is one task in your workweek that feels too repetitive, too manual, or too easy to postpone? I’m exploring practical ways to redesign those moments with AI—without giving up judgment, privacy, or the human touch." },
] as const;

export function MarketingToolkit() {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    window.setTimeout(() => setCopied((current) => current === id ? null : current), 1800);
  }
  return <div className="grid gap-4 md:grid-cols-2">
    {templates.map((template) => <article key={template.id} className="flex flex-col border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><p className="label text-cyan-deep">{template.channel}</p><h3 className="mt-2 font-display text-2xl text-navy-900">{template.label}</h3></div>
        <button type="button" onClick={() => copy(template.id, template.copy)} className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-edge px-3 text-sm font-semibold hover:bg-paper-deep">
          {copied === template.id ? <Check className="size-4 text-success" /> : <Copy className="size-4" />} {copied === template.id ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-5 flex-1 whitespace-pre-wrap text-sm leading-7 text-muted">{template.copy}</p>
    </article>)}
  </div>;
}
