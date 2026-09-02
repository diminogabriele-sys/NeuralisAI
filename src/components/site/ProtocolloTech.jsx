import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

const categoryColors = {
  Automazione: "text-acid",
  AI: "text-acid",
  Web: "text-acid",
  "Tech News": "text-acid",
};

export default function ProtocolloTech() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    base44.entities.TechNote
      .list("-published_date", 20)
      .then((data) => active && setNotes(data))
      .catch(() => active && setNotes([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="tech" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-12 mb-16">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-4">
              // Protocollo Tech
            </div>
            <h2 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95]">
              Note dal<br />sottosistema.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-7 flex items-end">
            <p className="text-muted-foreground leading-relaxed">
              Brevi approfondimenti tecnici sulle automazioni che costruiamo e
              sui segnali che arrivano dal mondo tech. Logica, non opinioni.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="font-mono text-xs text-muted-foreground">Caricamento note...</div>
        ) : notes.length === 0 ? (
          <div className="font-mono text-xs text-muted-foreground">
            Nessuna nota pubblicata. Torna presto.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border-t border-steel">
            {notes.map((n, i) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                className="group relative p-8 border-steel hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${categoryColors[n.category] || "text-acid"}`}>
                    {n.category}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {n.published_date
                      ? new Date(n.published_date).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "short",
                        })
                      : ""}
                  </span>
                </div>

                {n.cover_url && (
                  <div className="mb-6 overflow-hidden border border-steel aspect-[16/9]">
                    <Image
                      src={n.cover_url}
                      alt={n.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                )}

                <h3 className="font-display italic text-3xl text-titanium group-hover:text-acid transition-colors leading-tight mb-3">
                  {n.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {n.excerpt}
                </p>

                <Link
                  to={`/tech/${n.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Leggi: ${n.title}`}
                />
                <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-acid opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span>Leggi</span>
                  <span className="w-8 h-px bg-acid" />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}