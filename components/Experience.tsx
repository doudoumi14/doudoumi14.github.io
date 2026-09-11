import { Icons } from "@/components/Icons";
import { experience } from "@/data/experience";
import { CareerGameLauncher } from "./game/CareerGameLauncher";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      <div className="reveal">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-accent uppercase">
          <Icons.operations className="size-4" />
          Career
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Experience</h2>
      </div>

      <div className="reveal mt-8">
        <CareerGameLauncher />
      </div>

      <div className="relative mt-12">
        {/* Timeline spine — hidden on small screens where the rail would just
            waste horizontal space. */}
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-[7px] hidden w-px bg-gradient-to-b from-accent via-accent/40 to-transparent sm:block"
        />

        <div className="flex flex-col gap-10">
          {experience.map((role, index) => (
            <article key={`${role.company}-${role.period}`} className="reveal relative sm:pl-12">
              <span
                aria-hidden
                className="absolute top-1.5 left-0 hidden size-4 rounded-full border-2 border-accent bg-background sm:block"
              >
                {index === 0 && (
                  <span className="absolute inset-0.5 animate-ping rounded-full bg-accent opacity-60" />
                )}
              </span>

              <div className="group rounded-2xl border border-line bg-card p-6 transition duration-300 hover:border-accent/40 hover:bg-card-hover">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-accent-soft text-sm font-bold text-accent"
                    >
                      {role.company.slice(0, 2).toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold">{role.company}</h3>
                  </div>
                  <span className="text-sm text-subtle">
                    {role.period} · {role.location}
                  </span>
                </div>
                <p className="mt-3 font-medium text-accent">{role.title}</p>
                <p className="mt-3 text-muted">{role.summary}</p>

                {role.stats.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {role.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-line bg-accent-soft px-4 py-2"
                      >
                        <span className="text-lg font-bold tabular-nums">{stat.value}</span>{" "}
                        <span className="text-sm text-muted">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <ul className="mt-5 flex flex-col gap-2 text-sm text-muted">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                  {role.stack.map((tech) => (
                    <span key={tech} className="text-xs font-medium text-subtle">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
