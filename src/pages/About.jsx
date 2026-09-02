import React from "react";
import { motion } from "framer-motion";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export default function About() {
  return (
    <div className="relative bg-obsidian min-h-screen">
      <Nav />
      <main>
        <section className="relative py-24 md:py-32 border-b border-steel">
          <div className="mx-auto max-w-[1600px] px-6 md:px-12">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-6">
              // Chi siamo
            </div>
            <h1 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95] max-w-4xl">
              Costruiamo automazioni AI e siti web ad alte prestazioni.
            </h1>
          </div>
        </section>

        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-[1600px] px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 md:gap-12">
              <div className="col-span-12 md:col-span-7 md:col-start-2 space-y-8 text-lg text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-titanium">Neuralis Studio</span> è uno studio
                  digitale con base a Torino che progetta e costruisce sistemi di
                  automazione basati sull'intelligenza artificiale e siti web ad alte
                  prestazioni. Uniamo ingegneria del software, design di prodotto e
                  intelligenza artificiale per trasformare processi aziendali manuali
                  in flussi automatici, misurabili e autonomi, e per realizzare
                  interfacce digitali che convertono visitatori in clienti.
                </p>
                <p>
                  Lavoriamo con aziende che vogliono ridurre i costi operativi,
                  eliminare il lavoro ripetitivo e scalare senza ingrossare il team.
                  Costruiamo <span className="text-titanium">agenti AI</span> che leggono,
                  decidono e agiscono sui dati aziendali in tempo reale, pipeline
                  multi-step che girano 24/7 senza supervisione, e integrazioni che
                  unificano CRM, ERP e strumenti disparati in un'unica spina dorsale
                  logica. Sul fronte web sviluppiamo siti e applicazioni pensati come
                  prodotti AI-native: veloci, accessibili, ottimizzati per i motori
                  di ricerca e progettati per apprendere il comportamento dell'utente
                  e massimizzare la conversione.
                </p>
                <p>
                  <span className="text-titanium">A chi ci rivolgiamo.</span> Alle PMI
                  italiane e internazionali che vogliono modernizzarsi senza ricorrere
                  a grandi team tecnici interni: aziende di servizi, e-commerce,
                  studi professionali, agenzie e startup. Ai team operativi soffocati
                  da attività ripetitive. Ai founder che hanno bisogno di un partner
                  tecnico capace di coprire l'intero ciclo, dalla diagnosi del processo
                  al deploy e all'evoluzione continua del sistema.
                </p>
                <p>
                  <span className="text-titanium">Chi costruisce.</span> Un piccolo team
                  di architetti di logica neurale — sviluppatori, designer e specialisti
                  di automazione AI — che lavorano a stretto contatto con il cliente.
                  Ogni progetto segue un protocollo a quattro fasi: diagnosi del
                  processo, architettura del sistema, deployment e ottimizzazione
                  continua. Crediamo nella logica prima delle opinioni, nella
                  misurabilità di ogni risultato e nella semplicità dell'interfaccia
                  anche dietro a sistemi complessi.
                </p>
                <p>
                  Operiamo da Torino per clienti in tutta Italia e all'estero, in
                  italiano e in inglese. Se un processo può essere automatizzato o un
                  sito può essere più veloce, lo possiamo costruire.
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