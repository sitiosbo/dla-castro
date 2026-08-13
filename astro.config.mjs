import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Hosting: Cloudflare Workers con Static Assets (modelo actual de Cloudflare,
// NO Cloudflare Pages). GitHub (sitiosbo/dla-seguros) es exclusivamente el
// repositorio de código fuente. El deploy se hace con `wrangler deploy`
// (ver wrangler.jsonc) sirviendo el output estático de `astro build`.
//
// El sitio es 100% estático (output por defecto de Astro) — no se necesita
// @astrojs/cloudflare como adapter SSR a menos que en el futuro el formulario
// de /contacto/ requiera procesamiento en servidor (ver nota en wrangler.jsonc).
export default defineConfig({
  // TODO: reemplazar por el dominio final que definan con el abogado (placeholder: dlaseguros.bo)
  site: 'https://dlaseguros.bo',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
