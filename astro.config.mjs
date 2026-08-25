import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

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
  // TODO: reemplazar por el dominio final que definan con el abogado (placeholder: dlaseguros.bo)
  site: 'https://dlaseguros.bo',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [rehypeFigureFromAlt],
  },
});
