/**
 * Converte il modello STL dell'ala (models/ala.stl) nel formato compatto usato dall'hero 3D
 * (src/lib/wing-data.js). Uso: npm run wing   — oppure: node scripts/convert-wing.mjs percorso/file.stl
 *
 * Il file STL viene: letto (binario o ASCII), unito nei vertici duplicati, quantizzato a 16 bit
 * e salvato in base64 dentro un modulo JS caricato solo quando serve.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2] || new URL('../models/ala.stl', import.meta.url).pathname;
const buf = readFileSync(src);

// --- lettura triangoli ---
const tris = [];
const isAscii = buf.subarray(0, 5).toString() === 'solid' && buf.toString('latin1', 0, 1000).includes('facet');
if (isAscii) {
  const nums = [...buf.toString('latin1').matchAll(/vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g)].map((m) => m.slice(1, 4).map(Number));
  for (let i = 0; i + 2 < nums.length; i += 3) tris.push([nums[i], nums[i + 1], nums[i + 2]]);
} else {
  const n = buf.readUInt32LE(80);
  for (let i = 0; i < n; i++) {
    const o = 84 + i * 50 + 12;
    const v = (k) => [buf.readFloatLE(o + k * 12), buf.readFloatLE(o + k * 12 + 4), buf.readFloatLE(o + k * 12 + 8)];
    tris.push([v(0), v(1), v(2)]);
  }
}

// --- bounding box ---
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (const t of tris) for (const p of t) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); }

// --- quantizzazione + unione vertici ---
const Q = 65535;
const q = (p) => p.map((c, k) => Math.round(((c - min[k]) / (max[k] - min[k] || 1)) * Q));
const map = new Map();
const verts = [];
const idx = [];
for (const t of tris) {
  const ids = t.map((p) => {
    const qp = q(p);
    const key = qp.join(',');
    let id = map.get(key);
    if (id === undefined) { id = verts.length; map.set(key, id); verts.push(qp); }
    return id;
  });
  if (ids[0] !== ids[1] && ids[1] !== ids[2] && ids[0] !== ids[2]) idx.push(...ids);
}

// --- serializzazione: [nVert u32][nIdx u32][min 3×f32][max 3×f32][pos nVert×3 u16][idx u16|u32] ---
const big = verts.length > 65535;
const head = Buffer.alloc(8 + 24);
head.writeUInt32LE(verts.length, 0);
head.writeUInt32LE(idx.length, 4);
min.forEach((v, k) => head.writeFloatLE(v, 8 + k * 4));
max.forEach((v, k) => head.writeFloatLE(v, 20 + k * 4));
const pos = Buffer.alloc(verts.length * 6);
verts.forEach((v, i) => v.forEach((c, k) => pos.writeUInt16LE(c, i * 6 + k * 2)));
const ib = Buffer.alloc(idx.length * (big ? 4 : 2));
idx.forEach((v, i) => (big ? ib.writeUInt32LE(v, i * 4) : ib.writeUInt16LE(v, i * 2)));
const out = Buffer.concat([head, pos, ib]);

writeFileSync(
  new URL('../src/lib/wing-data.js', import.meta.url),
  `// Generato da scripts/convert-wing.mjs a partire da ${src.split('/').pop()} — non modificare a mano.\n` +
    `export const WING_INDEX32 = ${big};\nexport const WING_DATA = '${out.toString('base64')}';\n`
);
console.log(`triangoli ${tris.length} → vertici unici ${verts.length}, indici ${idx.length}, ${(out.length / 1024).toFixed(0)} KB`);
