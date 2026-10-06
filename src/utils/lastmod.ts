import { readFileSync } from 'node:fs';
import lastmodStatic from '../data/lastmod-static.json';

/**
 * Resuelve <lastmod> real por página para el sitemap (@astrojs/sitemap).
 *
 * NO ejecuta git en tiempo de build: el entorno de build de Cloudflare no
 * tiene binario ni historial, así que las fechas estáticas vienen del
 * archivo versionado src/data/lastmod-static.json (generado localmente
 * con `node scripts/generate-lastmod.mjs`).
 *
 * Orden por tipo de página:
 *  1. Colecciones de contenido (.md/.mdx): SOLO fecha de frontmatter
 *     (updatedDate, fechaPublicacion, pubDate, fecha). Si en el futuro una
 *     entrada se edita tras publicarse, agregar `fechaActualizacion` al
 *     frontmatter (editable desde Decap) en vez de depender de git.
 *  2. Páginas estáticas: fecha leída de lastmod-static.json por ruta.
 *  3. Fallback = fecha de build, CON console.warn.
 *
 * Cada página se calcula de forma independiente: este módulo jamás lanza
 * excepciones (todo está envuelto en try/catch), de modo que un fallo en
 * una fecha no afecta a las demás.
 */

// Se fija UNA vez al cargar el módulo: la fecha de este build.
const BUILD_DATE = new Date().toISOString();

const FM_DATE_KEYS = ['updatedDate', 'fechaPublicacion', 'pubDate', 'fecha'] as const;

const CONTENT_EXT = /\.(md|mdx)$/;

// El JSON tipa cada clave conocida; en runtime se indexa por ruta arbitraria.
const staticDates: Record<string, string> = lastmodStatic;

function normalizeDate(value: string): string | null {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  // Devuelve ISO 8601 en UTC (Z) para las fechas de frontmatter.
  return d.toISOString();
}

function frontmatterDate(relPath: string): string | null {
  if (!CONTENT_EXT.test(relPath)) return null;

  let raw: string;
  try {
    raw = readFileSync(relPath, 'utf8');
  } catch {
    return null;
  }

  for (const key of FM_DATE_KEYS) {
    try {
      const m = raw.match(new RegExp(`^${key}\\s*:\\s*['"]?([^'"\\n]+)`, 'm'));
      if (!m) continue;
      const iso = normalizeDate(m[1].trim());
      if (iso) return iso;
    } catch {
      // Clave malformada: se ignora y se sigue con la siguiente.
    }
  }
  return null;
}

/**
 * @param route  Ruta del sitemap, p. ej. `/proceso/`.
 * @param source Archivo fuente relativo al root, p. ej.
 *               `src/pages/proceso.astro`. `undefined` si la ruta no está
 *               en pageSources.
 * @returns Fecha ISO 8601 para <lastmod>. Nunca lanza excepciones.
 */
export function getLastmod(route: string, source?: string): string {
  try {
    if (!source) {
      console.warn(
        `[sitemap] lastmod: "${route}" sin archivo fuente en pageSources ` +
          '(¿página nueva?) — usando fallback = fecha de build. ' +
          'Agrega la ruta a src/data/page-sources.mjs y corre node scripts/generate-lastmod.mjs.',
      );
      return BUILD_DATE;
    }

    // 1) Colecciones de contenido: SOLO frontmatter.
    if (CONTENT_EXT.test(source)) {
      const fm = frontmatterDate(source);
      if (fm) return fm;
      console.warn(
        `[sitemap] lastmod: "${route}" (${source}) sin fecha válida en frontmatter — ` +
          `usando fallback = fecha de build (${BUILD_DATE}).`,
      );
      return BUILD_DATE;
    }

    // 2) Páginas estáticas: fecha versionada (generada por generate-lastmod.mjs).
    const iso = staticDates[route];
    if (iso && !Number.isNaN(new Date(iso).getTime())) return iso;

    console.warn(
      `[sitemap] lastmod: "${route}" no está en src/data/lastmod-static.json — ` +
        'corre `node scripts/generate-lastmod.mjs` localmente y commitea el JSON. ' +
        `Usando fallback = fecha de build (${BUILD_DATE}).`,
    );
    return BUILD_DATE;
  } catch (err) {
    console.warn(
      `[sitemap] lastmod: error calculando la fecha de "${route}" (fuente: ${source}) — ` +
        `usando fallback = fecha de build (${BUILD_DATE}). Error: ${String(err)}`,
    );
    return BUILD_DATE;
  }
}
