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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-4 backdrop-blur-md bg-obsidian/70 border-b border-steel/60" : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <span className="w-2 h-2 bg-brabus group-hover:scale-150 transition-transform" />
            <span className="font-display uppercase tracking-[0.15em] text-xl text-titanium">Veloce</span>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest hidden sm:inline">/ ATELIER</span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brabus transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.href}
                  to={{ pathname: "/", hash: l.href }}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brabus transition-colors"
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
            <span className="block w-6 h-px bg-titanium origin-center transition-all duration-300" />
            <span className="block w-4 h-px bg-brabus self-end transition-all duration-300" />
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
              className="fixed inset-0 z-[55] bg-obsidian/70 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[65] w-full max-w-sm bg-obsidian flex flex-col justify-between px-8 py-10 border-l border-steel carbon md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brabus animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">/ ATELIER</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="relative w-8 h-8 flex items-center justify-center group"
                  aria-label="Chiudi menu"
                >
                  <span className="absolute w-6 h-px bg-titanium rotate-45 transition-colors group-hover:bg-brabus" />
                  <span className="absolute w-6 h-px bg-titanium -rotate-45 transition-colors group-hover:bg-brabus" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to || l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-baseline gap-3 py-1"
                  >
                    <span className="font-mono text-xs text-brabus shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {l.to ? (
                      <Link to={l.to} className="font-display uppercase text-2xl sm:text-3xl text-titanium group-hover:text-brabus transition-colors break-words">
                        {l.label}
                      </Link>
                    ) : (
                      <Link to={{ pathname: "/", hash: l.href }} className="font-display uppercase text-2xl sm:text-3xl text-titanium group-hover:text-brabus transition-colors break-words">
                        {l.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <div className="h-px bg-steel" />
                <div className="flex justify-between">
                  <span>Torino · Su appuntamento</span>
                  <span className="text-brabus">NeuralisAI@outlook.it</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
