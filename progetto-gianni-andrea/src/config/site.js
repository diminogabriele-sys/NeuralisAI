/**
 * ============================================================
 *  DATI AZIENDALI — modifica qui, si aggiornano in tutto il sito
 *  (testi in 5 lingue: vedi src/i18n/*.js)
 * ============================================================
 */
export const site = {
  name: 'Beyond the Factory',
  /** Ragione sociale e P.IVA mostrate nel footer (segnaposto) */
  legalName: 'Beyond the Factory',
  vat: 'P.IVA 00000000000',
  /** Dominio definitivo, senza slash finale (serve per canonical, sitemap, Open Graph) */
  url: 'https://www.beyondthefactory.it',

  /** Email di contatto (unico recapito pubblico per ora) */
  email: 'info@beyondthefactory.it',

  /** Social: lascia vuoto ('') quelli che non usi */
  social: {
    instagram: 'https://www.instagram.com/beyondthefactory',
    facebook: '',
    youtube: '',
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
