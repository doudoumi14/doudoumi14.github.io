import {
  GROUND_Y,
  VIEW_H,
  VIEW_W,
  type ArcadeLevel,
  type Rect,
} from "./levels";

const GRAVITY = 1800;
const MOVE_SPEED = 300;
const JUMP_VELOCITY = -640;
const COYOTE_MS = 90;
const PLAYER_W = 26;
const PLAYER_H = 36;

export interface GameStatus {
  collected: number;
  total: number;
  hits: number;
  elapsed: number;
  finished: boolean;
  won: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  colour: string;
}

interface Pickup {
  x: number;
  y: number;
  label: string;
  taken: boolean;
  /** Rises and fades after being collected. */
  pop: number;
}

export interface Controls {
  left: boolean;
  right: boolean;
  jump: boolean;
}

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export class ArcadeGame {
  private ctx: CanvasRenderingContext2D;
  private level: ArcadeLevel;
  private onStatus: (status: GameStatus) => void;

  private x = 60;
  private y = GROUND_Y - PLAYER_H;
  private vx = 0;
  private vy = 0;
  private onGround = true;
  private lastGroundAt = 0;
  private facing = 1;
  private runPhase = 0;

  private camera = 0;
  private shake = 0;
  private invulnUntil = 0;

  private pickups: Pickup[];
  private particles: Particle[] = [];

  private status: GameStatus;
  private raf = 0;
  private last = 0;
  private time = 0;
  private running = false;

  controls: Controls = { left: false, right: false, jump: false };

  constructor(
    ctx: CanvasRenderingContext2D,
    level: ArcadeLevel,
    onStatus: (status: GameStatus) => void,
  ) {
    this.ctx = ctx;
    this.level = level;
    this.onStatus = onStatus;
    this.pickups = level.collectibles.map((c) => ({ ...c, taken: false, pop: 0 }));
    this.status = {
      collected: 0,
      total: this.pickups.length,
      hits: 0,
      elapsed: 0,
      finished: false,
      won: false,
    };
  }

  start() {
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private loop = (now: number) => {
    if (!this.running) return;
    // Clamp the step so a backgrounded tab doesn't teleport the player.
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.time += dt;

    this.update(dt);
    this.draw();

    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.status.finished) return;

    this.status.elapsed += dt;

    const { left, right, jump } = this.controls;
    this.vx = (right ? MOVE_SPEED : 0) - (left ? MOVE_SPEED : 0);
    if (this.vx !== 0) this.facing = this.vx > 0 ? 1 : -1;

    if (jump && (this.onGround || this.time * 1000 - this.lastGroundAt < COYOTE_MS)) {
      this.vy = JUMP_VELOCITY;
      this.onGround = false;
      this.lastGroundAt = -Infinity;
    }

    this.vy += GRAVITY * dt;

    // Horizontal move, then resolve; keeps the player out of walls.
    this.x += this.vx * dt;
    this.x = Math.max(0, Math.min(this.level.width - PLAYER_W, this.x));
    for (const p of this.level.platforms) {
      const box = { x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H };
      if (!overlaps(box, p)) continue;
      // Only push out sideways if we're substantially inside vertically.
      if (this.y + PLAYER_H - p.y > 6 && p.y + p.h - this.y > 6) {
        this.x = this.vx > 0 ? p.x - PLAYER_W : p.x + p.w;
      }
    }

    this.y += this.vy * dt;
    this.onGround = false;
    for (const p of this.level.platforms) {
      const box = { x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H };
      if (!overlaps(box, p)) continue;

      if (this.vy > 0 && this.y + PLAYER_H - p.y < 24) {
        this.y = p.y - PLAYER_H;
        this.vy = 0;
        this.onGround = true;
        this.lastGroundAt = this.time * 1000;
      } else if (this.vy < 0 && p.y + p.h - this.y < 24) {
        this.y = p.y + p.h;
        this.vy = 0;
      }
    }

    if (this.onGround && Math.abs(this.vx) > 0) this.runPhase += dt * 12;

    // Pickups
    for (const pickup of this.pickups) {
      if (pickup.taken) {
        pickup.pop = Math.min(1, pickup.pop + dt * 2);
        continue;
      }
      const box = { x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H };
      if (overlaps(box, { x: pickup.x - 14, y: pickup.y - 14, w: 28, h: 28 })) {
        pickup.taken = true;
        this.status.collected += 1;
        this.burst(pickup.x, pickup.y, this.level.theme.accent);
        this.emit();
      }
    }

    // Hazards
    if (this.time * 1000 > this.invulnUntil) {
      for (const hazard of this.level.hazards) {
        const box = { x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H };
        if (!overlaps(box, hazard)) continue;
        this.status.hits += 1;
        this.invulnUntil = this.time * 1000 + 900;
        this.shake = 12;
        this.vy = -380;
        this.x -= this.facing * 40;
        this.burst(this.x + PLAYER_W / 2, this.y + PLAYER_H / 2, this.level.theme.hazard);
        this.emit();
        break;
      }
    }

    // Goal
    const goalBox = { x: this.level.goal.x, y: this.level.goal.y - 60, w: 40, h: 100 };
    if (overlaps({ x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H }, goalBox)) {
      this.status.finished = true;
      this.status.won = true;
      this.emit();
    }

    // Particles
    for (const particle of this.particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 900 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    this.shake = Math.max(0, this.shake - dt * 40);

    // Camera eases toward the player, clamped to the level bounds.
    const target = Math.max(0, Math.min(this.level.width - VIEW_W, this.x - VIEW_W * 0.4));
    this.camera += (target - this.camera) * Math.min(1, dt * 6);
  }

  private burst(x: number, y: number, colour: string) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const speed = 90 + Math.random() * 130;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        life: 0.5 + Math.random() * 0.4,
        colour,
      });
    }
  }

  private emit() {
    this.onStatus({ ...this.status });
  }

  // ---------- rendering ----------

  private draw() {
    const ctx = this.ctx;
    const t = this.level.theme;
    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake ? (Math.random() - 0.5) * this.shake : 0;

    const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    sky.addColorStop(0, t.sky[0]);
    sky.addColorStop(1, t.sky[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Backdrop stays deliberately faint: it sets the scene but must never
    // compete with the platforms the player has to read.
    this.drawBackdrop(this.camera * 0.2, t.far, 0.22);
    this.drawBackdrop(this.camera * 0.45, t.mid, 0.34);

    ctx.save();
    ctx.translate(-this.camera, 0);

    this.drawPlatforms();
    this.drawHazards();
    this.drawGoal();
    this.drawPickups();
    this.drawParticles();
    this.drawPlayer();

    ctx.restore();
    ctx.restore();
  }

  private drawBackdrop(offset: number, colour: string, alpha: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colour;
    const kind = this.level.theme.backdrop;
    const step = 260;
    const start = -((offset % step) + step) % step;

    for (let x = start; x < VIEW_W + step; x += step) {
      if (kind === "clouds") {
        ctx.beginPath();
        ctx.arc(x + 60, 120, 38, 0, Math.PI * 2);
        ctx.arc(x + 100, 128, 30, 0, Math.PI * 2);
        ctx.arc(x + 24, 132, 26, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === "office") {
        ctx.fillRect(x + 30, 180, 90, 220);
        ctx.fillRect(x + 150, 230, 70, 170);
      } else if (kind === "vault") {
        ctx.fillRect(x + 40, 210, 120, 190);
        ctx.beginPath();
        ctx.arc(x + 100, 210, 60, Math.PI, 0);
        ctx.fill();
      } else {
        // server racks
        ctx.fillRect(x + 40, 170, 70, 230);
        ctx.fillRect(x + 130, 200, 70, 200);
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = this.level.theme.accent;
        for (let i = 0; i < 6; i++) {
          ctx.fillRect(x + 50, 186 + i * 32, 50, 5);
          ctx.fillRect(x + 140, 216 + i * 28, 50, 5);
        }
        ctx.fillStyle = colour;
        ctx.globalAlpha = alpha;
      }
    }
    ctx.restore();
  }

  private drawPlatforms() {
    const ctx = this.ctx;
    const t = this.level.theme;
    for (const p of this.level.platforms) {
      if (p.x + p.w < this.camera - 50 || p.x > this.camera + VIEW_W + 50) continue;

      // Solid, opaque body plus a lit top edge — platforms must read instantly
      // against the parallax behind them.
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(p.x + 3, p.y + 5, p.w, p.h);

      ctx.fillStyle = t.ground;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = t.groundTop;
      ctx.fillRect(p.x, p.y, p.w, 6);

      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = t.accent;
      ctx.fillRect(p.x, p.y, p.w, 2);
      ctx.restore();
    }
  }

  private drawHazards() {
    const ctx = this.ctx;
    ctx.fillStyle = this.level.theme.hazard;
    for (const h of this.level.hazards) {
      if (h.x + h.w < this.camera - 50 || h.x > this.camera + VIEW_W + 50) continue;
      const spikes = Math.max(2, Math.floor(h.w / 14));
      const step = h.w / spikes;
      for (let i = 0; i < spikes; i++) {
        ctx.beginPath();
        ctx.moveTo(h.x + i * step, h.y + h.h);
        ctx.lineTo(h.x + i * step + step / 2, h.y);
        ctx.lineTo(h.x + (i + 1) * step, h.y + h.h);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  private drawPickups() {
    const ctx = this.ctx;
    const t = this.level.theme;
    for (const pickup of this.pickups) {
      if (pickup.pop >= 1) continue;
      if (pickup.x < this.camera - 60 || pickup.x > this.camera + VIEW_W + 60) continue;

      const bob = Math.sin(this.time * 3 + pickup.x) * 4;
      const y = pickup.y + bob - pickup.pop * 30;

      ctx.save();
      ctx.globalAlpha = 1 - pickup.pop;
      ctx.shadowColor = t.accent;
      ctx.shadowBlur = 16;
      ctx.fillStyle = t.accent;
      ctx.beginPath();
      ctx.arc(pickup.x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pickup.label, pickup.x, y - 18);
      ctx.restore();
    }
  }

  private drawGoal() {
    const ctx = this.ctx;
    const { x, y } = this.level.goal;
    const t = this.level.theme;

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(x, y - 60, 4, 100);

    const wave = Math.sin(this.time * 4) * 5;
    ctx.fillStyle = t.accent;
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 58);
    ctx.lineTo(x + 46 + wave, y - 44);
    ctx.lineTo(x + 4, y - 26);
    ctx.closePath();
    ctx.fill();
  }

  private drawParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.colour;
      ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5);
    }
    ctx.globalAlpha = 1;
  }

  private drawPlayer() {
    const ctx = this.ctx;
    const t = this.level.theme;
    const blink = this.time * 1000 < this.invulnUntil && Math.floor(this.time * 20) % 2 === 0;
    if (blink) return;

    const cx = this.x + PLAYER_W / 2;
    const cy = this.y + PLAYER_H / 2;

    // Squash and stretch conveys the jump arc without a sprite sheet.
    const stretch = this.onGround ? 1 : Math.max(0.82, Math.min(1.18, 1 + this.vy / 2600));

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.facing, 1);

    // legs
    if (this.onGround && Math.abs(this.vx) > 0) {
      const swing = Math.sin(this.runPhase) * 7;
      ctx.strokeStyle = t.groundTop;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-3, PLAYER_H / 2 - 10);
      ctx.lineTo(-3 + swing, PLAYER_H / 2);
      ctx.moveTo(4, PLAYER_H / 2 - 10);
      ctx.lineTo(4 - swing, PLAYER_H / 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = t.groundTop;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-3, PLAYER_H / 2 - 10);
      ctx.lineTo(-5, PLAYER_H / 2 - 2);
      ctx.moveTo(4, PLAYER_H / 2 - 10);
      ctx.lineTo(6, PLAYER_H / 2 - 2);
      ctx.stroke();
    }

    // body
    ctx.fillStyle = t.accent;
    ctx.beginPath();
    ctx.roundRect(-PLAYER_W / 2, (-PLAYER_H / 2) * stretch, PLAYER_W, PLAYER_H * stretch - 8, 7);
    ctx.fill();

    // visor
    ctx.fillStyle = "rgba(10,15,30,0.85)";
    ctx.beginPath();
    ctx.roundRect(-2, (-PLAYER_H / 2) * stretch + 7, 12, 7, 3);
    ctx.fill();

    ctx.restore();
  }
}
