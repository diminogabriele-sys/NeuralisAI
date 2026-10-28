#!/usr/bin/env python3
"""Synthesized background music in many styles, so the reels don't all sound the same.

  python3 tools/music.py out.wav DURATION --style funk [--bpm 112] [--cues 3.6,8.0] [--seed 7]
  python3 tools/music.py out.wav DURATION --style auto --log library/music-log.json [--cues ...]

Styles: house, trap, lofi, synthwave, dnb, chiptune, cinematic, funk, ambient, afro
--style auto picks a style not used in the last entries of the log (and records the choice).
Every run picks its own key, chord progression, melody and drum variations from the seed.
Cues (seconds) get a riser + impact in the style of the track; the track ends with a final hit.
Only numpy is needed. Mix the result with the video and loudnorm (see DAILY.md).
"""
import argparse, datetime, json, os, wave
import numpy as np

SR = 44100
STYLES = ['house', 'trap', 'lofi', 'synthwave', 'dnb', 'chiptune', 'cinematic', 'funk', 'ambient', 'afro']
BPM = {'house': (122, 126), 'trap': (136, 144), 'lofi': (74, 88), 'synthwave': (96, 108), 'dnb': (170, 176),
       'chiptune': (140, 156), 'cinematic': (84, 96), 'funk': (106, 116), 'ambient': (64, 74), 'afro': (100, 108)}

# chord progressions: semitones relative to the key root
MINOR = [[[0, 3, 7, 10], [8, 12, 15, 19], [3, 7, 10, 14], [10, 14, 17, 21]],
         [[0, 3, 7], [5, 8, 12], [10, 14, 17], [3, 7, 10]],
         [[0, 3, 7, 10], [5, 8, 12, 15], [7, 10, 14, 17], [0, 3, 7, 10]],
         [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 11, 14]]]
