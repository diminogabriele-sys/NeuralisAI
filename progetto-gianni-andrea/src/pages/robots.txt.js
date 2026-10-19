import { site } from '../config/site.js';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${site.url}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
