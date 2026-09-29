"use client";
import {
  ChevronDown,
  Code2,
  Building2,
  FlaskConical,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionTitle } from "@/components/section-title";
import experience from "@/data/experience.json";
const icons = [Code2, Building2, FlaskConical, GraduationCap];
export function Experience() {
  const {
    pick,
    messages: { ui },
  } = useLanguage();
  return (
    <section
      id="experience"
      className="section-block"
      aria-labelledby="experience-title"
    >
      <SectionTitle id="experience-title">{ui.experience}</SectionTitle>
      <div className="timeline">
        {experience.map((item, index) => {
          const Icon = icons[index];
          const active = item.status === "present";
          return (
            <details
              className={"experience-item" + (active ? " is-active" : "")}
              key={item.id}
            >
              <summary>
                <span className="timeline-dot" aria-hidden="true" />
                <span className="company-icon">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <span className="experience-heading">
                  <span className="company-line">
                    <strong>{item.company}</strong>
                    <span
                      className={"status-badge " + (active ? "active" : "past")}
                    >
                      ● {active ? ui.active : ui.previous}
                    </span>
                  </span>
                  <span className="experience-role">{pick(item.role)}</span>
                </span>
                <span className="experience-date">{pick(item.date)}</span>
                <ChevronDown
                  className="experience-chevron"
                  size={14}
                  aria-hidden="true"
                />
              </summary>
              <div className="experience-description">
                <p>{pick(item.description)}</p>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
