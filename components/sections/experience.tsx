"use client";

import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/components/language-provider";
import experience from "@/data/experience.json";

export function Experience() {
  const { messages, pick } = useLanguage();
  const t = messages.experience;

  return (
    <section id="experience">
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

        <div className="timeline">
          {experience.map((item) => (
            <Reveal className="tl-item" key={item.id}>
              <span className="node" />
              <div className="tl-top">
                <span className="tl-role">
                  {pick(item.role)} · <span className="tl-co">{item.company}</span>
                </span>
                <span className="tl-date">{pick(item.date)}</span>
              </div>
              <p>{pick(item.description)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
