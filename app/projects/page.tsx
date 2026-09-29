import { Projects } from "@/components/sections/projects";
export const metadata = { title: "Projetos — Pedro Garcia" };
export default function ProjectsPage() {
  return (
    <main id="main" className="page-container">
      <Projects fullPage />
    </main>
  );
}
