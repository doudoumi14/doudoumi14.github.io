"use client";

import { useRef, type ReactNode } from "react";

const MAX_TILT = 7;

// Perspective tilt that follows the pointer, plus a glare highlight tracking
// the cursor. Pointer-driven only, so touch and keyboard users get a plain
// card, and it is skipped entirely under reduced-motion.
export function TiltCard({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "a";
} & React.HTMLAttributes<HTMLElement> &
  Partial<Pick<HTMLAnchorElement, "href" | "target" | "rel">>) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useRef<boolean | null>(null);

  function isReduced() {
    if (reduced.current === null) {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return reduced.current;
  }

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || isReduced()) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * MAX_TILT * 2}deg) rotateY(${
      (px - 0.5) * MAX_TILT * 2
    }deg) translateY(-4px)`;
    el.style.setProperty("--glare-x", `${px * 100}%`);
    el.style.setProperty("--glare-y", `${py * 100}%`);
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`tilt-card ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
