import projectsData from "@/data/projects.json";
import type { Locale, Localized } from "@/lib/i18n";

/** A single impact readout in a project's case study (e.g. "99.9" / "%"). */
export type ProjectImpact = {
  value: string;
  unit?: string;
  label: Localized;
};

/**
 * One case-study gallery shot. Two shapes are accepted so older entries don't
 * have to be migrated all at once:
 *   - legacy: the localized caption itself (`{ en, pt }`)
 *   - current: `{ caption, src? }`, where `src` points at a real screenshot
 *     under `/public`. While `src` is absent the UI renders a deliberate
 *     "pending" tile keyed by the caption — dropping the file in lights it up.
 * Use `galleryCaption` / `gallerySrc` below to read either shape safely.
 */
export type GalleryItem =
  | Record<Locale, string>
  | { src?: string; caption: Localized };

/** The caption of a gallery item, whichever shape it's stored in. */
export function galleryCaption(item: GalleryItem): Localized {
  return "caption" in item ? item.caption : item;
}

/** The screenshot path of a gallery item, or `undefined` if none yet. */
export function gallerySrc(item: GalleryItem): string | undefined {
  return "caption" in item ? item.src : undefined;
}

type RawProject = (typeof projectsData)[number];

/**
 * The shape is inferred from the JSON, with a few overrides. Every project
 * ships `detail.impact: []`, which TypeScript widens to `never[]`; pin it to
 * `ProjectImpact[]`. Gallery entries vary in shape (see `GalleryItem`) and
 * `cover` is optional (some projects have no hero shot yet), so pin both.
 */
export type Project = Omit<RawProject, "detail" | "cover"> & {
  cover?: string;
  detail: Omit<RawProject["detail"], "impact" | "gallery"> & {
    impact: ProjectImpact[];
    gallery: GalleryItem[];
  };
};

export const projects: Project[] = projectsData as Project[];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug);
}

/** The project that follows `slug` in the list, wrapping around at the end. */
export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.id === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}
