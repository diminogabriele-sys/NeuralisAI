import React from "react";

const bikes = [
  {
    record: "07/24",
    make: "BMW",
    model: "S1000RR",
    tag: "Base track",
    desc: "Sulla base della supersportiva tedesca realizziamo carenature complete in carbonio a vista: aerodinamica e riduzione del peso, senza intervenire sulla meccanica della moto.",
    specs: [
      { l: "Peso rimosso", v: "fino a −4 kg" },
      { l: "Carena", v: "carbonio 3K / 12K" },
      { l: "Finitura", v: "lucida o opaca" },
      { l: "Tempo di consegna", v: "8–10 settimane" },
    ],
    highlights: ["Carena racing completa in carbonio a vista", "Codino e sottocodino in carbonio", "Cover e protezioni motore in carbonio", "Parafango anteriore in carbonio"],
  },
  {
    record: "11/24",
    make: "Kawasaki",
    model: "Z900",
    tag: "Base street",
    desc: "La Z900 diventa tela per un linguaggio street: codino monoposto in carbonio, cover e protezioni su misura, tutte realizzate e rifinite a mano nel nostro laboratorio.",
    specs: [
      { l: "Codino", v: "monoposto carbonio" },
      { l: "Parafanghi", v: "carbonio 3K / 12K" },
      { l: "Finitura", v: "lucida o opaca" },
      { l: "Tempo di consegna", v: "6–8 settimane" },
    ],
    highlights: ["Codino monoposto in carbonio", "Parafango anteriore e posteriore in carbonio", "Cover laterali e protezioni in carbonio", "Cupolino e parabrezza in carbonio"],
  },
];

function WorkRecord({ record, make, model, tag, specs }) {
  return (
    <div className="bg-carbonfiber p-8 md:p-10">
      <div className="flex items-baseline justify-between font-body text-[11px] uppercase tracking-[0.083em] text-fumo">
        <span>Scheda di lavorazione</span>
        <span>N° {record}</span>
      </div>
      <div className="mt-8">
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo">{make}</div>
        <h3 className="font-display uppercase text-2xl font-medium tracking-[0.005em] text-titanium mt-1">{model}</h3>
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo mt-1">{tag}</div>
      </div>
      <div className="mt-8 pt-6 border-t border-steel grid grid-cols-2 gap-x-6 gap-y-5">
        {specs.map((s) => (
          <div key={s.l}>
            <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo">{s.l}</div>
            <div className="text-[15px] text-titanium mt-0.5">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BikeBlock({ data, index }) {
  const reverse = index % 2 === 1;
  return (
    <div className="py-16 md:py-20 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-14 items-center">
          <div className={`min-w-0 col-span-12 md:col-span-6 ${reverse ? "md:order-2" : ""}`}>
            <WorkRecord record={data.record} make={data.make} model={data.model} tag={data.tag} specs={data.specs} />
          </div>

          <div className={`min-w-0 col-span-12 md:col-span-6 ${reverse ? "md:order-1" : ""}`}>
            <p className="text-[15px] leading-[1.8] text-fumo max-w-lg mb-8">{data.desc}</p>

            <ul className="space-y-3 mb-9">
              {data.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[14px] text-titanium">
                  <span className="w-1 h-1 mt-2 bg-fumo shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="font-body text-[14px] text-titanium underline decoration-brabus/50 underline-offset-4 hover:decoration-brabus transition-colors"
            >
              Configura la tua {data.model}
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
      <div className="mx-auto max-w-[1100px] px-6 md:px-12 pt-24 md:pt-28 text-center">
        <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-xl mx-auto">
          Lavoriamo solo su due basi, per conoscerle meglio di chiunque altro
        </h2>
      </div>
      {bikes.map((b, i) => (
        <BikeBlock key={b.record} data={b} index={i} />
      ))}
    </section>
  );
}
