"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Emphasis } from "@/components/emphasis";
import { useLanguage } from "@/components/language-provider";
import { Footer } from "@/components/sections/footer";
import { galleryCaption, gallerySrc, type Project } from "@/lib/projects";

export function ProjectDetail({
  project,
  nextProject,
}: {
  project: Project;
  nextProject?: Project;
}) {
  const { messages, pick } = useLanguage();
  const d = messages.detail;
  const detail = project.detail;

  // A link is "real" only when it points somewhere; placeholder "#" / empty
  // values must never render as a live button that jumps to the top instead.
  const isLink = (url?: string) => Boolean(url) && url !== "#";
  const hasLive = isLink(detail.links.live);
  const hasCode = isLink(detail.links.code);

  return (
    <div className="shell" id="top">
      {/* DETAIL HERO */}
      <section className="detail">
        <div className="wrap">
          <Reveal as={Link} href="/#projects" className="crumb">
            <span>←</span> <span>{d.back}</span>
          </Reveal>

          <div className="d-hero">
            <Reveal as="p" className="d-kicker" delay={60}>
              {pick(detail.kicker)}
            </Reveal>
            <Reveal as="h1" className="d-title" delay={120}>
              {pick(project.title)}
            </Reveal>
            <Reveal as="p" className="d-lead" delay={180}>
              {pick(detail.lead)}
            </Reveal>
            {(hasLive || hasCode) && (
              <Reveal className="d-actions" delay={240}>
                {hasLive && (
                  <a
                    href={detail.links.live}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {d.live} <span className="arrow">↗</span>
                  </a>
                )}
                {hasCode && (
                  <a
                    href={detail.links.code}
                    className="btn btn-ghost"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {d.code}
                  </a>
                )}
              </Reveal>
            )}
          </div>

          <Reveal className="d-meta" delay={300}>
            {detail.meta.map((cell, i) => (
              <div className="cell" key={i}>
                <div className="k">{pick(cell.label)}</div>
                <div className="v">{pick(cell.value)}</div>
              </div>
            ))}
          </Reveal>

          <Reveal className="d-shot">
            {project.cover ? (
              <Image
                src={project.cover}
                alt={pick(project.title)}
                fill
                sizes="(max-width: 980px) 100vw, 900px"
                className="d-shot-img"
                priority
              />
            ) : (
              <span className="ph">{d.shot}</span>
            )}
          </Reveal>
        </div>
      </section>

      {/* DETAIL BODY */}
      <section style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="d-body">
            <div className="d-main">
              <Reveal className="d-block">
                <h2 className="d-h">{d.overview}</h2>
                {detail.overview.map((p, i) => (
                  <p key={i}>
                    <Emphasis text={pick(p)} />
                  </p>
                ))}
              </Reveal>

              {detail.features.length > 0 && (
                <Reveal className="d-block">
                  <h2 className="d-h">{d.features}</h2>
                  <ul className="feat">
                    {detail.features.map((f, i) => (
                      <li key={i}>
                        <strong>{pick(f.title)}</strong>
                        <span>{pick(f.desc)}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {detail.challenge.length > 0 && (
                <Reveal className="d-block">
                  <h2 className="d-h">{d.challenge}</h2>
                  {detail.challenge.map((p, i) => (
                    <p key={i}>
                      <Emphasis text={pick(p)} />
                    </p>
                  ))}
                </Reveal>
              )}

              {detail.gallery.length > 0 && (
                <Reveal className="d-block">
                  <h2 className="d-h">{d.gallery}</h2>
                  <div className="gallery">
                    {detail.gallery.map((item, i) => {
                      const src = gallerySrc(item);
                      const caption = pick(galleryCaption(item));
                      return (
                        <figure className="shot" key={i}>
                          {src ? (
                            <Image
                              src={src}
                              alt={caption}
                              fill
                              sizes="(max-width: 900px) 100vw, 440px"
                              className="shot-img"
                            />
                          ) : (
                            <figcaption className="ph">{caption}</figcaption>
                          )}
                        </figure>
                      );
                    })}
                  </div>
                </Reveal>
              )}
            </div>

            <aside className="d-aside">
              <Reveal className="aside-card">
                <p className="t">{d.stack}</p>
                <div className="stack">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
              {detail.impact.length > 0 && (
                <Reveal className="aside-card">
                  <p className="t">{d.impact}</p>
                  <div className="kpi">
                    {detail.impact.map((kpi, i) => (
                      <div className="row" key={i}>
                        <span className="n">
                          {kpi.value}
                          {kpi.unit && <span className="u">{kpi.unit}</span>}
                        </span>
                        <span className="l">{pick(kpi.label)}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </aside>
          </div>

          {nextProject && (
            <Reveal as={Link} href={nextProject.url} className="d-next">
              <div>
                <div className="label">{d.next}</div>
                <div className="name">{pick(nextProject.title)}</div>
              </div>
              <span className="go">→</span>
            </Reveal>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
