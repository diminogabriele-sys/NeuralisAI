import { it, type Dict } from './it';
import { en } from './en';

export type Lang = 'it' | 'en';
export const langs: Lang[] = ['it', 'en'];
export const dicts: Record<Lang, Dict> = { it, en };
export const t = (lang: Lang) => dicts[lang];

/** Percorsi delle pagine in ciascuna lingua (sempre con "/" finale). */
export const routes = {
  home: { it: '/', en: '/en/' },
  blog: { it: '/blog/', en: '/en/blog/' },
  thanks: { it: '/grazie/', en: '/en/thank-you/' },
  privacy: { it: '/privacy/', en: '/en/privacy/' },
  cookie: { it: '/cookie/', en: '/en/cookies/' },
} as const;

export type RouteKey = keyof typeof routes;

export const serviceBase: Record<Lang, string> = { it: '/servizi/', en: '/en/services/' };

export const servicePath = (lang: Lang, id: string) => {
  const item = dicts[lang].services.items.find((s) => s.id === id);
  if (!item) throw new Error(`Servizio sconosciuto: ${id}`);
  return `${serviceBase[lang]}${item.slug}/`;
};

export const postPath = (lang: Lang, slug: string) => `${routes.blog[lang]}${slug}/`;

export const homeAnchor = (lang: Lang, key: keyof Dict['anchors']) =>
  `${routes.home[lang]}#${dicts[lang].anchors[key]}`;

/** Mappa lingua -> percorso della stessa pagina, usata per hreflang e selettore lingua. */
export type Alternates = Partial<Record<Lang, string>>;

export const alternatesFor = (key: RouteKey): Alternates => ({ ...routes[key] });

export const formatDate = (lang: Lang, date: Date) =>
  new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
