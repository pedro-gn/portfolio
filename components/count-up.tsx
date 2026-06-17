"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric readout up from zero the first time it scrolls into view —
 * the instrument calibrating its display. Renders the final value on the
 * server and for no-JS / reduced-motion clients, so it's never blank or stuck
 * at zero. Parses the decimal precision from the source string ("99.9" → 1dp).
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const target = parseFloat(value);
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let fired = false;
    const DURATION = 1100;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting || fired) return;
        fired = true;
        obs.disconnect();

        let startTime = 0;
        const tick = (now: number) => {
          if (!startTime) startTime = now;
          const p = Math.min((now - startTime) / DURATION, 1);
          const eased = 1 - Math.pow(1 - p, 4); // ease-out-quart
          if (p < 1) {
            setDisplay((target * eased).toFixed(decimals));
            raf = window.requestAnimationFrame(tick);
          } else {
            setDisplay(value); // settle on the exact source string
          }
        };

        setDisplay((0).toFixed(decimals));
        raf = window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [target, decimals, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
