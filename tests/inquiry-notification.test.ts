import { test } from "node:test";
import assert from "node:assert/strict";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { inquiryNotification } from "../lib/inquiry-notification";
import { sendInquiryNotification } from "../lib/email";
import type { PlanInquiry } from "../lib/store/types";

const inquiry: PlanInquiry = { id: "fictional-reference", plan: "teams", name: "Example Sender", email: "sender@example.invalid", organization: "Example Organization", teamSize: "11-25", message: "Please explain your team training.", status: "new", createdAt: "2026-01-01T00:00:00Z" };

test("notification targets the requested mailbox and lets the instructor reply to the prospective customer", () => {
  const message = inquiryNotification(inquiry, "https://evobrandai.com/");
  assert.equal(message.to, "ks@evobrand.net");
  assert.equal(message.replyTo, inquiry.email);
  assert.ok(message.text.includes(inquiry.organization));
  assert.ok(message.text.includes(inquiry.message));
  assert.ok(message.text.includes("11–25 people"));
  assert.ok(message.text.includes("https://evobrandai.com/admin/inquiries"));
  assert.ok(!message.text.includes(".com//"));
  assert.ok(inquiryNotification({ ...inquiry, message: "" }, "https://evobrandai.com").text.includes("No additional message supplied."));
});

test("sender uses configured SMTP with bounded waits and returns safe delivery-failure outcomes", async () => {
  const keys = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"] as const;
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const original = nodemailer.createTransport;
  let delivered: SendMailOptions | undefined;
  let fail = false;
  try {
    process.env.SMTP_HOST = "smtp.example.invalid";
    process.env.SMTP_USER = "app@example.invalid";
    process.env.SMTP_PASS = "fixture-only";
    process.env.SMTP_FROM = "Sandbox <app@example.invalid>";
    nodemailer.createTransport = ((options: { connectionTimeout: number; socketTimeout: number }) => {
      assert.equal(options.connectionTimeout, 10000);
      assert.equal(options.socketTimeout, 20000);
      return { async sendMail(message: SendMailOptions) {
        if (fail) throw Object.assign(new Error("Do not expose driver credentials"), { code: "EAUTH" });
        delivered = message;
        return { messageId: "fictional-message" };
      } };
    }) as unknown as typeof nodemailer.createTransport;
    assert.deepEqual(await sendInquiryNotification(inquiry), { sent: true });
    assert.equal(delivered?.to, "ks@evobrand.net");
    assert.equal(delivered?.from, "Sandbox <app@example.invalid>");
    assert.equal(delivered?.replyTo, inquiry.email);
    fail = true;
    assert.deepEqual(await sendInquiryNotification(inquiry), { sent: false, error: "EAUTH" });
    delete process.env.SMTP_HOST;
    assert.deepEqual(await sendInquiryNotification(inquiry), { sent: false, error: "SMTP not configured" });
  } finally {
    nodemailer.createTransport = original;
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
