import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const deleted = await base44.asServiceRole.entities.TechNote.deleteMany({
      published_date: { $lt: cutoff },
    });

    return Response.json({ ok: true, cutoff, deleted });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}