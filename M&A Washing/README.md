# M&A Washing, sito web

Sito vetrina bilingue (IT/EN) per M&A Washing, pulizia ad alta pressione di superfici esterne a Padova e provincia.

## Stack

- **Astro** (sito statico): HTML già pronto, nessun framework JavaScript lato client, pagine veloci anche su mobile.
- **CSS scritto a mano** con variabili (`src/styles/global.css`), senza librerie UI.
- **Font self-hosted** (Archivo e Public Sans, via Fontsource): nessuna chiamata a Google Fonts.
- **Immagini ottimizzate** in automatico da `astro:assets` (AVIF/WebP, più misure, lazy-load).
- **Netlify** per hosting e modulo contatti (Netlify Forms).

JavaScript è usato solo dove serve: menu mobile, slider prima/dopo, cookie banner e mappa, validazione del form e animazioni di comparsa.

## Comandi

Serve Node.js 22.12 o superiore.

```bash
npm install      # installa le dipendenze
npm run dev      # sviluppo su http://localhost:4321
npm run build    # genera il sito in dist/
npm run preview  # anteprima della build
```

## Struttura

```
src/
  config/site.ts          ← dati aziendali e placeholder (telefoni, email, social, P.IVA, zona)
  i18n/it.ts, en.ts       ← tutti i testi del sito in italiano e inglese
  assets/placeholders/    ← immagini da sostituire con le foto reali
  content/blog/it|en/     ← articoli del blog (Markdown)
  components/             ← sezioni (Hero, Servizi, Lavori, FAQ, Contatti…)
  views/                  ← modelli di pagina condivisi tra le lingue
  pages/                  ← percorsi: / (IT) e /en/ (EN)
public/                   ← favicon, immagine social (og-image.jpg), robots.txt
```

## Cosa sostituire prima di pubblicare

| Cosa | Dove |
|---|---|
| Due numeri di telefono | `src/config/site.ts`, campo `phones` (`display` è come appare, `tel` è il formato internazionale senza spazi) |
| Numero WhatsApp | `src/config/site.ts`, campo `whatsapp` (solo cifre, es. `393331234567`) |
| Email | `src/config/site.ts`, campo `email` |
| Instagram, Facebook, TikTok | `src/config/site.ts`, campo `social` (stringa vuota = social nascosto) |
| Ragione sociale e P.IVA | `src/config/site.ts`, campi `legalName` e `vatNumber` |
| Indirizzo della sede (facoltativo) | `src/config/site.ts`, campo `address` (se `null` viene mostrata solo la zona servita) |
| Comuni serviti | `src/config/site.ts`, campo `areaServed` |
| Dominio | `src/config/site.ts` (`url`), `astro.config.mjs` (`SITE`), `public/robots.txt` (riga `Sitemap`) |
| Logo | `src/components/Logo.astro` (istruzioni nel file) e `public/favicon.svg` |
| Foto prima/dopo dei lavori | `src/assets/placeholders/lavoro-*-prima.jpg` e `lavoro-*-dopo.jpg`: sostituisci i file mantenendo lo stesso nome. Didascalie e località in `src/i18n/it.ts` e `en.ts` (`works.items`) |
| Foto dell'hero | `src/assets/placeholders/hero-prima.jpg` e `hero-dopo.jpg`, stessa inquadratura prima e dopo |
| Foto dei servizi | `src/assets/placeholders/servizio-*.jpg` |
| Foto del team | `src/components/About.astro` (istruzioni nel commento) |
| Immagine per i social | `public/og-image.jpg` (1200×630 px) |
| Privacy e cookie policy | `src/pages/privacy.astro`, `cookie.astro` e le versioni in `src/pages/en/`: testi di esempio da far verificare a un consulente |
| Promesse commerciali | "Sopralluogo gratuito", "Preventivo entro 24 ore", zona servita: da confermare in `src/i18n/it.ts` e `en.ts` |

Suggerimento per le foto prima/dopo: scatta dallo stesso punto e con la stessa inquadratura, in orizzontale (4:3), almeno 1600 px di lato lungo.

### Aggiungere un articolo al blog

Crea un file in `src/content/blog/it/` (e la traduzione in `src/content/blog/en/`):

```md
---
title: Titolo dell'articolo
description: Riassunto di massimo 170 caratteri, usato anche su Google.
date: 2026-10-01
lang: it
slug: titolo-articolo
key: titolo-articolo   # stesso valore nella versione inglese, per collegare le traduzioni
---

Testo in Markdown…
```

## Pubblicazione su Netlify

1. Su [app.netlify.com](https://app.netlify.com) scegli **Add new site → Import an existing project** e collega questo repository GitHub.
2. Imposta **Base directory** = `M&A Washing`. Build command (`npm run build`) e publish directory (`dist`) vengono letti da `netlify.toml`.
3. Pubblica. Netlify rileva da solo il modulo `preventivo`.
4. In **Site configuration → Forms → Form notifications** aggiungi una notifica email verso l'indirizzo aziendale, così ogni richiesta arriva in casella.
5. In **Domain management** collega il dominio definitivo. Il certificato HTTPS è automatico. Se usi www e non-www, attiva il redirect in `netlify.toml`.
6. Dopo la pubblicazione:
   - su [Google Search Console](https://search.google.com/search-console) verifica il dominio e invia `https://<dominio>/sitemap-index.xml`;
   - crea o collega la scheda **Google Business Profile** con gli stessi telefoni, la zona servita e il link al sito: per un'attività locale è il canale che porta più contatti.
