# Project JSON generator prompt

Copy everything inside the code block below into your AI. Fill in the
"PROJECT FACTS" section with what you know about the project, then send it.
Paste the AI's JSON output as a new element inside the array in
`data/projects.json`.

---

````text
You generate ONE JSON object describing a portfolio project. The object is
pasted into an array in a Next.js portfolio (data/projects.json). Follow the
schema and rules EXACTLY and output ONLY the JSON object — no markdown, no
code fences, no commentary.

SCHEMA (one project object):
{
  "id": "kebab-case-slug",            // unique, lowercase, words-with-hyphens
  "featured": false,                  // true ONLY for the one big hero card; otherwise false
  "url": "/projects/<id>",            // must equal "/projects/" + id
  "tags": ["Tech", "Tech"],           // tech names, NOT translated
  "title": { "en": "...", "pt": "..." },        // short project title, e.g. "Helm — realtime ops dashboard"
  "description": { "en": "...", "pt": "..." },  // 1 sentence for the home card
  "detail": {
    "kicker": { "en": "...", "pt": "..." },     // "Category · Domain · Year", e.g. "Realtime · Logistics · 2024"
    "lead": { "en": "...", "pt": "..." },        // 1–2 sentence hook for the detail hero
    "links": { "live": "#", "code": "#" },       // real URLs if known, otherwise "#"
    "meta": [                                    // small fact cells; keep to ~4
      { "label": { "en": "Role", "pt": "Função" },     "value": { "en": "...", "pt": "..." } },
      { "label": { "en": "Year", "pt": "Ano" },        "value": { "en": "...", "pt": "..." } },
      { "label": { "en": "Team", "pt": "Time" },       "value": { "en": "...", "pt": "..." } },
      { "label": { "en": "Timeline", "pt": "Duração" }, "value": { "en": "...", "pt": "..." } }
    ],
    "overview": [                                // 1–2 paragraphs; REQUIRED (at least 1)
      { "en": "...", "pt": "..." }
    ],
    "features": [                                // 3–4 items; may be [] to hide the section
      { "title": { "en": "...", "pt": "..." }, "desc": { "en": "...", "pt": "..." } }
    ],
    "challenge": [                               // 1–2 paragraphs; may be [] to hide the section
      { "en": "...", "pt": "..." }
    ],
    "gallery": [                                 // 0–4 short captions; may be [] to hide the section
      { "en": "dashboard view", "pt": "visão do dashboard" }
    ],
    "impact": [                                  // 0–4 metrics; may be [] to hide the section
      { "value": "40", "unit": "%", "label": { "en": "...", "pt": "..." } }
    ]
  }
}

RULES:
- Output valid JSON only. Double quotes, no trailing commas, no comments.
- Every human-readable string is an object with "en" (English) and
  "pt" (Brazilian Portuguese) keys. Translate naturally, don't translate
  literally word-for-word. Tech names in "tags" and company/product names
  stay as-is and are NOT translated.
- "url" MUST be "/projects/" + the "id".
- Only "overview" and "challenge" paragraph strings may use **bold** markdown
  to emphasize a word or phrase (it renders as <strong>). Use it sparingly.
  Do NOT use any other HTML or markdown anywhere.
- "value" in impact is a short string and may include symbols like "<1",
  "3→1", "1.2k". Put any trailing symbol in "unit" ("%", "s", "ms", "+", "x")
  or set "unit" to "" if there is none.
- features, challenge, gallery, and impact arrays may be empty ([]) when there
  is nothing to say — the page hides those sections automatically. overview
  must have at least one paragraph.
- Do NOT invent metrics, dates, team sizes, or claims. Use only what I give
  you in PROJECT FACTS. If a fact is missing, write a truthful, generic value
  or leave that array empty rather than making something up.
- Keep copy concise and confident, matching a senior developer's portfolio.

PROJECT FACTS (fill these in; leave blank what you don't have):
- Project name / title:
- Slug (id):
- Featured (one big card)? yes/no:
- One-line description:
- Category / domain / year (for kicker):
- My role:
- Year:
- Team size:
- Timeline / duration:
- Live URL:
- Code/repo URL:
- Tech stack (tags):
- What problem it solved (for overview):
- Key features (3–4):
- Hardest technical challenge:
- Screens/views to show in gallery:
- Measurable results / impact metrics:

Now produce the single JSON object.
````
