// All sprites are domain objects rather than generic monsters: the things the
// labels actually name. Eyes are kept on everything so they still read as
// characters and not clipart.

export type PickupIcon = "gauge" | "gear" | "shield" | "packet" | "doc" | "spark";
export type EnemySkin = "glitch" | "form" | "flag" | "alert" | "snow";
export type BossKind = "frame" | "clipboard" | "stamp" | "surge" | "exam" | "dossier" | "diploma";

function hsl(hue: number, light = 62, sat = 85) {
  return `hsl(${hue} ${sat}% ${light}%)`;
}

const INK = "#11141d";

/** Two eyes with an occasional blink — the thing that makes an object alive. */
function eyes(
  ctx: CanvasRenderingContext2D,
  t: number,
  spread: number,
  y: number,
  r: number,
  angry = false,
) {
  if (angry) {
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.moveTo(-spread - r, y - r);
    ctx.lineTo(-spread + r, y);
    ctx.lineTo(-spread - r, y + r * 0.8);
    ctx.closePath();
    ctx.moveTo(spread + r, y - r);
    ctx.lineTo(spread - r, y);
    ctx.lineTo(spread + r, y + r * 0.8);
    ctx.closePath();
    ctx.fill();
    return;
  }

  const blink = Math.sin(t * 1.7) > 0.97;
  ctx.fillStyle = INK;
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
  ctx.arc(-spread + r * 0.34, y - r * 0.34, r * 0.33, 0, Math.PI * 2);
  ctx.arc(spread + r * 0.34, y - r * 0.34, r * 0.33, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- pickups

export function drawPickup(
  ctx: CanvasRenderingContext2D,
  icon: PickupIcon,
  hue: number,
  time: number,
) {
  const fill = hsl(hue);
  const dark = hsl(hue, 40, 70);
  ctx.save();

  switch (icon) {
    case "gauge": {
      // A small dial — for rates and percentages.
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 1, 6.5, Math.PI, 0);
      ctx.stroke();
      // needle sweeps
      const a = Math.PI + (0.5 + Math.sin(time * 2) * 0.42) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(0, 1);
      ctx.lineTo(Math.cos(a) * 6, 1 + Math.sin(a) * 6);
      ctx.stroke();
      eyes(ctx, time, 3.4, -4, 1.7);
      break;
    }

    case "gear": {
      // Automation.
      ctx.rotate(time * 0.9);
      ctx.fillStyle = fill;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r1 = 11;
        const r2 = 7.5;
        ctx.lineTo(Math.cos(a - 0.18) * r2, Math.sin(a - 0.18) * r2);
        ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a + 0.18) * r2, Math.sin(a + 0.18) * r2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate(-time * 0.9);
      eyes(ctx, time, 3.6, -1, 1.6);
      break;
    }

    case "shield": {
      // Compliance, privacy, governance.
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(9, -6);
      ctx.lineTo(9, 3);
      ctx.quadraticCurveTo(9, 10, 0, 12);
      ctx.quadraticCurveTo(-9, 10, -9, 3);
      ctx.lineTo(-9, -6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 1);
      ctx.lineTo(-1, 4.5);
      ctx.lineTo(5, -3);
      ctx.stroke();
      eyes(ctx, time, 3.4, -5, 1.6);
      break;
    }

    case "packet": {
      // Network data in flight.
      const skew = Math.sin(time * 3) * 1.5;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-10, -5 + skew);
      ctx.lineTo(6, -7);
      ctx.lineTo(11, 0);
      ctx.lineTo(6, 7);
      ctx.lineTo(-10, 5 - skew);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-14, -3);
      ctx.lineTo(-19, -3);
      ctx.moveTo(-14, 3);
      ctx.lineTo(-21, 3);
      ctx.stroke();
      eyes(ctx, time, 3, -1, 1.7);
      break;
    }

    case "doc": {
      // Records, reports, requirements.
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-8, -12);
      ctx.lineTo(4, -12);
      ctx.lineTo(9, -7);
      ctx.lineTo(9, 12);
      ctx.lineTo(-8, 12);
      ctx.closePath();
      ctx.fill();
      // folded corner
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(4, -12);
      ctx.lineTo(9, -7);
      ctx.lineTo(4, -7);
      ctx.closePath();
      ctx.fill();
      // ruled lines
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.moveTo(-5, 3 + i * 4);
        ctx.lineTo(6, 3 + i * 4);
      }
      ctx.stroke();
      eyes(ctx, time, 3.2, -4, 1.6);
      break;
    }

    case "spark": {
      // Raw performance.
      const pulse = 1 + Math.sin(time * 5) * 0.09;
      ctx.scale(pulse, pulse);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(2, -13);
      ctx.lineTo(-7, 1);
      ctx.lineTo(-1, 1);
      ctx.lineTo(-3, 13);
      ctx.lineTo(7, -2);
      ctx.lineTo(1, -2);
      ctx.closePath();
      ctx.fill();
      eyes(ctx, time, 3.4, -3, 1.5);
      break;
    }
  }

  ctx.restore();
}

