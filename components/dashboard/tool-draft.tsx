"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { saveToolDraftAction, shareToolResultAction, withdrawToolResultAction } from "@/app/actions/tool-drafts";
import type { ToolDraft, ToolResult } from "@/lib/store";
import { Button, buttonStyles } from "@/components/ui/button";

const DraftContext = createContext<{ data: Record<string, unknown>; setData: Dispatch<SetStateAction<Record<string, unknown>>> } | null>(null);

export function useToolState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const context = useContext(DraftContext);
  if (!context) throw new Error("Tool state requires a draft workspace.");
  const value = (context.data[key] ?? initial) as T;
  const set: Dispatch<SetStateAction<T>> = (next) => context.setData((previous) => ({ ...previous, [key]: typeof next === "function" ? (next as (old: T) => T)((previous[key] ?? initial) as T) : next }));
  return [value, set];
}

export function ToolDraftWorkspace({ sessionId, initial, initialShared, children }: { sessionId: string; initial?: ToolDraft; initialShared?: ToolResult; children: ReactNode }) {
  const [data, setData] = useState<Record<string, unknown>>(initial?.data ?? {});
  const [saved, setSaved] = useState(JSON.stringify(initial?.data ?? {}));
  const [version, setVersion] = useState(initial?.version ?? 0);
  const [pending, setPending] = useState(false);
  const [operation, setOperation] = useState<"save" | "share" | "withdraw" | null>(null);
  const [sharedVersion, setSharedVersion] = useState(initialShared?.version ?? 0);
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
          saving.current = true; setPending(true); setOperation("save");
          const snapshot = JSON.stringify(data);
          try {
            const result = await saveToolDraftAction(sessionId, JSON.parse(snapshot), version);
            if (result.ok) { setSaved(snapshot); setVersion(result.version); setMessage("Saved to your account."); }
            else setMessage(result.message);
          } catch { setMessage("Could not save. Keep this page open and try again, or download a copy."); }
          finally { saving.current = false; setPending(false); setOperation(null); }
        }}>{operation === "save" ? "Saving…" : "Save draft"}</Button>
        <span className="text-sm text-muted">{dirty ? "Unsaved changes" : version ? "Saved draft" : "No saved draft yet"}</span>
        {dirty && <a className={buttonStyles({ variant: "outline" })} href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`} download={`${sessionId}-draft-backup.json`}>Download draft backup</a>}
      </div>
      <p role="status" className="mt-2 text-sm text-muted">{message}</p>
      <p className="mt-2 text-sm text-muted">Saving keeps your draft private. Sharing sends a copy of your saved results to your instructor, including the inputs and outputs shown in this tool. This does not submit your session deliverable.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" disabled={pending || dirty || !version || sharedVersion === version} onClick={async () => {
          if (saving.current) return;
          saving.current = true; setPending(true); setOperation("share");
          try {
            const result = await shareToolResultAction(sessionId, version);
            if (result.ok) { setSharedVersion(result.version); setMessage("Saved results shared with your instructor. Future edits stay private until you share an update."); }
            else setMessage(result.message);
          } catch { setMessage("Could not share results. Your draft is still saved; try again."); }
          finally { saving.current = false; setPending(false); setOperation(null); }
        }}>{operation === "share" ? "Sharing…" : sharedVersion ? "Share updated results" : "Share saved results with instructor"}</Button>
        <span className="text-sm text-muted">{sharedVersion ? sharedVersion === version && !dirty ? "Saved results shared" : "Earlier saved results shared · changes private" : "Private · not shared"}</span>
        {!!sharedVersion && <Button type="button" variant="outline" disabled={pending} onClick={async () => {
          if (saving.current) return;
          saving.current = true; setPending(true); setOperation("withdraw");
          try {
            const result = await withdrawToolResultAction(sessionId, sharedVersion);
            if (result.ok) { setSharedVersion(0); setMessage("Results removed from the instructor view. Your saved draft is still private."); }
            else setMessage(result.message);
          } catch { setMessage("Could not stop sharing. Try again."); }
          finally { saving.current = false; setPending(false); setOperation(null); }
        }}>{operation === "withdraw" ? "Stopping sharing…" : "Stop sharing results"}</Button>}
      </div>
      {dirty && <p className="mt-2 text-sm text-muted">Save your changes before sharing updated results.</p>}
      <p className="mt-2 text-sm text-muted">Use the submission below to attach evidence and request feedback on your full session deliverable.</p>
    </div>
  </DraftContext.Provider>;
}
