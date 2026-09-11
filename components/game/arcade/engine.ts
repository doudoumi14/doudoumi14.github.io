import {
  GROUND_Y,
  VIEW_H,
  VIEW_W,
  type ArcadeLevel,
  type EnemyType,
  type Rect,
} from "./levels";
import {
  drawBoss,
  drawDrone,
  drawEnemy,
  drawPickup,
  drawPlayer,
  type BossKind,
  type PickupIcon,
} from "./sprites";

const GRAVITY = 1800;
const MOVE_SPEED = 300;
const JUMP_VELOCITY = -640;
const STOMP_BOUNCE = -430;
const COYOTE_MS = 90;
const PLAYER_W = 26;
const PLAYER_H = 36;

const BOSS_W = 74;
const BOSS_H = 70;
const BOSS_SPEED = 95;

export interface GameStatus {
  collected: number;
  total: number;
  hits: number;
  elapsed: number;
  finished: boolean;
  won: boolean;
  /** Remaining boss health, or null until the boss is engaged. */
  bossHp: number | null;
  bossMax: number;
  bossName: string;
  defeated: number;
  /** 0-1. Fills as pickups are collected; at 1 an automation can be deployed. */
  charge: number;
  deployed: number;
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
  icon: PickupIcon;
  hue: number;
  taken: boolean;
  pop: number;
}

interface EnemyState {
  x: number;
  y: number;
  originX: number;
  originY: number;
  type: EnemyType;
  range: number;
  speed: number;
  hue: number;
  dir: number;
  phase: number;
  dead: boolean;
  deadFor: number;
}

interface BossState {
  x: number;
  /** Spawn position — the arena is anchored to this, never to the live x. */
  homeX: number;
  y: number;
  vy: number;
  dir: number;
  hp: number;
  max: number;
  name: string;
  kind: BossKind;
  hue: number;
  invulnUntil: number;
  onGround: boolean;
  engaged: boolean;
}

export interface Controls {
  left: boolean;
  right: boolean;
  jump: boolean;
  deploy: boolean;
}

/** A deployed automation script: clears enemies and damages the boss. */
interface Drone {
  x: number;
  y: number;
  life: number;
  hitBoss: boolean;
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
  /**
   * Short window after a successful stomp. A stomp launches the player upward,
   * so on the next frame they are still inside the target but no longer
   * descending — which used to register as a side hit and cost damage for a
   * landing that actually connected. Deliberately separate from invulnUntil so
   * a clean stomp never triggers the damage blink.
   */
  private stompGrace = 0;

  private pickups: Pickup[];
  private enemies: EnemyState[];
  private boss: BossState;
  private particles: Particle[] = [];
  private drones: Drone[] = [];
  private deployLatch = false;
  private floaters: { x: number; y: number; text: string; life: number; colour: string }[] = [];

  private status: GameStatus;
  private raf = 0;
  private last = 0;
  private time = 0;
  private running = false;

  controls: Controls = { left: false, right: false, jump: false, deploy: false };

  constructor(
    ctx: CanvasRenderingContext2D,
    level: ArcadeLevel,
    onStatus: (status: GameStatus) => void,
  ) {
    this.ctx = ctx;
    this.level = level;
    this.onStatus = onStatus;

    this.pickups = level.collectibles.map((c) => ({ ...c, taken: false, pop: 0 }));
    this.enemies = level.enemies.map((e) => ({
      ...e,
      originX: e.x,
      originY: e.y,
      dir: 1,
      phase: Math.random() * Math.PI * 2,
      dead: false,
      deadFor: 0,
    }));
    this.boss = {
      x: level.boss.x,
      homeX: level.boss.x,
      y: GROUND_Y - BOSS_H,
      vy: 0,
      dir: -1,
      hp: level.boss.hits,
      max: level.boss.hits,
      name: level.boss.name,
      kind: level.boss.kind,
      hue: level.boss.hue,
      invulnUntil: 0,
      onGround: true,
      engaged: false,
    };

    this.status = {
      collected: 0,
      total: this.pickups.length,
      hits: 0,
      elapsed: 0,
      finished: false,
      won: false,
      bossHp: null,
      bossMax: level.boss.hits,
      bossName: level.boss.name,
      defeated: 0,
      charge: 1,
      deployed: 0,
    };
  }