// ---------------------------------------------------------------- enemies

export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  skin: EnemySkin,
  flying: boolean,
  hue: number,
  time: number,
  facing: number,
) {
  ctx.save();
  ctx.scale(facing, 1);
  const fill = hsl(hue, 58);
  const dark = hsl(hue, 36, 70);

  if (skin === "glitch") {
    // A dropped frame: a torn screen tile with offset scanlines.
    const jitter = Math.sin(time * 22) * 2;
    ctx.fillStyle = fill;
    ctx.fillRect(-11, -11, 22, 22);
    ctx.fillStyle = dark;
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(-11 + (i % 2 ? jitter : -jitter), -8 + i * 5, 22, 2.4);
    }
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(-11, -2);
    ctx.lineTo(-3, 1);
    ctx.lineTo(3, -3);
    ctx.lineTo(11, 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    eyes(ctx, time, 4.5, 4, 1.9, true);
  } else if (skin === "form") {
    // Manual paperwork: a ruled sheet, airborne ones are folded like a memo.
    if (flying) {
      const flap = Math.sin(time * 10) * 4;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-13, -2 + flap);
      ctx.lineTo(11, -9);
      ctx.lineTo(5, 3);
      ctx.lineTo(11, 9);
      ctx.lineTo(-13, 4 - flap);
      ctx.closePath();
      ctx.fill();
      eyes(ctx, time, 3.4, -1, 1.8, true);
    } else {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-9, -12);
      ctx.lineTo(5, -12);
      ctx.lineTo(10, -7);
      ctx.lineTo(10, 9);
      ctx.lineTo(-9, 9);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.moveTo(-6, 0 + i * 4);
        ctx.lineTo(7, 0 + i * 4);
      }
      ctx.stroke();
      // little legs
      const step = Math.sin(time * 9) * 2.5;
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-4, 9);
      ctx.lineTo(-4 + step, 14);
      ctx.moveTo(4, 9);
      ctx.lineTo(4 - step, 14);
      ctx.stroke();
      eyes(ctx, time, 3.6, -6, 1.8, true);
    }
  } else if (skin === "flag") {
    // A raised finding.
    const wave = Math.sin(time * 6) * 2.5;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-6, 13);
    ctx.lineTo(-6, -12);
    ctx.stroke();
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-6, -12);
    ctx.lineTo(11 + wave, -7);
    ctx.lineTo(-6, -1);
    ctx.closePath();
    ctx.fill();
    if (!flying) {
      ctx.fillStyle = dark;
      ctx.fillRect(-12, 12, 12, 3.5);
    }
    eyes(ctx, time, 3, -8, 1.5, true);
  } else if (skin === "snow") {
    // First Quebec winter.
    const drift = Math.sin(time * 3) * 2;
    ctx.strokeStyle = fill;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI + drift * 0.05;
      ctx.moveTo(-Math.cos(a) * 11, -Math.sin(a) * 11);
      ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11);
    }
    ctx.stroke();
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    eyes(ctx, time, 2.4, 0, 1.5, true);
  } else {
    // An alert packet.
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(12, 9);
    ctx.lineTo(-12, 9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.fillRect(-1.6, -5, 3.2, 8);
    ctx.beginPath();
    ctx.arc(0, 6, 1.7, 0, Math.PI * 2);
    ctx.fill();
    if (flying) {
      const flap = Math.sin(time * 12) * 5;
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.lineTo(-20, -5 + flap);
      ctx.lineTo(-15, 5);
      ctx.closePath();
      ctx.moveTo(11, 0);
      ctx.lineTo(20, -5 + flap);
      ctx.lineTo(15, 5);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

// ---------------------------------------------------------------- bosses

export function drawBoss(
  ctx: CanvasRenderingContext2D,
  kind: BossKind,
  hue: number,
  time: number,
  scale: number,
  hurt: boolean,
) {
  ctx.save();
  ctx.scale(scale, scale);

  const fill = hurt ? "#ffffff" : hsl(hue, 58);
  const dark = hurt ? "#dddddd" : hsl(hue, 34, 70);
  const paper = hurt ? "#ffffff" : "#f3f0e8";

  switch (kind) {
    case "frame": {
      // Frame Dropper — a monitor mid-glitch, tearing its own picture.
      const tear = Math.sin(time * 14) * 3.5;
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-17, -14, 34, 26, 3);
      ctx.fill();
      ctx.fillStyle = hurt ? "#eeeeee" : "#0d1020";
      ctx.fillRect(-14.5, -11.5, 29, 21);

      // glitched scanlines, offset per band
      ctx.fillStyle = fill;
      for (let i = 0; i < 5; i++) {
        const off = i % 2 ? tear : -tear;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-14.5 + off, -10 + i * 4.2, 29, 2.6);
      }
      ctx.globalAlpha = 1;

      // stand
      ctx.fillStyle = dark;
      ctx.fillRect(-4, 12, 8, 4);
      ctx.fillRect(-10, 16, 20, 3);

      eyes(ctx, time, 6, -2, 2.6, true);
      break;
    }

    case "clipboard": {
      // Manual Process — a clipboard of forms that refuses to be automated.
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-15, -16, 30, 34, 3);
      ctx.fill();
      ctx.fillStyle = paper;
      ctx.fillRect(-12, -11, 24, 26);

      // clip
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(-5, -19, 10, 6, 2);
      ctx.fill();

      // checkbox rows, a couple still unticked
      ctx.strokeStyle = "#3a3a44";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const y = -6 + i * 5.5;
        ctx.strokeRect(-9.5, y - 2, 3.4, 3.4);
        ctx.beginPath();
        ctx.moveTo(-4, y);
        ctx.lineTo(9, y);
        ctx.stroke();
        if (i < 2) {
          ctx.beginPath();
          ctx.moveTo(-9, y - 0.4);
          ctx.lineTo(-8, y + 1.2);
          ctx.lineTo(-6.2, y - 2);
          ctx.stroke();
        }
      }

      // pen, jittering as if mid-entry
      ctx.save();
      ctx.translate(13, 6 + Math.sin(time * 9) * 2);
      ctx.rotate(-0.5);
      ctx.fillStyle = fill;
      ctx.fillRect(-1.4, -8, 2.8, 13);
      ctx.beginPath();
      ctx.moveTo(-1.4, 5);
      ctx.lineTo(1.4, 5);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      eyes(ctx, time, 5, -16, 2.2, true);
      break;
    }

    case "stamp": {
      // Audit Findings — a report under a magnifier, stamped red.
      ctx.fillStyle = paper;
      ctx.beginPath();
      ctx.moveTo(-15, -17);
      ctx.lineTo(8, -17);
      ctx.lineTo(15, -10);
      ctx.lineTo(15, 17);
      ctx.lineTo(-15, 17);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#d9d4c6";
      ctx.beginPath();
      ctx.moveTo(8, -17);
      ctx.lineTo(15, -10);
      ctx.lineTo(8, -10);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#4a4a52";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.moveTo(-11, -4 + i * 5);
        ctx.lineTo(10, -4 + i * 5);
      }
      ctx.stroke();

      // the stamp itself, rocking slightly
      ctx.save();
      ctx.rotate(-0.22 + Math.sin(time * 2) * 0.05);
      ctx.strokeStyle = fill;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(1, 2, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = fill;
      ctx.fillRect(-7, 0, 16, 3.4);
      ctx.restore();

      // magnifier
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(-8, -8, 6.5, 0, Math.PI * 2);
      ctx.moveTo(-4, -4);
      ctx.lineTo(2, 2);
      ctx.stroke();

      eyes(ctx, time, 5.5, 12, 2.2, true);
      break;
    }

    case "exam": {
      // Les Examens — a graded paper, red pen and all.
      ctx.fillStyle = paper;
      ctx.beginPath();
      ctx.roundRect(-15, -18, 30, 36, 2);
      ctx.fill();
      ctx.strokeStyle = "#4a4a52";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.moveTo(-11, -8 + i * 4.5);
        ctx.lineTo(11, -8 + i * 4.5);
      }
      ctx.stroke();
      // a big red mark, scrawled
      ctx.save();
      ctx.rotate(-0.18 + Math.sin(time * 2.4) * 0.05);
      ctx.strokeStyle = fill;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.lineTo(8, 2);
      ctx.moveTo(8, -14);
      ctx.lineTo(-8, 2);
      ctx.stroke();
      ctx.restore();
      eyes(ctx, time, 5.5, 11, 2.2, true);
      break;
    }

    case "dossier": {
      // The Paperwork — an immigration file, stamped and bulging.
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(-17, -10);
      ctx.lineTo(-4, -10);
      ctx.lineTo(0, -14);
      ctx.lineTo(17, -14);
      ctx.lineTo(17, 16);
      ctx.lineTo(-17, 16);
      ctx.closePath();
      ctx.fill();
      // papers poking out, shuffling
      ctx.fillStyle = paper;
      for (let i = 0; i < 3; i++) {
        const off = Math.sin(time * 2 + i) * 1.6;
        ctx.fillRect(-12 + i * 3, -9 + off, 20, 18 - i * 3);
      }
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(-16, -6, 32, 20, 2);
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
      // stamp
      ctx.strokeStyle = hurt ? "#bbb" : "#c92a2a";
      ctx.lineWidth = 2.2;
      ctx.save();
      ctx.rotate(0.3);
      ctx.beginPath();
      ctx.arc(6, 4, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      eyes(ctx, time, 5.5, 2, 2.3, true);
      break;
    }

    case "diploma": {
      // The Capstone — a rolled diploma with a ribbon.
      ctx.fillStyle = paper;
      ctx.beginPath();
      ctx.roundRect(-16, -9, 32, 18, 3);
      ctx.fill();
      ctx.fillStyle = "#d9d4c6";
      ctx.beginPath();
      ctx.roundRect(-18, -11, 5, 22, 2.5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(13, -11, 5, 22, 2.5);
      ctx.fill();
      ctx.strokeStyle = "#4a4a52";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.moveTo(-10, -3 + i * 4);
        ctx.lineTo(10, -3 + i * 4);
      }
      ctx.stroke();
      // ribbon
      const sway = Math.sin(time * 3) * 2;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(0, 10, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-3, 13);
      ctx.lineTo(-6 + sway, 22);
      ctx.lineTo(0, 17);
      ctx.closePath();
      ctx.moveTo(3, 13);
      ctx.lineTo(6 + sway, 22);
      ctx.lineTo(0, 17);
      ctx.closePath();
      ctx.fill();
      eyes(ctx, time, 5, -2, 2.2, true);
      break;
    }

    case "surge": {
      // Peak Load — a traffic chart spiking into the red.
      ctx.fillStyle = hurt ? "#eeeeee" : "#0c1630";
      ctx.beginPath();
      ctx.roundRect(-18, -15, 36, 30, 3);
      ctx.fill();
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-18, -15, 36, 30);

      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 1; i < 4; i++) {
        ctx.moveTo(-18, -15 + i * 7.5);
        ctx.lineTo(18, -15 + i * 7.5);
      }
      ctx.stroke();

      // red danger band
      ctx.fillStyle = "rgba(255,80,90,0.22)";
      ctx.fillRect(-18, -15, 36, 7.5);

      // the spiking trace
      ctx.strokeStyle = fill;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const x = -18 + i * 3;
        const base = Math.sin(i * 0.9 + time * 4) * 3;
        const spike = i === 7 ? -11 + Math.sin(time * 9) * 2.5 : 0;
        const y = 6 + base + spike;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      eyes(ctx, time, 6, -6, 2.4, true);
      break;
    }
  }

  ctx.restore();
}

