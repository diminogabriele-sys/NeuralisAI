// Edge Function "notify": invia le email di notifica tramite Resend.
// Viene chiamata dal database (vedi schema.sql) quando:
//  - arriva un nuovo messaggio in chat  → email al cliente o al team
//  - cambia lo stato di un ordine       → email al cliente
//
// Variabili richieste (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   chiave API di resend.com
//   MAIL_FROM        mittente verificato, es. "Orion <noreply@orion.it>"
//   SITE_URL         es. https://www.orion.it
//   WEBHOOK_SECRET   la stessa stringa salvata in private.settings
//   ADMIN_EMAILS     (facoltativo) email del team separate da virgola; se vuoto usa la tabella admins
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono già disponibili in automatico.

import { createClient } from 'npm:@supabase/supabase-js@2';

type Lang = 'it' | 'en' | 'es' | 'de' | 'fr';

const AREA_PATH: Record<Lang, string> = {
  it: '/area-clienti/',
  en: '/en/client-area/',
  es: '/es/area-clientes/',
  de: '/de/kundenbereich/',
  fr: '/fr/espace-client/',
};

const STATUS: Record<Lang, Record<string, string>> = {
  it: { consultation: 'Consulenza', design: 'Progettazione', review: 'Confronto con il cliente', production: 'Produzione', finishing: 'Finiture e controllo qualità', shipping: 'Spedito', delivered: 'Consegnato' },
  en: { consultation: 'Consultation', design: 'Design', review: 'Client review', production: 'Production', finishing: 'Finishing & quality control', shipping: 'Shipped', delivered: 'Delivered' },
  es: { consultation: 'Consulta', design: 'Diseño', review: 'Revisión con el cliente', production: 'Producción', finishing: 'Acabados y control de calidad', shipping: 'Enviado', delivered: 'Entregado' },
  de: { consultation: 'Beratung', design: 'Konstruktion', review: 'Abstimmung mit dem Kunden', production: 'Fertigung', finishing: 'Finish & Qualitätskontrolle', shipping: 'Versendet', delivered: 'Zugestellt' },
  fr: { consultation: 'Consultation', design: 'Conception', review: 'Échange avec le client', production: 'Production', finishing: 'Finitions et contrôle qualité', shipping: 'Expédiée', delivered: 'Livrée' },
};

const TXT: Record<Lang, { msgSubject: string; msgIntro: string; statusSubject: string; statusIntro: string; note: string; open: string }> = {
  it: { msgSubject: 'Nuovo messaggio sul tuo ordine {code}', msgIntro: 'Il team di Orion ti ha scritto:', statusSubject: 'Ordine {code}: {status}', statusIntro: 'Lo stato del tuo ordine è stato aggiornato a', note: 'Nota del team', open: 'Apri l’area clienti' },
  en: { msgSubject: 'New message about your order {code}', msgIntro: 'The Orion team wrote to you:', statusSubject: 'Order {code}: {status}', statusIntro: 'Your order status has been updated to', note: 'Note from the team', open: 'Open the client area' },
  es: { msgSubject: 'Nuevo mensaje sobre tu pedido {code}', msgIntro: 'El equipo de Orion te ha escrito:', statusSubject: 'Pedido {code}: {status}', statusIntro: 'El estado de tu pedido se ha actualizado a', note: 'Nota del equipo', open: 'Abrir el área de clientes' },
  de: { msgSubject: 'Neue Nachricht zu Ihrer Bestellung {code}', msgIntro: 'Das Team von Orion hat Ihnen geschrieben:', statusSubject: 'Bestellung {code}: {status}', statusIntro: 'Der Status Ihrer Bestellung wurde aktualisiert auf', note: 'Hinweis des Teams', open: 'Kundenbereich öffnen' },
  fr: { msgSubject: 'Nouveau message sur votre commande {code}', msgIntro: 'L’équipe Orion vous a écrit :', statusSubject: 'Commande {code} : {status}', statusIntro: 'L’état de votre commande a été mis à jour :', note: 'Note de l’équipe', open: 'Ouvrir l’espace client' },
};

