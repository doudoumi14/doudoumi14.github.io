"use client";

import { githubUrl, profile } from "@/data/profile";
import { BANNER, COMMAND_NAMES, runCommand } from "@/data/terminal";
import { useCallback, useEffect, useRef, useState } from "react";

interface Line {
  kind: "input" | "output" | "banner";
  text: string;
}

const INITIAL: Line[] = BANNER.map((text) => ({ kind: "banner", text }));

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const [input, setInput] = useState("");
  // History lives in a ref, not state: it is never rendered, and reading it
  // straight after a submit must not depend on a re-render having happened.
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // "/" opens the terminal from anywhere; Esc closes it and restores focus.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen(true);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else openerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  const submit = useCallback(
    (raw: string) => {
      const result = runCommand(raw);
      if (raw.trim()) history.current = [raw, ...history.current];
      historyIndex.current = -1;

      if (result.action === "clear") {
        setLines(INITIAL);
        return;
      }

      setLines((prev) => [
        ...prev,
        { kind: "input", text: raw },
        ...result.lines.map((text): Line => ({ kind: "output", text })),
      ]);

      if (result.action === "open-linkedin") window.open(profile.linkedin, "_blank", "noreferrer");
      if (result.action === "open-github") window.open(githubUrl, "_blank", "noreferrer");
      if (result.action === "open-email") window.location.href = `mailto:${profile.email}`;
    },
    [],
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      submit(input);
      setInput("");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const match = COMMAND_NAMES.find((name) => name.startsWith(input.trim().toLowerCase()));
      if (match) setInput(match);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const entries = history.current;
      if (entries.length === 0) return;
      const next =
        event.key === "ArrowUp"
          ? Math.min(historyIndex.current + 1, entries.length - 1)
          : Math.max(historyIndex.current - 1, -1);
      historyIndex.current = next;
      setInput(next === -1 ? "" : entries[next]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          openerRef.current = document.activeElement as HTMLElement;
          setOpen(true);
        }}
        className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full border border-line bg-card/90 px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur transition hover:border-accent hover:text-accent"
      >
        <span className="font-mono text-accent">&gt;_</span>
        <span className="hidden sm:inline">Explore in terminal</span>
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-xs text-subtle sm:inline">
          /
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
            onClick={(event) => event.stopPropagation()}
            className="flex h-[min(70vh,520px)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-line bg-[#0b0d12] font-mono text-sm shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-white/40">
                {profile.github}@portfolio — zsh
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto text-xs text-white/40 transition hover:text-white"
                aria-label="Close terminal"
              >
                esc
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 text-white/80">
              {lines.map((line, index) => (
                <p
                  key={index}
                  className={`whitespace-pre-wrap ${
                    line.kind === "banner"
                      ? "text-[color:var(--accent)]"
                      : line.kind === "input"
                        ? "text-white"
                        : ""
                  }`}
                >
                  {line.kind === "input" && <span className="text-[color:var(--accent)]">❯ </span>}
                  {line.text}
                </p>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="text-[color:var(--accent)]">❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/25"
                placeholder="try: whoami"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
