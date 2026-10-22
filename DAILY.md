# Reel giornaliero — istruzioni operative

Questo branch (`reel-factory`) è separato dall'app NeuralisAI: contiene solo gli strumenti per produrre un reel verticale al giorno.

## Struttura
- `calendario.md`: un giorno = uno stile della libreria + un tema. I giorni fatti sono marcati ✅.
- `library/prompts.json`: le due librerie complete (YouMind Opus 5.5 + AI × Leaders), 533 prompt. Usale come riferimento di stile.
- `days/dayNN-<stile>-<tema>.html`: un reel per file. Espone `window.DURATION` e `window.renderAt(t)`, funzione pura del tempo (niente animazioni CSS, niente timer).
- `tools/render.mjs`: renderizza con Playwright → ffmpeg. `BLUR=3` = motion blur reale (3 sottofotogrammi fusi).
- `tools/audio.py`: colonna sonora sintetizzata (`python3 tools/audio.py out.wav <durata> <bpm> <cue1,cue2,...>`).
- `tools/lib.js`: helper (seg, lerp, easing E.*, rnd, css, $).

## Regole del format
1. Verticale 1080×1920, 35–45 s, italiano, comprensibile **senza audio** (ogni concetto scritto a schermo).
2. Testi solo tra y=260 e y=1560 (zona sicura di Reels/TikTok).
3. Aggancio forte nei primi 3 secondi (domanda o affermazione che incuriosisce).
4. Stile visivo = quello del giorno nel calendario, ricostruito fedelmente dal prompt in `library/prompts.json`. **Non** usare palette, font o logo dell'agenzia NeuralisAI nel corpo del reel.
5. Contenuto: notizie o consigli utili su siti web, AI, contenuti AI. Solo affermazioni corrette e verificabili; i numeri inventati vanno etichettati "esempio". Niente citazioni false di persone o enti reali.
6. Penultima scena: invito a seguire / salvare.
7. Ultima scena (4–5 s), nello stile del giorno: call to action all'agenzia —
   "Vuoi portare l'AI nella tua attività?" · "Siti web e automazioni AI su misura" · "Chiedi a **NeuralisAI** · link in bio →".

## Procedura
1. Trova il primo giorno non marcato ✅ in `calendario.md`.
2. Leggi in `library/prompts.json` i prompt che corrispondono allo stile (cerca per titolo).
3. Scrivi `days/dayNN-....html` (usa `<script src="../tools/lib.js">`).
4. Controlla almeno 8 fotogrammi: `node tools/render.mjs days/dayNN.html /tmp/stills/dNN 30 --stills t1,t2,...` e guardali. Correggi sovrapposizioni, testi tagliati, scritte illeggibili.
5. Render finale:
   ```
   python3 tools/audio.py /tmp/aNN.wav <DURATION> <bpm> <inizi-scene>
   BLUR=3 node tools/render.mjs days/dayNN.html /tmp/dNN-silent.mp4 30
   ffmpeg -y -i /tmp/dNN-silent.mp4 -i /tmp/aNN.wav -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 -c:a aac -b:a 192k -shortest <out>.mp4
   ```
6. Marca il giorno ✅ nel calendario, commit (solo html + calendario, **non** gli mp4) e push su `reel-factory`.
7. Consegna il video all'utente con una didascalia pronta da incollare (testo del post + 5–8 hashtag in italiano).
8. Quando il calendario finisce, aggiungi altri 30 giorni scegliendo stili non ancora usati dalla libreria.