  start() {
    this.running = true;
    this.last = performance.now();
    // Push the opening state so the HUD reflects the starting charge instead of
    // waiting for the first pickup or hit to emit.
    this.emit();
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

    // Passive regen guarantees the boss is always beatable by automation alone,
    // so the level never dead-ends for a player who cannot land stomps.
    if (this.status.charge < 1) {
      const before = this.status.charge;
      this.status.charge = Math.min(1, this.status.charge + dt * 0.07);
      if (before < 1 && this.status.charge >= 1) this.emit();
    }

    this.movePlayer(dt);
    this.updatePickups();
    this.updateEnemies(dt);
    this.updateDrones(dt);
    this.updateBoss(dt);
    this.updateHazards();
    this.updateEffects(dt);

    const target = Math.max(0, Math.min(this.level.width - VIEW_W, this.x - VIEW_W * 0.4));
    this.camera += (target - this.camera) * Math.min(1, dt * 6);
  }

  private movePlayer(dt: number) {
    const { left, right, jump } = this.controls;
    this.vx = (right ? MOVE_SPEED : 0) - (left ? MOVE_SPEED : 0);
    if (this.vx !== 0) this.facing = this.vx > 0 ? 1 : -1;

    if (jump && (this.onGround || this.time * 1000 - this.lastGroundAt < COYOTE_MS)) {
      this.vy = JUMP_VELOCITY;
      this.onGround = false;
      this.lastGroundAt = -Infinity;
    }

    this.vy += GRAVITY * dt;

    this.x += this.vx * dt;
    this.x = Math.max(0, Math.min(this.level.width - PLAYER_W, this.x));
    for (const p of this.level.platforms) {
      const box = { x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H };
      if (!overlaps(box, p)) continue;
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
  }

  private playerBox(): Rect {
    return { x: this.x, y: this.y, w: PLAYER_W, h: PLAYER_H };
  }

  private updatePickups() {
    for (const pickup of this.pickups) {
      if (pickup.taken) {
        pickup.pop = Math.min(1, pickup.pop + 0.03);
        continue;
      }
      if (!overlaps(this.playerBox(), { x: pickup.x - 15, y: pickup.y - 15, w: 30, h: 30 })) {
        continue;
      }
      pickup.taken = true;
      this.status.collected += 1;
      this.status.charge = Math.min(1, this.status.charge + 1 / 3);
      this.burst(pickup.x, pickup.y, `hsl(${pickup.hue} 85% 62%)`);
      this.float(pickup.x, pickup.y - 16, pickup.label, `hsl(${pickup.hue} 85% 70%)`);
      this.emit();
    }
  }

  private updateEnemies(dt: number) {
    for (const enemy of this.enemies) {
      if (enemy.dead) {
        enemy.deadFor += dt;
        continue;
      }

      if (enemy.type === "patroller") {
        enemy.x += enemy.dir * enemy.speed * dt;
        if (Math.abs(enemy.x - enemy.originX) > enemy.range) {
          enemy.dir *= -1;
          enemy.x = enemy.originX + Math.sign(enemy.x - enemy.originX) * enemy.range;
        }
      } else {
        enemy.phase += dt * 1.6;
        enemy.x += enemy.dir * enemy.speed * dt;
        if (Math.abs(enemy.x - enemy.originX) > enemy.range * 2) enemy.dir *= -1;
        enemy.y = enemy.originY + Math.sin(enemy.phase) * enemy.range;
      }

      const box = { x: enemy.x - 12, y: enemy.y - 14, w: 24, h: 28 };
      if (!overlaps(this.playerBox(), box)) continue;

      // Any descent that meets the upper half counts as a stomp. Requiring a
      // fast fall made contact feel arbitrary — you would clip the side and
      // take a hit on jumps that visually landed on top.
      const fromAbove = this.vy > 0 && this.y + PLAYER_H <= enemy.y + 16;
      if (fromAbove) {
        enemy.dead = true;
        this.status.defeated += 1;
        this.status.charge = Math.min(1, this.status.charge + 0.15);
        this.vy = STOMP_BOUNCE;
        this.stompGrace = this.time * 1000 + 700;
        this.shake = 6;
        this.burst(enemy.x, enemy.y, `hsl(${enemy.hue} 85% 60%)`);
        this.emit();
      } else if (this.time * 1000 > this.invulnUntil && this.time * 1000 > this.stompGrace) {
        this.takeHit();
      }
    }
  }

  // Automation is the level's other win condition: bank four pickups, deploy,
  // and the script clears what is ahead of you. Fits the job it is modelling,
  // and gives a way past a boss without pixel-perfect platforming.
  private updateDrones(dt: number) {
    if (this.controls.deploy && !this.deployLatch && this.status.charge >= 1) {
      this.deployLatch = true;
      this.status.charge = 0;
      this.status.deployed += 1;
      this.drones.push({ x: this.x + PLAYER_W, y: this.y + 6, life: 3.2, hitBoss: false });
      this.float(this.x, this.y - 18, "automation deployed", this.level.theme.accent);
      this.emit();
    }
    if (!this.controls.deploy) this.deployLatch = false;

    for (const drone of this.drones) {
      drone.life -= dt;
      drone.x += 430 * dt;
      // Drifts toward the boss's height so it reliably connects.
      const targetY = this.boss.engaged ? this.boss.y + 20 : drone.y;
      drone.y += (targetY - drone.y) * Math.min(1, dt * 2);

      if (Math.random() < 0.5) {
        this.particles.push({
          x: drone.x - 10,
          y: drone.y + 4,
          vx: -60 - Math.random() * 60,
          vy: (Math.random() - 0.5) * 40,
          life: 0.35,
          colour: this.level.theme.accent,
        });
      }

      const box = { x: drone.x - 10, y: drone.y - 8, w: 20, h: 16 };

      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        if (!overlaps(box, { x: enemy.x - 12, y: enemy.y - 14, w: 24, h: 28 })) continue;
        enemy.dead = true;
        this.status.defeated += 1;
        this.burst(enemy.x, enemy.y, this.level.theme.accent);
        this.emit();
      }

      const boss = this.boss;
      if (
        !drone.hitBoss &&
        boss.hp > 0 &&
        boss.engaged &&
        overlaps(box, { x: boss.x - BOSS_W / 2, y: boss.y, w: BOSS_W, h: BOSS_H })
      ) {
        drone.hitBoss = true;
        drone.life = 0;
        this.damageBoss();
      }
    }

    this.drones = this.drones.filter((d) => d.life > 0 && d.x < this.level.width + 40);
  }

