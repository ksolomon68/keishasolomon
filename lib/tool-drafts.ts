import { z } from "zod";

const text = z.string().max(12000);
const short = z.string().max(500);
const rating = z.number().int().min(0).max(2);
const lead = z.object({ name: short, need: short, fit: rating, urgency: rating, readiness: rating, followUp: short }).strict();
const schemas = {
  s1: z.object({ task: z.enum(["drafting", "research", "data"]), privacy: z.enum(["public", "restricted"]), budget: z.enum(["free", "paid"]), team: z.enum(["solo", "team"]), result: text }).partial().strict(),
  s4: z.object({ draft: lead, leads: z.array(lead.extend({ id: z.number().int().nonnegative(), done: z.boolean() })).max(100) }).partial().strict(),
  s5: z.object({ idea: short, audience: short, takeaway: text, action: short, drafts: z.array(z.object({ channel: short, text }).strict()).max(3) }).partial().strict(),
  s3: z.object({ task: short, input: text, steps: text, output: text, review: text, owner: short, recovery: text, result: text }).partial().strict(),
  s7: z.object({ task: short, baseline: short, frequency: short, trials: text, quality: text, decision: z.enum(["revise", "adopt", "stop"]), reason: text }).partial().strict(),
};

export function parseToolDraft(sessionId: string, data: unknown) {
  if (!Object.hasOwn(schemas, sessionId)) return null;
  const parsed = schemas[sessionId as keyof typeof schemas].safeParse(data);
  return parsed.success && JSON.stringify(parsed.data).length <= 100000 ? parsed.data : null;
}
