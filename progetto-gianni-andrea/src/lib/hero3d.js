/**
 * Scena 3D dell'hero: winglet in fibra di carbonio con filetti oro e flusso d'aria animato.
 * Caricata in modo differito (vedi Hero.astro) solo se il browser supporta WebGL.
 *
 * Quando avrai il modello 3D reale (.glb) potrai sostituire buildWing() con GLTFLoader.
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Shape,
  ExtrudeGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  PMREMGenerator,
  AmbientLight,
  DirectionalLight,
  PointLight,
  CatmullRomCurve3,
  TubeGeometry,
  Vector3,
  BufferGeometry,
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

/* ---------- Profilo alare NACA 4 cifre ---------- */
function airfoil(chord, m = 0.06, p = 0.4, t = 0.12, n = 36) {
  const up = [];
  const lo = [];
  for (let i = 0; i <= n; i++) {
    const x = (1 - Math.cos((i / n) * Math.PI)) / 2; // distribuzione coseno
    const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x ** 2 + 0.2843 * x ** 3 - 0.1036 * x ** 4);
    const yc = x < p ? (m / p ** 2) * (2 * p * x - x ** 2) : (m / (1 - p) ** 2) * (1 - 2 * p + 2 * p * x - x ** 2);
    up.push([x * chord, (yc + yt) * chord]);
    lo.push([x * chord, (yc - yt) * chord]);
  }
  const shape = new Shape();
  shape.moveTo(up[n][0], up[n][1]);
  for (let i = n - 1; i >= 0; i--) shape.lineTo(up[i][0], up[i][1]);
  for (let i = 1; i <= n; i++) shape.lineTo(lo[i][0], lo[i][1]);
  shape.closePath();
  return { shape, up };
}

/** Estrude il profilo lungo l'apertura con rastremazione, freccia e diedro */
function wingElement(chord, span, { taper = 0.4, sweep = 0.9, dihedral = 0.25, camber = 0.06, thick = 0.12 } = {}) {
  const { shape, up } = airfoil(chord, camber, 0.4, thick);
  const geo = new ExtrudeGeometry(shape, { depth: span, steps: 48, bevelEnabled: false, curveSegments: 1 });
  const pos = geo.attributes.position;
  const warp = (x, y, z) => {
    const s = z / span;
    const k = 1 - taper * s;
    return [x * k + sweep * s * s, y * k + dihedral * s * s, z];
  };
  for (let i = 0; i < pos.count; i++) {
    const [x, y, z] = warp(pos.getX(i), pos.getY(i), pos.getZ(i));
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  // Curva del bordo d'attacco (per il filetto oro)
  const lead = [];
  for (let j = 0; j <= 24; j++) {
    const z = (j / 24) * span;
    const [x, y] = warp(up[1][0] * 0.2, 0.004, z);
    lead.push(new Vector3(x, y, z));
  }
  return { geo, lead, warp };
}

/** Profilo dell'endplate: bordo d'attacco arrotondato e coda più alta, come nelle winglet da gara */
function endplateShape() {
  const sh = new Shape();
  sh.moveTo(0.05, 0.28);
  sh.quadraticCurveTo(0.02, 0.02, 0.35, 0.0);
  sh.lineTo(1.3, -0.04);
  sh.quadraticCurveTo(1.46, -0.04, 1.46, 0.1);
  sh.lineTo(1.46, 0.68);
  sh.quadraticCurveTo(1.46, 0.8, 1.32, 0.8);
  sh.lineTo(0.55, 0.72);
  sh.quadraticCurveTo(0.08, 0.66, 0.05, 0.28);
  return sh;
}

/** Winglet "a scatola" stile MotoGP: due profili sovrapposti chiusi da due endplate */
function buildWing(carbonMat, goldMat) {
  const group = new Group();
  const span = 2.2;
  const opts = { taper: 0.18, sweep: 0.35, dihedral: 0.12 };

  const lower = wingElement(1.25, span, { ...opts, camber: 0.07, thick: 0.11 });
  group.add(new Mesh(lower.geo, carbonMat));

  const upper = wingElement(1.0, span, { ...opts, camber: 0.08, thick: 0.1 });
  const upperMesh = new Mesh(upper.geo, carbonMat);
  upperMesh.position.set(0.3, 0.42, 0);
  upperMesh.rotation.z = -0.12;
  group.add(upperMesh);

  // Filetti oro sui bordi d'attacco
  group.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(lower.lead), 64, 0.011, 8, false), goldMat));
  const upLead = new Mesh(new TubeGeometry(new CatmullRomCurve3(upper.lead), 64, 0.011, 8, false), goldMat);
  upLead.position.copy(upperMesh.position);
  upLead.rotation.copy(upperMesh.rotation);
  group.add(upLead);

  // Endplate interno ed esterno con cornice oro
  const plate = endplateShape();
  const plateGeo = new ExtrudeGeometry(plate, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2, curveSegments: 12 });
  const trimPts = plate.getSpacedPoints(120).map((p) => new Vector3(p.x, p.y, 0));
  const trimGeo = new TubeGeometry(new CatmullRomCurve3(trimPts, true), 200, 0.014, 6, true);
  for (const z of [0, span]) {
    const tip = lower.warp(0, 0, z);
    const holder = new Group();
    holder.position.set(tip[0] - 0.1, tip[1] - 0.2, z - 0.015);
    holder.add(new Mesh(plateGeo, carbonMat));
    const trim = new Mesh(trimGeo, goldMat);
    trim.position.z = z === 0 ? -0.012 : 0.045;
    holder.add(trim);
    group.add(holder);
  }
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
  const gold = new MeshStandardMaterial({ color: '#d4ae63', metalness: 1, roughness: 0.22, envMapIntensity: 1.4 });

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
  const wing = buildWing(carbon, gold);
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

  pivot.rotation.set(0.35, -0.7, -0.08);
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
    const MODEL = 2.8; // ingombro apparente del modello a scala 1
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
    const ry = -0.7 + Math.sin(t * 0.25) * 0.35 + target.x * 0.35 + scrollP * 1.2;
    const rx = 0.35 + Math.sin(t * 0.4) * 0.05 + target.y * 0.12 - scrollP * 0.3;
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
