import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const items = [
    { label: t.nav.modelli, href: "#modelli" },
    { label: t.nav.prodotti, href: "#prodotti" },
    { label: t.nav.materiali, href: "#materiali" },
    { label: t.nav.processo, href: "#processo" },
    { label: t.nav.chiSiamo, to: "/about" },
    { label: t.nav.contatti, href: "#contact" },
  ];

  return (
    <footer className="relative bg-carbonfiber py-16">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="min-w-0 col-span-12 md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brabus" />
              <span className="font-display uppercase text-[13px] font-medium tracking-[0.083em] text-titanium">Veloce</span>
            </div>
            <p className="text-[14px] leading-[1.8] text-fumo max-w-xs">
              {t.footer.blurb}
            </p>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {items.map((i) =>
                i.to ? (
                  <Link
                    key={i.to}
                    to={i.to}
                    className="font-body text-[11px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors"
                  >
                    {i.label}
                  </Link>
                ) : (
                  <Link
                    key={i.href}
                    to={{ pathname: "/", hash: i.href }}
                    className="font-body text-[11px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors"
                  >
                    {i.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-3 md:text-right">
            <p className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo leading-[1.9]">
              {t.footer.addressLine1}<br />
              {t.footer.addressLine2}<br />
              NeuralisAI@outlook.it
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-steel flex flex-col md:flex-row justify-between items-center gap-3 font-body text-[11px] uppercase tracking-[0.083em] text-fumo">
          <div>{t.footer.copyright}</div>
          <div>{t.footer.madeIn}</div>
        </div>
      </div>
    </footer>
  );
}
