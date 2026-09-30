"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const SOUND_KEY = "portfolio-click-sound";
const BURST_DURATION = 700;
const DOT_COUNT = 12;

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
    let audio: AudioContext | null = null;
    let clickBuffer: AudioBuffer | null = null;

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

        const radius = 4 + progress * 21;
        const opacity = 0.95 * (1 - progress) ** 0.8;
        const size = progress < 0.65 ? 2.5 : 2;
        context.fillStyle = `rgba(245, 245, 245, ${opacity})`;

        for (let dot = 0; dot < DOT_COUNT; dot += 1) {
          const angle = (dot / DOT_COUNT) * Math.PI * 2 - Math.PI / 2;
          context.fillRect(
            Math.round(burst.x + Math.cos(angle) * radius),
            Math.round(burst.y + Math.sin(angle) * radius),
            size,
            size,
          );
        }
      }

      if (bursts.length > 0) frame = window.requestAnimationFrame(draw);
    };

    const playSound = () => {
      if (!soundEnabledRef.current) return;

      try {
        audio ??= new AudioContext();
        if (audio.state === "suspended") void audio.resume().catch(() => {});

        if (!clickBuffer) {
          const length = Math.round(audio.sampleRate * 0.035);
          clickBuffer = audio.createBuffer(1, length, audio.sampleRate);
          const samples = clickBuffer.getChannelData(0);
          for (let index = 0; index < length; index += 1) {
            const decay = (1 - index / length) ** 3;
            samples[index] = (Math.random() * 2 - 1) * decay;
          }
        }

        const source = audio.createBufferSource();
        const filter = audio.createBiquadFilter();
        const gain = audio.createGain();
        source.buffer = clickBuffer;
        filter.type = "bandpass";
        filter.frequency.value = 1600;
        filter.Q.value = 0.7;
        gain.gain.value = 0.13;
        source.connect(filter).connect(gain).connect(audio.destination);
        source.start();
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

    const onPointerDown = (event: PointerEvent) => {
      if (event.button === 0)
        trigger(event.clientX, event.clientY, event.target);
    };

    const onClick = (event: MouseEvent) => {
      if (event.detail !== 0 || !(event.target instanceof Element)) return;
      const rect = event.target.getBoundingClientRect();
      trigger(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        event.target,
      );
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      if (audio) void audio.close();
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
