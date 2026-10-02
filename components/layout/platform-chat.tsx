"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { answerPlatformQuestion, type ChatAnswer } from "@/lib/platform-chat";

type Message = { role: "user" | "assistant"; text: string; answer?: ChatAnswer };
const greeting: Message = { role: "assistant", text: "Hi! I'm your Sandbox guide. Ask me about the program, signing up, assignments, tools, or coaching." };
const suggestions = ["How do I register?", "What should I bring?", "How do I submit work?", "How do I book coaching?"];

export function PlatformChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [question, setQuestion] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [open, messages]);

  function close() { setOpen(false); launcher.current?.focus(); }
  function ask(value: string) {
    const text = value.trim().slice(0, 500);
    if (!text) return;
    const previous = messages.findLast((message) => message.answer)?.answer?.topic;
    const answer = answerPlatformQuestion(text, previous);
    const additions: Message[] = [{ role: "user", text }, { role: "assistant", text: answer.text, answer }];
    setMessages((current) => [...current, ...additions].slice(-40));
    setQuestion("");
    input.current?.focus();
  }

  return <div className="fixed bottom-4 right-4 z-50 print:hidden sm:bottom-6 sm:right-6">
    {open && <section id="platform-chat" role="dialog" aria-labelledby="platform-chat-title" onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }} className="mb-3 flex h-[min(620px,calc(100dvh-110px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-line bg-paper text-ink shadow-2xl">
      <header className="flex items-center justify-between gap-3 bg-navy-900 px-4 py-3 text-white">
        <div><h2 id="platform-chat-title" className="font-semibold">Sandbox guide</h2><p className="text-xs text-on-navy">Answers from platform guidance</p></div>
        <button type="button" onClick={close} aria-label="Close chat" className="flex size-11 items-center justify-center rounded hover:bg-navy-700"><X className="size-5" aria-hidden="true" /></button>
      </header>
      <p className="border-b border-line px-4 py-2 text-xs text-muted">General guidance only. Keep passwords and private data out of chat.</p>
      <div ref={log} role="log" aria-label="Chat conversation" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => <div key={index} className={`rounded-lg p-3 text-sm ${message.role === "user" ? "ml-7 bg-navy-900 text-white" : "mr-3 border border-line bg-white"}`}>
          <span className="sr-only">{message.role === "user" ? "You" : "Sandbox guide"}: </span>
          <p className="whitespace-pre-line">{message.text}</p>
          {message.answer && <Link href={message.answer.href} className="mt-3 inline-block font-semibold text-cyan-deep underline underline-offset-4">{message.answer.label}</Link>}
        </div>)}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">{suggestions.map((text) => <button key={text} type="button" onClick={() => ask(text)} className="min-h-9 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium hover:border-cyan-deep">{text}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); ask(question); }} className="flex gap-2 px-4 pb-3">
        <label htmlFor="platform-chat-question" className="sr-only">Your platform question</label>
        <input ref={input} id="platform-chat-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={500} placeholder="Ask about the platform…" autoComplete="off" className="min-h-11 min-w-0 flex-1 rounded border border-line bg-white px-3 text-base" />
        <button type="submit" disabled={!question.trim()} aria-label="Send question" className="flex size-11 shrink-0 items-center justify-center rounded bg-navy-900 text-white disabled:opacity-40"><Send className="size-4" aria-hidden="true" /></button>
      </form>
      <button type="button" onClick={() => { setMessages([greeting]); setQuestion(""); input.current?.focus(); }} className="self-start px-4 pb-3 text-xs text-muted underline">Clear conversation</button>
    </section>}
    <button ref={launcher} type="button" onClick={() => open ? close() : setOpen(true)} aria-expanded={open} aria-controls="platform-chat" className="ml-auto flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-navy-700"><MessageCircle className="size-5" aria-hidden="true" />{open ? "Close chat" : "Ask Sandbox"}</button>
  </div>;
}
