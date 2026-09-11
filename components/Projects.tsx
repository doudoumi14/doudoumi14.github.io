import { Icons } from "@/components/Icons";
import { repoUrl } from "@/data/profile";
import { projects } from "@/data/projects";
import { TiltCard } from "./TiltCard";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <div className="reveal">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-accent uppercase">
          <Icons.code className="size-4" />
          Code
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Side Projects</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Hands-on technical work outside the day job — each one fully working, tested end-to-end
          in a real browser, and running in CI.
        </p>
      </div>

      <div className="reveal mt-10 grid gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <TiltCard
            as="a"
            key={project.name}
            href={repoUrl(project.repo)}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 hover:border-accent/40 hover:bg-card-hover"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{project.name}</h3>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-4 text-subtle transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H8M17 7v9" />
              </svg>
            </div>

            <p className="mt-1 text-sm font-medium text-accent">{project.tagline}</p>
            <p className="mt-4 text-sm text-muted">{project.description}</p>

            <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-muted">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-accent/60" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
