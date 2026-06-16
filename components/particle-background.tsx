"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: string;
};

const LINK = 132; // max distance to draw a connecting line
const MOUSE_R = 190; // cursor influence radius

function rgbaFromHex(hex: string, a: number): string {
  const c = hex.replace("#", "");
  const n =
    c.length === 3
      ? c.split("").map((x) => parseInt(x + x, 16))
      : [
          parseInt(c.slice(0, 2), 16),
          parseInt(c.slice(2, 4), 16),
          parseInt(c.slice(4, 6), 16),
        ];
  return `rgba(${n[0]},${n[1]},${n[2]},${a})`;
}

/**
 * Interactive particle-network canvas that sits behind the page. Points drift,
 * link to nearby neighbours, and react to the cursor. Honors reduced motion.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const cyan = (css.getPropertyValue("--accent") || "#5ee7e0").trim();
    const violet = (css.getPropertyValue("--accent-2") || "#9d8cff").trim();

    let w = 0;
    let h = 0;
    let points: Point[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    function seed() {
      const target = Math.min(110, Math.floor((w * h) / 16000));
      points = [];
      for (let i = 0; i < target; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6,
          hue: Math.random() > 0.78 ? violet : cyan,
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function drawLinks(alphaScale: number, widthPx: number) {
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * alphaScale;
            ctx!.strokeStyle = rgbaFromHex(cyan, alpha);
            ctx!.lineWidth = widthPx;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
    }

    function drawPoints(alpha: number) {
      for (const p of points) {
        ctx!.fillStyle = rgbaFromHex(p.hue, alpha);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_R && d > 0.01) {
            const f = (1 - d / MOUSE_R) * 0.6;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
      }

      drawLinks(0.25, 0.7);

      if (mouse.active) {
        for (const p of points) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_R) {
            const alpha = (1 - d / MOUSE_R) * 0.7;
            ctx!.strokeStyle = rgbaFromHex(violet, alpha);
            ctx!.lineWidth = 0.8;
            ctx!.beginPath();
            ctx!.moveTo(mouse.x, mouse.y);
            ctx!.lineTo(p.x, p.y);
            ctx!.stroke();
          }
        }
      }

      drawPoints(0.9);
      raf = window.requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      drawLinks(0.25, 0.6);
      drawPoints(0.8);
    } else {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
      raf = window.requestAnimationFrame(frame);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="bg-wrap" aria-hidden="true">
      <div className="bg-glow a" />
      <div className="bg-glow b" />
      <div className="bg-grid" />
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="bg-noise" />
    </div>
  );
}
