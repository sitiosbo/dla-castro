// Genera public/og-default.png (1200x630) — imagen Open Graph por defecto.
// Uso: node scripts/generate-og-image.mjs
//
// Composición 100% con assets/tokens del proyecto:
//   - Fondos/acentos leídos de src/styles/tokens.css (navy-950/800, terracotta, cream).
//   - Logo isotipo: src/assets/images/brand/logo.png (mismo que Header/Footer).
//   - Texto vía SVG overlay + sharp (mismo patrón del hero: gradiente 135°
//     navy-950 -> navy-800 + grid 40px blanco 2.5%).
// Nota técnica: librsvg (motor SVG de sharp) ignora @font-face, por lo que el
// render usa las familias Fraunces e Inter instaladas en el sistema (presentes
// en esta máquina; son las mismas que Google Fonts sirve al sitio). Si faltan,
// caen a Georgia/Arial y el resultado sigue siendo válido pero no tipográfico.
//
// Salida esperada: PNG 1200x630, < 300KB. No modifica ningún meta tag.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og-default.png');
const LOGO = path.join(ROOT, 'src', 'assets', 'images', 'brand', 'logo.png');
const TOKENS = path.join(ROOT, 'src', 'styles', 'tokens.css');

const W = 1200;
const H = 630;
const MARGIN = 90;
const MAX_TEXT_W = W - MARGIN * 2; // 1020px útiles

// --- Tokens reales (fallbacks = valores literales de tokens.css) ------------
function readToken(name, fallback) {
  const css = fs.readFileSync(TOKENS, 'utf8');
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  return m ? m[1] : fallback;
}

const NAVY_950 = readToken('color-navy-950', '#0F1B3D');
const NAVY_800 = readToken('color-navy-800', '#1B2A5B');
const TERRA_600 = readToken('color-terracotta-600', '#B5622C');
const TERRA_500 = readToken('color-terracotta-500', '#C77C3F');
const CREAM_100 = readToken('color-cream-100', '#F7EAC8');

const TITLE = 'DLA — Defensa Legal del Asegurado';
const SUBTITLE = 'Abogado especialista en Derecho de Seguros · Bolivia';
const DOMAIN = 'defensalegaldelasegurado.com';

// --- Medida real del texto (render + trim) para ajustar tamaño sin desbordar -
async function textWidth(content, family, weight, size) {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="${H}" font-family="${family}" font-weight="${weight}" font-size="${size}" fill="#000">${content}</text></svg>`;
  const { info } = await sharp(Buffer.from(svg)).trim().toBuffer({ resolveWithObject: true });
  return info.width;
}

async function fitSize(content, family, weight, startSize) {
  let size = startSize;
  const w = await textWidth(content, family, weight, size);
  if (w > MAX_TEXT_W) size = Math.floor((size * MAX_TEXT_W) / w);
  return size;
}

// --- Grid 40px estilo hero (líneas blancas 2.5%) ----------------------------
function gridLines() {
  const parts = [];
  for (let x = 40; x < W; x += 40)
    parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>`);
  for (let y = 40; y < H; y += 40)
    parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>`);
  return parts.join('');
}

const titleSize = await fitSize(TITLE, 'Fraunces, Georgia, serif', 700, 56);
const subtitleSize = await fitSize(SUBTITLE, 'Inter, Arial, sans-serif', 400, 28);

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY_950}"/>
      <stop offset="1" stop-color="${NAVY_800}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.85" r="0.7">
      <stop offset="0" stop-color="${TERRA_600}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${TERRA_600}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${gridLines()}
  <rect x="${MARGIN}" y="268" width="112" height="8" rx="4" fill="${TERRA_600}"/>
  <text x="${MARGIN}" y="364" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="${titleSize}" fill="#FFFFFF">${TITLE}</text>
  <text x="${MARGIN}" y="424" font-family="Inter, Arial, sans-serif" font-weight="400" font-size="${subtitleSize}" fill="${CREAM_100}" fill-opacity="0.92">${SUBTITLE}</text>
  <text x="${MARGIN}" y="560" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="24" fill="${TERRA_500}">${DOMAIN}</text>
</svg>`;

// --- Composición final: SVG base + logo isotipo encima -----------------------
const logoSize = 104;
const logo = await sharp(LOGO)
  .resize(logoSize, logoSize, { kernel: 'lanczos3' })
  .png()
  .toBuffer();

const output = await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: MARGIN, top: 96 }])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
const bytes = fs.statSync(OUT).size;

console.log(`Generado: ${path.relative(ROOT, OUT)}`);
console.log(`Dimensiones: ${meta.width}x${meta.height} (esperado ${W}x${H})`);
console.log(`Peso: ${(bytes / 1024).toFixed(1)} KB (objetivo < 300 KB)`);
console.log(`Título: Fraunces 700 @ ${titleSize}px | Subtítulo: Inter 400 @ ${subtitleSize}px`);

if (meta.width !== W || meta.height !== H) {
  console.error('ERROR: dimensiones incorrectas');
  process.exit(1);
}
if (bytes > 300 * 1024) {
  console.error('ERROR: peso > 300KB');
  process.exit(1);
}
