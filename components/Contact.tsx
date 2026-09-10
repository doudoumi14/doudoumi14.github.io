import { GITHUB_USERNAME } from "@/data/projects";

const EMAIL = "geekfanmanga@gmail.com";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
      <p className="mt-4 max-w-xl text-black/70 dark:text-white/70">
        Feel free to reach out, take a look at the code, or open an issue on any of the projects
        above.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={`mailto:${EMAIL}`}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {EMAIL}
        </a>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
