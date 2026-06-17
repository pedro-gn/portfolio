import { ImageResponse } from "next/og";

// iOS home-screen icon. iOS applies its own rounded-corner mask, so this is
// rendered full-bleed (square, no own corner radius) over the instrument-panel
// background, with the same signal-cyan "P" monogram as app/icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = `
<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="t" x1="90" y1="0" x2="90" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#14182a"/>
      <stop offset="1" stop-color="#07080d"/>
    </linearGradient>
    <radialGradient id="g" cx="90" cy="84" r="62" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5ee7e0" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#5ee7e0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="180" height="180" fill="url(#t)"/>
  <circle cx="90" cy="84" r="58" fill="url(#g)"/>
  <g stroke="#5ee7e0" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M64 50 H92 a23 23 0 0 1 0 46 H64"/>
    <path d="M64 50 V132"/>
  </g>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          width={180}
          height={180}
          src={`data:image/svg+xml,${encodeURIComponent(mark)}`}
        />
      </div>
    ),
    { ...size }
  );
}
