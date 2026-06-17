"use client";

import { Reveal } from "@/components/reveal";
import { Emphasis } from "@/components/emphasis";
import { useLanguage } from "@/components/language-provider";

export function About() {
  const { messages } = useLanguage();
  const t = messages.about;

  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="about-body">
          <h2 className="section-title">{t.title}</h2>
          {t.paragraphs.map((p, i) => (
            <p key={i}>
              <Emphasis text={p} />
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
