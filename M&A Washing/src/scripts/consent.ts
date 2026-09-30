// Consenso cookie: salvato in localStorage, comunicato alla pagina con l'evento "consent-change".
// "media" = contenuti di terze parti (Google Maps). Se in futuro aggiungi statistiche,
// aggiungi qui una nuova categoria e carica lo script solo quando è true.
export type Consent = { media: boolean; date: string };
const KEY = 'maw-consent-v1';

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function setConsent(media: boolean) {
  const value: Consent = { media, date: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage non disponibile: il consenso vale solo per questa pagina */
  }
  document.dispatchEvent(new CustomEvent<Consent>('consent-change', { detail: value }));
}
