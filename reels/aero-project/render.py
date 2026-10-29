import sys, math, subprocess, os
import numpy as np, cv2, cairo
from PIL import Image, ImageDraw, ImageFont
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
N = 690
FD = '/usr/share/fonts/opentype/inter/'
F_HEAD = FD + 'InterDisplay-BlackItalic.otf'
F_LAB = FD + 'InterDisplay-SemiBold.otf'
F_BODY = FD + 'Inter-Medium.otf'
F_BOLD = FD + 'InterDisplay-Bold.otf'

CYAN = (0.25, 0.90, 1.0)
HOT = (1.0, 0.33, 0.10)
WHITE = (1, 1, 1)

# scene boundaries (frames)
SC = [('front', 0, 75), ('wings', 75, 165), ('appendix', 165, 255), ('side', 255, 375),
      ('lean', 375, 525), ('part', 525, 600), ('full', 600, 690)]


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def eo(t):  # ease out cubic
    t = clamp(t); return 1 - (1 - t) ** 3


def eio(t):
    t = clamp(t); return 4 * t * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def ramp(f, a, b):
    return clamp((f - a) / float(b - a))


# ---------------------------------------------------------------- plates
def grade(img):
    x = img.astype(np.float32) / 255.0
    x = np.clip((x - 0.5) * 1.12 + 0.5, 0, 1)            # contrast
    x = x * x * (3 - 2 * x) * 0.35 + x * 0.65               # soft S-curve
    lum = x.mean(axis=2, keepdims=True)
    x = lum + (x - lum) * 0.92                              # slight desat
    shadow = (1 - lum) ** 2
    x = x + shadow * np.array([0.035, 0.018, -0.005], np.float32)  # BGR: teal shadows
    return np.clip(x * 255, 0, 255).astype(np.float32)


PLATES = {}


