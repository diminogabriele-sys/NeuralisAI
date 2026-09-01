import React from "react";
import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Diagnosi", d: "Mappiamo i processi, identifichiamo le frizioni e quantifichiamo il costo del caos attuale." },
  { n: "02", t: "Architettura", d: "Disegniamo la logica neurale: quali agenti, quali integrazioni, quali interfacce. Un blueprint prima del codice." },
  { n: "03", t: "Deploy", d: "Costruiamo, testiamo e rilasciamo in produzione con monitoraggio continuo. Niente sorprese." },
  { n: "04", t: "Evoluzione", d: "Il sistema impara. Ottimizziamo in base ai dati reali, non alle ipotesi." },
];

export default function Protocol() {
  return (
    <section id="protocol" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-4">
            // Protocollo
          </div>
          <h2 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95] max-w-2xl">
            Come si costruisce<br />un sistema che pensa.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-8 border-t border-steel md:border-t-0 md:border-l first:border-l-0"
            >
              <div className="font-mono text-xs text-acid mb-8">{s.n}</div>
              <h3 className="font-heading font-semibold text-xl text-titanium mb-4">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}