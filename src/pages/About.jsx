import React from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export default function About() {
  return (
    <div className="relative carbon-weave min-h-screen">
      <Nav />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 border-b border-steel">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12 text-center">
            <h1 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-2xl mx-auto">
              Solo carbonio, solo su due moto
            </h1>
          </div>
        </section>

        <section className="relative py-20 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 md:gap-12">
              <div className="min-w-0 col-span-12 md:col-span-7 md:col-start-2 space-y-7 text-[15px] leading-[1.8] text-fumo">
                <p>
                  <span className="text-titanium">Veloce</span> è un laboratorio
                  di Torino specializzato nella realizzazione di componenti in
                  fibra di carbonio su misura. Non produciamo in serie: ogni
                  pezzo nasce da una consulenza dedicata e viene stampato,
                  tagliato e rifinito a mano.
                </p>
                <p>
                  Lavoriamo esclusivamente carbonio — carenature, codini, cover
                  e parafanghi — e nient'altro: non realizziamo scarichi, cerchi
                  o interventi sulla meccanica della moto. Concentriamo tutta la
                  nostra competenza su due piattaforme che conosciamo a fondo:{" "}
                  <span className="text-titanium">BMW S1000RR</span> e{" "}
                  <span className="text-titanium">Kawasaki Z900</span>. Su
                  queste due moto abbiamo sviluppato stampi dedicati che ci
                  permettono di garantire un accoppiamento perfetto con la
                  carrozzeria originale.
                </p>
                <p>
                  A chi ci rivolgiamo. A proprietari di S1000RR e Z900 che
                  vogliono ridurre il peso della moto e ottenere una carrozzeria
                  in carbonio dal disegno pulito, senza compromessi di
                  accoppiamento tipici dei pezzi non dedicati al modello.
                </p>
                <p>
                  Come lavoriamo. Ogni progetto segue un percorso in quattro
                  fasi: consulenza, progettazione, lavorazione del carbonio e
                  controllo qualità prima della consegna. Ogni componente è
                  numerato e coperto da garanzia artigianale sulla lavorazione.
                </p>
                <p>
                  Riceviamo su appuntamento a Torino e spediamo in tutta Italia.
                  Se possiedi una S1000RR o una Z900, raccontaci quali
                  componenti vuoi realizzare in carbonio.
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
