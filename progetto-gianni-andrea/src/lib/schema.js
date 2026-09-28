import { site } from '../config/site.js';
import { dictionaries, path } from '../i18n/index.js';

const dayMap = { mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday', fr: 'Friday', sa: 'Saturday', su: 'Sunday' };
const order = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

/** Espande ['mo','fr'] → ['mo','tu','we','th','fr'] */
export function expandDays(days) {
  if (days.length === 1) return days;
  const [a, b] = [order.indexOf(days[0]), order.indexOf(days[days.length - 1])];
  return order.slice(a, b + 1);
}

/** Righe orari localizzate: [{ label: 'Lunedì – Venerdì', value: '09:00 – 18:30' }] */
export function hoursRows(lang) {
  const t = dictionaries[lang];
  return site.hours.map((h) => ({
    label: h.days.length > 1 ? `${t.days[h.days[0]]} – ${t.days[h.days[h.days.length - 1]]}` : t.days[h.days[0]],
    value: h.closed ? t.contact.info.closed : `${h.open} – ${h.close}`,
  }));
}

/** Dati strutturati schema.org del negozio/laboratorio (LocalBusiness → AutoPartsStore) */
export function businessSchema(lang) {
  const t = dictionaries[lang];
  const url = new URL(path('home', lang), site.url).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    '@id': `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    description: t.meta.home.description,
    url,
    image: `${site.url}/og-image.jpg`,
    logo: `${site.url}/favicon.svg`,
    telephone: site.phone,
    email: site.email,
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapLink,
    openingHoursSpecification: site.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: expandDays(h.days).map((d) => dayMap[d]),
        opens: h.open,
        closes: h.close,
      })),
    sameAs: Object.values(site.social).filter(Boolean),
    areaServed: 'Worldwide',
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
