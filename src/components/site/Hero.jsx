import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full bg-obsidian flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,_rgba(184,135,74,0.08)_0%,_transparent_55%)]" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-12 w-full pb-24 md:pb-32 pt-40">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-normal text-4xl sm:text-5xl md:text-6xl leading-[1.15] text-titanium text-balance"
          >
            Ogni moto che esce dal nostro atelier porta un numero,
            non una targa di serie.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-lg text-[15px] md:text-base leading-[1.8] text-fumo"
          >
            Lavoriamo carbonio e titanio a mano, su commissione, per due
            piattaforme che conosciamo a fondo: la BMW S1000RR e la Kawasaki
            Z900. Nessuna produzione in serie — <a href="#modelli" className="text-titanium underline decoration-ottone/50 underline-offset-4 hover:decoration-ottone">guarda cosa nasce dal banco di lavoro</a>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <a
              href="#contact"
              className="inline-block bg-ottone text-obsidian font-body text-[14px] font-medium px-7 py-3.5 rounded-sm hover:bg-titanium transition-colors"
            >
              Prenota una consulenza
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
