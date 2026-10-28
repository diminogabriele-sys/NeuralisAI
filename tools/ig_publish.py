# Instagram content publishing (official API), standard library only.
# Works with both flavours of the API:
#   - Instagram API with Instagram Login  → host graph.instagram.com (tokens usually start with "IG")
#   - Instagram API with Facebook Login   → host graph.facebook.com  (account linked to a Facebook Page)
# Always check the current API version and parameters on the Meta documentation before changing this file.
import json, os, time, urllib.parse, urllib.request

VERSION = os.environ.get('IG_GRAPH_VERSION', 'v21.0')


class IG:
    def __init__(self, user_id, token=None, host=None):
        # token=None: the token is injected by the environment as an "Authorization: Bearer" header (network secret)
        self.user_id, self.token = user_id, token
        self.host = host or os.environ.get('IG_API_HOST') or ('graph.facebook.com' if token and token.startswith('EA') else 'graph.instagram.com')

    def _call(self, method, path, **params):
        if self.token:
            params['access_token'] = self.token
        url = f'https://{self.host}/{VERSION}/{path}'
        data = None
        if method == 'GET':
            url += '?' + urllib.parse.urlencode(params)
        else:
            data = urllib.parse.urlencode(params).encode()
        try:
            with urllib.request.urlopen(urllib.request.Request(url, data=data, method=method), timeout=120) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors='replace')
            try:
                msg = json.loads(body)['error'].get('message', body)
            except Exception:
                msg = body
            raise RuntimeError(f'Instagram API {e.code}: {msg}') from None

    # ---- checks ----
    def account(self):
        return self._call('GET', self.user_id, fields='username,account_type,media_count' if self.host == 'graph.instagram.com' else 'username,media_count')

    def publishing_limit(self):
        return self._call('GET', f'{self.user_id}/content_publishing_limit', fields='quota_usage,config')

    # ---- publishing ----
    def _wait(self, creation_id, timeout=600):
        start = time.time()
        while time.time() - start < timeout:
            st = self._call('GET', creation_id, fields='status_code,status')
            code = st.get('status_code')
            if code == 'FINISHED':
                return
            if code in ('ERROR', 'EXPIRED'):
                raise RuntimeError(f'Elaborazione Instagram fallita: {st.get("status", code)}')
            time.sleep(8)
        raise RuntimeError('Timeout: Instagram non ha finito di elaborare il media')

    def _publish(self, creation_id):
        media_id = self._call('POST', f'{self.user_id}/media_publish', creation_id=creation_id)['id']
        link = self._call('GET', media_id, fields='permalink').get('permalink')
        return media_id, link

    def reel(self, video_url, caption, share_to_feed=True):
        cid = self._call('POST', f'{self.user_id}/media', media_type='REELS', video_url=video_url, caption=caption,
                         share_to_feed='true' if share_to_feed else 'false')['id']
        self._wait(cid)
        return self._publish(cid)

    def image(self, image_url, caption):
        cid = self._call('POST', f'{self.user_id}/media', image_url=image_url, caption=caption)['id']
        self._wait(cid, timeout=180)
        return self._publish(cid)

    def carousel(self, image_urls, caption):
        if not 2 <= len(image_urls) <= 10:
            raise ValueError('Un carosello deve avere da 2 a 10 elementi')
        children = []
        for u in image_urls:
            cid = self._call('POST', f'{self.user_id}/media', image_url=u, is_carousel_item='true')['id']
            self._wait(cid, timeout=180)
            children.append(cid)
        cid = self._call('POST', f'{self.user_id}/media', media_type='CAROUSEL', children=','.join(children), caption=caption)['id']
        self._wait(cid, timeout=180)
        return self._publish(cid)
