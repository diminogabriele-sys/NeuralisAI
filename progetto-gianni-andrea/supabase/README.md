# Attivare l'area clienti (Supabase + email)

L'area clienti (`/area-clienti/`) e il pannello del team (`/admin/`) usano **Supabase**, che fornisce database, accesso via email e archivio documenti. Le email di notifica partono da **Resend**. Entrambi hanno un piano gratuito.

Finché i passaggi qui sotto non sono completati, il sito funziona normalmente e l'area clienti mostra "non ancora attiva".

Tempo richiesto: circa 30 minuti, una volta sola.

---

## 1. Crea il progetto Supabase
1. Registrati su **supabase.com** e crea un nuovo progetto (regione consigliata: *Central EU (Frankfurt)*).
2. In **Project Settings → API** copia:
   - **Project URL** (es. `https://abcd1234.supabase.co`)
   - **anon public key**

## 2. Crea il database
1. Apri **SQL Editor → New query**.
2. Incolla tutto il contenuto di `supabase/schema.sql` e premi **Run**.
3. Nella stessa schermata esegui queste righe, con le vostre email e una frase segreta lunga a piacere:

```sql
insert into public.admins (email) values ('gianni@esempio.it'), ('andrea@esempio.it')
  on conflict do nothing;

insert into private.settings (key, value) values
  ('notify_url', 'https://abcd1234.supabase.co/functions/v1/notify'),
  ('webhook_secret', 'una-frase-segreta-lunga-e-casuale')
on conflict (key) do update set value = excluded.value;
```

Le email in `admins` vanno scritte **in minuscolo**. Sono le uniche che possono entrare in `/admin/`.

## 3. Configura le email (Resend)
1. Registrati su **resend.com**, aggiungi il vostro dominio (es. `orion.it`) e segui le istruzioni DNS per verificarlo.
2. Crea una **API key**.
3. **Email di accesso:** in Supabase apri **Authentication → Emails → SMTP Settings**, attiva *Custom SMTP* e inserisci:
   - Host `smtp.resend.com`, porta `465`
   - Utente `resend`, password = la API key di Resend
   - Mittente: `noreply@orion.it`, nome *Orion*

   Senza questo passaggio Supabase invia pochissime email all'ora, e solo agli indirizzi del team.
4. **Indirizzi consentiti:** apri **Authentication → URL Configuration**:
   - *Site URL*: `https://www.orion.it`
   - *Redirect URLs*: aggiungi `https://www.orion.it/**`. Se usi l'anteprima di Netlify, aggiungi anche `https://*.netlify.app/**`.
5. *(Facoltativo)* In **Authentication → Emails → Templates → Magic Link** puoi tradurre o personalizzare il testo dell'email di accesso.

## 4. Pubblica la funzione delle notifiche
Dal computer, nella cartella `progetto-gianni-andrea`:

```bash
npx supabase login
npx supabase link --project-ref abcd1234        # il codice nel tuo Project URL
npx supabase secrets set \
  RESEND_API_KEY=re_xxxxxxxx \
  MAIL_FROM="Orion <noreply@orion.it>" \
  SITE_URL=https://www.orion.it \
  WEBHOOK_SECRET=una-frase-segreta-lunga-e-casuale
npx supabase functions deploy notify --no-verify-jwt
```

`WEBHOOK_SECRET` deve essere **identico** a quello inserito nel passo 2. Con `ADMIN_EMAILS=a@x.it,b@y.it` puoi scegliere chi riceve gli avvisi dei messaggi dei clienti; se non lo imposti, li ricevono tutti gli admin.

## 5. Collega il sito
In **Netlify → Site configuration → Environment variables** aggiungi:

| Nome | Valore |
|---|---|
| `PUBLIC_SUPABASE_URL` | il Project URL del passo 1 |
| `PUBLIC_SUPABASE_ANON_KEY` | la anon public key del passo 1 |

Poi esegui **Deploys → Trigger deploy**. In locale puoi copiare `.env.example` in `.env` con gli stessi valori.

> La *anon key* è pubblica per natura: la sicurezza è garantita dalle regole del database (ogni cliente vede solo i propri ordini). Non inserire mai nel sito la *service_role key*.

---

## Come si usa

**Voi (team)**
1. Andate su `/admin/` e accedete con la vostra email: riceverete un link.
2. Con **+ Nuovo ordine** inserite l'email del cliente e il titolo del progetto. Il codice (`ORN-2026-001`) viene assegnato da solo.
3. Nella scheda dell'ordine potete:
   - cambiare lo stato: il cliente riceve un'email;
   - aggiungere una nota e i dati di tracking;
   - caricare documenti (preventivi, render, fatture);
   - scrivere in chat: il cliente riceve un'email a ogni messaggio.
4. Quando un cliente vi scrive, ricevete un'email e nell'elenco compare il badge **Nuovo messaggio**.

**Il cliente**
1. Va su *Area clienti* e inserisce la stessa email dell'ordine: riceve un link di accesso, senza password.
2. Al primo accesso **deve** compilare i dati di fatturazione e spedizione.
3. Poi vede lo stato dell'ordine, la cronologia, i documenti (può anche caricarne) e la chat.

## Stati dell'ordine
Consulenza → Progettazione → Confronto con il cliente → Produzione → Finiture e controllo qualità → Spedito → Consegnato
