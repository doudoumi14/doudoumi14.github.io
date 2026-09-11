"use client";

import type { MinigameProps } from "@/data/career-game";
import { useEffect, useRef, useState } from "react";
import { ArcadeGame, type GameStatus } from "./engine";
import { arcadeLevels, VIEW_H, VIEW_W } from "./levels";

const LEFT_KEYS = new Set(["ArrowLeft", "a", "A"]);
const RIGHT_KEYS = new Set(["ArrowRight", "d", "D"]);
const JUMP_KEYS = new Set(["ArrowUp", "w", "W", " ", "Spacebar"]);

export function CareerRunner({ levelId, onComplete }: MinigameProps & { levelId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ArcadeGame | null>(null);
  const completed = useRef(false);
  const [status, setStatus] = useState<GameStatus | null>(null);

  const level = arcadeLevels[levelId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VIEW_W * dpr;
    canvas.height = VIEW_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const game = new ArcadeGame(ctx, level, (next) => {
      setStatus(next);
      if (!next.finished || completed.current) return;

      completed.current = true;
      // Score rewards collection and penalises hazard hits.
      const pickupScore = (next.collected / next.total) * 80;
      const cleanRun = Math.max(0, 20 - next.hits * 5);
      game.stop();
      onComplete({
        won: true,
        score: Math.round(pickupScore + cleanRun),
        detail: `${next.collected}/${next.total} ${level.pickupName} · ${next.hits} hit${next.hits === 1 ? "" : "s"} · ${next.elapsed.toFixed(1)}s`,
      });
    });

    gameRef.current = game;
    game.start();

    function onKeyDown(event: KeyboardEvent) {
      const c = game.controls;
      if (LEFT_KEYS.has(event.key)) c.left = true;
      else if (RIGHT_KEYS.has(event.key)) c.right = true;
      else if (JUMP_KEYS.has(event.key)) c.jump = true;
      else return;
      // Arrows and space would otherwise scroll the page under the dialog.
      event.preventDefault();
    }

    function onKeyUp(event: KeyboardEvent) {
      const c = game.controls;
      if (LEFT_KEYS.has(event.key)) c.left = false;
      else if (RIGHT_KEYS.has(event.key)) c.right = false;
      else if (JUMP_KEYS.has(event.key)) c.jump = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      game.stop();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [level, onComplete]);

  if (!level) return null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium">{level.title}</span>
        <span className="flex items-center gap-4 text-muted">
          <span className="tabular-nums">
            {status?.collected ?? 0}/{status?.total ?? level.collectibles.length}{" "}
            {level.pickupName}
          </span>
          {(status?.hits ?? 0) > 0 && (
            <span className="text-red-400 tabular-nums">{status?.hits} hit</span>
          )}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border border-line bg-black"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        aria-label={`${level.title} — a side-scrolling level. Use arrow keys to move and jump, or the on-screen buttons.`}
        role="img"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="hidden text-xs text-subtle sm:block">
          ← → or A/D to move · Space/↑ to jump · reach the flag
        </p>

        <div className="flex w-full gap-2 sm:w-auto">
          <TouchButton gameRef={gameRef} control="left" label="Move left">
            ←
          </TouchButton>
          <TouchButton gameRef={gameRef} control="right" label="Move right">
            →
          </TouchButton>
          <TouchButton gameRef={gameRef} control="jump" label="Jump" primary>
            JUMP
          </TouchButton>
        </div>
      </div>
    </div>
  );
}

// Hold-to-move button for touch and mouse. The ref is only read inside the
// pointer handlers, never while rendering.
function TouchButton({
  gameRef,
  control,
  label,
  primary = false,
  children,
}: {
  gameRef: React.RefObject<ArcadeGame | null>;
  control: "left" | "right" | "jump";
  label: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  function set(down: boolean) {
    const game = gameRef.current;
    if (game) game.controls[control] = down;
  }

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        set(true);
      }}
      onPointerUp={() => set(false)}
      onPointerLeave={() => set(false)}
      onPointerCancel={() => set(false)}
      className={
        primary
          ? "flex-1 rounded-lg border border-accent bg-accent-soft py-3 text-sm font-semibold text-accent select-none sm:flex-none sm:px-5"
          : "flex-1 rounded-lg border border-line py-3 text-lg select-none sm:flex-none sm:px-5"
      }
    >
      {children}
    </button>
  );
}
