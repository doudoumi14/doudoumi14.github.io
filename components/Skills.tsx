import { coreCompetencies, technicalToolkit, type SkillGroup } from "@/data/skills";

function SkillGroupGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-sm font-semibold text-black/50 dark:text-white/50">{group.label}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/15"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Core Competencies</h2>
      <SkillGroupGrid groups={coreCompetencies} />

      <h2 className="mt-14 text-2xl font-bold tracking-tight">Technical Toolkit</h2>
      <SkillGroupGrid groups={technicalToolkit} />
    </section>
  );
}
