"use client";

import { Reveal } from "@/components/reveal";
import { Emphasis } from "@/components/emphasis";
import { useLanguage } from "@/components/language-provider";
import stats from "@/data/stats.json";

export function About() {
  const { messages, pick } = useLanguage();
  const t = messages.about;

  return (
    <section id="about">
      <div className="wrap">
        <div className="about-grid">
          <Reveal className="about-body">
            <h2 className="section-title">{t.title}</h2>
            {t.paragraphs.map((p, i) => (
              <p key={i}>
                <Emphasis text={p} />
              </p>
            ))}
          </Reveal>
          <Reveal className="stat-card" delay={70}>
            {stats.map((stat) => (
              <div className="stat-row" key={stat.id}>
                <span className="stat-num">
                  {stat.num}
                  <span className="u">{stat.unit}</span>
                </span>
                <span className="stat-label">{pick(stat.label)}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
