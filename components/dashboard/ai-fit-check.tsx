"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert, UserRound, XCircle, RotateCcw } from "lucide-react";
import { assessFit, fitQuestions, isComplete, type FitAnswers, type FitVerdict } from "@/lib/ai-fit";
import { Button } from "@/components/ui/button";

const tone: Record<FitVerdict, { icon: typeof CheckCircle2; border: string; text: string }> = {
  good: { icon: CheckCircle2, border: "border-success", text: "text-success" },
  care: { icon: AlertTriangle, border: "border-amber-deep", text: "text-amber-deep" },
  human: { icon: UserRound, border: "border-cyan-deep", text: "text-cyan-deep" },
  protect: { icon: ShieldAlert, border: "border-danger", text: "text-danger" },
  avoid: { icon: XCircle, border: "border-danger", text: "text-danger" },
};

/** Answers stay in this component; nothing is saved or sent. */
export function AiFitCheck() {
  const id = useId();
  const [task, setTask] = useState("");
  const [answers, setAnswers] = useState<FitAnswers>({});
  const [checked, setChecked] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const answered = fitQuestions.filter((q) => answers[q.id]).length;
  const complete = isComplete(answers);
  const result = checked && complete ? assessFit(answers) : null;
  const Icon = result ? tone[result.verdict].icon : null;

  // Move focus to the verdict once it renders, so keyboard and screen reader users land on the answer.
  useEffect(() => {
    if (checked) resultRef.current?.focus();
  }, [checked]);

  return (
    <div className="border border-line bg-white">
      <form
        className="space-y-6 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!complete) return;
          setChecked(true);
        }}
      >
        <div>
          <label htmlFor={`${id}-task`} className="font-semibold">
            Which task are you thinking about? <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id={`${id}-task`}
            value={task}
            onChange={(event) => setTask(event.target.value)}
            maxLength={160}
            placeholder="e.g. Writing the weekly update for my manager"
            className="mt-2 block min-h-11 w-full border border-edge bg-white px-3 py-2"
          />
        </div>
        {fitQuestions.map((q, index) => (
          <fieldset key={q.id}>
            <legend className="font-semibold">
              <span className="text-muted">{index + 1}.</span> {q.question}
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {q.options.map((option) => (
                <label
                  key={option.value}
                  className="flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-[0.9375rem] has-checked:border-navy-900 has-checked:bg-paper"
                >
                  <input
                    type="radio"
                    name={`${id}-${q.id}`}
                    value={option.value}
                    checked={answers[q.id] === option.value}
                    onChange={() => {
                      setAnswers((current) => ({ ...current, [q.id]: option.value }));
                      setChecked(false);
                    }}
                    className="mt-1 size-4 shrink-0 accent-navy-900"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="secondary" disabled={!complete}>
            Check this task
          </Button>
          <p className="text-sm text-muted" aria-live="polite">
            {complete ? "Ready when you are." : `${answered} of ${fitQuestions.length} answered`}
          </p>
        </div>
      </form>

      <div ref={resultRef} tabIndex={-1} role="status" className="outline-none">
        {result && Icon && (
          <div className={`border-t-4 ${tone[result.verdict].border} bg-paper p-5 sm:p-6`}>
            {task.trim() && <p className="text-sm text-muted">For: {task.trim()}</p>}
            <p className={`mt-1 flex items-center gap-2 font-display text-2xl ${tone[result.verdict].text}`}>
              <Icon className="size-6 shrink-0" aria-hidden="true" />
              {result.title}
            </p>
            <p className="mt-2 text-ink">{result.summary}</p>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <p className="label text-muted">Why</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem]">
                  {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
              <div>
                <p className="label text-muted">What to do next</p>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[0.9375rem]">
                  {result.nextSteps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-5"
              onClick={() => {
                setAnswers({});
                setTask("");
                setChecked(false);
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Check another task
            </Button>
          </div>
        )}
      </div>
      <p className="border-t border-line px-5 py-3 text-xs text-muted sm:px-6">
        Guidance only. Your answers aren&rsquo;t saved or sent anywhere. Always follow your organization&rsquo;s AI policy.
      </p>
    </div>
  );
}
