import type { IconName } from "@/components/Icons";

export interface SkillGroup {
  label: string;
  icon: IconName;
  items: string[];
}

// Mirrors the "P.Eng + MBA hybrid" competency framing from the resume.
export const coreCompetencies: SkillGroup[] = [
  {
    label: "Leadership", icon: "leadership",
    items: ["Team Mentorship", "Change Management", "Agile / Scrum Leadership", "Organizational Behavior"],
  },
  {
    label: "Strategic", icon: "strategy",
    items: ["IT Roadmapping", "ROI Analysis", "Stakeholder Negotiation", "Strategic Resource Allocation"],
  },
  {
    label: "Technical", icon: "chip",
    items: ["Cloud Architecture (AWS)", "Full-Stack Automation", "AI/ML Capacity Modeling"],
  },
  {
    label: "Operations", icon: "operations",
    items: ["Financial Modeling (CapEx/OpEx)", "Business Analytics", "Risk Mitigation", "Technical Governance"],
  },
];

export const technicalToolkit: SkillGroup[] = [
  { label: "Languages", icon: "code", items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "SQL", "Apex"] },
  { label: "Cloud & DevOps", icon: "cloud", items: ["AWS", "CI/CD Pipelines", "Linux", "Infrastructure as Code", "Network Automation"] },
  { label: "Frontend", icon: "browser", items: ["React", "Next.js", "Vue", "Vite", "Tailwind CSS", "Recharts"] },
  { label: "Backend", icon: "server", items: ["Node.js", "Express", "FastAPI", "Spring Boot", "REST APIs", "Socket.io / WebSockets"] },
  { label: "Data", icon: "database", items: ["Prisma", "SQLAlchemy", "SQLite"] },
  { label: "Testing & Tools", icon: "check", items: ["Vitest", "pytest", "Playwright", "Supertest", "Git"] },
];
