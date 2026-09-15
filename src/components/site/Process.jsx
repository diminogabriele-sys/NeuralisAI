import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Process() {
  const { t } = useLanguage();

  return (
    <section id="processo" className="relative py-24 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-xl mb-14 mx-auto text-center">
          {t.process.heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px">
          {t.process.steps.map((s) => (
            <div
              key={s.n}
              className="relative p-8 border-t border-steel md:border-t-0 md:border-l first:border-l-0"
            >
              <div className="font-display text-2xl text-fumo mb-6">{s.n}</div>
              <h3 className="font-display uppercase text-[13px] font-medium tracking-[0.02em] text-titanium mb-3">{s.t}</h3>
              <p className="text-[14px] leading-[1.75] text-fumo">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
