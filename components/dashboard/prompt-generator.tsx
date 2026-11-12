"use client";

import { useId, useState } from "react";
import { Copy, Download, Sparkles } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { buildPracticePrompt } from "@/data/cohort-practice";
import { promptRecipes, recipeBrief } from "@/lib/learning-journey";

export function PromptGenerator({ task = "" }: { task?: string }) {
  const id = useId();
  const [recipe, setRecipe] = useState<keyof typeof promptRecipes>("plan");
  const [goal, setGoal] = useState(task);
  const [audience, setAudience] = useState("");
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const invalidate = () => { setPrompt(""); setMessage(""); };
  return <section aria-label="Quick prompt generator" className="rounded-xl border border-line bg-white p-5 sm:p-6">
    <h3 className="flex items-center gap-2 text-xl font-semibold"><Sparkles aria-hidden="true" className="size-5 text-amber-deep" />Prompt playground</h3>
    <p className="mt-2 text-sm text-muted">Choose a starting point, add your details, and get a prompt to copy into your approved AI tool. Use fictional or sanitized information. This builder does not send your input to an AI service.</p>
    <form className="mt-5 space-y-4" onSubmit={event => {
      event.preventDefault();
      if (![goal, audience, input].every(value => value.trim())) { setMessage("Add your goal, audience, and sample input first."); return; }
      setPrompt(buildPracticePrompt(recipeBrief(recipe, goal, audience, input)));
      setMessage("Prompt ready! Copy or download it, try it in your approved tool, then check the result against your module checklist.");
    }}>
      <label className="block text-sm font-semibold" htmlFor={`${id}-recipe`}>What would you like to create?</label>
      <select id={`${id}-recipe`} value={recipe} onChange={event => { const next = event.target.value as keyof typeof promptRecipes; setRecipe(next); setGoal(promptRecipes[next].task); invalidate(); }} className="min-h-12 w-full border border-edge bg-white p-3">
        {Object.entries(promptRecipes).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
      </select>
      <Button variant="outline" type="button" onClick={() => { setGoal("Turn fictional event notes into a practical action plan"); setAudience("A volunteer coordinator"); setInput("Fictional example: Jordan will draft an event agenda by Thursday. A room booking is needed, but nobody agreed on an owner or deadline."); setRecipe("plan"); invalidate(); }}>Try a fictional example</Button>
      {([{key: "goal", label: "My goal", value: goal, set: setGoal}, {key: "audience", label: "Who is this for?", value: audience, set: setAudience}, {key: "input", label: "Background & sample input", value: input, set: setInput}] as const).map(field => <div key={field.key}>
        <label htmlFor={`${id}-${field.key}`} className="block text-sm font-semibold">{field.label}</label>
        <textarea id={`${id}-${field.key}`} required maxLength={3000} rows={field.key === "input" ? 4 : 2} value={field.value} onChange={event => {field.set(event.target.value); invalidate();}} className="mt-2 w-full resize-y border border-edge bg-white p-3 text-base" />
      </div>)}
      <Button type="submit" variant="secondary">Generate my prompt <Sparkles aria-hidden="true" className="size-4" /></Button>
    </form>
    {prompt && <div className="mt-6 rounded-lg border border-cyan-deep bg-paper p-4">
      <label htmlFor={`${id}-result`} className="font-semibold">Your ready-to-use prompt</label>
      <textarea id={`${id}-result`} readOnly value={prompt} rows={12} className="mt-3 w-full border border-edge bg-white p-3 text-sm" />
      <div className="mt-3 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={async () => {try {await navigator.clipboard.writeText(prompt); setMessage("Copied! Test the prompt, check facts and missing information, then improve one instruction.");} catch {setMessage("Select the prompt text to copy it, or use Download prompt.");}}}><Copy aria-hidden="true" className="size-4" />Copy prompt</Button>
        <a className={buttonStyles({variant: "outline"})} href={`data:text/plain;charset=utf-8,${encodeURIComponent(prompt)}`} download="sandbox-prompt.txt"><Download aria-hidden="true" className="size-4" />Download prompt</a>
      </div>
    </div>}
    <p role="status" className="mt-3 text-sm text-cyan-deep">{message}</p>
    <p className="mt-3 text-xs text-muted">Inputs stay in this page and clear when you leave. Copy or download your prompt to keep it.</p>
  </section>;
}
