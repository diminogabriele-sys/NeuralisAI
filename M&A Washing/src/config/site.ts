/**
 * DATI AZIENDALI - unico file da modificare per i contatti.
 * Tutti i valori marcati con "PLACEHOLDER" vanno sostituiti con quelli reali
 * prima della pubblicazione (vedi README.md, sezione "Cosa sostituire").
 */
export const site = {
  name: 'M&A Washing',
  legalName: 'M&A Washing', // PLACEHOLDER: ragione sociale completa (es. "M&A Washing di Mario Rossi")
  vatNumber: '00000000000', // PLACEHOLDER: Partita IVA

  // PLACEHOLDER: dominio definitivo (senza "/" finale). Aggiornalo anche in astro.config.mjs e public/robots.txt
  url: 'https://www.mawashing.it',

  phones: [
    // PLACEHOLDER: i due numeri di telefono. `tel` in formato internazionale senza spazi.
    { label: 'Telefono 1', display: '+39 000 000 0001', tel: '+390000000001' },
    { label: 'Telefono 2', display: '+39 000 000 0002', tel: '+390000000002' },
  ],
  // PLACEHOLDER: numero WhatsApp (solo cifre, con prefisso 39, senza "+")
  whatsapp: '390000000001',
  email: 'info@mawashing.it', // PLACEHOLDER

  social: {
    // PLACEHOLDER: link ai profili. Lascia la stringa vuota ('') per nascondere un social.
    instagram: 'https://www.instagram.com/mawashing',
    facebook: 'https://www.facebook.com/mawashing',
    tiktok: '',
  },

  // Zona servita. Se l'azienda ha una sede da mostrare, compila `address`
  // (verrà usata in mappa e nei dati strutturati); altrimenti lascia null.
  address: null as null | {
    street: string;
    city: string;
    postalCode: string;
    province: string;
  },
  // Centro della zona servita (Padova) per mappa e dati strutturati
  geo: { lat: 45.4064, lng: 11.8768 },
  mapQuery: 'Padova, PD',
  areaServed: [
    'Padova',
    'Abano Terme',
    'Albignasego',
    'Cadoneghe',
    'Vigonza',
    'Rubano',
    'Selvazzano Dentro',
    'Noventa Padovana',
    'Ponte San Nicolò',
    'Limena',
    'Saonara',
    'Maserà di Padova',
  ],
} as const;

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
