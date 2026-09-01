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
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Apri menu"
          >
            <span className="w-6 h-px bg-titanium" />
            <span className="w-6 h-px bg-titanium" />
            <span className="w-4 h-px bg-acid" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-obsidian flex flex-col justify-center px-8"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-8 right-8 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-acid"
            >
              [Chiudi]
            </button>
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="font-display italic text-5xl text-titanium hover:text-acid transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}