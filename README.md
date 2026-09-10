# Portfolio Site

Personal portfolio — a single-page site listing projects, skills, and contact info.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS 4.

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Structure

```
app/            Root layout and the single page
components/     Nav, Hero, Projects, Skills, Contact, Footer
data/           Project list rendered by the Projects section
```

Project cards in `data/projects.ts` link out to their GitHub repos.
