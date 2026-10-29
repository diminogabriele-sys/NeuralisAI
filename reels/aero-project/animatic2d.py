#!/usr/bin/env python3
"""2D animatic of the next Aero Project reel (storyboard in motion, no footage).

  python3 reels/aero-project/animatic2d.py out_silent.mp4

Same look as render.py (fonts, HUD, arrows); the bike is a flat 2D drawing and every
scene carries a "RIPRESA" tag with the shot to film. 25 s, cuts on the 120 BPM grid.
"""
import math, os, subprocess, sys
import numpy as np, cairo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render as R
from render import (W, H, FPS, CYAN, HOT, WHITE, F_HEAD, F_LAB, F_BODY, F_BOLD, text, arrow, glow_line,
                    ring, radial, rgba, ramp, eo, eio, clamp, headline, speed_lines)

N = 750
SC = [('hook', 0, 75), ('macro', 75, 150), ('flow', 150, 240), ('tufts', 240, 315), ('lean', 315, 480),
      ('gopro', 480, 555), ('print', 555, 630), ('build', 630, 705), ('pass', 705, 750)]
SHOT = {'hook': 'Orbita gimbal sul frontale · garage buio, luce laterale',
        'macro': 'Macro sul sidepod · barra LED che scorre',
        'flow': 'Profilo laterale a 90° · treppiede',
        'tufts': 'Fili di lana sul sidepod · GoPro in movimento',
        'lean': 'Frontale fisso su treppiede + piega reale in pista',
        'gopro': 'GoPro bassa sul sidepod interno, in piega',
        'print': 'Timelapse stampa 3D + CAD a schermo',
        'build': 'Mani che montano il pezzo → moto 3/4',
        'pass': 'Passaggio radente in panning'}
BG = (0.035, 0.045, 0.065)
BODY = (0.11, 0.12, 0.15)
PURPLE = (0.62, 0.32, 0.95)
R.N = N


def poly(ctx, pts, fill=None, stroke=None, w=3, a=1.0):
    ctx.move_to(*pts[0])
    for p in pts[1:]:
        ctx.line_to(*p)
    ctx.close_path()
    if fill:
        rgba(ctx, fill, a); ctx.fill_preserve() if stroke else ctx.fill()
    if stroke:
        ctx.set_line_width(w); rgba(ctx, stroke, a); ctx.stroke()


def mirror(pts):
    return [(-x, y) for x, y in pts]


SIDEPOD_L = [(-262, -615), (-345, -628), (-360, -545), (-270, -522)]
SIDEPOD_C = (-310, -578)


def draw_front(ctx, cx, cy, th=0.0, s=1.0, glow_pods=1.0):
    """Front view, origin at the contact patch; th = lean in degrees (top goes left)."""
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-math.radians(th)); ctx.scale(s, s)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    # tyre + fork
    poly(ctx, [(-58, -340), (58, -340), (58, -10), (-58, -10)], (0.05, 0.05, 0.06), (0.25, 0.25, 0.28), 3)
    for sx in (-1, 1):
        poly(ctx, [(sx * 70, -560), (sx * 92, -560), (sx * 92, -230), (sx * 70, -230)], (0.72, 0.56, 0.22), None)
    poly(ctx, [(-80, -380), (80, -380), (70, -330), (-70, -330)], BODY, (0.3, 0.3, 0.35), 2)
    # belly fins
    for sx in (-1, 1):
        poly(ctx, [(sx * 110, -470), (sx * 190, -470), (sx * 170, -360), (sx * 120, -380)], BODY, (0.25, 0.27, 0.32), 2)
    # fairing
    fair = [(-270, -520), (-215, -770), (-130, -870), (130, -870), (215, -770), (270, -520), (150, -470), (0, -455), (-150, -470)]
    poly(ctx, fair, BODY, PURPLE, 4)
    for sx in (-1, 1):
        ctx.save(); ctx.translate(sx * 112, -690); ctx.scale(1, 0.62)
        rgba(ctx, (0.8, 0.9, 1.0), 0.85); ctx.arc(0, 0, 62, 0, 2 * math.pi); ctx.fill(); ctx.restore()
    poly(ctx, [(-40, -560), (40, -560), (25, -470), (-25, -470)], (0.3, 0.32, 0.36), None)
    poly(ctx, [(-115, -870), (-72, -1010), (72, -1010), (115, -870)], (0.7, 0.85, 1.0), (0.8, 0.9, 1), 2, 0.28)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for sx in (-1, 1):
        ctx.set_line_width(14); rgba(ctx, (0.08, 0.08, 0.1), 1)
        ctx.move_to(sx * 135, -835); ctx.line_to(sx * 335, -805); ctx.stroke()
        ctx.set_line_width(9); ctx.move_to(sx * 150, -890); ctx.line_to(sx * 310, -935); ctx.stroke()
    # sidepods
    for pts in (SIDEPOD_L, mirror(SIDEPOD_L)):
        if glow_pods > 0:
            c = sum(p[0] for p in pts) / 4, sum(p[1] for p in pts) / 4
            radial(ctx, c[0], c[1], 110, CYAN, 0.35 * glow_pods)
        poly(ctx, pts, (0.17, 0.19, 0.24), CYAN, 4, 1.0)
    ctx.restore()


