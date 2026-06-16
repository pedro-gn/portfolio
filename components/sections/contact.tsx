"use client";

import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";

export function Contact() {
  const { messages, pick } = useLanguage();
  const t = messages.contact;

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal as="h2" className="section-title">
          {t.title}
        </Reveal>
        <Reveal as="p" className="contact-sub">
          {t.sub}
        </Reveal>
        <Reveal as="a" href={`mailto:${profile.email}`} className="mail-link">
          {profile.email}
        </Reveal>
        <Reveal className="socials">
          {profile.socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              className="social"
              target="_blank"
              rel="noreferrer"
            >
              {pick(social.label)}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
