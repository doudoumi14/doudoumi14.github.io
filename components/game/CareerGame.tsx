"use client";

import {
  careerLevels,
  loadProgress,
  saveProgress,
  type MinigameResult,
} from "@/data/career-game";
import { useCallback, useEffect, useState } from "react";
import { CareerRunner } from "./arcade/CareerRunner";

type Phase = "select" | "brief" | "play" | "result";

export function CareerGame({ onClose }: { onClose: () => void }) {
  // Mounted only after a click, never during SSR, so reading storage in the
  // lazy initialiser is safe here.
  const [cleared, setCleared] = useState<string[]>(() => loadProgress());
  const [phase, setPhase] = useState<Phase>("select");
  const [levelIndex, setLevelIndex] = useState(0);
  const [result, setResult] = useState<MinigameResult | null>(null);
  // Remounts the minigame on replay so its internal state resets cleanly.
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const level = careerLevels[levelIndex];

  const handleComplete = useCallback(
    (r: MinigameResult) => {
      setResult(r);
      setPhase("result");
      if (!r.won) return;

      // saveProgress notifies other components, so it must run as a plain
      // side effect here — never inside a setState updater, which React may
      // invoke during render.
      const next = [...new Set([...cleared, careerLevels[levelIndex].id])];
      setCleared(next);
      saveProgress(next);
    },
    [levelIndex, cleared],
  );

  function start(index: number) {
    setLevelIndex(index);
    setResult(null);
    setPhase("brief");
  }

  function play() {
    setRunId((id) => id + 1);
    setPhase("play");
  }

  const allCleared = cleared.length === careerLevels.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Career mode"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-accent">▶</span>
            <h2 className="text-sm font-semibold">Career mode</h2>
            <span className="text-xs text-subtle">
              {cleared.length}/{careerLevels.length} cleared
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close career mode"
            className="text-sm text-subtle transition hover:text-foreground"
          >
            esc
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {phase === "select" && (
            <>
              <p className="text-muted">
                Four roles, four problems I actually had to solve. Play through them in order — or
                jump to whichever sounds interesting.
              </p>

              {allCleared && (
                <p className="mt-4 rounded-lg border border-accent bg-accent-soft px-4 py-3 text-sm">
                  Campaign complete. That is the whole career, 2021 to now.
                </p>
              )}

              <ul className="mt-5 flex flex-col gap-3">
                {careerLevels.map((item, index) => {
                  const isCleared = cleared.includes(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => start(index)}
                        className="flex w-full items-center gap-4 rounded-xl border border-line p-4 text-left transition hover:border-accent hover:bg-card-hover"
                      >
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                            isCleared
                              ? "border-emerald-400 text-emerald-400"
                              : "border-line text-subtle"
                          }`}
                        >
                          {isCleared ? "✓" : index + 1}
                        </span>
                        <span className="flex-1">
                          <span className="block font-semibold">{item.company}</span>
                          <span className="block text-sm text-muted">{item.role}</span>
                        </span>
                        <span className="text-xs text-subtle">{item.year}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {phase === "brief" && (
            <>
              <p className="text-xs tracking-wider text-accent uppercase">
                Level {levelIndex + 1} — {level.year}
              </p>
              <h3 className="mt-1 text-2xl font-bold">{level.company}</h3>
              <p className="text-sm text-muted">{level.role}</p>

              <p className="mt-5 text-muted">{level.brief}</p>

              <div className="mt-5 rounded-lg border border-line bg-card p-4">
                <p className="text-xs tracking-wider text-subtle uppercase">Objective</p>
                <p className="mt-1">{level.objective}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={play}
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Start level
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("select")}
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent"
                >
                  Back
                </button>
              </div>
            </>
          )}

          {phase === "play" && (
            <>
              <div className="mb-5 flex items-baseline justify-between">
                <h3 className="font-semibold">
                  {level.company} <span className="text-subtle">· {level.year}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setPhase("select")}
                  className="text-xs text-subtle transition hover:text-foreground"
                >
                  quit level
                </button>
              </div>
              <CareerRunner key={runId} levelId={level.id} onComplete={handleComplete} />
            </>
          )}

          {phase === "result" && result && (
            <>
              <p
                className={`text-xs tracking-wider uppercase ${result.won ? "text-emerald-400" : "text-amber-400"}`}
              >
                {result.won ? "Level cleared" : "Not quite"}
              </p>
              <h3 className="mt-1 text-2xl font-bold">
                {result.score}
                <span className="text-base font-normal text-muted"> / 100</span>
              </h3>
              <p className="mt-2 text-muted">{result.detail}</p>

              {result.won && (
                <div className="mt-6">
                  <p className="text-xs tracking-wider text-subtle uppercase">
                    What actually happened
                  </p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {level.rewards.map((reward) => (
                      <li key={reward} className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-400">✓</span>
                        {reward}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {level.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={play}
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent"
                >
                  Replay
                </button>
                {levelIndex < careerLevels.length - 1 && (
                  <button
                    type="button"
                    onClick={() => start(levelIndex + 1)}
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Next role →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPhase("select")}
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent"
                >
                  Level select
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
