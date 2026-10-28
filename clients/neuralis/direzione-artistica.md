# Direzione artistica — Neuralis Studio

> Questo file guida OGNI contenuto del profilo Instagram di Neuralis Studio. Il bot lo legge per intero prima di creare.
> Modificalo quando vuoi: le modifiche valgono dalla pubblicazione successiva.

## 1. Identità
- **Chi siamo:** Neuralis Studio, agenzia di Torino che crea siti web e automazioni con l'intelligenza artificiale per piccole attività e professionisti.
- **A chi parliamo:** imprenditori, professionisti e creator (25–55 anni) curiosi di AI e web, che non sono tecnici.
- **Cosa vogliamo ottenere:** far crescere il profilo con contenuti utili e far arrivare richieste dal link in bio.
- **Contatti:** infoneuralisai@gmail.com · +39 391 178 7425 · neuralisai.net

## 2. Tono di voce
- **Come parliamo:** chiaro, utile, curioso, con un filo di ironia. Diamo del "tu". Spieghiamo come a un amico sveglio, non come a un tecnico.
- **Parole e frasi da usare:** "spiegato semplice", "cosa significa davvero", "ecco come funziona", "da provare oggi".
- **Da evitare:** gergo inutile, allarmismo, promesse di guadagni o risultati garantiti, notizie non confermate, studi o citazioni inventati, politica.

## 3. Identità visiva
- **REGOLA PRINCIPALE:** i reel NON usano lo stile dell'agenzia. Ogni giorno uno stile diverso preso dalla libreria
  `library/prompts.json`, scelto per attirare pubblico (brandMode `cta-only`).
- **Il brand Neuralis compare solo nella scena finale (CTA):**
  - colori: sfondo `#0F1110` · testo `#E2E8E4` · accento lime `#C5FF4D` · linee `#2D3230`
  - font: `Instrument Serif` corsivo per "Neuralis", `Inter Tight` per i testi, `JetBrains Mono` per le etichette
  - logo: punto pieno lime + "Neuralis" in Instrument Serif corsivo + "/STUDIO" piccolo in JetBrains Mono
  - nella scena finale la CTA può adattarsi allo stile del reel (es. riquadro pixel, timbro a inchiostro), ma il nome resta "NeuralisAI" o "Neuralis Studio"
- **Foto/video propri:** cartella `clients/neuralis/media/` (facoltativo)

## 4. Stili di animazione
- **Stili preferiti:** uno diverso ogni giorno dalla libreria, seguendo `calendario.md`. Esempi riusciti: explainer stile Kurzgesagt,
  pixel art, visione CCTV/HUD, tipografia cinetica, inchiostro sumi-e, stickman con movimenti naturali, oggetti 3D.
- **Stili da NON usare:** lo stile e i colori dell'agenzia dentro il reel; lo stesso stile due volte nello stesso mese.
- **Ritmo:** aggancio nei primi 3 secondi, 35–45 secondi totali, comprensibile anche senza audio.
- **Musica:** alterna tutti i 10 generi di `tools/music.py` (house, trap, lofi, synthwave, dnb, chiptune, cinematic, funk, ambient, afro),
  scegliendo quello che si sposa con lo stile visivo del giorno. Mai lo stesso genere due giorni di fila
  (`--log clients/neuralis/music-log.json`).
- **Voce fuori campo:** facoltativa (serve credito OpenAI); senza voce i testi a schermo devono bastare.

## 5. Contenuti
- **Temi principali:** notizie e cose utili su AI, siti web e contenuti creati con l'AI (vedi `calendario.md`).
- **Formati:** 1 reel al giorno. Post e caroselli per ora non previsti.
- **Argomenti vietati:** politica, notizie non verificate, promesse di guadagno.
- **Fonti affidabili:** documentazione ufficiale dei prodotti (OpenAI, Google, Anthropic, Meta), testi ufficiali UE, fonti giornalistiche verificate.
  Numeri di esempio sempre etichettati come tali.

## 6. Didascalie
- Lunghe e di valore (non due righe): prima riga d'impatto, spiegazione, consiglio pratico, domanda per i commenti, CTA.
- **Massimo 5 hashtag** (Instagram non ne accetta di più), scelti dal pool in `config.json`.

## 7. Chiusura e call to action
- **CTA finale dei reel:** "Vuoi portare l'AI nella tua attività?" + "Siti web + automazioni AI su misura · link in bio"
- **Firma:** NeuralisAI / Neuralis Studio nell'ultima scena.

## 8. Esempi
- **Mi piace:** i reel dei giorni 01–05 (Kurzgesagt, pixel art, CCTV, tipografia cinetica, sumi-e) e gli spot in motion design con
  ritmo veloce e transizioni curate.
- **Non mi piace:** movimenti innaturali dei personaggi, testi tagliati o senza accenti, didascalie troppo corte, più di 5 hashtag.
