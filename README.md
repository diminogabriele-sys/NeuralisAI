# Neuralis Studio

Sito web di **Neuralis Studio**, studio digitale con base a Torino che si occupa di automazioni AI e siti web.
Progetto personale di [Gabriele Dimino](https://github.com/diminogabriele-sys), studente di Ingegneria Informatica.

Oltre alle pagine di presentazione, il sito contiene **Protocollo Tech**: una sezione di approfondimenti tecnici
che si aggiorna da sola ogni giorno grazie a un'automazione basata su un modello linguistico (LLM).

## Funzionalità

- **Sito responsive** con home a sezioni (servizi, metodo di lavoro, casi studio, calcolo ROI, contatti),
  pagina "Chi siamo" ottimizzata per la SEO e menu mobile con drawer animato.
- **Protocollo Tech**: ogni giorno un flusso automatico
  1. elimina gli articoli più vecchi di 30 giorni (`cleanupOldTechNotes`);
  2. chiede a un LLM, con ricerca web attiva, di scegliere una notizia tech del giorno e scrivere un breve
     approfondimento in italiano (`generateTechNews`);
  3. valida la risposta con uno **schema JSON** (titolo, estratto, contenuto in markdown, categoria) e la salva nel database.
- **Pagina di dettaglio** per ogni articolo, con rendering del markdown.
- **Modulo contatti** a tema "terminale": una funzione backend valida i dati e inoltra la richiesta via email (`submitContact`).
- **Autenticazione** (registrazione, login, recupero password) e rotte protette; le funzioni di gestione dei contenuti
  sono riservate agli amministratori.

## Stack

| Area | Tecnologie |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, React Router, TanStack Query |
| Backend | Funzioni serverless in TypeScript (runtime Deno) su [Base44](https://base44.com) |
| Dati | Entità Base44 con regole di accesso per ruolo |
| AI | Integrazione LLM con output strutturato (JSON Schema) e contesto da web |
| Automazione | Workflow schedulato giornaliero (`base44/workflows`) |
| Strumenti | Git, GitHub, ESLint |

Il progetto è stato sviluppato con il supporto di strumenti di sviluppo assistito dall'AI.

## Struttura

```
src/
  pages/              Home, Chi siamo, dettaglio articolo, pagine di autenticazione
  components/site/    Sezioni della home (Hero, Services, Protocol, CaseStudies, ROI, ProtocolloTech, Contact, ...)
  components/ui/      Componenti UI riutilizzabili (shadcn/ui)
  lib/                Contesto di autenticazione, client per le query, utilità
base44/
  entities/           Schema dei dati (TechNote, User)
  functions/          Funzioni backend: generateTechNews, cleanupOldTechNotes, submitContact
  workflows/          Automazione giornaliera "Protocollo Tech Auto"
```

## Avvio in locale

Prerequisiti: Node.js, [Deno](https://docs.deno.com/runtime/getting_started/installation/) e la CLI di Base44.

```bash
npm install
npm install -g base44@latest
base44 login   # una volta per macchina
base44 link    # una volta per ogni clone: crea base44/.app.jsonc (escluso da git)
base44 dev     # avvia backend locale e frontend insieme
```

Apri l'indirizzo stampato da `base44 dev` (di solito `http://localhost:5173`).

Note:

- Non avviare `npm run dev` insieme a `base44 dev`: il frontend viene già avviato da `base44 dev`
  (vedi `site.serveCommand` in `base44/config.jsonc`). Da solo, `npm run dev` mostra un'interfaccia senza backend.
- L'app deve essere stata pubblicata almeno una volta perché l'interfaccia si carichi in locale.
- In locale i dati delle entità sono **solo in memoria** e si azzerano a ogni riavvio di `base44 dev`.
- `base44 dev --remote` usa il backend online: in quella modalità le scritture vanno sui **dati di produzione**.

Controlli disponibili:

```bash
npm run lint    # ESLint
npm run build   # build di produzione
```

## Pubblicazione

Il repository è sincronizzato con Base44 tramite GitHub: dopo il push, pubblica dalla dashboard
(`base44 dashboard open`) invece di usare `base44 deploy`, così lo stato online resta allineato al repository.

Documentazione: [integrazione GitHub](https://docs.base44.com/developers/app-code/local-development/github) ·
[sviluppo locale](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)
