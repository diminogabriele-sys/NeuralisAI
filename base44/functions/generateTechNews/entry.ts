import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const CATEGORIES = ["Automazione", "AI", "Web", "Tech News"];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const today = new Date().toISOString().slice(0, 10);

    const prompt =
      "Sei il curatore tecnico di Neuralis Studio, agenzia di automazione AI. " +
      "Cerca le ultime notizie del mondo tech emerse oggi (AI, automazione, sviluppo web, piattaforme, strumenti dev). " +
      "Scegli UN singolo argomento rilevante e scrivi un breve approfondimento tecnico in italiano, " +
      "con stile diretto e competente (non opinioni, ma logica). " +
      "Il contenuto deve essere in markdown con una sezione ## contesto, ## cosa cambia e ## perché ci interessa. " +
      "Lunghezza contenuto: 150-300 parole. " +
      "L'estrate è una singola frase sintetica (max 200 caratteri). " +
      "Restituisci un oggetto JSON con i campi: title, excerpt, content, category.";

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        excerpt: { type: "string" },
        content: { type: "string" },
        category: { type: "string", enum: CATEGORIES },
      },
      required: ["title", "excerpt", "content", "category"],
    };

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: schema,
    });

    const note = {
      title: (llm.title || "").toString().slice(0, 200).trim(),
      excerpt: (llm.excerpt || "").toString().slice(0, 300).trim(),
      content: (llm.content || "").toString().slice(0, 5000),
      category: CATEGORIES.includes(llm.category) ? llm.category : "Tech News",
      published_date: today,
    };

    if (!note.title || !note.content) {
      return Response.json({ error: "Generazione insufficiente" }, { status: 500 });
    }

    const created = await base44.asServiceRole.entities.TechNote.create(note);

    return Response.json({ ok: true, id: created.id, title: created.title });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}