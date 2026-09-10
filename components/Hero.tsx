import { GITHUB_USERNAME } from "@/data/projects";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pt-20 pb-16">
      <p className="text-sm font-medium text-black/50 dark:text-white/50">
        Full-stack developer
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Hi, I build things end-to-end.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-black/70 dark:text-white/70">
        I like working across the whole stack — REST APIs, real-time systems, relational
        databases, and the React frontends that sit on top of them. Below are a few recent
        projects, each built and tested end-to-end rather than left as a scaffold.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          View projects
        </a>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
        >
          GitHub profile
        </a>
      </div>
    </section>
  );
}
