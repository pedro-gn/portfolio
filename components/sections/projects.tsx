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
        <Reveal as="p" className="eyebrow">
          {t.eyebrow}
        </Reveal>
        <Reveal as="h2" className="section-title">
          {t.title}
        </Reveal>
        <Reveal as="p" className="section-sub">
          {t.sub}
        </Reveal>

        <div className="proj-grid">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              as={Link}
              href={project.url}
              className={`proj${project.featured ? " feature" : ""}`}
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
                  <span className="ph">{t.thumb}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
