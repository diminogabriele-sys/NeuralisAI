import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";
import { LANGUAGES, DEFAULT_LANG } from "./languages";

const STORAGE_KEY = "veloce-lang";
const SUPPORTED = LANGUAGES.map((l) => l.code);

function detectInitialLang() {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  const nav = (window.navigator.language || "").slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable (private mode, etc.) — language just won't persist
    }
  }, [lang]);

  const setLang = (code) => {
    if (SUPPORTED.includes(code)) setLangState(code);
  };

  const value = useMemo(
    () => ({ lang, setLang, t: translations[lang] || translations[DEFAULT_LANG] }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
