"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   PRIMARY: static instrument grid (GPU)
   A near-black structural grid rendered once in a single fragment shader —
   faint neutral hairlines that fade to black at the edges (a vignette mask),
   matching the site's 64px rhythm. No animation, no cursor, no signal sweep:
   the surface is quiet and reads as a precise panel, not a light show.
   Transparent everywhere the lines aren't, so the ambient CSS wash shows
   through. Returns a cleanup fn, or null if WebGL is unavailable (→ fallback).
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
uniform vec3  u_line;
uniform float u_deriv;     // 1.0 if fwidth is reliable, else 0.0
uniform float u_cell;      // grid cell size, device px (matches the CSS grid)

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

  // radial fade so the grid concentrates centre-stage and edges fall to black.
  float vig = smoothstep(1.05, 0.18, length((fc - 0.5 * u_res) / u_res.y));

  float a = grid * 0.05 * vig;       // a single, very faint static grid
  gl_FragColor = vec4(u_line, a);
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

function runShader(canvas: HTMLCanvasElement): (() => void) | null {
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
    line: gl.getUniformLocation(prog, "u_line"),
    deriv: gl.getUniformLocation(prog, "u_deriv"),
    cell: gl.getUniformLocation(prog, "u_cell"),
  };

  // A neutral, slightly cool hairline — the structural grid is never the accent.
  gl.uniform3fv(u.line, [0.74, 0.79, 0.88]);
  gl.uniform1f(u.deriv, deriv);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  // Cap the render scale: sub-native is fine for a soft background. The grid
  // uses a fixed 64px cell to match the site's CSS rhythm exactly.
  const scale = Math.min(window.devicePixelRatio || 1, 1.5);
  const GRID_CSS_PX = 64;
  gl.uniform1f(u.cell, GRID_CSS_PX * scale);

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(u.res, canvas.width, canvas.height);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  draw();
  window.addEventListener("resize", draw);

  return () => {
    window.removeEventListener("resize", draw);
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   FALLBACK: static grid (canvas 2D)
   Used only when WebGL is unavailable. Same faint, motionless instrument grid,
   drawn once and redrawn on resize.
   ──────────────────────────────────────────────────────────────────────── */

function runGrid2D(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const CELL = 64;

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, w, h);

    // radial vignette mask so edges fall to black, mirroring the shader
    const grad = ctx!.createRadialGradient(
      w / 2,
      h / 2,
      0,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.62,
    );
    grad.addColorStop(0, "rgba(189,202,224,0.05)");
    grad.addColorStop(1, "rgba(189,202,224,0)");

    ctx!.strokeStyle = grad;
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    for (let x = CELL; x < w; x += CELL) {
      ctx!.moveTo(x + 0.5, 0);
      ctx!.lineTo(x + 0.5, h);
    }
    for (let y = CELL; y < h; y += CELL) {
      ctx!.moveTo(0, y + 0.5);
      ctx!.lineTo(w, y + 0.5);
    }
    ctx!.stroke();
  }

  draw();
  window.addEventListener("resize", draw);
  return () => window.removeEventListener("resize", draw);
}

/**
 * Static instrument-grid backdrop. A GPU grid shader is the primary renderer;
 * if WebGL is unavailable it falls back to an equivalent canvas-2D grid. There
 * is no animation, so reduced-motion needs no special case.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | null = null;
    try {
      cleanup = runShader(canvas);
    } catch {
      cleanup = null;
    }
    if (!cleanup) cleanup = runGrid2D(canvas);

    return cleanup;
  }, []);

  return (
    <div className="bg-wrap" aria-hidden="true">
      <div className="bg-glow a" />
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="bg-noise" />
    </div>
  );
}
