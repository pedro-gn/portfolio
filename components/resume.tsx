"use client";
import Link from "next/link";
import { Printer } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Emphasis } from "@/components/emphasis";
import profile from "@/data/profile.json";
import experience from "@/data/experience.json";
import skills from "@/data/skills.json";
import { projects } from "@/lib/projects";
export function Resume() {
  const {
    pick,
    messages: { ui, about },
  } = useLanguage();
  return (
    <main id="main" className="page-container inner-page resume-page">
      <div className="resume-tools">
        <Link className="back-link" href="/">
          ← {ui.home}
        </Link>
        <button type="button" className="button" onClick={() => window.print()}>
          <Printer size={14} />
          {ui.printResume}
        </button>
      </div>
      <header className="resume-header">
        <h1>{profile.name}</h1>
        <h2>{profile.role}</h2>
        <div className="resume-contacts">
          <a href={"mailto:" + profile.email}>{profile.email}</a>
          <a href={"tel:" + profile.phone.replace(/[^+\d]/g, "")}>
            {profile.phone}
          </a>
          <a href={profile.socials[0].url}>github.com/{profile.username}</a>
          <a href={profile.socials[1].url}>LinkedIn / pedrognp</a>
        </div>
      </header>
      <section className="resume-section">
        <h2>{ui.about}</h2>
        <p>{ui.resumeIntro}</p>
        {about.paragraphs.map((p, i) => (
          <p key={i}>
            <Emphasis text={p} />
          </p>
        ))}
      </section>
      <section className="resume-section">
        <h2>{ui.experience}</h2>
        {experience.map((item) => (
          <article key={item.id}>
            <h3>{item.company}</h3>
            <div className="resume-role">
              <strong>{pick(item.role)}</strong>
              <span>{pick(item.date)}</span>
            </div>
            <p>{pick(item.description)}</p>
          </article>
        ))}
      </section>
      <section className="resume-section">
        <h2>{ui.projects}</h2>
        {projects.map((project) => (
          <article key={project.id}>
            <h3>
              <Link href={project.url}>{project.name}</Link>
            </h3>
            <p>{pick(project.description)}</p>
            <p>{project.tags.join(" · ")}</p>
          </article>
        ))}
      </section>
      <section className="resume-section">
        <h2>{ui.skills}</h2>
        <ul className="resume-skills">
          {skills.map((group) => (
            <li key={group.id}>
              <strong>{pick(group.name)}:</strong> {group.items.join(" · ")}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
