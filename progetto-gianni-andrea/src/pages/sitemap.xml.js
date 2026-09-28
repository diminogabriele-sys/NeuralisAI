import { site } from '../config/site.js';
import { allRoutes, locales, path, dictionaries } from '../i18n/index.js';

// Sitemap multilingua con collegamenti hreflang (la pagina "grazie" è esclusa perché noindex)
export function GET() {
  const pages = ['home', 'privacy'];
  const today = new Date().toISOString().slice(0, 10);
  const urls = allRoutes()
    .filter((r) => pages.includes(r.page))
    .map((r) => {
      const alts = locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${dictionaries[l].htmlLang}" href="${new URL(path(r.page, l), site.url).href}"/>`)
        .join('\n');
      return `  <url>
    <loc>${new URL(r.path, site.url).href}</loc>
    <lastmod>${today}</lastmod>
    <priority>${r.page === 'home' ? '1.0' : '0.3'}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL(path(r.page, 'it'), site.url).href}"/>
  </url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
