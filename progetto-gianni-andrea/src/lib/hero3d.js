/**
 * Scena 3D dell'hero: winglet in fibra di carbonio con filetti oro e flusso d'aria animato.
 * Caricata in modo differito (vedi Hero.astro) solo se il browser supporta WebGL.
 *
 * L'ala è il modello reale (models/ala.stl): per cambiarlo sostituisci il file e lancia `npm run wing`.
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  PMREMGenerator,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Vector3,
  BufferGeometry,
  LineSegments,
  EdgesGeometry,
  LineBasicMaterial,
  BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  RingGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Box3,
  MathUtils,
  Color,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { WING_DATA, WING_INDEX32 } from './wing-data.js';

const GOLD = new Color('#c9a45c');

/* ---------- Texture carbonio twill 2x2 generata via canvas ---------- */
function carbonTexture() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const cell = s / 8;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const warp = (x + y) % 4 < 2;
      const grad = warp ? g.createLinearGradient(x * cell, 0, (x + 1) * cell, 0) : g.createLinearGradient(0, y * cell, 0, (y + 1) * cell);
      grad.addColorStop(0, '#0d0d0f');
      grad.addColorStop(0.5, warp ? '#2c2c31' : '#232327');
      grad.addColorStop(1, '#0d0d0f');
      g.fillStyle = grad;
      g.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  const tex = new CanvasTexture(c);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(2.2, 2.2);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------- Ala reale (dal file STL convertito con scripts/convert-wing.mjs) ---------- */
function decodeWing() {
  const bytes = Uint8Array.from(atob(WING_DATA), (c) => c.charCodeAt(0));
  const dv = new DataView(bytes.buffer);
  const nV = dv.getUint32(0, true);
  const nI = dv.getUint32(4, true);
  const min = [0, 1, 2].map((k) => dv.getFloat32(8 + k * 4, true));
  const max = [0, 1, 2].map((k) => dv.getFloat32(20 + k * 4, true));
  const pos = new Float32Array(nV * 3);
  for (let i = 0; i < nV; i++) {
    const p = [0, 1, 2].map((k) => min[k] + (dv.getUint16(32 + i * 6 + k * 2, true) / 65535) * (max[k] - min[k]));
    // STL: X = apertura, Y = direzione di marcia, Z = alto  →  scena: X = marcia, Y = alto, Z = apertura
    pos[i * 3] = p[1];
    pos[i * 3 + 1] = p[2];
    pos[i * 3 + 2] = p[0];
  }
  const off = 32 + nV * 6;
  const index = WING_INDEX32
    ? new Uint32Array(bytes.buffer.slice(off, off + nI * 4))
    : new Uint16Array(bytes.buffer.slice(off, off + nI * 2));
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setIndex(new BufferAttribute(index, 1));
  return geo;
}

/** UV a proiezione "a scatola": ogni triangolo prende la trama del carbonio dal piano più vicino */
function boxUVs(geo, scale = 1.6) {
  const p = geo.attributes.position;
  const uv = new Float32Array(p.count * 2);
  const a = new Vector3(), b = new Vector3(), c = new Vector3(), n = new Vector3();
  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    n.subVectors(c, b).cross(a.clone().sub(b));
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    for (let k = 0; k < 3; k++) {
      const v = [a, b, c][k];
      const [u, w] = ax >= ay && ax >= az ? [v.z, v.y] : ay >= az ? [v.x, v.z] : [v.x, v.y];
      uv[(i + k) * 2] = u * scale;
      uv[(i + k) * 2 + 1] = w * scale;
    }
  }
  geo.setAttribute('uv', new BufferAttribute(uv, 2));
}

