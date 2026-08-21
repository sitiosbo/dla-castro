# ESTADO.md — DLA (Defensa Legal del Asegurado)

> Documento de memoria persistente para el agente de código. Leer completo antes de
> tocar cualquier archivo. Actualizar al final de cada sesión de trabajo verificado.

## 1. Qué es este proyecto

Sitio web Astro + Decap CMS para **DLA**, marca de defensa legal especializada en
Derecho de Seguros en Bolivia. El abogado responsable de la marca es **Castro**.
Fuente de contenido original: presentación PDF del cliente (ya volcada en
`src/content/servicios/*.md` y `src/content/settings/general.json`).

## 2. Reglas de marca — NO NEGOCIABLES

- **DLA** = marca principal. Va en wordmark, `<title>`, dominio, metadatos, favicon.
- **Castro** = apellido del abogado, usado como firma/credencial. NUNCA al mismo nivel
  jerárquico que "DLA" en ningún componente. Aparece en: `TrustBar.astro` (primera
  mención), `/sobre-mi/`, `Footer.astro` ("Abogado responsable: Castro"), schema.org
  `Person`.
- Si algún componente muestra "Castro" con el mismo tamaño/peso que "DLA", es un bug
  de marca — corregir antes de continuar.

### 2.1 Diferenciación obligatoria frente a Castro & Monje Asociados

Castro es socio de Castro & Monje Asociados (despacho general, sitio ya existente en
`sitiosbo/castromonjeasociados`), **pero DLA es una marca completamente aparte, no
una línea de servicio de ese despacho**. Reglas específicas:

- **Nunca mencionar "Castro & Monje" en el sitio de DLA** (ni en footer, ni en
  `/sobre-mi/`, ni en schema.org). Son entidades separadas de cara al usuario.
- **No reutilizar assets visuales** de Castro & Monje (mismas fotos de stock, mismo
  layout de Hero, misma estructura de secciones tal cual) — aunque compartan familia
  tipográfica serif por convención del sector legal boliviano, la ejecución debe
  sentirse como otro estudio, otra marca. Diferenciadores concretos ya definidos:
  - DLA usa acentos **terracota** (`--color-terracotta-600`); si Castro & Monje usa
    otro acento, no deben coincidir.
  - DLA tiene ángulo **técnico-regulatorio** (mono font para %, artículos legales,
    tablas de datos) — más "informe de aseguradora" que "despacho tradicional".
    Confirmar que este ángulo no se parezca al tono de Castro & Monje.
  - Nombre de marca (DLA) e identidad (isotipo/wordmark) deben ser 100% independientes.
- **Sin enlaces cruzados** entre ambos sitios salvo que el abogado lo pida
  explícitamente — no asumir que el usuario debe "descubrir" la conexión.
- Si en algún momento surge la tentación de copiar un componente literal de
  `castromonjeasociados` para ahorrar tiempo, está permitido reusar la lógica/patrón
  técnico (ej. estructura de Timeline), pero NO el resultado visual ni el copy.

## 3. Estado actual (desarrollo completado y verificado)

- [x] Estructura de carpetas completa
- [x] `astro.config.mjs` + `wrangler.jsonc` — **hosting: Cloudflare Workers con Static Assets**
- [x] Tokens de diseño en `src/styles/tokens.css` + `tailwind.config.mjs` (animaciones Emil Kowalski)
- [x] Content collections (`src/content/config.ts`) con schema completo
- [x] Contenido real de las 4 áreas de práctica migrado a markdown
- [x] Decap CMS config (`public/admin/config.yml`)
- [x] `BaseLayout.astro` con SEO, Open Graph, Twitter Cards, Schema.org (LegalService + Person)
- [x] `Header.astro` y `Footer.astro` con jerarquía de marca no negociable (DLA dominante)
- [x] `Hero.astro` + `TrustBar.astro`
- [x] `Timeline.astro` (elemento de firma con `--motion-duration-orquestado`)
- [x] `StatBar.astro` y `ServiceTable.astro`
- [x] `index.astro` (Home completa con 12 secciones estructuradas)
- [x] `AreaLayout.astro` + 4 páginas en `/areas-de-practica/` (incluyendo layout de alta prioridad para Impugnación de Rechazos)
- [x] `proceso.astro`, `resultados.astro`, `sobre-mi.astro`, `contacto.astro`
- [x] `preguntas-frecuentes.astro` con JSON-LD `FAQPage`
- [x] `WhatsAppFloat.astro` (persistente con mensajes contextuales por sección)
- [x] Páginas legales (`aviso-legal.astro`, `politica-privacidad.astro`)
- [x] Favicon SVG base (`public/favicon.svg`)
- [x] Dependencias instaladas (`node_modules`)
- [x] `blog/index.astro` y `blog/[...slug].astro` con tipografía editorial y schema SEO
- [x] `public/admin/` — Decap CMS con OAuth embebido en el Worker (`src/worker/index.js`)
- [x] `Toast.astro` — notificaciones flotantes globales (formulario de contacto y futuras)
- [x] Optimización de imágenes: `image()` en schema blog, `<Image>` en páginas, `getImage()` para skyline
- [x] Compilación probada con `npm run build` sin errores
- [x] `SocialIcons.astro` — íconos de redes sociales en footer (Facebook, Instagram, TikTok, LinkedIn), paleta de marca (`ink-400` → `terracotta-600` en hover), gestionable desde Decap CMS (`settings/general.json` → `redes_sociales`). Pendiente: cliente debe cargar los links reales desde el panel.

