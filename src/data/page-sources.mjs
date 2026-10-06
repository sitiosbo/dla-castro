/**
 * Mapa ruta del sitemap (con trailing slash) → archivo fuente que la genera.
 *
 * Lo comparten `astro.config.mjs` (serialize del sitemap) y
 * `scripts/generate-lastmod.mjs` (generador de lastmod-static.json).
 *
 * NOTA: si se edita o agrega una página estática listada aquí, correr
 * `node scripts/generate-lastmod.mjs` y commitear el
 * `src/data/lastmod-static.json` actualizado junto con el cambio.
 * El build de Cloudflare NO ejecuta git, así que esas fechas solo se
 * renuevan con ese script corriendo localmente.
 *
 * Las rutas cuyo archivo es .md/.mdx son colecciones de contenido: su
 * lastmod sale del frontmatter (ver src/utils/lastmod.ts), no de este JSON.
 */
export const pageSources = {
  '/': 'src/pages/index.astro',
  '/areas-de-practica/': 'src/pages/areas-de-practica/index.astro',
  '/areas-de-practica/fianzas-y-caucion/': 'src/pages/areas-de-practica/fianzas-y-caucion.astro',
  '/areas-de-practica/impugnacion-de-rechazos/': 'src/pages/areas-de-practica/impugnacion-de-rechazos.astro',
  '/areas-de-practica/seguros-de-personas/': 'src/pages/areas-de-practica/seguros-de-personas.astro',
  '/areas-de-practica/seguros-generales/': 'src/pages/areas-de-practica/seguros-generales.astro',
  '/aviso-legal/': 'src/pages/aviso-legal.astro',
  '/blog/': 'src/pages/blog/index.astro',
  '/blog/ejemplo-post/': 'src/content/blog/ejemplo-post.md',
  '/contacto/': 'src/pages/contacto.astro',
  '/politica-privacidad/': 'src/pages/politica-privacidad.astro',
  '/preguntas-frecuentes/': 'src/pages/preguntas-frecuentes.astro',
  '/proceso/': 'src/pages/proceso.astro',
  '/resultados/': 'src/pages/resultados.astro',
  '/sobre-mi/': 'src/pages/sobre-mi.astro',
};
