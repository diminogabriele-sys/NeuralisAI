# Veloce — Custom Moto Atelier

Sito vetrina per Veloce, atelier di personalizzazione moto su misura
(piattaforme BMW S1000RR e Kawasaki Z900). Applicazione React statica,
senza backend: nessun account, nessun login, nessun servizio esterno
richiesto per funzionare.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + componenti [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/) per il routing
- [Framer Motion](https://www.framer.com/motion/) per le animazioni

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri l'URL stampato in console (tipicamente `http://localhost:5173`).

## Comandi disponibili

- `npm run dev` — avvia il server di sviluppo
- `npm run build` — build di produzione in `dist/`
- `npm run preview` — anteprima locale della build di produzione
- `npm run lint` — controllo lint
- `npm run typecheck` — controllo tipi (JSDoc/TS via `jsconfig.json`)

## Modulo di contatto

Il form nella sezione "Contatti" apre il client di posta dell'utente
(link `mailto:`) con oggetto e corpo già compilati — non richiede alcun
backend o servizio di terze parti.

## Deploy

L'app è una SPA statica: `npm run build` produce una cartella `dist/`
pronta per essere pubblicata su qualsiasi hosting statico (Netlify,
Vercel, GitHub Pages, ecc.).
