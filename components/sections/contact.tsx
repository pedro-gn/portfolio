"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SocialLinks } from "@/components/social-links";
import profile from "@/data/profile.json";
export function Contact() {
  const {
    messages: { ui, contact },
  } = useLanguage();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 3000);
  }
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-card">
        <h2 id="contact-title">{ui.letsConnect}</h2>
        <p>{ui.contactIntro}</p>
        <SocialLinks />
        <div className="contact-address">
          <a href={"mailto:" + profile.email}>{profile.email}</a>
          <button
            type="button"
            className="copy-button"
            onClick={copyEmail}
            aria-label={contact.copyAria}
            title={status === "copied" ? contact.copied : contact.copy}
          >
            {status === "copied" ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <a
          className="contact-phone"
          href={"tel:" + profile.phone.replace(/[^+\d]/g, "")}
        >
          {profile.phone}
        </a>
        <span
          className={status === "error" ? "copy-error" : "sr-only"}
          role="status"
        >
          {status === "copied"
            ? contact.copiedStatus
            : status === "error"
              ? ui.copyError
              : ""}
        </span>
      </div>
    </section>
  );
}
