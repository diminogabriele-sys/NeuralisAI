import React from "react";
import { Layers, Palette, Sparkles, Ruler, Weight, ShieldCheck } from "lucide-react";

const items = [
  { icon: Layers, title: "Carenature complete", desc: "Carene, codini, cover e parafanghi in fibra di carbonio 3K e 12K, stampati in autoclave." },
  { icon: Palette, title: "Finiture su misura", desc: "Trama a vista lucida o opaca, oppure verniciata su richiesta: ogni pezzo rifinito a mano." },
  { icon: Sparkles, title: "Pezzi esclusivi", desc: "Componenti disegnati per la singola moto, numerati e mai replicati su un altro esemplare." },
  { icon: Ruler, title: "Calibratura su misura", desc: "Ogni pezzo è stampato su stampo dedicato al modello, per un accoppiamento perfetto con la carrozzeria originale." },
  { icon: Weight, title: "Riduzione del peso", desc: "Sostituendo i pannelli originali con carbonio strutturale otteniamo un risparmio di peso reale." },
  { icon: ShieldCheck, title: "Controllo qualità", desc: "Ogni componente è ispezionato prima della consegna e coperto da garanzia artigianale sulla lavorazione." },
];

export default function Services() {
  return (
    <section id="servizi" className="relative py-20 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-lg mb-14">
          Realizziamo esclusivamente componenti in carbonio: nessun intervento su scarichi, cerchi o meccanica della moto.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-steel">
          {items.map((item) => (
            <div
              key={item.title}
              className="group p-8 border-r border-b border-steel hover:bg-carbonfiber transition-colors"
            >
              <item.icon className="w-5 h-5 text-titanium group-hover:text-brabus transition-colors mb-5" strokeWidth={1.5} />
              <h3 className="font-display uppercase text-[13px] font-medium tracking-[0.02em] text-titanium mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-fumo">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