MAJOR = [[[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]],
         [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
         [[2, 5, 9, 12], [7, 11, 14, 17], [0, 4, 7, 11], [0, 4, 7, 11]],
         [[5, 9, 12, 16], [7, 11, 14, 17], [4, 7, 11, 14], [9, 12, 16, 19]]]
MOOD = {'house': 'any', 'trap': 'min', 'lofi': 'maj', 'synthwave': 'min', 'dnb': 'min', 'chiptune': 'maj',
        'cinematic': 'min', 'funk': 'min', 'ambient': 'maj', 'afro': 'maj'}
PENTA = {'min': [0, 3, 5, 7, 10], 'maj': [0, 2, 4, 7, 9]}


def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(L): return np.arange(max(1, int(L * SR))) / SR


def filt(x, lp=None, hp=None):
    """Static 2nd-order-ish low/high-pass done in the frequency domain."""
    n = len(x); N = 1 << max(1, (n - 1).bit_length())
    f = np.fft.rfftfreq(N, 1 / SR); g = np.ones_like(f)
    if lp: g *= 1 / np.sqrt(1 + (f / lp) ** 4)
    if hp: g *= 1 / np.sqrt(1 + (hp / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(np.fft.rfft(x, N) * g, N)[:n]


def adsr(L, a=.01, d=.15, s=.6, r=.15):
    x = tt(L + r); e = np.full(len(x), float(s))
    if a > 0: e[x < a] = x[x < a] / a
    m = (x >= a) & (x < a + d); e[m] = 1 - (1 - s) * (x[m] - a) / max(d, 1e-4)
    rel = x >= L; e[rel] = s * np.exp(-(x[rel] - L) / max(r / 4, 1e-4))
    return x, e


def saw(f, x): return 2 * ((f * x) % 1) - 1
def sq(f, x, w=.5): return np.where((f * x) % 1 < w, 1.0, -1.0)
def tri(f, x): return 2 * np.abs(saw(f, x)) - 1


class Song:
    def __init__(self, dur, bpm, seed, style):
        self.dur, self.bpm, self.style = dur, bpm, style
        self.n = int(dur * SR); self.rng = np.random.default_rng(seed); self.beat = 60 / bpm; self.bar = 4 * self.beat
        self.stems, self.cfg, self.kicks = {}, {}, []
        mood = MOOD[style] if MOOD[style] != 'any' else self.rng.choice(['min', 'maj'])
        self.mood = mood; self.key = int(self.rng.integers(0, 12))
        self.prog = (MINOR if mood == 'min' else MAJOR)[int(self.rng.integers(0, 4))]
        self.scale = PENTA[mood]

    # ---- mixing ----
    def stem(self, name, lp=None, hp=None, gain=1.0, rev=0.0, duck=0.0, delay=None):
        if name not in self.stems:
            self.stems[name] = np.zeros((2, self.n)); self.cfg[name] = dict(lp=lp, hp=hp, gain=gain, rev=rev, duck=duck, delay=delay)
        return name

    def put(self, name, sig, at, g=1.0, pan=0.0):
        i = int(at * SR)
        if i >= self.n or i < 0: return
        j = min(self.n, i + len(sig)); s = sig[:j - i] * g; a = (pan + 1) * np.pi / 4
        self.stems[name][0, i:j] += s * np.cos(a); self.stems[name][1, i:j] += s * np.sin(a)

    def chord(self, k): return self.prog[k % len(self.prog)]
    def note(self, semi, octave=4): return 12 * (octave + 1) + self.key + semi
    def voiced(self, k, octave=4):
        out = [self.note(s, octave) for s in self.chord(k)]
        return [m - 12 if m > 12 * (octave + 2) + 4 else m for m in out]

    def play_on(self, t): return t < self.dur - 1.35

    # ---- drums ----
    def kick(self, kind='909'):
        if kind == '808':
            x = tt(1.0); f = 42 + 70 * np.exp(-x * 28); return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 2.6))
        base, sweep, L, dk = {'909': (50, 120, .4, 8), 'soft': (55, 60, .28, 13), 'tight': (56, 150, .25, 15), 'chip': (60, 260, .14, 26),
                              'boom': (45, 80, .6, 5)}[kind]
        x = tt(L); f = base + sweep * np.exp(-x * 38)
        k = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * dk)
        if kind in ('909', 'tight'): k[:200] += self.rng.standard_normal(200) * np.linspace(.35, 0, 200)
        return k

    def snare(self, kind='acoustic'):
        if kind == 'rim':
            x = tt(.05); return np.sin(2 * np.pi * 1700 * x) * np.exp(-x * 90) + filt(self.rng.standard_normal(len(x)), hp=3000) * np.exp(-x * 120) * .5
        L = .45 if kind == 'gated' else .25; x = tt(L)
        nz = filt(self.rng.standard_normal(len(x)), lp=9000, hp=1100)
        e = np.where(x < .3, np.exp(-x * 3), 0) if kind == 'gated' else np.exp(-x * 18)
        s = nz * e * .8 + np.sin(2 * np.pi * 185 * x) * np.exp(-x * 30) * .6
        return filt(s, lp=4200) if kind == 'lofi' else s

    def clap(self):
        x = tt(.35); nz = filt(self.rng.standard_normal(len(x)), hp=900, lp=7500)
        e = sum(np.where(x >= o, np.exp(-(x - o) * 220), 0) for o in (0, .011, .023)) + np.where(x >= .03, np.exp(-(x - .03) * 14), 0) * .7
        return nz * e

    def hat(self, open_=False, chip=False):
        L = .25 if open_ else .05; x = tt(L)
        nz = sq(5300, x) * sq(7700, x) * .5 + self.rng.standard_normal(len(x)) if not chip else self.rng.standard_normal(len(x))
        return filt(nz, hp=3500 if chip else 7000) * np.exp(-x * (11 if open_ else 75)) * .5

    def crash(self):
        x = tt(2.2); return filt(self.rng.standard_normal(len(x)), hp=4500) * np.exp(-x * 2.2) * .5

    def shaker(self):
        x = tt(.09); return filt(self.rng.standard_normal(len(x)), hp=5000, lp=11000) * np.minimum(x / .015, 1) * np.exp(-x * 45) * .5

    def conga(self, f):
        x = tt(.35); return np.sin(2 * np.pi * np.cumsum(f * (1 + .35 * np.exp(-x * 45))) / SR) * np.exp(-x * 11)

    def taiko(self):
        x = tt(1.2); b = np.sin(2 * np.pi * np.cumsum(60 * (1 + .5 * np.exp(-x * 18))) / SR) * np.exp(-x * 4)
        return np.tanh(1.5 * (b + filt(self.rng.standard_normal(len(x)), lp=400) * np.exp(-x * 9) * .6))

    # ---- tonal ----
    def osc(self, kind, m, L, **o):
        f = mtof(m)
        if kind == 'pad':
            x, e = adsr(L, a=o.get('a', .5), d=.5, s=.8, r=o.get('r', .8))
            return (saw(f * .996, x) + saw(f * 1.004, x) + .5 * saw(f * 2.001, x)) * e * .25
        if kind == 'strings':
            x, e = adsr(L, a=.6, d=.3, s=.9, r=1.0); v = 1 + .004 * np.sin(2 * np.pi * 5.5 * x)
            return (saw(f * v * .997, x) + saw(f * v * 1.003, x)) * e * .25
        if kind == 'rhodes':
            x = tt(L + .8); e = np.minimum(x / .004, 1) * np.exp(-x * 1.4)
            return (np.sin(2 * np.pi * f * x + 1.1 * np.exp(-x * 7) * np.sin(2 * np.pi * f * 7 * x)) + .25 * np.sin(4 * np.pi * f * x)) * e * .45
        if kind == 'piano':
            x = tt(L + 1.6); s = sum(np.sin(2 * np.pi * f * k * np.sqrt(1 + .0004 * k * k) * x) * np.exp(-x * (.9 + k * .7)) / k ** 1.25 for k in range(1, 9))
            return s * np.minimum(x / .003, 1) * .45
        if kind == 'bell':
            x = tt(L + 2.0); return np.sin(2 * np.pi * f * x + 2.2 * np.exp(-x * 3) * np.sin(2 * np.pi * 3.5 * f * x)) * np.exp(-x * 2.0) * .35
        if kind == 'marimba':
            x = tt(L + .6); return (np.sin(2 * np.pi * f * x) * np.exp(-x * 6) + .35 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x * 22)) * np.minimum(x / .002, 1) * .5
        if kind == 'pluck':  # Karplus-Strong
            P = max(2, int(SR / f)); buf = self.rng.uniform(-1, 1, P); out = []; dec = o.get('dec', .994)
            for _ in range(int((L + .5) * SR / P) + 1):
                out.append(buf); buf = dec * .5 * (buf + np.roll(buf, 1))
            return np.concatenate(out) * .5
        if kind == 'organ':
            x, e = adsr(L, a=.01, d=.05, s=.9, r=.08)
            return sum(a * np.sin(2 * np.pi * f * h * x) for h, a in ((1, 1), (2, .6), (3, .4), (4, .25))) * e * .22
        if kind == 'stab':
            x, e = adsr(L, a=.003, d=.12, s=.25, r=.1); return (saw(f * .995, x) + saw(f * 1.005, x)) * e * .3
        if kind == 'clav':
            x, e = adsr(L, a=.002, d=.07, s=.1, r=.04); return sq(f, x, .25) * e * .3
        if kind == 'square':
            x, e = adsr(L, a=.003, d=.08, s=.6, r=.05); return sq(f, x, o.get('w', .5)) * e * .2
        if kind == 'lead':
            x, e = adsr(L, a=.02, d=.2, s=.7, r=.2); v = 1 + .006 * np.sin(2 * np.pi * 6 * x) * np.minimum(x / .3, 1)
            return (saw(f * v, x) * .6 + sq(f * v * .5, x) * .3) * e * .25
        if kind == 'sub':
            x, e = adsr(L, a=.005, d=.1, s=.85, r=.06); return (np.sin(2 * np.pi * f * x) + .25 * np.sin(4 * np.pi * f * x)) * e * .7
        if kind == 'bass':
            x, e = adsr(L, a=.003, d=.15, s=.5, r=.05); return (saw(f, x) * .7 + np.sin(2 * np.pi * f * x) * .6) * e * .55
        if kind == 'slap':
            x, e = adsr(L, a=.002, d=.18, s=.35, r=.05); b = np.exp(-x * 30)
            return (saw(f, x) * (.3 + .7 * b) + np.sin(2 * np.pi * f * x)) * e * .5
        if kind == 'reese':
            x, e = adsr(L, a=.02, d=.2, s=.9, r=.1); return (saw(f * .99, x) + saw(f * 1.01, x)) * e * .4
        if kind == '808':
            x = tt(L + .1); f0 = mtof(o.get('from', m)); fr = f + (f0 - f) * np.exp(-x * 30)
            e = np.minimum(x / .003, 1) * np.where(x < L, 1, np.exp(-(x - L) * 40)) * np.exp(-x * .6)
            return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(fr) / SR)) * e * .7
        if kind == 'tri':
            x, e = adsr(L, a=.002, d=.05, s=.9, r=.03); return tri(f, x) * e * .45
        if kind == 'braam':
            x, e = adsr(L, a=.08, d=.6, s=.6, r=.9); return np.tanh(2 * (saw(f, x) + saw(f * 1.006, x) + saw(f / 2, x))) * e * .4
        raise ValueError(kind)

    def melody(self, bars, octave=5, density=.45, kind='lead', stem='lead', start_bar=0, step=.5, g=1.0, pan=0.0):
        """A 2-bar motif repeated with small variations, on the pentatonic scale."""
        slots = int(2 * self.bar / (self.beat * step))
        motif, deg = [], int(self.rng.integers(0, 5))
        for i in range(slots):
            if self.rng.random() < density or i == 0:
                deg = int(np.clip(deg + self.rng.choice([-2, -1, -1, 1, 1, 2, 0]), 0, 9)); motif.append((i, deg))
        for b in range(start_bar, bars, 2):
            for (i, d) in motif:
                t = b * self.bar + i * self.beat * step
                if not self.play_on(t): continue
                if b % 4 == 2 and i == motif[-1][0]: d = max(0, d - 2)
                m = self.note(self.scale[d % 5] + 12 * (d // 5), octave)
                self.put(stem, self.osc(kind, m, self.beat * step * 1.6), t, g, pan)

    # ---- cues and ending ----
    def riser(self, at, L=1.2, g=.35):
        if at - L < 0: L = max(.2, at)
        x = tt(L); nz = self.rng.standard_normal(len(x)); parts = []
        for k in range(4):
            a, b = k * len(x) // 4, (k + 1) * len(x) // 4; parts.append(filt(nz[a:b], hp=500 + 2500 * k, lp=3000 + 3000 * k))
        self.put('fx', np.concatenate(parts) * (x / L) ** 2 * g, at - L)

    def impact(self, at):
        s = self.style
        if s in ('cinematic',): self.put('fx', self.taiko(), at, 1.0); self.put('fx', self.osc('braam', self.note(self.chord(0)[0], 2), 1.5), at, .9)
        elif s in ('trap',): self.put('fx', self.kick('808'), at, .9); self.put('fx', self.crash(), at, .6)
        elif s == 'chiptune':
            for i, d in enumerate([0, 4, 7, 12, 16, 19]): self.put('fx', self.osc('square', self.note(d, 5), .05, w=.25), at + i * .03, .8)
        elif s == 'lofi': self.put('fx', self.osc('bell', self.note(self.chord(0)[-1], 6), .5), at, .5); self.put('fx', self.snare('rim'), at, .6)
        elif s == 'ambient': self.put('fx', self.osc('bell', self.note(self.scale[2], 6), .6), at, .6)
        elif s == 'funk': [self.put('fx', self.osc('stab', m, .18), at, .55) for m in self.voiced(0, 4)]; self.put('fx', self.crash(), at, .5)
        elif s == 'afro': [self.put('fx', self.conga(f), at + i * .06, .7) for i, f in enumerate((330, 260, 200, 165))]
        else: self.put('fx', self.kick('boom'), at, .9); self.put('fx', self.crash(), at, .6)
        if s not in ('ambient', 'lofi'): self.riser(at)

    def ending(self):
        at = self.dur - 1.3
        for m in self.voiced(0, 4): self.put('fx', self.osc('piano' if self.style in ('lofi', 'ambient', 'cinematic') else 'stab', m, 1.0), at, .5)
        self.put('fx', self.osc('sub', self.note(self.chord(0)[0], 2), 1.0), at, .8)
        if self.style not in ('ambient', 'lofi'): self.put('fx', self.crash(), at, .5)

    # ---- render ----
    def render(self):
        t = np.arange(self.n) / SR; duck = np.ones(self.n)
        for k in self.kicks:
            i = int(k * SR); L = min(self.n - i, int(.25 * SR))
            if L > 0: duck[i:i + L] = np.minimum(duck[i:i + L], 1 - np.exp(-np.arange(L) / SR / .09))
        duck = np.clip(duck, 0, 1)
        dry = np.zeros((2, self.n)); send = np.zeros((2, self.n))
        for name, st in self.stems.items():
            c = self.cfg[name]
            if c['lp'] or c['hp']: st = np.array([filt(st[0], c['lp'], c['hp']), filt(st[1], c['lp'], c['hp'])])
            if c['delay']:
                dt, fb = c['delay']; d = int(dt * SR); out = st.copy()
                for k in range(1, 5):
                    out[(k % 2), k * d:] += st[(k % 2), :-k * d] * fb ** k if k * d < self.n else 0
                st = out
            if c['duck']: st = st * (1 - c['duck'] * (1 - duck))
            dry += st * c['gain']; send += st * c['gain'] * c['rev']
        rv = self.rev_decay; L = int(rv * 1.4 * SR); x = np.arange(L) / SR; rng = np.random.default_rng(99)
        for ch in (0, 1):
            ir = filt(rng.standard_normal(L) * np.exp(-x * 6.9 / rv), lp=7000, hp=180); ir /= np.sqrt((ir ** 2).sum())
            N = 1 << (self.n + L).bit_length()
            dry[ch] += np.fft.irfft(np.fft.rfft(send[ch], N) * np.fft.rfft(ir, N), N)[:self.n] * .55
        if self.style == 'lofi':  # dusty: low-pass + crackle
            dry = np.array([filt(dry[0], lp=5200), filt(dry[1], lp=5200)])
            cr = np.zeros(self.n); idx = self.rng.integers(0, self.n, int(self.dur * 9)); cr[idx] = self.rng.uniform(-.25, .25, len(idx))
            dry += filt(cr, hp=1500) + filt(self.rng.standard_normal(self.n) * .004, lp=3000)
        if self.style != 'chiptune': dry = np.array([filt(dry[0], lp=11500), filt(dry[1], lp=11500)])  # tame hiss
        fade = np.minimum(t / .05, 1) * np.clip((self.dur - t) / .5, 0, 1)
        dry = np.tanh(dry * 1.2) * fade
        return dry / (np.abs(dry).max() * 1.12 + 1e-9)


# ---------------- styles ----------------
def build(S, cues):
    s, B, bar = S.style, S.beat, S.bar
    nb = int(S.dur / bar) + 1; intro = bar * (1 if S.dur < 20 else 2)
    S.rev_decay = {'ambient': 4.5, 'cinematic': 3.5, 'synthwave': 2.6, 'lofi': 1.6}.get(s, 1.8)
    rng = S.rng
    S.stem('kick', gain=1.0); S.stem('snare', gain=.75, rev=.15); S.stem('hats', gain=.45, rev=.05)
    S.stem('perc', gain=.6, rev=.12); S.stem('bass', gain=.8, duck=.5); S.stem('chords', gain=.55, rev=.35, duck=.45)
    S.stem('lead', gain=.5, rev=.3, delay=(B * .75, .35)); S.stem('fx', gain=.9, rev=.4)

    def kicks(times, kind='909', g=1.0):
        for t in times:
            if intro <= t and S.play_on(t): S.put('kick', S.kick(kind), t, g); S.kicks.append(t)

    def hits(stem, sig_fn, times, g=1.0, pan=0.0, after=None):
        for t in times:
            if (after is None or t >= after) and S.play_on(t): S.put(stem, sig_fn(), t, g, pan)

    def pad_chords(kind, octave=4, g=1.0, every=1, length=None):
        for b in range(0, nb, every):
            t = b * bar
            if not S.play_on(t): continue
            for m in S.voiced(b // every if every > 1 else b, octave): S.put('chords', S.osc(kind, m, length or bar * every * .95), t, g, rng.uniform(-.4, .4))

    if s == 'house':
        S.cfg['chords']['lp'] = 3500
        kicks([b * B for b in range(nb * 4)])
        hits('snare', S.clap, [b * bar + k * B for b in range(nb) for k in (1, 3)], .8, after=intro)
        hits('hats', lambda: S.hat(True), [b * B + B / 2 for b in range(nb * 4)], .6)
        hits('hats', S.hat, [b * B / 4 for b in range(nb * 16) if b % 4 in (1, 3)], .35, .3, after=intro)
        rhythm = [[0, .75, 1.5, 2.5, 3.25], [0, 1.5, 2, 3.5], [.5, 1.5, 2.75, 3.5]][int(rng.integers(0, 3))]
        inst = str(rng.choice(['piano', 'organ', 'stab']))
        for b in range(nb):
            for r in rhythm:
                t = b * bar + r * B
                if S.play_on(t): [S.put('chords', S.osc(inst, m, B * .4), t, .8) for m in S.voiced(b, 4)]
            for k in range(4):
                t = b * bar + k * B + B / 2
                if t >= intro and S.play_on(t): S.put('bass', S.osc('bass', S.note(S.chord(b)[0], 2), B * .4), t, .9)
        pad_chords('pad', 4, .35)
        S.cfg['bass']['lp'] = 900
    elif s == 'trap':
        pats = [[0, 1.75, 2.5], [0, .75, 2.25, 3.5], [0, 2.75, 3.25]]
        for b in range(nb):
            p = pats[int(rng.integers(0, 3))]; prev = S.note(S.chord(b)[0], 1)
            for r in p:
                t = b * bar + r * B
                if t >= intro and S.play_on(t):
                    m = S.note(S.chord(b)[0] + (12 if rng.random() < .25 else 0), 1)
                    S.put('bass', S.osc('808', m, B * 1.2, **{'from': prev}), t, 1.0); prev = m; S.kicks.append(t)
                    S.put('kick', S.kick('tight'), t, .7)
            hits('snare', S.clap, [b * bar + 2 * B], .9, after=intro)
            for k in range(8):
                t = b * bar + k * B / 2
                if rng.random() < .3 and k % 2:  # rolls
                    for j in range(3 if rng.random() < .5 else 4): hits('hats', S.hat, [t + j * B / (6 if j < 3 else 8)], .45, rng.uniform(-.3, .3))
                else: hits('hats', S.hat, [t], .5)
        pad_chords('strings', 4, .3); S.melody(nb, 5, .3, 'bell', 'lead', start_bar=2)
    elif s == 'lofi':
        sw = .62
        for b in range(nb):
            kicks([b * bar, b * bar + 2.5 * B] if rng.random() < .7 else [b * bar, b * bar + 1.75 * B, b * bar + 2.5 * B], 'soft', .9)
            hits('snare', lambda: S.snare('lofi'), [b * bar + B, b * bar + 3 * B], .7, after=intro)
            hits('hats', S.hat, [b * bar + k * B + (sw * B if h else 0) for k in range(4) for h in (0, 1)], .35, .2)
        pad_chords('rhodes', 4, .8)
        for b in range(nb):
            t = b * bar
            if S.play_on(t): S.put('bass', S.osc('sub', S.note(S.chord(b)[0], 2), bar * .45), t, .8); S.put('bass', S.osc('sub', S.note(S.chord(b)[0], 2), bar * .3), t + 2.5 * B, .6)
        S.melody(nb, 5, .25, 'piano', 'lead', start_bar=2, step=.5, g=.6)
        S.cfg['lead']['delay'] = None
    elif s == 'synthwave':
        kicks([b * bar + k * B for b in range(nb) for k in (0, 2)])
        hits('snare', lambda: S.snare('gated'), [b * bar + k * B for b in range(nb) for k in (1, 3)], .8, after=intro)
        S.cfg['snare']['rev'] = .5
        hits('hats', S.hat, [b * B / 2 for b in range(nb * 8)], .3, after=intro)
        for b in range(nb):
            ch = S.voiced(b, 4); arp = ch + [m + 12 for m in ch]
            for k in range(16):
                t = b * bar + k * B / 4
                if S.play_on(t): S.put('lead', S.osc('square', arp[k % len(arp)], B / 4 * .9, w=.3), t, .45, .3 if k % 2 else -.3)
                if k % 2 == 0 and S.play_on(t): S.put('bass', S.osc('bass', S.note(S.chord(b)[0], 2 if k % 4 == 0 else 3), B / 2 * .8), t, .7)
        S.cfg['bass']['lp'] = 1200; S.cfg['lead']['lp'] = 3200
        pad_chords('pad', 4, .5); S.melody(nb, 5, .3, 'lead', 'chords', start_bar=4, step=1, g=.5)
    elif s == 'dnb':
        for b in range(nb):
            kicks([b * bar, b * bar + 2.5 * B], 'tight')
            hits('snare', S.snare, [b * bar + B, b * bar + 3 * B], .9, after=intro)
            hits('hats', S.hat, [b * bar + k * B / 2 for k in range(8)], .35, .2)
            if rng.random() < .5: hits('snare', S.snare, [b * bar + 3.75 * B], .4, after=intro)
        for b in range(0, nb, 2):
            t = b * bar
            if S.play_on(t): S.put('bass', S.osc('reese', S.note(S.chord(b // 2)[0], 2), bar * 2 * .95), t, .9)
        S.cfg['bass']['lp'] = 650; pad_chords('strings', 4, .4, every=2)
        S.melody(nb, 5, .2, 'bell', 'lead', start_bar=2, step=1)
    elif s == 'chiptune':
        for b in range(nb):
            kicks([b * bar, b * bar + 2 * B, b * bar + 2.5 * B], 'chip', .8)
            hits('snare', lambda: S.hat(True, chip=True), [b * bar + B, b * bar + 3 * B], .7, after=intro)
            hits('hats', lambda: S.hat(chip=True), [b * bar + k * B / 2 for k in range(8)], .25)
            ch = S.voiced(b, 5)
            for k in range(16):
                t = b * bar + k * B / 4
                if S.play_on(t): S.put('chords', S.osc('square', ch[k % len(ch)], B / 4 * .8, w=.125), t, .35)
                if k % 2 == 0 and S.play_on(t) and t >= intro: S.put('bass', S.osc('tri', S.note(S.chord(b)[0] + (12 if k % 4 else 0), 2), B / 2 * .8), t, .9)
        S.cfg['chords']['rev'] = .1; S.cfg['bass']['duck'] = 0
        S.melody(nb, 5, .55, 'square', 'lead', start_bar=2, step=.5, g=.8)
    elif s == 'cinematic':
        for b in range(nb):
            for r, g in ((0, 1.0), (2.5, .6), (3, .8)):
                t = b * bar + r * B
                if t >= intro and S.play_on(t): S.put('perc', S.taiko(), t, g)
            hits('hats', S.hat, [b * bar + k * B / 2 for k in range(8)], .25)  # ticking
            for k in range(16):
                t = b * bar + k * B / 4
                if S.play_on(t): S.put('bass', S.osc('pluck', S.note(S.chord(b)[0] + (7 if k % 4 == 3 else 0), 2), B / 4, dec=.985), t, .6)
        S.cfg['perc']['rev'] = .45; S.cfg['bass']['duck'] = 0
        pad_chords('strings', 3, .7); S.melody(nb, 5, .2, 'strings', 'lead', start_bar=4, step=1, g=.6)
    elif s == 'funk':
        for b in range(nb):
            kicks([b * bar + r * B for r in ([0, 1.75, 2.5] if b % 2 == 0 else [0, .75, 2.5, 3.25])], 'tight')
            hits('snare', S.snare, [b * bar + B, b * bar + 3 * B], .85, after=intro)
            hits('snare', S.snare, [b * bar + r * B for r in (1.75, 3.5) if rng.random() < .6], .18, after=intro)  # ghost notes
            hits('hats', S.hat, [b * bar + k * B / 4 for k in range(16)], .3, .25)
            root = S.chord(b)[0]
            for r, d in zip((0, .75, 1.5, 2, 2.75, 3.5), (0, 0, 12, 7, 10, 12)):
                t = b * bar + r * B
                if t >= intro and S.play_on(t) and rng.random() < .9: S.put('bass', S.osc('slap', S.note(root + d, 2), B * .35), t, .9)
            for r in (.5, 1.5, 2.25, 3.5):
                t = b * bar + r * B
                if S.play_on(t): [S.put('chords', S.osc('clav', m, B * .2), t, .6, .3) for m in S.voiced(b, 4)]
        pad_chords('organ', 4, .25); S.melody(nb, 5, .35, 'lead', 'lead', start_bar=4, step=.5, g=.6)
        S.cfg['bass']['duck'] = .2
    elif s == 'ambient':
        for b in range(nb):
            ch = S.voiced(b, 4)
            for k in range(8):
                t = b * bar + k * B / 2
                if S.play_on(t) and rng.random() < .6: S.put('lead', S.osc('piano', ch[int(rng.integers(0, len(ch)))] + 12 * int(rng.integers(0, 2)), B), t, .5, rng.uniform(-.6, .6))
            if b >= 2: hits('perc', lambda: S.kick('soft'), [b * bar, b * bar + .28], .35)
        S.cfg['lead']['rev'] = .8; S.cfg['lead']['delay'] = (B * .75, .45)
        pad_chords('pad', 3, .6); S.cfg['chords']['lp'] = 1800; S.cfg['chords']['duck'] = 0
        for b in range(nb):
            if S.play_on(b * bar): S.put('bass', S.osc('sub', S.note(S.chord(b)[0], 1), bar * .9), b * bar, .45)
        S.cfg['bass']['duck'] = 0
    elif s == 'afro':
        for b in range(nb):
            kicks([b * bar + r * B for r in (0, 1.5, 2, 3.5)], 'soft', .9)
            hits('snare', lambda: S.snare('rim'), [b * bar + r * B for r in (.75, 2.25, 3)], .5, after=intro)
            hits('hats', S.shaker, [b * bar + k * B / 4 for k in range(16)], .6, .2)
            for r, f in ((0, 330), (.5, 330), (1.25, 260), (2, 330), (2.75, 200), (3.5, 260)):
                t = b * bar + r * B
                if t >= intro and S.play_on(t): S.put('perc', S.conga(f), t, .45, -.3 if f > 300 else .3)
            for r in (0, .75, 2, 2.75):
                t = b * bar + r * B
                if t >= intro and S.play_on(t): S.put('bass', S.osc('sub', S.note(S.chord(b)[0] + (12 if r == 2.75 else 0), 2), B * .6), t, .9)
            for r in (.5, 1.5, 2.5, 3.25):
                t = b * bar + r * B
                if S.play_on(t): [S.put('chords', S.osc('marimba', m + 12, B * .3), t, .5, .2) for m in S.voiced(b, 4)]
        S.melody(nb, 5, .4, 'marimba', 'lead', start_bar=2, step=.5, g=.8); S.cfg['lead']['delay'] = (B * .5, .3)
    for c in cues:
        if 0 < c < S.dur - .5: S.impact(c)
    S.ending()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out'); ap.add_argument('duration', type=float)
    ap.add_argument('--style', default='auto', choices=STYLES + ['auto'])
    ap.add_argument('--bpm', type=float); ap.add_argument('--cues', default=''); ap.add_argument('--seed', type=int)
    ap.add_argument('--log', help='JSON file with the styles used before (for --style auto)')
    a = ap.parse_args()
    seed = a.seed if a.seed is not None else int(datetime.datetime.now().timestamp()) % 100000
    rng = np.random.default_rng(seed); hist = []
    if a.log and os.path.exists(a.log):
        with open(a.log) as f: hist = json.load(f)
    style = a.style
    if style == 'auto':
        recent = [h['style'] for h in hist[-6:]]; pool = [s for s in STYLES if s not in recent] or STYLES
        style = str(rng.choice(pool))
    bpm = a.bpm or float(rng.integers(*BPM[style]) + 1)
    cues = [float(c) for c in a.cues.split(',') if c.strip()]
    S = Song(a.duration, bpm, seed, style); build(S, cues); mix = S.render()
    pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    info = {'date': datetime.date.today().isoformat(), 'file': os.path.basename(a.out), 'style': style, 'bpm': bpm,
            'key': names[S.key] + (' minore' if S.mood == 'min' else ' maggiore'), 'seed': seed}
    print(json.dumps(info, ensure_ascii=False))
    if a.log:
        hist.append(info)
        with open(a.log, 'w') as f: json.dump(hist, f, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
