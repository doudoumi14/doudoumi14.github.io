"use client";

import {
  careerLevels,
  getProgressCount,
  getServerProgressCount,
  subscribeProgress,
} from "@/data/career-game";
import { Icons } from "@/components/Icons";
import { useState, useSyncExternalStore } from "react";
import { CareerGame } from "./CareerGame";

export function CareerGameLauncher() {
  const [open, setOpen] = useState(false);
  // This button is server-rendered, so progress is read through an external
  // store with a server snapshot of 0 rather than from localStorage at render.
  const cleared = useSyncExternalStore(
    subscribeProgress,
    getProgressCount,
    getServerProgressCount,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-4 rounded-2xl border border-dashed border-accent/50 bg-accent-soft p-5 text-left transition hover:border-accent hover:bg-accent-soft/70"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-white transition group-hover:scale-110">
          <Icons.play className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">Play my story instead of reading it</span>
          <span className="mt-0.5 block text-sm text-muted">
            Ten side-scrolling chapters — Algiers to Montreal, a degree rebuilt from zero,
            citizenship, four engineering roles, and an MBA still in progress.
          </span>
        </span>
        <span className="hidden shrink-0 text-sm text-subtle sm:block">
          {cleared}/{careerLevels.length}
        </span>
      </button>

      {open && <CareerGame onClose={() => setOpen(false)} />}
    </>
  );
}
