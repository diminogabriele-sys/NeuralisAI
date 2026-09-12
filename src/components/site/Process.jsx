import React from "react";

const steps = [
  { n: "01", t: "Consulenza", d: "Analizziamo la tua moto, il tuo stile di guida e le tue aspettative. Definiamo insieme la direzione estetica e tecnica del progetto." },
  { n: "02", t: "Progettazione", d: "Disegniamo ogni componente su misura: rendering, scelta dei materiali e validazione tecnica prima di avviare la lavorazione." },
  { n: "03", t: "Lavorazione", d: "Carbonio, titanio e alluminio prendono forma nel nostro reparto artigianale. Ogni pezzo è realizzato e rifinito a mano." },
  { n: "04", t: "Collaudo e consegna", d: "Montaggio, collaudo su strada e consegna della moto pronta, numerata e coperta da garanzia artigianale." },
];

export default function Process() {
  return (
    <section id="processo" className="relative py-24 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <h2 className="font-display text-2xl md:text-3xl text-titanium leading-[1.25] max-w-xl mb-14">
          Dall'idea alla moto che non esiste altrove — in quattro fasi.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative p-8 border-t border-steel md:border-t-0 md:border-l first:border-l-0"
            >
              <div className="font-display text-2xl text-ottone mb-6">{s.n}</div>
              <h3 className="font-display text-lg text-titanium mb-3">{s.t}</h3>
              <p className="text-[14px] leading-[1.75] text-fumo">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
