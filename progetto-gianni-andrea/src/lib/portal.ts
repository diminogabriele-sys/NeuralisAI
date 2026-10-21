/**
 * Funzioni condivise da area clienti e pannello admin (Supabase).
 * La connessione si configura con le variabili PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY
 * (file .env in locale, "Environment variables" su Netlify).
 */
import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js';
import { createDemoClient } from './demo';

export const STATUSES = ['consultation', 'design', 'review', 'production', 'finishing', 'shipping', 'delivered'] as const;
export type Status = (typeof STATUSES)[number];

export interface Order {
  id: string;
  code: string;
  customer_email: string;
  title: string;
  service: string | null;
  status: Status;
  status_note: string | null;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
  updated_at: string;
}
export interface OrderEvent { id: number; order_id: string; status: Status; note: string | null; created_at: string }
export interface Doc { id: string; order_id: string; name: string; path: string; size: number | null; from_admin: boolean; created_at: string }
export interface Message { id: number; order_id: string; from_admin: boolean; body: string; created_at: string }
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string | null;
  tax_code: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  country: string;
  notes: string | null;
  lang: string;
}

export const PROFILE_FIELDS = [
  ['first_name', 'firstName', true, 'given-name'],
  ['last_name', 'lastName', true, 'family-name'],
  ['company', 'company', false, 'organization'],
  ['tax_code', 'taxCode', true, 'off'],
  ['phone', 'phone', true, 'tel'],
  ['address', 'address', true, 'street-address'],
  ['postal_code', 'postalCode', true, 'postal-code'],
  ['city', 'city', true, 'address-level2'],
  ['province', 'province', true, 'address-level1'],
  ['country', 'country', true, 'country-name'],
  ['notes', 'notes', false, 'off'],
] as const;

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

/** true quando Supabase non è configurato: area clienti e pannello girano in modalità dimostrativa */
export const isDemo = !(url && key);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient | null = isDemo ? (createDemoClient() as any) : createClient(url!, key!);

export const BUCKET = 'order-docs';

/* ---------- utilità ---------- */
export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const fmtDate = (iso: string, lang: string, time = false) =>
  new Intl.DateTimeFormat(lang, time ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(iso));

export const fmtSize = (n: number | null) =>
  n == null ? '' : n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

/** Barra di avanzamento dello stato dell'ordine */
export function statusTrack(status: Status, labels: Record<string, string>) {
  const idx = STATUSES.indexOf(status);
  return `<ol class="ptrack" aria-label="${esc(labels[status])}">${STATUSES.map(
    (s, i) =>
      `<li class="${i < idx ? 'done' : i === idx ? 'current' : ''}"${i === idx ? ' aria-current="step"' : ''}><span class="dot" aria-hidden="true"></span><span class="lbl">${esc(labels[s])}</span></li>`
  ).join('')}</ol>`;
}

/* ---------- dati ---------- */
export async function loadOrderDetail(orderId: string) {
  const db = supabase!;
  const [events, docs, messages] = await Promise.all([
    db.from('order_events').select('*').eq('order_id', orderId).order('created_at'),
    db.from('documents').select('*').eq('order_id', orderId).order('created_at'),
    db.from('messages').select('*').eq('order_id', orderId).order('created_at'),
  ]);
  const err = events.error || docs.error || messages.error;
  if (err) throw err;
  return { events: events.data as OrderEvent[], docs: docs.data as Doc[], messages: messages.data as Message[] };
}

export async function uploadDoc(orderId: string, file: File) {
  const db = supabase!;
  const safe = file.name.normalize('NFKD').replace(/[^\w.\-]+/g, '_').slice(-80) || 'file';
  const path = `${orderId}/${Date.now()}-${safe}`;
  const up = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined });
  if (up.error) throw up.error;
  const ins = await db.from('documents').insert({ order_id: orderId, name: file.name, path, size: file.size });
  if (ins.error) throw ins.error;
}

export async function openDoc(path: string) {
  // la finestra si apre subito (dentro il clic) per non essere bloccata dal browser
  const win = window.open('', '_blank');
  try {
    const { data, error } = await supabase!.storage.from(BUCKET).createSignedUrl(path, 120);
    if (error) throw error;
    if (win) {
      win.opener = null;
      win.location.href = data.signedUrl;
    } else {
      window.location.href = data.signedUrl;
    }
  } catch (err) {
    win?.close();
    throw err;
  }
}

export async function sendMessage(orderId: string, body: string) {
  const { error } = await supabase!.from('messages').insert({ order_id: orderId, body });
  if (error) throw error;
}

/** Aggiornamenti in tempo reale per un ordine (chat, documenti, stato) */
export function watchOrder(orderId: string, onChange: (table: string) => void): RealtimeChannel {
  const ch = supabase!.channel(`order-${orderId}`);
  for (const table of ['messages', 'documents', 'order_events']) {
    ch.on('postgres_changes', { event: '*', schema: 'public', table, filter: `order_id=eq.${orderId}` }, () => onChange(table));
  }
  ch.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, () => onChange('orders'));
  return ch.subscribe();
}

