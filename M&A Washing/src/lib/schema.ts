import { site } from '../config/site';
import { t, routes, type Lang } from '../i18n';

export const businessId = `${site.url}/#azienda`;
const abs = (path: string) => new URL(path, site.url).href;

/** Dati strutturati dell'azienda (HomeAndConstructionBusiness è un sottotipo di LocalBusiness). */
export function businessSchema(lang: Lang) {
  const d = t(lang);
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: site.name,
    legalName: site.legalName,
    description: d.meta.homeDescription,
    url: abs(routes.home[lang]),
    image: abs('/og-image.jpg'),
    logo: abs('/favicon.svg'),
    telephone: site.phones[0].tel,
    email: site.email,
    vatID: site.vatNumber,
    priceRange: '€€',
    inLanguage: lang,
    ...(site.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: site.address.street,
            addressLocality: site.address.city,
            postalCode: site.address.postalCode,
            addressRegion: site.address.province,
            addressCountry: 'IT',
          },
        }
      : {
          address: { '@type': 'PostalAddress', addressLocality: 'Padova', addressRegion: 'PD', addressCountry: 'IT' },
        }),
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
    contactPoint: site.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.tel,
      contactType: 'customer service',
      areaServed: 'IT',
      availableLanguage: ['Italian', 'English'],
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: d.services.title,
      itemListElement: d.services.items.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name },
      })),
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function faqSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t(lang).faq.items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(lang: Lang, s: { name: string; metaDescription: string }, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.metaDescription,
    url: abs(path),
    serviceType: s.name,
    provider: { '@id': businessId },
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function articleSchema(p: { title: string; description: string; date: Date; path: string; lang: Lang }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date.toISOString(),
    dateModified: p.date.toISOString(),
    inLanguage: p.lang,
    mainEntityOfPage: abs(p.path),
    image: abs('/og-image.jpg'),
    author: { '@id': businessId },
    publisher: { '@id': businessId },
  };
}
