"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  getMessages,
  isLocale,
  pick as pickValue,
  type Locale,
  type Localized,
  type Messages,
} from "@/lib/i18n";
const STORAGE_KEY = "portfolio-lang";
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function getStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
const getServerLocale = () => DEFAULT_LOCALE;
type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
  pick: <T>(value: Localized<T>) => T;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(
    subscribe,
    getStoredLocale,
    getServerLocale,
  );
  const [selected, setSelected] = useState<Locale | null>(null);
  const locale = selected ?? stored;
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);
  const setLocale = useCallback((next: Locale) => {
    setSelected(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* In-memory preference still works when storage is blocked. */
    }
  }, []);
  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      messages: getMessages(locale),
      pick: (value) => pickValue(value, locale),
    }),
    [locale, setLocale],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
