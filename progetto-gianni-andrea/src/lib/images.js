// Tutte le immagini in src/assets/images, indicizzate per nome file (senza estensione).
// Sostituisci i file con le foto reali mantenendo lo stesso nome: verranno ottimizzate in automatico.
const files = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export const images = Object.fromEntries(
  Object.entries(files).map(([p, mod]) => [p.split('/').pop().replace(/\.\w+$/, ''), mod.default])
);
