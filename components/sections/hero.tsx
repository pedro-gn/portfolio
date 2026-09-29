"use client";
import Image from "next/image";
import { ArrowUpRight, Clock3, MapPin, Code2, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/components/language-provider";
import { SocialLinks } from "@/components/social-links";
import { LocalClock } from "@/components/local-clock";
import { Emphasis } from "@/components/emphasis";
import profile from "@/data/profile.json";
export function Hero() {
  const {
    pick,
    messages: { ui },
  } = useLanguage();
  return (
    <section className="hero" aria-labelledby="profile-name">
      <div className="profile-header">
        <div className="avatar-frame">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={120}
            height={120}
            preload
            className="avatar"
          />
          <span className="avatar-code" aria-hidden="true">
            <Code2 size={15} />
          </span>
        </div>
        <div className="profile-info">
          <h1 id="profile-name">
            {profile.name}
            <span className="name-mark" aria-hidden="true">
              ↗
            </span>
          </h1>
          <a
            className="profile-handle"
            href={profile.socials[0].url}
            target="_blank"
            rel="noreferrer"
          >
            @{profile.username}
          </a>
          <a
            className="building"
            href={profile.building.url}
            target="_blank"
            rel="noreferrer"
          >
            {ui.building} <strong>{profile.building.name}</strong>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <div className="profile-meta">
            <span>
              <MapPin size={13} aria-hidden="true" />
              {pick(profile.location)}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <Clock3 size={13} aria-hidden="true" />
              <LocalClock />
            </span>
          </div>
        </div>
      </div>
      <ul className="profile-bio">
        {profile.bio.map((line, i) => (
          <li key={i}>
            <Emphasis text={pick(line)} />
          </li>
        ))}
      </ul>
      <div className="profile-cards">
        <a
          className="profile-card"
          href={profile.socials[0].url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="profile-card-icon">
            <FaGithub size={25} />
          </span>
          <span className="profile-card-text">
            <strong>{profile.name}</strong>
            <span>@{profile.username}</span>
          </span>
          <span className="small-action">
            {ui.viewProfile}
            <ArrowUpRight size={12} aria-hidden="true" />
          </span>
        </a>
        <a className="profile-card" href={"mailto:" + profile.email}>
          <span className="profile-card-icon light">
            <Code2 size={25} />
          </span>
          <span className="profile-card-text">
            <strong>{ui.letsBuild}</strong>
            <span>
              <i className="status-dot" />
              {ui.available}
            </span>
          </span>
          <span className="small-action" aria-hidden="true">
            <ArrowRight size={15} />
          </span>
        </a>
      </div>
      <SocialLinks compact />
    </section>
  );
}
