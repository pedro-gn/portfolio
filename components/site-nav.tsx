"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LOCALES } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";

export function SiteNav() {
  const { messages, locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link href="/#top" className="brand">
        <span className="dot" />
        {profile.name}
      </Link>
      <div className="nav-links">
        <Link href="/#projects">{messages.nav.projects}</Link>
        <Link href="/#skills">{messages.nav.skills}</Link>
        <Link href="/#experience">{messages.nav.experience}</Link>
        <Link href="/#contact" className="nav-cta">
          {messages.nav.cta}
        </Link>
        <div className="lang-pick" role="group" aria-label="Language / Idioma">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              className={code === locale ? "active" : undefined}
              aria-pressed={code === locale}
              onClick={() => setLocale(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
