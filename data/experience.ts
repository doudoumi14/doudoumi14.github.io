export interface ExperienceEntry {
  company: string;
  title: string;
  period: string;
  location: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Bell",
    title: "Lead Technology Consultant — Capacity, Performance & Automation",
    period: "2023 – Present",
    location: "Montreal, Canada",
    highlights: [
      "Primary technology consultant for Tier-1 enterprise clients, translating business expansion goals into scalable infrastructure roadmaps",
      "Architected and led a full-stack automated network ecosystem (Python, Vue, FastAPI) across Meraki, Arista, and Fortinet platforms",
      "Led an AI-driven capacity planning initiative that cut system interruptions 30% and automated 90% of manual performance reporting",
      "Optimizes infrastructure OpEx against a capacity-to-revenue model while maintaining 99.9% service availability for critical national services",
    ],
  },
  {
    company: "Desjardins",
    title: "Functional Analyst — Digital Strategy",
    period: "2022 – 2023",
    location: "Montreal, Canada",
    highlights: [
      "Defined technical requirements for financial digital products, cutting project backlogs 20% through improved cross-departmental communication",
      "Kept technical delivery aligned with financial compliance and data governance standards through a major system migration",
    ],
  },
  {
    company: "Archer",
    title: "Development Team Lead — Salesforce & Automation",
    period: "2022",
    location: "Quebec, Canada",
    highlights: [
      "Led a development squad that delivered mission-critical Salesforce workflows 25% ahead of schedule",
      "Built internal automation tools that cut manual data entry 40% and streamlined executive reporting",
    ],
  },
  {
    company: "CAE",
    title: "Full-Stack Performance Engineer — Simulation",
    period: "2021",
    location: "Montreal, Canada",
    highlights: [
      "Optimized C++ rendering performance for the Prodigy engine, a 30% fidelity gain with direct impact on high-value training contracts",
    ],
  },
];
