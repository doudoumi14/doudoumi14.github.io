export interface Project {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  repo: string;
  highlights: string[];
}

// GITHUB_USERNAME is filled in once the portfolio owner's GitHub
// account is known; repo links below are relative to it.
export const GITHUB_USERNAME = "geekfanmanga";

export const projects: Project[] = [
  {
    name: "TaskFlow",
    tagline: "Full-stack project & task manager",
    description:
      "A task and project manager with per-user auth. Create projects, add tasks, and track them through To do / In progress / Done.",
    tech: ["React", "TypeScript", "Node.js", "Express", "Prisma", "SQLite"],
    repo: "taskflow",
    highlights: [
      "JWT auth with bcrypt-hashed passwords",
      "Ownership checks so users only ever see their own data",
      "Backend covered by Vitest + Supertest integration tests",
    ],
  },
  {
    name: "Expensely",
    tagline: "Expense tracker with spending insights",
    description:
      "Log expenses and see where the money goes via category and monthly breakdowns, charted with Recharts.",
    tech: ["React", "TypeScript", "Python", "FastAPI", "SQLAlchemy", "Recharts"],
    repo: "expense-tracker",
    highlights: [
      "Python/FastAPI backend with a typed React frontend",
      "Pie and bar chart summaries computed server-side",
      "pytest suite covering auth and per-user data isolation",
    ],
  },
  {
    name: "CollabBoard",
    tagline: "Real-time collaborative kanban board",
    description:
      "A kanban board that syncs instantly across every open tab over WebSockets — no polling, no refresh.",
    tech: ["React", "TypeScript", "Node.js", "Express", "Socket.io"],
    repo: "collabboard",
    highlights: [
      "Socket.io rooms broadcast board state to every connected client",
      "Native HTML5 drag-and-drop for moving cards between columns",
      "Unit-tested in-memory board store",
    ],
  },
];
