// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// PLACEHOLDER: dominio definitivo. Deve coincidere con `url` in src/config/site.ts e con public/robots.txt
const SITE = 'https://www.mawashing.it';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Le pagine di ringraziamento non vanno indicizzate
      filter: (page) => !/\/(grazie|thank-you)\/$/.test(page),
    }),
  ],
});
