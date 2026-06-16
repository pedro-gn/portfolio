import messages from "@/data/messages.json";

export const LOCALES = ["en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** The `<html lang>` value to expose for each supported locale. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
};

export type Messages = (typeof messages)[Locale];

/**
 * A value that may carry per-locale variants. Plain strings are returned as-is,
 * which keeps locale-agnostic data (e.g. tech tags) simple to author.
 */
export type Localized<T = string> = T | Record<Locale, T>;

/** Resolve a possibly-localized value for the active locale. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<Locale, T>;
    return record[locale] ?? record[DEFAULT_LOCALE];
  }
  return value as T;
}

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
