"use client";

import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";

export function Footer() {
  const { messages } = useLanguage();
  const year = 2026;

  return (
    <footer className="footer">
      <span>© {year} {profile.name}</span>
      <span>
        {messages.footer.builtBefore}
        <a href="#top">{messages.footer.backToTop}</a>
      </span>
    </footer>
  );
}
