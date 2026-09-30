import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Articoli del blog: un file Markdown per lingua in src/content/blog/<lingua>/.
// `key` collega le traduzioni dello stesso articolo (serve per hreflang e selettore lingua).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    date: z.coerce.date(),
    lang: z.enum(['it', 'en']),
    slug: z.string().optional(), // se presente diventa l'id (e l'URL) dell'articolo
    key: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
