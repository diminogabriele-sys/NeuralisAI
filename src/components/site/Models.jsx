import React from "react";
import { motion } from "framer-motion";
import BikeBlueprint from "./BikeBlueprint";

const bikes = [
  {
    id: "01",
    variant: "sport",
    make: "BMW",
    model: "S1000RR",
    tag: "Piattaforma Track",
    desc: "Sulla base della supersportiva tedesca costruiamo carenature in carbonio a vista, forcelloni alleggeriti e scarichi in titanio: aerodinamica e riduzione massa senza toccare l'affidabilità del motore.",
    specs: [
      { l: "Peso rimosso", v: "fino a -9 kg" },
      { l: "Carena", v: "carbonio 3K / 12K" },
      { l: "Scarico", v: "titanio Grado 5" },
      { l: "Produzione", v: "su commissione" },
    ],
    highlights: ["Carena racing in carbonio a vista", "Impianto di scarico completo in titanio", "Cerchi forgiati e cover motore in ergal", "Elettronica e mappature dedicate"],
  },
  {
    id: "02",
    variant: "naked",
    make: "Kawasaki",
    model: "Z900",
    tag: "Piattaforma Street",
    desc: "La Z900 diventa tela per un linguaggio street-luxury: serbatoio ridisegnato, codino monoposto in carbonio, illuminazione full LED custom e una livrea esclusiva firmata a mano.",
    specs: [
      { l: "Codino", v: "monoposto carbonio" },
      { l: "Manubrio", v: "rialzato / ribassato" },
      { l: "Verniciatura", v: "livrea esclusiva" },
      { l: "Produzione", v: "su commissione" },
    ],
    highlights: ["Codino monoposto e parafanghi in carbonio", "Impianto frenante maggiorato", "Sella e rivestimenti in pelle e Alcantara", "Livrea dipinta a mano, numerata"],
  },
];

function BikeBlock({ data, index }) {
  const reverse = index % 2 === 1;
  return (
    <div className="py-20 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
          <div className={`col-span-12 md:col-span-6 ${reverse ? "md:order-2" : ""}`}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <BikeBlueprint variant={data.variant} className="w-full h-auto" />
            </motion.div>
          </div>

          <div className={`col-span-12 md:col-span-6 ${reverse ? "md:order-1" : ""}`}>
            <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-4">
              {data.tag}
            </div>
            <h3 className="font-display uppercase text-[13px] tracking-[0.015em] text-fumo mb-1">
              {data.make}
            </h3>
            <h2 className="font-display uppercase text-3xl md:text-5xl text-titanium leading-[1.1] mb-6 break-words">
              {data.model}
            </h2>
            <p className="text-[13px] leading-[1.78] text-fumo max-w-lg mb-8">{data.desc}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 max-w-md">
              {data.specs.map((s) => (
                <div key={s.l} className="border-l border-steel pl-3">
                  <div className="font-body text-[10px] uppercase tracking-[0.083em] text-fumo">{s.l}</div>
                  <div className="font-display uppercase text-[13px] text-titanium mt-1">{s.v}</div>
                </div>
              ))}
            </div>

            <ul className="space-y-2 mb-8">
              {data.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[13px] text-titanium">
                  <span className="w-1 h-1 mt-2 bg-fumo shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="font-body text-[12px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors"
            >
              Configura la tua {data.model} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Models() {
  return (
    <section id="modelli" className="relative">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pt-24 md:pt-32">
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-4">Le Piattaforme</div>
        <h2 className="font-display uppercase text-3xl md:text-5xl text-titanium leading-[1.1] max-w-3xl break-words">
          Due basi d'eccellenza. Infinite personalizzazioni.
        </h2>
      </div>
      {bikes.map((b, i) => (
        <BikeBlock key={b.id} data={b} index={i} />
      ))}
    </section>
  );
}
