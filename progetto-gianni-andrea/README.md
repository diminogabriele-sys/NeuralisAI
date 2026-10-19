# Orion: sito e area clienti

Sito multilingua (IT · EN · ES · DE · FR) con hero 3D, costruito con **Astro** e **Three.js**, più un'**area clienti** (stato ordini, documenti, chat con notifiche email) e un **pannello per il team** su **Supabase**. Per attivarli segui [`supabase/README.md`](supabase/README.md).

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
npm run check        # controllo dei tipi
```

## Cosa sostituire

| Cosa | Dove |
|---|---|
| Email, social, dominio, P.IVA | `src/config/site.js` (un solo file) |
| Testi nelle 5 lingue (progetti, recensioni, FAQ…) | `src/i18n/it.js`, `en.js`, `es.js`, `de.js`, `fr.js` |
| Progetti | sezione `projects.items` nei file `src/i18n/*.js` + foto `progetto-1.jpg` … `progetto-5.jpg` |
| Logo | `src/components/Logo.astro` (sostituisci l'SVG) + `public/favicon.svg` + `public/apple-touch-icon.png` (180×180) |
| Foto | `src/assets/images/`: sovrascrivi i file **con lo stesso nome** (`servizio-*.jpg`, `progetto-*.jpg`, `chi-siamo.jpg`). Consigliato: almeno 1600 px di larghezza, 4:3 (laboratorio 4:5) |
| Immagine per le condivisioni social | `public/og-image.jpg` (1200×630) |
| Informativa privacy | testo segnaposto in `privacy` dentro ogni file `src/i18n/*.js` |
| Modello 3D (facoltativo) | `src/lib/hero3d.js`: `buildWing()` genera l'ala; un modello reale `.glb` si può caricare con `GLTFLoader` |

Per aggiungere un progetto, copia un blocco in `projects.items` (in tutte e 5 le lingue, con lo stesso `id`) e aggiungi la foto `src/assets/images/progetto-6.jpg`.

## Area clienti e pannello admin

- `/area-clienti/` (e `/en/client-area/`, ecc.): accesso via link email, dati di spedizione obbligatori, stato dell'ordine, cronologia, documenti, chat.
- `/admin/`: pannello del team (italiano, non indicizzato) per creare ordini, cambiare stato, caricare documenti e rispondere ai clienti.
- Database e regole di sicurezza: `supabase/schema.sql`. Email: `supabase/functions/notify`.
- Guida completa all'attivazione: [`supabase/README.md`](supabase/README.md).

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
5. Per l'area clienti aggiungi le variabili `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY` (vedi `supabase/README.md`).
6. Invia `https://tuodominio/sitemap.xml` a Google Search Console.

### Vercel
1. Su vercel.com: **Add New → Project** e importa il repository.
2. **Root Directory:** `progetto-gianni-andrea` (il framework Astro viene rilevato da solo).
3. Imposta `formProvider: 'formspree'`, perché Netlify Forms non funziona su Vercel.

## Funzioni incluse

- Home one-page: hero 3D interattivo, servizi, progetti (elenco cliccabile + card scorrevoli), metodo con biforcazione nei tre servizi, chi siamo, recensioni, FAQ, contatti (email e social).
- 5 lingue con URL dedicati (`/`, `/en/`, `/es/`, `/de/`, `/fr/`) e `hreflang`.
- SEO: title e meta description per pagina, canonical, Open Graph e Twitter card, `sitemap.xml`, `robots.txt`, schema.org `Organization` + `FAQPage`.
- Nessun cookie di terze parti (font self-hosted, niente mappe o analytics), quindi nessun cookie banner necessario.
- Animazioni allo scroll, che rispettano l'impostazione "riduci movimento".
- Accessibilità: link "salta al contenuto", focus visibile, menu mobile con tastiera ed Esc, FAQ con `<details>`, contrasti AA.
