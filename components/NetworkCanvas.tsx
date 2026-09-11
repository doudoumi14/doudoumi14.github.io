"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DISTANCE = 150;
const POINTER_RADIUS = 190;

// A drifting node/edge field behind the hero — a nod to the network
// infrastructure work, and it reacts to the pointer so the header feels alive.
export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999 };
    let nodes: Node[] = [];
    let frame = 0;
    let running = true;
    let width = 0;
    let height = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale the node count to the area so phones do not render a soup of dots.
      const count = Math.round(Math.min(70, Math.max(22, (width * height) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1,
      }));
    }

    function readColor() {
      const styles = getComputedStyle(document.documentElement);
      return styles.getPropertyValue("--accent").trim() || "#3b5bdb";
    }

    let accent = readColor();

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      for (const node of nodes) {
        if (!reduced) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;

          ctx!.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.22;
          ctx!.strokeStyle = accent;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }

        // Nodes near the pointer brighten and link to it.
        const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        const near = pd < POINTER_RADIUS;
        if (near) {
          ctx!.globalAlpha = (1 - pd / POINTER_RADIUS) * 0.5;
          ctx!.strokeStyle = accent;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(pointer.x, pointer.y);
          ctx!.stroke();
        }

        ctx!.globalAlpha = near ? 0.9 : 0.45;
        ctx!.fillStyle = accent;
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, near ? a.r * 1.6 : a.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    // Stop animating when the tab is hidden so it costs nothing in the background.
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        accent = readColor();
        frame = requestAnimationFrame(draw);
      }
    }

    const themeObserver = new MutationObserver(() => {
      accent = readColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    frame = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />;
}