def front_pt(cx, cy, th, s, x, y):
    c, sn = math.cos(math.radians(th)), math.sin(math.radians(th))
    return cx + s * (c * x + sn * y), cy + s * (-sn * x + c * y)


SIDE_BODY = [(-560, -250), (-520, -420), (-430, -560), (-300, -640), (-120, -660), (60, -700), (300, -720),
             (520, -760), (600, -720), (430, -560), (300, -420), (120, -300), (-180, -260), (-380, -230)]
SIDE_POD = [(-470, -420), (-300, -440), (-260, -340), (-440, -320)]


def draw_side(ctx, cx, cy, s=1.0, pods=True):
    """Side view facing left, origin at ground below the centre."""
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s)
    for wx in (-430, 420):
        rgba(ctx, (0.05, 0.05, 0.06), 1); ctx.arc(wx, -170, 168, 0, 2 * math.pi); ctx.fill()
        ctx.set_line_width(10); rgba(ctx, (0.85, 0.25, 0.25), 1); ctx.arc(wx, -170, 120, 0, 2 * math.pi); ctx.stroke()
        rgba(ctx, (0.6, 0.6, 0.65), 1); ctx.arc(wx, -170, 22, 0, 2 * math.pi); ctx.fill()
    ctx.set_line_width(16); rgba(ctx, (0.72, 0.56, 0.22), 1); ctx.move_to(-430, -170); ctx.line_to(-330, -560); ctx.stroke()
    ctx.set_line_width(14); rgba(ctx, (0.4, 0.42, 0.46), 1); ctx.move_to(420, -170); ctx.line_to(80, -330); ctx.stroke()
    poly(ctx, SIDE_BODY, BODY, PURPLE, 4)
    poly(ctx, [(-330, -640), (-230, -800), (-170, -800), (-200, -655)], (0.7, 0.85, 1.0), (0.8, 0.9, 1), 2, 0.3)
    if pods:
        radial(ctx, -365, -380, 140, CYAN, 0.3)
        poly(ctx, SIDE_POD, (0.17, 0.19, 0.24), CYAN, 4)
    ctx.restore()


def shot_tag(ctx, name, lf):
    p = ramp(lf, 3, 12)
    if p <= 0:
        return
    rgba(ctx, (0, 0, 0), 0.55 * p); ctx.rectangle(60, 1520, 960, 74); ctx.fill()
    rgba(ctx, HOT, p); ctx.rectangle(60, 1520, 8, 74); ctx.fill()
    text(ctx, 'RIPRESA', 88, 1528, F_LAB, 20, p, (255, 120, 70), 0.2)
    text(ctx, SHOT[name], 88, 1552, F_BODY, 28, p, (230, 235, 240), maxw=900)


def grid_bg(ctx, lf, a=0.07):
    rgba(ctx, CYAN, a); ctx.set_line_width(1)
    off = (lf * 2) % 60
    for x in range(0, W + 60, 60):
        ctx.move_to(x, 0); ctx.line_to(x, H); ctx.stroke()
    for y in range(-60, H + 60, 60):
        ctx.move_to(0, y + off); ctx.line_to(W, y + off); ctx.stroke()


