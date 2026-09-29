"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
export default function NotFound() {
  const {
    messages: { ui },
  } = useLanguage();
  return (
    <main id="main" className="page-container error-page">
      <div className="error-code">404 /</div>
      <h1>{ui.notFound}</h1>
      <p>{ui.notFoundIntro}</p>
      <Link className="button" href="/">
        ← {ui.home}
      </Link>
    </main>
  );
}
