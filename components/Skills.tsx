const SKILL_GROUPS = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { label: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS", "Recharts"] },
  { label: "Backend", items: ["Node.js", "Express", "FastAPI", "REST APIs", "Socket.io / WebSockets"] },
  { label: "Data", items: ["Prisma", "SQLAlchemy", "SQLite"] },
  { label: "Testing & tools", items: ["Vitest", "pytest", "Supertest", "Git"] },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Skills</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-semibold text-black/50 dark:text-white/50">
              {group.label}
            </h3>
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
    </section>
  );
}
