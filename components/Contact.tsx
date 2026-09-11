import { githubUrl, profile } from "@/data/profile";

const LINKS = [
  { label: "LinkedIn", href: profile.linkedin, primary: true, external: true },
  { label: profile.email, href: `mailto:${profile.email}`, primary: false, external: false },
  { label: "GitHub", href: githubUrl, primary: false, external: true },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <div className="reveal relative overflow-hidden rounded-3xl border border-line bg-card p-10 text-center sm:p-16">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 left-1/2 size-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
        />

        <h2 className="text-3xl font-bold tracking-tight">Get in touch</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Open to conversations on technology strategy, engineering leadership, or anything in the
          projects above.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className={
                link.primary
                  ? "rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  : "rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
