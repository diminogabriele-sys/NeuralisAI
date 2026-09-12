import React from "react";
import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Consulenza", d: "Analizziamo la tua moto, il tuo stile di guida e le tue aspettative. Definiamo insieme la direzione estetica e tecnica del progetto." },
  { n: "02", t: "Progettazione", d: "Disegniamo ogni componente su misura: rendering, scelta dei materiali e validazione tecnica prima di avviare la lavorazione." },
  { n: "03", t: "Lavorazione", d: "Carbonio, titanio e alluminio prendono forma nel nostro reparto artigianale. Ogni pezzo è realizzato e rifinito a mano." },
  { n: "04", t: "Collaudo e consegna", d: "Montaggio, collaudo su strada e consegna della moto pronta, numerata e coperta da garanzia artigianale." },
];

export default function Process() {
  return (
    <section id="processo" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-brabus mb-4">
            // Il Processo
          </div>
          <h2 className="font-display uppercase text-4xl md:text-7xl text-titanium leading-[0.95] max-w-2xl break-words">
            Dall'idea alla moto<br />che non esiste altrove.
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
              <div className="font-mono text-xs text-brabus mb-8">{s.n}</div>
              <h3 className="font-heading font-semibold text-xl text-titanium mb-4">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
