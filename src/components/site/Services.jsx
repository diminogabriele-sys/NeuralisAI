import React from "react";
import { motion } from "framer-motion";
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

function ServiceBlock({ title, subtitle, items }) {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 w-full">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-display uppercase text-3xl md:text-5xl text-titanium leading-[1.1] mb-6 break-words">
              {title}
            </h2>
            <p className="text-[13px] leading-[1.78] text-fumo max-w-sm">{subtitle}</p>
          </div>

          <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col gap-px">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group grid grid-cols-12 gap-4 items-start py-8 border-t border-steel hover:border-brabus transition-colors"
              >
                <div className="col-span-1">
                  <item.icon className="w-4 h-4 text-fumo group-hover:text-brabus transition-colors mt-1" strokeWidth={1.5} />
                </div>
                <div className="col-span-11 md:col-span-4">
                  <h3 className="font-display uppercase text-[13px] tracking-[0.015em] text-titanium group-hover:text-brabus transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-[13px] leading-[1.78] text-fumo">{item.desc}</p>
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
        title="Estetica su misura"
        subtitle="Ogni linea è disegnata per la moto e per chi la guida. Materiali nobili, lavorazioni a mano, nessun pezzo di serie."
        items={estetica}
      />
      <div className="border-t border-steel" />
      <ServiceBlock
        title="Performance reale"
        subtitle="La personalizzazione non è solo estetica. Ogni componente è progettato, testato e collaudato per migliorare la moto, non solo il suo aspetto."
        items={performance}
      />
    </section>
  );
}
