import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layers, Flame, CircleDot, Palette, Cog, ShieldCheck } from "lucide-react";

const estetica = [
  { icon: Layers, title: "Carbonio a vista", desc: "Carenature, codini e cover realizzati in fibra di carbonio 3K e 12K, stampati in autoclave e rifiniti a mano." },
  { icon: Palette, title: "Verniciature esclusive", desc: "Livree disegnate su misura e dipinte a mano, numerate e mai replicate su un'altra moto." },
  { icon: CircleDot, title: "Cerchi forgiati", desc: "Ruote forgiate ultraleggere che riducono le masse non sospese e trasformano la guidabilità." },
];

const performance = [
  { icon: Flame, title: "Scarichi in titanio", desc: "Impianti completi in titanio Grado 5, lavorati per peso, sonorità ed erogazione." },
  { icon: Cog, title: "Elettronica dedicata", desc: "Centraline e mappature su misura, sviluppate per ogni singola configurazione meccanica." },
  { icon: ShieldCheck, title: "Collaudo e garanzia", desc: "Ogni componente è collaudato su strada e coperto da garanzia artigianale sulla lavorazione." },
];

function ServiceBlock({ index, title, subtitle, items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={ref} className="py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 w-full">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <motion.div style={{ y }} className="col-span-12 md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-brabus mb-6">
              [{String(index).padStart(2, "0")}]
            </div>
            <h2 className="font-display uppercase text-4xl md:text-6xl text-titanium leading-[0.95] mb-6 break-words">
              {title}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">{subtitle}</p>
          </motion.div>

          <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col gap-px">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group grid grid-cols-12 gap-4 items-start py-8 border-t border-steel hover:border-brabus/40 transition-colors"
              >
                <div className="col-span-1">
                  <item.icon className="w-5 h-5 text-brabus mt-1" strokeWidth={1.5} />
                </div>
                <div className="col-span-11 md:col-span-4">
                  <h3 className="font-heading font-semibold text-xl text-titanium group-hover:text-brabus transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
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
        index={1}
        title="Estetica su misura"
        subtitle="Ogni linea è disegnata per la moto e per chi la guida. Materiali nobili, lavorazioni a mano, nessun pezzo di serie."
        items={estetica}
      />
      <div className="border-t border-steel" />
      <ServiceBlock
        index={2}
        title="Performance reale"
        subtitle="La personalizzazione non è solo estetica. Ogni componente è progettato, testato e collaudato per migliorare la moto, non solo il suo aspetto."
        items={performance}
      />
    </section>
  );
}
