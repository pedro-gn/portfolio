import type { Metadata } from "next";
import localFont from "next/font/local";
import { LanguageProvider } from "@/components/language-provider";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/sections/footer";
import profile from "@/data/profile.json";
import "./globals.css";

const figtree = localFont({
  src: "../public/fonts/figtree.ttf",
  variable: "--font-ui",
  display: "swap",
  weight: "300 900",
});
const mono = localFont({
  src: "../public/fonts/jetbrains-mono.ttf",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
});
export const metadata: Metadata = {
  title: profile.name + " — " + profile.role,
  description:
    "Desenvolvedor fullstack. Produtos web, SaaS e aplicações em tempo real — do banco de dados à interface.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={figtree.variable + " " + mono.variable}
    >
      <body id="top">
        <LanguageProvider>
          <SiteNav />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
