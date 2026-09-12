import React, { useState } from "react";
import { motion } from "framer-motion";

const materials = [
  {
    id: "carbonio",
    name: "Carbonio",
    subtitle: "3K / 12K, autoclave",
    desc: "Leggerezza estrema e rigidità strutturale. Ogni componente è stampato in autoclave e rifinito a mano per una trama sempre allineata.",
    props: [{ l: "Riduzione peso", v: "−40%" }, { l: "Finitura", v: "Lucida o opaca" }],
  },
  {
    id: "titanio",
    name: "Titanio",
    subtitle: "Grado 5 aerospaziale",
    desc: "Il materiale di riferimento per scarichi e minuteria: resistenza alle alte temperature, colorazioni naturali by heat, peso ridotto.",
    props: [{ l: "Resistenza termica", v: "fino a 600°C" },{ l: "Peso vs acciaio", v: "−45%" }],
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

export default function Materials() {
  const [active, setActive] = useState(materials[0].id);
  const current = materials.find((m) => m.id === active);

  return (
    <section id="materiali" className="relative py-24 md:py-28 bg-stone text-stoneink">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="min-w-0 col-span-12 md:col-span-5">
            <h2 className="font-display text-2xl md:text-3xl leading-[1.25]">
              Selezioniamo materiali da competizione e li lavoriamo con
              tecniche artigianali, non con impianti automatici.
            </h2>
          </div>
          <div className="min-w-0 col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-[15px] leading-[1.8] text-stoneink/70 max-w-md">
              Da oltre 150 ore di lavorazione manuale per moto nasce la
              differenza. Scegli un materiale per vedere come lo impieghiamo.
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
                  active === m.id ? "border-l-2 border-l-ottone bg-white/40" : "hover:bg-white/20"
                }`}
              >
                <div className="font-display text-xl">
                  {m.name}
                </div>
                <div className="font-body text-[13px] text-stoneink/55 mt-1">
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
                  <div key={p.l} className="border-l-2 border-ottone pl-4">
                    <div className="font-display text-2xl leading-none">{p.v}</div>
                    <div className="font-body text-[13px] text-stoneink/55 mt-2">{p.l}</div>
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
