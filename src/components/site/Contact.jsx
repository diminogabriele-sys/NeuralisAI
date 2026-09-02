import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function Contact() {
  const [lines, setLines] = useState([
    { type: "sys", text: "neuralis@terminal:~$ Inizializza sessione di contatto" },
    { type: "sys", text: "Compila i parametri. Il sistema elaborerà la richiesta." },
  ]);
  const [form, setForm] = useState({ name: "", email: "", project: "" });
  const [deployed, setDeployed] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setLines((l) => [
      ...l,
      { type: "in", text: `> name: ${form.name}` },
      { type: "in", text: `> email: ${form.email}` },
      { type: "in", text: `> project: ${form.project.slice(0, 60)}...` },
      { type: "sys", text: "Elaborazione..." },
    ]);

    try {
      const res = await base44.functions.invoke("submitContact", {
        name: form.name,
        email: form.email,
        project: form.project,
      });
      if (res.data?.ok) {
        setLines((l) => [
          ...l,
          { type: "ok", text: "✓ Deploy riuscito. Richiesta trasmessa al team." },
          { type: "ok", text: "Risposta prevista entro 24h." },
        ]);
        setDeployed(true);
      } else {
        setLines((l) => [
          ...l,
          { type: "err", text: "✗ " + (res.data?.error || "Errore di trasmissione.") },
        ]);
      }
    } catch {
      setLines((l) => [
        ...l,
        { type: "err", text: "✗ Errore di trasmissione. Riprova." },
      ]);
    }
    setSending(false);
  };

  const color = (t) =>
    t === "sys" ? "text-muted-foreground" : t === "in" ? "text-titanium" : t === "ok" ? "text-acid" : "text-red-400";

  return (
    <section id="contact" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-4">
              // Conversion Terminal
            </div>
            <h2 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95] mb-8">
              Inizia la tua<br />automazione.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-10">
              Niente moduli infiniti. Raccontaci il problema, noi torniamo con
              un'architettura. Primo contatto entro 24 ore.
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex gap-3 text-muted-foreground">
                <span className="text-acid">→</span> NeuralisAI@outlook.it
              </div>
              <div className="flex gap-3 text-muted-foreground">
                <span className="text-acid">→</span> Torino · Remoto · Worldwide
              </div>
              <div className="flex gap-3 text-muted-foreground">
                <span className="text-acid">→</span> Risposta media: 14h
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <div className="border border-steel bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-steel">
                <span className="w-2.5 h-2.5 rounded-full bg-steel" />
                <span className="w-2.5 h-2.5 rounded-full bg-steel" />
                <span className="w-2.5 h-2.5 rounded-full bg-acid" />
                <span className="ml-3 font-mono text-[10px] text-muted-foreground tracking-widest">
                  neuralis — bash
                </span>
              </div>

              <div className="p-6 md:p-8 font-mono text-sm min-h-[320px]">
                <div className="space-y-1.5 mb-6">
                  <AnimatePresence>
                    {lines.map((l, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${color(l.type)} ${l.type === "sys" ? "text-muted-foreground" : ""}`}
                      >
                        {l.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {!deployed ? (
                  <form onSubmit={submit} className="space-y-5">
                    <Field
                      label="nome"
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      placeholder="Il tuo nome"
                      required
                    />
                    <Field
                      label="email"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder="tu@azienda.com"
                      required
                    />
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        progetto
                      </label>
                      <textarea
                        value={form.project}
                        onChange={(e) => setForm({ ...form, project: e.target.value })}
                        placeholder="Descrivi il problema da automatizzare..."
                        required
                        rows={3}
                        className="w-full bg-transparent border-b border-steel focus:border-acid outline-none py-2 text-titanium placeholder:text-muted-foreground/50 resize-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-4 bg-acid text-obsidian font-mono text-xs uppercase tracking-[0.2em] hover:bg-acid/80 disabled:opacity-50 transition-colors"
                    >
                      {sending ? "Deploy in corso..." : "$ deploy --request"}
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="font-display italic text-3xl text-acid mb-4">Deploy riuscito.</div>
                    <p className="text-muted-foreground text-sm">
                      Il team ha ricevuto la richiesta. Controlla la tua email.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b border-steel focus:border-acid outline-none py-2 text-titanium placeholder:text-muted-foreground/50 transition-colors"
      />
    </div>
  );
}