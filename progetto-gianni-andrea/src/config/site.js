/**
 * ============================================================
 *  DATI AZIENDALI — modifica qui, si aggiornano in tutto il sito
 *  (testi in 5 lingue: vedi src/i18n/*.js)
 * ============================================================
 */
export const site = {
  /** Nome del marchio (segnaposto) */
  name: 'XXX',
  legalName: 'XXX S.r.l.',
  vat: 'P.IVA 00000000000',
  /** Dominio definitivo, senza slash finale (serve per canonical, sitemap, Open Graph) */
  url: 'https://www.xxx.it',

  phone: '+39 000 000 0000',
  /** Numero WhatsApp in formato internazionale, solo cifre */
  whatsapp: '390000000000',
  email: 'info@xxx.it',

  address: {
    street: 'Via Esempio 1',
    postalCode: '00000',
    city: 'Città',
    region: 'Provincia',
    country: 'IT',
  },
  /** Coordinate per i dati strutturati (Google) */
  geo: { lat: 45.0, lng: 9.0 },

  /**
   * URL di incorporamento Google Maps: su maps.google.com → Condividi → Incorpora una mappa → copia solo l'URL di src="…"
   * La mappa si carica solo dopo il consenso ai cookie.
   */
  mapEmbedUrl: 'https://www.google.com/maps?q=Milano&output=embed',
  mapLink: 'https://maps.google.com/?q=Milano',

  /** Orari: days usa i codici mo tu we th fr sa su; closed:true per i giorni chiusi */
  hours: [
    { days: ['mo', 'fr'], open: '09:00', close: '18:30' },
    { days: ['sa'], open: '09:00', close: '13:00' },
    { days: ['su'], closed: true },
  ],

  social: {
    instagram: 'https://www.instagram.com/xxx',
    facebook: 'https://www.facebook.com/xxx',
    youtube: 'https://www.youtube.com/@xxx',
    tiktok: '',
  },

  /**
   * Invio del modulo contatti:
   *  - 'netlify'   → Netlify Forms (nessuna configurazione, funziona solo su Netlify)
   *  - 'formspree' → crea un modulo su formspree.io e incolla qui sotto l'endpoint (per Vercel o altri hosting)
   */
  formProvider: 'netlify',
  formspreeEndpoint: 'https://formspree.io/f/XXXXXXXX',
};
