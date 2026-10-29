#!/usr/bin/env python3
"""Monta il reel moto (7 scene) in locale con ffmpeg, senza caricare i video da nessuna parte.

  python tools/moto_reel.py CARTELLA_VIDEO [--out reel_moto.mp4] [--music brano.mp3] [--starts 0,2.5,,,,,]

La cartella deve contenere 7 clip; l'ordine è quello alfabetico dei nomi, quindi rinominale così:
  1_frontale.mp4  2_ala_luce.mp4  3_laterale.mp4  4_scarichi_gomma.mp4
  5_sidepod_luce.mp4  6_ala_fumo.mp4  7_chiusura_frontale.mp4

- Formato verticale 1080x1920 a 30 fps (crop centrale), grade scuro e contrastato, vignettatura.
- Rallenty vero sulle scene 1, 3, 7 se la clip è girata a 50/60/120 fps; con clip a 24/30 fps
  le scene restano a velocità normale (o usa --slow 0.5 per un rallenty interpolato, più lento da calcolare).
- Tagli netti, dissolvenza solo tra la scena 3 e la 4, fade in all'inizio e fade out sul finale.
- Di ogni clip prende la parte centrale; --starts sceglie il secondo di partenza per scena (vuoto = centro).
- Musica: --music usa un tuo brano; altrimenti, se c'è numpy, genera una traccia cinematic con tools/music.py
  (colpi sui cambi scena); altrimenti esce muto.
Serve solo ffmpeg nel PATH (https://ffmpeg.org/download.html).
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile

W, H, FPS = 1080, 1920, 30
# durata finale di ogni scena (s) e se va al rallentatore
SCENES = [(3.0, True), (2.5, False), (3.2, True), (2.6, False), (2.5, False), (2.7, False), (3.5, True)]
XFADE = 0.7  # dissolvenza tra scena 3 e 4
GRADE = ('eq=contrast=1.12:brightness=-0.03:saturation=0.92:gamma=0.95,'
         'colorbalance=bs=0.04:bm=0.02:rh=0.03,vignette=PI/5,unsharp=5:5:0.4')
EXTS = ('.mp4', '.mov', '.m4v', '.mkv', '.avi', '.mts')


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit('ffmpeg ha dato errore:\n' + r.stderr[-2000:])
    return r.stdout


def probe(path):
    out = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=r_frame_rate:format=duration', '-of', 'json', path]))
    num, den = out['streams'][0]['r_frame_rate'].split('/')
    return float(out['format']['duration']), float(num) / float(den or 1)


def natural(name):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r'(\d+)', name)]


def scene(src, dst, dur, slowmo, start, slow, fade_in, fade_out):
    length, fps = probe(src)
    # rallenty vero: una clip a 60 fps riprodotta a 30 dura il doppio
    factor = fps / FPS if slowmo and fps >= 47 else (1 / slow if slowmo and slow < 1 else 1.0)
    need = dur / factor
    if need > length:
        need, factor = length, dur / length  # clip troppo corta: la rallenta quanto basta
    if start is None:
        start = max(0.0, (length - need) / 2)
    start = min(start, max(0.0, length - need))
    vf = [f'setpts=(PTS-STARTPTS)*{factor:.4f}']
    if factor > 1 and fps < 47:
        vf.append(f'minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:vsbmc=1')
    vf += [f'fps={FPS}', f'scale={W}:{H}:force_original_aspect_ratio=increase', f'crop={W}:{H}',
           'setsar=1', GRADE]
    if fade_in:
        vf.append('fade=t=in:st=0:d=0.6')
    if fade_out:
        vf.append(f'fade=t=out:st={dur - 1.2:.2f}:d=1.2')
    vf.append('format=yuv420p')
    run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{start:.3f}', '-t', f'{need + 0.1:.3f}', '-i', src, '-an',
         '-vf', ','.join(vf), '-t', f'{dur:.3f}', '-r', str(FPS), '-c:v', 'libx264', '-preset', 'medium',
         '-crf', '16', dst])


def main():
    ap = argparse.ArgumentParser(description='Monta il reel moto da 7 clip')
    ap.add_argument('folder')
    ap.add_argument('--out', default='reel_moto.mp4')
    ap.add_argument('--music', help='brano audio da usare (mp3/wav/m4a)')
    ap.add_argument('--starts', default='', help='secondo di partenza per scena, es. 1.5,,4,,,,0')
    ap.add_argument('--slow', type=float, default=1.0, help='rallenty interpolato per clip a 24/30 fps, es. 0.5')
    a = ap.parse_args()
    if not shutil.which('ffmpeg') or not shutil.which('ffprobe'):
        sys.exit('ffmpeg non trovato: installalo e riapri il terminale.')

    clips = sorted((f for f in os.listdir(a.folder) if f.lower().endswith(EXTS)), key=natural)
    if len(clips) != len(SCENES):
        sys.exit(f'Servono {len(SCENES)} clip nella cartella, ne ho trovate {len(clips)}: {clips}')
    starts = [float(s) if s.strip() else None for s in a.starts.split(',')] if a.starts else []
    starts += [None] * (len(SCENES) - len(starts))

    tmp = tempfile.mkdtemp(prefix='moto_reel_')
    parts = []
    for i, (clip, (dur, slowmo)) in enumerate(zip(clips, SCENES)):
        print(f'Scena {i + 1}/{len(SCENES)}: {clip}')
        dst = os.path.join(tmp, f's{i + 1}.mp4')
        scene(os.path.join(a.folder, clip), dst, dur, slowmo, starts[i], a.slow,
              fade_in=i == 0, fade_out=i == len(SCENES) - 1)
        parts.append(dst)

    # scene 1-3 e 4-7 a tagli netti, poi dissolvenza tra i due blocchi
    first = sum(d for d, _ in SCENES[:3])
    total = sum(d for d, _ in SCENES) - XFADE
    inputs = sum((['-i', p] for p in parts), [])
    fc = ('[0:v][1:v][2:v]concat=n=3:v=1[a];[3:v][4:v][5:v][6:v]concat=n=4:v=1[b];'
          f'[a][b]xfade=transition=fade:duration={XFADE}:offset={first - XFADE:.2f}[v]')
    video = os.path.join(tmp, 'video.mp4')
    run(['ffmpeg', '-y', '-v', 'error', *inputs, '-filter_complex', fc, '-map', '[v]', '-r', str(FPS),
         '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', video])

    music = a.music
    if not music:
        here = os.path.dirname(os.path.abspath(__file__))
        cues, t = [], 0.0
        for i, (d, _) in enumerate(SCENES[:-1]):
            t += d - (XFADE if i == 2 else 0)
            cues.append(f'{t:.2f}')
        wav = os.path.join(tmp, 'music.wav')
        r = subprocess.run([sys.executable, os.path.join(here, 'music.py'), wav, f'{total:.2f}',
                            '--style', 'cinematic', '--cues', ','.join(cues)], capture_output=True, text=True)
        music = wav if r.returncode == 0 else None
        if not music:
            print('Musica non generata (manca numpy?): il reel esce muto. Usa --music per un tuo brano.')

    if music:
        run(['ffmpeg', '-y', '-v', 'error', '-i', video, '-i', music, '-map', '0:v', '-map', '1:a',
             '-c:v', 'copy', '-af', f'afade=t=out:st={total - 1.5:.2f}:d=1.5,loudnorm=I=-14:TP=-1.5:LRA=11',
             '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-t', f'{total:.2f}', '-movflags', '+faststart',
             a.out])
    else:
        shutil.copy(video, a.out)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'Fatto: {a.out} ({total:.1f} s, {W}x{H})')


if __name__ == '__main__':
    main()
