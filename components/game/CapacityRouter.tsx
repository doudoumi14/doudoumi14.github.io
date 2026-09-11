"use client";

import type { MinigameProps } from "@/data/career-game";
import { useEffect, useRef, useState } from "react";

const LINKS = ["Montreal ↔ Toronto", "Toronto ↔ Ottawa", "Ottawa ↔ Quebec", "Quebec ↔ Montreal"];
const DURATION = 40;
const TICK_MS = 700;

export function CapacityRouter({ onComplete }: MinigameProps) {
  const [loads, setLoads] = useState<number[]>([38, 44, 31, 40]);
  const [remaining, setRemaining] = useState(DURATION);
  const [breaches, setBreaches] = useState(0);
  const [done, setDone] = useState(false);

  // Simulation state lives in a ref so the interval reads current values
  // without re-subscribing each tick. Never written during render.
  const sim = useRef({ loads: [38, 44, 31, 40], breaches: 0, onComplete });
  useEffect(() => {
    sim.current.onComplete = onComplete;
  });

  useEffect(() => {
    if (done) return;
    let left = DURATION;

    const timer = setInterval(() => {
      // Traffic grows steadily, with an occasional surge on one link.
      const surgeIndex = Math.random() < 0.45 ? Math.floor(Math.random() * LINKS.length) : -1;
      const next = sim.current.loads.map((load, i) => {
        const drift = 1 + Math.random() * 3;
        const surge = i === surgeIndex ? 9 + Math.random() * 10 : 0;
        return Math.min(140, load + drift + surge);
      });

      const overloaded = next.filter((load) => load >= 100).length;
      sim.current.loads = next;
      setLoads(next);
      if (overloaded > 0) {
        sim.current.breaches += overloaded;
        setBreaches(sim.current.breaches);
      }

      left -= TICK_MS / 1000;
      setRemaining(left);

      if (left <= 0) {
        clearInterval(timer);
        setDone(true);
        const ticks = Math.round(DURATION / (TICK_MS / 1000)) * LINKS.length;
        const uptime = Math.max(0, 100 - (sim.current.breaches / ticks) * 100);
        sim.current.onComplete({
          won: uptime >= 99,
          score: Math.round(uptime),
          detail:
            uptime >= 99
              ? `Held ${uptime.toFixed(1)}% availability through ${LINKS.length} links`
              : `${uptime.toFixed(1)}% availability — ${sim.current.breaches} capacity breach${sim.current.breaches === 1 ? "" : "es"}`,
        });
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [done]);

  // Shedding load moves traffic onto the least-loaded neighbour rather than
  // deleting it, so the grid still has to balance overall.
  function shed(index: number) {
    if (done) return;
    const next = [...sim.current.loads];
    const moved = Math.min(next[index], 22);
    next[index] -= moved;

    let target = index === 0 ? 1 : 0;
    for (let i = 0; i < next.length; i++) {
      if (i !== index && next[i] < next[target]) target = i;
    }
    next[target] = Math.min(140, next[target] + moved * 0.55);

    sim.current.loads = next;
    setLoads(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Click a link to shed load</span>
        <span className="tabular-nums text-muted">{Math.max(0, Math.ceil(remaining))}s</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LINKS.map((link, index) => {
          const load = loads[index];
          const over = load >= 100;
          const warn = load >= 80;
          return (
            <button
              key={link}
              type="button"
              onClick={() => shed(index)}
              disabled={done}
              className={`rounded-xl border p-4 text-left transition disabled:opacity-60 ${
                over
                  ? "border-red-400 bg-red-400/10"
                  : warn
                    ? "border-amber-400/60 bg-amber-400/5"
                    : "border-line enabled:hover:border-accent"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{link}</span>
                <span className={`text-sm tabular-nums ${over ? "text-red-400" : ""}`}>
                  {Math.round(load)}%
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={Math.round(load)}
                aria-valuemin={0}
                aria-valuemax={140}
                aria-label={`${link} utilisation`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    over ? "bg-red-400" : warn ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${Math.min(100, (load / 140) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted">
        Capacity breaches: <span className="tabular-nums">{breaches}</span>
      </p>
    </div>
  );
}
