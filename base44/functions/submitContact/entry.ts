import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const RECIPIENT = "NeuralisAI@outlook.it";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const name = (body?.name || "").toString().slice(0, 80).trim();
    const email = (body?.email || "").toString().slice(0, 120).trim();
    const project = (body?.project || "").toString().slice(0, 2000).trim();

    if (!name || !email || !project) {
      return Response.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return Response.json({ error: "Email non valida" }, { status: 400 });
    }

    const subject = `Nuova richiesta — ${name}`;
    const bodyText =
      `Nuova richiesta dal sito Neuralis\n\n` +
      `Nome: ${name}\n` +
      `Email: ${email}\n\n` +
      `Progetto:\n${project}\n\n` +
      `— Inviato dal Conversion Terminal`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: RECIPIENT,
      subject,
      body: bodyText,
      from_name: "Neuralis Terminal",
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}