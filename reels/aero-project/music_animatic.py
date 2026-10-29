#!/usr/bin/env python3
"""Animatic version (25 s, new cut grid) of the aggressive 120 BPM phonk/trap track cut to the Aero Project reel.

  python3 reels/aero-project/music_aero.py out.wav

At 120 BPM every scene cut (2.5, 5.5, 8.5, 12.5, 17.5, 20.0 s) lands on a beat.
Built on the primitives of tools/music.py.
"""
import os, sys, wave
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools'))
import music as M

DUR, BPM = 25.0, 120
B = 60 / BPM            # beat = 0.5 s
X = B / 4               # 16th
CUTS = [2.5, 5.0, 8.0, 10.5, 16.0, 18.5, 21.0, 23.5]
LEAN_MAX = 13.0         # 48° reached in the lean scene
WORDS = [21.0, 21.25, 21.5]   # PROGETTATA / STAMPATA / MONTATA
GROOVE_END = 23.5
FINAL = 24.25           # end card

S = M.Song(DUR, BPM, 11, 'trap')
S.key = 4               # E
S.rev_decay = 1.5
S.stem('kick', gain=1.0); S.stem('snare', gain=.8, rev=.18); S.stem('hats', gain=.4, rev=.05)
S.stem('perc', gain=.55, rev=.1); S.stem('bass', gain=.85, duck=.55, lp=2600)
S.stem('chords', gain=.42, rev=.3, duck=.4, lp=5200); S.stem('lead', gain=.42, rev=.25, delay=(B * .75, .3))
S.stem('fx', gain=.9, rev=.35)


def drive(x, d=2.5):
    return np.tanh(d * x) / np.tanh(d)


def add(*sigs):
    n = max(len(x) for x in sigs); out = np.zeros(n)
    for x in sigs:
        out[:len(x)] += x
    return out


def note(semi, octv):
    return S.note(semi, octv)


def full(t):   # sections with the full groove
    return (2.5 <= t < 10.5) or (LEAN_MAX <= t < GROOVE_END)


def half(t):   # lean build-up: half time
    return 10.5 <= t < LEAN_MAX


# ---- intro hit + tension (0 - 2.5 s)
S.put('fx', drive(S.kick('808'), 1.5), 0.0, 1.0)
S.put('fx', S.crash(), 0.0, .7)
S.put('fx', S.osc('braam', note(0, 2), 2.2), 0.0, .8)
S.put('bass', S.osc('sub', note(0, 1), 2.4), 0.0, .7)
for i in range(16):                       # accelerating hats
    S.put('hats', S.hat(), 0.5 + i * X, .2 + .5 * i / 16)
for i in range(8):                        # snare roll into the drop
    S.put('snare', S.snare(), 1.5 + i * X, .25 + .6 * i / 8)
for i in range(8):
    S.put('snare', S.snare(), 2.0 + i * X / 2, .4 + .6 * i / 8)
S.riser(2.5, 2.0, .45)

# ---- groove
KICK16 = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0]   # per bar (16ths)
BASS16 = [0, 0, 12, 0, 0, 1, 0, 0, 0, 0, 3, 0, 1, 0, -2, 0]  # semis (phrygian riff)
LEAD8 = [0, 0, 1, 0, 3, 1, 0, -2]
bar0 = 0.5            # bars start at 2.5, 4.5, ... (2.5 = 0.5 + 1 bar)
t = bar0
while t < GROOVE_END:
    for i in range(16):
        ti = t + i * X
        if ti >= GROOVE_END or ti < 2.5:
            continue
        if full(ti):
            if KICK16[i]:
                S.put('kick', drive(S.kick('808'), 1.8), ti, .95); S.kicks.append(ti)
            if i in (4, 12):
                S.put('snare', S.snare(), ti, .9); S.put('snare', S.clap(), ti, .6)
            hv = .5 if i % 2 == 0 else .3
            S.put('hats', S.hat(), ti, hv, .25)
            if i in (14, 15) and int((t - bar0) / (4 * B)) % 2 == 1:   # hat roll every 2nd bar
                for k in range(3):
                    S.put('hats', S.hat(), ti + k * X / 3, .35, -.2)
            if i % 2 == 0 and BASS16[i] != 0 or i == 0:
                m = note(BASS16[i], 1)
                L = X * 1.8
                S.put('bass', drive(add(S.osc('reese', m, L), S.osc('sub', m, L)), 3.0), ti, .55)
            if i == 6 or i == 13:
                S.put('perc', add(S.osc('square', note(7, 6), .06, w=.3), S.osc('square', note(8, 6), .06, w=.3)), ti, .45)  # phonk cowbell
        elif half(ti):
            if i == 0:
                S.put('kick', drive(S.kick('808'), 1.8), ti, 1.0); S.kicks.append(ti)
            if i == 8:
                S.put('snare', S.snare(), ti, .9); S.put('snare', S.clap(), ti, .6)
            if i % 4 == 0:
                S.put('hats', S.hat(open_=True), ti, .25)
    t += 4 * B

# lean scene: long 808 dive following the rotation, then riser into the 48° impact
S.put('bass', S.osc('808', note(0, 1), 2.4, **{'from': note(12, 1)}), 10.5, .9)
S.put('fx', S.osc('braam', note(1, 2), 2.0), 10.5, .5)
for i in range(16):
    S.put('snare', S.snare(), 12.0 + i * X / 2, .3 + .6 * i / 16)
S.riser(LEAN_MAX, 2.2, .5)

# lead stab riff: 2.5-12.5 an octave lower, after 48° an octave higher
for sec_start, sec_end, octv, g in ((4.5, 10.5, 4, .55), (LEAN_MAX, GROOVE_END, 5, .6)):
    tt = sec_start
    while tt < sec_end:
        for i, sm in enumerate(LEAD8):
            ti = tt + i * 2 * X
            if ti < sec_end:
                for m in (note(sm, octv), note(sm + 7, octv)):
                    S.put('lead', drive(S.osc('stab', m, X * 1.5), 2.0), ti, g)
        tt += 4 * B

# dark chord bed (E minor -> F) for weight
for tc in np.arange(2.5, GROOVE_END, 4 * B):
    root = 0 if int((tc - 2.5) / (4 * B)) % 2 == 0 else 1
    for semi in (root, root + 3, root + 7):
        S.put('chords', S.osc('pad', note(semi, 3), 4 * B * .95, a=.05), tc, .5)

# impacts on every cut and on the lean peak
for c in CUTS + [LEAN_MAX]:
    S.put('fx', drive(S.kick('boom'), 2.0), c, .9)
    S.put('fx', S.crash(), c, .55)
for c in CUTS[1:]:
    S.riser(c, .9, .3)
# word stabs
for w_ in WORDS:
    for m in (note(0, 3), note(7, 3), note(12, 4)):
        S.put('fx', drive(S.osc('stab', m, .2), 2.5), w_, .6)
    S.put('fx', S.snare(), w_, .7)
# final button
S.put('fx', drive(S.kick('808'), 1.6), FINAL, 1.0)
S.put('fx', S.osc('braam', note(0, 2), .8), FINAL, .9)
S.put('fx', S.crash(), FINAL, .7)
S.put('fx', S.taiko(), FINAL, .8)

y = S.render()
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(M.SR)
    w.writeframes((np.clip(y.T, -1, 1) * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1])
