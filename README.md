# Pedro Garcia — Portfolio

Bilingual Next.js 16 portfolio, redesigned from the [manixh](https://github.com/ig-imanish/manixh) visual reference. Figtree and JetBrains Mono are hosted locally. Reference attribution: LICENSE.manixh.

## Development

- Install: bun install
- Run: bun run dev
- Validate: bun run lint and bun run build
- Production: bun run start

## Pages

- / — profile, technologies, experience, projects and contact
- /projects — all projects
- /projects/[slug] — project case studies
- /uses — tools and practices
- /resume — printable resume, with browser Save as PDF support

## Content

Personal details and links: data/profile.json. Projects and case studies: data/projects.json. Experience: data/experience.json. Technologies: data/skills.json. UI translations: data/messages.json. Images: public/images/.

The first visit defaults to Portuguese. The language selector stores the preference locally. No analytics metrics are fabricated. Missing code/demo URLs are not rendered as links. The resume is generated from existing portfolio content.

See PRODUCT.md for audience and purpose, and DESIGN.md for the current visual system.

GitHub activity loads the public contribution history from github-contributions-api.jogruber.de (the API used by react-github-calendar). It has a loading state and a profile-link fallback when the service is unavailable; no token is required.
