import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';
import { getLastmod } from './src/utils/lastmod';

// Mapa ruta del sitemap (con trailing slash) → archivo fuente que la genera.
// Usado por `serialize` para emitir un <lastmod> real por página:
// frontmatter de colección > último commit de git > fecha de build (con warning).
const pageSources = {
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
      serialize(item) {
        const route = new URL(item.url).pathname;
        const source = pageSources[route];
        if (!source) {
          console.warn(
            `[sitemap] lastmod: sin archivo fuente mapeado para "${route}" — la URL queda sin <lastmod>.`,
          );
          return item;
        }
        return { ...item, lastmod: getLastmod(route, source) };
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeFigureFromAlt],
  },
});
