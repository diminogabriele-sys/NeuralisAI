import React, { useState } from "react";
import { motion } from "framer-motion";

const materials = [
  {
    id: "carbonio",
    name: "Carbonio",
    subtitle: "3K / 12K, autoclave",
    desc: "Leggerezza estrema e rigidità strutturale. Ogni componente è stampato in autoclave e rifinito a mano per una trama sempre allineata.",
    props: [{ l: "Riduzione peso", v: "-40%" }, { l: "Finitura", v: "Lucida / Opaca" }],
  },
  {
    id: "titanio",
    name: "Titanio",
    subtitle: "Grado 5 aerospaziale",
    desc: "Il materiale di riferimento per scarichi e minuteria: resistenza alle alte temperature, colorazioni naturali by heat, peso ridotto.",
    props: [{ l: "Resistenza termica", v: "fino a 600°C" },{ l: "Peso vs acciaio", v: "-45%" }],
  },
  {
    id: "ergal",
    name: "Ergal 7075",
    subtitle: "Lavorato CNC",
    desc: "Alluminio aeronautico lavorato a controllo numerico per pedane, semi-manubri e cover motore su misura, con tolleranze minime.",
    props: [{ l: "Lavorazione", v: "CNC 5 assi" }, { l: "Tolleranza", v: "±0.02 mm" }],
  },
  {
    id: "pelle",
    name: "Pelle & Alcantara",
    subtitle: "Cuciture a mano",
    desc: "Selle e rivestimenti in pelle pieno fiore e Alcantara, cuciti a mano con filo a contrasto per un tocco sartoriale.",
    props: [{ l: "Lavorazione", v: "100% manuale" }, { l: "Personalizzazione", v: "Colori e cuciture" }],
  },
];

const stats = [
  { v: "150+", l: "Ore artigianali per moto" },
  { v: "100%", l: "Componenti su misura" },
  { v: "1/1", l: "Pezzi numerati, mai replicati" },
  { v: "IT", l: "Progettato e prodotto in Italia" },
];

export default function Materials() {
  const [active, setActive] = useState(materials[0].id);
  const current = materials.find((m) => m.id === active);

  return (
    <section id="materiali" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-display uppercase text-3xl md:text-5xl text-titanium leading-[1.1] break-words">
              Solo ciò che merita di essere su una moto.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-[13px] leading-[1.78] text-fumo max-w-md">
              Selezioniamo materiali da competizione e li lavoriamo con tecniche
              artigianali. Scegli un materiale per scoprire come lo utilizziamo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-px">
          <div className="col-span-12 lg:col-span-4 flex flex-col border border-steel">
            {materials.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`text-left px-6 py-5 border-b border-steel last:border-b-0 transition-colors hover:text-brabus ${
                  active === m.id ? "border-l-2 border-l-brabus" : ""
                }`}
              >
                <div className="font-display uppercase text-lg text-titanium">
                  {m.name}
                </div>
                <div className="font-body text-[10px] uppercase tracking-[0.083em] text-fumo mt-1">
                  {m.subtitle}
                </div>
              </button>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-8 border border-steel border-l-0 lg:border-l-0 p-8 md:p-10 flex flex-col justify-between">
            <motion.div key={current.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-[13px] leading-[1.78] text-titanium max-w-xl mb-8">{current.desc}</p>
              <div className="grid grid-cols-2 gap-6 max-w-sm">
                {current.props.map((p) => (
                  <div key={p.l} className="border-l border-steel pl-4">
                    <div className="font-display uppercase text-2xl text-titanium leading-none">{p.v}</div>
                    <div className="font-body text-[9px] uppercase tracking-[0.083em] text-fumo mt-2">{p.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-12 border border-steel">
          {stats.map((s) => (
            <div key={s.l} className="p-6 md:p-8 border-r border-steel last:border-r-0 text-center">
              <div className="font-display uppercase text-2xl md:text-3xl text-titanium">{s.v}</div>
              <div className="font-body text-[9px] uppercase tracking-[0.083em] text-fumo mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
