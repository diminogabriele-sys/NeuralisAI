import React from "react";

const products = [
  {
    id: "carena",
    fit: "BMW S1000RR",
    name: "Kit carena racing",
    desc: "Carena completa in carbonio a vista, stampata sullo stampo dedicato al modello.",
    price: "Da €1.890",
  },
  {
    id: "codino",
    fit: "Kawasaki Z900",
    name: "Codino monoposto",
    desc: "Codino in carbonio con sottocodino integrato, finitura lucida o opaca.",
    price: "Da €490",
  },
  {
    id: "cover",
    fit: "S1000RR e Z900",
    name: "Set cover motore",
    desc: "Protezioni motore in carbonio, sagomate su misura per il modello.",
    price: "Da €340",
  },
  {
    id: "parafango",
    fit: "S1000RR e Z900",
    name: "Parafango anteriore",
    desc: "Parafango in carbonio 3K, più leggero del componente originale.",
    price: "Da €220",
  },
];

function ProductCard({ p }) {
  return (
    <a
      href="#contact"
      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-carbonfiber p-8 md:p-10 min-h-[300px] transition-transform hover:scale-[1.015]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div className="relative">
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-3">{p.fit}</div>
        <h3 className="font-display uppercase text-2xl font-medium tracking-[0.005em] text-titanium leading-tight mb-3">
          {p.name}
        </h3>
        <p className="text-[14px] leading-[1.7] text-fumo max-w-xs">{p.desc}</p>
      </div>
      <div className="relative mt-8 flex items-center justify-between border-t border-steel pt-6">
        <span className="font-display text-lg text-titanium">{p.price}</span>
        <span className="font-body text-[12px] uppercase tracking-[0.083em] text-titanium group-hover:text-brabus transition-colors">
          Scopri di più
        </span>
      </div>
    </a>
  );
}

export default function Products() {
  return (
    <section id="prodotti" className="relative py-20 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] mb-14 max-w-md">
          I componenti che realizziamo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
