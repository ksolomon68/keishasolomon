"use client";

import { useEffect } from "react";

/** Make direct links work even when a task lives inside closed disclosures. */
export function DashboardPath() {
  useEffect(() => {
    const reveal = (hash: string) => {
      if (!hash.startsWith("#")) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      const ancestors: HTMLDetailsElement[] = [];
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) ancestors.unshift(parent);
      }
      ancestors.forEach((ancestor) => { ancestor.open = true; });
      if (target instanceof HTMLDetailsElement) target.open = true;
      if (hash === "#deliverables") {
        const current = target.querySelector<HTMLDetailsElement>("details[data-current-work]");
        if (current) current.open = true;
      }
      if (hash.startsWith("#deliverable-")) {
        const guide = target.querySelector<HTMLDetailsElement>("details[data-session-guide]");
        if (guide) guide.open = true;
      }
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start", behavior: "instant" });
        const focus = target instanceof HTMLDetailsElement ? target.querySelector("summary") : target;
        if (focus instanceof HTMLElement) {
          if (!focus.hasAttribute("tabindex") && focus.tagName !== "SUMMARY") focus.tabIndex = -1;
          focus.focus({ preventScroll: true });
        }
      });
    };
    const onHash = () => reveal(window.location.hash);
    const onClick = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      const hash = anchor?.getAttribute("href");
      if (hash?.startsWith("#")) reveal(hash);
    };
    onHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return null;
}
