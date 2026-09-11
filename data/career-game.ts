export interface CareerLevel {
  id: string;
  company: string;
  year: string;
  role: string;
  /** The real work this level is modelled on. */
  brief: string;
  /** What the player has to do. */
  objective: string;
  /** Real outcomes from the resume, revealed once the level is cleared. */
  rewards: string[];
  skills: string[];
}

// Ordered chronologically — the campaign plays forward through the career.
export const careerLevels: CareerLevel[] = [
  {
    id: "cae",
    company: "CAE",
    year: "2021",
    role: "Full-Stack Performance Engineer — Simulation",
    brief:
      "Flight simulators have to hold a steady frame rate or the training loses fidelity. My job was profiling the Prodigy engine's C++ render path and cutting the expensive work.",
    objective:
      "Run the flight deck, collect the frames, and dodge the frame drops. Reach the flag.",
    rewards: ["30% fidelity gain", "Shipped into high-value training contracts"],
    skills: ["C++", "Performance profiling", "Real-time rendering"],
  },
  {
    id: "archer",
    company: "Archer",
    year: "2022",
    role: "Development Team Lead — Salesforce & Automation",
    brief:
      "Leading a squad building Salesforce workflows. The wins came from replacing manual steps with automation that ran in the right order, every time.",
    objective: "Cross the automation floor collecting each pipeline stage. Avoid the manual-entry pits.",
    rewards: ["25% ahead of schedule", "40% less manual data entry"],
    skills: ["Apex", "Salesforce", "Team leadership"],
  },
  {
    id: "desjardins",
    company: "Desjardins",
    year: "2022 – 2023",
    role: "Functional Analyst — Digital Strategy",
    brief:
      "Financial products carry compliance weight. The work was translating between business and engineering, and keeping the backlog from burying the delivery team.",
    objective: "Work through the compliance vault, picking up every requirement on the way to the flag.",
    rewards: ["20% smaller backlog", "Migration delivered within compliance"],
    skills: ["Requirements analysis", "Data governance", "Risk management"],
  },
  {
    id: "bell",
    company: "Bell",
    year: "2023 – Present",
    role: "Lead Technology Consultant — Capacity, Performance & Automation",
    brief:
      "Enterprise infrastructure at national scale. Capacity planning is the difference between a quiet night and an outage, so we moved it from reactive to predictive.",
    objective: "Route packets through the network core. Collect the capacity wins and survive the overloads.",
    rewards: ["30% fewer interruptions", "90% of reporting automated", "99.9% availability"],
    skills: ["Python", "FastAPI", "AI/ML capacity modelling", "Network automation"],
  },
];

export interface MinigameResult {
  won: boolean;
  /** 0–100, shown on the results screen. */
  score: number;
  detail: string;
}

export interface MinigameProps {
  onComplete: (result: MinigameResult) => void;
}

export const PROGRESS_KEY = "career-progress";
const PROGRESS_EVENT = "career-progress-change";

export function loadProgress(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveProgress(ids: string[]) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Storage unavailable (private mode); progress just won't persist.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

// useSyncExternalStore plumbing, so components can read progress without
// setting state from inside an effect.
export function subscribeProgress(onChange: () => void) {
  window.addEventListener(PROGRESS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Snapshot must be a primitive so React can compare it cheaply. */
export function getProgressCount() {
  return loadProgress().length;
}

export function getServerProgressCount() {
  return 0;
}
