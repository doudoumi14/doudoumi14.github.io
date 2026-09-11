import type { Species } from "./levels";

export interface CreatureStyle {
  hue: number;
  /** 1 = pickup scale, larger for a boss. */
  scale?: number;
  /** Drives idle animation (bob, flap, spin). */
  time: number;
  /** Flash white when hurt. */
  hurt?: boolean;
}

function body(hue: number, light = 62) {
  return `hsl(${hue} 85% ${light}%)`;
}

function shade(hue: number) {
  return `hsl(${hue} 70% 40%)`;
}

/** Two eyes with a blink every few seconds — what makes them read as alive. */
function eyes(ctx: CanvasRenderingContext2D, t: number, spread: number, y: number, r: number) {
  const blink = Math.sin(t * 1.7) > 0.97;
  ctx.fillStyle = "#10131c";
  if (blink) {
    ctx.fillRect(-spread - r, y - 1, r * 2, 2);
    ctx.fillRect(spread - r, y - 1, r * 2, 2);
    return;
  }
  ctx.beginPath();
  ctx.arc(-spread, y, r, 0, Math.PI * 2);
  ctx.arc(spread, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(-spread + r * 0.35, y - r * 0.35, r * 0.34, 0, Math.PI * 2);
  ctx.arc(spread + r * 0.35, y - r * 0.35, r * 0.34, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws a creature centred on the current transform origin. Each species has a
 * deliberately different silhouette so they stay distinguishable at pickup size.
 */
export function drawCreature(
  ctx: CanvasRenderingContext2D,
  species: Species,
  { hue, scale = 1, time, hurt = false }: CreatureStyle,
) {
  const s = 11 * scale;
  ctx.save();
  ctx.scale(scale, scale);

  const fill = hurt ? "#ffffff" : body(hue);
  const dark = hurt ? "#e6e6e6" : shade(hue);

  switch (species) {
    case "slime": {
      // Squashes and stretches on a slow cycle.
      const squash = 1 + Math.sin(time * 3) * 0.12;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.ellipse(0, 2 / scale, 11 / squash, 9 * squash, 0, Math.PI, 0);
      ctx.lineTo(11 / squash, 11);
      ctx.lineTo(-11 / squash, 11);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = dark;
      ctx.fillRect(-11 / squash, 9, (22 / squash), 2);
      eyes(ctx, time, 4, 0, 2.4);
      break;
    }

    case "bat": {
      const flap = Math.sin(time * 9) * 6;
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-17, -6 + flap);
      ctx.lineTo(-15, 5 + flap * 0.5);
      ctx.closePath();
      ctx.moveTo(4, 0);
      ctx.lineTo(17, -6 + flap);
      ctx.lineTo(15, 5 + flap * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // ears
      ctx.beginPath();
      ctx.moveTo(-4, -6);
      ctx.lineTo(-6, -12);
      ctx.lineTo(-1, -7);
      ctx.closePath();
      ctx.moveTo(4, -6);
      ctx.lineTo(6, -12);
      ctx.lineTo(1, -7);
      ctx.closePath();
      ctx.fill();
      eyes(ctx, time, 2.6, -1, 1.9);
      break;
    }

    case "bug": {
      const legSwing = Math.sin(time * 8) * 2.5;
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const side of [-1, 1]) {
        ctx.moveTo(side * 7, 2);
        ctx.lineTo(side * 13, 8 + legSwing * side);
        ctx.moveTo(side * 7, -2);
        ctx.lineTo(side * 13, -1 - legSwing * side);
      }
      // antennae
      ctx.moveTo(-3, -8);
      ctx.lineTo(-7, -15);
      ctx.moveTo(3, -8);
      ctx.lineTo(7, -15);
      ctx.stroke();

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = dark;
      ctx.fillRect(-8, -1, 16, 1.8);
      eyes(ctx, time, 3.2, -4, 2);
      break;
    }

    case "orb": {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      // orbiting satellite dot
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 5, Math.sin(time * 0.8) * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      const a = time * 2.4;
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 14, Math.sin(a) * 5, 2.2, 0, Math.PI * 2);
      ctx.fill();
      eyes(ctx, time, 3, -1, 2.2);
      break;
    }

    case "crystal": {
      ctx.rotate(Math.sin(time * 1.4) * 0.18);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(9, -2);
      ctx.lineTo(5, 11);
      ctx.lineTo(-5, 11);
      ctx.lineTo(-9, -2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(9, -2);
      ctx.lineTo(0, 2);
      ctx.closePath();
      ctx.fill();
      eyes(ctx, time, 3, 1, 1.9);
      break;
    }

    case "ghost": {
      const wob = Math.sin(time * 2.6) * 1.6;
      ctx.fillStyle = fill;
      ctx.globalAlpha = hurt ? 1 : 0.9;
      ctx.beginPath();
      ctx.arc(0, -1, 9, Math.PI, 0);
      ctx.lineTo(9, 7);
      // scalloped hem
      for (let i = 0; i < 3; i++) {
        const x = 9 - (i * 18) / 3;
        ctx.quadraticCurveTo(x - 3, 11 + (i % 2 ? -wob : wob), x - 6, 7);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      eyes(ctx, time, 3.2, -2, 2.1);
      break;
    }
  }

  ctx.restore();
  void s;
}

/** Hostile silhouettes, visually separated from the friendly pickups. */
export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  type: "patroller" | "flyer",
  hue: number,
  time: number,
  facing: number,
) {
  ctx.save();
  ctx.scale(facing, 1);

  if (type === "patroller") {
    const step = Math.sin(time * 9) * 3;
    ctx.strokeStyle = shade(hue);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(-5 + step, 14);
    ctx.moveTo(5, 8);
    ctx.lineTo(5 - step, 14);
    ctx.stroke();

    ctx.fillStyle = body(hue, 55);
    ctx.beginPath();
    ctx.roundRect(-10, -8, 20, 17, 5);
    ctx.fill();

    // spiked crest
    ctx.fillStyle = shade(hue);
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) {
      ctx.moveTo(i * 7 - 3, -8);
      ctx.lineTo(i * 7, -15);
      ctx.lineTo(i * 7 + 3, -8);
    }
    ctx.fill();

    // angry eyes
    ctx.fillStyle = "#12141d";
    ctx.beginPath();
    ctx.moveTo(-7, -3);
    ctx.lineTo(-1, -1);
    ctx.lineTo(-7, 2);
    ctx.closePath();
    ctx.moveTo(7, -3);
    ctx.lineTo(1, -1);
    ctx.lineTo(7, 2);
    ctx.closePath();
    ctx.fill();
  } else {
    const flap = Math.sin(time * 12) * 8;
    ctx.fillStyle = shade(hue);
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(-18, -4 + flap);
    ctx.lineTo(-14, 6);
    ctx.closePath();
    ctx.moveTo(3, 0);
    ctx.lineTo(18, -4 + flap);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = body(hue, 58);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#12141d";
    ctx.beginPath();
    ctx.moveTo(-6, -3);
    ctx.lineTo(-1, -1);
    ctx.lineTo(-6, 1);
    ctx.closePath();
    ctx.moveTo(6, -3);
    ctx.lineTo(1, -1);
    ctx.lineTo(6, 1);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
