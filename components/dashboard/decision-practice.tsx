"use client";

import { useId, useState } from "react";
import { decisionPractice } from "@/data/cohort-practice";
import { Button } from "@/components/ui/button";

export function DecisionPractice({ sessionId }: { sessionId: string }) {
  const practice = decisionPractice[sessionId];
  const id = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  if (!practice) return null;
  const choice = answer === null ? null : practice.choices[answer];
  return <details className="border border-cyan-deep bg-paper p-4">
    <summary className="min-h-7 cursor-pointer font-semibold text-cyan-deep">Decision lab · {practice.title}</summary>
    <fieldset className="mt-4">
      <legend className="text-ink">{practice.situation}</legend>
      <div className="mt-3 space-y-2">{practice.choices.map((option, index) =>
        <label key={option.label} className="flex min-h-11 cursor-pointer items-start gap-3 border border-line bg-white p-3 has-checked:border-cyan-deep">
          <input type="radio" name={id} checked={selected === index} onChange={() => { setSelected(index); setAnswer(null); }} className="mt-1 size-4 shrink-0 accent-cyan-deep" />
          <span>{option.label}</span>
        </label>,
      )}</div>
      <Button variant="secondary" className="mt-4" disabled={selected === null} onClick={() => setAnswer(selected)}>Check my reasoning</Button>
    </fieldset>
    <div role="status" className={choice ? "mt-4 border-l-2 border-cyan-deep pl-4" : ""}>
      {choice && <><p className="font-semibold">{choice.recommended ? "A useful next step" : "Consider the consequence"}</p>
        <p className="mt-2 text-muted">{choice.feedback}</p><p className="mt-3 text-ink">{practice.takeaway}</p></>}
    </div>
    <p className="mt-3 text-xs text-muted">Practice only. Your answer is not graded or saved.</p>
  </details>;
}