// ---------------------------------------------------------------- player

/** The player is an engineer: hard hat for the P.Eng, laptop on the back. */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  accent: string,
  time: number,
  running: boolean,
  onGround: boolean,
  stretch: number,
  runPhase: number,
) {
  ctx.save();

  // legs
  ctx.strokeStyle = "#2b3242";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (running && onGround) {
    const swing = Math.sin(runPhase) * 7;
    ctx.moveTo(-4, 8);
    ctx.lineTo(-4 + swing, 17);
    ctx.moveTo(4, 8);
    ctx.lineTo(4 - swing, 17);
  } else {
    ctx.moveTo(-4, 8);
    ctx.lineTo(-6, 16);
    ctx.moveTo(4, 8);
    ctx.lineTo(6, 16);
  }
  ctx.stroke();

  // laptop slung on the back
  ctx.fillStyle = "#39414f";
  ctx.beginPath();
  ctx.roundRect(-13, -4, 6, 11, 1.5);
  ctx.fill();

  // torso
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(-8, -6 * stretch, 16, 15 * stretch, 5);
  ctx.fill();

  // hi-vis band
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillRect(-8, -1, 16, 2.4);

  // head
  ctx.fillStyle = "#f0c9a4";
  ctx.beginPath();
  ctx.arc(0, -12, 6, 0, Math.PI * 2);
  ctx.fill();

  // hard hat
  ctx.fillStyle = "#ffc53d";
  ctx.beginPath();
  ctx.arc(0, -13, 6.6, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-9, -13.6, 18, 2.6);
  ctx.fillStyle = "#e0a91f";
  ctx.fillRect(-1.4, -19, 2.8, 5);

  // eyes
  ctx.fillStyle = INK;
  const blink = Math.sin(time * 2.2) > 0.96;
  if (blink) {
    ctx.fillRect(-4, -11, 2.6, 1.4);
    ctx.fillRect(1.4, -11, 2.6, 1.4);
  } else {
    ctx.beginPath();
    ctx.arc(-2.6, -10.6, 1.3, 0, Math.PI * 2);
    ctx.arc(2.6, -10.6, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/** The deployed automation: a small drone with a spinning rotor. */
export function drawDrone(ctx: CanvasRenderingContext2D, accent: string, time: number) {
  ctx.save();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(-9, -6, 18, 12, 4);
  ctx.fill();

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(4, -1, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // rotor blur
  const spin = Math.abs(Math.sin(time * 30));
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10 * spin - 2, -9);
  ctx.lineTo(10 * spin + 2, -9);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(0, -9);
  ctx.stroke();
  ctx.restore();
}