const env = (k: string) => Deno.env.get(k) ?? '';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function layout(body: string, ctaHref: string, ctaLabel: string) {
  return `<!doctype html><html><body style="margin:0;background:#0a0a0b;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#f4f1ea">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#121214;border:1px solid #3a3122">
    <tr><td style="padding:28px 32px;border-bottom:1px solid #3a3122;font-family:Georgia,serif;font-size:20px;letter-spacing:4px;color:#c9a45c">ORION</td></tr>
    <tr><td style="padding:28px 32px;font-size:15px;line-height:1.6">${body}
      <p style="margin:28px 0 0"><a href="${ctaHref}" style="display:inline-block;background:#c9a45c;color:#0a0a0b;text-decoration:none;padding:14px 22px;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">${ctaLabel}</a></p>
    </td></tr>
  </table></body></html>`;
}

async function sendMail(to: string[], subject: string, html: string) {
  if (!to.length) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('MAIL_FROM'), to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!env('WEBHOOK_SECRET') || req.headers.get('x-webhook-secret') !== env('WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { table, type, record, old_record } = await req.json();
  const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
  const site = env('SITE_URL').replace(/\/$/, '');

  const orderId = table === 'messages' ? record.order_id : record.id;
  const { data: order } = await db.from('orders').select('id, code, title, customer_email, status, status_note').eq('id', orderId).single();
  if (!order) return new Response('Order not found', { status: 404 });

  const { data: profile } = await db.from('profiles').select('lang, first_name').eq('email', order.customer_email).maybeSingle();
  const lang: Lang = (profile?.lang as Lang) in TXT ? (profile!.lang as Lang) : 'it';
  const t = TXT[lang];
  const areaUrl = site + AREA_PATH[lang];

  try {
    if (table === 'messages' && type === 'INSERT') {
      if (record.from_admin) {
        // il team ha scritto → avvisa il cliente
        await sendMail(
          [order.customer_email],
          t.msgSubject.replace('{code}', order.code),
          layout(`<p>${t.msgIntro}</p><blockquote style="margin:16px 0;padding:12px 16px;border-left:2px solid #c9a45c;color:#d8d3c9">${esc(record.body).replace(/\n/g, '<br>')}</blockquote>`, areaUrl, t.open)
        );
      } else {
        // il cliente ha scritto → avvisa il team
        let admins = env('ADMIN_EMAILS').split(',').map((s) => s.trim()).filter(Boolean);
        if (!admins.length) admins = ((await db.from('admins').select('email')).data ?? []).map((a) => a.email);
        const who = profile?.first_name ? `${profile.first_name} (${order.customer_email})` : order.customer_email;
        await sendMail(
          admins,
          `💬 ${order.code} · ${order.title}`,
          layout(`<p><strong>${esc(who)}</strong> ha scritto sull’ordine <strong>${esc(order.code)}</strong>:</p><blockquote style="margin:16px 0;padding:12px 16px;border-left:2px solid #c9a45c;color:#d8d3c9">${esc(record.body).replace(/\n/g, '<br>')}</blockquote>`, `${site}/admin/#${order.id}`, 'Rispondi dal pannello')
        );
      }
    } else if (table === 'orders' && type === 'UPDATE' && record.status !== old_record?.status) {
      const status = STATUS[lang][record.status] ?? record.status;
      const note = record.status_note ? `<p style="color:#a39e94">${t.note}: ${esc(record.status_note)}</p>` : '';
      await sendMail(
        [order.customer_email],
        t.statusSubject.replace('{code}', order.code).replace('{status}', status),
        layout(`<p>${t.statusIntro}</p><p style="font-family:Georgia,serif;font-size:26px;color:#c9a45c;margin:8px 0 16px">${esc(status)}</p>${note}`, areaUrl, t.open)
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(String(err), { status: 502 });
  }
  return new Response('ok');
});
