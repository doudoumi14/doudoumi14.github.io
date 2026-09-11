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
            key={project.name}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 hover:border-accent/40"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">{project.name}</h3>
              {project.live && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                  <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
                  Live
                </span>
              )}
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

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  Open the live site
                </a>
              )}
              <a
                href={repoUrl(project.repo)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent"
              >
                Source
              </a>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
