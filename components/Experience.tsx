import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
      <div className="mt-8 flex flex-col gap-8">
        {experience.map((role) => (
          <div key={`${role.company}-${role.period}`} className="grid gap-1 sm:grid-cols-[220px_1fr] sm:gap-6">
            <div>
              <h3 className="font-semibold">{role.company}</h3>
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">{role.period}</p>
              <p className="text-sm text-black/50 dark:text-white/50">{role.location}</p>
            </div>
            <div>
              <p className="font-medium text-black/80 dark:text-white/80">{role.title}</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-black/70 dark:text-white/70">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span aria-hidden className="text-black/30 dark:text-white/30">
                      •
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
