"use client";
import Link from "next/link";
import { Mail, FileText, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";
export function SocialLinks({ compact = false }: { compact?: boolean }) {
  const {
    messages: { ui },
  } = useLanguage();
  return (
    <div className={"social-links" + (compact ? " compact" : "")}>
      <a className="button email-button" href={"mailto:" + profile.email}>
        <Mail size={14} aria-hidden="true" />
        {ui.emailMe}
      </a>
      {compact && (
        <span className="social-separator" aria-hidden="true">
          |
        </span>
      )}
      <a
        className="button"
        href={profile.socials[1].url}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <FaLinkedinIn aria-hidden="true" />
        {!compact && "LinkedIn"}
      </a>
      <a
        className="button"
        href={profile.socials[0].url}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        title="GitHub"
      >
        <FaGithub aria-hidden="true" />
        {!compact && "GitHub"}
      </a>
      <a
        className="button"
        href={"tel:" + profile.phone.replace(/[^+\d]/g, "")}
        aria-label={ui.phone}
        title={profile.phone}
      >
        <Phone size={14} aria-hidden="true" />
        {!compact && ui.phone}
      </a>
      <Link
        className="button"
        href="/resume"
        aria-label={ui.resume}
        title={ui.resume}
      >
        <FileText size={14} aria-hidden="true" />
        {!compact && ui.resume}
      </Link>
    </div>
  );
}
