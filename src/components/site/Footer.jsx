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
    <footer className="relative border-t border-steel py-20 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-brabus" />
              <span className="font-display uppercase tracking-[0.15em] text-3xl text-titanium">Veloce</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Atelier di personalizzazione moto su misura. Carbonio e titanio
              lavorati a mano per BMW S1000RR e Kawasaki Z900.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              // Mappa
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {items.map((i) =>
                i.to ? (
                  <Link
                    key={i.to}
                    to={i.to}
                    className="font-mono text-sm text-titanium hover:text-brabus transition-colors"
                  >
                    {i.label}
                  </Link>
                ) : (
                  <Link
                    key={i.href}
                    to={{ pathname: "/", hash: i.href }}
                    className="font-mono text-sm text-titanium hover:text-brabus transition-colors"
                  >
                    {i.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 md:text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              // Atelier
            </div>
            <div className="font-mono text-sm text-muted-foreground space-y-1">
              <div>Torino · Italia</div>
              <div>Su appuntamento</div>
              <div className="text-brabus">NeuralisAI@outlook.it</div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-steel flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2026 Veloce Custom Moto Atelier — Tutti i diritti riservati
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Progettato e prodotto in Italia
          </div>
        </div>
      </div>
    </footer>
  );
}
