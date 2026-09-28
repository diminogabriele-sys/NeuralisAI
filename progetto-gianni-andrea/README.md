# Sito XXX — Carene e aerodinamica su misura

Sito vetrina multilingua (IT · EN · ES · DE · FR) con hero 3D, costruito con **Astro** e **Three.js**.

## Perché questo stack

- **Astro** genera HTML statico e invia al browser solo il JavaScript necessario. Il risultato è un caricamento velocissimo, ottima SEO e hosting gratuito su Netlify o Vercel.
- **Three.js** viene usato solo per la scena 3D dell'hero. È caricato in differita, dopo il primo rendering della pagina, e non viene caricato se il browser non supporta WebGL o se è attivo il risparmio dati.
- **Immagini ottimizzate in automatico:** Astro converte le foto in AVIF/WebP in più dimensioni, con lazy-loading.
- **Font self-hosted** (Cormorant Garamond, Manrope, JetBrains Mono): nessuna chiamata a Google Fonts, quindi più velocità e più privacy.

## Comandi

```bash
npm install          # la prima volta
npm run dev          # anteprima locale su http://localhost:4321
npm run build        # genera il sito in dist/
npm run preview      # anteprima della build
npm run placeholders # rigenera le immagini segnaposto
```

## Cosa sostituire

| Cosa | Dove |
|---|---|
| Nome, indirizzo, telefono, WhatsApp, email, orari, social, dominio, mappa | `src/config/site.js` (un solo file) |
| Testi nelle 5 lingue ("XXX", testimonianze, numeri, FAQ…) | `src/i18n/it.js`, `en.js`, `es.js`, `de.js`, `fr.js` |
| Logo | `src/components/Logo.astro` (sostituisci l'SVG) + `public/favicon.svg` + `public/apple-touch-icon.png` (180×180) |
| Foto servizi e laboratorio | `src/assets/images/` — sovrascrivi i file **con lo stesso nome** (`servizio-carene.jpg`, `servizio-aero.jpg`, `servizio-finiture.jpg`, `chi-siamo.jpg`). Consigliato: almeno 1600 px di larghezza, 4:3 per i servizi, 4:5 per il laboratorio |
| Immagine per le condivisioni social | `public/og-image.jpg` (1200×630) |
| Informativa privacy | testo segnaposto in `privacy` dentro ogni file `src/i18n/*.js` |
| Modello 3D (facoltativo) | `src/lib/hero3d.js`: `buildWing()` genera l'ala; con un modello reale `.glb` si può caricare con `GLTFLoader` |

> Cerca "XXX" in tutto il progetto per trovare ogni segnaposto del marchio.

## Modulo contatti

In `src/config/site.js`:

- `formProvider: 'netlify'` (predefinito): **Netlify Forms**, nessuna configurazione. Le richieste arrivano in Netlify → *Forms*, dove puoi attivare le notifiche email.
- `formProvider: 'formspree'`: crea un modulo gratuito su formspree.io e incolla l'endpoint in `formspreeEndpoint`. Usalo se pubblichi su Vercel.

## Pubblicare online

### Netlify (consigliato)
1. Su app.netlify.com: **Add new site → Import an existing project** e collega il repository GitHub.
2. **Base directory:** `progetto-gianni-andrea`. Build command e publish directory vengono letti da `netlify.toml`.
3. **Deploy.** Poi collega il dominio in *Domain management*.
4. Aggiorna `url` in `src/config/site.js` con il dominio definitivo (serve per sitemap, canonical e Open Graph).
5. Invia `https://tuodominio/sitemap.xml` a Google Search Console.

### Vercel
1. Su vercel.com: **Add New → Project** e importa il repository.
2. **Root Directory:** `progetto-gianni-andrea` (il framework Astro viene rilevato da solo).
3. Imposta `formProvider: 'formspree'`, perché Netlify Forms non funziona su Vercel.

## Funzioni incluse

- Home one-page: hero 3D interattivo, servizi con card 3D, metodo, chi siamo, testimonianze, FAQ, contatti.
- 5 lingue con URL dedicati (`/`, `/en/`, `/es/`, `/de/`, `/fr/`) e `hreflang`.
- SEO: title e meta description per pagina, canonical, Open Graph e Twitter card, `sitemap.xml`, `robots.txt`, schema.org `AutoPartsStore` (LocalBusiness) + `FAQPage`.
- Cookie banner. Google Maps si carica solo dopo il consenso.
- Pulsante WhatsApp con messaggio precompilato nella lingua della pagina.
- Animazioni allo scroll, che rispettano l'impostazione "riduci movimento".
- Accessibilità: link "salta al contenuto", focus visibile, menu mobile con tastiera ed Esc, FAQ con `<details>`, contrasti AA.