# ---------------------------------------------------------------- scenes
def s_hook(ctx, lf):
    sq = 0.75 + 0.25 * abs(math.cos(lf * 0.03))       # fake orbit
    ctx.save(); ctx.translate(540, 0); ctx.scale(sq, 1); ctx.translate(-540, 0)
    draw_front(ctx, 540, 1480, 0, 0.9 + 0.08 * eo(lf / 75))
    ctx.restore()
    speed_lines(ctx, lf, 540, 900, 0.55 * (1 - ramp(lf, 30, 60)))
    headline(ctx, lf, 'BMW S1000RR · AERO CUSTOM', ['PROGETTATA', 'PER LA PIEGA.'], start=6, size=118, col2=(64, 230, 255))


def s_macro(ctx, lf):
    ctx.save(); ctx.translate(540, 960); ctx.scale(2.6, 2.6); ctx.translate(310, 578)
    draw_front(ctx, 0, 0, 0, 1.0)
    ctx.restore()
    # light sweep
    p = ramp(lf, 4, 50)
    if 0 < p < 1:
        x = -200 + p * 1500
        g = cairo.LinearGradient(x - 160, 0, x + 160, 0)
        g.add_color_stop_rgba(0, 1, 1, 1, 0); g.add_color_stop_rgba(.5, 1, 1, 1, .22); g.add_color_stop_rgba(1, 1, 1, 1, 0)
        ctx.set_source(g); ctx.rectangle(0, 0, W, H); ctx.fill()
    e = eo(ramp(lf, 14, 30))
    for r_ in (180, 230):
        ring(ctx, 540, 960, r_ + 60 * (1 - e), CYAN, 0.8 * e, 2)
    text(ctx, 'FORMA REALE · STAMPA 3D', 540, 1230, F_LAB, 28, ramp(lf, 24, 36), (64, 230, 255), 0.16, align='c')
    headline(ctx, lf, '01 — SIDEPOD', ['DISEGNATI', 'PER LA PIEGA.'], size=118, col2=(255, 110, 60))


def streams(ctx, lf, x0, x1, ys, cx, cy, comp=0.42, start=4):
    xs = np.linspace(x0, x1, 120)
    dp = eo(ramp(lf, start, start + 26))
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for li, y0 in enumerate(ys):
        g = np.exp(-((xs - cx) / 260.0) ** 2)
        A = -comp * (y0 - cy) if y0 > cy else -30 * math.exp(-(cy - y0) / 200.0)
        yv = y0 + A * g
        v = 1 + (0.9 if y0 > cy else 0.25) * g
        m = max(2, int(len(xs) * dp))
        for i in range(m - 1):
            t = clamp((v[i] - 1) / 0.9)
            rgba(ctx, (CYAN[0] + (1 - CYAN[0]) * t, CYAN[1] + (1 - CYAN[1]) * t, 1), 0.35 + 0.3 * t)
            ctx.set_line_width(2.4); ctx.move_to(xs[i], yv[i]); ctx.line_to(xs[i + 1], yv[i + 1]); ctx.stroke()
        if lf > start + 10:
            dx = np.diff(xs); tau = np.concatenate([[0], np.cumsum(dx / v[1:])]); T = tau[-1]
            for k in range(4):
                t0 = ((lf - start) * 12 + k * T / 4 + li * 41) % T
                ts = np.linspace(max(0, t0 - 110), t0, 8)
                px, py = np.interp(ts, tau, xs), np.interp(ts, tau, yv)
                for j in range(7):
                    rgba(ctx, WHITE, (j + 1) / 8); ctx.set_line_width(2 + j * 0.6)
                    ctx.move_to(px[j], py[j]); ctx.line_to(px[j + 1], py[j + 1]); ctx.stroke()


