/**
 * ============================================================
 *  DATI AZIENDALI — modifica qui, si aggiornano in tutto il sito
 *  (testi in 5 lingue: vedi src/i18n/*.js)
 * ============================================================
 */
export const site = {
  name: 'Orion',
  /** Ragione sociale e P.IVA mostrate nel footer (segnaposto) */
  legalName: 'Orion',
  vat: 'P.IVA 00000000000',
  /** SEGNAPOSTO — dominio definitivo, senza slash finale (serve per canonical, sitemap, Open Graph) */
  url: 'https://www.orion.it',

  /** SEGNAPOSTO — email di contatto (unico recapito pubblico per ora) */
  email: 'info@orion.it',

  /** SEGNAPOSTO — social: lascia vuoto ('') quelli che non usi */
  social: {
    instagram: 'https://www.instagram.com/orion',
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
