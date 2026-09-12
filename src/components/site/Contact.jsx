import React, { useState } from "react";
import { motion } from "framer-motion";

const models = ["BMW S1000RR", "Kawasaki Z900", "Altra moto"];
const RECIPIENT = "NeuralisAI@outlook.it";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", model: models[0], message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    const subject = `Richiesta consulenza — ${form.name}`;
    const body =
      `Nome: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Moto: ${form.model}\n\n` +
      `Progetto:\n${form.message}`;

    const mailtoUrl = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setSent(true);
  };

  return (
    <section id="contact" className="relative py-24 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="min-w-0 col-span-12 md:col-span-5">
            <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] mb-6">
              Iniziamo a disegnarla
            </h2>
            <p className="text-[15px] leading-[1.8] text-fumo max-w-md mb-8">
              Raccontaci la tua moto e la tua visione. Compila il modulo: si aprirà
              il tuo programma di posta con la richiesta già pronta da inviare.
              Rispondiamo entro 24 ore, di solito prima.
            </p>
            <p className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo leading-[1.9]">
              {RECIPIENT}<br />
              Riceviamo su appuntamento a Torino.
            </p>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-6 md:col-start-7">
            <div className="bg-carbonfiber p-6 md:p-10">
              {!sent ? (
                <form onSubmit={submit} className="space-y-6">
                  <Field
                    label="Nome e cognome"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Il tuo nome"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="tu@email.com"
                    required
                  />
                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-2">
                      Moto
                    </label>
                    <select
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full bg-transparent border-b border-steel focus:border-brabus outline-none py-2 text-titanium transition-colors"
                    >
                      {models.map((m) => (
                        <option key={m} value={m} className="bg-obsidian">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-2">
                      Il tuo progetto
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Descrivi lo stile, le lavorazioni o le ispirazioni che hai in mente..."
                      required
                      rows={4}
                      className="w-full bg-transparent border-b border-steel focus:border-brabus outline-none py-2 text-titanium placeholder:text-fumo/60 resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 border border-steel text-titanium font-body text-[12px] uppercase tracking-[0.083em] hover:border-brabus hover:text-brabus transition-colors"
                  >
                    Richiedi consulenza
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <div className="font-display uppercase text-lg font-medium tracking-[0.01em] text-titanium mb-4">Quasi fatto</div>
                  <p className="text-[15px] leading-[1.8] text-fumo">
                    Abbiamo aperto il tuo programma di posta con la richiesta
                    pronta: premi invia per completarla.
                  </p>
                </motion.div>
              )}
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
      <label className="block font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b border-steel focus:border-brabus outline-none py-2 text-titanium placeholder:text-fumo/60 transition-colors"
      />
    </div>
  );
}
