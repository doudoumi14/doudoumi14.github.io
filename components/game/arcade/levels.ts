export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Collectible {
  x: number;
  y: number;
  label: string;
}

export interface LevelTheme {
  sky: [string, string];
  far: string;
  mid: string;
  ground: string;
  groundTop: string;
  accent: string;
  hazard: string;
  /** Decorative silhouettes drawn into the parallax layers. */
  backdrop: "clouds" | "office" | "vault" | "servers";
}

export interface ArcadeLevel {
  id: string;
  title: string;
  /** What the collectibles represent, shown in the HUD. */
  pickupName: string;
  width: number;
  platforms: Rect[];
  collectibles: Collectible[];
  hazards: Rect[];
  goal: { x: number; y: number };
  theme: LevelTheme;
}

// The world is authored against a fixed 900x480 virtual viewport and scaled to
// fit, so physics and layout behave identically on every screen.
export const VIEW_W = 900;
export const VIEW_H = 480;
export const GROUND_Y = 400;

function ground(width: number): Rect {
  return { x: 0, y: GROUND_Y, w: width, h: VIEW_H - GROUND_Y };
}

export const arcadeLevels: Record<string, ArcadeLevel> = {
  cae: {
    id: "cae",
    title: "Flight Deck",
    pickupName: "frames",
    width: 2600,
    platforms: [
      ground(2600),
      { x: 420, y: 320, w: 150, h: 18 },
      { x: 700, y: 250, w: 140, h: 18 },
      { x: 980, y: 320, w: 160, h: 18 },
      { x: 1320, y: 260, w: 130, h: 18 },
      { x: 1560, y: 330, w: 150, h: 18 },
      { x: 1880, y: 250, w: 160, h: 18 },
      { x: 2180, y: 310, w: 170, h: 18 },
    ],
    collectibles: [
      { x: 300, y: 350, label: "60fps" },
      { x: 470, y: 275, label: "LOD" },
      { x: 760, y: 205, label: "cull" },
      { x: 1040, y: 275, label: "batch" },
      { x: 1370, y: 215, label: "profile" },
      { x: 1620, y: 285, label: "shader" },
      { x: 1940, y: 205, label: "fidelity" },
      { x: 2240, y: 265, label: "ship" },
    ],
    hazards: [
      { x: 620, y: 380, w: 50, h: 20 },
      { x: 1200, y: 380, w: 60, h: 20 },
      { x: 1780, y: 380, w: 55, h: 20 },
      { x: 2100, y: 380, w: 50, h: 20 },
    ],
    goal: { x: 2480, y: 330 },
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

  archer: {
    id: "archer",
    title: "Automation Floor",
    pickupName: "steps automated",
    width: 2700,
    platforms: [
      ground(2700),
      { x: 360, y: 330, w: 140, h: 18 },
      { x: 600, y: 270, w: 140, h: 18 },
      { x: 860, y: 210, w: 140, h: 18 },
      { x: 1160, y: 300, w: 150, h: 18 },
      { x: 1460, y: 240, w: 140, h: 18 },
      { x: 1740, y: 320, w: 150, h: 18 },
      { x: 2040, y: 260, w: 150, h: 18 },
      { x: 2320, y: 200, w: 150, h: 18 },
    ],
    collectibles: [
      { x: 400, y: 285, label: "intake" },
      { x: 650, y: 225, label: "validate" },
      { x: 910, y: 165, label: "enrich" },
      { x: 1210, y: 255, label: "route" },
      { x: 1510, y: 195, label: "approve" },
      { x: 1800, y: 275, label: "report" },
      { x: 2100, y: 215, label: "-40% manual" },
      { x: 2380, y: 155, label: "on time" },
    ],
    hazards: [
      { x: 520, y: 380, w: 55, h: 20 },
      { x: 1080, y: 380, w: 60, h: 20 },
      { x: 1640, y: 380, w: 60, h: 20 },
      { x: 2240, y: 380, w: 55, h: 20 },
    ],
    goal: { x: 2580, y: 330 },
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

  desjardins: {
    id: "desjardins",
    title: "Compliance Vault",
    pickupName: "items triaged",
    width: 2800,
    platforms: [
      ground(2800),
      { x: 340, y: 310, w: 150, h: 18 },
      { x: 640, y: 250, w: 140, h: 18 },
      { x: 900, y: 320, w: 150, h: 18 },
      { x: 1220, y: 250, w: 140, h: 18 },
      { x: 1480, y: 190, w: 140, h: 18 },
      { x: 1800, y: 290, w: 160, h: 18 },
      { x: 2120, y: 230, w: 150, h: 18 },
      { x: 2420, y: 300, w: 160, h: 18 },
    ],
    collectibles: [
      { x: 390, y: 265, label: "retention" },
      { x: 690, y: 205, label: "audit" },
      { x: 950, y: 275, label: "consent" },
      { x: 1270, y: 205, label: "PII" },
      { x: 1530, y: 145, label: "governance" },
      { x: 1860, y: 245, label: "migration" },
      { x: 2180, y: 185, label: "-20% backlog" },
      { x: 2480, y: 255, label: "signed off" },
    ],
    hazards: [
      { x: 560, y: 380, w: 55, h: 20 },
      { x: 1120, y: 380, w: 60, h: 20 },
      { x: 1700, y: 380, w: 60, h: 20 },
      { x: 2320, y: 380, w: 55, h: 20 },
    ],
    goal: { x: 2680, y: 330 },
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

  bell: {
    id: "bell",
    title: "Network Core",
    pickupName: "packets routed",
    width: 3000,
    platforms: [
      ground(3000),
      { x: 320, y: 320, w: 140, h: 18 },
      { x: 580, y: 250, w: 140, h: 18 },
      { x: 840, y: 190, w: 140, h: 18 },
      { x: 1140, y: 280, w: 150, h: 18 },
      { x: 1420, y: 210, w: 140, h: 18 },
      { x: 1700, y: 300, w: 150, h: 18 },
      { x: 2000, y: 230, w: 150, h: 18 },
      { x: 2300, y: 170, w: 150, h: 18 },
      { x: 2600, y: 280, w: 160, h: 18 },
    ],
    collectibles: [
      { x: 370, y: 275, label: "telemetry" },
      { x: 630, y: 205, label: "forecast" },
      { x: 890, y: 145, label: "AI model" },
      { x: 1190, y: 235, label: "automate" },
      { x: 1470, y: 165, label: "-30% incidents" },
      { x: 1760, y: 255, label: "capacity" },
      { x: 2060, y: 185, label: "90% reports" },
      { x: 2360, y: 125, label: "99.9%" },
      { x: 2660, y: 235, label: "uptime" },
    ],
    hazards: [
      { x: 500, y: 380, w: 55, h: 20 },
      { x: 1040, y: 380, w: 65, h: 20 },
      { x: 1600, y: 380, w: 60, h: 20 },
      { x: 2200, y: 380, w: 60, h: 20 },
      { x: 2520, y: 380, w: 55, h: 20 },
    ],
    goal: { x: 2880, y: 330 },
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
