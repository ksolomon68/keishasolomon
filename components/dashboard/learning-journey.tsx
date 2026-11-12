"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import type { Session } from "@/data/cohortData";
import { learningGuides } from "@/data/learning-guides";
import { learningRewards, readLearningProgress } from "@/lib/learning-journey";
import { Button, buttonStyles } from "@/components/ui/button";
import { PromptGenerator } from "./prompt-generator";
import { DecisionPractice } from "./decision-practice";

const changed = "sandbox-learning-progress";
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(changed, notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener(changed, notify); };
}

export function LearningJourney({ userId, schedule }: { userId: string; schedule: Session[] }) {
  const storageKey = `sandbox:learning:v1:${userId}`;
  const raw = useSyncExternalStore(subscribe, () => { try { return localStorage.getItem(storageKey); } catch { return null; } }, () => null);
  const [temporaryProgress, setTemporaryProgress] = useState<string | null>(null);
  const done = readLearningProgress(temporaryProgress ?? raw, schedule.map(session => session.id));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [checks, setChecks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selected = schedule.find(session => session.id === selectedId) ?? schedule.find(session => !done.includes(session.id)) ?? schedule[0];
  if (!selected) return null;
  const guide = learningGuides[selected.id];
  const criteria = guide?.criteria ?? ["My demo shows the original problem and a working solution.", "My results include review effort, limitations, and evidence.", "I have a clear next experiment or adoption decision."];
  const rewards = learningRewards(done.length, schedule.length);
  const choose = (id: string) => {setSelectedId(id); setStage(0); setChecks([]); setMessage("");};
  const next = schedule.find(session => session.id !== selected.id && !done.includes(session.id));
  const complete = () => {
    if (checks.length !== criteria.length || done.includes(selected.id)) return;
    setSelectedId(selected.id);
    const updated = JSON.stringify([...done, selected.id]);
    try {localStorage.setItem(storageKey, updated); window.dispatchEvent(new Event(changed)); setMessage("Module complete! +100 practice XP. Your next adventure is ready.");}
    catch {setTemporaryProgress(updated); setMessage("Module complete! +100 practice XP for this visit. Browser storage is unavailable, so progress will reset when you leave.");}
  };
  return <section id="learning-path" aria-labelledby="learning-path-title" className="scroll-mt-40">
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div><p className="label text-cyan-deep">Your self-guided adventure</p><h2 id="learning-path-title" className="mt-2 font-display text-3xl sm:text-4xl">Small steps. Real skills.</h2>
          <p className="mt-3 max-w-2xl text-muted">Explore a module, try its prompt, and check your work. Start anywhere and move at your own pace. You don&rsquo;t need to wait for a live class.</p></div>
        <div className="rounded-xl border border-amber/40 bg-amber/10 p-4"><p className="flex items-center gap-2 font-semibold"><Trophy className="size-5 text-amber-deep" aria-hidden="true" />{rewards.level}</p><p className="mt-1 text-2xl font-semibold">{rewards.xp} practice XP</p><p className="text-sm text-muted">{done.length}/{schedule.length} modules complete</p></div>
      </div>
      <progress className="mt-5 h-3 w-full accent-cyan-deep" value={done.length} max={schedule.length} aria-label="Self-study modules completed" />
      <ul aria-label="Learning badges" className="mt-4 flex flex-wrap gap-3">{rewards.badges.map(badge => <li key={badge.name} title={badge.description} className={`rounded-full border px-3 py-2 text-sm ${badge.earned ? "border-cyan-deep bg-cyan-deep/10 text-cyan-deep" : "border-line text-muted"}`}><span aria-hidden="true">{badge.earned ? "★" : "☆"}</span> {badge.name}<span className="sr-only"> — {badge.description}: {badge.earned ? "earned" : "not yet earned"}</span></li>)}</ul>
      <p className="mt-3 text-xs text-muted">Self-study checks and XP stay in this browser for your account. They don&rsquo;t replace submitted work, instructor feedback, or certificate requirements.</p>
      <nav aria-label="Course modules" className="mt-6"><ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{schedule.map(session => <li key={session.id}>
        <button type="button" aria-current={selected.id === session.id ? "step" : undefined} onClick={() => choose(session.id)} className={`flex h-full min-h-28 w-full gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-paper ${selected.id === session.id ? "border-cyan-deep bg-paper ring-1 ring-cyan-deep" : "border-line"}`}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">{done.includes(session.id) ? <CheckCircle2 aria-label="Completed" className="size-4" /> : session.number}</span>
          <span><span className="block text-xs font-semibold text-cyan-deep">Module {session.number} · {done.includes(session.id) ? "Complete" : "Explore"}</span><span className="mt-1 block text-sm font-semibold">{session.theme}</span></span>
        </button>
      </li>)}</ol></nav>
      <article aria-label={`Module ${selected.number} workspace`} className="mt-6 rounded-xl border border-line bg-paper p-4 sm:p-6">
        <p className="label text-amber-deep">Module {selected.number} mission</p><h3 className="mt-2 font-display text-2xl">{selected.lab.name}</h3><p className="mt-2 text-muted">{selected.lab.description}</p>
        <div role="group" aria-label="Module steps" className="my-5 flex flex-wrap gap-2">{["1. Learn & try", "2. Generate a prompt", "3. Self-check & earn XP"].map((label, index) => <Button key={label} variant={stage === index ? "secondary" : "outline"} aria-pressed={stage === index} onClick={() => setStage(index)}>{label}</Button>)}</div>
        {stage === 0 && <div className="space-y-5">
          <p><a href={`#session-${selected.id}`} className="font-semibold text-cyan-deep underline underline-offset-4">Open this module&rsquo;s schedule &amp; materials</a></p>
          <p className="font-semibold">Your starting point</p><p>{guide?.prepare ?? "Prepare a five-minute demo: the problem, your solution, what you tested, what happened, and what you would do next."}</p>
          <ol className="list-decimal space-y-3 pl-5">{(guide?.steps ?? ["Show the problem and who it affects.", "Demonstrate your artifact using fictional input.", "Explain your evidence, limitations, and next decision."]).map(step => <li key={step}>{step}</li>)}</ol>
          {guide && <aside className="rounded-lg bg-white p-4"><h4 className="font-semibold">See it in action · fictional example</h4><p className="mt-2 text-muted">{guide.example}</p></aside>}
          {guide && <details className="rounded-lg border border-line bg-white p-4"><summary className="min-h-11 cursor-pointer font-semibold">Your starter worksheet</summary><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm">{guide.starter}</pre></details>}
          <DecisionPractice key={selected.id} sessionId={selected.id} />
          <Button variant="secondary" onClick={() => setStage(1)}>Next: create my prompt <ArrowRight className="size-4" aria-hidden="true" /></Button>
        </div>}
        {stage === 1 && <div className="space-y-4"><PromptGenerator key={selected.id} task={selected.deliverable?.description ?? "Help me rehearse a five-minute evidence-based capstone demonstration"} /><Button variant="secondary" onClick={() => setStage(2)}>Next: check my work <ArrowRight className="size-4" aria-hidden="true" /></Button></div>}
        {stage === 2 && <div className="space-y-4">
          <h4 className="text-xl font-semibold">Ready for your victory lap?</h4><p>Try the exercise and use these checks to review your result. If something is missing, return to the guide or improve your prompt. You can repeat this as often as you like.</p>
          <fieldset><legend className="sr-only">Module success checklist</legend>{criteria.map(criterion => <label key={criterion} className="mt-2 flex min-h-12 cursor-pointer gap-3 rounded-lg border border-line bg-white p-3"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-cyan-deep" checked={checks.includes(criterion)} onChange={event => setChecks(event.target.checked ? [...checks, criterion] : checks.filter(item => item !== criterion))} /><span>{criterion}</span></label>)}</fieldset>
          <Button variant="secondary" disabled={checks.length !== criteria.length || done.includes(selected.id)} onClick={complete}><Sparkles aria-hidden="true" className="size-4" />{done.includes(selected.id) ? "Module completed · 100 XP earned" : "Complete module · earn 100 XP"}</Button>
          {selected.deliverable && <p><a className={buttonStyles({variant: "outline"})} href={`#deliverable-${selected.id}`}>Save or submit my assignment <ArrowRight className="size-4" aria-hidden="true" /></a></p>}
          {!selected.deliverable && <p><a href="#capstone" className={buttonStyles({variant: "outline"})}>Review my capstone milestones <ArrowRight className="size-4" aria-hidden="true" /></a></p>}
          {done.includes(selected.id) && (next ? <Button variant="secondary" onClick={() => choose(next.id)}>Continue to module {next.number} <ArrowRight className="size-4" aria-hidden="true" /></Button> : <p className="font-semibold text-cyan-deep">You explored every module! Review your saved work and capstone milestones below.</p>)}
        </div>}
        <p role="status" className="mt-4 font-semibold text-cyan-deep">{message}</p>
      </article>
    </div>
  </section>;
}
