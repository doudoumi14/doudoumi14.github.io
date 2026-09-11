export const profile = {
  name: "Adem Brouri",
  credential: "P.Eng.",
  role: "Engineering Leadership · Lead Technology Consultant · MBA Candidate",
  summary:
    "Strategic software engineer (P.Eng.) and MBA candidate with 4+ years bridging deep technical execution and business growth — currently leading capacity, performance, and automation strategy for enterprise-scale infrastructure at Bell.",
  email: "adem.brouri.pro@gmail.com",
  github: "doudoumi14",
  linkedin: "https://www.linkedin.com/in/adem-brouri-ing-875b95169/",
  location: "Montreal, Canada · Open to remote / global hybrid",
};

export const githubUrl = `https://github.com/${profile.github}`;

export function repoUrl(repo: string) {
  return `${githubUrl}/${repo}`;
}
