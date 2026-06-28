---
name: Pedro Garcia — Portfolio
description: Sharp, precise, technical portfolio for a fullstack developer — dark instrument-panel aesthetic.
colors:
  bg: "#07080d"
  bg-soft: "#0c0e16"
  panel: "#10131e"
  panel-2: "#141826"
  ink: "#eef1f7"
  ink-soft: "#aab2c5"
  ink-mute: "#828ba0"
  accent: "#58c4b9"
  accent-2: "#8f93c4"
  accent-ink: "#04201e"
  status-online: "#4ade80"
  line: "#ffffff14"
  line-2: "#ffffff24"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(38px, 6vw, 76px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(34px, 5vw, 56px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sm: "7px"
  md: "10px"
  lg: "16px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "32px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "14px 26px"
  button-ghost:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 26px"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.lg}"
    padding: "24px"
  tag:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "5px 11px"
---

# Design System: Pedro Garcia — Portfolio

## 1. Overview

**Creative North Star: "The Instrument Panel"**

This is a precision tool read in low light. The surface is near-black (`#07080d`), the
labels are exacting monospace, and a single signal-teal color (`#58c4b9`) acts
as the readout — the one thing that glows. Everything is placed with intent; nothing is
decorative. The system should feel like it was engineered by the kind of developer it
represents: sharp, precise, technical, confident without raising its voice.

Depth comes from tonal layering, not heavy chrome — a stack of dark panels lifted a few
percent off the background, separated by hairline `rgba(255,255,255,0.08)` rules and the
occasional accent glow. Type carries the hierarchy: a tight grotesque display
(Space Grotesk) for headings, a humanist sans (Sora) for reading, and a mono
(JetBrains Mono) reserved for labels and metadata — the instrument's printed legends.
Motion is **tactile and responsive**: surfaces lift on hover, the accent pulses where
status matters, but choreography never gets in the way of the work.

The system explicitly rejects the **generic-AI / template** look (cookie-cutter card
grids, decorative gradients), **corporate-SaaS sterility**, **flashy overdesign**, and
**clutter**. Restraint is the senior signal.

**Key Characteristics:**
- Near-black instrument surface with tonal panel layering, not flat black.
- One signal-teal color; a muted periwinkle is a rare secondary accent only.
- Monospace as the labeling system — metadata, eyebrows, nav, tags.
- Hairline borders and soft glows over hard shadows and heavy chrome.
- Tactile, responsive motion: lift, glow, pulse — never gratuitous.

## 2. Colors

A near-black instrument surface where a single teal signal does almost all the talking,
with a muted periwinkle held in reserve.

### Primary
- **Signal Teal** (`#58c4b9`): The one readout color. Primary buttons, links on hover,
  status nodes, glow accents, active states, the brand dot. Calmed from an electric cyan
  for a more serious register, then lifted a touch for a crisper readout; its rarity is
  its power.
- **Signal Ink** (`#04201e`): The near-black teal used *as text on top of* Signal Teal
  (primary button label, active language pill) so the teal fills read crisply.

### Secondary
- **Circuit Periwinkle** (`#8f93c4`): A rare, desaturated second accent. Alternate
  skill-card icons, the far end of the timeline gradient, occasional dual-tone moments.
  Never competes with the teal for the same surface; it is the exception, not a co-lead.

### Neutral
- **Void** (`#07080d`): The body background — near-black, the unlit panel.
- **Soft Void** (`#0c0e16`): The next layer up; gradient bottoms, recessed fills.
- **Panel** (`#10131e`): Card and surface fill, the lit instrument face.
- **Panel Raised** (`#141826`): The lifted layer for thumbnails and inner surfaces.
- **Ink** (`#eef1f7`): Primary text and headings — high-contrast on Void.
- **Ink Soft** (`#aab2c5`): Body copy and supporting text on dark surfaces.
- **Ink Mute** (`#828ba0`): Metadata, captions, footer — lowest readable tier.
- **Hairline** (`rgba(255,255,255,0.08)` / `.14`): Borders, dividers, panel edges.

### Status
- **Online Green** (`#4ade80`): Availability pulse only. Not part of the brand palette;
  a functional signal that someone is reachable.

### Named Rules
**The One Signal Rule.** The teal is the instrument's single readout. Use it on ≤10% of
any screen — primary action, the live status, the one thing the eye should land on. The
moment two things glow teal, neither reads as the signal.

**The Contrast Floor Rule.** Body copy uses Ink Soft (`#aab2c5`) or lighter on dark
panels — never Ink Mute (`#828ba0`) for anything you expect to be read. Ink Mute is for
labels and metadata only. Verify ≥4.5:1 against the actual panel it sits on.

## 3. Typography

**Display Font:** Space Grotesk (fallback: sans-serif)
**Body Font:** Sora (fallback: system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (fallback: monospace)

**Character:** A tight, slightly mechanical grotesque for headings pairs with a warmer
humanist sans for reading and a true monospace for the instrument's labels. The contrast
is geometric-display vs. humanist-body vs. mono-legend — three distinct jobs, never
competing.

### Hierarchy
- **Display** (600, `clamp(38px, 6vw, 76px)`, line-height 1.06, tracking -0.025em):
  Hero headline only. `text-wrap: balance`.
- **Headline** (600, `clamp(34px, 5vw, 56px)`, tracking -0.02em): Section titles.
- **Title** (600, ~21px, tracking -0.01em): Card headings, timeline roles, project names.
- **Body** (400, 17px, line-height 1.6): Reading copy in Ink Soft. Cap measure at
  ~65–75ch (about 560–620px at this size).
- **Label** (400/500, 11.5–13px, tracking 0.1–0.2em, often uppercase): JetBrains Mono.
  Nav links, eyebrows, tags, metadata keys, kickers — the instrument's printed legends.

### Named Rules
**The Mono-Is-Metadata Rule.** JetBrains Mono labels structure, never prose. If it's a
sentence the visitor reads for meaning, it's Sora. If it's a legend, a tag, a timestamp,
or a nav item, it's mono.

**The Tracking Floor Rule.** Display headings never go tighter than -0.04em. The current
-0.025em is correct; do not crush it further "for effect."

## 4. Elevation

The system is **tonally layered, not shadowed**. Depth is built by stacking near-black
panels at rising lightness (Void → Soft Void → Panel → Panel Raised) and separating them
with hairline white borders. Hard drop shadows are reserved for one job: the hover-lift on
interactive cards. Accent **glow** (blurred teal radial) carries emphasis where a shadow
would feel heavy.

### Shadow Vocabulary
- **Hover Lift** (`box-shadow: 0 30px 60px -24px rgba(0,0,0,0.6)`): Project and "next"
  cards on hover, paired with a `translateY(-6px)`. The only structural shadow.
- **Primary Lift** (`background` brightens to `#73d1c6` + `box-shadow: 0 16px 34px -18px
  rgba(0,0,0,0.8)`, `translateY(-2px)`): the readout lighting up on primary-button hover.
- **Accent Glow** (blurred teal radial, e.g. `rgba(88,196,185,0.07–0.09)`): the soft wash
  behind the hero and project-cover marks; emphasis without chrome.
- **Status Pulse** (animated `box-shadow` ring): The online dot only.

### Named Rules
**The Glow-Not-Chrome Rule.** Emphasis is a soft accent glow or a tonal lift, never a
hard 2024-era drop shadow on a resting surface. Surfaces are flat at rest; depth is a
response to hover, focus, or status.

## 5. Components

### Buttons
- **Shape:** Gently squared (10px radius).
- **Primary:** Signal Teal fill, Signal Ink label, mono 14px. Padding 14px 26px.
- **Ghost:** Transparent on Void, hairline border (`line-2`), Ink label.
- **Hover / Focus:** Primary lifts `translateY(-2px)`, brightens to `#73d1c6`, and gains
  the Primary Lift shadow; ghost's border and label shift to teal. The trailing `↗` arrow
  nudges up-right on hover.

### Chips / Tags
- **Style:** Mono 11.5–12.5px, Ink Soft on a faint `rgba(255,255,255,0.04)` fill with a
  hairline border, 7px radius. Used for tech stacks and skill chips.
- **State:** Border brightens to `line-2` when the parent card is hovered.

### Cards / Containers
- **Corner Style:** 16px (skill/stat cards), up to 18px (project cards). **Ceiling: 18px.**
- **Background:** `linear-gradient(180deg, Panel, Soft Void)` or flat Panel.
- **Shadow Strategy:** Flat at rest; Hover Lift shadow + `translateY(-6px)` on
  interactive cards. See Elevation.
- **Border:** Hairline `line`, brightening to `line-2` on hover.
- **Internal Padding:** 22–28px.

### Inputs / Fields
- No form inputs exist in the current build. When added: Panel fill, hairline border,
  10px radius, focus = teal border + faint teal glow ring (not a browser default
  outline). Maintain the Contrast Floor for placeholder text (≥4.5:1, not Ink Mute).

### Navigation
- **Style:** Fixed top bar, transparent until scrolled, then `rgba(7,8,13,0.72)` with a
  14px backdrop blur and a hairline bottom border. Links are mono 13px, Ink Soft → Ink on
  hover with a faint fill. CTA link carries a border that turns teal on hover.
- **Mobile:** Non-CTA links hide below 900px (CTA + language picker remain).

### Signature Components
- **Status Pill:** Mono micro-label with an animated green pulse dot — "available for
  work" as a live readout, not a static badge.
- **Timeline:** Vertical hairline with teal→periwinkle gradient, teal glow nodes; the
  experience section's instrument trace.
- **Language Picker:** Pill toggle (EN / PT); active state is a teal fill with Signal Ink
  text. Bilingual parity is a brand requirement.

## 6. Do's and Don'ts

### Do:
- **Do** keep the teal as the single signal — primary action, live status, the one focal
  glow. Obey **The One Signal Rule** (≤10% of any screen).
- **Do** build depth by tonal panel layering and hairline borders; reserve shadow for
  hover-lift and glow for accents.
- **Do** use JetBrains Mono for labels, tags, nav, and metadata only — prose is Sora.
- **Do** keep card radii ≤18px and button radii at 10px.
- **Do** provide a genuine `prefers-reduced-motion` alternative for the particle
  background, glow drift, pulse, and reveal transitions.
- **Do** verify body text hits ≥4.5:1 on its actual panel; lift toward Ink before
  reaching for Ink Mute.

### Don't:
- **Don't** use **gradient text** (`background-clip: text` over a gradient). It reads as
  generic-AI and is banned outright — emphasize with weight, size, or the solid teal.
- **Don't** stack a tracked-uppercase **eyebrow above every section**. One named kicker as
  a deliberate device is voice; an eyebrow on each section is AI grammar. Vary the cadence.
- **Don't** ship **numbered section markers (01 / 02 / 03)** as default scaffolding unless
  the section genuinely *is* an ordered sequence.
- **Don't** use **repeating-linear-gradient stripe** fills as decorative thumbnail/section
  backgrounds — replace placeholders with real screenshots or a flat tonal panel.
- **Don't** let it drift **corporate-SaaS**, **flashy/overdesigned**, or **cluttered**:
  no hero-metric template, no neon overload, no airless walls of text.
- **Don't** crush display tracking past -0.04em, and don't push the hero clamp past ~76px.
- **Don't** add a second glowing color next to the teal, or promote the periwinkle to a co-lead.
