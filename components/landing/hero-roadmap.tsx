"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { sessions } from "@/data/cohortData";

const AUTO_MS = 4200;
const agenda = sessions[0].agenda;
const segTones = ["navy", "cyan", "amber", "cyan", "navy"];

/**
 * Hero roadmap board: the eight sessions play on their own until someone
 * points at or focuses the board, and the run-of-show bar grows into place
 * when it scrolls into view. Mirrors the Academy spotlight on evobrand.net.
 */
export function HeroRoadmap() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const session = sessions[active];
  const last = sessions.length - 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Only auto-advance while the board is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % sessions.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, inView, reduce]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = sessions.length;
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (active + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
    setActive(next);
    setPaused(true);
    rootRef.current?.querySelector<HTMLButtonElement>(`#hero-tab-${next}`)?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="hero-board"
      data-revealed={revealed || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <p className="label text-amber">Eight sessions · seven working assets</p>

      <div className="hero-board__tabs" role="tablist" aria-label="Cohort sessions" onKeyDown={onKey}>
        {sessions.map((s, i) => (
          <button
            key={s.id}
            id={`hero-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="hero-panel"
            aria-label={`Session ${s.number}: ${s.theme}`}
            tabIndex={i === active ? 0 : -1}
            className={`hero-board__tab hero-board__tab--${s.focus.split(" ")[0].toLowerCase()}`}
            onClick={() => {
              setActive(i);
              setPaused(true);
            }}
          >
            <span aria-hidden="true">{s.number}</span>
            {i === active && !reduce && !paused && inView && (
              <span className="hero-board__timer" style={{ animationDuration: `${AUTO_MS}ms` }} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <div
        id="hero-panel"
        role="tabpanel"
        aria-labelledby={`hero-tab-${active}`}
        aria-live="polite"
        className="hero-board__panel"
      >
        <div key={active} className="hero-board__slide">
          <p className="label text-amber">
            Session {session.number} · {session.shortDate} · {session.focus}
          </p>
          <p className="mt-2 font-display text-2xl leading-snug sm:text-[1.75rem]">{session.theme}</p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-sm text-white/85">
            <span className="label !text-[0.6875rem] text-cyan">{active === last ? "Outcome" : "Deliverable"}</span>
            {session.deliverable?.title ?? "Lightning presentation & graduation"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <p className="label text-amber">Every session · the 90-minute run of show</p>
        {/* Proportional bar (decorative): each block's width is its share of the 90 minutes. The list below carries the same information for assistive tech. */}
        <div className="hero-board__bar" aria-hidden="true">
          {agenda.map((block, i) => (
            <span
              key={block.title}
              style={{ flexGrow: block.minutes, animationDelay: `${i * 120}ms` }}
              className={`hero-board__seg hero-board__seg--${segTones[i]}`}
            >
              {String(block.minutes).padStart(2, "0")}M
            </span>
          ))}
        </div>
        <ul className="grid gap-1.5 text-sm text-white/85">
          {agenda.map((block, i) => (
            <li key={block.title} className="flex items-center gap-2.5">
              <span aria-hidden="true" className={`hero-board__key hero-board__seg--${segTones[i]}`} />
              {block.title} <span className="text-white/55">{block.minutes} min</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
