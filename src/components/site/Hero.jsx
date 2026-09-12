import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full bg-obsidian flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/hero-s1000rr.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 w-full text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="font-body text-[11px] uppercase tracking-[0.091em] text-fumo mb-5"
        >
          Atelier di personalizzazione
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-display uppercase text-lg md:text-2xl font-medium tracking-[0.005em] text-titanium max-w-2xl mx-auto"
        >
          BMW S1000RR e Kawasaki Z900, lavorate a mano in carbonio e titanio
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-10"
        >
          <a
            href="#contact"
            className="font-body text-[12px] uppercase tracking-[0.083em] text-titanium border-b border-transparent hover:text-brabus hover:border-brabus pb-[5px] transition-colors"
          >
            Prenota una consulenza
          </a>
        </motion.div>
      </div>
    </section>
  );
}