def s_flow(ctx, lf):
    draw_side(ctx, 600, 1420, 0.9)
    pz = ramp(lf, 34, 50)
    if pz > 0:
        radial(ctx, 300, 1120, 260, (0.15, 0.45, 1.0), 0.45 * eo(pz))
        text(ctx, '− P', 1010, 1010, F_HEAD, 64, pz, (150, 200, 255), align='r')
        text(ctx, 'PRESSIONE PIÙ BASSA', 1010, 1090, F_LAB, 28, pz, (150, 200, 255), 0.14, align='r')
    streams(ctx, lf, -60, 1140, [880, 950, 1020, 1090, 1160, 1230, 1300], 300, 1080)
    ap = ramp(lf, 4, 16)
    arrow(ctx, 60, 820, 60 + 220 * eo(ap), 820, WHITE, 5, ap, 26)
    text(ctx, 'ARIA', 64, 760, F_LAB, 30, ap, (255, 255, 255), 0.2)
    headline(ctx, lf, '02 — IL FLUSSO', ['ARIA VELOCE,', 'PRESSIONE BASSA.'], size=104, col2=(64, 230, 255))


def s_tufts(ctx, lf):
    ctx.save(); ctx.translate(540, 1000); ctx.scale(2.2, 2.2); ctx.translate(365, 380)
    draw_side(ctx, 0, 0, 1.0)
    ctx.restore()
    rng = np.random.default_rng(4)
    pts = [(rng.uniform(250, 900), rng.uniform(820, 1180)) for _ in range(18)]
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for i, (x, y) in enumerate(pts):
        p = ramp(lf, 6 + i, 14 + i)
        if p <= 0:
            continue
        L = 70 * eo(p)
        ctx.set_line_width(4); rgba(ctx, (1.0, 0.85, 0.3), 0.95)
        ctx.move_to(x, y)
        for k in range(1, 9):
            u = k / 8
            ctx.line_to(x + L * u, y + 6 * math.sin(lf * 0.9 + i + u * 6) * u)
        ctx.stroke()
        rgba(ctx, WHITE, 0.9); ctx.arc(x, y, 4, 0, 2 * math.pi); ctx.fill()
    text(ctx, 'TEST REALE · FILI DI LANA', 72, 1300, F_LAB, 28, ramp(lf, 20, 32), (255, 215, 90), 0.16)
    headline(ctx, lf, '03 — LA PROVA', ['IL FLUSSO,', 'DAL VERO.'], size=118, col2=(255, 215, 90))


