import { getCollection, type CollectionEntry } from 'astro:content';
import { postPath, type Lang, type Alternates } from '../i18n';

export type Post = CollectionEntry<'blog'>;

export async function postsFor(lang: Lang) {
  const all = await getCollection('blog', (p) => p.data.lang === lang && !p.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Percorsi delle traduzioni dello stesso articolo (stesso `key`). */
export async function postAlternates(post: Post): Promise<Alternates> {
  const all = await getCollection('blog', (p) => p.data.key === post.data.key && !p.data.draft);
  return Object.fromEntries(all.map((p) => [p.data.lang, postPath(p.data.lang, p.id)]));
}
