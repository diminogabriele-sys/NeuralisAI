import React, { useState } from "react";
import { motion } from "framer-motion";

const materials = [
  {
    id: "3k",
    name: "Carbonio 3K",
    subtitle: "Twill, autoclave",
    desc: "La trama classica a spina di pesce, fine e regolare. La scelta più richiesta per carenature e cover dal disegno pulito.",
    props: [{ l: "Riduzione peso", v: "−35%" }, { l: "Finitura", v: "Lucida o opaca" }],
  },
  {
    id: "12k",
    name: "Carbonio 12K",
    subtitle: "Twill largo, autoclave",
    desc: "Trama più ampia e graficamente decisa, per chi cerca un disegno del carbonio più marcato e riconoscibile.",
    props: [{ l: "Riduzione peso", v: "−32%" }, { l: "Finitura", v: "Lucida o opaca" }],
  },
  {
    id: "forgiato",
    name: "Carbonio forgiato",
    subtitle: "Fibra corta pressata",
    desc: "Fibre corte pressate a caldo, con effetto marmorizzato unico su ogni pezzo. Ideale per componenti dalle forme complesse.",
    props: [{ l: "Riduzione peso", v: "−30%" }, { l: "Finitura", v: "Lucida" }],
  },
  {
    id: "kevlar",
    name: "Carbonio-Kevlar",
    subtitle: "Ibrido rinforzato",
    desc: "Fibra di carbonio abbinata a Kevlar nelle zone più esposte a urti, per una resistenza superiore senza rinunciare al peso ridotto.",
    props: [{ l: "Riduzione peso", v: "−28%" }, { l: "Finitura", v: "Lucida o opaca" }],
  },
];

export default function Materials() {
  const [active, setActive] = useState(materials[0].id);
  const current = materials.find((m) => m.id === active);

  return (
    <section id="materiali" className="relative py-24 md:py-28 bg-stone text-stoneink">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="min-w-0 col-span-12 md:col-span-5">
            <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] leading-[1.3]">
              Lavoriamo solo carbonio, in ogni sua declinazione.
            </h2>
          </div>
          <div className="min-w-0 col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-[15px] leading-[1.8] text-stoneink/70 max-w-md">
              Scegliamo la trama in base al pezzo e all'estetica richiesta.
              Seleziona una lavorazione per scoprirne le caratteristiche.
            </p>
          </div>
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
