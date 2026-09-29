"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LockKeyhole, Sprout } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/components/language-provider";
import { SectionTitle } from "@/components/section-title";
import { projects, type Project } from "@/lib/projects";
export function ProjectCard({ project }: { project: Project }) {
  const {
    pick,
    messages: { ui },
  } = useLanguage();
  const live = project.detail.links.live !== "#" && project.detail.links.live;
  const code = project.detail.links.code !== "#" && project.detail.links.code;
  return (
    <article className="project-card">
      <Link
        href={project.url}
        className="project-cover"
        aria-label={ui.caseStudy + ": " + project.name}
      >
        {project.cover ? (
          <Image
            src={project.cover}
            alt={pick(project.title)}
            fill
            sizes="(max-width: 600px) calc(100vw - 76px), 300px"
          />
        ) : (
          <div className="project-wordmark">
            <Sprout size={34} aria-hidden="true" />
            <span>{project.name}</span>
          </div>
        )}
        {project.featured && (
          <span className="project-ribbon">
            <span className="status-dot" />
            {ui.inProduction}
          </span>
        )}
      </Link>
      <div className="project-content">
        <div className="project-heading">
          <h3>
            <Link href={project.url}>{project.name}</Link>
          </h3>
          <div className="project-links">
            {live && (
              <a
                className="mini-button"
                href={live}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.live + ": " + project.name}
              >
                <ArrowUpRight size={12} aria-hidden="true" />
                Live
              </a>
            )}
            {code ? (
              <a
                className="mini-button"
                href={code}
                target="_blank"
                rel="noreferrer"
                aria-label={"GitHub: " + project.name}
              >
                <FaGithub aria-hidden="true" />
                GitHub
              </a>
            ) : (
              <span className="private-code" title={ui.privateCode}>
                <LockKeyhole size={13} aria-label={ui.privateCode} />
              </span>
            )}
          </div>
        </div>
        <p>{pick(project.description)}</p>
        <div className="project-tech">
          <strong>{ui.technologies}</strong>
          <ul className="tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <Link className="case-link" href={project.url}>
          {ui.caseStudy}
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
export function Projects({ fullPage = false }: { fullPage?: boolean }) {
  const {
    messages: { ui },
  } = useLanguage();
  return (
    <section
      id="projects"
      className={"section-block" + (fullPage ? " projects-page" : "")}
      aria-labelledby="projects-title"
    >
      {fullPage ? (
        <div className="page-heading">
          <Link className="back-link" href="/">
            ← {ui.home}
          </Link>
          <h1 id="projects-title">{ui.projects}</h1>
          <p>{ui.projectsIntro}</p>
        </div>
      ) : (
        <SectionTitle id="projects-title">{ui.myProjects}</SectionTitle>
      )}
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {!fullPage && (
        <div className="section-action">
          <Link className="button" href="/projects">
            {ui.allProjects}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
