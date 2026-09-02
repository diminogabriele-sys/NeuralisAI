import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "Sistemi", href: "#services" },
    { label: "Logica", href: "#work" },
    { label: "Protocollo", href: "#protocol" },
    { label: "Tech", href: "#tech" },
    { label: "Chi siamo", to: "/about" },
    { label: "Terminale", href: "#contact" },
  ];

  return (
    <footer className="relative border-t border-steel py-20 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-acid rounded-full animate-pulse" />
              <span className="font-display italic text-3xl text-titanium">Neuralis</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Architetti di logica neurale. Automazione AI e interfacce adattive
              per aziende che colonizzano il futuro.
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
                    className="font-mono text-sm text-titanium hover:text-acid transition-colors"
                  >
                    {i.label}
                  </Link>
                ) : (
                  <a
                    key={i.href}
                    href={i.href}
                    className="font-mono text-sm text-titanium hover:text-acid transition-colors"
                  >
                    {i.label}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 md:text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              // Coordinate
            </div>
            <div className="font-mono text-sm text-muted-foreground space-y-1">
              <div>45.0703° N, 7.6869° E</div>
              <div>Torino · Italia</div>
              <div className="text-acid">UPTIME: {time} UTC</div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-steel flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2026 Neuralis Studio — Tutti i diritti riservati
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Costruito con logica · Powered by AI
          </div>
        </div>
      </div>
    </footer>
  );
}