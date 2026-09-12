import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const links = [
  { label: "Modelli", href: "#modelli" },
  { label: "Personalizzazioni", href: "#servizi" },
  { label: "Materiali", href: "#materiali" },
  { label: "Processo", href: "#processo" },
  { label: "Chi siamo", to: "/about" },
  { label: "Contatti", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-6 bg-transparent">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ottone" />
            <span className="font-display italic text-xl text-titanium">Veloce</span>
          </a>

          <nav className="hidden md:flex items-center gap-9">
            {links.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="font-body text-[14px] text-titanium/80 hover:text-titanium transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.href}
                  to={{ pathname: "/", hash: l.href }}
                  className="font-body text-[14px] text-titanium/80 hover:text-titanium transition-colors"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[6px] z-[70]"
            aria-label="Apri menu"
          >
            <span className="block w-6 h-px bg-titanium" />
            <span className="block w-6 h-px bg-titanium" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-obsidian/80 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[65] w-full max-w-sm bg-obsidian flex flex-col justify-between px-8 py-10 border-l border-steel md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-display italic text-xl text-titanium">Veloce</span>
                <button
                  onClick={() => setOpen(false)}
                  className="relative w-8 h-8 flex items-center justify-center group"
                  aria-label="Chiudi menu"
                >
                  <span className="absolute w-6 h-px bg-titanium rotate-45 transition-colors group-hover:bg-ottone" />
                  <span className="absolute w-6 h-px bg-titanium -rotate-45 transition-colors group-hover:bg-ottone" />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to || l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {l.to ? (
                      <Link to={l.to} className="font-display italic text-3xl text-titanium hover:text-ottone transition-colors">
                        {l.label}
                      </Link>
                    ) : (
                      <Link to={{ pathname: "/", hash: l.href }} className="font-display italic text-3xl text-titanium hover:text-ottone transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="pt-6 border-t border-steel font-body text-[13px] text-fumo">
                Riceviamo su appuntamento a Torino. Scrivici a NeuralisAI@outlook.it.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
