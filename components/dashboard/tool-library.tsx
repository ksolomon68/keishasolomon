import { toolLabs } from "@/data/tool-labs";
import { buttonStyles } from "@/components/ui/button";

export function ToolLibrary() {
  return <ul className="grid gap-4 lg:grid-cols-3">
    {Object.entries(toolLabs).map(([sessionId, lab]) => <li key={sessionId} className="flex flex-col border border-line bg-white p-5">
      <p className="label text-amber-deep">Session {sessionId.slice(1)} tool</p>
      <h3 className="mt-2 font-display text-xl text-navy-900">{lab.tool}</h3>
      <p className="mb-5 mt-2 flex-1 text-sm text-muted">{lab.purpose}</p>
      <a className={buttonStyles({ variant: "outline" })} href={`#tool-${sessionId}`} aria-label={`Open ${lab.tool} in Session ${sessionId.slice(1)} work`}>Open in my work</a>
    </li>)}
  </ul>;
}
