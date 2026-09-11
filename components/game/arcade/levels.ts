export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

import type { BossKind, EnemySkin, PickupIcon } from "./sprites";

export interface Collectible {
  x: number;
  y: number;
  label: string;
  /** Chosen to match what the label means, not for decoration. */
  icon: PickupIcon;
  /** Degrees. Every pickup in a level gets its own hue so none look alike. */
  hue: number;
}

export type EnemyType = "patroller" | "flyer";

export interface Enemy {
  x: number;
  y: number;
  type: EnemyType;
  /** Patrol half-width, or vertical amplitude for a flyer. */
  range: number;
  speed: number;
  hue: number;
}

export interface Boss {
  x: number;
  name: string;
  /** Stomps needed to finish it. */
  hits: number;
  kind: BossKind;
  hue: number;
}

export interface LevelTheme {
  sky: [string, string];
  far: string;
  mid: string;
  ground: string;
  groundTop: string;
  accent: string;
  hazard: string;
  backdrop: "clouds" | "office" | "vault" | "servers";
}

export interface ArcadeLevel {
  id: string;
  title: string;
  pickupName: string;
  width: number;
  platforms: Rect[];
  collectibles: Collectible[];
  hazards: Rect[];
  enemies: Enemy[];
  /** Enemies are drawn as that level's own hazard, not a shared monster. */
  enemySkin: EnemySkin;
  boss: Boss;
  theme: LevelTheme;
}

// Authored against a fixed 900x480 virtual viewport and scaled to fit, so
// physics and layout behave identically on every screen.
export const VIEW_W = 900;
export const VIEW_H = 480;
export const GROUND_Y = 400;

function ground(width: number): Rect {
  return { x: 0, y: GROUND_Y, w: width, h: VIEW_H - GROUND_Y };
}


/**
 * Platform archetypes for the story chapters. Hand-placing every rect made the
 * first four levels feel distinct but is a lot of data; these keep each new
 * chapter compact while still giving it its own shape.
 */
function layout(
  kind: "journey" | "winter" | "climb" | "campus" | "civic" | "boardroom",
  width: number,
): Rect[] {
  const out: Rect[] = [ground(width)];
  const add = (x: number, y: number, w = 130) => out.push({ x, y, w, h: 18 });

  switch (kind) {
    case "journey":
      // Sparse and far apart: a long way with little to stand on.
      for (let i = 0; i < 7; i++) add(340 + i * 330, i % 2 ? 268 : 322, 120);
      break;
    case "winter":
      for (let i = 0; i < 8; i++) add(300 + i * 280, i % 3 === 0 ? 218 : 310, 140);
      break;
    case "climb":
      // A steady ascent that resets twice.
      for (let i = 0; i < 10; i++) add(300 + i * 240, 340 - (i % 5) * 52, 120);
      break;
    case "campus":
      for (let i = 0; i < 9; i++) add(310 + i * 270, i % 2 ? 232 : 312, 135);
      break;
    case "civic":
      for (let i = 0; i < 6; i++) add(320 + i * 300, 300 - (i % 3) * 62, 140);
      break;
    case "boardroom":
      for (let i = 0; i < 8; i++) add(320 + i * 290, i % 2 ? 250 : 318, 150);
      break;
  }
  return out;
}

function spikes(xs: number[]): Rect[] {
  return xs.map((x) => ({ x, y: 380, w: 56, h: 20 }));
}

