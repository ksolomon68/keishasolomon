import Image from "next/image";
import { Pinyon_Script } from "next/font/google";
import { cohortStats, instructor, site } from "@/data/cohortData";

// If the script face can't be fetched, fall back to the certificate's serif rather than a metric-matched sans.
const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Scalloped outer edge of the gold seal (a circle with a 28-lobe wave). */
const SEAL_EDGE = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 360; i++) {
    const a = (i * Math.PI) / 180;
    const r = 92 + 4 * Math.sin(28 * a);
    pts.push(`${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

function Corner({ className }: { className: string }) {
  return (
    <svg className={`cert-corner ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M3 70 V3 H70" fill="none" stroke="url(#cert-gold)" strokeWidth="3" />
      <path d="M12 50 V12 H50" fill="none" stroke="url(#cert-gold)" strokeWidth="1" />
      <path d="M20 20 l6 -6 l6 6 l-6 6 Z" fill="url(#cert-gold)" />
      <circle cx="42" cy="20" r="1.8" fill="url(#cert-gold)" />
      <circle cx="20" cy="42" r="1.8" fill="url(#cert-gold)" />
    </svg>
  );
}

function Flourish() {
  return (
    <svg className="cert-flourish" viewBox="0 0 400 24" aria-hidden="true">
      <rect x="0" y="11.4" width="170" height="1.2" fill="url(#cert-gold-fade-l)" />
      <rect x="230" y="11.4" width="170" height="1.2" fill="url(#cert-gold-fade-r)" />
      <path d="M200 3 L209 12 L200 21 L191 12 Z" fill="url(#cert-gold)" />
      <path d="M180 12 L185 7 L190 12 L185 17 Z" fill="none" stroke="#c5933a" strokeWidth="1" />
      <path d="M210 12 L215 7 L220 12 L215 17 Z" fill="none" stroke="#c5933a" strokeWidth="1" />
    </svg>
  );
}

function Seal() {
  return (
    <svg className="cert-seal" viewBox="0 0 200 200" role="img" aria-label="EVOBRAND Concepts seal">
      <path d={SEAL_EDGE} fill="url(#cert-gold)" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="78" fill="#0b1730" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="url(#cert-gold)" strokeWidth="1.2" />
      <defs>
        <path id="cert-seal-ring" d="M100,100 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
      </defs>
      <text fill="#f1d38f" fontSize="9.5" fontWeight="600" letterSpacing="1.6" fontFamily="var(--font-mono), monospace">
        <textPath href="#cert-seal-ring" textLength="366" lengthAdjust="spacing">
          THE AI EXECUTIVE SANDBOX ✦ EVOBRAND CONCEPTS ✦
        </textPath>
      </text>
      <circle cx="100" cy="100" r="42" fill="url(#cert-seal-core)" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="url(#cert-gold)" strokeWidth="1.5" />
      <image href="/favicon-source.png" x="70" y="70" width="60" height="60" />
    </svg>
  );
}

/** The award itself: a 11 × 8.5 in landscape sheet that scales with its width and prints on one page. */
export function CertificateSheet({
  name,
  organization,
  cohortName,
  date,
}: {
  name: string;
  organization?: string | null;
  cohortName?: string | null;
  date: string;
}) {
  const nameSize = name.length > 30 ? "4.6cqw" : name.length > 22 ? "5.8cqw" : "7.4cqw";

  return (
    <div className="cert-scroll">
      <article
        id="certificate"
        aria-label="Certificate of Completion"
        className={`cert-sheet ${script.variable}`}
      >
        {/* Shared gradients for every SVG ornament */}
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="cert-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0d48e" />
              <stop offset=".45" stopColor="#c5933a" />
              <stop offset="1" stopColor="#8a6420" />
            </linearGradient>
            <linearGradient id="cert-gold-fade-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#c5933a" stopOpacity="0" />
              <stop offset="1" stopColor="#c5933a" />
            </linearGradient>
            <linearGradient id="cert-gold-fade-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#c5933a" />
              <stop offset="1" stopColor="#c5933a" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="cert-seal-core" cx=".4" cy=".35" r=".8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#dde6f0" />
            </radialGradient>
          </defs>
        </svg>

        <div className="cert-paper">
          <Image
            src="/favicon-source.png"
            alt=""
            width={512}
            height={512}
            className="cert-watermark"
            aria-hidden="true"
          />
          <Corner className="cert-corner-tl" />
          <Corner className="cert-corner-tr" />
          <Corner className="cert-corner-bl" />
          <Corner className="cert-corner-br" />

          <div className="cert-body">
            <a
              href={instructor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-opacity hover:opacity-85"
            >
              <Image
                src="/evobrand-logo.png"
                alt="EVOBRAND Concepts"
                width={1024}
                height={175}
                className="cert-logo"
                priority
              />
            </a>

            <h1 className="cert-title">Certificate</h1>
            <p className="cert-subtitle">of Completion</p>

            <Flourish />

            <p className="cert-lead">This certificate is proudly presented to</p>

            <p className="cert-name" style={{ fontSize: nameSize }}>
              {name}
            </p>
            <span className="cert-name-rule" aria-hidden="true" />

            {organization && <p className="cert-org">{organization}</p>}

            <p className="cert-text">
              for successfully completing the eight-month cohort program and its capstone project,
              building real AI workflows, policies and automations for their organization.
            </p>

            <p className="cert-program">&ldquo;{site.name}&rdquo;</p>
            <p className="cert-tagline">{site.tagline}</p>
            {cohortName && <p className="cert-cohort">{cohortName}</p>}

            <ul className="cert-stats">
              {cohortStats.slice(0, 3).map((s) => (
                <li key={s.label}>
                  <span className="cert-stat-value">{s.value}</span>
                  <span className="cert-stat-label">{s.label}</span>
                </li>
              ))}
            </ul>

            <div className="cert-footer">
              <div className="cert-sign">
                <p className="cert-signature">{instructor.name}</p>
                <span className="cert-sign-rule" aria-hidden="true" />
                <p className="cert-sign-name">{instructor.name}</p>
                <p className="cert-sign-role">
                  {instructor.role},{" "}
                  <a
                    href={instructor.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {instructor.company}
                  </a>
                </p>
              </div>

              <Seal />

              <div className="cert-sign">
                <p className="cert-date">{date}</p>
                <span className="cert-sign-rule" aria-hidden="true" />
                <p className="cert-sign-name">Date of Completion</p>
                <p className="cert-sign-role">Verify at {site.url.replace(/^https?:\/\//, "")}</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <style>{`
        /* ── Sheet: everything is sized in cqw so it scales like a photo of the page ── */
        .cert-scroll {
          overflow-x: auto;
          padding: 2.5rem 1rem 3.5rem;
        }
        .cert-sheet {
          container-type: inline-size;
          position: relative;
          width: 100%;
          min-width: 760px;
          max-width: 1100px;
          margin: 0 auto;
          aspect-ratio: 11 / 8.5;
          padding: 2.2cqw;
          color: var(--color-ink);
          background-color: #0b1730;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M0 7 7 0 14 7 7 14Z' fill='none' stroke='%23f4b63f' stroke-opacity='.3' stroke-width='.6'/%3E%3C/svg%3E");
          box-shadow: 0 30px 60px -20px rgb(11 23 48 / .45), 0 6px 14px rgb(11 23 48 / .2);
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .cert-sheet::before {
          content: "";
          position: absolute;
          inset: 1.1cqw;
          border: 0.14cqw solid rgb(240 212 142 / .75);
          pointer-events: none;
        }

        /* ── Paper ── */
        .cert-paper {
          position: relative;
          height: 100%;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 0%, #fffefb 0%, #fbf7ec 60%, #f3ecda 100%);
          border: 0.14cqw solid #c5933a;
          box-shadow: inset 0 0 0 0.7cqw #fbf7ec, inset 0 0 0 0.85cqw rgb(197 147 58 / .55);
        }
        .cert-watermark {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 44cqw;
          height: auto;
          transform: translate(-50%, -50%);
          opacity: 0.06;
          filter: grayscale(0.4);
          pointer-events: none;
        }
        .cert-corner {
          position: absolute;
          width: 9cqw;
          height: 9cqw;
        }
        .cert-corner-tl { top: 1.4cqw; left: 1.4cqw; }
        .cert-corner-tr { top: 1.4cqw; right: 1.4cqw; transform: scaleX(-1); }
        .cert-corner-bl { bottom: 1.4cqw; left: 1.4cqw; transform: scaleY(-1); }
        .cert-corner-br { bottom: 1.4cqw; right: 1.4cqw; transform: scale(-1, -1); }

        /* ── Content ── */
        .cert-body {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          padding: 3.4cqw 6.5cqw 3.6cqw;
          text-align: center;
        }
        .cert-logo {
          width: 22cqw;
          height: auto;
        }
        .cert-title {
          margin-top: 1.7cqw;
          font-family: var(--font-display);
          font-size: 6.6cqw;
          font-weight: 300;
          line-height: 1;
          letter-spacing: 0.02em;
          color: var(--color-navy-900);
        }
        .cert-subtitle {
          margin-top: 0.7cqw;
          font-family: var(--font-mono);
          font-size: 1.35cqw;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          padding-left: 0.5em;
          color: var(--color-cyan-deep);
        }
        .cert-flourish {
          width: 30cqw;
          height: auto;
          margin-top: 1.5cqw;
        }
        .cert-lead {
          margin-top: 1.5cqw;
          font-family: var(--font-display);
          font-size: 1.55cqw;
          font-style: italic;
          color: var(--color-muted);
        }
        .cert-name {
          margin-top: 0.4cqw;
          max-width: 100%;
          font-family: var(--font-script), var(--font-display), cursive;
          line-height: 1.25;
          color: var(--color-navy-900);
          overflow-wrap: anywhere;
        }
        .cert-name-rule {
          display: block;
          width: 46cqw;
          height: 0.12cqw;
          background: linear-gradient(to right, transparent, #c5933a 20%, #c5933a 80%, transparent);
        }
        .cert-org {
          margin-top: 0.8cqw;
          font-family: var(--font-mono);
          font-size: 1.1cqw;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-cyan-deep);
        }
        .cert-text {
          margin-top: 1.4cqw;
          max-width: 52cqw;
          font-size: 1.5cqw;
          line-height: 1.55;
          color: var(--color-muted);
        }
        .cert-program {
          margin-top: 1.2cqw;
          font-family: var(--font-display);
          font-size: 3cqw;
          font-style: italic;
          font-weight: 400;
          line-height: 1.15;
          color: var(--color-amber-deep);
        }
        .cert-tagline {
          margin-top: 0.5cqw;
          font-family: var(--font-mono);
          font-size: 1cqw;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--color-muted);
        }
        .cert-cohort {
          margin-top: 0.7cqw;
          max-width: 60cqw;
          font-family: var(--font-display);
          font-size: 1.4cqw;
          font-style: italic;
          color: var(--color-navy-700);
        }
        .cert-stats {
          display: flex;
          margin-top: 1.6cqw;
          list-style: none;
        }
        .cert-stats li {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 2.6cqw;
        }
        .cert-stats li + li {
          border-left: 0.1cqw solid rgb(197 147 58 / .6);
        }
        .cert-stat-value {
          font-family: var(--font-display);
          font-size: 2.3cqw;
          font-weight: 300;
          line-height: 1;
          color: var(--color-navy-900);
        }
        .cert-stat-label {
          margin-top: 0.4cqw;
          font-family: var(--font-mono);
          font-size: 0.85cqw;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-muted);
        }

        /* ── Footer: signature · seal · date ── */
        .cert-footer {
          display: grid;
          width: 100%;
          margin-top: auto;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          gap: 2cqw;
        }
        .cert-seal {
          width: 12.5cqw;
          height: 12.5cqw;
          filter: drop-shadow(0 0.4cqw 0.6cqw rgb(11 23 48 / .3));
        }
        .cert-sign {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 0.4cqw;
        }
        .cert-signature,
        .cert-date {
          min-height: 4.2cqw;
          display: flex;
          align-items: flex-end;
          color: var(--color-navy-900);
        }
        .cert-signature {
          font-family: var(--font-script), var(--font-display), cursive;
          font-size: 3.6cqw;
          line-height: 1.1;
        }
        .cert-date {
          font-family: var(--font-display);
          font-size: 1.9cqw;
          font-weight: 400;
        }
        .cert-sign-rule {
          display: block;
          width: 20cqw;
          height: 0.12cqw;
          margin-top: 0.4cqw;
          background: var(--color-navy-900);
          opacity: 0.55;
        }
        .cert-sign-name {
          margin-top: 0.6cqw;
          font-family: var(--font-display);
          font-size: 1.4cqw;
          font-weight: 500;
          color: var(--color-navy-900);
        }
        .cert-sign-role {
          margin-top: 0.15cqw;
          font-size: 1.05cqw;
          color: var(--color-muted);
        }

        /* ── Print: one landscape Letter page, no browser chrome ── */
        @page { size: 11in 8.5in; margin: 0; }
        @media print {
          html, body { background: #fff !important; }
          .cert-scroll { overflow: visible; padding: 0; }
          .cert-sheet {
            width: 11in;
            min-width: 0;
            max-width: none;
            height: 8.48in;
            aspect-ratio: auto;
            margin: 0;
            box-shadow: none;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
