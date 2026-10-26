// Convierte las imágenes de Brújula (contenido/brujula/, carpeta local) en
// WebP livianos para la web (public/brujula/).
//
// Uso:  node scripts/brujula.mjs
//
// Cuando Camila mande una imagen nueva, se pone en contenido/brujula/ con el
// mismo nombre de archivo de la tabla (o se cambia el nombre aquí) y se corre
// el script. El nombre de salida es el que usa src/lib/contenido.ts.
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ORIGEN = "contenido/brujula";
const DESTINO = "public/brujula";

/** archivo en contenido/brujula → nombre en public/brujula (sin extensión) */
const TABLA = {
  "Elsa Schiaparelli": "schiaparelli",
  "La Petite Mort": "la-petite-mort",
  Heroica: "heroica",
  "Marvel Moreno": "marvel-moreno",
  "Idea Vilariño": "idea-vilarino",
  "Judith Butler": "judith-butler",
  "Joanne Entwistle": "joanne-entwistle",
  "Michel Foucault": "michel-foucault",
  "Panoleta-Lucila_1080x": "panoletas",
  "Archivo historico de medellin": "archivo-historico-medellin",
};

if (!existsSync(ORIGEN)) {
  console.error(`No existe ${ORIGEN}: las imágenes originales son locales (no van a git).`);
  process.exit(1);
}
mkdirSync(DESTINO, { recursive: true });

const sinExtension = (f) => f.replace(/\.[^.]+$/, "");
for (const archivo of readdirSync(ORIGEN)) {
  const base = sinExtension(archivo).normalize("NFC");
  const salida = TABLA[base];
  if (!salida) {
    console.warn(`· ${archivo}: no está en la tabla, se omite`);
    continue;
  }
  const destino = join(DESTINO, `${salida}.webp`);
  await sharp(join(ORIGEN, archivo))
    .rotate()
    .resize({ width: 560, height: 700, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90 })
    .toFile(destino);
  const m = await sharp(destino).metadata();
  console.log(`✓ ${archivo} → ${destino} (${m.width}×${m.height})`);
}
