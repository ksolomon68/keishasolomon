import type { Metadata } from "next";
import Image from "next/image";
import { requireUser } from "@/lib/auth/session";
import { instructor, site } from "@/data/cohortData";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Certificate of Completion – The AI Executive Sandbox",
  description:
    "Certificate of Completion for the AI Executive Sandbox programme, issued by EVOBRAND Concepts.",
};

/** Completion date is the final showcase: May 11, 2027. */
const COMPLETION_DATE = "May 11, 2027";

export default async function CertificatePage() {
  const user = await requireUser("/certificate");

  return (
    <>
      {/* Print / download button – hidden when printing */}
      <div className="no-print flex justify-center gap-4 bg-paper-deep py-6 border-b border-line">
        <PrintButton />
      </div>

      {/* ── Certificate ───────────────────────────────────────────────── */}
      <div
        id="certificate"
        className="certificate-page mx-auto my-10 flex max-w-4xl flex-col items-center bg-white px-16 py-14 text-center shadow-2xl"
        style={{ minHeight: "640px", position: "relative" }}
      >
        {/* Decorative corner borders */}
        <span className="cert-corner cert-corner-tl" aria-hidden="true" />
        <span className="cert-corner cert-corner-tr" aria-hidden="true" />
        <span className="cert-corner cert-corner-bl" aria-hidden="true" />
        <span className="cert-corner cert-corner-br" aria-hidden="true" />

        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/evobrand-logo.png"
            alt="EVOBRAND Concepts"
            width={260}
            height={72}
            className="mx-auto"
            priority
          />
        </div>

        {/* Issuer line */}
        <p className="label tracking-widest text-cyan-deep uppercase">
          EVOBRAND Concepts
        </p>

        {/* Main heading */}
        <h1
          className="mt-6 font-display text-5xl font-light text-navy-900"
          style={{ letterSpacing: "0.01em", lineHeight: 1.1 }}
        >
          Certificate of Completion
        </h1>

        {/* Divider */}
        <div className="cert-divider my-6" aria-hidden="true" />

        {/* Body copy */}
        <p className="text-lg text-muted">This certifies that</p>

        <p
          className="mt-3 font-display text-4xl font-light text-navy-900"
          style={{ letterSpacing: "0.02em" }}
        >
          {user.name}
        </p>

        {user.organization && (
          <p className="mt-1 font-medium text-cyan-deep">{user.organization}</p>
        )}

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          has successfully completed the eight-month programme
        </p>

        <p className="mt-2 font-display text-2xl font-light text-amber-deep italic">
          &ldquo;{site.name}&rdquo;
        </p>

        <p className="mt-1 text-sm uppercase tracking-widest text-muted">
          {site.tagline}
        </p>

        <p className="mt-6 text-base text-muted">
          Awarded on{" "}
          <span className="font-semibold text-ink">{COMPLETION_DATE}</span>
        </p>

        {/* Divider */}
        <div className="cert-divider my-8" aria-hidden="true" />

        {/* Signature block */}
        <div className="flex w-full max-w-sm flex-col items-center gap-1">
          <div className="cert-sig-line" aria-hidden="true" />
          <p className="mt-2 font-display text-lg text-navy-900">
            {instructor.name}
          </p>
          <p className="text-sm text-muted">{instructor.role}</p>
          <p className="text-sm font-medium text-cyan-deep">
            {instructor.company}
          </p>
        </div>

        {/* Credential note */}
        <p className="mt-8 text-xs text-muted/70">
          Verify at {site.url}
        </p>
      </div>

      {/* ── Certificate-specific styles ──────────────────────────────── */}
      <style>{`
        /* Layout */
        .certificate-page {
          border: 2px solid #1c2a4a;
          box-shadow: 0 0 0 10px #fff, 0 0 0 12px #1c2a4a;
        }

        /* Decorative corner brackets */
        .cert-corner {
          position: absolute;
          width: 28px;
          height: 28px;
          border-color: #c5933a;
          border-style: solid;
        }
        .cert-corner-tl { top: 18px; left: 18px; border-width: 3px 0 0 3px; }
        .cert-corner-tr { top: 18px; right: 18px; border-width: 3px 3px 0 0; }
        .cert-corner-bl { bottom: 18px; left: 18px; border-width: 0 0 3px 3px; }
        .cert-corner-br { bottom: 18px; right: 18px; border-width: 0 3px 3px 0; }

        /* Horizontal rules */
        .cert-divider {
          width: 220px;
          height: 1px;
          background: linear-gradient(to right, transparent, #c5933a, transparent);
        }

        /* Signature line */
        .cert-sig-line {
          width: 100%;
          height: 1px;
          background: #1c2a4a;
          opacity: 0.25;
        }

        /* Print styles */
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #certificate {
            margin: 0 auto !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
