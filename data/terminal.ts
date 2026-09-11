import { certifications, education } from "./credentials";
import { experience } from "./experience";
import { headlineMetrics } from "./metrics";
import { profile } from "./profile";
import { projects } from "./projects";
import { coreCompetencies, technicalToolkit } from "./skills";

export interface CommandResult {
  lines: string[];
  action?: "clear" | "open-linkedin" | "open-github" | "open-email";
}

const COMMANDS: Record<string, { description: string; run: () => CommandResult }> = {
  help: {
    description: "list available commands",
    run: () => ({
      lines: [
        "Available commands:",
        "",
        ...Object.entries(COMMANDS).map(
          ([name, cmd]) => `  ${name.padEnd(12)} ${cmd.description}`,
        ),
        "",
        "Tip: ↑/↓ cycles history, Tab completes, Esc closes.",
      ],
    }),
  },
  whoami: {
    description: "who is this guy",
    run: () => ({
      lines: [
        `${profile.name}, ${profile.credential}`,
        profile.role,
        "",
        profile.summary,
        "",
        `location: ${profile.location}`,
      ],
    }),
  },
  experience: {
    description: "print work history",
    run: () => ({
      lines: experience.flatMap((role) => [
        `${role.period.padEnd(16)} ${role.company} — ${role.title}`,
        `${" ".repeat(16)} ${role.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}`,
        "",
      ]),
    }),
  },
  impact: {
    description: "the numbers that matter",
    run: () => ({
      lines: headlineMetrics.map(
        (m) => `  ${(m.value + m.suffix).padEnd(8)} ${m.label} — ${m.detail}`,
      ),
    }),
  },
  skills: {
    description: "competencies and stack",
    run: () => ({
      lines: [
        "Core competencies:",
        ...coreCompetencies.map((g) => `  ${g.label.padEnd(12)} ${g.items.join(", ")}`),
        "",
        "Technical toolkit:",
        ...technicalToolkit.map((g) => `  ${g.label.padEnd(16)} ${g.items.join(", ")}`),
      ],
    }),
  },
  projects: {
    description: "side projects with source",
    run: () => ({
      lines: projects.flatMap((p) => [
        `${p.name} — ${p.tagline}`,
        `  ${p.description}`,
        `  github.com/${profile.github}/${p.repo}`,
        "",
      ]),
    }),
  },
  education: {
    description: "degrees and certifications",
    run: () => ({
      lines: [
        ...education.map((e) => `  ${e.credential} — ${e.school}${e.period ? ` (${e.period})` : ""}`),
        "",
        ...certifications.map((c) => `  ${c.name} — ${c.issuer} (${c.year})`),
      ],
    }),
  },
  contact: {
    description: "how to reach me",
    run: () => ({
      lines: [
        `  email     ${profile.email}`,
        `  linkedin  ${profile.linkedin}`,
        `  github    github.com/${profile.github}`,
        "",
        "Try: linkedin, github, or email to open directly.",
      ],
    }),
  },
  linkedin: { description: "open LinkedIn", run: () => ({ lines: ["Opening LinkedIn…"], action: "open-linkedin" }) },
  github: { description: "open GitHub", run: () => ({ lines: ["Opening GitHub…"], action: "open-github" }) },
  email: { description: "compose an email", run: () => ({ lines: ["Opening mail client…"], action: "open-email" }) },
  clear: { description: "clear the screen", run: () => ({ lines: [], action: "clear" }) },
  sudo: {
    description: "escalate privileges",
    run: () => ({
      lines: [
        "Nice try.",
        `${profile.name} is not in the sudoers file. This incident has been reported.`,
      ],
    }),
  },
  hire: {
    description: "the only command that matters",
    run: () => ({
      lines: [
        "  ┌──────────────────────────────────────────┐",
        "  │  STATUS: open to the right opportunity   │",
        "  └──────────────────────────────────────────┘",
        "",
        `  Reach out: ${profile.email}`,
      ],
      action: undefined,
    }),
  },
};

export const COMMAND_NAMES = Object.keys(COMMANDS);

export const BANNER = [
  `${profile.name.toUpperCase()} // ${profile.credential}`,
  "Type 'help' for commands, or 'whoami' to start.",
];

export function runCommand(input: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [name, ...rest] = trimmed.toLowerCase().split(/\s+/);

  // `sudo anything` still lands on the sudo joke rather than "not found".
  const command = COMMANDS[name];
  if (command) return command.run();

  if (rest.length > 0 && COMMANDS[rest[0]]) return COMMANDS[rest[0]].run();

  return {
    lines: [`command not found: ${name}`, "Type 'help' to see what's available."],
  };
}
