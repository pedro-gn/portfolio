"use client";
import { useLanguage } from "@/components/language-provider";
import { LocalClock } from "@/components/local-clock";
import profile from "@/data/profile.json";
export function Footer() {
  const {
    messages: { ui },
  } = useLanguage();
  return (
    <footer className="site-footer page-container">
      <p className="footer-note">{ui.footerNote}</p>
      <p className="footer-credit">
        {ui.madeBy} {profile.name} <span aria-hidden="true">♡</span>
      </p>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="#top">{ui.backToTop} ↑</a>
        <span>
          <LocalClock /> BRT
        </span>
      </div>
    </footer>
  );
}