  /** Shared by a stomp and by a deployed automation. */
  private damageBoss() {
    const boss = this.boss;
    if (boss.hp <= 0 || this.time * 1000 <= boss.invulnUntil) return;

    boss.hp -= 1;
    boss.invulnUntil = this.time * 1000 + 700;
    this.shake = 14;
    this.burst(boss.x, boss.y + 20, `hsl(${boss.hue} 85% 62%)`);

    if (boss.hp <= 0) {
      for (let i = 0; i < 4; i++) {
        this.burst(boss.x + (Math.random() - 0.5) * 60, boss.y + Math.random() * 50, "#ffd866");
      }
      this.float(boss.x, boss.y, `${boss.name} defeated`, "#ffd866");
      this.status.finished = true;
      this.status.won = true;
      this.shake = 20;
    }
    this.emitBoss();
  }

  private updateBoss(dt: number) {
    const boss = this.boss;
    if (boss.hp <= 0) return;

    // The boss only wakes once you're near, so the run in is calm.
    if (!boss.engaged && this.x > boss.x - VIEW_W * 0.55) {
      boss.engaged = true;
      this.emitBoss();
    }
    if (!boss.engaged) return;

    // Anchored to homeX. Deriving these from boss.x meant the bounds moved with
    // the boss every frame, so it drifted out of its arena and off the level.
    const arenaLeft = boss.homeX - 190;
    const arenaRight = boss.homeX + 150;

    boss.x += boss.dir * BOSS_SPEED * (1 + (boss.max - boss.hp) * 0.22) * dt;
    if (boss.x < arenaLeft) {
      boss.x = arenaLeft;
      boss.dir = 1;
    } else if (boss.x > arenaRight) {
      boss.x = arenaRight;
      boss.dir = -1;
    }

    // Periodic hop, so it isn't a purely horizontal target.
    boss.vy += GRAVITY * dt;
    boss.y += boss.vy * dt;
    if (boss.y >= GROUND_Y - BOSS_H) {
      boss.y = GROUND_Y - BOSS_H;
      boss.vy = 0;
      if (!boss.onGround) this.shake = 9;
      boss.onGround = true;
      if (Math.sin(this.time * 1.6) > 0.92) {
        boss.vy = -520;
        boss.onGround = false;
      }
    }

    const box = { x: boss.x - BOSS_W / 2, y: boss.y, w: BOSS_W, h: BOSS_H };
    if (!overlaps(this.playerBox(), box)) return;

    // Generous stomp band: the top ~55% of the boss, from the instant the
    // player starts descending.
    const fromAbove = this.vy > 0 && this.y + PLAYER_H <= boss.y + BOSS_H * 0.55;
    if (fromAbove && this.time * 1000 > boss.invulnUntil) {
      this.vy = STOMP_BOUNCE;
      // Grace has to outlast the whole bounce arc (2 * 430 / 1800 s), or the
      // landing gets punished for a hit that actually connected.
      this.stompGrace = this.time * 1000 + 900;
      // Knock clear of the boss as well. Bouncing straight up lands the player
      // back on top of it, touching its side the instant grace lapses, which
      // reads as "I stomped it and still took damage".
      const away = this.x + PLAYER_W / 2 < boss.x ? -1 : 1;
      this.x = Math.max(
        0,
        Math.min(this.level.width - PLAYER_W, this.x + away * (BOSS_W / 2 + 26)),
      );
      this.damageBoss();
    } else if (
      !fromAbove &&
      this.time * 1000 > this.invulnUntil &&
      this.time * 1000 > this.stompGrace &&
      // While the boss is flashing from a hit, that contact is already resolved.
      this.time * 1000 > boss.invulnUntil
    ) {
      this.takeHit();
    }
  }

