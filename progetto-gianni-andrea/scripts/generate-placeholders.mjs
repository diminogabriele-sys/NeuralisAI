/**
 * Genera le immagini segnaposto (JPG) in src/assets/images e l'immagine Open Graph in public/.
 * Uso: npm run placeholders
 * Per sostituirle basta sovrascrivere i file con le foto reali, mantenendo lo stesso nome.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../src/assets/images/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const items = [
  { file: 'servizio-carene.jpg', w: 1600, h: 1200, label: 'Foto carena su misura' },
  { file: 'servizio-aero.jpg', w: 1600, h: 1200, label: 'Foto appendici aerodinamiche' },
  { file: 'servizio-finiture.jpg', w: 1600, h: 1200, label: 'Foto dettaglio finiture' },
  { file: 'chi-siamo.jpg', w: 1600, h: 2000, label: 'Foto laboratorio / team' },
];

const svg = (w, h, label, big = false) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="twill" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="24" height="24" fill="#111113"/>
      <rect width="12" height="12" fill="#18181b"/>
      <rect x="12" y="12" width="12" height="12" fill="#18181b"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="45%" r="65%">
      <stop offset="0" stop-color="#2a2217" stop-opacity=".55"/>
      <stop offset=".55" stop-color="#0A0A0B" stop-opacity=".55"/>
      <stop offset="1" stop-color="#0A0A0B" stop-opacity=".97"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" x2="1">
      <stop offset="0" stop-color="#8A6A2F"/><stop offset=".5" stop-color="#E6C77F"/><stop offset="1" stop-color="#C9A45C"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#twill)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g fill="none" stroke="url(#gold)" stroke-width="3">
    <path d="M60 140V60h80M${w - 140} 60h80v80M${w - 60} ${h - 140}v80h-80M140 ${h - 60}H60v-80"/>
  </g>
  <text x="50%" y="${h / 2 - (big ? 40 : 10)}" text-anchor="middle" font-family="DejaVu Serif, Georgia, serif" font-size="${big ? 120 : 64}" fill="url(#gold)" letter-spacing="12">XXX</text>
  <text x="50%" y="${h / 2 + (big ? 50 : 60)}" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="${big ? 34 : 30}" fill="#F4F1EA" letter-spacing="6">${label.toUpperCase()}</text>
  <text x="50%" y="${h / 2 + (big ? 100 : 110)}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="#A39E94" letter-spacing="3">PLACEHOLDER · ${w}×${h}</text>
</svg>`;

for (const it of items) {
  await sharp(Buffer.from(svg(it.w, it.h, it.label)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(new URL(it.file, OUT).pathname);
  console.log('✓', it.file);
}

await sharp(Buffer.from(svg(1200, 630, 'Carene e aerodinamica su misura', true)))
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(new URL('../public/og-image.jpg', import.meta.url).pathname);
console.log('✓ public/og-image.jpg');
