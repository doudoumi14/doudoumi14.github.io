"use client";

import type { MinigameProps } from "@/data/career-game";
import { useEffect, useRef, useState } from "react";

type Lane = "compliance" | "product" | "defer";

interface Item {
  text: string;
  lane: Lane;
}

const LANES: { id: Lane; label: string; hint: string }[] = [
  { id: "compliance", label: "Compliance", hint: "regulatory or data governance" },
  { id: "product", label: "Product", hint: "customer-facing delivery" },
  { id: "defer", label: "Defer", hint: "no near-term value" },
];

const QUEUE: Item[] = [
  { text: "Retention policy for transaction logs", lane: "compliance" },
  { text: "Redesign the account dashboard", lane: "product" },
  { text: "Rename an internal enum", lane: "defer" },
  { text: "Audit trail for advisor overrides", lane: "compliance" },
  { text: "Add e-transfer to mobile", lane: "product" },
  { text: "Swap the logo on the staging banner", lane: "defer" },
  { text: "Consent capture before data export", lane: "compliance" },
  { text: "Faster statement download", lane: "product" },
  { text: "Tidy up legacy CSS comments", lane: "defer" },
  { text: "Encryption at rest for PII fields", lane: "compliance" },
];

const STARTING_BACKLOG = 60;
const TARGET_REDUCTION = 20;

export function BacklogTriage({ onComplete }: MinigameProps) {
  const [index, setIndex] = useState(0);
  const [backlog, setBacklog] = useState(STARTING_BACKLOG);
  const [correct, setCorrect] = useState(0);
  const [flash, setFlash] = useState<"right" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  const state = useRef({ backlog, correct, onComplete });
  useEffect(() => {
    state.current = { backlog, correct, onComplete };
  });

  // Backlog creeps up while you deliberate; overflow is detected in the tick
  // rather than by a reactive effect watching the value.
  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      const next = state.current.backlog + 1;
      state.current.backlog = next;
      setBacklog(next);

      if (next >= 100) {
        clearInterval(timer);
        setDone(true);
        const { correct: got, onComplete: finish } = state.current;
        finish({
          won: false,
          score: Math.round((got / QUEUE.length) * 100),
          detail: `Backlog overflowed after ${got} correct call${got === 1 ? "" : "s"}`,
        });
      }
    }, 1600);
    return () => clearInterval(timer);
  }, [done]);

  function triage(lane: Lane) {
    if (done) return;
    const item = QUEUE[index];
    const right = item.lane === lane;

    setFlash(right ? "right" : "wrong");
    setTimeout(() => setFlash(null), 250);

    const nextBacklog = Math.max(0, backlog + (right ? -6 : 4));
    const nextCorrect = correct + (right ? 1 : 0);
    setBacklog(nextBacklog);
    setCorrect(nextCorrect);

    const nextIndex = index + 1;
    if (nextIndex >= QUEUE.length) {
      setDone(true);
      const reduction = Math.round(((STARTING_BACKLOG - nextBacklog) / STARTING_BACKLOG) * 100);
      onComplete({
        won: reduction >= TARGET_REDUCTION,
        score: Math.max(0, Math.min(100, reduction * 3)),
        detail:
          reduction >= TARGET_REDUCTION
            ? `Backlog down ${reduction}% with ${nextCorrect}/${QUEUE.length} correct`
            : `Only ${reduction}% reduction — target was ${TARGET_REDUCTION}%`,
      });
      return;
    }
    setIndex(nextIndex);
  }

  const item = QUEUE[Math.min(index, QUEUE.length - 1)];

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          Item {Math.min(index + 1, QUEUE.length)} of {QUEUE.length}
        </span>
        <span className={`tabular-nums ${backlog >= 80 ? "text-red-400" : "text-muted"}`}>
          backlog {backlog}
        </span>
      </div>

      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={backlog}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Backlog size"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${backlog >= 80 ? "bg-red-400" : "bg-accent"}`}
          style={{ width: `${Math.min(100, backlog)}%` }}
        />
      </div>

      <div
        className={`mt-5 rounded-xl border p-5 text-center transition ${
          flash === "right"
            ? "border-emerald-400 bg-emerald-400/10"
            : flash === "wrong"
              ? "border-red-400 bg-red-400/10"
              : "border-line bg-white/5"
        }`}
      >
        <p className="text-xs tracking-wider text-subtle uppercase">Incoming</p>
        <p className="mt-1 text-lg font-medium">{item.text}</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {LANES.map((lane) => (
          <button
            key={lane.id}
            type="button"
            onClick={() => triage(lane.id)}
            disabled={done}
            className="rounded-lg border border-line px-3 py-3 text-sm transition enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
          >
            <span className="block font-medium">{lane.label}</span>
            <span className="mt-0.5 block text-xs text-subtle">{lane.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
