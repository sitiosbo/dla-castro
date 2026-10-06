#!/usr/bin/env node
/**
 * Genera src/data/lastmod-static.json con la fecha del último commit de git
 * de cada página ESTÁTICA listada en src/data/page-sources.mjs.
 *
 * Correr LOCALMENTE (donde git tiene el historial completo):
 *
 *   node scripts/generate-lastmod.mjs
 *
 * y commitear el JSON resultante junto con el cambio de página. El build de
 * Cloudflare no ejecuta git: ahí el sitemap lee ese JSON tal cual.
 *
 * Las colecciones de contenido (.md/.mdx) se omiten a propósito: su lastmod
 * sale del frontmatter (src/utils/lastmod.ts), no de git.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pageSources } from '../src/data/page-sources.mjs';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_FILE = fileURLToPath(new URL('../src/data/lastmod-static.json', import.meta.url));
const CONTENT_EXT = /\.(md|mdx)$/;

function gitLastmod(source) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', source], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out || Number.isNaN(new Date(out).getTime())) return null;
    return out;
  } catch {
    return null;
  }
}

const dates = {};
const collections = [];
const missing = [];

for (const [route, source] of Object.entries(pageSources)) {
  if (CONTENT_EXT.test(source)) {
    collections.push(route);
    continue;
  }
  const iso = gitLastmod(source);
  if (iso) {
    dates[route] = iso;
  } else {
    missing.push(`${route} (${source})`);
  }
}

writeFileSync(OUT_FILE, `${JSON.stringify(dates, null, 2)}\n`, 'utf8');

console.log(`[generate-lastmod] ${Object.keys(dates).length} rutas estáticas → ${OUT_FILE}`);
if (collections.length > 0) {
  console.log(`[generate-lastmod] omitidas (colecciones, usan frontmatter): ${collections.join(', ')}`);
}
if (missing.length > 0) {
  console.warn(
    `[generate-lastmod] SIN fecha de git (quedarán con fallback de build): ${missing.join(', ')}`,
  );
  process.exitCode = 1;
}
