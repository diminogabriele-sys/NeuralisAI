import it from './it.js';
import en from './en.js';
import es from './es.js';
import de from './de.js';
import fr from './fr.js';

export const dictionaries = { it, en, es, de, fr };
export const locales = Object.keys(dictionaries);
export const defaultLocale = 'it';

/** Slug localizzati delle pagine (l'italiano non ha prefisso di lingua) */
export const slugs = {
  home: { it: '', en: '', es: '', de: '', fr: '' },
  thanks: { it: 'grazie', en: 'thank-you', es: 'gracias', de: 'danke', fr: 'merci' },
  privacy: { it: 'privacy', en: 'privacy', es: 'privacidad', de: 'datenschutz', fr: 'confidentialite' },
};

/** Percorso di una pagina in una lingua, es. path('privacy','de') → /de/datenschutz/ */
export function path(page, lang) {
  const prefix = lang === defaultLocale ? '' : `/${lang}`;
  const slug = slugs[page][lang];
  return `${prefix}/${slug ? slug + '/' : ''}` || '/';
}

/** Tutte le coppie pagina/lingua da generare */
export function allRoutes() {
  return Object.keys(slugs).flatMap((page) => locales.map((lang) => ({ page, lang, path: path(page, lang) })));
}
