import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/**
 * Resuelve <lastmod> real por página para el sitemap (@astrojs/sitemap).
 *
 * Orden de prioridad:
 *  1. Colecciones de contenido (.md/.mdx con fecha en frontmatter):
 *     se calculan AMBAS fechas — frontmatter (updatedDate,
 *     fechaPublicacion, pubDate, fecha) y último commit de git — y se usa
 *     la MÁS RECIENTE (max). Así un post editado después de publicarse no
 *     queda con la fecha de publicación.
 *  2. Páginas estáticas: solo la fecha del último commit de git que tocó
 *     el archivo fuente (%cI, ISO 8601 estricto con offset, se respeta
 *     tal cual).
 *  3. Fallback = fecha de build, CON advertencia en consola (diagnostica
 *     clones sin historial git completo, p. ej. en CI/deploy).
 */

// Se fija UNA vez al cargar el módulo: la fecha de este build.
const BUILD_DATE = new Date().toISOString();

const FM_DATE_KEYS = ['updatedDate', 'fechaPublicacion', 'pubDate', 'fecha'] as const;

const CONTENT_EXT = /\.(md|mdx)$/;

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
    const m = raw.match(new RegExp(`^${key}\\s*:\\s*['"]?([^'"\\n]+)`, 'm'));
    if (!m) continue;
    const iso = normalizeDate(m[1].trim());
    if (iso) return iso;
  }
  return null;
}

function gitLastmod(relPath: string): string | null {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relPath], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out) return null;
    if (Number.isNaN(new Date(out).getTime())) return null;
    // Se conserva el formato %cI original (ISO 8601 con offset del commit).
    return out;
  } catch {
    return null;
  }
}

/**
 * @param route   Ruta del sitemap, p. ej. `/proceso/` (para los mensajes).
 * @param source  Archivo fuente relativo al root, p. ej. `src/pages/proceso.astro`.
 * @returns Fecha ISO 8601 para <lastmod>.
 */
export function getLastmod(route: string, source: string): string {
  const git = gitLastmod(source);

  // Colecciones de contenido: max(frontmatter, git).
  // Se comparan como timestamps: los formatos no son lexicográficamente
  // comparables (frontmatter termina en "Z", %cI lleva offset "-04:00").
  const fm = frontmatterDate(source);
  if (fm && git) return new Date(fm).getTime() >= new Date(git).getTime() ? fm : git;
  if (fm) return fm;

  // Páginas estáticas (sin fecha en frontmatter): solo git.
  if (git) return git;

  console.warn(
    `[sitemap] lastmod: fecha no encontrada para "${route}" (fuente: ${source}) — ` +
      `usando fallback = fecha de build (${BUILD_DATE}). ` +
      'Si esta página sí tiene commits antiguos, el historial git del clon está incompleto.',
  );
  return BUILD_DATE;
}
