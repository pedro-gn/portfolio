"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ExternalLink, LockKeyhole, Sprout } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { RiLock2Line } from "react-icons/ri";
import { useLanguage } from "@/components/language-provider";
import { SectionTitle } from "@/components/section-title";
import { projects, type Project } from "@/lib/projects";

function PrivateCode({
  id,
  label,
  description,
}: {
  id: string;
  label: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="private-code"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="private-code-trigger"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <RiLock2Line size={16} aria-hidden="true" />
      </button>
      {open && (
        <span className="private-code-tooltip" id={id} role="tooltip">
          <strong>{label}</strong>
          <span>{description}</span>
        </span>
      )}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const {
    pick,
    messages: { ui },
  } = useLanguage();
  const live = project.detail.links.live !== "#" && project.detail.links.live;
  const code = project.detail.links.code !== "#" && project.detail.links.code;
  const hostname = live
    ? new URL(live).hostname.replace(/^www\./, "")
    : project.name;
  return (
    <article className="project-card" data-project={project.id}>
      <Link
        href={project.url}
        className="project-cover"
        aria-label={ui.caseStudy + ": " + project.name}
      >
        {project.cover ? (
          <span className="project-preview">
            <Image
              className="project-preview-backdrop"
              src={project.cover}
              alt=""
              fill
              sizes="(max-width: 600px) calc(100vw - 76px), 300px"
              aria-hidden="true"
            />
            <span className="project-browser">
              <span className="project-browser-toolbar" aria-hidden="true">
                <span className="project-browser-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="project-browser-address">
                  <LockKeyhole size={6} />
                  {hostname}
                </span>
                <span className="project-browser-menu">···</span>
              </span>
              <span className="project-browser-viewport">
                <Image
                  src={project.cover}
                  alt={pick(project.title)}
                  fill
                  sizes="(max-width: 600px) calc(100vw - 110px), 268px"
                />
              </span>
            </span>
          </span>
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
          <div className="project-name">
            <h3>
              <Link href={project.url}>{project.name}</Link>
            </h3>
            {!code && (
              <PrivateCode
                id={`private-${project.id}`}
                label={ui.privateCode}
                description={ui.privateCodeDescription}
              />
            )}
          </div>
          <div className="project-links">
            {live && (
              <a
                className="mini-button"
                href={live}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.live + ": " + project.name}
              >
                <ExternalLink size={12} aria-hidden="true" />
                Live
              </a>
            )}
            {code && (
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
        <h1 className="section-title" id="projects-title">
          <span>{ui.myProjects}</span>
        </h1>
      ) : (
        <SectionTitle id="projects-title">{ui.myProjects}</SectionTitle>
      )}
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {fullPage && (
        <div className="section-action">
          <Link className="back-link" href="/">
            ← {ui.home}
          </Link>
        </div>
      )}
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
