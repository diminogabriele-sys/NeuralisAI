import React from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="relative bg-obsidian min-h-screen">
      <Nav />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 border-b border-steel">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12 text-center">
            <h1 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-2xl mx-auto">
              {t.about.h1}
            </h1>
          </div>
        </section>

        <section className="relative py-20 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 md:gap-12">
              <div className="min-w-0 col-span-12 md:col-span-7 md:col-start-2 space-y-7 text-[15px] leading-[1.8] text-fumo">
                <p>
                  <span className="text-titanium">Veloce</span>{t.about.p1}
                </p>
                <p>
                  {t.about.p2Before}
                  <span className="text-titanium">BMW S1000RR</span>
                  {t.about.p2Mid}
                  <span className="text-titanium">Kawasaki Z900</span>
                  {t.about.p2After}
                </p>
                <p>{t.about.p3}</p>
                <p>{t.about.p4}</p>
                <p>{t.about.p5}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
