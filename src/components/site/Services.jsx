import React from "react";
import { Layers, Palette, Ruler, Weight, Sparkles, ShieldCheck } from "lucide-react";

const estetica = [
  { icon: Layers, title: "Carenature complete", desc: "Carene, codini, cover e parafanghi realizzati in fibra di carbonio 3K e 12K, stampati in autoclave." },
  { icon: Palette, title: "Finiture su misura", desc: "Trama a vista lucida o opaca, oppure verniciata su richiesta: ogni pezzo rifinito a mano." },
  { icon: Sparkles, title: "Pezzi esclusivi", desc: "Componenti disegnati per la singola moto, numerati e mai replicati su un altro esemplare." },
];

const precisione = [
  { icon: Ruler, title: "Calibratura su misura", desc: "Ogni pezzo è stampato su stampo dedicato al modello e verificato per un accoppiamento perfetto con la carrozzeria originale." },
  { icon: Weight, title: "Riduzione del peso", desc: "Sostituendo i pannelli originali con carbonio strutturale otteniamo un risparmio di peso reale, senza compromessi estetici." },
  { icon: ShieldCheck, title: "Controllo qualità", desc: "Ogni componente è ispezionato prima della consegna e coperto da garanzia artigianale sulla lavorazione." },
];

function ServiceBlock({ title, subtitle, items }) {
  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12 w-full">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="min-w-0 col-span-12 md:col-span-4">
            <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] mb-5">
              {title}
            </h2>
            <p className="text-[15px] leading-[1.8] text-fumo max-w-sm">{subtitle}</p>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-7 md:col-start-6 flex flex-col gap-px">
            {items.map((item) => (
              <div
                key={item.title}
                className="group grid grid-cols-12 gap-4 items-start py-7 border-t border-steel hover:border-brabus transition-colors"
              >
                <div className="min-w-0 col-span-1">
                  <item.icon className="w-4 h-4 text-titanium group-hover:text-brabus transition-colors mt-1" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 col-span-11 md:col-span-4">
                  <h3 className="font-display uppercase text-[13px] font-medium tracking-[0.02em] text-titanium">
                    {item.title}
                  </h3>
                </div>
                <div className="min-w-0 col-span-12 md:col-span-7">
                  <p className="text-[14px] leading-[1.75] text-fumo">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="servizi" className="relative">
      <div className="border-t border-steel" />
      <ServiceBlock
        title="Estetica su misura"
        subtitle="Ogni linea è disegnata per la moto e per chi la guida. Solo carbonio, lavorazioni a mano, nessun pezzo di serie."
        items={estetica}
      />
      <div className="border-t border-steel" />
      <ServiceBlock
        title="Precisione costruttiva"
        subtitle="Realizziamo esclusivamente componenti in carbonio: nessun intervento su scarichi, cerchi o meccanica della moto."
        items={precisione}
      />
    </section>
  );
}
