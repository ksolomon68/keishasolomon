"use client";

import { useState, type ReactNode } from "react";
import { Button, buttonStyles } from "@/components/ui/button";
import { assistantPlan, contentDrafts, scoreLead, type LeadInput } from "@/lib/internal-tools";

const inputStyle = "mt-1 block min-h-11 w-full border border-edge bg-white px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-navy-900">{label}{children}</label>;
}

function Export({ text, name }: { text: string; name: string }) {
  return <a className={buttonStyles({ variant: "outline" })} href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`} download={`${name}.txt`}>Download results</a>;
}

export function InternalTool({ sessionId }: { sessionId: string }) {
  return <div className="my-5 border border-line bg-white p-4 sm:p-5">
    <p className="mb-4 text-sm text-muted">Use fictional examples for practice. Work stays in this page while it is open; download your results before leaving, then upload them with your session deliverable.</p>
    {sessionId === "s1" ? <AssistantSelector /> : sessionId === "s4" ? <LeadTracker /> : sessionId === "s5" ? <ContentStudio /> : null}
  </div>;
}

function AssistantSelector() {
  const [task, setTask] = useState("drafting");
  const [privacy, setPrivacy] = useState("public");
  const [budget, setBudget] = useState("free");
  const [team, setTeam] = useState("solo");
  const [result, setResult] = useState("");
  return <div className="space-y-4">
    <h3 className="font-display text-xl">Assistant Selection Planner</h3>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Main task"><select className={inputStyle} value={task} onChange={(e) => setTask(e.target.value)}><option value="drafting">Writing and everyday planning</option><option value="research">Research and source checking</option><option value="data">Spreadsheet and document analysis</option></select></Field>
      <Field label="Data boundary"><select className={inputStyle} value={privacy} onChange={(e) => setPrivacy(e.target.value)}><option value="public">Public or fictional information</option><option value="restricted">Internal or sensitive information</option></select></Field>
      <Field label="Budget"><select className={inputStyle} value={budget} onChange={(e) => setBudget(e.target.value)}><option value="free">Free starting point</option><option value="paid">Paid pilot possible</option></select></Field>
      <Field label="Who will use it?"><select className={inputStyle} value={team} onChange={(e) => setTeam(e.target.value)}><option value="solo">Just me</option><option value="team">A team</option></select></Field>
    </div>
    <Button type="button" variant="secondary" onClick={() => setResult(assistantPlan(task, privacy, budget, team))}>Create selection plan</Button>
    {result && <div className="space-y-3"><label className="block font-semibold">Your editable plan<textarea className={`${inputStyle} min-h-72 font-normal`} value={result} onChange={(e) => setResult(e.target.value)} /></label><Export text={result} name="assistant-selection-plan" /></div>}
  </div>;
}

function LeadTracker() {
  const blank: LeadInput = { name: "", need: "", fit: 1, urgency: 1, readiness: 1, followUp: "" };
  const [draft, setDraft] = useState<LeadInput>(blank);
  const [leads, setLeads] = useState<(LeadInput & { id: number; done: boolean })[]>([]);
  const [message, setMessage] = useState("");
  const update = (key: keyof LeadInput, value: string | number) => setDraft({ ...draft, [key]: value });
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  return <div className="space-y-4">
    <h3 className="font-display text-xl">Lead Priority Tracker</h3>
    <p className="text-sm text-muted">Transparent practice score: fit contributes 40 points, urgency 30, and readiness 30. Review these teaching rules against your own business needs.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Fictional lead name"><input className={inputStyle} maxLength={120} value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field>
      <Field label="Inquiry or need"><input className={inputStyle} maxLength={500} value={draft.need} onChange={(e) => update("need", e.target.value)} /></Field>
      {(["fit", "urgency", "readiness"] as const).map((key) => <Field key={key} label={key === "fit" ? "Fit with your offer" : key === "urgency" ? "Urgency" : "Readiness to act"}><select className={inputStyle} value={draft[key]} onChange={(e) => update(key, Number(e.target.value))}><option value={0}>Low or unknown</option><option value={1}>Moderate</option><option value={2}>High</option></select></Field>)}
      <Field label="Follow-up date"><input type="date" className={inputStyle} value={draft.followUp} onChange={(e) => update("followUp", e.target.value)} /></Field>
    </div>
    <Button type="button" variant="secondary" onClick={() => {
      if (!draft.name.trim() || !draft.need.trim() || !draft.followUp) { setMessage("Add a name, inquiry, and follow-up date."); return; }
      if (leads.some((lead) => lead.name.trim().toLowerCase() === draft.name.trim().toLowerCase() && lead.need.trim().toLowerCase() === draft.need.trim().toLowerCase())) { setMessage("This name and inquiry already exist. Review the existing lead before adding a duplicate."); return; }
      setLeads([...leads, { ...draft, name: draft.name.trim(), need: draft.need.trim(), id: Date.now(), done: false }]); setDraft(blank); setMessage("Lead added. Download the tracker to keep a copy.");
    }}>Add lead</Button>
    <p role="status" className="text-sm text-muted">{message}</p>
    {!leads.length ? <p className="text-sm text-muted">Add your first fictional inquiry to see its priority and follow-up status.</p> : <>
      <ul className="space-y-3">{[...leads].sort((a, b) => scoreLead(b).score - scoreLead(a).score).map((lead) => { const scored = scoreLead(lead); return <li key={lead.id} className="border border-line p-3"><p className="font-semibold">{lead.name} · {scored.priority} priority ({scored.score}/100)</p><p className="mt-1 break-words text-sm">{lead.need}</p><p className="mt-1 text-sm text-muted">{scored.reason}</p><p className="mt-1 text-sm">{lead.done ? "Follow-up completed" : lead.followUp < today ? "Overdue" : lead.followUp === today ? "Due today" : "Upcoming"} · {lead.followUp}</p><label className="mt-2 flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={lead.done} onChange={(e) => setLeads(leads.map((item) => item.id === lead.id ? { ...item, done: e.target.checked } : item))} />Follow-up completed</label></li>; })}</ul>
      <Export name="lead-priority-tracker" text={leads.map((lead) => `${lead.name}\n${lead.need}\n${scoreLead(lead).reason}\nPriority: ${scoreLead(lead).priority} (${scoreLead(lead).score}/100)\nFollow-up: ${lead.followUp} / ${lead.done ? "completed" : "pending"}`).join("\n\n")} />
    </>}
  </div>;
}

function ContentStudio() {
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [action, setAction] = useState("");
  const [drafts, setDrafts] = useState<{ channel: string; text: string }[]>([]);
  const [message, setMessage] = useState("");
  return <div className="space-y-4">
    <h3 className="font-display text-xl">Content Draft Studio</h3>
    <p className="text-sm text-muted">Build editable LinkedIn, Instagram, and email drafts from your own material. This uses templates rather than AI generation. Review facts, voice, and accessibility before publishing.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Source idea or headline"><input className={inputStyle} maxLength={200} value={idea} onChange={(e) => setIdea(e.target.value)} /></Field>
      <Field label="Audience"><input className={inputStyle} maxLength={200} value={audience} onChange={(e) => setAudience(e.target.value)} /></Field>
      <Field label="Supported takeaway"><textarea className={inputStyle} maxLength={3000} value={takeaway} onChange={(e) => setTakeaway(e.target.value)} /></Field>
      <Field label="Call to action"><input className={inputStyle} maxLength={300} value={action} onChange={(e) => setAction(e.target.value)} /></Field>
    </div>
    <Button type="button" variant="secondary" onClick={() => {
      if (![idea, audience, takeaway, action].every((value) => value.trim())) { setMessage("Complete all four fields to create drafts."); return; }
      if (drafts.length && !window.confirm("Replace your current edited drafts with new templates? Download them first if you want to keep them.")) return;
      setDrafts(contentDrafts(idea.trim(), audience.trim(), takeaway.trim(), action.trim())); setMessage("Three drafts created. Edit each one before adding it to your calendar.");
    }}>Create three drafts</Button>
    <p role="status" className="text-sm text-muted">{message}</p>
    {drafts.map((draft, index) => <Field key={draft.channel} label={`${draft.channel} · draft`}><textarea className={`${inputStyle} min-h-48 font-normal`} value={draft.text} onChange={(e) => setDrafts(drafts.map((item, i) => i === index ? { ...item, text: e.target.value } : item))} /></Field>)}
    {drafts.length > 0 && <Export name="content-drafts" text={drafts.map((draft) => `${draft.channel.toUpperCase()} — DRAFT\n${draft.text}\n\nCalendar date / owner / approval status:\nFacts checked / voice edits / accessibility checks:`).join("\n\n")} />}
  </div>;
}
