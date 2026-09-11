export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Each pickup is a small creature; the species sets its silhouette. */
export type Species = "slime" | "bat" | "bug" | "orb" | "crystal" | "ghost";

export interface Collectible {
  x: number;
  y: number;
  label: string;
  species: Species;
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
  species: Species;
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

export const arcadeLevels: Record<string, ArcadeLevel> = {
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
      { x: 260, y: 352, label: "60fps", species: "orb", hue: 200 },
      { x: 440, y: 272, label: "LOD", species: "crystal", hue: 280 },
      { x: 748, y: 206, label: "cull", species: "bat", hue: 330 },
      { x: 1070, y: 272, label: "batch", species: "slime", hue: 150 },
      { x: 1382, y: 190, label: "profile", species: "ghost", hue: 45 },
      { x: 1620, y: 274, label: "shader", species: "bug", hue: 20 },
      { x: 1938, y: 198, label: "fidelity", species: "crystal", hue: 190 },
      { x: 2200, y: 270, label: "ship", species: "orb", hue: 100 },
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
    boss: { x: 2720, name: "Frame Dropper", hits: 3, species: "slime", hue: 0 },
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
      { x: 385, y: 296, label: "intake", species: "slime", hue: 265 },
      { x: 575, y: 252, label: "validate", species: "bug", hue: 200 },
      { x: 765, y: 208, label: "enrich", species: "orb", hue: 310 },
      { x: 955, y: 164, label: "route", species: "bat", hue: 160 },
      { x: 1210, y: 256, label: "approve", species: "crystal", hue: 50 },
      { x: 1435, y: 212, label: "report", species: "ghost", hue: 225 },
      { x: 1655, y: 168, label: "-40% manual", species: "slime", hue: 15 },
      { x: 1888, y: 124, label: "on time", species: "orb", hue: 120 },
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
    boss: { x: 2620, name: "Manual Process", hits: 3, species: "ghost", hue: 285 },
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
      { x: 355, y: 282, label: "retention", species: "crystal", hue: 160 },
      { x: 355, y: 180, label: "audit", species: "ghost", hue: 45 },
      { x: 575, y: 124, label: "consent", species: "orb", hue: 200 },
      { x: 815, y: 278, label: "PII", species: "bug", hue: 0 },
      { x: 995, y: 104, label: "governance", species: "crystal", hue: 265 },
      { x: 1240, y: 256, label: "migration", species: "slime", hue: 120 },
      { x: 1455, y: 86, label: "-20% backlog", species: "bat", hue: 315 },
      { x: 1710, y: 248, label: "signed off", species: "orb", hue: 85 },
      { x: 1935, y: 168, label: "approved", species: "slime", hue: 25 },
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
    boss: { x: 2500, name: "Audit Findings", hits: 4, species: "crystal", hue: 42 },
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
      { x: 360, y: 264, label: "telemetry", species: "orb", hue: 195 },
      { x: 680, y: 194, label: "forecast", species: "bug", hue: 275 },
      { x: 1015, y: 260, label: "AI model", species: "crystal", hue: 160 },
      { x: 1340, y: 154, label: "automate", species: "ghost", hue: 40 },
      { x: 1630, y: 250, label: "-30% incidents", species: "slime", hue: 0 },
      { x: 1965, y: 178, label: "capacity", species: "bat", hue: 300 },
      { x: 2290, y: 254, label: "90% reports", species: "orb", hue: 95 },
      { x: 2620, y: 186, label: "99.9%", species: "crystal", hue: 220 },
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
    boss: { x: 3020, name: "Peak Load", hits: 4, species: "bat", hue: 350 },
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
