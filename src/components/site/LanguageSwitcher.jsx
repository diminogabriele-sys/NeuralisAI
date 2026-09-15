import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGUAGES } from "@/lib/i18n/languages";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Lingua / Language"
        className="font-body text-[11px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors py-[5px]"
      >
        {lang}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 min-w-[150px] bg-carbonfiber border border-steel py-2 z-10"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 font-body text-[11px] uppercase tracking-[0.083em] transition-colors ${
                l.code === lang ? "text-brabus" : "text-titanium hover:text-brabus"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LanguageSwitcherInline({ className = "" }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`flex items-center flex-wrap gap-3 ${className}`}>
      {LANGUAGES.map((l, i) => (
        <React.Fragment key={l.code}>
          {i > 0 && <span className="text-fumo">/</span>}
          <button
            type="button"
            onClick={() => setLang(l.code)}
            aria-current={l.code === lang}
            className={`font-body text-[11px] uppercase tracking-[0.083em] transition-colors ${
              l.code === lang ? "text-brabus" : "text-titanium hover:text-brabus"
            }`}
          >
            {l.code}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
