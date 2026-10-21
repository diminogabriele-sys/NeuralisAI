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
  return group;
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
  const flow = buildFlow(isSmall() ? 260 : 520, {
    x0: -size.x * 1.4, x1: size.x * 1.4,
    y0: -size.y * 1.6, y1: size.y * 1.6,
    z0: -size.z * 0.55, z1: size.z * 0.55,
  });
  pivot.add(flow.points);

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

  // vista 3/4 dall'alto: apertura in orizzontale, muso verso chi guarda
  const BASE_RY = Math.PI / 2 - 0.42;
  const BASE_RX = 0.42;
  pivot.rotation.set(BASE_RX, BASE_RY, 0);
  scene.add(pivot);

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
    const MODEL = 3.7; // ingombro apparente del modello a scala 1
    const s = wide ? Math.min(0.4 * visW, 0.72 * visH) / MODEL : (0.8 * visW) / MODEL;
    const offX = wide ? visW * 0.24 : 0;
    const offY = wide ? 0.1 : 0.15;
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
    const ry = BASE_RY + Math.sin(t * 0.25) * 0.3 + target.x * 0.35 + scrollP * 1.0;
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
