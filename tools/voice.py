# Italian voice-over with the OpenAI speech API, mixed over the music bed.
# Usage: python3 tools/voice.py lines.json music.wav out.wav
#   lines.json: [{"t": 0.3, "text": "Come fa ChatGPT a risponderti?"}, ...]  (t = start second)
# Needs OPENAI_API_KEY in the environment. Prints each clip's duration so scene timings can be checked.
import json, os, subprocess, sys, tempfile, urllib.request

lines_path, music, out = sys.argv[1:4]
key = os.environ.get('OPENAI_API_KEY')
if not key:
    sys.exit('OPENAI_API_KEY non impostata: niente voce, usa solo la musica')
model = os.environ.get('TTS_MODEL', 'gpt-4o-mini-tts')
voice = os.environ.get('TTS_VOICE', 'nova')
lines = json.load(open(lines_path))
tmp = tempfile.mkdtemp()
clips = []
for i, l in enumerate(lines):
    body = json.dumps({'model': model, 'voice': voice, 'input': l['text'], 'response_format': 'wav',
                       'instructions': 'Parla in italiano, tono energico e chiaro da divulgatore social, ritmo sostenuto.'}).encode()
    req = urllib.request.Request('https://api.openai.com/v1/audio/speech', data=body,
                                 headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'})
    path = f'{tmp}/v{i}.wav'
    with urllib.request.urlopen(req) as r, open(path, 'wb') as f:
        f.write(r.read())
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).decode())
    print(f"{l['t']:6.2f}s  +{dur:4.2f}s  {l['text']}")
    clips.append((path, l['t']))
# music ducked under the voice, voice clips delayed to their start times
args = ['ffmpeg', '-y', '-loglevel', 'error', '-i', music]
for p, _ in clips:
    args += ['-i', p]
fc = ''.join(f'[{i + 1}:a]aresample=44100,adelay={int(t * 1000)}|{int(t * 1000)}[v{i}];' for i, (_, t) in enumerate(clips))
fc += ''.join(f'[v{i}]' for i in range(len(clips))) + f'amix=inputs={len(clips)}:normalize=0[vo];'
fc += '[0:a]volume=0.35[bed];[bed][vo]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]'
subprocess.check_call(args + ['-filter_complex', fc, '-map', '[out]', '-ar', '44100', out])
