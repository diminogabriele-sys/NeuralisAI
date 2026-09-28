// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.js';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: false,
  // three.js (~145 kB gzip) è caricato in differita solo per la scena 3D dell'hero
  vite: { build: { chunkSizeWarningLimit: 700 } },
  image: {
    // Le immagini in src/assets vengono convertite automaticamente in WebP/AVIF ridimensionati
    responsiveStyles: true,
  },
});
