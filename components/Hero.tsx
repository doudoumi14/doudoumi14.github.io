import { githubUrl, profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pt-20 pb-16">
      <p className="text-sm font-medium text-black/50 dark:text-white/50">{profile.location}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {profile.name}, {profile.credential}
      </h1>
      <p className="mt-2 text-lg font-medium text-black/70 dark:text-white/70">{profile.role}</p>
      <p className="mt-6 max-w-2xl text-lg text-black/70 dark:text-white/70">{profile.summary}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          LinkedIn
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
        >
          GitHub profile
        </a>
        <a
          href="#experience"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
        >
          Experience
        </a>
      </div>
    </section>
  );
}
