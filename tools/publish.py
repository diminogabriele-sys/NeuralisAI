#!/usr/bin/env python3
"""Publish a finished Reel, image or carousel to Instagram.

  python3 tools/publish.py --check [--account SLUG]
  python3 tools/publish.py --type reel     --files out/reel.mp4             --caption-file cap.txt [--dry-run]
  python3 tools/publish.py --type image    --files out/post.jpg             --caption-file cap.txt [--dry-run]
  python3 tools/publish.py --type carousel --files out/s1.jpg out/s2.jpg ... --caption-file cap.txt [--dry-run]

Credentials come from the environment (never from files or chat):
  IG_USER_ID / IG_ACCESS_TOKEN          (own profile)    or  IG_USER_ID_<SLUG> / IG_ACCESS_TOKEN_<SLUG> with --account SLUG
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
Flow: validate → upload to R2 → check public URL → publish → delete from R2 → append to the log.
"""
import argparse, datetime, json, os, re, secrets, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import r2_upload  # noqa: E402
from ig_publish import IG  # noqa: E402

MAX_HASHTAGS, MAX_CAPTION = 5, 2200


def creds(account):
    sfx = f'_{account.upper()}' if account else ''
    uid, tok = os.environ.get('IG_USER_ID' + sfx), os.environ.get('IG_ACCESS_TOKEN' + sfx)
    if not uid or not tok:
        raise RuntimeError(f'Mancano IG_USER_ID{sfx} e/o IG_ACCESS_TOKEN{sfx} nelle variabili d\'ambiente')
    return uid, tok


def validate(kind, files, caption):
    errors = []
    tags = re.findall(r'(?<!\w)#\w+', caption)
    if len(tags) > MAX_HASHTAGS:
        errors.append(f'{len(tags)} hashtag: il massimo è {MAX_HASHTAGS}')
    if len(caption) > MAX_CAPTION:
        errors.append(f'didascalia di {len(caption)} caratteri: il massimo è {MAX_CAPTION}')
    for f in files:
        if not os.path.isfile(f):
            errors.append(f'file non trovato: {f}')
    if kind == 'reel':
        if len(files) != 1 or not files[0].lower().endswith(('.mp4', '.mov')):
            errors.append('un reel richiede un solo file .mp4/.mov')
        elif os.path.isfile(files[0]):
            try:
                out = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                               'stream=width,height:format=duration', '-of', 'json', files[0]])
                info = json.loads(out); w, h = info['streams'][0]['width'], info['streams'][0]['height']; d = float(info['format']['duration'])
                if (w, h) != (1080, 1920):
                    errors.append(f'risoluzione {w}x{h}: attesa 1080x1920')
                if not 3 <= d <= 900:
                    errors.append(f'durata {d:.1f}s fuori dai limiti')
            except Exception as e:
                errors.append(f'ffprobe non riesce a leggere il video: {e}')
    if kind in ('image', 'carousel'):
        bad = [f for f in files if not f.lower().endswith(('.jpg', '.jpeg'))]
        if bad:
            errors.append('le immagini devono essere JPEG: ' + ', '.join(bad))
        if kind == 'image' and len(files) != 1:
            errors.append('un post immagine richiede un solo file')
        if kind == 'carousel' and not 2 <= len(files) <= 10:
            errors.append('un carosello richiede da 2 a 10 immagini')
    return errors


def log_entry(path, entry):
    data = []
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
    data.append(entry)
    with open(path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='verifica token, account, limite di pubblicazione e archivio R2')
    ap.add_argument('--type', choices=['reel', 'image', 'carousel'])
    ap.add_argument('--files', nargs='+', default=[])
    ap.add_argument('--caption-file')
    ap.add_argument('--account', help='suffisso delle variabili del cliente (es. SPOTMEFIT)')
    ap.add_argument('--log', default='publish-log.json')
    ap.add_argument('--dry-run', action='store_true', help='controlla tutto ma non carica e non pubblica')
    a = ap.parse_args()

    if a.check:
        ok = True
        try:
            ig = IG(*creds(a.account)); acc = ig.account(); lim = ig.publishing_limit()
            print(f'✓ Instagram: @{acc.get("username")} ({ig.host}) · post finora: {acc.get("media_count")}')
            print(f'✓ Limite pubblicazioni: {json.dumps(lim.get("data", lim), ensure_ascii=False)}')
        except Exception as e:
            ok = False; print(f'✗ Instagram: {e}')
        try:
            key = f'autopilot/check-{secrets.token_hex(4)}.txt'
            tmp = os.path.join(os.path.dirname(os.path.abspath(a.log)) or '.', '.r2-check.txt')
            with open(tmp, 'w') as f:
                f.write('ok')
            url = r2_upload.upload(tmp, key); pub = r2_upload.public_ok(url); r2_upload.delete(key); os.remove(tmp)
            print(f'{"✓" if pub else "✗"} R2: caricamento ok, URL pubblico {"raggiungibile" if pub else "NON raggiungibile (attiva l accesso pubblico al bucket)"}')
            ok = ok and pub
        except Exception as e:
            ok = False; print(f'✗ R2: {e}')
        sys.exit(0 if ok else 1)

    if not a.type or not a.files or not a.caption_file:
        ap.error('servono --type, --files e --caption-file (oppure --check)')
    with open(a.caption_file) as f:
        caption = f.read().strip()
    errors = validate(a.type, a.files, caption)
    if errors:
        print('✗ Contenuto non valido:\n  - ' + '\n  - '.join(errors)); sys.exit(2)
    print(f'✓ Contenuto valido: {a.type}, {len(a.files)} file, didascalia {len(caption)} caratteri, '
          f'{len(re.findall(r"(?<!\w)#\w+", caption))} hashtag')
    if a.dry_run:
        print('· Dry run: nessun caricamento e nessuna pubblicazione.'); return

    ig = IG(*creds(a.account))
    stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    keys, urls = [], []
    try:
        for f in a.files:
            key = f'autopilot/{stamp}-{secrets.token_hex(4)}{os.path.splitext(f)[1].lower()}'
            url = r2_upload.upload(f, key); keys.append(key)
            if not r2_upload.public_ok(url):
                raise RuntimeError(f'URL pubblico non raggiungibile: {url}')
            urls.append(url)
        print('✓ File caricati su R2, pubblicazione in corso…')
        if a.type == 'reel':
            media_id, link = ig.reel(urls[0], caption)
        elif a.type == 'image':
            media_id, link = ig.image(urls[0], caption)
        else:
            media_id, link = ig.carousel(urls, caption)
        print(f'✓ Pubblicato: {link}')
        log_entry(a.log, {'date': stamp, 'type': a.type, 'files': [os.path.basename(f) for f in a.files], 'media_id': media_id,
                          'permalink': link, 'account': a.account or 'default', 'status': 'published'})
    except Exception as e:
        print(f'✗ Pubblicazione non riuscita: {e}')
        log_entry(a.log, {'date': stamp, 'type': a.type, 'files': [os.path.basename(f) for f in a.files], 'account': a.account or 'default',
                          'status': 'error', 'error': str(e)})
        sys.exit(1)
    finally:
        for k in keys:
            r2_upload.delete(k)


if __name__ == '__main__':
    main()
