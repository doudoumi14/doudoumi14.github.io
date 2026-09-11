import { githubUrl, profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />

      <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <div className="reveal is-visible">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-sm text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.location}
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="gradient-text">{profile.name}</span>
            <span className="text-foreground">, {profile.credential}</span>
          </h1>

          <p className="mt-4 text-xl font-medium text-muted sm:text-2xl">{profile.role}</p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.summary}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Connect on LinkedIn
            </a>
            <a
              href="#experience"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
            >
              View experience
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
