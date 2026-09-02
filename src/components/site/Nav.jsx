import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Sistemi", href: "#services" },
  { label: "Logica", href: "#work" },
  { label: "Protocollo", href: "#protocol" },
  { label: "Terminale", href: "#contact" },
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
          scrolled ? "py-4 backdrop-blur-md bg-obsidian/60 border-b border-steel/40" : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 group">
            <span className="w-2 h-2 bg-acid rounded-full group-hover:scale-150 transition-transform" />
            <span className="font-display italic text-xl text-titanium">Neuralis</span>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest hidden sm:inline">/SYS</span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-acid transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[6px] z-[70]"
            aria-label="Apri menu"
          >
            <span className="block w-6 h-px bg-titanium origin-center transition-all duration-300" />
            <span className="block w-4 h-px bg-acid self-end transition-all duration-300" />
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
              className="fixed inset-0 z-[55] bg-obsidian/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[65] w-full max-w-sm bg-obsidian flex flex-col justify-between px-8 py-10 border-l border-steel grain md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-acid rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">/SYS</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="relative w-8 h-8 flex items-center justify-center group"
                  aria-label="Chiudi menu"
                >
                  <span className="absolute w-6 h-px bg-titanium rotate-45 transition-colors group-hover:bg-acid" />
                  <span className="absolute w-6 h-px bg-titanium -rotate-45 transition-colors group-hover:bg-acid" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-baseline gap-3 py-1"
                  >
                    <span className="font-mono text-xs text-acid">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display italic text-5xl text-titanium group-hover:text-acid transition-colors">
                      {l.label}
                    </span>
                  </motion.a>
                ))}
              </nav>

              <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <div className="h-px bg-steel" />
                <div className="flex justify-between">
                  <span>Torino · Remoto</span>
                  <span className="text-acid">NeuralisAI@outlook.it</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}