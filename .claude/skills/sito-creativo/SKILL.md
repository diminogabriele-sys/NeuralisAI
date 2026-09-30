---
name: sito-creativo
description: Crea un sito web vetrina completo per un'attività (tipicamente locale) partendo da un brief in italiano con sezioni Contesto, Pagine, Stile, Contenuti, Requisiti tecnici e Come lavorare. Usala quando l'utente invoca /sito-creativo o chiede di progettare e costruire un sito per un cliente. Combina le skill frontend-design (direzione visiva non generica) e ui-ux-pro-max (dati su palette, font, UX e accessibilità).
---

# Sito creativo

Flusso per trasformare un brief cliente in un sito statico pronto per la pubblicazione. Rispondi nella lingua del brief (di norma italiano).

## Skill da usare insieme

- **frontend-design** (`.claude/skills/frontend-design/SKILL.md`): leggila per intero prima di proporre la direzione visiva. Ne valgono principi, lista dei "default da evitare" e processo in due passate (piano → revisione contro il brief).
- **ui-ux-pro-max** (`.claude/skills/ui-ux-pro-max/SKILL.md`): usala come fonte di dati e controllo qualità, non come decisione finale. Per spunti:
  ```bash
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<settore e parole chiave>" --design-system -p "<Nome>" -f markdown
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain typography|color|ux|landing
  ```
  Se il risultato contraddice il brief o frontend-design (es. propone Inter, gradienti viola, look SaaS), prevalgono il brief e frontend-design. Usa `references/pro-rules.md` come checklist pre-consegna.

## Fase 1: direzione visiva (niente codice)

1. Estrai dal brief: attività, target, zona, obiettivo, CTA, lingue, pagine, vincoli di stile, cose da evitare. Se c'è un sito di riferimento, prova a leggerlo; se non è raggiungibile, dillo.
2. Proponi:
   - **Concept** in una frase, radicato nel mestiere del cliente (materiali, gesti, risultato visibile) e **un solo elemento distintivo**.
   - **Palette** di 4–6 colori con nome, hex, ruolo e rapporto di contrasto verificato (AA ≥ 4.5:1 per il testo).
   - **Font**: una o due famiglie, motivate, self-hosted.
   - **Struttura** sezione per sezione della home e delle pagine secondarie.
   - **Stack** consigliato con motivazione.
   - **Domande aperte** strettamente necessarie (dominio, indirizzo, zona servita, social…), ognuna con un default che userai se non risponde.
3. Rivedi la proposta contro la lista dei default generici di frontend-design; correggi ciò che sembra un template.
4. **Fermati e aspetta l'ok esplicito dell'utente.**

## Fase 2: costruzione

Crea il progetto nella cartella indicata dal brief (altrimenti una cartella col nome del cliente). Default, salvo indicazioni diverse:

- **Stack:** Astro statico (zero JS di default, i18n con prefisso `/en/`, content collections per il blog, `astro:assets` per le immagini, `@astrojs/sitemap`). JS vanilla solo per le interazioni necessarie; nessuna libreria UI superflua.
- **Hosting Netlify:** `netlify.toml` (build, header di sicurezza e cache, redirect), form con `data-netlify="true"`, honeypot, `action` verso una pagina di ringraziamento per lingua.
- **SEO:** title e meta description unici per pagina e lingua, canonical, `hreflang`, Open Graph e Twitter card, `sitemap.xml`, `robots.txt`, JSON-LD (`LocalBusiness` o sottotipo, `Service`, `FAQPage`, `BreadcrumbList`, `BlogPosting`).
- **Performance:** immagini responsive (AVIF/WebP), `loading="lazy"` sotto la piega e dimensioni esplicite, font con `font-display: swap` e preload del solo peso critico.
- **Accessibilità:** HTML semantico, skip link, focus visibile, target touch ≥ 44px, alt text, label visibili nei form, `prefers-reduced-motion` rispettato, nav e accordion utilizzabili da tastiera.
- **Privacy:** cookie banner con consenso reale; Maps e altri embed di terze parti caricati solo dopo il consenso (con fallback a link); pagine Privacy e Cookie con placeholder.
- **Contenuti:** testi scritti su misura, professionali e specifici del mestiere (niente riempitivi). Placeholder chiaramente marcati per logo, foto, numeri, email, social, P.IVA e indirizzo, raccolti in un unico file di configurazione (es. `src/config/site.ts`) per sostituirli facilmente.
- **Extra richiesti** (WhatsApp, blog, animazioni allo scroll, ecc.): implementali con moderazione; un solo momento di motion orchestrato vale più di tanti effetti sparsi.

## Fase 3: verifica prima di dire "finito"

1. `npm run build` senza errori né warning rilevanti.
2. Avvia l'anteprima (`npm run preview`) e cattura screenshot con Playwright (Chromium già installato) almeno a **390×844** (mobile) e **1440×900** (desktop), per la home in entrambe le lingue e per una pagina interna. Guardali davvero e correggi overflow orizzontale, sovrapposizioni, contrasti e spaziature.
3. Controlla: link interni non rotti, `sitemap.xml` e `robots.txt` generati, JSON-LD valido, form con attributi Netlify nell'HTML statico, navigazione da tastiera.
4. Mostra all'utente gli screenshot principali.

## Fase 4: riepilogo finale

Chiudi con tre blocchi brevi:
1. **Cosa ho fatto:** pagine, funzionalità e scelte principali.
2. **Cosa devi sostituire:** elenco puntato con file e campo per ogni placeholder (logo, foto prima/dopo, numeri, email, social, dominio, P.IVA, testi legali).
3. **Come metterlo online su Netlify:** repo Git → "Add new site" → build command e publish directory; attivazione notifiche Netlify Forms; dominio personalizzato e HTTPS; invio della sitemap a Google Search Console e creazione o collegamento della scheda Google Business Profile.
