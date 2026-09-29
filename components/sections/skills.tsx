"use client";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionTitle } from "@/components/section-title";
import { TechIcon } from "@/components/tech-icon";
import skills from "@/data/skills.json";
const rows = [
  Array.from(
    new Set(
      skills
        .filter((s) => ["frontend", "backend"].includes(s.id))
        .flatMap((s) => s.items),
    ),
  ),
  Array.from(
    new Set(
      skills
        .filter((s) => ["infra", "data", "design"].includes(s.id))
        .flatMap((s) => s.items),
    ),
  ),
];
export function Skills() {
  const {
    messages: { ui },
  } = useLanguage();
  const [paused, setPaused] = useState(false);
  return (
    <section
      id="skills"
      className="section-block skills-section"
      aria-labelledby="skills-title"
    >
      <div className="section-heading-row">
        <SectionTitle id="skills-title">{ui.skills}</SectionTitle>
        <button
          className="motion-button"
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          aria-label={paused ? ui.playSkills : ui.pauseSkills}
          title={paused ? ui.playSkills : ui.pauseSkills}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>
      <div className={"skill-marquees" + (paused ? " is-paused" : "")}>
        {rows.map((row, i) => (
          <div className="skill-window" key={i}>
            <div className="skill-track">
              {[0, 1].map((copy) => (
                <ul
                  className="skill-group"
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {row.map((name) => (
                    <li key={name}>
                      <TechIcon name={name} />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
