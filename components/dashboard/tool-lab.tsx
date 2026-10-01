import { buttonStyles } from "@/components/ui/button";
import { toolLabs, toolLabStarter } from "@/data/tool-labs";

export function ToolLab({ sessionId }: { sessionId: string }) {
  const lab = toolLabs[sessionId];
  if (!lab) return null;
  const starter = toolLabStarter(sessionId);
  return <details className="border border-line bg-paper p-4">
    <summary className="min-h-7 cursor-pointer font-semibold text-navy-900">Applied Tool Lab · {lab.tool}</summary>
    <p className="mt-3 text-muted">{lab.purpose}</p>
    <p className="mt-2 text-muted">Optional companion exercise for your session deliverable. Use fictional or permitted inputs. External results are not automatically saved to your cohort account.</p>
    <a className={`${buttonStyles({ variant: "outline" })} my-4`} href="https://tools.unbundledconsultant.com/" target="_blank" rel="noopener noreferrer">Find {lab.tool} in the tool directory (opens a new tab)</a>
    <p className="text-xs text-muted">External tool by The Unbundled Consultant. Select the named tool in its directory; availability and features may change.</p>
    <ol className="my-4 list-decimal space-y-2 pl-5 text-muted">{lab.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    <h5 className="font-semibold text-navy-900">Evidence to submit</h5>
    <p className="mt-2 text-muted">{lab.evidence}</p>
    <h5 className="mt-4 font-semibold text-navy-900">Lab review criteria</h5>
    <ul className="mt-2 list-disc space-y-2 pl-5 text-muted">{lab.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
    <p className="my-4 text-muted"><strong>If the tool is unavailable:</strong> {lab.fallback}</p>
    <details className="border-t border-line pt-3">
      <summary className="min-h-7 cursor-pointer font-semibold">Outcome record and submission template</summary>
      <pre className="my-4 whitespace-pre-wrap break-words font-sans text-sm text-muted">{starter}</pre>
      <a className={buttonStyles({ variant: "secondary" })} href={`data:text/plain;charset=utf-8,${encodeURIComponent(starter)}`} download={`${sessionId}-tool-lab.txt`}>Download lab template</a>
      <p className="mt-2 text-muted">Complete the template in your own document, then upload it with this session&rsquo;s deliverable. Include review time and unsuccessful results; savings are not guaranteed.</p>
    </details>
  </details>;
}
