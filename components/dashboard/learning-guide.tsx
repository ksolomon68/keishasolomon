"use client";

import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { learningGuides } from "@/data/learning-guides";
import { Button, buttonStyles } from "@/components/ui/button";
import { DecisionPractice } from "./decision-practice";

export function LearningGuide({ sessionId }: { sessionId: string }) {
  const guide = learningGuides[sessionId];
  const [message, setMessage] = useState("");
  if (!guide) return null;
  return <div className="space-y-5 text-sm">
    <div><h4 className="font-semibold text-navy-900">Before the session</h4><p className="mt-2 text-muted">{guide.prepare}</p></div>
    <div><h4 className="font-semibold text-navy-900">Build it in three steps</h4>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-muted">{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
    <div className="border-l-2 border-cyan-deep bg-paper p-4"><h4 className="font-semibold text-cyan-deep">Worked example · fictional</h4><p className="mt-2">{guide.example}</p></div>
    <fieldset><legend className="font-semibold text-navy-900">Ready to submit?</legend>
      <p className="mt-1 text-muted">Self-check for this visit. These are also your instructor&rsquo;s review criteria.</p>
      <div className="mt-3 space-y-2">{guide.criteria.map((criterion) => <label key={criterion} className="flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 has-checked:bg-success/5">
        <input type="checkbox" className="mt-1 size-4 shrink-0 accent-navy-900" /><span>{criterion}</span>
      </label>)}</div>
    </fieldset>
    <details className="border border-line p-4"><summary className="min-h-7 cursor-pointer font-semibold">Open the starter template</summary>
      <pre className="my-4 whitespace-pre-wrap break-words font-sans text-sm text-muted">{guide.starter}</pre>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={async () => {
          try { await navigator.clipboard.writeText(guide.starter); setMessage("Starter copied. Paste it into your own document."); }
          catch { setMessage("Copy is unavailable. Select the text above or download the starter."); }
        }}><Copy className="size-4" aria-hidden="true" />Copy starter</Button>
        <a className={buttonStyles({ variant: "outline" })} href={`data:text/plain;charset=utf-8,${encodeURIComponent(guide.starter)}`} download={`${sessionId}-starter.txt`}><Download className="size-4" aria-hidden="true" />Download .txt</a>
      </div><p role="status" className="mt-2 text-muted">{message}</p>
    </details>
    <div><h4 className="font-semibold text-navy-900">Between sessions</h4><p className="mt-2 text-muted">{guide.practice}</p></div>
    <DecisionPractice sessionId={sessionId} />
  </div>;
}
