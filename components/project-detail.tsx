"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/components/language-provider";
import { Emphasis } from "@/components/emphasis";
import { galleryCaption, gallerySrc, type Project } from "@/lib/projects";
export function ProjectDetail({
  project,
  nextProject,
}: {
  project: Project;
  nextProject?: Project;
}) {
  const {
    messages: { detail: t, ui },
    pick,
  } = useLanguage();
  const detail = project.detail;
  const gallery = detail.gallery.filter((item) => Boolean(gallerySrc(item)));
  return (
    <main
      id="main"
      className="page-container inner-page project-detail"
      data-project={project.id}
    >
      <div className="page-heading">
        <Link className="back-link" href="/projects">
          ← {t.back}
        </Link>
        <div className="detail-kicker">{pick(detail.kicker)}</div>
        <h1>{pick(project.title)}</h1>
        <p>{pick(detail.lead)}</p>
        <div className="detail-actions">
          {detail.links.live && detail.links.live !== "#" && (
            <a
              className="button"
              href={detail.links.live}
              target="_blank"
              rel="noreferrer"
            >
              {t.live}
              <ArrowUpRight size={14} />
            </a>
          )}
          {detail.links.code && detail.links.code !== "#" && (
            <a
              className="button"
              href={detail.links.code}
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
              {t.code}
            </a>
          )}
        </div>
      </div>
      <dl className="detail-meta">
        {detail.meta.map((item, i) => (
          <div key={i}>
            <dt>{pick(item.label)}</dt>
            <dd>{pick(item.value)}</dd>
          </div>
        ))}
      </dl>
      {project.cover && (
        <div className="detail-cover-stage">
          <Image
            className="detail-cover-ambient"
            src={project.cover}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 664px"
            aria-hidden="true"
          />
          <Image
            className="detail-cover"
            src={project.cover}
            alt={pick(project.title)}
            width={1400}
            height={875}
            sizes="(max-width: 700px) 100vw, 664px"
            preload
          />
        </div>
      )}
      <section className="detail-block">
        <h2>{ui.differentiator}</h2>
        <p>{pick(project.differentiator)}</p>
      </section>
      <section className="detail-block">
        <h2>{t.overview}</h2>
        {detail.overview.map((text, i) => (
          <p key={i}>
            <Emphasis text={pick(text)} />
          </p>
        ))}
      </section>
      {detail.features.length > 0 && (
        <section className="detail-block">
          <h2>{t.features}</h2>
          <ul className="detail-features">
            {detail.features.map((feature, i) => (
              <li key={i}>
                <strong>{pick(feature.title)}</strong>
                <span>{pick(feature.desc)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {detail.challenge.length > 0 && (
        <section className="detail-block">
          <h2>{t.challenge}</h2>
          {detail.challenge.map((text, i) => (
            <p key={i}>
              <Emphasis text={pick(text)} />
            </p>
          ))}
        </section>
      )}
      {gallery.length > 0 && (
        <section className="detail-block">
          <h2>{t.gallery}</h2>
          <div className="detail-gallery">
            {gallery.map((item, i) => (
              <figure key={i}>
                <Image
                  src={gallerySrc(item)!}
                  alt={pick(galleryCaption(item))}
                  width={1400}
                  height={875}
                  sizes="(max-width: 700px) 100vw, 664px"
                />
                <figcaption>{pick(galleryCaption(item))}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <section className="detail-block">
        <h2>{t.stack}</h2>
        <ul className="tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </section>
      {detail.impact.length > 0 && (
        <section className="detail-block">
          <h2>{t.impact}</h2>
          <div className="detail-impact">
            {detail.impact.map((item, i) => (
              <div key={i}>
                <strong>
                  {item.value}
                  {item.unit}
                </strong>
                <span>{pick(item.label)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {nextProject && (
        <Link className="next-project" href={nextProject.url}>
          <span>
            <small>{t.next}</small>
            <strong>{nextProject.name}</strong>
          </span>
          <ArrowRight size={20} aria-label={ui.moreDetails} />
        </Link>
      )}
    </main>
  );
}