export const arcadeLevels: Record<string, ArcadeLevel> = {
  // ---- Act I: Algiers ----
  usthb: {
    id: "usthb",
    title: "USTHB, Alger",
    pickupName: "credits earned",
    width: 2700,
    platforms: layout("campus", 2700),
    collectibles: [
      { x: 330, y: 268, label: "Circuit analysis", icon: "spark", hue: 35 },
      { x: 600, y: 188, label: "Signals & systems", icon: "gauge", hue: 200 },
      { x: 880, y: 268, label: "Control loops", icon: "gear", hue: 145 },
      { x: 1150, y: 188, label: "Microcontrollers", icon: "gear", hue: 20 },
      { x: 1420, y: 268, label: "DSP", icon: "spark", hue: 280 },
      { x: 1690, y: 188, label: "FPGA design", icon: "packet", hue: 175 },
      { x: 1960, y: 268, label: "Lab reports", icon: "doc", hue: 55 },
      { x: 2230, y: 188, label: "60 credits", icon: "gauge", hue: 95 },
    ],
    hazards: spikes([520, 1080, 1620, 2120]),
    enemies: [
      { x: 900, y: GROUND_Y - 30, type: "patroller", range: 120, speed: 58, hue: 30 },
      { x: 1500, y: 240, type: "flyer", range: 50, speed: 64, hue: 42 },
      { x: 2000, y: GROUND_Y - 30, type: "patroller", range: 130, speed: 70, hue: 30 },
    ],
    enemySkin: "form",
    boss: { x: 2480, name: "Les Examens", hits: 3, kind: "exam", hue: 8 },
    theme: {
      sky: ["#6b3f1d", "#d99a52"],
      far: "#8a5626",
      mid: "#6d4320",
      ground: "#4a2d15",
      groundTop: "#b8762f",
      accent: "#ffd08a",
      hazard: "#c0392b",
      backdrop: "office",
    },
  },

  // ---- Act II: the move ----
  crossing: {
    id: "crossing",
    title: "One-way flight",
    pickupName: "carried across",
    width: 2600,
    platforms: layout("journey", 2600),
    collectibles: [
      { x: 300, y: 330, label: "Passport", icon: "doc", hue: 205 },
      { x: 400, y: 222, label: "Transcripts", icon: "doc", hue: 45 },
      { x: 730, y: 276, label: "French & English", icon: "packet", hue: 160 },
      { x: 1060, y: 222, label: "Savings", icon: "gauge", hue: 130 },
      { x: 1390, y: 276, label: "One suitcase", icon: "shield", hue: 25 },
      { x: 1720, y: 222, label: "First winter coat", icon: "shield", hue: 195 },
      { x: 2050, y: 276, label: "Starting over at 21", icon: "spark", hue: 300 },
    ],
    hazards: spikes([620, 1240, 1860]),
    enemies: [
      { x: 950, y: GROUND_Y - 30, type: "patroller", range: 130, speed: 62, hue: 215 },
      { x: 1550, y: 240, type: "flyer", range: 54, speed: 70, hue: 215 },
    ],
    enemySkin: "form",
    boss: { x: 2380, name: "The Paperwork", hits: 3, kind: "dossier", hue: 210 },
    theme: {
      sky: ["#8a5a2b", "#3f6b93"],
      far: "#4e6f91",
      mid: "#3c5875",
      ground: "#26384d",
      groundTop: "#5b87b5",
      accent: "#ffd9a0",
      hazard: "#e05252",
      backdrop: "clouds",
    },
  },

  // ---- Act III: rebuilding in Montreal ----
  uqam: {
    id: "uqam",
    title: "UQAM, first winter",
    pickupName: "credits banked",
    width: 2800,
    platforms: layout("winter", 2800),
    collectibles: [
      { x: 340, y: 174, label: "Switched to software", icon: "gear", hue: 210 },
      { x: 620, y: 266, label: "Algorithms", icon: "spark", hue: 275 },
      { x: 900, y: 266, label: "Java & C", icon: "packet", hue: 150 },
      { x: 1180, y: 174, label: "Databases", icon: "doc", hue: 35 },
      { x: 1460, y: 266, label: "Nothing transferred", icon: "shield", hue: 0 },
      { x: 1740, y: 266, label: "Minus 30°C, still going", icon: "gauge", hue: 190 },
      { x: 2020, y: 174, label: "50 credits", icon: "gauge", hue: 100 },
    ],
    hazards: spikes([500, 1060, 1600, 2180]),
    enemies: [
      { x: 800, y: 230, type: "flyer", range: 60, speed: 66, hue: 195 },
      { x: 1300, y: GROUND_Y - 30, type: "patroller", range: 120, speed: 64, hue: 200 },
      { x: 1900, y: 210, type: "flyer", range: 56, speed: 74, hue: 195 },
    ],
    enemySkin: "snow",
    boss: { x: 2560, name: "The Equivalence", hits: 4, kind: "stamp", hue: 200 },
    theme: {
      sky: ["#16243a", "#5b7fa6"],
      far: "#2b4257",
      mid: "#1e3145",
      ground: "#15222f",
      groundTop: "#7aa0c4",
      accent: "#cfe8ff",
      hazard: "#ff7b7b",
      backdrop: "vault",
    },
  },

  polytechnique: {
    id: "polytechnique",
    title: "Polytechnique",
    pickupName: "requirements met",
    width: 2900,
    platforms: layout("climb", 2900),
    collectibles: [
      { x: 350, y: 296, label: "C++ & data structures", icon: "spark", hue: 220 },
      { x: 590, y: 244, label: "Software architecture", icon: "gear", hue: 265 },
      { x: 830, y: 192, label: "Operating systems", icon: "packet", hue: 175 },
      { x: 1070, y: 140, label: "Team projects", icon: "doc", hue: 40 },
      { x: 1310, y: 296, label: "Internships", icon: "gauge", hue: 130 },
      { x: 1790, y: 192, label: "Capstone build", icon: "gear", hue: 300 },
      { x: 2270, y: 140, label: "B.Eng. conferred", icon: "shield", hue: 95 },
      { x: 2510, y: 296, label: "Path to P.Eng.", icon: "shield", hue: 55 },
    ],
    hazards: spikes([510, 1150, 1670, 2190]),
    enemies: [
      { x: 950, y: GROUND_Y - 30, type: "patroller", range: 120, speed: 66, hue: 255 },
      { x: 1450, y: 200, type: "flyer", range: 52, speed: 76, hue: 255 },
      { x: 2050, y: GROUND_Y - 30, type: "patroller", range: 130, speed: 80, hue: 255 },
    ],
    enemySkin: "form",
    boss: { x: 2700, name: "The Capstone", hits: 4, kind: "diploma", hue: 265 },
    theme: {
      sky: ["#1d2140", "#5a5fa8"],
      far: "#31356b",
      mid: "#262a52",
      ground: "#1b1e3a",
      groundTop: "#6f74c4",
      accent: "#b9bcff",
      hazard: "#ff6b8a",
      backdrop: "office",
    },
  },

  citizenship: {
    id: "citizenship",
    title: "The ceremony",
    pickupName: "steps completed",
    width: 2200,
    platforms: layout("civic", 2200),
    collectibles: [
      { x: 360, y: 254, label: "Residency years", icon: "gauge", hue: 10 },
      { x: 660, y: 192, label: "Language proof", icon: "doc", hue: 205 },
      { x: 960, y: 254, label: "The citizenship test", icon: "shield", hue: 45 },
      { x: 1260, y: 192, label: "The oath", icon: "shield", hue: 140 },
      { x: 1560, y: 254, label: "Canadian citizen, 2022", icon: "spark", hue: 0 },
    ],
    hazards: spikes([560, 1160]),
    enemies: [
      { x: 850, y: GROUND_Y - 30, type: "patroller", range: 110, speed: 60, hue: 355 },
      { x: 1400, y: 230, type: "flyer", range: 48, speed: 68, hue: 355 },
    ],
    enemySkin: "form",
    boss: { x: 2000, name: "The Test", hits: 3, kind: "exam", hue: 355 },
    theme: {
      sky: ["#4a1520", "#b5485c"],
      far: "#6d2130",
      mid: "#521a26",
      ground: "#3a1219",
      groundTop: "#c25668",
      accent: "#ffd6dc",
      hazard: "#ff8f6b",
      backdrop: "vault",
    },
  },

  // ---- Act V: now ----
  mba: {
    id: "mba",
    title: "Laval, in progress",
    pickupName: "modules cleared",
    width: 2700,
    platforms: layout("boardroom", 2700),
    collectibles: [
      { x: 380, y: 206, label: "Strategic management", icon: "gear", hue: 215 },
      { x: 670, y: 274, label: "Financial intelligence", icon: "gauge", hue: 140 },
      { x: 960, y: 206, label: "Business analytics", icon: "gauge", hue: 275 },
      { x: 1250, y: 274, label: "Data-driven leadership", icon: "packet", hue: 35 },
      { x: 1540, y: 206, label: "Negotiation", icon: "doc", hue: 180 },
      { x: 1830, y: 274, label: "AACSB + EQUIS", icon: "shield", hue: 95 },
      { x: 2120, y: 206, label: "Expected 2027", icon: "spark", hue: 300 },
    ],
    hazards: spikes([560, 1120, 1700, 2260]),
    enemies: [
      { x: 900, y: GROUND_Y - 30, type: "patroller", range: 125, speed: 68, hue: 225 },
      { x: 1450, y: 240, type: "flyer", range: 55, speed: 76, hue: 225 },
      { x: 2000, y: GROUND_Y - 30, type: "patroller", range: 135, speed: 82, hue: 225 },
    ],
    enemySkin: "form",
    boss: { x: 2500, name: "The Dissertation", hits: 4, kind: "clipboard", hue: 225 },
    theme: {
      sky: ["#0f2b2f", "#2f7f86"],
      far: "#1b4a50",
      mid: "#133a3f",
      ground: "#0d2a2e",
      groundTop: "#3a9aa3",
      accent: "#9ff0f5",
      hazard: "#ffa94d",
      backdrop: "servers",
    },
  },

  // Long runway strides and high floating platforms — this one is about
  // committing to big jumps.
  cae: {
    id: "cae",
    title: "Flight Deck",
    pickupName: "frames",
    width: 2900,
    platforms: [
      ground(2900),
      { x: 380, y: 318, w: 130, h: 18 },
      { x: 690, y: 252, w: 120, h: 18 },
      { x: 1010, y: 318, w: 130, h: 18 },
      { x: 1330, y: 236, w: 110, h: 18 },
      { x: 1560, y: 320, w: 130, h: 18 },
      { x: 1880, y: 244, w: 120, h: 18 },
      { x: 2140, y: 316, w: 140, h: 18 },
      { x: 2420, y: 250, w: 130, h: 18 },
    ],
    collectibles: [
      { x: 260, y: 352, label: "Held 60 fps", icon: "gauge", hue: 200 },
      { x: 440, y: 272, label: "Cut draw cost", icon: "gear", hue: 280 },
      { x: 748, y: 206, label: "Culled hidden work", icon: "spark", hue: 330 },
      { x: 1070, y: 272, label: "Batched draw calls", icon: "gear", hue: 150 },
      { x: 1382, y: 190, label: "Profiled hot paths", icon: "gauge", hue: 45 },
      { x: 1620, y: 274, label: "Optimised shaders", icon: "spark", hue: 20 },
      { x: 1938, y: 198, label: "+30% fidelity", icon: "gauge", hue: 190 },
      { x: 2200, y: 270, label: "Shipped to simulators", icon: "packet", hue: 100 },
    ],
    hazards: [
      { x: 600, y: 380, w: 52, h: 20 },
      { x: 1210, y: 380, w: 60, h: 20 },
      { x: 1790, y: 380, w: 56, h: 20 },
      { x: 2320, y: 380, w: 52, h: 20 },
    ],
    enemies: [
      { x: 900, y: GROUND_Y - 30, type: "patroller", range: 110, speed: 55, hue: 8 },
      { x: 1480, y: 210, type: "flyer", range: 52, speed: 60, hue: 320 },
      { x: 2000, y: GROUND_Y - 30, type: "patroller", range: 130, speed: 70, hue: 8 },
    ],
    enemySkin: "glitch",
    boss: { x: 2720, name: "Frame Dropper", hits: 3, kind: "frame", hue: 5 },
    theme: {
      sky: ["#1b3a63", "#5c8fc4"],
      far: "#2f5680",
      mid: "#24466b",
      ground: "#1c3350",
      groundTop: "#3f6f9e",
      accent: "#8fd3ff",
      hazard: "#ff6b6b",
      backdrop: "clouds",
    },
  },

  // A rising staircase — steady upward progress, like the pipeline it models.
  archer: {
    id: "archer",
    title: "Automation Floor",
    pickupName: "steps automated",
    width: 2800,
    platforms: [
      ground(2800),
      { x: 330, y: 340, w: 120, h: 18 },
      { x: 520, y: 296, w: 120, h: 18 },
      { x: 710, y: 252, w: 120, h: 18 },
      { x: 900, y: 208, w: 120, h: 18 },
      { x: 1150, y: 300, w: 130, h: 18 },
      { x: 1380, y: 256, w: 120, h: 18 },
      { x: 1600, y: 212, w: 120, h: 18 },
      { x: 1830, y: 168, w: 120, h: 18 },
      { x: 2090, y: 268, w: 140, h: 18 },
      { x: 2340, y: 214, w: 130, h: 18 },
    ],
    collectibles: [
      { x: 385, y: 296, label: "Lead intake", icon: "doc", hue: 265 },
      { x: 575, y: 252, label: "Validation rules", icon: "shield", hue: 200 },
      { x: 765, y: 208, label: "Account enrichment", icon: "doc", hue: 310 },
      { x: 955, y: 164, label: "Auto-routing", icon: "packet", hue: 160 },
      { x: 1210, y: 256, label: "Approval workflow", icon: "shield", hue: 50 },
      { x: 1435, y: 212, label: "Reporting writeback", icon: "doc", hue: 225 },
      { x: 1655, y: 168, label: "-40% manual entry", icon: "gauge", hue: 15 },
      { x: 1888, y: 124, label: "25% ahead of schedule", icon: "gauge", hue: 120 },
    ],
    hazards: [
      { x: 470, y: 380, w: 54, h: 20 },
      { x: 1060, y: 380, w: 58, h: 20 },
      { x: 1700, y: 380, w: 58, h: 20 },
      { x: 2250, y: 380, w: 54, h: 20 },
    ],
    enemies: [
      { x: 1050, y: GROUND_Y - 30, type: "patroller", range: 120, speed: 62, hue: 290 },
      { x: 1520, y: 176, type: "flyer", range: 44, speed: 72, hue: 275 },
      { x: 1960, y: GROUND_Y - 30, type: "patroller", range: 140, speed: 78, hue: 290 },
      { x: 2200, y: 200, type: "flyer", range: 58, speed: 64, hue: 275 },
    ],
    enemySkin: "form",
    boss: { x: 2620, name: "Manual Process", hits: 3, kind: "clipboard", hue: 285 },
    theme: {
      sky: ["#2a1f4d", "#6b4ea8"],
      far: "#3b2b6b",
      mid: "#2f2256",
      ground: "#241a42",
      groundTop: "#6b52b8",
      accent: "#c9b6ff",
      hazard: "#ff7ab8",
      backdrop: "office",
    },
  },

  // Tight stacked chambers — more climbing, less running.
  desjardins: {
    id: "desjardins",
    title: "Compliance Vault",
    pickupName: "items triaged",
    width: 2700,
    platforms: [
      ground(2700),
      { x: 300, y: 326, w: 110, h: 18 },
      { x: 300, y: 224, w: 110, h: 18 },
      { x: 520, y: 274, w: 110, h: 18 },
      { x: 520, y: 168, w: 110, h: 18 },
      { x: 760, y: 322, w: 110, h: 18 },
      { x: 940, y: 246, w: 110, h: 18 },
      { x: 940, y: 148, w: 110, h: 18 },
      { x: 1180, y: 300, w: 120, h: 18 },
      { x: 1400, y: 220, w: 110, h: 18 },
      { x: 1400, y: 130, w: 110, h: 18 },
      { x: 1650, y: 292, w: 120, h: 18 },
      { x: 1880, y: 212, w: 110, h: 18 },
      { x: 2110, y: 300, w: 130, h: 18 },
    ],
    collectibles: [
      { x: 355, y: 282, label: "Data retention policy", icon: "doc", hue: 160 },
      { x: 355, y: 180, label: "Audit trail", icon: "doc", hue: 45 },
      { x: 575, y: 124, label: "Consent capture", icon: "shield", hue: 200 },
      { x: 815, y: 278, label: "PII encrypted at rest", icon: "shield", hue: 0 },
      { x: 995, y: 104, label: "Data governance", icon: "shield", hue: 265 },
      { x: 1240, y: 256, label: "System migration", icon: "packet", hue: 120 },
      { x: 1455, y: 86, label: "-20% backlog", icon: "gauge", hue: 315 },
      { x: 1710, y: 248, label: "Compliance sign-off", icon: "shield", hue: 85 },
      { x: 1935, y: 168, label: "Requirements aligned", icon: "shield", hue: 25 },
    ],
    hazards: [
      { x: 660, y: 380, w: 56, h: 20 },
      { x: 1080, y: 380, w: 60, h: 20 },
      { x: 1560, y: 380, w: 58, h: 20 },
      { x: 2000, y: 380, w: 56, h: 20 },
    ],
    enemies: [
      { x: 800, y: GROUND_Y - 30, type: "patroller", range: 100, speed: 58, hue: 30 },
      { x: 1150, y: 200, type: "flyer", range: 62, speed: 66, hue: 48 },
      { x: 1500, y: GROUND_Y - 30, type: "patroller", range: 130, speed: 74, hue: 30 },
      { x: 1820, y: 150, type: "flyer", range: 50, speed: 80, hue: 48 },
    ],
    enemySkin: "flag",
    boss: { x: 2500, name: "Audit Findings", hits: 4, kind: "stamp", hue: 8 },
    theme: {
      sky: ["#123a34", "#2f8f6f"],
      far: "#1c5449",
      mid: "#15423a",
      ground: "#0f2f29",
      groundTop: "#2f8f6f",
      accent: "#8ff0c4",
      hazard: "#ffa94d",
      backdrop: "vault",
    },
  },

  // Wide spans and a sky full of flyers — the busiest level, as befits the
  // current job.
  bell: {
    id: "bell",
    title: "Network Core",
    pickupName: "packets routed",
    width: 3200,
    platforms: [
      ground(3200),
      { x: 300, y: 310, w: 160, h: 18 },
      { x: 620, y: 240, w: 150, h: 18 },
      { x: 950, y: 306, w: 160, h: 18 },
      { x: 1280, y: 200, w: 150, h: 18 },
      { x: 1560, y: 296, w: 170, h: 18 },
      { x: 1900, y: 224, w: 150, h: 18 },
      { x: 2220, y: 300, w: 170, h: 18 },
      { x: 2560, y: 232, w: 150, h: 18 },
    ],
    collectibles: [
      { x: 360, y: 264, label: "Network telemetry", icon: "packet", hue: 195 },
      { x: 680, y: 194, label: "Capacity forecasting", icon: "gauge", hue: 275 },
      { x: 1015, y: 260, label: "AI capacity model", icon: "spark", hue: 160 },
      { x: 1340, y: 154, label: "Network automation", icon: "gear", hue: 40 },
      { x: 1630, y: 250, label: "-30% interruptions", icon: "gauge", hue: 0 },
      { x: 1965, y: 178, label: "Capacity planning", icon: "gauge", hue: 300 },
      { x: 2290, y: 254, label: "90% reports automated", icon: "doc", hue: 95 },
      { x: 2620, y: 186, label: "99.9% availability", icon: "gauge", hue: 220 },
    ],
    hazards: [
      { x: 520, y: 380, w: 54, h: 20 },
      { x: 880, y: 380, w: 64, h: 20 },
      { x: 1480, y: 380, w: 60, h: 20 },
      { x: 2120, y: 380, w: 60, h: 20 },
      { x: 2460, y: 380, w: 54, h: 20 },
    ],
    enemies: [
      { x: 800, y: 200, type: "flyer", range: 64, speed: 78, hue: 350 },
      { x: 1150, y: GROUND_Y - 30, type: "patroller", range: 130, speed: 72, hue: 352 },
      { x: 1450, y: 170, type: "flyer", range: 56, speed: 86, hue: 350 },
      { x: 1800, y: GROUND_Y - 30, type: "patroller", range: 120, speed: 80, hue: 352 },
      { x: 2150, y: 190, type: "flyer", range: 70, speed: 70, hue: 350 },
      { x: 2450, y: GROUND_Y - 30, type: "patroller", range: 140, speed: 88, hue: 352 },
    ],
    enemySkin: "alert",
    boss: { x: 3020, name: "Peak Load", hits: 4, kind: "surge", hue: 350 },
    theme: {
      sky: ["#0a1430", "#1c3f7a"],
      far: "#16305c",
      mid: "#102344",
      ground: "#0a1730",
      groundTop: "#2f6fd0",
      accent: "#66d9ff",
      hazard: "#ff5d6c",
      backdrop: "servers",
    },
  },
};
