import type { Metadata } from "next";
import Link from "next/link";
import { InquiryReview } from "@/components/admin/inquiry-review";
import { requireAdmin } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = { title: "Team & program inquiries" };

export default async function InquiriesPage() {
  await requireAdmin("/admin/inquiries");
  const inquiries = await (await getStore()).listInquiries();
  const fresh = inquiries.filter((inquiry) => inquiry.status === "new").length;
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="label text-amber-deep">Instructor inbox · all cohorts</p>
    <h1 className="mt-3 font-display text-4xl text-navy-900">Team &amp; program inquiries</h1>
    <p className="mt-4 max-w-3xl text-muted">These requests come from the form on the public Plans page. They are separate from participant support conversations and do not require a cohort. Use the contact email to follow up, then update the status.</p>
    <p role="status" className="mt-4 font-semibold text-navy-900">{fresh} new · {inquiries.length} total</p>
    <p className="mt-2 text-sm text-muted">Email notifications are not sent automatically. Check this inbox for new requests.</p>
    <div className="mt-8"><InquiryReview inquiries={inquiries} /></div>
    <Link href="/admin" className={`${buttonStyles({ variant: "outline" })} mt-8`}>Back to instructor dashboard</Link>
  </div>;
}
