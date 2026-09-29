"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/components/language-provider";
import { LOCALES } from "@/lib/i18n";
import profile from "@/data/profile.json";

export function SiteNav() {
  const {
    locale,
    setLocale,
    messages: { ui },
  } = useLanguage();
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        {ui.skip}
      </a>
      <header className="site-header">
        <div className="nav-inner">
          <nav aria-label={ui.navigation}>
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
              {ui.home}
            </Link>
            <Link
              href="/projects"
              aria-current={
                pathname.startsWith("/projects") ? "page" : undefined
              }
            >
              {ui.projects}
            </Link>
            <Link
              href="/resume"
              aria-current={pathname === "/resume" ? "page" : undefined}
            >
              {ui.resume}
            </Link>
            <Link href="/#contact">{ui.contact}</Link>
          </nav>
          <div className="nav-tools">
            <a
              className="github-pill"
              href={profile.socials[0].url}
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <div
              className="language-switch"
              role="group"
              aria-label="Idioma / Language"
            >
              {LOCALES.map((code) => (
                <button
                  type="button"
                  key={code}
                  aria-pressed={locale === code}
                  onClick={() => setLocale(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
