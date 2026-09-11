export interface SkillGroup {
  label: string;
  items: string[];
}

// Mirrors the "P.Eng + MBA hybrid" competency framing from the resume.
export const coreCompetencies: SkillGroup[] = [
  {
    label: "Leadership",
    items: ["Team Mentorship", "Change Management", "Agile / Scrum Leadership", "Organizational Behavior"],
  },
  {
    label: "Strategic",
    items: ["IT Roadmapping", "ROI Analysis", "Stakeholder Negotiation", "Strategic Resource Allocation"],
  },
  {
    label: "Technical",
    items: ["Cloud Architecture (AWS)", "Full-Stack Automation", "AI/ML Capacity Modeling"],
  },
  {
    label: "Operations",
    items: ["Financial Modeling (CapEx/OpEx)", "Business Analytics", "Risk Mitigation", "Technical Governance"],
  },
];

export const technicalToolkit: SkillGroup[] = [
  { label: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "SQL", "Apex"] },
  { label: "Cloud & DevOps", items: ["AWS", "CI/CD Pipelines", "Linux", "Infrastructure as Code", "Network Automation"] },
  { label: "Frontend", items: ["React", "Next.js", "Vue", "Vite", "Tailwind CSS", "Recharts"] },
  { label: "Backend", items: ["Node.js", "Express", "FastAPI", "Spring Boot", "REST APIs", "Socket.io / WebSockets"] },
  { label: "Data", items: ["Prisma", "SQLAlchemy", "SQLite"] },
  { label: "Testing & Tools", items: ["Vitest", "pytest", "Playwright", "Supertest", "Git"] },
];