def s_lean(ctx, lf):
    th = 48 * eio(ramp(lf, 18, 75))
    px = 540 + 300 * eio(ramp(lf, 18, 75))
    P = (px, 1560); s = 0.85
    gp = eo(ramp(lf, 0, 14))
    g = cairo.LinearGradient(0, 0, W, 0)
    g.add_color_stop_rgba(0, *CYAN, 0); g.add_color_stop_rgba(.5, *CYAN, .9); g.add_color_stop_rgba(1, *CYAN, 0)
    ctx.set_source(g); ctx.set_line_width(3); ctx.move_to(0, P[1]); ctx.line_to(W, P[1]); ctx.stroke()
    rgba(ctx, (0.08, 0.08, 0.1), 1); ctx.rectangle(0, P[1] + 2, W, H); ctx.fill()
    draw_front(ctx, P[0], P[1], th, s, 0.6)
    if th > 1:
        ctx.set_line_width(3); ctx.set_source_rgba(1, 1, 1, 0.7)
        ctx.arc(P[0], P[1], 170, -math.pi / 2 - math.radians(th), -math.pi / 2); ctx.stroke()
    c, sn = math.cos(math.radians(th)), math.sin(math.radians(th))
    sa = math.radians(70)
    gpw = clamp((th - 12) / 36.0); sp = ramp(lf, 4, 18)
    for side in (-1, 1):
        x, y = front_pt(P[0], P[1], th, s, side * -SIDEPOD_C[0], SIDEPOD_C[1])
        vb = (side * math.sin(sa), math.cos(sa))
        v = (c * vb[0] + sn * vb[1], -sn * vb[0] + c * vb[1])
        if side < 0:
            L = (110 + 110 * eo(gpw)) * eo(sp); a = 1.0
            if v[1] > 0.1:
                L = min(L, (P[1] - 14 - y) / v[1])
        else:
            L = 110 * (1 - 0.45 * gpw) * eo(sp); a = 1 - 0.7 * gpw
        if sp > 0:
            arrow(ctx, x, y, x + v[0] * L, y + v[1] * L, HOT, 8, a, 32)
        if side < 0 and gpw > 0:
            gy = (y + P[1]) / 2
            radial(ctx, x, gy, 220, (0.15, 0.45, 1.0), 0.5 * gpw)
            for k in range(8):
                q = ((lf * 0.07) + k / 8.0) % 1.0
                ctx.set_source_rgba(0.75, 0.95, 1, 0.8 * gpw * math.sin(q * math.pi)); ctx.set_line_width(3)
                xx0 = x - 250 + q * 500; yy0 = gy - 20 + (k % 3) * 20
                ctx.move_to(xx0, yy0); ctx.line_to(xx0 + 70, yy0); ctx.stroke()
    rp = ramp(lf, 12, 24)
    text(ctx, 'ANGOLO DI PIEGA', 72, 560, F_LAB, 26, rp, (200, 210, 222), 0.18)
    if rp > 0:
        text(ctx, f'{int(round(th)):02d}°', 64, 596, F_HEAD, 150, 1.0, WHITE and (255, 255, 255), 0.0, alpha=eo(rp))
    cp = ramp(lf, 90, 104)
    if cp > 0:
        x0, y0, cw, ch = 620, 640, 390, 260
        ctx.set_source_rgba(0.02, 0.03, 0.05, 0.6 * cp); ctx.rectangle(x0 - 24, y0 - 92, cw + 48, ch + 150); ctx.fill()
        text(ctx, 'CARICO VERTICALE', x0, y0 - 78, F_LAB, 24, cp, (255, 255, 255), 0.16)
        text(ctx, 'sidepod · schema qualitativo', x0, y0 - 44, F_BODY, 22, cp, (150, 160, 175))
        ctx.set_source_rgba(1, 1, 1, 0.35 * cp); ctx.set_line_width(2)
        ctx.move_to(x0, y0); ctx.line_to(x0, y0 + ch); ctx.line_to(x0 + cw, y0 + ch); ctx.stroke()
        ts = np.linspace(0, 50, 60); r_ = np.radians(ts); ge = np.clip((ts - 12) / 36, 0, 1)
        vv = (np.sin(sa) * np.sin(r_) + np.cos(sa) * np.cos(r_)) * (1 + ge * ge * (3 - 2 * ge))
        m = max(2, int(60 * eo(ramp(lf, 94, 124))))
        glow_line(ctx, [(x0 + ts[i] / 50 * cw, y0 + ch - vv[i] / 2.1 * ch) for i in range(m)], HOT, 3.5, cp)
    headline(ctx, lf, '04 — IN PIEGA', ['LA FORZA RUOTA', 'CON LA MOTO.'], start=2, size=104, out=82, col2=(255, 110, 60))
    if lf >= 84:
        headline(ctx, lf - 84, '04 — IN PIEGA', ['IL LATO INTERNO', 'USA L’ASFALTO.'], start=0, size=104, col2=(120, 190, 255))


def s_gopro(ctx, lf):
    # asphalt rushing in perspective, sidepod edge at the top of the frame
    hy = 760
    rgba(ctx, (0.13, 0.13, 0.15), 1); ctx.rectangle(0, hy, W, H); ctx.fill()
    for k in range(14):
        q = ((lf * 0.06) + k / 14.0) % 1.0
        y = hy + (H - hy) * q * q
        ctx.set_source_rgba(1, 1, 1, 0.08 + 0.25 * q); ctx.set_line_width(1 + 5 * q)
        ctx.move_to(0, y); ctx.line_to(W, y); ctx.stroke()
    for k in range(-6, 7):
        ctx.set_source_rgba(1, 1, 1, 0.06); ctx.set_line_width(2)
        ctx.move_to(540, hy); ctx.line_to(540 + k * 260, H); ctx.stroke()
    ctx.save(); ctx.translate(540, 760); ctx.rotate(-0.06)
    poly(ctx, [(-700, -400), (700, -400), (700, 40), (300, 120), (-500, 90), (-700, 60)], (0.17, 0.19, 0.24), CYAN, 5)
    ctx.restore()
    e = eo(ramp(lf, 10, 26))
    ctx.set_line_width(3); rgba(ctx, WHITE, e)
    ctx.move_to(860, 860); ctx.line_to(860, 860 + 260 * e); ctx.stroke()
    for yy_ in (860, 860 + 260 * e):
        ctx.move_to(830, yy_); ctx.line_to(890, yy_); ctx.stroke()
    text(ctx, 'POCHI CM', 840, 960, F_LAB, 30, ramp(lf, 20, 32), (255, 255, 255), 0.16, align='r')
    speed_lines(ctx, lf, 540, 760, 0.4, seed=3)
    headline(ctx, lf, '05 — PUNTO DI VISTA', ['A FILO', 'D’ASFALTO.'], size=118, col2=(64, 230, 255))


