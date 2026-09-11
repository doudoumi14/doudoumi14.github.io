import { profile } from "@/data/profile";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-6 py-4">
        <a href="#top" className="shrink-0 whitespace-nowrap font-semibold tracking-tight">
          {profile.name}
        </a>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-black/70 dark:text-white/70">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-black dark:hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
