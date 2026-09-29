"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionTitle } from "@/components/section-title";
import { TechIcon } from "@/components/tech-icon";
import skills from "@/data/skills.json";
export function UsesTeaser() {
  const {
    messages: { ui },
  } = useLanguage();
  return (
    <section className="section-block uses-teaser">
      <SectionTitle>/uses</SectionTitle>
      <p>{ui.usesIntro}</p>
      <Link className="button" href="/uses">
        {ui.myTools}
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
export function UsesPage() {
  const {
    pick,
    messages: { ui },
  } = useLanguage();
  return (
    <main id="main" className="page-container inner-page">
      <div className="page-heading">
        <Link className="back-link" href="/">
          ← {ui.home}
        </Link>
        <h1>/uses</h1>
        <p>{ui.usesIntro}</p>
      </div>
      <div className="toolkit">
        {skills.map((group) => (
          <section key={group.id}>
            <SectionTitle>{pick(group.name)}</SectionTitle>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <TechIcon name={item} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
