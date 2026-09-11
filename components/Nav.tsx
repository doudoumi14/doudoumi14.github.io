"use client";

import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

// "top" is tracked but has no nav link, so nothing is highlighted while the
// hero is in view instead of the highlight sticking to the last section.
const SECTION_IDS = ["top", ...LINKS.map((link) => link.id)];

export function Nav() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-6 py-4">
        <a href="#top" className="shrink-0 text-sm font-bold tracking-tight whitespace-nowrap">
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`rounded-full px-3 py-1.5 transition ${
                    active === link.id
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
