"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { saveToolDraftAction } from "@/app/actions/tool-drafts";
import type { ToolDraft } from "@/lib/store";
import { Button, buttonStyles } from "@/components/ui/button";

const DraftContext = createContext<{ data: Record<string, unknown>; setData: Dispatch<SetStateAction<Record<string, unknown>>> } | null>(null);

export function useToolState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const context = useContext(DraftContext);
  if (!context) throw new Error("Tool state requires a draft workspace.");
  const value = (context.data[key] ?? initial) as T;
  const set: Dispatch<SetStateAction<T>> = (next) => context.setData((previous) => ({ ...previous, [key]: typeof next === "function" ? (next as (old: T) => T)((previous[key] ?? initial) as T) : next }));
  return [value, set];
}

export function ToolDraftWorkspace({ sessionId, initial, children }: { sessionId: string; initial?: ToolDraft; children: ReactNode }) {
  const [data, setData] = useState<Record<string, unknown>>(initial?.data ?? {});
  const [saved, setSaved] = useState(JSON.stringify(initial?.data ?? {}));
  const [version, setVersion] = useState(initial?.version ?? 0);
  const [pending, setPending] = useState(false);
  const saving = useRef(false);
  const [message, setMessage] = useState(initial ? "Saved to your account." : "Start your draft, then save it to your account.");
  const dirty = JSON.stringify(data) !== saved;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return <DraftContext.Provider value={{ data, setData }}>
    {children}
    <div className="mt-5 border-t border-line pt-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" disabled={pending || !dirty} onClick={async () => {
          if (saving.current) return;
          saving.current = true; setPending(true);
          const snapshot = JSON.stringify(data);
          try {
            const result = await saveToolDraftAction(sessionId, JSON.parse(snapshot), version);
            if (result.ok) { setSaved(snapshot); setVersion(result.version); setMessage("Saved to your account."); }
            else setMessage(result.message);
          } catch { setMessage("Could not save. Keep this page open and try again, or download a copy."); }
          finally { saving.current = false; setPending(false); }
        }}>{pending ? "Saving…" : "Save draft"}</Button>
        <span className="text-sm text-muted">{dirty ? "Unsaved changes" : version ? "Saved draft" : "No saved draft yet"}</span>
        {dirty && <a className={buttonStyles({ variant: "outline" })} href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`} download={`${sessionId}-draft-backup.json`}>Download draft backup</a>}
      </div>
      <p role="status" className="mt-2 text-sm text-muted">{message}</p>
      <p className="mt-2 text-sm text-muted">Saving keeps a private draft in your account. To send work to your instructor, download your results and attach them in the submission below.</p>
    </div>
  </DraftContext.Provider>;
}
