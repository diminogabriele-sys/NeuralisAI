import type { ImageMetadata } from 'astro';

// Tutte le immagini in src/assets/placeholders, indicizzate per nome file senza estensione.
// Per usare le foto reali basta sostituire i file mantenendo lo stesso nome
// (vanno bene anche .webp/.png: aggiorna solo l'estensione, il nome resta quello).
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/placeholders/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const byName: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  byName[name] = mod.default;
}

export function img(name: string): ImageMetadata {
  const found = byName[name];
  if (!found) throw new Error(`Immagine mancante in src/assets/placeholders: ${name}`);
  return found;
}
