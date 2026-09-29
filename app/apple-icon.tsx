import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0d0e",
        color: "#fff",
        width: "100%",
        height: "100%",
        fontSize: 104,
        fontWeight: 700,
      }}
    >
      P
    </div>,
    size,
  );
}
