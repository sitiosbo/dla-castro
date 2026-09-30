// Copia src/styles/tokens.css -> public/admin/tokens.css
// Se ejecuta automáticamente vía el script "prebuild" de package.json
// (npm lo dispara antes de "build"), así que el preview de Decap CMS
// siempre sirve los tokens actualizados sin copias manuales.
//
// Por qué: public/admin/index.html llama a
//   window.CMS.registerPreviewStyle('/admin/tokens.css')
// y /src/... no se publica en dist/ (404 en producción = preview sin estilos).
//
// No modifica el archivo origen; solo lo copia. Sin dependencias externas.
// Uso manual (p. ej. antes de `astro dev`): node scripts/copy-cms-preview-styles.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'styles', 'tokens.css');
const OUT = path.join(ROOT, 'public', 'admin', 'tokens.css');

if (!fs.existsSync(SRC)) {
  console.error(`[copy-cms-preview-styles] No existe el archivo origen: ${SRC}`);
  process.exit(1);
}

fs.copyFileSync(SRC, OUT);

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
console.log(
  `[copy-cms-preview-styles] ${rel(SRC)} -> ${rel(OUT)} (${fs.statSync(OUT).size} bytes)`
);
