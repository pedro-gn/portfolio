"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";

export function Contact() {
  const { messages, pick } = useLanguage();
  const t = messages.contact;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto link is still right there */
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal as="h2" className="section-title">
          {t.title}
        </Reveal>
        <Reveal as="p" className="contact-sub">
          {t.sub}
        </Reveal>
        <Reveal className="mail-row">
          <a href={`mailto:${profile.email}`} className="mail-link">
            {profile.email}
          </a>
          <button
            type="button"
            className={`copy-btn${copied ? " copied" : ""}`}
            onClick={copyEmail}
            aria-label={t.copyAria}
          >
            <span aria-hidden="true">{copied ? t.copied : t.copy}</span>
            {copied ? (
              <Check className="copy-ico" size={15} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Copy className="copy-ico" size={15} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? t.copiedStatus : ""}
          </span>
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
