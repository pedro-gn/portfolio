import type { Metadata } from "next";
import { Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import { ParticleBackground } from "@/components/particle-background";
import profile from "@/data/profile.json";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Fullstack developer who designs and ships complete web products end to end — from database schema to pixel-perfect UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        {/* Mark JS as available before paint, so the reveal animation is opt-in
            and content renders visibly for crawlers / no-JS clients. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <ParticleBackground />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
