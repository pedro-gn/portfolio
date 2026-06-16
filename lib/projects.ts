import projectsData from "@/data/projects.json";

export type Project = (typeof projectsData)[number];

export const projects: Project[] = projectsData;

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug);
}

/** The project that follows `slug` in the list, wrapping around at the end. */
export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.id === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}
