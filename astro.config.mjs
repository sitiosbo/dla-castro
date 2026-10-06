import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';
import { getLastmod } from './src/utils/lastmod';
import { pageSources } from './src/data/page-sources.mjs';

// ── <lastmod> del sitemap ────────────────────────────────────────────────
// La tabla ruta→archivo vive en src/data/page-sources.mjs (compartida con
// scripts/generate-lastmod.mjs).
//
// IMPORTANTE: si se edita o agrega una página estática listada en
// pageSources, correr `node scripts/generate-lastmod.mjs` localmente y
// commitear el src/data/lastmod-static.json actualizado JUNTO con el cambio.
// El build de Cloudflare no ejecuta git: sin ese JSON actualizado, la página
// nueva cae en el fallback (fecha de build + warning en el log de build).
// Las colecciones (.md) no usan el JSON: su lastmod sale del frontmatter.

// Hosting: Cloudflare Workers con Static Assets (modelo actual de Cloudflare,
// NO Cloudflare Pages). GitHub (sitiosbo/dla-seguros) es exclusivamente el
// repositorio de código fuente. El deploy se hace con `wrangler deploy`
// (ver wrangler.jsonc) sirviendo el output estático de `astro build`.
//
// El sitio es 100% estático (output por defecto de Astro) — no se necesita
// @astrojs/cloudflare como adapter SSR a menos que en el futuro el formulario
// de /contacto/ requiera procesamiento en servidor (ver nota en wrangler.jsonc).

/** Rehype: envuelve <img> con alt no vacío en <figure><figcaption>. */
function rehypeFigureFromAlt() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img') return;
      if (index === null || !parent) return;
      const alt = node.properties?.alt;
      if (!alt) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          node,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: String(alt) }],
          },
        ],
      };
    });
  };
}

export default defineConfig({
  // Dominio real del sitio (sin www)
  site: 'https://defensalegaldelasegurado.com',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Aislamiento por página: si el cálculo de un lastmod falla, solo esa
      // URL queda con fallback; nunca se rompe el sitemap entero
      // (@astrojs/sitemap aborta por completo si serialize lanza).
      serialize(item) {
        let route = item.url;
        try {
          route = new URL(item.url).pathname;
          return { ...item, lastmod: getLastmod(route, pageSources[route]) };
        } catch (err) {
          console.warn(
            `[sitemap] lastmod: error inesperado para "${route}" — usando fecha de build. Error: ${String(err)}`,
          );
          return { ...item, lastmod: new Date().toISOString() };
        }
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeFigureFromAlt],
  },
});
