import { site } from '../config/site.js';
import { dictionaries, path } from '../i18n/index.js';

/** Dati strutturati schema.org dell'azienda (Organization: per ora nessun indirizzo pubblico) */
export function businessSchema(lang) {
  const t = dictionaries[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    slogan: 'Beyond the Factory. Beyond the Ordinary.',
    description: t.meta.home.description,
    url: new URL(path('home', lang), site.url).href,
    logo: `${site.url}/favicon.svg`,
    image: `${site.url}/og-image.jpg`,
    email: site.email,
    sameAs: Object.values(site.social).filter(Boolean),
    knowsLanguage: ['it', 'en', 'es', 'de', 'fr'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.services.kicker,
      itemListElement: t.services.items.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.text },
      })),
    },
  };
}

export function faqSchema(lang) {
  const t = dictionaries[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
