// Shared helpers: every reel exposes window.DURATION and window.renderAt(t), a pure function of time.
const C = { obs: '#0F1110', ti: '#E2E8E4', acid: '#C5FF4D', steel: '#2D3230', mute: '#7C8580' };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
const E = {
  out3: p => 1 - Math.pow(1 - p, 3),
  out5: p => 1 - Math.pow(1 - p, 5),
  in3: p => p * p * p,
  io3: p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  back: p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  elastic: p => (p === 0 || p === 1 ? p : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI) / 3) + 1),
};
// deterministic pseudo-random
const rnd = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const $ = id => document.getElementById(id);
const css = (el, o) => { if (typeof el === 'string') el = $(el); Object.assign(el.style, o); return el; };
const vis = (t, a, b) => t >= a && t < b;
// Logo markup: acid dot + italic serif wordmark + mono suffix, as in the site nav
const logoHTML = (size = 96) => `<span style="display:inline-flex;align-items:baseline;gap:${size * .22}px">
  <span class="ldot" style="width:${size * .26}px;height:${size * .26}px;border-radius:50%;background:${C.acid};display:inline-block;transform:translateY(-${size * .08}px)"></span>
  <span style="font-family:'Instrument Serif';font-style:italic;font-size:${size}px;color:${C.ti}">Neuralis</span>
  <span style="font-family:'JetBrains Mono';font-size:${size * .22}px;letter-spacing:.2em;color:${C.mute}">/SYS</span></span>`;
// Film grain + progress bar overlay shared by all reels
function chrome(t) {
  const g = $('grain');
  if (g) g.style.backgroundPosition = `${Math.floor(rnd(Math.floor(t * 24)) * 200)}px ${Math.floor(rnd(Math.floor(t * 24) + 9) * 200)}px`;
  const pb = $('pbar');
  if (pb) pb.style.transform = `scaleX(${t / window.DURATION})`;
}
