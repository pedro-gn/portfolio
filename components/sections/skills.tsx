"use client";

import { icons, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/components/language-provider";
import skills from "@/data/skills.json";

function SkillIcon({ name }: { name: string }) {
  const Icon = (icons as Record<string, LucideIcon>)[name];
  if (!Icon) return null;
  return <Icon size={28} strokeWidth={1.5} aria-hidden="true" />;
}

export function Skills() {
  const { messages, pick } = useLanguage();
  const t = messages.skills;

  return (
    <section id="skills">
      <div className="wrap">
        <Reveal as="h2" className="section-title">
          {t.title}
        </Reveal>
        <Reveal as="p" className="section-sub">
          {t.sub}
        </Reveal>

        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal
              key={group.id}
              className={`skill-card${i % 2 === 1 ? " alt" : ""}`}
            >
              <div className="icon">
                <SkillIcon name={group.icon} />
              </div>
              <h3>{pick(group.name)}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
