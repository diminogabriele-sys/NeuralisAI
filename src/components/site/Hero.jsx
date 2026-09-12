import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full bg-obsidian flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(218,41,28,0.08)_0%,_transparent_55%)]" />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-body text-[11px] uppercase tracking-[0.091em] text-fumo mb-8"
        >
          Atelier di Personalizzazione — Serie Limitata
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="font-display uppercase text-3xl sm:text-4xl md:text-6xl leading-[1.1] text-titanium tracking-[0.005em] text-balance"
        >
          La tua moto,<br />
          nessun compromesso
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 max-w-lg mx-auto text-[13px] leading-[1.78] text-fumo text-balance"
        >
          Componenti su misura in carbonio e titanio, progettati e lavorati a mano
          per due piattaforme d'eccellenza: BMW S1000RR e Kawasaki Z900. Ogni pezzo
          è unico, numerato e costruito per chi non accetta di guidare una moto
          uguale a tutte le altre.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <a
            href="#contact"
            className="font-body text-[12px] uppercase tracking-[0.083em] text-titanium hover:text-brabus transition-colors"
          >
            Richiedi una consulenza →
          </a>
          <a
            href="#modelli"
            className="font-body text-[12px] uppercase tracking-[0.083em] text-fumo hover:text-brabus transition-colors"
          >
            Scopri le piattaforme
          </a>
        </motion.div>
      </div>
    </section>
  );
}
