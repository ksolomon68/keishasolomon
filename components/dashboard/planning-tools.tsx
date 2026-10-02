"use client";
import { useState } from "react";
import { useToolState } from "./tool-draft";
import { Button, buttonStyles } from "@/components/ui/button";
import { measureOutcome } from "@/lib/outcomes";

const inputStyle = "mt-1 block min-h-11 w-full border border-edge bg-white px-3 py-2 text-sm font-normal";
function Entry({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="block text-sm font-semibold">{label}{multiline ? <textarea className={`${inputStyle} min-h-28`} maxLength={12000} value={value} onChange={(e) => onChange(e.target.value)} /> : <input className={inputStyle} maxLength={500} value={value} onChange={(e) => onChange(e.target.value)} />}</label>;
}
function Download({ text, name }: { text: string; name: string }) {
  return <a className={buttonStyles({ variant: "outline" })} href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`} download={`${name}.txt`}>Download results</a>;
}

export function WorkflowPlanner() {
  const [task, setTask] = useToolState("task", "");
  const [input, setInput] = useToolState("input", "");
  const [steps, setSteps] = useToolState("steps", "");
  const [output, setOutput] = useToolState("output", "");
  const [review, setReview] = useToolState("review", "");
  const [owner, setOwner] = useToolState("owner", "");
  const [recovery, setRecovery] = useToolState("recovery", "");
  const [result, setResult] = useToolState("result", "");
  const [message, setMessage] = useState("");
  return <div className="space-y-4">
    <h3 className="font-display text-xl">Workflow Planner</h3>
    <p className="text-sm text-muted">Map one recurring task before building it. This planner creates an editable playbook; it does not execute or connect to other systems.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Entry label="Recurring task" value={task} onChange={setTask} />
      <Entry label="Workflow owner" value={owner} onChange={setOwner} />
      <Entry label="Trigger, inputs, and permitted data" value={input} onChange={setInput} multiline />
      <Entry label="Steps and decision rules (one per line)" value={steps} onChange={setSteps} multiline />
      <Entry label="Expected output and success criteria" value={output} onChange={setOutput} multiline />
      <Entry label="Human review and approval point" value={review} onChange={setReview} multiline />
      <Entry label="When to pause and how to recover" value={recovery} onChange={setRecovery} multiline />
    </div>
    <Button type="button" variant="secondary" onClick={() => {
      if (![task, owner, input, steps, output, review, recovery].every((value) => value.trim())) { setMessage("Complete each field to create your playbook."); return; }
      if (result && !window.confirm("Replace your edited playbook with the current fields? Download it first to keep a copy.")) return;
      setResult(`WORKFLOW PLAYBOOK\nTask: ${task}\nOwner: ${owner}\n\nTRIGGER AND INPUTS\n${input}\n\nSTEPS AND RULES\n${steps}\n\nOUTPUT AND SUCCESS CRITERIA\n${output}\n\nHUMAN REVIEW\n${review}\n\nPAUSE AND RECOVERY\n${recovery}\n\nTEST RECORD\nNormal case:\nMissing input:\nUnexpected result:\nTime including review and corrections:\nNext change:`);
      setMessage("Playbook created. Test the normal case and two failure cases, then record what happened.");
    }}>Create workflow playbook</Button>
    <p role="status" className="text-sm text-muted">{message}</p>
    {result && <><Entry label="Your editable workflow playbook" value={result} onChange={setResult} multiline /><Download text={result} name="workflow-playbook" /></>}
  </div>;
}

export function OutcomeTracker() {
  const [task, setTask] = useToolState("task", "");
  const [baseline, setBaseline] = useToolState("baseline", "");
  const [frequency, setFrequency] = useToolState("frequency", "");
  const [trials, setTrials] = useToolState("trials", "");
  const [quality, setQuality] = useToolState("quality", "");
  const [decision, setDecision] = useToolState("decision", "revise");
  const [reason, setReason] = useToolState("reason", "");
  const outcome = measureOutcome(baseline, frequency, trials);
  const record = `CAPSTONE OUTCOME RECORD\nTask: ${task}\nBaseline minutes per task: ${baseline}\nOccurrences per week: ${frequency}\n\nTRIALS (setup, execution, review, corrections)\n${trials}\n\nQUALITY AND EVIDENCE\n${quality}\n\n${outcome ? `${outcome.count} trials\nAverage total minutes: ${outcome.average.toFixed(1)}\nNet minutes saved per task: ${outcome.saved.toFixed(1)}\nEstimated weekly minutes saved: ${outcome.weekly.toFixed(1)}` : "Timing record incomplete or invalid."}\nDecision: ${decision}\nReason / next step: ${reason}\nWeekly impact is an estimate based on the stated frequency. Setup is included in every trial; keep zero or negative results.`;
  return <div className="space-y-4">
    <h3 className="font-display text-xl">Capstone Outcome Tracker</h3>
    <p className="text-sm text-muted">Record comparable baseline and trial times in Session 7, then return here for your Session 8 presentation. Include all effort and keep zero or negative results.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Entry label="Capstone task" value={task} onChange={setTask} />
      <Entry label="Baseline minutes per task" value={baseline} onChange={setBaseline} />
      <Entry label="Occurrences per week" value={frequency} onChange={setFrequency} />
    </div>
    <p id="trial-format" className="text-sm text-muted">One trial per line: setup, execution, review, correction minutes. Example: 5, 10, 4, 1. Use 0 for no time spent in a stage. Aim for three comparable trials.</p>
    <label className="block text-sm font-semibold">Trial times<textarea aria-describedby="trial-format" className={`${inputStyle} min-h-28`} maxLength={12000} value={trials} onChange={(e) => setTrials(e.target.value)} /></label>
    <Entry label="Quality checks, errors, and evidence for each trial" value={quality} onChange={setQuality} multiline />
    <label className="block text-sm font-semibold">Decision<select className={inputStyle} value={decision} onChange={(e) => setDecision(e.target.value)}><option value="revise">Revise and test again</option><option value="adopt">Adopt with review</option><option value="stop">Stop</option></select></label>
    <Entry label="Decision reason and next step" value={reason} onChange={setReason} multiline />
    <div role="status" className="border border-line p-4 text-sm">{outcome ? <><p>{outcome.count} trial{outcome.count === 1 ? "" : "s"} · Average total time: {outcome.average.toFixed(1)} minutes</p><p>Net time saved per task: {outcome.saved.toFixed(1)} minutes</p><p>Estimated weekly impact: {outcome.weekly.toFixed(1)} minutes saved</p><p className="mt-2 text-muted">This includes setup, execution, review, and corrections. Weekly impact assumes your stated frequency; quality and approval determine whether to adopt.</p></> : "Enter a positive baseline and frequency, and four nonnegative times per trial to calculate the outcome."}</div>
    <Download text={record} name="capstone-outcome-record" />
  </div>;
}
