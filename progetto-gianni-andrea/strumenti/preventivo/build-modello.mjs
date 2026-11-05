// Genera un file HTML unico (font e logo incorporati) del modello di preventivo Orion
import { readFileSync, writeFileSync } from 'node:fs';
const [ASSETS, OUT] = process.argv.slice(2);
const b64 = (f) => readFileSync(`${ASSETS}/${f}`).toString('base64');
const font = (fam, w, style, f) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${style};src:url(data:font/woff2;base64,${b64(f)}) format('woff2');}`;
const fonts = [
  font('Cormorant Garamond', 400, 'normal', 'cormorant-garamond-latin-400-normal.woff2'),
  font('Cormorant Garamond', 400, 'italic', 'cormorant-garamond-latin-400-italic.woff2'),
  font('Manrope', '200 800', 'normal', 'manrope-latin-wght-normal.woff2'),
  font('JetBrains Mono', 400, 'normal', 'jetbrains-mono-latin-400-normal.woff2'),
].join('\n');
const logo = `data:image/png;base64,${b64('logo-orion.png')}`;
const tpl = readFileSync(new URL('./template.html', import.meta.url), 'utf8').replace('/*FONTS*/', fonts).replace('{{LOGO}}', logo);
writeFileSync(OUT, tpl);
console.log('ok', (tpl.length / 1024).toFixed(0) + ' KB');
