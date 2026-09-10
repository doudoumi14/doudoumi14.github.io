import { GITHUB_USERNAME, projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.name}
            href={`https://github.com/${GITHUB_USERNAME}/${project.repo}`}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-black/10 p-6 transition hover:border-black/25 hover:shadow-sm dark:border-white/10 dark:hover:border-white/25"
          >
            <h3 className="text-lg font-semibold group-hover:underline">{project.name}</h3>
            <p className="mt-1 text-sm font-medium text-black/50 dark:text-white/50">
              {project.tagline}
            </p>
            <p className="mt-4 text-sm text-black/70 dark:text-white/70">
              {project.description}
            </p>

            <ul className="mt-4 flex flex-1 flex-col gap-1.5 text-sm text-black/60 dark:text-white/60">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2">
                  <span aria-hidden className="text-black/30 dark:text-white/30">
                    •
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70 dark:bg-white/10 dark:text-white/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
