"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const SOUND_KEY = "portfolio-click-sound";
const BURST_DURATION = 500;
const SPARK_COUNT = 12;
const SPARK_SIZE = 12;
const SPARK_RADIUS = 20;
const SPARK_SCALE = 1.2;

type Burst = { x: number; y: number; startedAt: number };

function subscribeToSoundPreference(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

const getServerSoundPreference = () => true;

export function ClickFeedback() {
  const {
    messages: { ui },
  } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundEnabledRef = useRef(true);
  const storedPreference = useSyncExternalStore(
    subscribeToSoundPreference,
    getStoredSoundPreference,
    getServerSoundPreference,
  );
  const [selectedPreference, setSelectedPreference] = useState<boolean | null>(
    null,
  );
  const soundEnabled = selectedPreference ?? storedPreference;

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bursts: Burst[] = [];
    let frame = 0;
    const audio = new Audio("/audio/click.mp3");
    audio.preload = "auto";
    audio.volume = 0.3;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(document.documentElement.clientWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const draw = (now: number) => {
      frame = 0;
      context.clearRect(
        0,
        0,
        document.documentElement.clientWidth,
        window.innerHeight,
      );

      for (let index = bursts.length - 1; index >= 0; index -= 1) {
        const burst = bursts[index];
        const progress = Math.min((now - burst.startedAt) / BURST_DURATION, 1);
        if (progress >= 1) {
          bursts.splice(index, 1);
          continue;
        }

        const eased = progress * (2 - progress);
        const radius = eased * SPARK_RADIUS * SPARK_SCALE;
        const length = SPARK_SIZE * (1 - eased);
        context.strokeStyle = "#fff";
        context.lineWidth = 2;

        for (let spark = 0; spark < SPARK_COUNT; spark += 1) {
          const angle = (spark / SPARK_COUNT) * Math.PI * 2;
          const directionX = Math.cos(angle);
          const directionY = Math.sin(angle);
          context.beginPath();
          context.moveTo(
            burst.x + radius * directionX,
            burst.y + radius * directionY,
          );
          context.lineTo(
            burst.x + (radius + length) * directionX,
            burst.y + (radius + length) * directionY,
          );
          context.stroke();
        }
      }

      if (bursts.length > 0) frame = window.requestAnimationFrame(draw);
    };

    const playSound = () => {
      if (!soundEnabledRef.current) return;

      try {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      } catch {
        // Browser audio restrictions should never prevent the visual feedback.
      }
    };

    const trigger = (x: number, y: number, target: EventTarget | null) => {
      if (
        !(target instanceof Element && target.closest("[data-sound-toggle]"))
      ) {
        playSound();
      }
      if (reducedMotion.matches) return;

      bursts.push({ x, y, startedAt: performance.now() });
      if (bursts.length > 12) bursts.shift();
      if (frame === 0) frame = window.requestAnimationFrame(draw);
    };

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.detail !== 0) {
        trigger(event.clientX, event.clientY, event.target);
        return;
      }
      const rect = event.target.getBoundingClientRect();
      trigger(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        event.target,
      );
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick, true);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      audio.pause();
    };
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    soundEnabledRef.current = next;
    setSelectedPreference(next);
    try {
      window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      // The preference remains active for this page when storage is unavailable.
    }
  };

  return (
    <>
      <button
        type="button"
        className="click-sound-toggle"
        data-sound-toggle
        aria-label={ui.clickSound}
        aria-pressed={soundEnabled}
        title={soundEnabled ? ui.muteClicks : ui.unmuteClicks}
        onClick={toggleSound}
      >
        {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </button>
      <canvas
        ref={canvasRef}
        className="click-feedback-canvas"
        aria-hidden="true"
      />
    </>
  );
}
