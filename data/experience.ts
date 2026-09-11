export interface ExperienceEntry {
  company: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stats: { value: string; label: string }[];
  stack: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Bell",
    title: "Lead Technology Consultant — Capacity, Performance & Automation",
    period: "2023 – Present",
    location: "Montreal, Canada",
    summary:
      "Primary technology consultant for Tier-1 enterprise clients, translating business expansion goals into scalable infrastructure roadmaps.",
    highlights: [
      "Architected and led a full-stack automated network ecosystem across Meraki, Arista, and Fortinet platforms",
      "Led an AI-driven capacity planning initiative for predictive system reliability",
      "Optimize infrastructure OpEx against a capacity-to-revenue model for critical national services",
    ],
    stats: [
      { value: "30%", label: "fewer interruptions" },
      { value: "90%", label: "reporting automated" },
      { value: "99.9%", label: "availability" },
    ],
    stack: ["Python", "Vue", "FastAPI", "AWS", "Network Automation"],
  },
  {
    company: "Desjardins",
    title: "Functional Analyst — Digital Strategy",
    period: "2022 – 2023",
    location: "Montreal, Canada",
    summary:
      "Bridged business and engineering on financial digital products through a major system migration.",
    highlights: [
      "Orchestrated technical requirements across departments to unblock delivery",
      "Kept delivery aligned with financial compliance and data governance standards",
    ],
    stats: [{ value: "20%", label: "smaller backlog" }],
    stack: ["Requirements", "Data Governance", "Risk Management"],
  },
  {
    company: "Archer",
    title: "Development Team Lead — Salesforce & Automation",
    period: "2022",
    location: "Quebec, Canada",
    summary:
      "Led a development squad delivering mission-critical Salesforce workflows, owning sprint velocity and code quality.",
    highlights: [
      "Delivered mission-critical Salesforce workflows ahead of schedule",
      "Built internal automation that streamlined executive reporting",
    ],
    stats: [
      { value: "25%", label: "ahead of schedule" },
      { value: "40%", label: "less manual entry" },
    ],
    stack: ["Apex", "Salesforce", "Automation"],
  },
  {
    company: "CAE",
    title: "Full-Stack Performance Engineer — Simulation",
    period: "2021",
    location: "Montreal, Canada",
    summary:
      "Optimized rendering performance for the Prodigy simulation engine, with direct impact on high-value training contracts.",
    highlights: ["Profiled and optimized C++ rendering hot paths in a real-time simulation engine"],
    stats: [{ value: "30%", label: "fidelity gain" }],
    stack: ["C++", "Real-time Rendering", "Performance Profiling"],
  },
];
