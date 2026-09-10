export const profile = {
  name: "Adem Brouri",
  role: "Full-stack developer",
  email: "adem.brouri.pro@gmail.com",
  github: "doudoumi14",
};

export const githubUrl = `https://github.com/${profile.github}`;

export function repoUrl(repo: string) {
  return `${githubUrl}/${repo}`;
}
