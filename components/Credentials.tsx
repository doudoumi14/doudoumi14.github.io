import { Icons } from "@/components/Icons";
import { certifications, education } from "@/data/credentials";

export function Credentials() {
  return (
    <section id="credentials" className="mx-auto max-w-5xl px-6 py-20">
      <div className="reveal">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-accent uppercase">
          <Icons.award className="size-4" />
          Background
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Education & Certifications</h2>
      </div>

      <div className="reveal mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-subtle uppercase">
            <Icons.graduation className="size-4 text-accent" />
            Education
          </h3>
          <ul className="mt-5 flex flex-col gap-5">
            {education.map((entry) => (
              <li
                key={entry.school}
                className="border-l-2 border-line pl-4 transition hover:border-accent"
              >
                <p className="font-semibold">{entry.credential}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {entry.school}
                  {entry.period && ` · ${entry.period}`}
                </p>
                {entry.note && <p className="mt-1 text-sm text-subtle">{entry.note}</p>}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-subtle uppercase">
            <Icons.award className="size-4 text-accent" />
            Certifications
          </h3>
          <ul className="mt-5 flex flex-col gap-5">
            {certifications.map((cert) => (
              <li
                key={cert.name}
                className="border-l-2 border-line pl-4 transition hover:border-accent"
              >
                <p className="font-semibold">{cert.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {cert.issuer} · {cert.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
