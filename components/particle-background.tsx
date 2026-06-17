"use client";

import { useEffect, useRef } from "react";

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

/** [r,g,b] in 0..1 from a #hex, for passing to GLSL uniforms. */
function rgb01(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const n =
    c.length === 3
      ? c.split("").map((x) => parseInt(x + x, 16))
      : [
          parseInt(c.slice(0, 2), 16),
          parseInt(c.slice(2, 4), 16),
          parseInt(c.slice(4, 6), 16),
        ];
  return [n[0] / 255, n[1] / 255, n[2] / 255];
}

/* ─────────────────────────────────────────────────────────────────────────
   PRIMARY: GPU signal field
   A near-black, domain-warped flow field rendered in a single fragment
   shader. Faint cyan contour lines breathe like an oscilloscope readout; the
   cursor displaces the field like a magnetic probe. Transparent everywhere
   the lines aren't, so the ambient CSS glows + grid read through underneath.
   Returns a cleanup fn, or null if WebGL is unavailable (→ canvas fallback).
   ──────────────────────────────────────────────────────────────────────── */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;     // device px, gl bottom-left origin
uniform float u_mouseOn;   // 0..1 presence/strength
uniform vec3  u_cyan;
uniform float u_deriv;     // 1.0 if fwidth is reliable, else 0.0
uniform float u_cell;      // grid cell size, device px (matches the CSS grid)

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 gp = fc / u_cell;             // grid space: 1 unit = 1 cell
  vec2 gf = abs(fract(gp) - 0.5);    // distance to nearest line, per axis

  // ~1px hairline, matching the site's structural grid. Width from fwidth
  // where trustworthy, clamped so it can't collapse on software rasterisers.
  float px = 1.0 / u_cell;
  float hw = clamp(mix(1.1 * px, max(fwidth(gp.x), fwidth(gp.y)) * 0.9, u_deriv),
                   0.6 * px, 2.5 * px);
  float lineX = 1.0 - smoothstep(0.0, hw, gf.x); // vertical lines
  float lineY = 1.0 - smoothstep(0.0, hw, gf.y); // horizontal lines
  float grid  = max(lineX, lineY);

  // radial fade so the instrument concentrates and edges fall to black —
  // mirrors the CSS grid's mask.
  float vig = smoothstep(1.05, 0.12, length((fc - 0.5 * u_res) / u_res.y));

  // ── cursor probe: the grid energises where you point ──
  float mdc = distance(fc, u_mouse) / u_cell;          // distance in cells
  float spot = u_mouseOn * exp(-mdc * mdc * 0.05);      // soft local glow
  // a focus reticle: the grid line on the cursor's row/column lights up,
  // fading out a few cells away so it reads as local, not a full crosshair.
  float colN = floor(u_mouse.x / u_cell + 0.5);
  float rowN = floor(u_mouse.y / u_cell + 0.5);
  float retic = u_mouseOn * exp(-mdc * mdc * 0.018) * (
      (1.0 - smoothstep(0.0, hw, abs(gp.x - colN))) +
      (1.0 - smoothstep(0.0, hw, abs(gp.y - rowN))));

  // ── signal pulses: the one cyan signal travels along the traces ──
  // Only a fraction of lines are active, each with its own phase/speed, so the
  // motion is sparse and slow — life on the instrument, not a light show.
  float rows = u_res.y / u_cell;
  float cols = u_res.x / u_cell;

  float vc = floor(gp.x + 0.5);                         // nearest vertical line
  float vActive = step(0.62, hash(vc * 1.7));
  float vSpeed = 0.14 + 0.22 * hash(vc * 5.1);
  float vY = fract(hash(vc * 3.3) + u_time * vSpeed) * (rows + 6.0) - 3.0;
  float vDy = gp.y - vY;
  // comet packet: a sharp head with a halo, plus a tail trailing where it came
  // from (below, since it travels up) → unmistakably a signal in motion.
  float vTail = step(vDy, 0.0) * 0.55 * exp(-vDy * vDy * 0.35);
  float vPulse = lineX * vActive * (exp(-vDy * vDy * 4.5) + 0.45 * exp(-vDy * vDy * 0.7) + vTail);

  float hr = floor(gp.y + 0.5);                         // nearest horizontal line
  float hActive = step(0.70, hash(hr * 2.3 + 11.0));
  float hSpeed = 0.14 + 0.22 * hash(hr * 6.3 + 7.0);
  float hX = fract(hash(hr * 4.7 + 3.0) + u_time * hSpeed) * (cols + 6.0) - 3.0;
  float hDx = gp.x - hX;
  float hTail = step(hDx, 0.0) * 0.55 * exp(-hDx * hDx * 0.35);
  float hPulse = lineY * hActive * (exp(-hDx * hDx * 4.5) + 0.45 * exp(-hDx * hDx * 0.7) + hTail);

  float pulse = max(vPulse, hPulse);

  // ── scan sweep: a slow cyan readout bar crosses the panel and the grid it
  // touches blooms. Bright and full-height, so the instrument stays legible
  // even across the coloured glows — and it's the headline "wow" moment. ──
  float sweepX = fract(u_time * 0.075) * (cols + 4.0) - 2.0;
  float sd = gp.x - sweepX;                              // signed cell distance
  float sweepCore = exp(-sd * sd * 0.7);                 // leading edge
  float sweepGlow = exp(-sd * sd * 0.05);                // trailing wash
  float sweep = grid * (sweepCore * 1.0 + sweepGlow * 0.28) + sweepCore * 0.05;
  // node flashes where the sweep crosses an intersection
  float nodes = lineX * lineY * sweepCore * 0.9;

  // ── compose: white structural grid + cyan signal ──
  // The static grid is neutral white (like the rest of the site); cyan is
  // reserved for the live signal — pulses, the sweep, the cursor glow/reticle.
  vec3 white = vec3(0.85, 0.89, 0.98);
  float gloHalo = max(1.0 - smoothstep(0.0, hw * 6.0, gf.x),
                      1.0 - smoothstep(0.0, hw * 6.0, gf.y));
  float wA = grid * 0.12 + gloHalo * 0.02;              // structural grid + faint bloom
  float cA = clamp(
      pulse * 0.9                 // signal packets travelling the traces
    + sweep                       // the scanning readout bar
    + nodes                       // intersection flashes under the sweep
    + grid * spot * 0.85          // grid energises under the cursor
    + spot * 0.07                 // soft bloom fills the probed cells
    + retic * 0.85,               // focus reticle on the cursor's row/column
    0.0, 1.0);

  vec3 col = mix(white, u_cyan, cA / (cA + wA + 1e-4));
  float a = clamp(wA + cA, 0.0, 1.0) * vig;

  gl_FragColor = vec4(col, a);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function runShader(
  canvas: HTMLCanvasElement,
  reduce: boolean,
): (() => void) | null {
  const gl = (canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      premultipliedAlpha: false,
    })) as WebGLRenderingContext | null;
  if (!gl) return null;

  const deriv = gl.getExtension("OES_standard_derivatives") ? 1 : 0;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // fullscreen triangle
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, "u_res"),
    time: gl.getUniformLocation(prog, "u_time"),
    mouse: gl.getUniformLocation(prog, "u_mouse"),
    mouseOn: gl.getUniformLocation(prog, "u_mouseOn"),
    cyan: gl.getUniformLocation(prog, "u_cyan"),
    deriv: gl.getUniformLocation(prog, "u_deriv"),
    cell: gl.getUniformLocation(prog, "u_cell"),
  };

  const css = getComputedStyle(document.documentElement);
  const cyan = rgb01((css.getPropertyValue("--accent") || "#5ee7e0").trim());
  gl.uniform3fv(u.cyan, cyan);
  gl.uniform1f(u.deriv, deriv);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  // Cap the render scale: sub-native is fine for a soft background and keeps
  // things at 60fps. The grid uses a fixed 64px cell to match the site's CSS
  // grid exactly, so the live layer and the structural grid stay aligned.
  const scale = Math.min(window.devicePixelRatio || 1, 1.5);
  const GRID_CSS_PX = 64;
  gl.uniform1f(u.cell, GRID_CSS_PX * scale);
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(u.res, canvas.width, canvas.height);
  }

  // smoothed cursor → a probe that trails rather than snaps
  const target = { x: -9999, y: -9999, on: 0 };
  const cur = { x: -9999, y: -9999, on: 0 };

  function onMove(e: MouseEvent) {
    target.x = e.clientX * scale;
    target.y = (h - e.clientY) * scale; // flip to GL bottom-left origin
    target.on = 1;
  }
  function onLeave() {
    target.on = 0;
  }

  let raf = 0;
  let start = 0;
  let running = true;

  function render(now: number) {
    if (!start) start = now;
    cur.on += (target.on - cur.on) * 0.06;
    if (target.on > 0.5) {
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
    }
    gl!.uniform1f(u.time, (now - start) / 1000);
    gl!.uniform2f(u.mouse, cur.x, cur.y);
    gl!.uniform1f(u.mouseOn, cur.on);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    if (running) raf = window.requestAnimationFrame(render);
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      window.cancelAnimationFrame(raf);
    } else if (!reduce) {
      running = true;
      raf = window.requestAnimationFrame(render);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduce) {
    // static frame — a beautiful still readout, no animation loop
    gl.uniform1f(u.time, 8.0);
    gl.uniform1f(u.mouseOn, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } else {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    raf = window.requestAnimationFrame(render);
  }

  return () => {
    running = false;
    window.cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   FALLBACK: interactive particle network (canvas 2D)
   Used only when WebGL is unavailable. Points drift, link to neighbours, and
   react to the cursor. Honors reduced motion.
   ──────────────────────────────────────────────────────────────────────── */

type Point = { x: number; y: number; vx: number; vy: number; r: number; hue: string };

const LINK = 132;
const MOUSE_R = 190;

function runParticles(canvas: HTMLCanvasElement, reduce: boolean): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

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
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
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
    const rect = canvas.getBoundingClientRect();
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
}

/**
 * Background layers behind the page. A GPU "signal field" shader is the
 * primary renderer; if WebGL is unavailable it falls back to an interactive
 * particle network. Both honour reduced motion.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cleanup: (() => void) | null = null;
    try {
      cleanup = runShader(canvas, reduce);
    } catch {
      cleanup = null;
    }
    if (!cleanup) cleanup = runParticles(canvas, reduce);

    return cleanup;
  }, []);

  return (
    <div className="bg-wrap" aria-hidden="true">
      <div className="bg-glow a" />
      <div className="bg-glow b" />
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="bg-noise" />
    </div>
  );
}
