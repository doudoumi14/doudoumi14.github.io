import { Icons } from "@/components/Icons";
import { coreCompetencies, technicalToolkit, type SkillGroup } from "@/data/skills";

function CompetencyCard({ group }: { group: SkillGroup }) {
  const Icon = Icons[group.icon];
  return (
    <div className="group rounded-2xl border border-line bg-card p-6 transition duration-300 hover:border-accent/40 hover:bg-card-hover">
      <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent transition group-hover:scale-110">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 font-bold">{group.label}</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {group.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
            <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <div className="reveal">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-accent uppercase">
          <Icons.spark className="size-4" />
          Capability
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Core Competencies</h2>
        <p className="mt-3 max-w-2xl text-muted">
          The engineering-plus-business combination that the P.Eng and MBA together are meant to
          cover.
        </p>
      </div>

      <div className="reveal mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {coreCompetencies.map((group) => (
          <CompetencyCard key={group.label} group={group} />
        ))}
      </div>

      <div className="reveal mt-16">
        <h2 className="text-3xl font-bold tracking-tight">Technical Toolkit</h2>
        <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {technicalToolkit.map((group) => {
            const Icon = Icons[group.icon];
            return (
              <div key={group.label}>
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-subtle uppercase">
                  <Icon className="size-4 text-accent" />
                  {group.label}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm transition hover:border-accent hover:text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
