import { certifications, education } from "@/data/credentials";

export function Credentials() {
  return (
    <section id="credentials" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Education & Certifications</h2>
      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-black/50 dark:text-white/50">Education</h3>
          <ul className="mt-4 flex flex-col gap-4">
            {education.map((entry) => (
              <li key={entry.school}>
                <p className="font-medium">{entry.credential}</p>
                <p className="text-sm text-black/70 dark:text-white/70">
                  {entry.school}
                  {entry.period && ` · ${entry.period}`}
                </p>
                {entry.note && (
                  <p className="mt-1 text-sm text-black/50 dark:text-white/50">{entry.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-black/50 dark:text-white/50">Certifications</h3>
          <ul className="mt-4 flex flex-col gap-4">
            {certifications.map((cert) => (
              <li key={cert.name}>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-black/70 dark:text-white/70">
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
