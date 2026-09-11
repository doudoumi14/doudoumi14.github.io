"use client";

import type { MinigameProps } from "@/data/career-game";
import { useState } from "react";

const BUDGET_MS = 16.6;
const MAX_PASSES = 5;

interface Task {
  name: string;
  cost: number;
  /** How much one optimisation pass removes. */
  gain: number;
  floor: number;
}

const INITIAL: Task[] = [
  { name: "Shadow cascade", cost: 8.2, gain: 2.4, floor: 1.6 },
  { name: "Terrain mesh", cost: 6.4, gain: 1.8, floor: 2.2 },
  { name: "Cockpit instruments", cost: 3.1, gain: 0.6, floor: 1.9 },
  { name: "Atmospheric scatter", cost: 5.7, gain: 2.1, floor: 1.2 },
  { name: "Post-process chain", cost: 2.9, gain: 1.1, floor: 0.8 },
];

export function FrameBudget({ onComplete }: MinigameProps) {
  const [tasks, setTasks] = useState(INITIAL);
  const [passes, setPasses] = useState(MAX_PASSES);
  const [done, setDone] = useState(false);

  const total = tasks.reduce((sum, task) => sum + task.cost, 0);
  const fps = Math.round(1000 / total);
  const underBudget = total <= BUDGET_MS;

  function optimise(index: number) {
    if (passes === 0 || done) return;

    const next = tasks.map((task, i) =>
      i === index ? { ...task, cost: Math.max(task.floor, +(task.cost - task.gain).toFixed(1)) } : task,
    );
    const remaining = passes - 1;
    setTasks(next);
    setPasses(remaining);

    const newTotal = next.reduce((sum, task) => sum + task.cost, 0);
    if (newTotal <= BUDGET_MS) {
      setDone(true);
      const headroom = ((BUDGET_MS - newTotal) / BUDGET_MS) * 100;
      onComplete({
        won: true,
        score: Math.round(Math.min(100, 70 + headroom + remaining * 4)),
        detail: `${newTotal.toFixed(1)}ms/frame — ${Math.round(1000 / newTotal)}fps with ${remaining} pass${remaining === 1 ? "" : "es"} to spare`,
      });
    } else if (remaining === 0) {
      setDone(true);
      onComplete({
        won: false,
        score: Math.round((BUDGET_MS / newTotal) * 100),
        detail: `Ran out of passes at ${newTotal.toFixed(1)}ms — still over the ${BUDGET_MS}ms budget`,
      });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-wider text-subtle uppercase">Frame time</p>
          <p className={`text-3xl font-bold tabular-nums ${underBudget ? "text-emerald-400" : ""}`}>
            {total.toFixed(1)}
            <span className="text-base font-normal text-muted">ms / {BUDGET_MS}ms</span>
          </p>
          <p className="text-sm text-muted">{fps} fps</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-wider text-subtle uppercase">Passes left</p>
          <p className="text-3xl font-bold tabular-nums">{passes}</p>
        </div>
      </div>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={Math.round((total / BUDGET_MS) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Frame budget used"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${underBudget ? "bg-emerald-400" : "bg-red-400"}`}
          style={{ width: `${Math.min(100, (total / BUDGET_MS) * 100)}%` }}
        />
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {tasks.map((task, index) => {
          const maxed = task.cost <= task.floor;
          return (
            <li key={task.name}>
              <button
                type="button"
                onClick={() => optimise(index)}
                disabled={done || passes === 0 || maxed}
                className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2 text-left transition enabled:hover:border-accent disabled:opacity-50"
              >
                <span className="flex-1 text-sm">{task.name}</span>
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full bg-accent transition-all duration-300"
                    style={{ width: `${(task.cost / 8.2) * 100}%` }}
                  />
                </span>
                <span className="w-14 text-right text-sm tabular-nums">{task.cost.toFixed(1)}ms</span>
                <span className="text-xs text-subtle">{maxed ? "maxed" : "optimise"}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
