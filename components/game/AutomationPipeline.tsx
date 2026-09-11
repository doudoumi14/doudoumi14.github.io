"use client";

import type { MinigameProps } from "@/data/career-game";
import { useEffect, useMemo, useRef, useState } from "react";

const STEPS = [
  "Lead submitted in Salesforce",
  "Validate required fields",
  "Enrich with account data",
  "Route to the right owner",
  "Trigger approval workflow",
  "Write back to reporting",
];

const TIME_LIMIT = 45;

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function AutomationPipeline({ onComplete }: MinigameProps) {
  const pool = useMemo(() => shuffle(STEPS), []);
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [remaining, setRemaining] = useState(TIME_LIMIT);
  const [done, setDone] = useState(false);

  // Latest values for the interval callback, which must not re-subscribe on
  // every tick.
  const state = useRef({ placed, onComplete });
  useEffect(() => {
    state.current = { placed, onComplete };
  });

  // The countdown drives game-over from inside the tick rather than from a
  // reactive effect, so no state is set synchronously during an effect body.
  useEffect(() => {
    if (done) return;
    let left = TIME_LIMIT;
    const timer = setInterval(() => {
      left -= 1;
      setRemaining(left);
      if (left <= 0) {
        clearInterval(timer);
        setDone(true);
        const { placed: current, onComplete: finish } = state.current;
        finish({
          won: false,
          score: Math.round((current.length / STEPS.length) * 100),
          detail: `Time ran out with ${current.length}/${STEPS.length} steps wired up`,
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [done]);

  function choose(step: string) {
    if (done) return;

    if (step !== STEPS[placed.length]) {
      setWrong(step);
      setMistakes((count) => count + 1);
      setTimeout(() => setWrong(null), 400);
      return;
    }

    const next = [...placed, step];
    setPlaced(next);

    if (next.length === STEPS.length) {
      setDone(true);
      onComplete({
        won: true,
        score: Math.max(40, 100 - mistakes * 10 - Math.round((TIME_LIMIT - remaining) / 3)),
        detail: `Pipeline assembled with ${mistakes} misstep${mistakes === 1 ? "" : "s"}, ${remaining}s left`,
      });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          Step {Math.min(placed.length + 1, STEPS.length)} of {STEPS.length}
        </span>
        <span className={`tabular-nums ${remaining <= 10 ? "text-red-400" : "text-muted"}`}>
          {remaining}s
        </span>
      </div>

      <ol className="mt-4 flex flex-col gap-1.5">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
              placed[index]
                ? "border-emerald-400/40 bg-emerald-400/10"
                : "border-dashed border-line text-subtle"
            }`}
          >
            <span className="font-mono text-xs">{index + 1}</span>
            <span>{placed[index] ?? "—"}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs tracking-wider text-subtle uppercase">Available steps</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {pool.map((step) => {
          const used = placed.includes(step);
          return (
            <button
              key={step}
              type="button"
              onClick={() => choose(step)}
              disabled={used || done}
              className={`rounded-lg border px-3 py-1.5 text-sm transition disabled:opacity-30 ${
                wrong === step
                  ? "border-red-400 text-red-400"
                  : "border-line enabled:hover:border-accent enabled:hover:text-accent"
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}
