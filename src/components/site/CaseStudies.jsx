import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

const cases = [
  {
    id: "01",
    client: "FinTech Scale-up",
    title: "Pipeline di credito automatizzata",
    desc: "Agente AI che analizza domande di finanziamento, cross-referenzia dati e restituisce una decisione in 40 secondi.",
    kpis: [{ v: "+40%", l: "Efficienza" }, { v: "-20h", l: "Lavoro/settimana" }, { v: "92%", l: "Accuratezza" }],
    img: "https://media.base44.com/images/public/6a97254d27e8e1fef9e64cf1/ffe84e8ad_generated_9e30e480.jpg",
  },
  {
    id: "02",
    client: "E-commerce Premium",
    title: "Interfaccia adattiva di conversione",
    desc: "Sito che riorganizza layout e copy in base al profilo comportamentale del visitatore, in tempo reale.",
    kpis: [{ v: "+38%", l: "Conversione" }, { v: "-2.4s", l: "Tempo bounce" }, { v: "1.8x", l: "AOV" }],
    img: "https://media.base44.com/images/public/6a97254d27e8e1fef9e64cf1/b386437aa_generated_fb09c2b9.jpg",
  },
  {
    id: "03",
    client: "Studio Legale",
    title: "Assistente documentale neurale",
    desc: "Sistema che legge contratti, estrae clausole critiche e genera report strutturati per i soci dello studio.",
    kpis: [{ v: "-65%", l: "Tempo review" }, { v: "4.2k", l: "Doc/mese" }, { v: "0", l: "Errori critici" }],
    img: "https://media.base44.com/images/public/6a97254d27e8e1fef9e64cf1/a60bd5e12_generated_1ca2b90f.jpg",
  },
];

function CaseCard({ data, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative aspect-[4/5] md:aspect-[16/10] overflow-hidden border border-steel"
    >
      <Image
        src={data.img}
        alt={data.title}
        fittingType="fill"
        className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
          hovered ? "grayscale-0" : "grayscale brightness-50"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
        <span className="font-mono text-xs text-acid tracking-widest">[{data.id}]</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {data.client}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="font-display italic text-2xl md:text-4xl text-titanium leading-tight mb-3">
          {data.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-0 group-hover:mb-4 transition-all duration-500 overflow-hidden max-h-0 group-hover:max-h-24">
          {data.desc}
        </p>

        <div className="grid grid-cols-3 gap-4 max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500 delay-100">
          {data.kpis.map((k) => (
            <div key={k.l} className="border-l border-acid/40 pl-3">
              <div className="font-display italic text-2xl md:text-3xl text-acid">{k.v}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                {k.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function CaseStudies() {
  return (
    <section id="work" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-4">
              // The Logic Lab
            </div>
            <h2 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95]">
              Prova<br />tangibile.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-muted-foreground leading-relaxed">
              Ogni progetto è un deploy di logica in produzione. Questi sono i
              sistemi che girano oggi, nei server dei nostri clienti.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
          {cases.map((c, i) => (
            <CaseCard key={c.id} data={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}