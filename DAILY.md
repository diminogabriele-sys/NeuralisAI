# Reel giornaliero — istruzioni operative

Questo branch (`reel-factory`) è separato dall'app NeuralisAI: contiene solo gli strumenti per produrre un reel verticale al giorno.

## Struttura
- `calendario.md`: un giorno = uno stile della libreria + un tema. I giorni fatti sono marcati ✅.
- `library/prompts.json`: le due librerie complete (YouMind Opus 5.5 + AI × Leaders), 533 prompt. Usale come riferimento di stile.
- `days/dayNN-<stile>-<tema>.html`: un reel per file. Espone `window.DURATION` e `window.renderAt(t)`, funzione pura del tempo (niente animazioni CSS, niente timer).
- `tools/render.mjs`: renderizza con Playwright → ffmpeg. `BLUR=3` = motion blur reale (3 sottofotogrammi fusi).
- `tools/audio.py`: colonna sonora sintetizzata (`python3 tools/audio.py out.wav <durata> <bpm> <cue1,cue2,...>`).
- `tools/voice.py`: voce fuori campo italiana con OpenAI (richiede `OPENAI_API_KEY`), mixata sopra la musica.
- `tools/lib.js`: helper (seg, lerp, easing E.*, rnd, css, $).
- `tools/publish.py`: pubblica su Instagram (reel, immagine, carosello) passando da Cloudflare R2 (`r2_upload.py`) e dall'API ufficiale (`ig_publish.py`). `--check` verifica chiavi e archivio, `--dry-run` controlla senza pubblicare.

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
5. Voce fuori campo (se `OPENAI_API_KEY` è impostata): scrivi `days/dayNN-voice.json` con una frase per scena
   (`[{"t": inizio_scena + 0.3, "text": "..."}]`), parlato naturale che segue i testi a schermo senza ripeterli parola per parola.
   Lancia `tools/voice.py`: stampa la durata di ogni frase. Se una frase supera la sua scena, allunga la scena nell'html
   (o accorcia la frase) e rigenera. Se il modello TTS di default non esiste, scegline uno disponibile da
   `GET https://api.openai.com/v1/models` (id che contiene "tts") e passalo con `TTS_MODEL=...`.
   Senza chiave: solo musica, e segnalalo nell'email.
6. Render finale:
   ```
   python3 tools/audio.py /tmp/aNN.wav <DURATION> <bpm> <inizi-scene>
   python3 tools/voice.py days/dayNN-voice.json /tmp/aNN.wav /tmp/aNN-vo.wav      # se c'è la chiave
   BLUR=3 node tools/render.mjs days/dayNN.html /tmp/dNN-silent.mp4 30
   ffmpeg -y -i /tmp/dNN-silent.mp4 -i /tmp/aNN-vo.wav -c:v copy -c:a aac -b:a 192k -shortest <out>.mp4
   # senza voce: -i /tmp/aNN.wav e aggiungi -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100
   ```
7. Marca il giorno ✅ nel calendario, commit (solo html, voice.json e calendario, **non** gli mp4) e push su `reel-factory`.
8. Pubblicazione automatica (se le chiavi `IG_*` e `R2_*` sono impostate):
   - scrivi la didascalia completa in `days/dayNN-caption.txt` (max 5 hashtag);
   - `python3 tools/publish.py --check` → se fallisce NON pubblicare e segnala il problema;
   - `python3 tools/publish.py --type reel --files <out>.mp4 --caption-file days/dayNN-caption.txt --log publish-log.json`;
   - riporta il permalink nella consegna e fai commit di `publish-log.json` e della didascalia.
   Senza chiavi: salta questo passaggio e consegna il video con la didascalia da incollare.
9. Consegna:
   - via **Gmail** (`send_message`) a diminogabriele@gmail.com, oggetto `Reel del giorno NN — <tema>`, mp4 in allegato
     (base64, mimeType `video/mp4`, deve restare sotto 25 MB; se è più grande ricodifica con `-crf 23`),
     nel corpo: stile usato, didascalia completa pronta da incollare (gancio nella prima riga, 8–15 righe che riassumono
     e approfondiscono il reel, domanda per i commenti, invito a salvare/seguire, CTA a NeuralisAI, massimo 5 hashtag (limite di Instagram)
     italiano/inglese), eventuali note
     (es. numeri di esempio da verificare);
   - e anche come file nella sessione.
   Se qualcosa fallisce, l'email deve dirlo chiaramente.
10. Quando il calendario finisce, aggiungi altri 30 giorni scegliendo stili non ancora usati dalla libreria.
