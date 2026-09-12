import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const RECIPIENT = "NeuralisAI@outlook.it";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", brand: "", model: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    const subject = `${t.contact.mail.subjectPrefix} ${form.name}`;
    const body =
      `${t.contact.mail.labelName}: ${form.name}\n` +
      `${t.contact.mail.labelEmail}: ${form.email}\n` +
      `${t.contact.mail.labelBike}: ${form.brand} ${form.model}\n\n` +
      `${t.contact.mail.labelProject}:\n${form.message}`;

    const mailtoUrl = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setSent(true);
  };

  return (
    <section id="contact" className="relative py-24 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="min-w-0 col-span-12 md:col-span-5 text-center md:text-left">
            <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] mb-6">
              {t.contact.heading}
            </h2>
            <p className="text-[15px] leading-[1.8] text-fumo max-w-md mx-auto md:mx-0 mb-8">
              {t.contact.intro}
            </p>
            <p className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo leading-[1.9]">
              {RECIPIENT}<br />
              {t.contact.addressNote}
            </p>
          </div>

          <div className="min-w-0 col-span-12 md:col-span-6 md:col-start-7">
            <div className="bg-carbonfiber p-6 md:p-10">
              {!sent ? (
                <form onSubmit={submit} className="space-y-6">
                  <Field
                    label={t.contact.fields.name}
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder={t.contact.fields.namePh}
                    required
                  />
                  <Field
                    label={t.contact.fields.email}
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder={t.contact.fields.emailPh}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label={t.contact.fields.brand}
                      value={form.brand}
                      onChange={(v) => setForm({ ...form, brand: v })}
                      placeholder={t.contact.fields.brandPh}
                      required
                    />
                    <Field
                      label={t.contact.fields.model}
                      value={form.model}
                      onChange={(v) => setForm({ ...form, model: v })}
                      placeholder={t.contact.fields.modelPh}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-2">
                      {t.contact.fields.project}
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t.contact.fields.projectPh}
                      required
                      rows={4}
                      className="w-full bg-transparent border-b border-steel focus:border-brabus outline-none py-2 text-titanium placeholder:text-fumo/60 resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 border border-steel text-titanium font-body text-[12px] uppercase tracking-[0.083em] hover:border-brabus hover:text-brabus transition-colors"
                  >
                    {t.contact.submit}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <div className="font-display uppercase text-lg font-medium tracking-[0.01em] text-titanium mb-4">{t.contact.sentTitle}</div>
                  <p className="text-[15px] leading-[1.8] text-fumo">
                    {t.contact.sentBody}
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
