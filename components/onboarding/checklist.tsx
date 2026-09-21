"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingChecklist, type ChecklistItem } from "@/data/cohortData";

const KEY = "sandbox:onboarding:v1";
const EVENT = "sandbox:onboarding-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

/** Raw JSON string so useSyncExternalStore can compare snapshots by value. */
function getSnapshot(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]"; // storage blocked (private mode): checklist still works for this page view
  }
}

const getServerSnapshot = () => "[]";

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

const groups: { key: ChecklistItem["group"]; title: string; note: string }[] = [
  { key: "bring", title: "Bring to every session", note: "Laptops are required. No coding background needed." },
  { key: "accounts", title: "Set up before your first session", note: "Have these ready on your laptop before Day 1." },
];

export function OnboardingChecklist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [temporary, setTemporary] = useState<string[] | null>(null);
  const checked = temporary ?? parse(raw);

  const toggle = (id: string) => {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
      setTemporary(null);
    } catch {
      setTemporary(next);
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const total = onboardingChecklist.length;
  const done = onboardingChecklist.filter((i) => checked.includes(i.id)).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border border-navy-900 bg-navy-900 p-5 text-white" data-surface="dark">
        <div className="min-w-0 flex-1">
          <p className="label text-amber">Your progress</p>
          <p className="mt-1 font-display text-2xl" role="status">
            {done} of {total} ready
          </p>
        </div>
        <progress
          className="h-2 w-full flex-1 basis-56 overflow-hidden rounded-none bg-white/20 [&::-moz-progress-bar]:bg-amber [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-amber"
          value={done}
          max={total}
          aria-label="Onboarding checklist progress"
        />
        <Button variant="outline" size="sm" className="no-print text-white" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden="true" />
          Print
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {groups.map((group) => (
          <fieldset key={group.key} className="min-w-0 border border-line bg-white p-5 sm:p-7">
            <legend className="px-2 font-display text-2xl text-navy-900">{group.title}</legend>
            <p className="mb-4 text-sm text-muted">{group.note}</p>
            <ul className="space-y-3">
              {onboardingChecklist
                .filter((item) => item.group === group.key)
                .map((item) => {
                  const isChecked = checked.includes(item.id);
                  return (
                    <li key={item.id}>
                      <label
                        className={`flex cursor-pointer gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy-900 ${
                          isChecked ? "border-success bg-success/5" : "border-line hover:border-navy-900"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isChecked}
                          onChange={() => toggle(item.id)}
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 grid size-6 shrink-0 place-items-center border-2 ${
                            isChecked ? "border-success bg-success text-white" : "border-edge bg-white text-transparent"
                          }`}
                        >
                          <Check className="size-4" strokeWidth={3} />
                        </span>
                        <span>
                          <span className="block font-semibold text-ink">{item.title}</span>
                          <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{item.detail}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          </fieldset>
        ))}
      </div>
      <p role="status" className="no-print mt-5 text-sm text-muted">{temporary ? "Browser storage is unavailable. Your checklist works for this visit, but will reset when you reload." : "Your checklist progress is saved in this browser only."}</p>
    </div>
  );
}