  private updateHazards() {
    if (this.time * 1000 <= this.invulnUntil || this.time * 1000 <= this.stompGrace) return;
    for (const hazard of this.level.hazards) {
      if (!overlaps(this.playerBox(), hazard)) continue;
      this.takeHit();
      break;
    }
  }

  private takeHit() {
    this.status.hits += 1;
    this.invulnUntil = this.time * 1000 + 1000;
    this.shake = 12;
    this.vy = -360;
    this.x -= this.facing * 42;
    this.burst(this.x + PLAYER_W / 2, this.y + PLAYER_H / 2, this.level.theme.hazard);
    this.emit();
  }

  private updateEffects(dt: number) {
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 900 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    for (const f of this.floaters) {
      f.life -= dt;
      f.y -= dt * 26;
    }
    this.floaters = this.floaters.filter((f) => f.life > 0);

    this.shake = Math.max(0, this.shake - dt * 40);
  }

  private burst(x: number, y: number, colour: string) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const speed = 90 + Math.random() * 140;
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

  private float(x: number, y: number, text: string, colour: string) {
    this.floaters.push({ x, y, text, life: 1.1, colour });
  }

  private emit() {
    this.onStatus({ ...this.status });
  }

  private emitBoss() {
    this.status.bossHp = this.boss.hp;
    this.emit();
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

    this.drawBackdrop(this.camera * 0.2, t.far, 0.22);
    this.drawBackdrop(this.camera * 0.45, t.mid, 0.34);

    ctx.save();
    ctx.translate(-this.camera, 0);

    this.drawPlatforms();
    this.drawHazards();
    this.drawBoss();
    this.drawPickups();
    this.drawEnemies();
    this.drawParticles();
    this.drawDrones();
    this.drawPlayer();
    this.drawFloaters();

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

  private visible(x: number, pad = 80) {
    return x > this.camera - pad && x < this.camera + VIEW_W + pad;
  }

  private drawPlatforms() {
    const ctx = this.ctx;
    const t = this.level.theme;
    for (const p of this.level.platforms) {
      if (p.x + p.w < this.camera - 50 || p.x > this.camera + VIEW_W + 50) continue;

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
      if (!this.visible(h.x)) continue;
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
    for (const pickup of this.pickups) {
      if (pickup.pop >= 1 || !this.visible(pickup.x)) continue;

      const bob = Math.sin(this.time * 3 + pickup.x) * 4;
      const y = pickup.y + bob - pickup.pop * 34;

      ctx.save();
      ctx.globalAlpha = 1 - pickup.pop;
      ctx.translate(pickup.x, y);

      ctx.shadowColor = `hsl(${pickup.hue} 90% 60%)`;
      ctx.shadowBlur = 14;
      drawPickup(ctx, pickup.icon, pickup.hue, this.time + pickup.x);
      ctx.shadowBlur = 0;

      ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      const w = ctx.measureText(pickup.label).width;
      ctx.fillStyle = "rgba(8,10,18,0.72)";
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 6, -32, w + 12, 16, 5);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(pickup.label, 0, -20);
      ctx.restore();
    }
  }

  private drawEnemies() {
    const ctx = this.ctx;
    for (const enemy of this.enemies) {
      if (!this.visible(enemy.x)) continue;

      ctx.save();
      if (enemy.dead) {
        // Squash flat and fade out.
        ctx.globalAlpha = Math.max(0, 1 - enemy.deadFor * 2.2);
        ctx.translate(enemy.x, enemy.y + 10);
        ctx.scale(1.25, 0.3);
      } else {
        ctx.translate(enemy.x, enemy.y);
      }
      drawEnemy(
        ctx,
        this.level.enemySkin,
        enemy.type === "flyer",
        enemy.hue,
        this.time + enemy.phase,
        enemy.dir >= 0 ? 1 : -1,
      );
      ctx.restore();
    }
  }

  private drawBoss() {
    const boss = this.boss;
    if (boss.hp <= 0 || !this.visible(boss.x, 200)) return;
    const ctx = this.ctx;

    const hurt = this.time * 1000 < boss.invulnUntil && Math.floor(this.time * 18) % 2 === 0;

    ctx.save();
    ctx.translate(boss.x, boss.y + BOSS_H / 2);
    ctx.shadowColor = `hsl(${boss.hue} 90% 55%)`;
    ctx.shadowBlur = 26;
    drawBoss(ctx, boss.kind, boss.hue, this.time, 2.0, hurt);
    ctx.restore();

    if (!boss.engaged) return;

    // Health pips above the arena.
    const barW = 120;
    const x = boss.x - barW / 2;
    const y = boss.y - 34;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(x - 3, y - 3, barW + 6, 14);
    for (let i = 0; i < boss.max; i++) {
      ctx.fillStyle = i < boss.hp ? `hsl(${boss.hue} 85% 60%)` : "rgba(255,255,255,0.18)";
      ctx.fillRect(x + i * (barW / boss.max), y, barW / boss.max - 4, 8);
    }

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "700 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(boss.name.toUpperCase(), boss.x, y - 10);
  }

  private drawDrones() {
    const ctx = this.ctx;
    for (const drone of this.drones) {
      if (!this.visible(drone.x)) continue;
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.shadowColor = this.level.theme.accent;
      ctx.shadowBlur = 14;
      drawDrone(ctx, this.level.theme.accent, this.time);
      ctx.restore();
    }
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

  private drawFloaters() {
    const ctx = this.ctx;
    ctx.textAlign = "center";
    for (const f of this.floaters) {
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.fillStyle = f.colour;
      ctx.font = "700 13px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  private drawPlayer() {
    const ctx = this.ctx;
    const blink = this.time * 1000 < this.invulnUntil && Math.floor(this.time * 20) % 2 === 0;
    if (blink) return;

    const stretch = this.onGround ? 1 : Math.max(0.82, Math.min(1.18, 1 + this.vy / 2600));

    ctx.save();
    ctx.translate(this.x + PLAYER_W / 2, this.y + PLAYER_H / 2);
    ctx.scale(this.facing, 1);
    drawPlayer(
      ctx,
      this.level.theme.accent,
      this.time,
      Math.abs(this.vx) > 0,
      this.onGround,
      stretch,
      this.runPhase,
    );
    ctx.restore();
  }

}