## 4. Orden de trabajo y estado de pasos

> **Blog EN PAUSA por decisión explícita del cliente (12-ago-2026).**

1. [x] `npm install`, correr `npm run dev`, confirmar que levanta sin errores.
2. [x] Implementar `BaseLayout.astro` completo (fuentes, meta tags, schema.org base).
3. [x] Implementar `Header.astro` y `Footer.astro` (se usan en todas las páginas).
4. [x] Implementar `Hero.astro` + `TrustBar.astro`.
5. [x] Implementar `Timeline.astro` (elemento de firma del sitio).
6. [x] Implementar `StatBar.astro` y `ServiceTable.astro`.
7. [x] Terminar `index.astro` ensamblando todo lo anterior.
8. [x] Implementar las 4 páginas de `areas-de-practica/` + pillar page.
9. [x] Implementar `proceso.astro`, `resultados.astro`, `sobre-mi.astro`, `contacto.astro`.
10. [x] Implementar `preguntas-frecuentes.astro` con JSON-LD `FAQPage` real y comentarios `<!-- TODO: validar con el abogado -->`.
11. [x] Blog: `blog/index.astro`, `blog/[...slug].astro` — **implementado y en producción**
12. [x] QA final del sitio principal (sin blog): responsive, WhatsAppFloat, sitemap.xml, comprobación de compilación.

## 4.5 Metodología de animación — Emil Kowalski (cumplida)

Todo el movimiento utiliza exclusivamente las variables CSS `--motion-*` de `tokens.css`.
El único componente con animación orquestada es `Timeline.astro`.

## 4.6 Regla permanente de imágenes — astro:assets

> **OBLIGATORIO para cualquier imagen nueva, sin excepciones.**

- **Toda imagen del sitio debe vivir en `src/assets/`** (nunca en `public/`). Astro solo
  puede optimizar (comprimir, convertir a WebP, generar srcset) archivos que estén dentro
  de `src/` — los de `public/` se sirven sin procesar.
- **Para `<img>` normales:** usar el componente `<Image>` de `astro:assets`, nunca la
  etiqueta `<img>` nativa. Pasar siempre `widths` y `sizes` para imágenes responsivas.
- **Para `background-image` en CSS:** usar `getImage()` de `astro:assets` en el
  frontmatter para obtener la URL optimizada, e inyectarla como custom property CSS
  (`style={\`--mi-img: url('${img.src}')\`}`). No hardcodear rutas de `public/` en CSS.
- **Imágenes de blog (Decap CMS):** el schema usa `image()` (Astro helper, no `z.string()`)
  y el config.yml tiene `media_folder: ""` + `public_folder: ""` a nivel de colección
  para que las portadas se guarden como rutas relativas junto al `.md` del artículo.
- **Futura foto de Castro en /sobre-mi/:** agregar a `src/assets/castro-foto.jpg` y
  renderizar con `<Image src={castroFoto} alt="..." widths={[400, 800]} ...>`.
- **No pedirle a Castro que comprima fotos antes de subirlas.** El pipeline de Astro
  se encarga en cada `npm run build`.

## 4.7 Deuda técnica: @astrojs/sitemap fijado en 3.6.0

> **Registrado:** 14-agosto-2026.

`@astrojs/sitemap` está fijado en `3.6.0` (sin rango `^`) porque la versión
`3.7.3` (latest en npm) tiene un bug conocido que rompe el build:
`Cannot read properties of undefined (reading 'reduce')` en
`@astrojs/sitemap/dist/index.js:85:37`.

No existe ninguna versión publicada después de 3.7.3 que corrija el bug
(verificado 14-ago-2026: `npm view @astrojs/sitemap versions --json`).

**Acción periódica:** revisar si una versión posterior corrige el bug
(`npm view @astrojs/sitemap dist-tags --json`) para actualizar y volver
a recibir parches de seguridad. Cuando se confirme el fix, cambiar a
un rango seguro tipo `~3.x.y`.

## 5. Verificación obligatoria

- `npm run build` ejecutado y validado sin errores.
- Generación de `dist/` estático limpia para Cloudflare Workers Static Assets.

## 6. Pendientes que requieren decisión humana

- Número de WhatsApp real (`contacto.whatsapp` en `settings/general.json`).
- Dominio final (`dlaseguros.bo` es placeholder de trabajo).
- Credenciales / API Token de Cloudflare para `wrangler deploy`.
- Diseño de Isotipo/Logo definitivo de DLA.
- Validación legal de textos normativos en FAQ.
