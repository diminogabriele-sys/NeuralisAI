# Cloudflare R2 (S3-compatible) upload/delete with AWS Signature V4, standard library only.
# Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL (e.g. https://pub-xxxx.r2.dev)
import datetime, hashlib, hmac, os, urllib.parse, urllib.request

CONTENT_TYPES = {'.mp4': 'video/mp4', '.mov': 'video/quicktime', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}


def _cfg():
    need = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL']
    missing = [k for k in need if not os.environ.get(k)]
    if missing:
        raise RuntimeError('Variabili R2 mancanti: ' + ', '.join(missing))
    return {k: os.environ[k] for k in need}


def _sign(key, msg):
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()


def _request(method, key, body=b'', content_type=None):
    c = _cfg()
    host = f"{c['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com"
    uri = '/' + urllib.parse.quote(c['R2_BUCKET']) + '/' + urllib.parse.quote(key)
    now = datetime.datetime.now(datetime.timezone.utc)
    amzdate, date = now.strftime('%Y%m%dT%H%M%SZ'), now.strftime('%Y%m%d')
    payload_hash = hashlib.sha256(body).hexdigest()
    signed = 'host;x-amz-content-sha256;x-amz-date'
    canonical = '\n'.join([method, uri, '', f'host:{host}\nx-amz-content-sha256:{payload_hash}\nx-amz-date:{amzdate}\n', signed, payload_hash])
    scope = f'{date}/auto/s3/aws4_request'
    to_sign = '\n'.join(['AWS4-HMAC-SHA256', amzdate, scope, hashlib.sha256(canonical.encode()).hexdigest()])
    k = _sign(('AWS4' + c['R2_SECRET_ACCESS_KEY']).encode(), date)
    for part in ('auto', 's3', 'aws4_request'):
        k = _sign(k, part)
    signature = hmac.new(k, to_sign.encode(), hashlib.sha256).hexdigest()
    headers = {
        'x-amz-date': amzdate, 'x-amz-content-sha256': payload_hash,
        'Authorization': f"AWS4-HMAC-SHA256 Credential={c['R2_ACCESS_KEY_ID']}/{scope}, SignedHeaders={signed}, Signature={signature}",
    }
    if content_type:
        headers['Content-Type'] = content_type
    req = urllib.request.Request(f'https://{host}{uri}', data=body if method == 'PUT' else None, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status


def upload(path, key):
    """Upload a local file and return its public URL."""
    ext = os.path.splitext(path)[1].lower()
    with open(path, 'rb') as f:
        _request('PUT', key, f.read(), CONTENT_TYPES.get(ext, 'application/octet-stream'))
    return os.environ['R2_PUBLIC_URL'].rstrip('/') + '/' + urllib.parse.quote(key)


def delete(key):
    try:
        _request('DELETE', key)
        return True
    except Exception:
        return False


def public_ok(url):
    """True if the public URL answers 200 (Instagram must be able to download it)."""
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method='HEAD'), timeout=30) as r:
            return r.status == 200
    except Exception:
        return False
