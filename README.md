# Portfolio Site

[![CI](https://github.com/doudoumi14/portfolio-site/actions/workflows/ci.yml/badge.svg)](https://github.com/doudoumi14/portfolio-site/actions/workflows/ci.yml)

Personal portfolio — a single-page site listing projects, skills, and contact info.

![Portfolio site](docs/screenshot.png)

## Stack

Next.js (App Router), TypeScript, Tailwind CSS 4.

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Career mode

The experience section is playable. Each of the four roles is a side-scrolling
level themed to that job — the flight deck at CAE, the automation floor at
Archer, the compliance vault at Desjardins, and the network core at Bell.
Collect the pickups, dodge the hazards, reach the flag; clearing a level
reveals the real outcomes from that role. Progress is kept in `localStorage`.

The game is a small canvas engine in `components/game/arcade` — gravity and
AABB collision, a parallax backdrop, particles and screen shake, with keyboard
and touch controls. No game library.

![Career mode level select](docs/career-mode.png)

![Capacity routing minigame](docs/career-gameplay.png)

Other interactive pieces: an animated network canvas behind the hero, a
terminal (press `/`) that will print any section of the CV, tilt-on-hover
project cards, and a Konami code.

## Tests

End-to-end browser tests (Playwright) covering content, repo links, anchor
navigation, and mobile layout:

```bash
npx playwright install chromium
npm run test:e2e
```

## Structure

```
app/            Root layout and the single page
components/     Nav, Hero, Projects, Skills, Contact, Footer
data/           Project list rendered by the Projects section
```

Project cards in `data/projects.ts` link out to their GitHub repos.
