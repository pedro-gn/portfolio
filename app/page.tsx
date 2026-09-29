import { GitHubActivity } from "@/components/github-activity";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { UsesTeaser } from "@/components/uses";

export default function Home() {
  return (
    <main id="main" className="page-container">
      <Hero />
      <Skills />
      <Experience />
      <GitHubActivity />
      <Projects />
      <UsesTeaser />
      <Contact />
    </main>
  );
}
