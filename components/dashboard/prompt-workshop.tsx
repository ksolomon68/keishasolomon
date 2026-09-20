"use client";

import { useId, useState } from "react";
import { Copy, Download, ArrowRight } from "lucide-react";
import { buildPracticePrompt, exampleBrief, type PromptBrief } from "@/data/cohort-practice";
import { Button, buttonStyles } from "@/components/ui/button";

const empty: PromptBrief = { role: "", task: "", context: "", constraints: "", output: "", challenge: true };
const fields = [
  { key: "role", label: "Role", hint: "What responsibility should the assistant take on?", placeholder: "e.g. Operations assistant preparing an action list" },
  { key: "task", label: "Task", hint: "Name one useful result, and say whether this is draft-only.", placeholder: "e.g. Extract action items for human review. Do not send them." },
  { key: "context", label: "Context & sample input", hint: "Add relevant background and a fictional example, including a past mistake to avoid.", placeholder: "Use fictional or sanitized details, never private records." },
  { key: "constraints", label: "Constraints", hint: "Set boundaries: permitted information, what not to invent, and who must approve.", placeholder: "e.g. Do not invent dates. Flag missing information." },
  { key: "output", label: "Output format", hint: "Describe the structure that would make the answer easy to check.", placeholder: "e.g. A table of action, owner, deadline, and supporting evidence" },
] as const;

export function PromptWorkshop() {
  const id = useId();
  const [brief, setBrief] = useState<PromptBrief>(empty);
  const [built, setBuilt] = useState(false);
  const [message, setMessage] = useState("");
  const prompt = built ? buildPracticePrompt(brief) : "";
  return <div className="border border-navy-900 bg-white">
    <div className="border-b border-line bg-paper p-5 sm:p-6">
      <p className="max-w-3xl text-muted">Give your AI tool a clear brief, ask it to challenge weak assumptions, and test the result. Reuse the instructions that work as your own playbook.</p>
      <ol aria-label="Practice cycle" className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        {["Define the task", "Draft", "Challenge", "Human review", "Verify the result"].map((step, index) => <li key={step} className="flex items-center gap-3"><span>{index + 1}. {step}</span>{index < 4 && <ArrowRight className="size-4 text-cyan-deep" aria-hidden="true" />}</li>)}
      </ol>
    </div>
    <details className="p-5 sm:p-6">
      <summary className="min-h-11 cursor-pointer font-display text-2xl">Build a reusable prompt</summary>
      <p className="mt-2 max-w-3xl text-sm text-muted">This assembles a prompt for you to use in an approved AI tool. It does not run an AI model or send your draft to one. Use fictional details. Copy or download your work before leaving; it is not saved to your account.</p>
      <Button variant="outline" className="mt-5" onClick={() => { setBrief({ ...exampleBrief }); setBuilt(false); setMessage("Fictional meeting-notes example loaded. Edit the brief, then build your prompt."); }}>Load fictional example</Button>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-2">
        <form onSubmit={(event) => {
          event.preventDefault();
          const missing = fields.find((field) => !brief[field.key].trim());
          if (missing) {
            setMessage(`Add ${missing.label.toLowerCase()} before building your prompt.`);
            document.getElementById(`${id}-${missing.key}`)?.focus();
            return;
          }
          setBuilt(true);
          setMessage("Prompt ready. Copy it into an approved tool, then test the result using the checks below.");
        }} className="space-y-4">
          {fields.map((field) => <div key={field.key}>
            <label htmlFor={`${id}-${field.key}`} className="block text-sm font-semibold">{field.label}</label>
            <p id={`${id}-${field.key}-hint`} className="mt-1 text-sm text-muted">{field.hint}</p>
            <textarea id={`${id}-${field.key}`} required maxLength={3000} rows={field.key === "context" ? 4 : 2}
              aria-describedby={`${id}-${field.key}-hint`} value={brief[field.key]} placeholder={field.placeholder}
              onChange={(event) => { setBrief({ ...brief, [field.key]: event.target.value }); setBuilt(false); setMessage(""); }}
              className="mt-2 block min-h-20 w-full resize-y rounded-sm border border-edge bg-white p-3 text-base placeholder:text-muted" />
          </div>)}
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={brief.challenge}
            onChange={(event) => { setBrief({ ...brief, challenge: event.target.checked }); setBuilt(false); }} className="mt-1 size-5 shrink-0 accent-navy-900" />Ask the assistant to challenge assumptions and suggest a small test.</label>
          <Button type="submit" variant="secondary">Build my prompt<ArrowRight className="size-4" aria-hidden="true" /></Button>
        </form>
        <div className="min-w-0 space-y-5">
          <div className="border border-line bg-paper p-5">
            <h3 id={`${id}-result-label`} className="font-semibold">Your reusable prompt</h3>
            {built ? <>
              <textarea id={`${id}-result`} aria-labelledby={`${id}-result-label`} readOnly value={prompt} rows={16} className="mt-3 w-full resize-y border border-edge bg-white p-3 text-sm" />
              <div className="mt-4 flex flex-wrap gap-3"><Button variant="secondary" onClick={async () => {
                try { await navigator.clipboard.writeText(prompt); setMessage("Prompt copied. Test it in your approved AI tool."); }
                catch { setMessage("Copy is unavailable. Select the prompt text or download it instead."); }
              }}><Copy className="size-4" aria-hidden="true" />Copy prompt</Button>
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(prompt)}`} download="my-ai-playbook.txt" className={buttonStyles({ variant: "outline" })}><Download className="size-4" aria-hidden="true" />Download .txt</a>
              </div>
            </> : <p id={`${id}-result`} className="mt-3 text-sm text-muted">Complete the brief and select “Build my prompt” to see your instructions here.</p>}
          </div>
          <div className="border-l-2 border-cyan-deep pl-5"><h3 className="font-semibold">Test it before you trust it</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm text-muted">
              <li>Run the same fictional input with a basic prompt and your structured brief.</li>
              <li>Check accuracy, missing facts, and whether the result follows the format. Count the corrections you had to make.</li>
              <li>Record total time, including review. A faster first draft is not necessarily a faster task.</li>
              <li>Change one instruction, retest, and save the improved playbook with its owner and last-tested date.</li>
            </ol>
            <p className="mt-4 text-sm">A document is enough to start. Tool-specific skills or memory features can help reuse it, but check which instructions the tool actually loaded.</p>
          </div>
        </div>
      </div>
      <p role="status" className="mt-5 text-sm text-cyan-deep">{message}</p>
      <details className="mt-5 border-t border-line pt-4 text-sm"><summary className="min-h-7 cursor-pointer font-semibold">Playbooks, connected tools, and quality checks</summary>
        <dl className="mt-3 space-y-3 text-muted">
          <div><dt className="font-semibold text-ink">Playbook</dt><dd>Your repeatable instructions, examples, and review criteria. Start with a document you can inspect and update.</dd></div>
          <div><dt className="font-semibold text-ink">Connected tool</dt><dd>Access to another app is separate from instructions. Confirm the account, minimum access needed, and which actions require a person&rsquo;s approval.</dd></div>
          <div><dt className="font-semibold text-ink">Quality check</dt><dd>A check before the next action: required fields, supported claims, acceptable tone, working links, or duplicate prevention. Automated checks help a human editor; they do not replace editorial judgment.</dd></div>
        </dl>
      </details>
    </details>
  </div>;
}
