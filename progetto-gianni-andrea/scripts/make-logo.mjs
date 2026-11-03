/**
 * Genera i file del logo a partire da models/logo-orion-originale.jpg (logo chiaro su fondo nero):
 *  - src/assets/brand/logo-orion.png  logo con sfondo trasparente (per header, footer, pannello)
 *  - public/favicon.png, public/apple-touch-icon.png  simbolo (le tre ali) su fondo scuro
 *  - public/og-image.jpg  immagine per le condivisioni social
 * Uso: node scripts/make-logo.mjs [file]
 */
import sharp from 'sharp';
const src = process.argv[2] || new URL('../models/logo-orion-originale.jpg', import.meta.url).pathname;
const out = (p) => new URL('../' + p, import.meta.url).pathname;

const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// trasparenza dalla luminosità: nero → trasparente, bianco/argento → pieno (rumore JPEG eliminato)
const lo = 28, hi = 200;
const rgba = Buffer.alloc(W * H * 4);
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let i = 0; i < W * H; i++) {
  const l = data[i];
  const a = Math.max(0, Math.min(255, Math.round(((l - lo) / (hi - lo)) * 255)));
  // colore: argento chiaro, leggermente più scuro dove il logo originale è più grigio
  const c = Math.round(205 + Math.min(1, l / 255) * 50);
  rgba[i * 4] = c; rgba[i * 4 + 1] = c; rgba[i * 4 + 2] = c; rgba[i * 4 + 3] = a;
  if (a > 40) { const x = i % W, y = (i / W) | 0; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
}
const pad = 4;
const crop = { left: Math.max(0, minX - pad), top: Math.max(0, minY - pad), width: Math.min(W, maxX + pad) - Math.max(0, minX - pad), height: Math.min(H, maxY + pad) - Math.max(0, minY - pad) };
const full = sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(crop);
const logoBuf = await full.png().toBuffer();
await sharp(logoBuf).png({ compressionLevel: 9 }).toFile(out('src/assets/brand/logo-orion.png'));
console.log('logo', crop.width + '×' + crop.height);

// simbolo: la parte alta dentro l'ellisse (le tre ali), cercata come la zona chiara sopra la scritta
const ex = (r) => Math.round(r);
const sym = { left: crop.left + ex(crop.width * 0.24), top: crop.top + ex(crop.height * 0.12), width: ex(crop.width * 0.52), height: ex(crop.height * 0.36) };
const symBuf = await sharp(await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(sym).png().toBuffer()).trim({ threshold: 10 }).png().toBuffer();
const square = async (size, file) => {
  const inner = Math.round(size * 0.9);
  const icon = await sharp(symBuf).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0a0a0b' } })
    .composite([{ input: icon, gravity: 'center' }]).png().toFile(out(file));
};
await square(64, 'public/favicon.png');
await square(180, 'public/apple-touch-icon.png');
await square(512, 'public/icon-512.png');

// immagine social 1200×630: logo centrato su nero con leggero bagliore oro
const og = await sharp(logoBuf).resize(820, null).toBuffer();
const glow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="g" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#C9A45C" stop-opacity=".14"/><stop offset="1" stop-color="#0a0a0b" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="#0a0a0b"/><rect width="1200" height="630" fill="url(#g)"/></svg>`);
await sharp(glow).composite([{ input: og, gravity: 'center' }]).jpeg({ quality: 88, mozjpeg: true }).toFile(out('public/og-image.jpg'));
console.log('ok');
