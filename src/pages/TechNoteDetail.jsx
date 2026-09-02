import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ReactMarkdown from "react-markdown";

export default function TechNoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    base44.entities.TechNote
      .get(id)
      .then((data) => {
        if (!active) return;
        if (!data) setNotFound(true);
        else setNote(data);
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-obsidian pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <Link
          to="/#tech"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-acid transition-colors mb-12"
        >
          <span className="w-8 h-px bg-current" />
          <span>Torna a Protocollo Tech</span>
        </Link>

        {loading ? (
          <div className="font-mono text-xs text-muted-foreground">Caricamento...</div>
        ) : notFound ? (
          <div className="font-display italic text-4xl text-muted-foreground">
            Nota non trovata.
          </div>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">
                {note.category}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {note.published_date
                  ? new Date(note.published_date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>

            <h1 className="font-display italic text-4xl md:text-6xl text-titanium leading-[0.95] mb-8 text-balance">
              {note.title}
            </h1>

            {note.cover_url && (
              <div className="mb-12 overflow-hidden border border-steel aspect-[16/9]">
                <Image
                  src={note.cover_url}
                  alt={note.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...p }) => (
                    <h2 className="font-heading font-semibold text-2xl text-titanium mt-10 mb-4" {...p} />
                  ),
                  p: ({ node, ...p }) => (
                    <p className="text-muted-foreground leading-relaxed mb-4" {...p} />
                  ),
                  ul: ({ node, ...p }) => (
                    <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside space-y-1" {...p} />
                  ),
                  ol: ({ node, ...p }) => (
                    <ol className="text-muted-foreground leading-relaxed mb-4 list-decimal list-inside space-y-1" {...p} />
                  ),
                  strong: ({ node, ...p }) => (
                    <strong className="text-titanium font-semibold" {...p} />
                  ),
                }}
              >
                {note.content || ""}
              </ReactMarkdown>
            </div>
          </motion.article>
        )}
      </div>
    </div>
  );
}