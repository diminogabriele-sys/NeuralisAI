import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, Layers, Workflow, Bot, Globe, Sparkles } from "lucide-react";

const autonomous = [
  { icon: Workflow, title: "Pipeline Automate", desc: "Orchestrazione di processi multi-step che girano senza supervisione umana, 24/7." },
  { icon: Bot, title: "Agenti Intelligenti", desc: "Agenti AI che leggono, decidono ed agiscono sui tuoi dati aziendali in tempo reale." },
  { icon: Cpu, title: "Integrazione Sistemi", desc: "Collegamento di CRM, ERP e tool disparati in un'unica spina dorsale logica." },
];

const adaptive = [
  { icon: Globe, title: "Siti Web Adattivi", desc: "Interfacce che apprendono il comportamento utente e si riorganizzano per massimizzare la conversione." },
  { icon: Layers, title: "Design Systems", desc: "Architetture di componente scalabili, dal prototipo al deploy, con coerenza assoluta." },
  { icon: Sparkles, title: "Esperienze AI-Native", desc: "Chat, assistenti e tool interattivi integrati nativamente nel flusso del prodotto." },
];

function ServiceBlock({ index, label, title, subtitle, items, accent }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className="min-h-screen flex items-center py-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 w-full">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <motion.div style={{ y }} className="col-span-12 md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-6">
              [{String(index).padStart(2, "0")}]
            </div>
            <h2 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95] mb-6">
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
                className="group grid grid-cols-12 gap-4 items-start py-8 border-t border-steel hover:border-acid/40 transition-colors"
              >
                <div className="col-span-1">
                  <item.icon className="w-5 h-5 text-acid mt-1" strokeWidth={1.5} />
                </div>
                <div className="col-span-11 md:col-span-4">
                  <h3 className="font-heading font-semibold text-xl text-titanium group-hover:text-acid transition-colors">
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
    <section id="services" className="relative">
      <div className="border-t border-steel" />
      <ServiceBlock
        index={1}
        label="Autonomous"
        title="Sistemi Autonomi"
        subtitle="L'automazione che elimina il caos operativo. Processi che girano in background, agenti che prendono decisioni, integrazioni che unificano il tuo stack."
        items={autonomous}
      />
      <div className="border-t border-steel" />
      <ServiceBlock
        index={2}
        label="Adaptive"
        title="Interfacce Adattive"
        subtitle="Il web non è più statico. Costruiamo interfacce che apprendono, si adattano e convertono — pensate come prodotti AI-native, non come pagine."
        items={adaptive}
      />
    </section>
  );
}