def s_print(ctx, lf):
    grid_bg(ctx, lf, 0.05)
    rgba(ctx, (0.2, 0.22, 0.26), 1)
    ctx.rectangle(160, 1420, 760, 40); ctx.fill()
    ctx.rectangle(160, 640, 30, 780); ctx.fill(); ctx.rectangle(890, 640, 30, 780); ctx.fill()
    ctx.rectangle(160, 640, 760, 26); ctx.fill()
    p = eio(ramp(lf, 4, 66))
    top = 1420 - 560 * p
    shape = [(330, 1420), (380, 1060), (480, 860), (620, 900), (760, 1180), (800, 1420)]
    ctx.save(); ctx.rectangle(0, top, W, 1420 - top); ctx.clip()
    poly(ctx, shape, (0.12, 0.13, 0.16), (0.3, 0.32, 0.38), 3)
    rgba(ctx, WHITE, 0.06); ctx.set_line_width(1)
    for y in range(int(top), 1420, 8):
        ctx.move_to(300, y); ctx.line_to(820, y); ctx.stroke()
    ctx.restore()
    hx = 330 + 470 * (0.5 + 0.5 * math.sin(lf * 0.5))
    rgba(ctx, (0.3, 0.32, 0.36), 1); ctx.rectangle(190, top - 70, 700, 18); ctx.fill()
    poly(ctx, [(hx - 40, top - 110), (hx + 40, top - 110), (hx + 15, top - 20), (hx - 15, top - 20)], (0.45, 0.47, 0.52), None)
    g = cairo.LinearGradient(250, 0, 850, 0)
    g.add_color_stop_rgba(0, *CYAN, 0); g.add_color_stop_rgba(.5, *CYAN, .95); g.add_color_stop_rgba(1, *CYAN, 0)
    ctx.set_source(g); ctx.set_line_width(3); ctx.move_to(250, top); ctx.line_to(850, top); ctx.stroke()
    text(ctx, f'LAYER {int(p * 412):03d}', 940, top - 40, F_LAB, 24, 1, (64, 230, 255), 0.16, align='r')
    headline(ctx, lf, '06 — ISPIRAZIONE', ['FILOSOFIA', 'PANIGALE V4 R.'], size=110, col2=(255, 110, 60))
    text(ctx, 'Stesso principio, geometria nostra.', 100, 1440 - 1440 + 1460, F_BOLD, 36, ramp(lf, 24, 34))


def s_build(ctx, lf):
    draw_side(ctx, 560, 1460, 0.82)
    words = ['PROGETTATA.', 'STAMPATA.', 'MONTATA.']
    for i, w_ in enumerate(words):
        col = (255, 255, 255) if i < 2 else (64, 230, 255)
        text(ctx, w_, 64, 236 + i * 118, F_HEAD, 116, ramp(lf, 7.5 * i, 8 + 7.5 * i), col)
    for i, (x, y) in enumerate([(230, 1090), (310, 1110)]):
        p = ramp(lf, 20 + 8 * i, 30 + 8 * i)
        if p > 0:
            ring(ctx, x, y, 14 + 20 * (1 - eo(p)), HOT, eo(p), 3)
            rgba(ctx, HOT, eo(p)); ctx.arc(x, y, 5, 0, 2 * math.pi); ctx.fill()
    text(ctx, 'Prossimo step: dati in pista.', 100, 1360, F_BOLD, 40, ramp(lf, 34, 46))