def load():
    for k in ['front', 'wings', 'appendix', 'side', 'part', 'full']:
        gain = {'appendix': 1.45, 'side': 1.3}.get(k, 1.0)
        PLATES[k] = grade(np.clip(cv2.imread(os.path.join(HERE, f'plate_{k}.png')).astype(np.float32) * gain, 0, 255))


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.55 * np.clip(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H * 0.52) / (H * 0.62)) ** 2, 0, 1))[..., None]
TOPG = np.clip(1 - yy / 640.0, 0, 1) ** 1.6
BOTG = np.clip((yy - 1180) / 740.0, 0, 1) ** 1.4
SHADE = (1 - 0.82 * np.maximum(TOPG, BOTG))[..., None]
rng = np.random.default_rng(7)
GRAIN = [rng.normal(0, 5.0, (H // 2, W // 2)).astype(np.float32) for _ in range(6)]


def affine(s, focus, anchor, punch=1.0):
    s = s * punch
    tx = anchor[0] - s * focus[0]
    ty = anchor[1] - s * focus[1]
    tx = min(0, max(W - s * 1080, tx))
    ty = min(0, max(H - s * 1440, ty))
    return np.float32([[s, 0, tx], [0, s, ty]])


def warp(plate, M):
    return cv2.warpAffine(plate, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)


def mp(M, x, y):
    return (M[0, 0] * x + M[0, 1] * y + M[0, 2], M[1, 0] * x + M[1, 1] * y + M[1, 2])


# ---------------------------------------------------------------- text sprites
_cache = {}


def sprite(txt, font, size, color=(255, 255, 255), track=0.0, maxw=None):
    key = (txt, font, size, color, track, maxw)
    if key in _cache:
        return _cache[key]
    while True:
        f = ImageFont.truetype(font, size)
        widths = [f.getlength(c) + track * size for c in txt]
        tw = int(sum(widths) - track * size + size * 0.4)
        if maxw is None or tw <= maxw or size < 20:
            break
        size = int(size * 0.95)
    asc, desc = f.getmetrics()
    h = asc + desc + 8
    im = Image.new('RGBA', (tw + 8, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = 2
    for c, w in zip(txt, widths):
        d.text((x, 2), c, font=f, fill=color + (255,))
        x += w
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3:4] / 255.0
    bgra = np.dstack([a[..., 2:3] * al, a[..., 1:2] * al, a[..., 0:1] * al, a[..., 3:4]]).astype(np.uint8)
    bgra = np.ascontiguousarray(bgra)
    surf = cairo.ImageSurface.create_for_data(memoryview(bgra), cairo.FORMAT_ARGB32, bgra.shape[1], bgra.shape[0], bgra.shape[1] * 4)
    res = (surf, bgra.shape[1], bgra.shape[0], bgra)
    _cache[key] = res
    return res


def text(ctx, txt, x, y, font, size, p=1.0, color=(255, 255, 255), track=0.0, alpha=1.0, align='l', maxw=None, mode='rise'):
    """p: reveal progress 0..1. mode rise = masked slide-up."""
    if p <= 0:
        return 0
    surf, w, h, _ = sprite(txt, font, size, color, track, maxw)
    if align == 'r':
        x -= w
    elif align == 'c':
        x -= w / 2
    e = eo(p)
    ctx.save()
    ctx.rectangle(x - 10, y, w + 40, h)
    ctx.clip()
    off = (1 - e) * h * 1.05 if mode == 'rise' else 0
    ctx.set_source_surface(surf, x + (1 - e) * 18, y + off)
    ctx.paint_with_alpha(alpha * (e if mode != 'rise' else min(1, e * 1.6)))
    ctx.restore()
    return w


# ---------------------------------------------------------------- drawing helpers
def rgba(ctx, c, a):
    ctx.set_source_rgba(c[0], c[1], c[2], a)


def glow_line(ctx, pts, c, w, a=1.0, glow=True):
    if len(pts) < 2:
        return
    if glow:
        for gw, ga in ((w * 7, 0.07), (w * 3.5, 0.16)):
            ctx.set_line_width(gw); rgba(ctx, c, ga * a)
            ctx.move_to(*pts[0]); [ctx.line_to(*q) for q in pts[1:]]; ctx.stroke()
    ctx.set_line_width(w); rgba(ctx, c, a)
    ctx.move_to(*pts[0]); [ctx.line_to(*q) for q in pts[1:]]; ctx.stroke()


def arrow(ctx, x0, y0, x1, y1, c, w=8, a=1.0, head=30, glow=True, dash=None):
    L = math.hypot(x1 - x0, y1 - y0)
    if L < 2:
        return
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    hb = min(head, L * 0.6)
    bx, by = x1 - ux * hb * 0.8, y1 - uy * hb * 0.8
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    if dash:
        ctx.set_dash(dash)
    glow_line(ctx, [(x0, y0), (bx, by)], c, w, a, glow)
    ctx.set_dash([])
    px, py = -uy, ux
    tri = [(x1, y1), (x1 - ux * hb + px * hb * 0.55, y1 - uy * hb + py * hb * 0.55),
           (x1 - ux * hb - px * hb * 0.55, y1 - uy * hb - py * hb * 0.55)]
    if glow:
        rgba(ctx, c, 0.25 * a)
        ctx.set_line_width(w * 2.5); ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.move_to(*tri[0]); [ctx.line_to(*q) for q in tri[1:]]; ctx.close_path(); ctx.stroke()
    rgba(ctx, c, a)
    ctx.move_to(*tri[0]); [ctx.line_to(*q) for q in tri[1:]]; ctx.close_path(); ctx.fill()


def ring(ctx, x, y, r, c, a, w=3):
    ctx.set_line_width(w); rgba(ctx, c, a)
    ctx.arc(x, y, r, 0, 2 * math.pi); ctx.stroke()


def radial(ctx, x, y, r, c, a):
    g = cairo.RadialGradient(x, y, 0, x, y, r)
    g.add_color_stop_rgba(0, c[0], c[1], c[2], a)
    g.add_color_stop_rgba(0.5, c[0], c[1], c[2], a * 0.45)
    g.add_color_stop_rgba(1, c[0], c[1], c[2], 0)
    ctx.set_source(g); ctx.arc(x, y, r, 0, 2 * math.pi); ctx.fill()


def callout(ctx, x, y, x2, y2, x3, label, p, c=CYAN, side='l'):
    """dot at (x,y) -> elbow (x2,y2) -> horizontal to x3, label above line"""
    if p <= 0:
        return
    e = eo(p)
    radial(ctx, x, y, 34, c, 0.5 * e)
    rgba(ctx, c, e); ctx.arc(x, y, 7, 0, 2 * math.pi); ctx.fill()
    ring(ctx, x, y, 16 + 10 * (1 - e), c, 0.8 * e, 2)
    seg1 = clamp(p * 3); seg2 = clamp(p * 3 - 1)
    ctx.set_line_width(2.5); rgba(ctx, c, 0.95)
    ctx.move_to(x, y); ctx.line_to(x + (x2 - x) * seg1, y + (y2 - y) * seg1); ctx.stroke()
    if seg2 > 0:
        ctx.move_to(x2, y2); ctx.line_to(x2 + (x3 - x2) * eo(seg2), y2); ctx.stroke()
    lp = clamp(p * 3 - 1.4)
    if side == 'l':
        text(ctx, label, min(x2, x3), y2 - 46, F_LAB, 30, lp, (64, 230, 255), 0.14)
    else:
        text(ctx, label, max(x2, x3), y2 - 46, F_LAB, 30, lp, (64, 230, 255), 0.14, align='r')


def speed_lines(ctx, f, cx, cy, a, n=46, seed=1):
    r = np.random.default_rng(seed)
    ang = r.uniform(0, 2 * math.pi, n); ph = r.uniform(0, 1, n); sp = r.uniform(0.6, 1.4, n)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for i in range(n):
        q = (ph[i] + f * 0.045 * sp[i]) % 1.0
        r0 = 260 + q * 1100; r1 = r0 + 90 + 260 * q
        ctx.set_line_width(1.5 + 3 * q); ctx.set_source_rgba(1, 1, 1, a * q * (1 - q) * 2.2)
        ctx.move_to(cx + math.cos(ang[i]) * r0, cy + math.sin(ang[i]) * r0)
        ctx.line_to(cx + math.cos(ang[i]) * r1, cy + math.sin(ang[i]) * r1); ctx.stroke()


# ---------------------------------------------------------------- HUD / titles
def hud(ctx, f, idx):
    text(ctx, 'AERO / PROJECT', 70, 132, F_BOLD, 26, ramp(f, 2, 14), (64, 230, 255), 0.42)
    if idx:
        text(ctx, f'{idx:02d} / 05', 1010, 132, F_BOLD, 26, 1, (255, 255, 255), 0.2, alpha=0.75, align='r')
    ctx.set_line_width(3); ctx.set_source_rgba(1, 1, 1, 0.16)
    ctx.move_to(70, 186); ctx.line_to(1010, 186); ctx.stroke()
    ctx.set_source_rgba(*CYAN, 1); ctx.move_to(70, 186); ctx.line_to(70 + 940 * (f / (N - 1)), 186); ctx.stroke()


def headline(ctx, lf, kicker, lines, start=4, y=222, size=104, out=None, col2=(255, 255, 255)):
    a = 1.0
    if out is not None:
        a = 1 - ramp(lf, out, out + 6)
        if a <= 0:
            return
    text(ctx, kicker, 72, y, F_LAB, 30, ramp(lf, start, start + 10), (64, 230, 255), 0.18, alpha=a)
    yy_ = y + 48
    for i, ln in enumerate(lines):
        c = (255, 255, 255) if i == 0 else col2
        text(ctx, ln, 64, yy_, F_HEAD, size, ramp(lf, start + 3 + 4 * i, start + 15 + 4 * i), c, -0.01, alpha=a, maxw=950)
        yy_ += int(size * 1.08)


def sub(ctx, lf, l1, l2=None, start=20, y=1352):
    rgba(ctx, CYAN, 1)
    p = eo(ramp(lf, start, start + 10))
    if p > 0:
        ctx.rectangle(72, y + 8, 6, 104 * p if l2 else 52 * p); ctx.fill()
    text(ctx, l1, 100, y, F_BOLD, 40, ramp(lf, start + 2, start + 12), (255, 255, 255))
    if l2:
        text(ctx, l2, 100, y + 54, F_BODY, 36, ramp(lf, start + 5, start + 15), (200, 210, 222))


# ---------------------------------------------------------------- scene backgrounds
def kb(lf, dur, s0, s1):
    return s0 + (s1 - s0) * eio(lf / dur)


def punch_k(lf):
    return 1 + 0.10 * (1 - eo(lf / 9.0))


def bg_scene(name, lf, dur):
    cfg = {
        'front': (1.62, 1.40, (540, 700), (540, 1000)),
        'wings': (1.36, 1.50, (510, 720), (540, 1010)),
        'appendix': (1.36, 1.52, (640, 800), (560, 990)),
        'side': (1.36, 1.44, (460, 820), (540, 1010)),
        'part': (1.36, 1.48, (560, 1000), (540, 1060)),
        'full': (1.36, 1.42, (560, 960), (540, 1060)),
    }[name]
    s = kb(lf, dur, cfg[0], cfg[1])
    if name == 'front':
        s = cfg[0] + (cfg[1] - cfg[0]) * eo(lf / 40.0) - 0.04 * eio(ramp(lf, 40, dur))
    M = affine(s, cfg[2], cfg[3], punch_k(lf) if name != 'front' else 1.0)
    return warp(PLATES[name], M), M


# ---------------------------------------------------------------- scenes
def sc_front(ctx, lf, M):
    speed_lines(ctx, lf, 540, 900, 0.55 * (1 - ramp(lf, 30, 60)))
    headline(ctx, lf, 'BMW S1000RR · AERO CUSTOM', ['PROGETTATA', 'PER LA PIEGA.'], start=6, size=118, col2=(64, 230, 255))
    sub(ctx, lf, 'Ali anteriori + appendici inferiori.', 'Come lavora l’aria, in 20 secondi.', start=26)


def sc_wings(ctx, lf, M):
    headline(ctx, lf, '01 — ALI ANTERIORI', ['ARIA SU.', 'MOTO GIÙ.'], size=124, col2=(255, 110, 60))
    for i, (px, py) in enumerate([(270, 700), (752, 700)]):
        x, y = mp(M, px, py)
        p = ramp(lf, 8 + 3 * i, 26 + 3 * i)
        if p > 0:
            e = eo(p)
            radial(ctx, x, y, 120, CYAN, 0.28 * e)
            ring(ctx, x, y, 70 + 40 * (1 - e), CYAN, 0.9 * e, 3)
            pulse = (lf * 0.035 + i * 0.3) % 1.0
            ring(ctx, x, y, 70 + 70 * pulse, CYAN, 0.5 * (1 - pulse) * e, 2)
        # upwash: deflected air (cyan) and reaction force (hot)
        q = ramp(lf, 26 + 3 * i, 46 + 3 * i)
        if q > 0:
            sgn = -1 if i == 0 else 1
            pts = []
            for k in range(0, 21):
                u = k / 20.0 * eo(q)
                pts.append((x + sgn * (20 + 60 * u), y - 30 - 190 * u * u - 40 * u))
            glow_line(ctx, pts, CYAN, 4, 0.9)
            if q > 0.9:
                arrow(ctx, pts[-3][0], pts[-3][1], pts[-1][0], pts[-1][1], CYAN, 4, 0.9, 22, False)
        r = ramp(lf, 40 + 3 * i, 58 + 3 * i)
        if r > 0:
            L = 230 * eo(r)
            arrow(ctx, x, y + 40, x, y + 40 + L, HOT, 9, 1.0, 34)
    lp = ramp(lf, 52, 64)
    if lp > 0:
        x, y = mp(M, 752, 700)
        text(ctx, 'DEPORTANZA', x - 30, y + 200, F_LAB, 30, lp, (255, 120, 70), 0.14, align='r')
        x, y = mp(M, 270, 700)
        text(ctx, 'ARIA DEVIATA', x - 10, y - 330, F_LAB, 30, lp, (64, 230, 255), 0.14)
    sub(ctx, lf, 'Più carico sull’anteriore,', 'meno tendenza all’impennata.', start=50)


def light_sweep(img, lf, a, b, ang=0.35, width=180, strength=60):
    p = ramp(lf, a, b)
    if p <= 0 or p >= 1:
        return img
    pos = -400 + p * (W + 1400)
    d = (xx + yy * ang) - pos
    band = np.exp(-(d / width) ** 2)[..., None]
    lum = img.mean(axis=2, keepdims=True) / 255.0
    return img + band * strength * (0.35 + lum)


def sc_appendix(ctx, lf, M):
    headline(ctx, lf, '02 — APPENDICI INFERIORI', ['A FILO', 'D’ASFALTO.'], size=124, col2=(64, 230, 255))
    x, y = mp(M, 760, 860)
    callout(ctx, x, y, x - 140, y + 230, 110, 'APPENDICE · FORMA REALE', ramp(lf, 22, 50))
    sub(ctx, lf, 'In piega si avvicinano al suolo:', 'è lì che entrano in gioco.', start=48)


# streamlines for side view (plate coordinates)
_SX = np.linspace(-120, 1200, 140)
STREAMS = []
for y0 in [560, 630, 700, 770, 840, 910, 980, 1050, 1120]:
    g = np.exp(-((_SX - 400) / 270.0) ** 2)
    g2 = np.exp(-((_SX - 820) / 170.0) ** 2)
    if y0 < 800:
        A = -34 * math.exp(-(800 - y0) / 260.0)
        k = 0.25
    elif y0 < 880:
        A = -6; k = 0.45
    else:
        A = -0.42 * (y0 - 860); k = 1.0
    ys = y0 + A * g + (14 if y0 > 860 else 4) * g2
    v = 1 + 0.85 * k * g
    dx = np.diff(_SX)
    tau = np.concatenate([[0], np.cumsum(dx / ((v[1:] + v[:-1]) / 2))])
    STREAMS.append((ys, v, tau, y0))


def vcol(v):
    t = clamp((v - 1) / 0.85)
    return (CYAN[0] + (1 - CYAN[0]) * t, CYAN[1] + (1 - CYAN[1]) * t, CYAN[2])


def sc_side(ctx, lf, M):
    s = M[0, 0]
    # low pressure zone
    zp = ramp(lf, 40, 60)
    if zp > 0:
        x, y = mp(M, 420, 935)
        pulse = 0.85 + 0.15 * math.sin(lf * 0.25)
        radial(ctx, x, y, 300, (0.15, 0.45, 1.0), 0.42 * eo(zp) * pulse)
        text(ctx, '− P', 1010, y - 120, F_HEAD, 64, ramp(lf, 50, 62), (150, 200, 255), align='r')
        text(ctx, 'PRESSIONE PIÙ BASSA', 1010, y - 40, F_LAB, 28, ramp(lf, 54, 66), (150, 200, 255), 0.14, align='r')
    draw_p = eo(ramp(lf, 4, 34))
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for li, (ys, v, tau, y0) in enumerate(STREAMS):
        n = len(_SX)
        m = max(2, int(n * draw_p))
        pts = [mp(M, _SX[i], ys[i]) for i in range(m)]
        ctx.set_line_width(2.2)
        for i in range(m - 1):
            c = vcol(v[i])
            rgba(ctx, c, 0.28 + 0.25 * (v[i] - 1))
            ctx.move_to(*pts[i]); ctx.line_to(*pts[i + 1]); ctx.stroke()
        # particles
        if lf > 16:
            T = tau[-1]
            for pk in range(5):
                t0 = ((lf - 16) * 9.5 + pk * T / 5 + li * 37) % T
                tail = 120
                ts = np.linspace(max(0, t0 - tail), t0, 10)
                px = np.interp(ts, tau, _SX); py = np.interp(ts, tau, ys); pv = np.interp(ts, tau, v)
                cp = [mp(M, px[j], py[j]) for j in range(len(px))]
                for j in range(len(cp) - 1):
                    a = (j + 1) / len(cp)
                    c = vcol(pv[j])
                    ctx.set_line_width(2 + 4 * a * (pv[j] - 0.5))
                    rgba(ctx, c, a * 0.95)
                    ctx.move_to(*cp[j]); ctx.line_to(*cp[j + 1]); ctx.stroke()
                rgba(ctx, (1, 1, 1), 0.9); ctx.arc(cp[-1][0], cp[-1][1], 3.5, 0, 2 * math.pi); ctx.fill()
    # incoming air arrow
    ap = ramp(lf, 6, 20)
    if ap > 0:
        x, y = mp(M, 0, 520)
        arrow(ctx, 60, y - 30, 60 + 220 * eo(ap), y - 30, WHITE, 5, 0.95, 26)
        text(ctx, 'ARIA', 64, y - 92, F_LAB, 30, ap, (255, 255, 255), 0.2)
    headline(ctx, lf, '03 — IL FLUSSO', ['ARIA VELOCE,', 'PRESSIONE BASSA.'], size=104, col2=(64, 230, 255))
    # legend
    lp = ramp(lf, 60, 72)
    if lp > 0:
        g = cairo.LinearGradient(72, 0, 392, 0)
        g.add_color_stop_rgba(0, *CYAN, 1); g.add_color_stop_rgba(1, 1, 1, 1, 1)
        ctx.set_source(g); ctx.rectangle(72, 1440, 320 * eo(lp), 8); ctx.fill()
        text(ctx, 'VELOCITÀ', 72, 1396, F_LAB, 24, lp, (200, 210, 222), 0.18)
        text(ctx, 'LINEE ILLUSTRATIVE · NON CFD', 1010, 1396, F_LAB, 22, lp, (150, 160, 175), 0.14, align='r')


# ---------------------------------------------------------------- lean scene
LEAN_MAX = 48.0


def lean_state(lf):
    th = LEAN_MAX * eio(ramp(lf, 16, 74))
    px = 540 + 320 * eio(ramp(lf, 16, 74))
    return th, (px, 1600.0), 0.72


def lean_M(th, P, s):
    c, sn = math.cos(math.radians(th)), math.sin(math.radians(th))
    p0 = (540.0, 1440.0)
    return np.float32([[s * c, s * sn, P[0] - s * (c * p0[0] + sn * p0[1])],
                       [-s * sn, s * c, P[1] - s * (-sn * p0[0] + c * p0[1])]])


ASPH = None


def lean_bg(lf):
    global ASPH
    th, P, s = lean_state(lf)
    M = lean_M(th, P, s)
    pl = PLATES['front']
    img = cv2.warpAffine(pl, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
    # elliptical spotlight in bike frame
    Mi = cv2.invertAffineTransform(M)
    bx = Mi[0, 0] * xx + Mi[0, 1] * yy + Mi[0, 2]
    by = Mi[1, 0] * xx + Mi[1, 1] * yy + Mi[1, 2]
    d = ((bx - 540) / 520.0) ** 2 + ((by - 800) / 760.0) ** 2
    m = np.clip((1.15 - d) / 0.5, 0, 1)
    m = m * np.clip((P[1] - yy) / 6.0, 0, 1)
    lum = img.mean(axis=2, keepdims=True)
    img = lum + (img - lum) * 0.55
    m3 = (m ** 1.3)[..., None]
    base = np.zeros_like(img) + np.array([16, 11, 8], np.float32)
    # asphalt
    ground = np.clip((yy - P[1]) / 320.0, 0, 1)[..., None]
    asph = np.array([26, 22, 20], np.float32) * (1 - 0.6 * ground)
    base = np.where((yy >= P[1])[..., None], asph, base)
    out = base * (1 - m3) + img * m3 * 0.95
    return out, M, th, P, s


def bike_pt(M, x, y):
    return mp(M, x, y)


def sc_lean(ctx, lf, M, th, P, s):
    c, sn = math.cos(math.radians(th)), math.sin(math.radians(th))
    down_b = (sn, c)     # bike-frame down in canvas
    # ground line
    gp = eo(ramp(lf, 0, 14))
    g = cairo.LinearGradient(0, 0, W, 0)
    g.add_color_stop_rgba(0, *CYAN, 0); g.add_color_stop_rgba(0.5, *CYAN, 0.9); g.add_color_stop_rgba(1, *CYAN, 0)
    ctx.set_source(g); ctx.set_line_width(3)
    ctx.move_to(W / 2 - 560 * gp, P[1]); ctx.line_to(W / 2 + 560 * gp, P[1]); ctx.stroke()
    # moving asphalt dashes (perspective feeling)
    for k in range(7):
        q = ((lf * 0.04) + k / 7.0) % 1.0
        yv = P[1] + 10 + q * q * 320
        ctx.set_source_rgba(1, 1, 1, 0.10 * (1 - q) * gp)
        ctx.set_line_width(1 + 3 * q)
        ctx.move_to(0, yv); ctx.line_to(W, yv); ctx.stroke()
    # lean arc at contact patch
    if th > 1:
        ctx.set_line_width(3); ctx.set_source_rgba(1, 1, 1, 0.7)
        ctx.arc(P[0], P[1], 170, -math.pi / 2 - math.radians(th), -math.pi / 2); ctx.stroke()
        ctx.set_dash([10, 8]); ctx.set_source_rgba(1, 1, 1, 0.45)
        ctx.move_to(P[0], P[1]); ctx.line_to(P[0], P[1] - 260); ctx.stroke(); ctx.set_dash([])
    # corner sidepods: force vectors fixed to the bike frame, mostly lateral when upright.
    # In lean the inner one turns towards vertical and works close to the asphalt (ground effect).
    sp = ramp(lf, 4, 18)
    gpw = clamp((th - 12) / 36.0)
    sa = math.radians(70)
    for side, (bx, by) in ((-1, (240, 760)), (1, (860, 760))):
        x, y = bike_pt(M, bx, by)
        if sp <= 0:
            continue
        vb = (side * math.sin(sa), math.cos(sa))
        v = (c * vb[0] + sn * vb[1], -sn * vb[0] + c * vb[1])
        if side < 0:
            L = (110 + 110 * eo(gpw)) * eo(sp); a = 1.0
            if v[1] > 0.1:
                L = min(L, (P[1] - 14 - y) / v[1])
        else:
            L = 110 * (1 - 0.45 * gpw) * eo(sp); a = 1 - 0.7 * gpw
        radial(ctx, x, y, 60, HOT, 0.35 * sp * a)
        rgba(ctx, HOT, a); ctx.arc(x, y, 7, 0, 2 * math.pi); ctx.fill()
        arrow(ctx, x, y, x + v[0] * L, y + v[1] * L, HOT, 8, a, 32)
        if side < 0 and th > 3:
            vy = L * v[1]
            k = clamp(th / 12.0)
            arrow(ctx, x, y, x, y + vy, (1, 1, 1), 3.5, 0.85 * k, 20, glow=False, dash=[12, 9])
            ctx.set_dash([4, 6]); ctx.set_source_rgba(1, 1, 1, 0.4 * k); ctx.set_line_width(2)
            ctx.move_to(x, y + vy); ctx.line_to(x + v[0] * L, y + v[1] * L); ctx.stroke(); ctx.set_dash([])
    lx, ly = bike_pt(M, 860, 760)
    text(ctx, 'SIDEPOD', lx + 28, ly - 60, F_LAB, 30, ramp(lf, 10, 22), (255, 120, 70), 0.16)
    # inner sidepod: ground effect in the gap with the asphalt
    ax_, ay_ = bike_pt(M, 240, 760)
    if gpw > 0:
        gap_y = (ay_ + P[1]) / 2
        pulse = 0.85 + 0.15 * math.sin(lf * 0.3)
        radial(ctx, ax_, gap_y + 10, 230, (0.15, 0.45, 1.0), 0.55 * gpw * pulse)
        ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        for k in range(9):
            q = ((lf * 0.07) + k / 9.0) % 1.0
            xx0 = ax_ - 260 + q * 520
            yv = gap_y - 26 + (k % 3) * 22
            ctx.set_source_rgba(0.75, 0.95, 1, 0.8 * gpw * math.sin(q * math.pi))
            ctx.set_line_width(3)
            ctx.move_to(xx0, yv); ctx.line_to(xx0 + 70, yv); ctx.stroke()
        text(ctx, 'EFFETTO SUOLO', 72, P[1] + 30, F_LAB, 30, ramp(lf, 70, 84), (120, 190, 255), 0.16)
        text(ctx, 'SIDEPOD LATO INTERNO', 72, P[1] + 72, F_LAB, 24, ramp(lf, 74, 88), (200, 210, 222), 0.14)
    # angle readout
    rp = ramp(lf, 12, 24)
    text(ctx, 'ANGOLO DI PIEGA', 72, 560, F_LAB, 26, rp, (200, 210, 222), 0.18)
    if rp > 0:
        text(ctx, f'{int(round(th)):02d}°', 64, 596, F_HEAD, 150, 1.0, (255, 255, 255), 0.0, alpha=eo(rp))
    # qualitative chart: vertical load from the inner sidepod vs lean
    cp = ramp(lf, 84, 100)
    if cp > 0:
        x0, y0, cw, ch = 620, 640, 390, 260
        ctx.set_source_rgba(0.02, 0.03, 0.05, 0.55 * cp); ctx.rectangle(x0 - 24, y0 - 92, cw + 48, ch + 150); ctx.fill()
        text(ctx, 'CARICO VERTICALE', x0, y0 - 78, F_LAB, 24, cp, (255, 255, 255), 0.16)
        text(ctx, 'sidepod · schema qualitativo', x0, y0 - 44, F_BODY, 22, cp, (150, 160, 175))
        ctx.set_source_rgba(1, 1, 1, 0.35 * cp); ctx.set_line_width(2)
        ctx.move_to(x0, y0); ctx.line_to(x0, y0 + ch); ctx.line_to(x0 + cw, y0 + ch); ctx.stroke()
        text(ctx, '0°', x0 - 6, y0 + ch + 8, F_LAB, 20, cp, (150, 160, 175))
        text(ctx, '50°', x0 + cw, y0 + ch + 8, F_LAB, 20, cp, (150, 160, 175), align='r')
        th_s = np.linspace(0, 50, 60)
        r_ = np.radians(th_s)
        ge = np.clip((th_s - 12) / 36.0, 0, 1)
        side_v = (np.sin(sa) * np.sin(r_) + np.cos(sa) * np.cos(r_)) * (1 + ge * ge * (3 - 2 * ge))
        sx = lambda t: x0 + t / 50.0 * cw
        sy = lambda v: y0 + ch - v / 2.1 * ch
        dp = eo(ramp(lf, 88, 120))
        m = max(2, int(60 * dp))
        glow_line(ctx, [(sx(th_s[i]), sy(side_v[i])) for i in range(m)], HOT, 3.5, cp)
        mx = sx(min(th, 50)); ctx.set_source_rgba(1, 1, 1, 0.5 * cp); ctx.set_line_width(1.5)
        ctx.set_dash([5, 5]); ctx.move_to(mx, y0); ctx.line_to(mx, y0 + ch); ctx.stroke(); ctx.set_dash([])
        text(ctx, 'SIDEPOD INTERNO', x0 + cw - 10, y0 + 10, F_LAB, 20, ramp(lf, 110, 122), (255, 120, 70), 0.14, align='r')
    # headlines: two beats
    headline(ctx, lf, '04 — IN PIEGA', ['LA FORZA RUOTA', 'CON LA MOTO.'], start=2, size=104, out=78, col2=(255, 110, 60))
    if lf >= 80:
        headline(ctx, lf - 80, '04 — IN PIEGA', ['IL LATO INTERNO', 'USA L’ASFALTO.'], start=0, size=104, col2=(120, 190, 255))


def sc_part(ctx, lf, M, img_ref=None):
    # print-layer scan line across the part
    p = ramp(lf, 8, 60)
    if 0 < p < 1:
        yp = 1400 - 600 * eio(p)
        x0, y = mp(M, 230, yp); x1, _ = mp(M, 930, yp)
        g = cairo.LinearGradient(x0, 0, x1, 0)
        g.add_color_stop_rgba(0, *CYAN, 0); g.add_color_stop_rgba(0.5, *CYAN, 0.95); g.add_color_stop_rgba(1, *CYAN, 0)
        ctx.set_source(g); ctx.set_line_width(3); ctx.move_to(x0, y); ctx.line_to(x1, y); ctx.stroke()
        g2 = cairo.LinearGradient(0, y, 0, y + 90)
        g2.add_color_stop_rgba(0, *CYAN, 0.16); g2.add_color_stop_rgba(1, *CYAN, 0)
        ctx.set_source(g2); ctx.rectangle(x0, y, x1 - x0, 90); ctx.fill()
    headline(ctx, lf, '05 — ISPIRAZIONE', ['FILOSOFIA', 'PANIGALE V4 R.'], size=110, col2=(255, 110, 60))
    sub(ctx, lf, 'Stesso principio, geometria nostra.', 'Disegnata e stampata in 3D.', start=24)


def sc_full(ctx, lf, M):
    words = ['PROGETTATA.', 'STAMPATA.', 'MONTATA.']
    for i, w_ in enumerate(words):
        col = (255, 255, 255) if i < 2 else (64, 230, 255)
        text(ctx, w_, 64, 236 + i * 118, F_HEAD, 116, ramp(lf, 7.5 * i, 8 + 7.5 * i), col)
    sub(ctx, lf, 'Prossimo step: dati in pista.', 'Il beneficio si misura, non si immagina.', start=32)
    # end card
    e = ramp(lf, 70, 82)
    if e > 0:
        ctx.set_source_rgba(0.01, 0.015, 0.025, 0.92 * eo(e)); ctx.rectangle(0, 0, W, H); ctx.fill()
        text(ctx, 'AERO / PROJECT', W / 2, 890, F_HEAD, 92, ramp(lf, 74, 84), (255, 255, 255), 0.04, align='c')
        p = eo(ramp(lf, 76, 88))
        ctx.set_source_rgba(*CYAN, 1); ctx.rectangle(W / 2 - 220 * p, 1010, 440 * p, 5); ctx.fill()
        text(ctx, 'AERODINAMICA IN PIEGA', W / 2, 1040, F_LAB, 28, ramp(lf, 80, 89), (64, 230, 255), 0.3, align='c')


# ---------------------------------------------------------------- frame
def render(f):
    for idx, (name, a, b) in enumerate(SC):
        if a <= f < b:
            break
    lf = f - a
    dur = b - a
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    if name == 'lean':
        img, M, th, P, s = lean_bg(lf)
        if lf < 9:
            pass
    else:
        img, M = bg_scene(name, lf, dur)
        if name == 'appendix':
            img = light_sweep(img, lf, 6, 40)
        if name == 'wings':
            img = light_sweep(img, lf, 2, 30, ang=-0.3, strength=40)
    # transition in: directional blur + flash
    if f > 0 and lf < 6:
        k = int(80 * (1 - lf / 6.0)) | 1
        img = cv2.blur(img, (k, 1))
    # out: speed blur last 3 frames
    if b - f <= 3 and b != N:
        k = int(50 * (4 - (b - f)) / 3) | 1
        img = cv2.blur(img, (k, 1))
    img = img * VIG * SHADE
    # overlay graphics
    if name == 'front':
        sc_front(ctx, lf, M)
    elif name == 'wings':
        sc_wings(ctx, lf, M)
    elif name == 'appendix':
        sc_appendix(ctx, lf, M)
    elif name == 'side':
        sc_side(ctx, lf, M)
    elif name == 'lean':
        sc_lean(ctx, lf, M, th, P, s)
    elif name == 'part':
        sc_part(ctx, lf, M)
    elif name == 'full':
        sc_full(ctx, lf, M)
    hud(ctx, f, [0, 1, 2, 3, 4, 5, 5][idx])
    surf.flush()
    ov = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32)
    al = ov[..., 3:4] / 255.0
    img = img * (1 - al) + ov[..., :3]
    # flash on cuts
    fl = 0.0
    if lf < 4 and f > 0:
        fl = 0.38 * (1 - lf / 4.0)
    if f < 5:
        fl = max(fl, 0.9 * (1 - f / 5.0))
    if fl > 0:
        img = img * (1 - fl) + 255 * fl
    gr = cv2.resize(GRAIN[f % len(GRAIN)], (W, H), interpolation=cv2.INTER_LINEAR)
    img = img + gr[..., None]
    # fade out end
    if f >= N - 6:
        img = img * ((N - 1 - f) / 6.0) + 0
    return np.clip(img, 0, 255).astype(np.uint8).tobytes()


def init():
    load()


if __name__ == '__main__':
    out = sys.argv[1]
    frames = list(range(N))
    if len(sys.argv) > 2:  # stills
        load()
        for f in map(int, sys.argv[2].split(',')):
            im = np.frombuffer(render(f), np.uint8).reshape(H, W, 3)
            cv2.imwrite(os.path.join(out, f'still_{f:03d}.png'), im)
        sys.exit()
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS),
                          '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    with Pool(4, initializer=init) as pool:
        for i, buf in enumerate(pool.imap(render, frames, chunksize=4)):
            p.stdin.write(buf)
            if i % 60 == 0:
                print('frame', i, flush=True)
    p.stdin.close(); p.wait()