/* ---------- blocchi HTML condivisi ---------- */
/** team = etichetta dei messaggi del team, client = etichetta dei messaggi del cliente */
interface ChatLabels { title: string; empty: string; placeholder: string; send: string; team: string; client: string; notice?: string }
interface DocLabels { title: string; empty: string; upload: string; uploading: string; download: string }

export function chatHtml(orderId: string, messages: Message[], t: ChatLabels, lang: string, asAdmin: boolean) {
  const items = messages.length
    ? messages
        .map((m) => {
          const mine = m.from_admin === asAdmin;
          const who = m.from_admin ? t.team : t.client;
          return `<li class="msg ${mine ? 'mine' : 'theirs'}"><p class="msg-meta"><span>${esc(who)}</span><time datetime="${m.created_at}">${fmtDate(m.created_at, lang, true)}</time></p><p class="msg-body">${esc(m.body).replace(/\n/g, '<br>')}</p></li>`;
        })
        .join('')
    : `<li class="msg-empty">${esc(t.empty)}</li>`;
  return `<section class="pbox chat" aria-label="${esc(t.title)}">
    <h3 class="pbox-title">${esc(t.title)}</h3>
    <ol class="msgs" data-msgs tabindex="0" aria-live="polite">${items}</ol>
    <form class="chat-form" data-chat-form="${orderId}">
      <label class="sr-only" for="chat-${orderId}">${esc(t.placeholder)}</label>
      <textarea id="chat-${orderId}" name="body" rows="2" maxlength="4000" required placeholder="${esc(t.placeholder)}"></textarea>
      <button class="btn btn--solid" type="submit">${esc(t.send)}</button>
    </form>
    ${t.notice ? `<p class="pnote">${esc(t.notice)}</p>` : ''}
  </section>`;
}

export function docsHtml(orderId: string, docs: Doc[], t: DocLabels, lang: string, canDelete = false) {
  const items = docs.length
    ? docs
        .map(
          (d) => `<li class="doc">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z M14 3v4h4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
            <span class="doc-name">${esc(d.name)}<small>${fmtDate(d.created_at, lang)} · ${fmtSize(d.size)}${d.from_admin ? '' : ' · ↑'}</small></span>
            <button type="button" class="plink" data-doc-open="${esc(d.path)}">${esc(t.download)}</button>
            ${canDelete ? `<button type="button" class="plink danger" data-doc-delete="${d.id}" data-path="${esc(d.path)}" aria-label="Elimina ${esc(d.name)}">✕</button>` : ''}
          </li>`
        )
        .join('')
    : `<li class="doc-empty">${esc(t.empty)}</li>`;
  return `<section class="pbox docs" aria-label="${esc(t.title)}">
    <h3 class="pbox-title">${esc(t.title)}</h3>
    <ul class="doclist">${items}</ul>
    <label class="btn upload-btn">
      <input type="file" class="sr-only" data-doc-upload="${orderId}" />
      <span data-upload-label data-idle="${esc(t.upload)}" data-busy="${esc(t.uploading)}">${esc(t.upload)}</span>
    </label>
  </section>`;
}

/** Collega i pulsanti di chat e documenti dentro un contenitore */
export function wireOrderActions(root: HTMLElement, onError: (e: unknown) => void, onDone: () => void) {
  root.querySelectorAll<HTMLFormElement>('[data-chat-form]').forEach((form) => {
    const ta = form.querySelector('textarea')!;
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) form.requestSubmit();
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = ta.value.trim();
      if (!body) return;
      const btn = form.querySelector('button')!;
      btn.disabled = true;
      try {
        await sendMessage(form.dataset.chatForm!, body);
        ta.value = '';
        onDone();
      } catch (err) {
        onError(err);
      } finally {
        btn.disabled = false;
      }
    });
  });
  root.querySelectorAll<HTMLInputElement>('[data-doc-upload]').forEach((input) =>
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const lbl = input.parentElement!.querySelector<HTMLElement>('[data-upload-label]')!;
      lbl.textContent = lbl.dataset.busy!;
      try {
        await uploadDoc(input.dataset.docUpload!, file);
        onDone();
      } catch (err) {
        onError(err);
      } finally {
        lbl.textContent = lbl.dataset.idle!;
        input.value = '';
      }
    })
  );
  root.querySelectorAll<HTMLButtonElement>('[data-doc-open]').forEach((b) =>
    b.addEventListener('click', () => openDoc(b.dataset.docOpen!).catch(onError))
  );
  root.querySelectorAll<HTMLElement>('[data-msgs]').forEach((el) => (el.scrollTop = el.scrollHeight));
}