def s_pass(ctx, lf):
    x = 1500 - 2200 * eio(ramp(lf, 0, 26))
    for k in range(12):
        y = 900 + k * 50
        ctx.set_source_rgba(1, 1, 1, 0.07); ctx.set_line_width(2)
        ctx.move_to(0, y); ctx.line_to(W, y); ctx.stroke()
    draw_side(ctx, x, 1400, 0.75)
    e = ramp(lf, 22, 32)
    if e > 0:
        ctx.set_source_rgba(0.01, 0.015, 0.025, 0.92 * eo(e)); ctx.rectangle(0, 0, W, H); ctx.fill()
        text(ctx, 'AERO / PROJECT', W / 2, 890, F_HEAD, 92, ramp(lf, 24, 34), (255, 255, 255), 0.04, align='c')
        p = eo(ramp(lf, 26, 38))
        rgba(ctx, CYAN, 1); ctx.rectangle(W / 2 - 220 * p, 1010, 440 * p, 5); ctx.fill()
        text(ctx, 'AERODINAMICA IN PIEGA', W / 2, 1040, F_LAB, 28, ramp(lf, 30, 40), (64, 230, 255), 0.3, align='c')


SCENES = {'hook': s_hook, 'macro': s_macro, 'flow': s_flow, 'tufts': s_tufts, 'lean': s_lean,
          'gopro': s_gopro, 'print': s_print, 'build': s_build, 'pass': s_pass}
IDX = {'hook': 0, 'macro': 1, 'flow': 2, 'tufts': 3, 'lean': 4, 'gopro': 5, 'print': 6, 'build': 6, 'pass': 6}


def frame(f):
    for name, a, b in SC:
        if a <= f < b:
            break
    lf = f - a
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    g = cairo.RadialGradient(540, 900, 100, 540, 900, 1300)
    g.add_color_stop_rgb(0, 0.07, 0.08, 0.12); g.add_color_stop_rgb(1, *BG)
    ctx.set_source(g); ctx.paint()
    if name not in ('print', 'gopro'):
        grid_bg(ctx, lf, 0.035)
    k = 1 + 0.08 * (1 - eo(lf / 9.0)) if f > 0 else 1
    ctx.save(); ctx.translate(540, 960); ctx.scale(k, k); ctx.translate(-540, -960)
    SCENES[name](ctx, lf)
    ctx.restore()
    if name != 'pass' or lf < 22:
        shot_tag(ctx, name, lf)
    i = IDX[name]
    text(ctx, 'AERO / PROJECT', 70, 132, F_BOLD, 26, ramp(f, 2, 14), (64, 230, 255), 0.42)
    text(ctx, 'ANIMATIC 2D', 1010, 132, F_BOLD, 22, 1, (255, 120, 70), 0.2, alpha=0.9, align='r')
    ctx.set_line_width(3); ctx.set_source_rgba(1, 1, 1, 0.16); ctx.move_to(70, 186); ctx.line_to(1010, 186); ctx.stroke()
    rgba(ctx, CYAN, 1); ctx.move_to(70, 186); ctx.line_to(70 + 940 * f / (N - 1), 186); ctx.stroke()
    fl = 0.35 * (1 - lf / 4.0) if (lf < 4 and f > 0) else 0
    if f < 5:
        fl = 0.9 * (1 - f / 5.0)
    if fl > 0:
        ctx.set_source_rgba(1, 1, 1, fl); ctx.paint()
    if f >= N - 6:
        ctx.set_source_rgba(0, 0, 0, 1 - (N - 1 - f) / 6.0); ctx.paint()
    surf.flush()
    a = np.ndarray((H, W, 4), np.uint8, surf.get_data())
    return np.ascontiguousarray(a[..., :3]).tobytes()


if __name__ == '__main__':
    out = sys.argv[1]
    if len(sys.argv) > 2:
        import cv2
        for f in map(int, sys.argv[2].split(',')):
            cv2.imwrite(os.path.join(out, f'a2d_{f:03d}.png'), np.frombuffer(frame(f), np.uint8).reshape(H, W, 3))
        sys.exit()
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS),
                          '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    from multiprocessing import Pool
    with Pool(4) as pool:
        for buf in pool.imap(frame, range(N), chunksize=6):
            p.stdin.write(buf)
    p.stdin.close(); p.wait()
