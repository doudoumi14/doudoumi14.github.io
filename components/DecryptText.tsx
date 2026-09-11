"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@*+=-";

// Scrambles then resolves each character left to right. Purely decorative:
// the whole thing is aria-hidden, so the accessible name must be supplied by
// the surrounding element (the h1 in Hero carries an explicit aria-label).
export function DecryptText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let settled = 0;
    let raf = 0;

    const tick = () => {
      frame.current += 1;
      // Reveal roughly one more character every third frame.
      if (frame.current % 3 === 0) settled += 1;

      const next = text
        .split("")
        .map((char, index) => {
          if (index < settled || char === " ") return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplay(next);
      if (settled <= text.length) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <span className={className} aria-hidden>
      {display}
    </span>
  );
}
