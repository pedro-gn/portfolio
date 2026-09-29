# Pedro Garcia — Portfolio

The visual system follows [manixh](https://github.com/ig-imanish/manixh), adapted to Pedro's existing content. This replaces the previous instrument-panel design at the user's request.

## Layout

A centered 700px column, with 18px side padding on desktop and 20–25px on mobile. Sticky compact navigation. Profile with a 120px avatar, name, handle, current product, local clock, three bio lines, profile/contact cards and social buttons. Followed by two technology marquees, expandable experience timeline, horizontal project cards, toolkit link, contact card and footer.

## Colors and typography

- Background: #0b0d0e; surfaces: #1a1b1c and #232326.
- Primary text: #ffffff; body: #b3b3b3; supporting text: #999999.
- Dashed borders: #444444, brightening to #888888 on hover.
- Green marks current work; red marks completed roles. Each also has a text label.
- Figtree for UI and prose; JetBrains Mono for handles, clock and metadata. Fonts are hosted locally with OFL licenses.
- Profile name: 24px; section labels: 16px; body: 14px; compact project descriptions: 12px.

## Components

Section headings have four corner marks. Cards are transparent with thin dashed borders, without large radii or elevation. Buttons have compact dark surfaces, 2–4px corners and a subtle inset highlight. Project screenshots retain their own colors. Technology icons use their brand colors.

## Interaction and accessibility

Native details/summary for experience. Real links for live projects, case studies, email, phone, GitHub and LinkedIn. Missing live/code URLs and absent screenshots do not render as placeholder actions or galleries. Resume has print styles and a print/save-PDF action.

Portuguese and English are available everywhere, with a persisted preference. Main landmarks, skip link and visible keyboard focus are required. Marquees can be paused and are static, wrapped lists with reduced motion. Decorative duplicated content is hidden from assistive technology. There is no artificial loading delay.

## Source and adaptations

Reference license is retained in LICENSE.manixh. Original personal data, projects, screenshots and experience remain in data/ and public/images/. The reference's Twitter/Discord content is replaced by Pedro's GitHub and project-availability cards. Its visitor analytics are omitted because this portfolio has no analytics source. The toolkit uses Pedro's known skills; the resume uses his existing biography and experience.

The GitHub calendar uses live public contributions for pedro-gn, in the reference’s grayscale palette. Small screens have a bounded, keyboard-scrollable calendar. An unavailable API falls back to the profile link without invented counts.
