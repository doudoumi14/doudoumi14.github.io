"use client";

import { useEffect, useRef, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEasterEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress.current = key === SEQUENCE[progress.current] ? progress.current + 1 : 0;

      if (progress.current === SEQUENCE.length) {
        progress.current = 0;
        setUnlocked(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    const timer = setTimeout(() => setUnlocked(false), 6000);
    return () => clearTimeout(timer);
  }, [unlocked]);

  if (!unlocked) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 rounded-xl border border-accent bg-card/95 p-4 shadow-2xl backdrop-blur"
    >
      <p className="text-xs font-semibold tracking-wider text-accent uppercase">
        Achievement unlocked
      </p>
      <p className="mt-1 font-bold">Curiosity — level 10</p>
      <p className="mt-1 text-sm text-muted">
        You typed the Konami code on an engineer&apos;s portfolio. That is exactly the kind of
        thing I look for in a teammate. Press{" "}
        <kbd className="rounded border border-line px-1 font-mono text-xs">/</kbd> for the
        terminal.
      </p>
    </div>
  );
}
