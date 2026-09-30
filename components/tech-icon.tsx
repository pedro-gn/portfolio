import { Code2, CreditCard, FileText } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiSvelte,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiGo,
  SiPython,
  SiRedis,
  SiGraphql,
  SiDocker,
  SiGooglecloud,
  SiCloudflare,
  SiGithubactions,
  SiPrisma,
  SiDrizzle,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiFigma,
  SiPosthog,
  SiResend,
  SiBetterauth,
  SiVitest,
  SiVercel,
} from "react-icons/si";
import type { IconType } from "react-icons";
const technologies: Record<string, [IconType, string]> = {
  React: [SiReact, "#61dafb"],
  "Next.js": [SiNextdotjs, "#eeeeee"],
  TypeScript: [SiTypescript, "#4d9bdf"],
  Svelte: [SiSvelte, "#ff704b"],
  Tailwind: [SiTailwindcss, "#38bdf8"],
  Vite: [SiVite, "#b9a0ff"],
  Node: [SiNodedotjs, "#83bd65"],
  Go: [SiGo, "#53cde3"],
  Python: [SiPython, "#f2cb52"],
  Redis: [SiRedis, "#ef6868"],
  GraphQL: [SiGraphql, "#ed73be"],
  Docker: [SiDocker, "#369ff0"],
  GCP: [SiGooglecloud, "#ea9b57"],
  Cloudflare: [SiCloudflare, "#f6a04d"],
  "CI/CD": [SiGithubactions, "#76aaff"],
  Prisma: [SiPrisma, "#d2dce8"],
  Drizzle: [SiDrizzle, "#c5f274"],
  PostgreSQL: [SiPostgresql, "#78a9d3"],
  MongoDB: [SiMongodb, "#7ccc61"],
  Supabase: [SiSupabase, "#58d69e"],
  Figma: [SiFigma, "#d2a4fa"],
  PostHog: [SiPosthog, "#f1aa70"],
  Resend: [SiResend, "#eeeeee"],
  "Better Auth": [SiBetterauth, "#eeeeee"],
  Vitest: [SiVitest, "#93b561"],
  "Vercel Analytics": [SiVercel, "#eeeeee"],
};
export function TechIcon({ name }: { name: string }) {
  if (name === "Asaas")
    return <CreditCard size={18} color="#679bef" aria-hidden="true" />;
  if (name === "Gotenberg")
    return <FileText size={18} color="#c9d2e0" aria-hidden="true" />;
  const item = technologies[name];
  if (!item) return <Code2 size={18} aria-hidden="true" />;
  const [Icon, color] = item;
  return <Icon size={18} color={color} aria-hidden="true" />;
}
