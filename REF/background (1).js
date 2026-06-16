/* Interactive particle-network background.
   Points drift slowly, connect with lines when near, and react to the cursor.
   Sits behind everything; respects prefers-reduced-motion. */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, y: -9999, active: false };

  // accent colors pulled from CSS variables so they track the theme
  const css = getComputedStyle(document.documentElement);
  const cyan = (css.getPropertyValue('--accent') || '#5ee7e0').trim();
  const violet = (css.getPropertyValue('--accent-2') || '#9d8cff').trim();

  let points = [];

  function rgbaFromHex(hex, a) {
    const c = hex.replace('#', '');
    const n = c.length === 3
      ? c.split('').map((x) => parseInt(x + x, 16))
      : [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
    return `rgba(${n[0]},${n[1]},${n[2]},${a})`;
  }

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

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

  const LINK = 132;       // max distance to draw a connecting line
  const MOUSE_R = 190;    // cursor influence radius

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;

      // gentle cursor attraction
      if (mouse.active) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_R && d > 0.01) {
          const f = (1 - d / MOUSE_R) * 0.6;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
      }
    }

    // connecting lines
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.5;
          ctx.strokeStyle = rgbaFromHex(cyan, alpha * 0.5);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // links from cursor to nearby points (the interactive moment)
    if (mouse.active) {
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_R) {
          const alpha = (1 - d / MOUSE_R) * 0.7;
          ctx.strokeStyle = rgbaFromHex(violet, alpha);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
    }

    // points
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      ctx.fillStyle = rgbaFromHex(p.hue, 0.9);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  function staticRender() {
    // single non-animated frame for reduced-motion users
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.25;
          ctx.strokeStyle = rgbaFromHex(cyan, alpha);
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      ctx.fillStyle = rgbaFromHex(p.hue, 0.8);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => { mouse.active = false; mouse.x = mouse.y = -9999; });

  resize();
  if (reduce) staticRender(); else frame();
})();
