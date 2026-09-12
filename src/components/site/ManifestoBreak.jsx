import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ManifestoBreak() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[85vh] w-full bg-obsidian flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-[1.08]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={`${import.meta.env.BASE_URL}video/hero-s1000rr.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-obsidian/70" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="font-display uppercase text-2xl md:text-4xl font-medium tracking-[0.005em] text-titanium leading-[1.35]">
          {t.manifesto.line1}
          <br />
          {t.manifesto.line2}
        </h2>
      </motion.div>
    </section>
  );
}
