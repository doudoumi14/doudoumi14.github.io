export interface CareerLevel {
  id: string;
  /** Groups the chapters into the arc: Algiers, the move, rebuilding, career, now. */
  act: string;
  company: string;
  place?: string;
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
    id: "usthb",
    act: "Algiers",
    company: "USTHB",
    place: "Algiers, Algeria",
    year: "2015 - 2018",
    role: "Licence en électronique, option Automatique",
    brief:
      "Three years of electronics and control systems at Bab Ezzouar - circuits, signals, DSP, microcontrollers. Sixty credits of it. I left for Canada before the degree was conferred, so none of this arrived with a diploma attached.",
    objective: "Bank the credits, survive the lab work, and get through Les Examens.",
    rewards: ["60 credits in electronics and automatic control", "The engineering instincts everything later was built on"],
    skills: ["Control systems", "Signal processing", "Microcontrollers", "FPGA"],
  },
  {
    id: "crossing",
    act: "The move",
    company: "One-way flight",
    place: "Algiers to Montreal",
    year: "2018",
    role: "Emigrating to Canada",
    brief:
      "Twenty-one, one suitcase, and a transcript that no Canadian institution recognised. Everything technical I knew came with me. Everything official did not.",
    objective: "Carry across what matters, then get the file past The Paperwork.",
    rewards: ["Landed in Montreal, 2018", "Began again from zero credits"],
    skills: ["French and English", "Starting over", "Persistence"],
  },
  {
    id: "uqam",
    act: "Rebuilding",
    company: "UQAM",
    place: "Montreal",
    year: "2018 - 2020",
    role: "Baccalauréat en informatique et génie logiciel",
    brief:
      "Fifty credits at UQAM, and a deliberate switch from electronics into software. First Quebec winter, a new academic system, and a transcript being rebuilt one course at a time.",
    objective: "Bank fifty credits through the winter and clear The Equivalence.",
    rewards: ["50 credits toward the degree", "Changed field: electronics to software"],
    skills: ["Algorithms", "Java and C", "Databases"],
  },
  {
    id: "polytechnique",
    act: "Rebuilding",
    company: "Polytechnique Montreal",
    place: "Montreal",
    year: "to 2021",
    role: "B.Eng., Software Engineering",
    brief:
      "The degree that finally counted here, and the one that opens the path to the Iron Ring and the P.Eng. from the Ordre des ingénieurs du Québec.",
    objective: "Meet every requirement, then ship The Capstone.",
    rewards: ["B.Eng. Software Engineering", "Route to P.Eng. (OIQ)"],
    skills: ["C++", "Software architecture", "Operating systems"],
  },
  {
    id: "cae",
    act: "Career",
    company: "CAE",
    year: "2021",
    role: "Full-Stack Performance Engineer — Simulation",
    brief:
      "Flight simulators have to hold a steady frame rate or the training loses fidelity. My job was profiling the Prodigy engine's C++ render path and cutting the expensive work.",
    objective:
      "Catch the frames, stomp the frame-drops, and bring down the Frame Dropper at the end.",
    rewards: ["30% fidelity gain", "Shipped into high-value training contracts"],
    skills: ["C++", "Performance profiling", "Real-time rendering"],
  },
  {
    id: "citizenship",
    act: "Career",
    company: "Canada",
    place: "Montreal",
    year: "2022",
    role: "Canadian citizenship",
    brief:
      "Four years after landing: residency satisfied, the test passed, the oath taken. The paperwork that started in 2018 finally closed.",
    objective: "Complete every step and pass The Test.",
    rewards: ["Canadian citizen, 2022"],
    skills: ["Four years of persistence"],
  },
  {
    id: "archer",
    act: "Career",
    company: "Archer",
    year: "2022",
    role: "Development Team Lead — Salesforce & Automation",
    brief:
      "Leading a squad building Salesforce workflows. The wins came from replacing manual steps with automation that ran in the right order, every time.",
    objective: "Climb the pipeline collecting each stage, then take out the Manual Process itself.",
    rewards: ["25% ahead of schedule", "40% less manual data entry"],
    skills: ["Apex", "Salesforce", "Team leadership"],
  },
  {
    id: "desjardins",
    act: "Career",
    company: "Desjardins",
    year: "2022 – 2023",
    role: "Functional Analyst — Digital Strategy",
    brief:
      "Financial products carry compliance weight. The work was translating between business and engineering, and keeping the backlog from burying the delivery team.",
    objective: "Scale the vault, gather every requirement, and clear the Audit Findings guarding the exit.",
    rewards: ["20% smaller backlog", "Migration delivered within compliance"],
    skills: ["Requirements analysis", "Data governance", "Risk management"],
  },
  {
    id: "bell",
    act: "Career",
    company: "Bell",
    year: "2023 – Present",
    role: "Lead Technology Consultant — Capacity, Performance & Automation",
    brief:
      "Enterprise infrastructure at national scale. Capacity planning is the difference between a quiet night and an outage, so we moved it from reactive to predictive.",
    objective: "Route the packets through the core, survive the surge, and beat Peak Load.",
    rewards: ["30% fewer interruptions", "90% of reporting automated", "99.9% availability"],
    skills: ["Python", "FastAPI", "AI/ML capacity modelling", "Network automation"],
  },
  {
    id: "mba",
    act: "Now",
    company: "Université Laval",
    place: "Quebec",
    year: "expected 2027",
    role: "MBA, Business Analytics",
    brief:
      "Running alongside the Bell role: strategic management, financial intelligence and data-driven leadership. AACSB and EQUIS accredited. Still in progress.",
    objective: "Clear the modules and face The Dissertation.",
    rewards: ["MBA expected 2027", "AACSB + EQUIS accredited"],
    skills: ["Strategy", "Financial intelligence", "Business analytics"],
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
