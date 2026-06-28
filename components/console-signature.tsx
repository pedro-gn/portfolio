"use client";

import { useEffect } from "react";
import profile from "@/data/profile.json";

/**
 * A signature left in the console for the visitor who opens DevTools — and for
 * this audience (engineering leads, CTOs, senior devs), many will. It's the
 * "show, don't tell" principle aimed at the one place they actually look:
 * proof of craft sits where they go to inspect it, not in a marketing line.
 * Fires once per page load; renders nothing.
 */
let printed = false;

export function ConsoleSignature() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    const chip =
      "background:#58c4b9;color:#04201e;font-weight:700;padding:3px 8px;border-radius:5px;font-family:monospace;";
    const role =
      "color:#aab2c5;font-family:monospace;padding-left:8px;";
    const dim = "color:#6b7488;font-family:monospace;line-height:1.6;";
    const signal = "color:#58c4b9;font-family:monospace;font-weight:600;";

    // eslint-disable-next-line no-console
    console.log(
      `%c ${profile.name.toUpperCase()} %c${profile.role.toLowerCase()} · designs and ships the whole product`,
      chip,
      role,
    );
    // eslint-disable-next-line no-console
    console.log(
      "%cBuilt from scratch — Next.js + a hand-written WebGL backdrop.\nNo template, no page builder. The thing you're inspecting is the portfolio.",
      dim,
    );
    // eslint-disable-next-line no-console
    console.log(`%cLike the build? → ${profile.email}`, signal);
  }, []);

  return null;
}
