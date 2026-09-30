// Genera le immagini segnaposto (texture "prima/dopo") in src/assets/placeholders.
// Servono solo finché non vengono sostituite con le foto reali dei lavori.
// Uso: node scripts/genera-placeholder.mjs
// ATTENZIONE: sovrascrive i file con lo stesso nome. Non eseguirlo dopo aver inserito le foto reali.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = new URL('../src/assets/placeholders/', import.meta.url);
mkdirSync(OUT, { recursive: true });

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c.join(',')})`;
};

const surfaces = {
  // Autobloccanti posati a correre
  pavers(w, h, r) {
    let s = `<rect width="${w}" height="${h}" fill="#6d6962"/>`;
    s += `<g transform="rotate(-14 ${w / 2} ${h / 2})">`;
    const bw = 128, bh = 64, g = 6;
    for (let y = -h; y < h * 2; y += bh + g) {
      const off = (Math.round(y / (bh + g)) % 2) * (bw / 2);
      for (let x = -w - off; x < w * 2; x += bw + g) {
        const tone = ['#a39d93', '#9a948a', '#aca59a', '#958f86'][Math.floor(r() * 4)];
        s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="${shade(tone, 0.94 + r() * 0.12)}"/>`;
      }
    }
    return s + '</g>';
  },
  // Muretto in pietra
  wall(w, h, r) {
    let s = `<rect width="${w}" height="${h}" fill="#7a7266"/>`;
    for (let y = 0; y < h; ) {
      const rh = 60 + r() * 50;
      for (let x = -40 * r(); x < w; ) {
        const sw = 90 + r() * 130;
        const tone = ['#c2b8a6', '#b5aa96', '#cbbfaa', '#a99f8c'][Math.floor(r() * 4)];
        s += `<rect x="${x + 4}" y="${y + 4}" width="${sw - 8}" height="${rh - 8}" rx="${10 + r() * 14}" fill="${shade(tone, 0.92 + r() * 0.14)}"/>`;
        x += sw;
      }
      y += rh;
    }
    return s;
  },
  // Scalinata in pietra
  steps(w, h, r) {
    let s = `<rect width="${w}" height="${h}" fill="#8f877c"/>`;
    const n = 7;
    const step = h / n;
    for (let i = 0; i < n; i++) {
      const y = i * step;
      s += `<rect x="0" y="${y}" width="${w}" height="${step * 0.62}" fill="${shade('#bdb5a8', 0.95 + r() * 0.08)}"/>`;
      s += `<rect x="0" y="${y + step * 0.62}" width="${w}" height="${step * 0.38}" fill="${shade('#857d72', 0.95 + r() * 0.1)}"/>`;
      s += `<rect x="0" y="${y + step * 0.6}" width="${w}" height="4" fill="#d8d1c5" opacity=".7"/>`;
    }
    return s;
  },
  // Cortile con lastre quadrate
  tiles(w, h, r) {
    let s = `<rect width="${w}" height="${h}" fill="#77776f"/>`;
    const t = 150, g = 6;
    for (let y = -g; y < h; y += t + g)
      for (let x = -g; x < w; x += t + g)
        s += `<rect x="${x}" y="${y}" width="${t}" height="${t}" fill="${shade('#b3b3ab', 0.93 + r() * 0.12)}"/>`;
    return s;
  },
  // Cordolo tra asfalto e prato
  curb(w, h, r) {
    let s = `<rect width="${w}" height="${h * 0.42}" fill="#5b5d5f"/>`;
    for (let i = 0; i < 900; i++)
      s += `<circle cx="${r() * w}" cy="${r() * h * 0.42}" r="${1 + r() * 2.5}" fill="${r() > 0.5 ? '#6c6e70' : '#4d4f51'}"/>`;
    s += `<rect y="${h * 0.42}" width="${w}" height="${h * 0.2}" fill="#c9c4b8"/>`;
    for (let x = 0; x < w; x += 200) s += `<rect x="${x}" y="${h * 0.42}" width="5" height="${h * 0.2}" fill="#8d887d"/>`;
    s += `<rect y="${h * 0.62}" width="${w}" height="${h * 0.05}" fill="#a39e92"/>`;
    s += `<rect y="${h * 0.67}" width="${w}" height="${h * 0.33}" fill="#58703c"/>`;
    for (let i = 0; i < 1400; i++) {
      const x = r() * w, y = h * 0.67 + r() * h * 0.33;
      s += `<rect x="${x}" y="${y}" width="2" height="${6 + r() * 10}" fill="${r() > 0.5 ? '#6b8748' : '#4a6131'}"/>`;
    }
    return s;
  },
};

function svg(type, w, h, seed, dirty) {
  const body = surfaces[type](w, h, rng(seed));
  const dirt = `
    <filter id="f" x="0" y="0" width="100%" height="100%">
      <feComponentTransfer in="SourceGraphic" result="dark">
        <feFuncR type="linear" slope=".6"/><feFuncG type="linear" slope=".6"/><feFuncB type="linear" slope=".52"/>
      </feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency=".009" numOctaves="4" seed="${seed}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .14  0 0 0 0 .17  0 0 0 0 .08  3 0 0 0 -1.15" result="moss"/>
      <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="${seed + 7}" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 .08  0 0 0 0 .08  0 0 0 0 .06  3 0 0 0 -1.55" result="grime"/>
      <feMerge><feMergeNode in="dark"/><feMergeNode in="moss"/><feMergeNode in="grime"/></feMerge>
    </filter>`;
  const clean = `
    <filter id="f" x="0" y="0" width="100%" height="100%">
      <feComponentTransfer in="SourceGraphic" result="b">
        <feFuncR type="linear" slope="1.04"/><feFuncG type="linear" slope="1.04"/><feFuncB type="linear" slope="1.04"/>
      </feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="${seed + 3}" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.2 0 0 0 -.62" result="grain"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="grain"/></feMerge>
    </filter>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${dirty ? dirt : clean}</defs><g filter="url(#f)">${body}</g></svg>`;
}

async function pair(name, type, w, h, seed) {
  for (const dirty of [true, false]) {
    const file = new URL(`${name}-${dirty ? 'prima' : 'dopo'}.jpg`, OUT);
    await sharp(Buffer.from(svg(type, w, h, seed, dirty))).jpeg({ quality: 86, mozjpeg: true }).toFile(fileURLToPath(file));
  }
}

await pair('hero', 'pavers', 1600, 1200, 11);
await pair('lavoro-vialetto', 'pavers', 1200, 900, 21);
await pair('lavoro-muretto', 'wall', 1200, 900, 31);
await pair('lavoro-scalinata', 'steps', 1200, 900, 41);
await pair('lavoro-cortile', 'tiles', 1200, 900, 51);
await pair('lavoro-cordolo', 'curb', 1200, 900, 61);

// Immagini dei servizi: versione "dopo" di ogni superficie
const servizi = { muretti: 'wall', autobloccanti: 'pavers', cortili: 'tiles', scalinate: 'steps', cordoli: 'curb', 'alta-pressione': 'pavers' };
let seed = 100;
for (const [nome, type] of Object.entries(servizi)) {
  await sharp(Buffer.from(svg(type, 960, 720, seed++, nome === 'alta-pressione'))).jpeg({ quality: 84, mozjpeg: true }).toFile(fileURLToPath(new URL(`servizio-${nome}.jpg`, OUT)));
}
console.log('Placeholder generati in', fileURLToPath(OUT));
