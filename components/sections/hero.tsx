"use client";

import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";

export function Hero() {
  const { messages } = useLanguage();
  const t = messages.hero;

  return (
    <header className="hero">
      <div className="wrap hero-inner">
        <Reveal as="h1" delay={70}>
          {t.titlePre} {t.titleMid}{" "}
          <span className="hl">{t.titleHighlight}</span> {t.titlePost}
        </Reveal>
        <Reveal as="p" className="hero-lead" delay={140}>
          {t.leadBefore}
          <strong>{profile.name}</strong>
          {t.leadAfter}
        </Reveal>
        <Reveal className="btn-row" delay={210}>
          <a href="#projects" className="btn btn-primary">
            {t.btnWork} <span className="arrow">↗</span>
          </a>
          <a href="#contact" className="btn btn-ghost">
            {t.btnContact}
          </a>
        </Reveal>
      </div>
      <div className="scroll-hint">
        <span>{t.scroll}</span>
        <span className="line" />
      </div>
    </header>
  );
}
