"use client";

import { useEffect } from "react";

// Adds `.is-visible` to every `.reveal` element the first time it scrolls into
// view. One observer for the whole page rather than one per element, and it
// disconnects once everything has fired.
export function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (elements.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    let remaining = elements.length;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
          remaining -= 1;
        }
        if (remaining <= 0) observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
