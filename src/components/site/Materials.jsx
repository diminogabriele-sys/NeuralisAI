import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Materials() {
  const { t } = useLanguage();
  const materials = t.materials.items;
  const [active, setActive] = useState(materials[0].id);
  const current = materials.find((m) => m.id === active) || materials[0];

  return (
    <section id="materiali" className="relative py-24 md:py-28 bg-stone text-stoneink">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="max-w-xl mx-auto text-center mb-14">
          <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] leading-[1.3]">
            {t.materials.heading}
          </h2>
          <p className="text-[15px] leading-[1.8] text-stoneink/70 max-w-md mx-auto mt-5">
            {t.materials.sub}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-px">
          <div className="min-w-0 col-span-12 lg:col-span-4 flex flex-col border border-stoneink/15">
            {materials.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`text-left px-6 py-5 border-b border-stoneink/15 last:border-b-0 transition-colors ${
                  active === m.id ? "border-l-2 border-l-brabus bg-white/40" : "hover:bg-white/20"
                }`}
              >
                <div className="font-display uppercase text-[13px] font-medium tracking-[0.02em]">
                  {m.name}
                </div>
                <div className="font-body text-[11px] uppercase tracking-[0.083em] text-stoneink/55 mt-1">
                  {m.subtitle}
                </div>
              </button>
            ))}
          </div>

          <div className="min-w-0 col-span-12 lg:col-span-8 border border-stoneink/15 border-l-0 lg:border-l-0 p-8 md:p-10 flex flex-col justify-between">
            <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <p className="text-[15px] leading-[1.8] max-w-xl mb-9">{current.desc}</p>
              <div className="grid grid-cols-2 gap-8 max-w-sm">
                {current.props.map((p) => (
                  <div key={p.l} className="border-l-2 border-brabus pl-4">
                    <div className="font-display text-2xl leading-none">{p.v}</div>
                    <div className="font-body text-[11px] uppercase tracking-[0.083em] text-stoneink/55 mt-2">{p.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
