import { valueMatrix } from "@/data/cohortData";
import { SectionHeading } from "./section-heading";

export function ValueMatrix() {
  return (
    <section id="method" aria-labelledby="method-title" className="home-section">
      <div className="home-shell home-surface-light">
        <SectionHeading
          id="method-title"
          eyebrow="The method"
          title="Built to be used, not just attended"
          intro="Most AI training ends with notes. This cohort ends every month with something running in your business."
        />

        <ol className="mt-14 grid gap-px border border-line bg-line/80 md:grid-cols-3">
          {valueMatrix.pillars.map((pillar, i) => (
            <li key={pillar.title} className="bg-paper/92 p-7 sm:p-9">
              <p className="label text-amber-deep">0{i + 1}</p>
              <h3 className="mt-4 font-display text-2xl text-navy-900">{pillar.title}</h3>
              <p className="mt-3 text-muted">{pillar.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 md:hidden">
          <h3 className="font-display text-2xl leading-tight text-navy-900 text-balance">
            How the Sandbox compares with a typical AI workshop
          </h3>
          <div className="mt-6 space-y-4">
            {valueMatrix.rows.map((row) => (
              <article key={row.dimension} className="border border-line bg-white/94">
                <h4 className="label border-b border-line px-4 py-3 text-ink">{row.dimension}</h4>
                <dl>
                  <div className="grid gap-1 px-4 py-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Typical workshop</dt>
                    <dd className="text-muted">{row.passive}</dd>
                  </div>
                  <div className="grid gap-1 bg-navy-900 px-4 py-4 text-white">
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-amber">The Sandbox</dt>
                    <dd>{row.sandbox}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <caption className="pb-5 text-left font-display text-2xl text-navy-900">
              How the Sandbox compares with a typical AI workshop
            </caption>
            <thead>
              <tr className="border-b-2 border-navy-900 text-sm">
                <th scope="col" className="w-1/4 py-3 pr-4 font-semibold text-navy-900">
                  <span className="sr-only">Aspect</span>
                </th>
                <th scope="col" className="w-[37.5%] px-4 py-3 font-semibold text-muted">
                  Typical AI workshop
                </th>
                <th scope="col" className="w-[37.5%] bg-navy-900 px-4 py-3 font-semibold text-amber">
                  The AI Executive Sandbox
                </th>
              </tr>
            </thead>
            <tbody>
              {valueMatrix.rows.map((row) => (
                <tr key={row.dimension} className="border-b border-line align-top">
                  <th scope="row" className="label py-5 pr-4 text-left font-medium text-ink">
                    {row.dimension}
                  </th>
                  <td className="px-4 py-5 text-muted">{row.passive}</td>
                  <td className="bg-navy-900 px-4 py-5 font-medium text-white">{row.sandbox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
