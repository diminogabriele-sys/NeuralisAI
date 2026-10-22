# Usage: python3 audio.py out.wav duration bpm cue1,cue2,...  (cues = impact/whoosh times in seconds)
import sys, wave, numpy as np
out, dur, bpm = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
cues = [float(c) for c in sys.argv[4].split(',')] if len(sys.argv) > 4 else []
sr = 44100; n = int(dur * sr); t = np.arange(n) / sr
mix = np.zeros(n); rng = np.random.default_rng(7); beat = 60 / bpm
def add(sig, at):
    i = int(at * sr); j = min(n, i + len(sig))
    if i < n: mix[i:j] += sig[:j - i]
def env(L, a, d):
    x = np.arange(int(L * sr)) / sr
    return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
k = int(.35 * sr); kt = np.arange(k) / sr
kick = np.sin(2 * np.pi * (45 * kt + 90 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9) * .9
hat = rng.standard_normal(int(.05 * sr)); hat = np.diff(hat, prepend=0) * env(.05, .001, .012) * .12
end = dur - 1.2
b = 0.0
while b < end:
    add(kick, b); add(hat, b + beat / 2); b += beat
# sub bass drone that follows a simple progression, ducked by the kick
notes = [55, 55, 49, 41.2]
bass = np.zeros(n)
for i, f in enumerate(notes * 20):
    s, e = i * beat * 4, (i + 1) * beat * 4
    if s >= dur: break
    m = (t >= s) & (t < e); bass[m] = np.sin(2 * np.pi * f * t[m]) * .28 + np.sin(2 * np.pi * f * 2 * t[m]) * .06
duck = 1 - .7 * np.exp(-((t % beat)) * 10)
mix += bass * duck * np.minimum(t / 1.5, 1) * np.clip((dur - t) / 1.0, 0, 1)
# airy pad
pad = sum(np.sin(2 * np.pi * f * t + np.sin(t * .7 + f) * 2) for f in (220, 277.2, 329.6)) * .025
mix += pad * np.minimum(t / 3, 1) * np.clip((dur - t) / 1.5, 0, 1)
# whoosh (filtered noise riser) + impact at each cue
for c in cues:
    L = .45; w = rng.standard_normal(int(L * sr)); w = np.convolve(w, np.ones(8) / 8, 'same')
    w *= np.linspace(0, 1, len(w)) ** 2 * .35; add(w, max(0, c - L))
    add(kick * 1.2 + np.sin(2 * np.pi * 30 * kt) * np.exp(-kt * 4) * .5, c)
# final chime
for f in (523.25, 659.25, 783.99):
    x = np.arange(int(1.4 * sr)) / sr; add(np.sin(2 * np.pi * f * x) * np.exp(-x * 2.5) * .12, end)
mix = np.tanh(mix * 1.1); mix /= np.abs(mix).max() * 1.12
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((mix * 32767).astype(np.int16).tobytes())
