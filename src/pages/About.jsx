import React from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export default function About() {
  return (
    <div className="relative bg-obsidian min-h-screen">
      <Nav />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 border-b border-steel">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <h1 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-2xl">
              Costruiamo moto che non esistono altrove
            </h1>
          </div>
        </section>

        <section className="relative py-20 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 md:gap-12">
              <div className="min-w-0 col-span-12 md:col-span-7 md:col-start-2 space-y-7 text-[15px] leading-[1.8] text-fumo">
                <p>
                  <span className="text-titanium">Veloce</span> è un atelier di
                  personalizzazione moto con base a Torino, specializzato nella
                  realizzazione di componenti su misura in carbonio, titanio e
                  alluminio aeronautico. Non produciamo in serie: ogni pezzo nasce
                  da una consulenza dedicata e viene progettato, lavorato e
                  rifinito a mano per una singola moto.
                </p>
                <p>
                  Concentriamo la nostra competenza su due piattaforme che
                  consideriamo tra le più esigenti sul mercato:{" "}
                  <span className="text-titanium">BMW S1000RR</span>, la nostra
                  base per la personalizzazione racing e aerodinamica, e{" "}
                  <span className="text-titanium">Kawasaki Z900</span>, la nostra
                  base per un linguaggio street-luxury fatto di linee pulite e
                  materiali nobili. Su queste due moto abbiamo sviluppato know-how,
                  stampi e fornitori dedicati che ci permettono di garantire una
                  qualità costruttiva impossibile da replicare su commesse generiche.
                </p>
                <p>
                  <span className="text-titanium">A chi ci rivolgiamo.</span>{" "}
                  A motociclisti che vogliono una moto realmente unica: proprietari
                  di S1000RR e Z900 che cercano una personalizzazione estetica di
                  alto livello, riduzione dei pesi, componenti da competizione o
                  una livrea che non troveranno su nessun'altra moto in strada.
                </p>
                <p>
                  <span className="text-titanium">Come lavoriamo.</span> Ogni
                  progetto segue un percorso in quattro fasi: consulenza,
                  progettazione, lavorazione artigianale e collaudo. Selezioniamo
                  materiali da competizione — carbonio 3K/12K, titanio Grado 5,
                  Ergal 7075 — e li lavoriamo internamente o con fornitori
                  specializzati italiani, mantenendo il controllo qualità su ogni
                  fase. Ogni moto che esce dal nostro atelier è numerata e
                  documentata.
                </p>
                <p>
                  Riceviamo su appuntamento a Torino e seguiamo clienti in tutta
                  Italia. Se possiedi una S1000RR o una Z900 e vuoi trasformarla
                  in un pezzo unico, siamo pronti ad ascoltare il tuo progetto.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
