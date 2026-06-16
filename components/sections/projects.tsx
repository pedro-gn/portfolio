"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/components/language-provider";
import projects from "@/data/projects.json";

export function Projects() {
  const { messages, pick } = useLanguage();
  const t = messages.projects;

  return (
    <section id="projects">
      <div className="wrap">
        <Reveal as="h2" className="section-title">
          {t.title}
        </Reveal>
        <Reveal as="p" className="section-sub">
          {t.sub}
        </Reveal>

        <div className="proj-grid">
          {projects.map((project, i) => {
            const title = pick(project.title);
            const [mark, ...rest] = title.split("—");
            const tagline = rest.join("—").trim();
            return (
            <Reveal
              key={project.id}
              as={Link}
              href={project.url}
              className={`proj${project.featured ? " feature" : ""}`}
              aria-label={title}
            >
              <div className="proj-thumb">
                <span className="num">[ {String(i + 1).padStart(2, "0")} ]</span>
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt={pick(project.title)}
                    fill
                    sizes="(max-width: 860px) 100vw, 50vw"
                    className="proj-img"
                  />
                ) : (
                  <div className="proj-cover" aria-hidden="true">
                    <span className="proj-cover__mark">{mark.trim()}</span>
                    {tagline && <span className="proj-cover__sub">{tagline}</span>}
                  </div>
                )}
              </div>
              <div className="proj-body">
                <div className="proj-head">
                  <h3>{pick(project.title)}</h3>
                  <span className="proj-arrow">↗</span>
                </div>
                <p>{pick(project.description)}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