function buildWing(carbonMat, goldLineMat) {
  const group = new Group();
  const geo = decodeWing();
  geo.computeBoundingBox();
  const c = geo.boundingBox.getCenter(new Vector3());
  const span = geo.boundingBox.max.z - geo.boundingBox.min.z;
  geo.translate(-c.x, -c.y, -c.z);
  geo.scale(3.1 / span, 3.1 / span, 3.1 / span); // apertura ~3.1 unità, come la vecchia ala

  // superfici lisce con spigoli vivi (angolo di piega 32°)
  const shaded = toCreasedNormals(geo, MathUtils.degToRad(32));
  boxUVs(shaded);
  group.add(new Mesh(shaded, carbonMat));

  // filetti oro sugli spigoli vivi
  group.add(new LineSegments(new EdgesGeometry(geo, 30), goldLineMat));
  group.userData.geo = geo;
  return group;
}

/* ---------- Linee di flusso (galleria del vento) ----------
   Si calcola una "mappa d'ingombro" dell'ala (quota superiore e inferiore per ogni punto
   in pianta) e si tracciano linee che scorrono dal muso verso la coda, salendo sopra il
   profilo o passando sotto. Lungo ogni linea corrono impulsi luminosi dorati. */
function buildStreamlines(geo, { lines = 15 } = {}) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const NX = 64, NZ = 48;
  const top = new Float32Array(NX * NZ).fill(-Infinity);
  const bot = new Float32Array(NX * NZ).fill(Infinity);
  const cx = (x) => Math.min(NX - 1, Math.max(0, Math.floor(((x - bb.min.x) / (bb.max.x - bb.min.x)) * NX)));
  const cz = (z) => Math.min(NZ - 1, Math.max(0, Math.floor(((z - bb.min.z) / (bb.max.z - bb.min.z)) * NZ)));
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = cz(p.getZ(i)) * NX + cx(p.getX(i));
    top[k] = Math.max(top[k], p.getY(i));
    bot[k] = Math.min(bot[k], p.getY(i));
  }
  // riempie i piccoli vuoti tra i vertici
  for (let pass = 0; pass < 2; pass++) {
    const t2 = top.slice(), b2 = bot.slice();
    for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) {
      const k = z * NX + x;
      if (top[k] > -Infinity) continue;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx, zz = z + dz;
        if (xx < 0 || zz < 0 || xx >= NX || zz >= NZ) continue;
        const kk = zz * NX + xx;
        if (top[kk] > -Infinity) { t2[k] = Math.max(t2[k], top[kk]); b2[k] = Math.min(b2[k], bot[kk]); }
      }
    }
    top.set(t2); bot.set(b2);
  }

  const chord = bb.max.x - bb.min.x;
  const spanZ = bb.max.z - bb.min.z;
  const x0 = bb.min.x - chord * 0.65, x1 = bb.max.x + chord * 1.4;
  const ymid = (bb.min.y + bb.max.y) / 2, h = bb.max.y - bb.min.y;
  const M = 120; // punti per linea
  const clear = h * 0.07;
  const NL = 9; // quote per ogni sezione
  const levels = Array.from({ length: NL }, (_, i) => ymid + h * (0.95 - (1.9 * i) / (NL - 1)));
  const dx = (x1 - x0) / (M - 1);
  let rnd = 7;
  const rand = () => ((rnd = (rnd * 16807) % 2147483647) / 2147483647); // pseudo-casuale ripetibile

  const linesData = [];
  for (let li = 0; li < lines; li++) {
    const z = bb.min.z - spanZ * 0.03 + ((li + 0.5) / lines) * spanZ * 1.06;
    for (const yl of levels) {
      // 1) quota "rigida": sopra o sotto l'ala dove la attraversa
      const ys = [];
      for (let j = 0; j < M; j++) {
        const x = x0 + j * dx;
        let y = yl;
        if (x >= bb.min.x && x <= bb.max.x) {
          const k = cz(z) * NX + cx(x);
          if (top[k] > -Infinity) {
            const mid = (top[k] + bot[k]) / 2;
            y = yl >= mid ? Math.max(yl, top[k] + clear) : Math.min(yl, bot[k] - clear);
          }
        }
        ys.push(y);
      }
      // 2) ammorbidita: la linea si alza prima del bordo d'attacco e ricade dolcemente
      const above = yl >= ymid;
      const sm = ys.map((_, j) => {
        let acc = 0, w = 0;
        for (let d = -9; d <= 9; d++) {
          const jj = Math.min(M - 1, Math.max(0, j + d));
          const ww = 1 - Math.abs(d) / 10;
          acc += ys[jj] * ww; w += ww;
        }
        return acc / w;
      });
      const fy = sm.map((v, j) => (above ? Math.max(v, ys[j]) : Math.min(v, ys[j])));

      // 3) scia turbolenta dietro il bordo d'uscita (ampiezza crescente)
      const ph = rand() * 6.28, ph2 = rand() * 6.28, fr = 0.8 + rand() * 0.9;
      const nearMid = Math.exp(-Math.abs(yl - ymid) / (h * 0.9));
      const pts = [], vel = [];
      for (let j = 0; j < M; j++) {
        const x = x0 + j * dx;
        let y = fy[j], zz = z;
        const wake = Math.max(0, (x - bb.max.x) / chord);
        if (wake > 0) {
          // scia: ondulazione morbida e crescente, come le linee dietro il pilota nel riferimento
          const amp = Math.min(wake, 1.4) * h * 0.3 * nearMid;
          y += Math.sin(ph + wake * fr * 3.0) * amp + Math.sin(ph2 + wake * 2.1) * amp * 0.3;
          zz += Math.sin(ph2 + wake * fr * 1.6) * amp * 0.35;
        }
        pts.push(new Vector3(x, y, zz));

        // velocità stimata: blu nel flusso libero, rosso dove accelera aderendo alla superficie
        let v = 0;
        const k = cz(z) * NX + cx(Math.min(Math.max(x, bb.min.x), bb.max.x));
        if (x >= bb.min.x - chord * 0.08 && x <= bb.max.x + chord * 0.05 && top[k] > -Infinity) {
          const gap = above ? fy[j] - top[k] : bot[k] - fy[j];
          const hug = Math.exp(-Math.max(gap, 0) / (h * 0.22)); // quanto la linea "abbraccia" la superficie
          v += (above ? 1.0 : 0.55) * hug;
        }
        // accelerazione dove la linea si piega sopra il profilo
        const slope = Math.abs((fy[Math.min(M - 1, j + 2)] - fy[Math.max(0, j - 2)]) / (4 * dx));
        v += Math.min(slope * 0.6, 0.35) * (above ? 1 : 0.5);
        // nella scia l'aria è più lenta e mescolata
        if (wake > 0) v = v * Math.exp(-wake * 2.5) + 0.14 * nearMid * Math.exp(-wake * 0.9) * (0.5 + 0.5 * Math.sin(ph + wake * 4));
        vel.push(Math.min(v, 1));
      }
      // velocità ammorbidita lungo la linea
      const vs = vel.map((_, j) => {
        let acc = 0, w = 0;
        for (let d = -3; d <= 3; d++) { const jj = Math.min(M - 1, Math.max(0, j + d)); acc += vel[jj]; w++; }
        return acc / w;
      });
      linesData.push({ pts, vel: vs, seed: rand() });
    }
  }

  // ---- tubi: ogni linea diventa un tubicino con normali per l'ombreggiatura ----
  const RAD = 6;
  const radius = h * 0.014;
  const P = [], N = [], V = [], U = [], S = [], I = [];
  const t = new Vector3(), n = new Vector3(), b2 = new Vector3(), up = new Vector3(0, 1, 0), side = new Vector3(0, 0, 1);
  let base = 0;
  for (const L of linesData) {
    for (let j = 0; j < M; j++) {
      const a = L.pts[Math.max(0, j - 1)], c = L.pts[Math.min(M - 1, j + 1)];
      t.subVectors(c, a).normalize();
      n.crossVectors(t, Math.abs(t.dot(up)) > 0.9 ? side : up).normalize();
      b2.crossVectors(t, n).normalize();
      for (let r = 0; r < RAD; r++) {
        const ang = (r / RAD) * Math.PI * 2;
        const ox = n.x * Math.cos(ang) + b2.x * Math.sin(ang);
        const oy = n.y * Math.cos(ang) + b2.y * Math.sin(ang);
        const oz = n.z * Math.cos(ang) + b2.z * Math.sin(ang);
        const p = L.pts[j];
        P.push(p.x + ox * radius, p.y + oy * radius, p.z + oz * radius);
        N.push(ox, oy, oz);
        V.push(L.vel[j]);
        U.push(j / (M - 1));
        S.push(L.seed);
      }
      if (j < M - 1) {
        for (let r = 0; r < RAD; r++) {
          const r2 = (r + 1) % RAD;
          const i0 = base + j * RAD + r, i1 = base + j * RAD + r2, i2 = base + (j + 1) * RAD + r, i3 = base + (j + 1) * RAD + r2;
          I.push(i0, i2, i1, i1, i2, i3);
        }
      }
    }
    base += M * RAD;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('normal', new BufferAttribute(new Float32Array(N), 3));
  g.setAttribute('vel', new BufferAttribute(new Float32Array(V), 1));
  g.setAttribute('u', new BufferAttribute(new Float32Array(U), 1));
  g.setAttribute('seed', new BufferAttribute(new Float32Array(S), 1));
  g.setIndex(I);

  const mat = new ShaderMaterial({
    transparent: true,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float vel; attribute float u; attribute float seed;
      varying float vVel; varying float vU; varying float vSeed; varying vec3 vN; varying vec3 vView;
      void main(){
        vVel = vel; vU = u; vSeed = seed;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal); vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uOpacity;
      varying float vVel; varying float vU; varying float vSeed; varying vec3 vN; varying vec3 vView;
      vec3 turbo(float x) {
        const vec4 kR = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
        const vec4 kG = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
        const vec4 kB = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
        const vec2 kR2 = vec2(-152.94239396, 59.28637943);
        const vec2 kG2 = vec2(4.27729857, 2.82956604);
        const vec2 kB2 = vec2(-89.90310912, 27.34824973);
        x = clamp(x, 0.0, 1.0);
        vec4 v4 = vec4(1.0, x, x * x, x * x * x);
        vec2 v2 = v4.zw * v4.z;
        return vec3(dot(v4, kR) + dot(v2, kR2), dot(v4, kG) + dot(v2, kG2), dot(v4, kB) + dot(v2, kB2));
      }
      void main(){
        // scala: blu (flusso libero) → ciano → verde → giallo → rosso (massima velocità)
        vec3 col = turbo(0.16 + vVel * 0.8);
        // tubo lucido: luce diffusa + riflesso speculare
        vec3 L = normalize(vec3(-0.4, 0.8, 0.6));
        float diff = 0.55 + 0.45 * max(dot(vN, L), 0.0);
        float spec = pow(max(dot(reflect(-L, vN), vView), 0.0), 24.0) * 0.35;
        // leggero scorrimento di luce lungo il tubo: il flusso "si muove"
        float pulse = exp(-fract(vSeed + uTime * 0.18 - vU) * 6.0) * 0.35;
        float fade = smoothstep(0.0, 0.08, vU) * (1.0 - smoothstep(0.9, 1.0, vU));
        gl_FragColor = vec4(col * diff * (1.0 + pulse) + spec, fade * uOpacity);
      }`,
  });
  const obj = new Mesh(g, mat);
  obj.renderOrder = 2;
  return { obj, mat, count: linesData.length };
}

/* ---------- Particelle del flusso d'aria ---------- */
function buildFlow(count, bounds) {
  const geo = new BufferGeometry();
  const pos = new Float32Array(count * 3);
  const base = new Float32Array(count * 3);
  const alpha = new Float32Array(count);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    base[i * 3] = MathUtils.randFloat(bounds.x0, bounds.x1);
    base[i * 3 + 1] = MathUtils.randFloat(bounds.y0, bounds.y1);
    base[i * 3 + 2] = MathUtils.randFloat(bounds.z0, bounds.z1);
    speed[i] = MathUtils.randFloat(0.9, 1.6);
  }
  pos.set(base);
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('alpha', new BufferAttribute(alpha, 1));
  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: GOLD }, uSize: { value: 26 * Math.min(window.devicePixelRatio, 1.75) } },
    vertexShader: /* glsl */ `
      attribute float alpha; varying float vA; uniform float uSize;
      void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = uSize / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying float vA;
      void main(){ vec2 c = gl_PointCoord - .5; float d = length(c); float a = smoothstep(.5, 0., d); gl_FragColor = vec4(uColor * 1.4, a * a * vA); }`,
  });
  return { points: new Points(geo, mat), base, speed, bounds };
}

/* ---------- Avvio ---------- */
export function initHero(canvas, { reducedMotion = false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const isSmall = () => window.innerWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall() ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;

  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  const carbon = new MeshPhysicalMaterial({
    color: '#ffffff',
    map: carbonTexture(),
    metalness: 0.15,
    roughness: 0.42,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    side: DoubleSide,
  });
  const goldLines = new LineBasicMaterial({ color: '#e6c77f', transparent: true, opacity: 0.95 });

  // Luci: chiave calda, controluce oro, riempimento freddo
  scene.add(new AmbientLight('#ffffff', 0.12));
  const key = new DirectionalLight('#fff4e0', 2.2);
  key.position.set(-4, 5, 6);
  scene.add(key);
  const rim = new DirectionalLight('#e6c77f', 4.5);
  rim.position.set(5, 2, -6);
  scene.add(rim);
  const fill = new PointLight('#8fa6c7', 6, 20);
  fill.position.set(-5, -3, 3);
  scene.add(fill);

  // Modello centrato
  const pivot = new Group();
  const wing = buildWing(carbon, goldLines);
  const box = new Box3().setFromObject(wing);
  const center = box.getCenter(new Vector3());
  wing.position.sub(center);
  pivot.add(wing);

  // Flusso d'aria nel sistema di riferimento dell'ala
  const size = box.getSize(new Vector3());
  const flow = buildFlow(isSmall() ? 20 : 35, {
    x0: -size.x * 1.4, x1: size.x * 1.4,
    y0: -size.y * 1.6, y1: size.y * 1.6,
    z0: -size.z * 0.55, z1: size.z * 0.55,
  });
  pivot.add(flow.points);

  // linee di flusso attorno all'ala reale
  const stream = buildStreamlines(wing.userData.geo, { lines: isSmall() ? 6 : 7 });
  pivot.add(stream.obj);
  if (reducedMotion) stream.mat.uniforms.uOpacity.value = 1;

  // Anello "piattaforma" sotto il modello
  const ring = new Mesh(new RingGeometry(2.05, 2.06, 128), new MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.35, side: DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.25;
  scene.add(ring);
  const ring2 = ring.clone();
  ring2.material = ring.material.clone();
  ring2.material.opacity = 0.12;
  ring2.scale.setScalar(1.35);
  scene.add(ring2);

  // vista laterale 3/4 come in galleria del vento: il flusso scorre da sinistra a destra,
  // le due winglet si vedono in prospettiva
  const BASE_RY = -0.22;
  const BASE_RX = 0.2;
  pivot.rotation.set(BASE_RX, BASE_RY, 0);
  scene.add(pivot);

  let baseScale = 1;
  const startedAt = performance.now();
  let baseY = 0;
  /* Layout responsive: modello a destra su desktop, in alto su mobile */
  const layout = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // dimensioni visibili alla distanza della camera
    const visH = 2 * 9 * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const visW = visH * camera.aspect;
    const wide = camera.aspect > 1.05;
    const MODEL = 2.9; // ingombro apparente del modello a scala 1
    const s = wide ? Math.min(0.4 * visW, 0.72 * visH) / MODEL : (0.8 * visW) / MODEL;
    const offX = wide ? visW * 0.28 : 0;
    const offY = wide ? 0.1 : 0.15;
    baseScale = s;
    baseY = offY;
    pivot.scale.setScalar(s);
    pivot.position.set(offX, offY, 0);
    ring.position.set(offX, offY - 0.95 * s, 0);
    ring2.position.copy(ring.position);
    ring.scale.setScalar(s);
    ring2.scale.setScalar(s * 1.35);
  };
  layout();

  /* Interazione: mouse (desktop) e scroll */
  const target = { x: 0, y: 0 };
  let scrollP = 0;
  const onPointer = (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onScroll = () => {
    scrollP = MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  const ro = new ResizeObserver(() => {
    layout();
    if (!running) renderer.render(scene, camera);
  });
  ro.observe(canvas);

  /* Aggiornamento particelle: flusso lungo +x, deviato vicino al profilo */
  const pAttr = flow.points.geometry.attributes.position;
  const aAttr = flow.points.geometry.attributes.alpha;
  const { x0, x1, y0, y1 } = flow.bounds;
  const updateFlow = (dt) => {
    const arr = pAttr.array;
    for (let i = 0; i < flow.speed.length; i++) {
      const j = i * 3;
      let x = flow.base[j] + flow.speed[i] * dt * 1.6;
      if (x > x1) x = x0;
      flow.base[j] = x;
      const y0i = flow.base[j + 1];
      // deviazione: le linee si aprono attorno al profilo e scendono dietro (deportanza)
      const near = Math.exp(-(x * x) / 1.2) * Math.exp(-(y0i * y0i) / 0.5);
      const wake = x > 0 ? Math.exp(-(y0i * y0i) / 0.8) * Math.min(x, 2) * 0.12 : 0;
      arr[j] = x;
      arr[j + 1] = y0i + Math.sign(y0i || 1) * near * 0.45 + wake;
      arr[j + 2] = flow.base[j + 2];
      const edge = Math.min((x - x0) / 1.2, (x1 - x) / 1.2, 1);
      aAttr.array[i] = Math.max(edge, 0) * (0.25 + 0.75 * near) * (1 - Math.abs(y0i) / (y1 - y0));
    }
    pAttr.needsUpdate = true;
    aAttr.needsUpdate = true;
  };

  let running = false;
  let raf = 0;
  let last = performance.now();
  let t = 0;
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;
    // entrata: l'ala ruota e cresce fino alla posizione di riposo nei primi 2,4 secondi
    // tempo reale (non per fotogramma): entrata e impulsi hanno la stessa durata su ogni dispositivo
    const wall = (now - startedAt) / 1000;
    const intro = 1 - Math.pow(1 - Math.min(wall / 2.4, 1), 3);
    pivot.scale.setScalar(baseScale * (0.82 + 0.18 * intro));
    pivot.position.y = baseY + Math.sin(t * 1.1) * 0.035 * baseScale;
    stream.mat.uniforms.uTime.value = wall;
    stream.mat.uniforms.uOpacity.value = MathUtils.clamp((wall - 0.9) / 1.2, 0, 1);
    const ry = BASE_RY - (1 - intro) * 0.9 + Math.sin(t * 0.25) * 0.12 + target.x * 0.2 + scrollP * 0.6;
    const rx = BASE_RX + Math.sin(t * 0.4) * 0.05 + target.y * 0.12 - scrollP * 0.3;
    pivot.rotation.y = MathUtils.damp(pivot.rotation.y, ry, 3, dt);
    pivot.rotation.x = MathUtils.damp(pivot.rotation.x, rx, 3, dt);
    camera.position.z = MathUtils.damp(camera.position.z, 9 + scrollP * 2.5, 4, dt);
    updateFlow(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || reducedMotion) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Primo frame (anche con reduced motion)
  updateFlow(0);
  renderer.render(scene, camera);

  // Pausa quando l'hero non è visibile o la scheda è nascosta
  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible && !document.hidden ? start() : stop();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden || !visible ? stop() : start()));
  start();

  return { renderer };
}
