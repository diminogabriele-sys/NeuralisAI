import React from "react";
import { Link } from "react-router-dom";

const items = [
  { label: "Modelli", href: "#modelli" },
  { label: "Personalizzazioni", href: "#servizi" },
  { label: "Materiali", href: "#materiali" },
  { label: "Processo", href: "#processo" },
  { label: "Chi siamo", to: "/about" },
  { label: "Contatti", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-carbonfiber py-16">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="min-w-0 col-span-12 md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brabus" />
              <span className="font-display uppercase text-[13px] font-medium tracking-[0.083em] text-titanium">Veloce</span>
            </div>
            <p className="text-[14px] leading-[1.8] text-fumo max-w-xs">
              Atelier di personalizzazione moto su misura. Carbonio e titanio
              lavorati a mano per BMW S1000RR e Kawasaki Z900.
            </p>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {items.map((i) =>
                i.to ? (
                  <Link
                    key={i.to}
                    to={i.to}
                    className="font-body text-[11px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors"
                  >
                    {i.label}
                  </Link>
                ) : (
                  <Link
                    key={i.href}
                    to={{ pathname: "/", hash: i.href }}
                    className="font-body text-[11px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors"
                  >
                    {i.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-3 md:text-right">
            <p className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo leading-[1.9]">
              Torino, Italia<br />
              Su appuntamento<br />
              NeuralisAI@outlook.it
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-steel flex flex-col md:flex-row justify-between items-center gap-3 font-body text-[11px] uppercase tracking-[0.083em] text-fumo">
          <div>© 2026 Veloce, atelier di personalizzazione moto.</div>
          <div>Progettato e prodotto in Italia.</div>
        </div>
      </div>
    </footer>
  );
}
