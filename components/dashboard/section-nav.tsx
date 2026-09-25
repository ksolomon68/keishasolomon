"use client";

import { useEffect, useRef, useState } from "react";

export interface NavSection {
  id: string;
  label: string;
  /** Short status shown beside the label, e.g. "1/6" or "3 open". */
  badge?: string;
}

/** Sticky in-page nav with a compact mobile jump menu and a desktop section rail. */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const updateActive = () => {
      const navigationBottom = document
        .querySelector<HTMLElement>('nav[aria-label="Dashboard sections"]')
        ?.getBoundingClientRect().bottom ?? 64;
      // Switch as the next heading enters the comfortable reading band beneath both sticky bars.
      const stickyOffset = navigationBottom + 72;
      const current = [...targets].reverse().find((target) => target.getBoundingClientRect().top <= stickyOffset);
      setActive(current?.id ?? null);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("hashchange", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", updateActive);
    };
  }, [sections]);

  useEffect(() => {
    const rail = list.current;
    const item = active ? rail?.querySelector<HTMLElement>(`[data-section="${active}"]`) : null;
    if (!rail || !item) return;
    const left = item.offsetLeft - rail.clientWidth / 2 + item.clientWidth / 2;
    rail.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  const goTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActive(id);
    window.history.pushState(null, "", `#${id}`);
    const top = window.scrollY + target.getBoundingClientRect().top - 140;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLongJump = Math.abs(top - window.scrollY) > window.innerHeight * 1.5;
    if (reduceMotion || isLongJump) {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: Math.max(0, top) });
      window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
      return;
    }
    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  };

  return (
    <nav
      aria-label="Dashboard sections"
      className="sticky top-16 z-30 mt-10 border-y border-line bg-paper/95 backdrop-blur"
    >
      <div className="mx-auto flex min-h-14 max-w-7xl items-center gap-3 px-4 sm:hidden">
        <label htmlFor="dashboard-section" className="label shrink-0 text-amber-deep">
          Jump to
        </label>
        <select
          id="dashboard-section"
          value={active ?? ""}
          onChange={(event) => goTo(event.target.value)}
          className="min-h-11 min-w-0 flex-1 border border-edge bg-white px-3 text-base font-semibold text-navy-900"
        >
          <option value="" disabled>Choose a section</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}{section.badge ? ` · ${section.badge}` : ""}
            </option>
          ))}
        </select>
      </div>
      <ul ref={list} className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-6 sm:flex lg:px-8">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} data-section={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(s.id);
                }}
                className={`inline-flex min-h-12 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-[0.9375rem] font-semibold transition-colors motion-reduce:transition-none ${
                  isActive
                    ? "border-amber-deep text-navy-900"
                    : "border-transparent text-muted hover:bg-paper-deep hover:text-navy-900"
                }`}
              >
                {s.label}
                {s.badge && <span className="label text-muted">{s.badge}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
