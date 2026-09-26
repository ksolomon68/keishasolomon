import Link from "next/link";
import { instructor, site } from "@/data/cohortData";

export function SiteFooter() {
  return (
    <footer data-surface="dark" className="relative z-20 border-t border-white/15 bg-navy-950 text-on-navy shadow-[0_-24px_80px_rgb(0_0_0/0.28)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl text-white">{site.name}</p>
          <p className="mt-1 text-on-navy">{site.tagline}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            An {site.format.toLowerCase()} led by {instructor.name} of{" "}
            <a
              href={instructor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 hover:text-amber"
            >
              {instructor.company}
            </a>
            .
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="label text-amber">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
            {[
              ["/#method", "The method"],
              ["/#syllabus", "Syllabus & timeline"],
              ["/onboarding", "Before Day 1 checklist"],
              ["/#safe-harbor", "Safe Harbor pledge"],
              ["/login", "Participant sign in"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white underline-offset-4 hover:text-amber hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="label text-amber">Contact</h2>
          <address className="mt-4 space-y-2.5 text-[0.9375rem] not-italic">
            <p className="text-white">{instructor.name}</p>
            <p>
              <a
                href={instructor.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-4 hover:text-amber"
              >
                {instructor.company}
              </a>
            </p>
            <p>
              <a href={site.url} className="text-white underline underline-offset-4 hover:text-amber">
                {site.url.replace(/^https?:\/\//, "")}
              </a>
            </p>
            {site.contactEmail ? (
              <p>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-white underline underline-offset-4 hover:text-amber"
                >
                  {site.contactEmail}
                </a>
              </p>
            ) : null}
          </address>
          <p className="mt-4 text-sm">{site.contactEmail ? "Email your instructor for session details or account help. Never send your password." : "For session details or account help, reply to your instructor’s welcome message. A public support email has not been posted yet."}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm sm:px-6 lg:px-8">
          © {new Date().getFullYear()}{" "}
          <a
            href={instructor.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-amber"
          >
            {instructor.company}
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
