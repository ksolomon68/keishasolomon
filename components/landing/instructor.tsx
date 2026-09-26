import Image from "next/image";
import { instructor } from "@/data/cohortData";

export function InstructorBlock() {
  return (
    <section aria-labelledby="instructor-title" className="home-section">
      <div className="home-shell home-surface-light grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <div className="relative size-32 shrink-0 overflow-hidden border-2 border-navy-900 bg-navy-900 sm:size-40">
          <Image
            src="/home.png"
            alt={instructor.name}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="max-w-3xl">
          <p className="label text-amber-deep">{instructor.role}</p>
          <h2 id="instructor-title" className="mt-2 font-display text-4xl font-light text-navy-900">
            {instructor.name}
          </h2>
          <p className="mt-1 font-medium text-cyan-deep">
            <a
              href={instructor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {instructor.company}
            </a>
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">{instructor.summary}</p>
        </div>
      </div>
    </section>
  );
}
