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
  mencion), `/sobre-mi/`, `Footer.astro` ("Abogado responsable: Ramiro Guillermo Castro"), schema.org
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
- Dominio final definido y activo: `defensalegaldelasegurado.com` — es el dominio definitivo, no un placeholder (ver 6.6).
- Credenciales / API Token de Cloudflare para `wrangler deploy`.
- Diseño de Isotipo/Logo definitivo de DLA.
- Validación legal de textos normativos en FAQ.

## 6.1 Cambio de nombre del abogado (21-ago-2026)

Reemplazado "Dr. Ramiro Castro" → "Ramiro Guillermo Castro" (sin prefijo "Dr.") en
todos los archivos del proyecto: componentes, contenido, metadata SEO, schema.org,
documentación. Verificar que Decap CMS también refleje el cambio en el panel.

## 6.2 Blog hero — filtro navy + fix object-fit (25-ago-2026)

Corregido bug pre-existente: `.article-cover-img` usaba `object-fit: cover` (recortaba
la imagen). Cambiado a `contain` (sin recorte, decisión de diseño confirmada).

Agregado `filter: url(#duotone-navy)` al hero del artículo de blog. El SVG filter
`#duotone-navy` ya estaba definido en el archivo pero no se aplicaba al hero — solo
a las imágenes del body. Nota: `FramedImage.astro` no aplica el filtro por sí solo;
el filtro se aplica desde el componente padre (ej. proceso.astro).

## 6.3 Hero wordmark — alineación, peso y divisor vertical (27-ago-2026)

Tres ajustes en `src/components/Hero.astro`:

1. **Alineación badge↔wordmark:** Agregado `margin-left: 1.5rem` a `.hero-wordmark` para
   compensar el desplazamiento del badge (padding-left 0.625rem + dot 6px + gap 0.5rem).
   El borde izquierdo de "D" en "DLA" queda alineado con el borde izquierdo de "A" en
   "ABOGADO". Verificar visualmente en navegador — el valor puede necesitar ajuste fino.

2. **Peso de "DLA" reducido:** Cambiado `.wordmark-dla` de `font-weight: 700` a `600`.
   Fraunces se ve mejor en pesos moderados para wordmarks grandes. Fraunces 600 ya
   estaba cargado en Google Fonts (verificado en BaseLayout.astro).

3. **Divisor vertical:** Reemplazado `<span class="wordmark-separator">—</span>` por
   `<span class="wordmark-divider"></span>` (div vacío, `width: 1px; height: 2.25rem;
   background: rgba(255,255,255,0.25)`). Cambiado `.hero-wordmark` de `align-items:
   baseline` a `center` para centrar el divisor verticalmente respecto a "DLA".
   Responsive: `height: 1.5rem` en mobile (≤640px).

El `aria-label="DLA — Defensa Legal del Asegurado"` se mantuvo sin cambios (accesibilidad).

## 6.4 Favicon + logo Decap CMS (27-ago-2026)

Wilson colocó `public/favicon.ico` y `public/admin/logo.png`. Se agregaron las
referencias en código:

1. **Favicon:** `<link rel="icon" type="image/x-icon" href="/favicon.ico" />` en
   `src/layouts/BaseLayout.astro` (reemplaza referencia rota a `favicon.svg` que no
   existía). Schema.org `logo` en BaseLayout también corregido de `favicon.svg` a
   `favicon.ico`.

2. **Logo Decap CMS:** `logo_url: /admin/logo.png` en `public/admin/config.yml`
   (reemplaza `logo_url: /favicon.svg` que apuntaba al archivo inexistente).

`grep -r "favicon" src/` confirma solo 2 referencias, ambas apuntando a `favicon.ico`.
No quedan referencias rotas ni duplicadas.

## 6.5 Cambio de número de WhatsApp (22-sep-2026)

Reemplazado número antiguo `59170557088` por `59157001099` (formato limpio, sin `+`):

1. `src/content/settings/general.json` línea 10 — fuente de verdad
   (`contacto.whatsapp`), consumido dinámicamente por `WhatsAppFloat.astro` y
   `contacto.astro` (`data-whatsapp` / `wa.me`).
2. `public/llms.txt` línea 20 — formato display `+591 57001099`.
3. `instruc_contacto.md` línea 62 — ejemplo JSON en documentación.

Verificación post-cambio:
- `grep 70557088|59170557088|7055-7088` repo-wide → **0 resultados**.
- `grep 57001099` → **3 apariciones** (los 3 archivos anteriores).
- `npm run build` → sin errores (0 errors, 0 warnings, 1 hint pre-existente de
  `BaseLayout.astro:115`).

No se tocaron otros teléfonos ni archivos. Sin git (modo local).

## 6.6 Dominio y correo reales — defensalegaldelasegurado.com (24-sep-2026)

Reemplazo en dos fases (auditoría → cambios confirmados por el usuario):

- **Dominio:** el dominio placeholder anterior fue reemplazado por
  `defensalegaldelasegurado.com` (sin `www`) en 38 líneas:
  `astro.config.mjs` (`site` + comentario), `BaseLayout.astro:27` (`siteUrl` que alimenta
  og:image/twitter:image/schema.org), `public/robots.txt`, `public/admin/config.yml`
  (`site_url`), `public/llms.txt`, los 22 breadcrumbs/JSON-LD de 10 páginas/layouts, y
  documentación (`ARQUITECTURA...md`, `ESTADO.md`, `docs/DOCUMENTACION_TECNICA.md` —
  incluye realineación del diagrama ASCII de la línea 24).
- **Correo:** el correo del dominio anterior → `defensalegaldelasegurado@gmail.com` en
  `general.json:11`, `llms.txt:19`, `instruc_contacto.md:63`.
- **workers.dev:** `public/admin/config.yml:5` `base_url` ahora es
  `https://defensalegaldelasegurado.com` (decisión del usuario: OAuth del CMS resuelve
  en el dominio real, no en la URL de preview del Worker).

Verificación: grep del dominio/correo viejos y de la URL de workers.dev →
**0 resultados** en el proyecto (solo `dist/` regenerado: 0 viejos / 21 nuevos).
`npm run build` sin errores. 19 archivos modificados. Sin git.

Redacción de `ESTADO.md:142` (dominio ya no es placeholder) y de `ARQUITECTURA...md:11`
(sin texto de pendiente ni alternativa `.com.bo`) corregida tras confirmación
del usuario: el dominio es definitivo.

## 6.7 Sidebar áreas de práctica — sticky al contenedor, no al card (24-sep-2026)

Bug: en las 4 páginas de `/areas-de-practica/` el card de contacto (`position:
sticky; top: 5rem`) se desplazaba sobre el listado "Otras áreas de práctica"
(.sidebar-otras-areas) al hacer scroll, porque el sticky estaba solo en el card.

Fix en el bloque `<style>` de `src/layouts/AreaLayout.astro` (solo CSS, markup
intacto):

1. `.sidebar-card`: eliminados `position: sticky;` y `top: 5rem;`.
2. Nueva regla `.area-sidebar`: `position: sticky; top: calc(var(--header-height)
   + 1rem); max-height: calc(100vh - var(--header-height) - 2rem); overflow-y: auto`
   — card + listado se mueven juntos; `max-height` + `overflow-y` es la red de
   seguridad para ventanas bajas (scroll interno en vez de contenido cortado).
3. Media query ≤900px: `.sidebar-card { position: static; }` → `.area-sidebar
   { position: static; max-height: none; overflow-y: visible; }`.

Clave del fix: `.area-main-inner` tiene `align-items: start` (el aside tiene alto
= contenido), por eso el sticky debe ir en el `<aside>` (containing block = grid
area de la columna de contenido).

Verificación: `npm run build` sin errores. CSS compilado confirmado en
`dist/_astro/fianzas-y-caucion.CG0p48zu.css` (chunk que comparten las 4 páginas):
regla sticky nueva presente, regla mobile presente, `.sidebar-card` sin
sticky/top. Quedan pendientes de prueba visual manual por el usuario (screenshots
desktop scroll medio, ventana baja ~600px, mobile ≤900px, y foco con Tab en los
vínculos del listado — el `overflow-y: auto` del aside podría recortar el contorno
de foco). Sin git.

## 6.8 Sidebar sin scroll interno + sección "Sigue explorando" (24-sep-2026)

Supera a 6.7: el `max-height` + `overflow-y: auto` añadido allí generaba una barra
de scroll dentro del card azul (mala UX). Solución: el aside queda **solo con el
card** (~335px, cabe en cualquier laptop) y "Otras áreas de práctica" baja al pie
del contenido como sección "Sigue explorando".

`src/layouts/AreaLayout.astro` (único archivo tocado; las 4 páginas, tokens.css,
Timeline y hero intactos):

**A. Sidebar**
- `.area-sidebar`: eliminados `max-height` y `overflow-y`; conserva `position:
  sticky; top: calc(var(--header-height) + 1rem)`.
- Markup: eliminado el bloque `<div class="sidebar-otras-areas">` completo.
- `.sidebar-card`: eliminado `margin-bottom: 1.5rem`.
- CSS muerto borrado: `.sidebar-otras-areas`, `.sidebar-otras-titulo`,
  `.sidebar-area-link`, `:hover`, `.sidebar-area-link-highlight` y su `:hover`.
- Media ≤900px: `.area-sidebar { position: static; }` (sin max-height/overflow).

**B. Sección "Sigue explorando"** (nueva, dentro de `<main>`, después de
`.area-main-inner`; contenedor 72rem + padding 1.5rem; `margin-top: 4rem`;
`border-top: 1px rgba(15,27,61,0.08)` + `padding-top: 3rem` en `.sigue-explorando-inner`)
- Semántica: `<section aria-labelledby="sigue-explorando-titulo">` + `<h2 id>`
  con estilo propio (display/navy-800/1.5rem, igual que los h2 del prose);
  `.eyebrow` global sobre el título.
- Datos dinámicos: `getCollection('servicios')` filtrando el área actual
  (`area.slug !== slug`) y orden fijo por slug (seguros-generales →
  seguros-de-personas → fianzas-y-caucion → impugnacion-de-rechazos).
- Card: `<a>` completo; eyebrow mono "Área de práctica"; título display navy-800;
  resumen ink-600 con `-webkit-line-clamp: 3`; "Ver área →" terracotta-600 con
  `margin-top: auto` (alturas iguales vía grid `stretch` + flex-column).
- Énfasis `prioridadConversion === 'alta'` (impugnación): `border-top: 3px`
  terracotta + eyebrow/CTA en terracotta.
- Grid: `repeat(auto-fit, minmax(16rem, 1fr))`, gap 1.25rem → 3 columnas en
  desktop, colapsa solo en pantallas angostas (sin media query extra).
- Hover/focus-visible: `translateY(-2px)` + border-color + `box-shadow:
  var(--shadow-card)` (3 propiedades, todas con `--motion-duration-micro` y
  `--motion-ease-micro`); `@media (prefers-reduced-motion: reduce)` anula el
  transform; foco de teclado con outline terracotta 2px.

**Verificación:** `npm run build` 0 errores / 0 warnings (2 hints preexistentes
de BaseLayout). HTML de las 4 páginas: sección presente, 3 tarjetas cada una,
el área actual excluida, orden fijo correcto, impugnación con clase
`sigue-card-destacada` en las 3 páginas restantes, DOM order contenido →
aside → sección. CSS compilado: 0 referencias a `sidebar-otras-*` /
`sidebar-area-link*` / `overflow-y` / `max-height: calc(100vh…`; reglas
`.sigue-*` completas incl. line-clamp y reduced-motion. Dev server (`npm run
dev`) responde HTTP 200 con la sección. Sin git (usuario revisa localmente).

## 6.9 Dirección física real de la oficina en todo el sitio (24-sep-2026)

Dirección definitiva del cliente (sin inventar teléfono/horarios/coords/CP):
Calle Ballivián #1456, Edificio Cervantes, Mezanine 2, Oficina 4, entre calles
Loayza y Bueno · La Paz, Bolivia.

**Fuente única de datos:** `src/content/settings/general.json` → `contacto.direccion`
(el lugar donde ya vivían WhatsApp y email) con campos `calle, edificio, piso,
oficina, referencia, ciudad, departamento, pais, paisISO`. Extensiones:
- `src/content/config.ts`: schema zod de `settings.contacto.direccion` (requerido).
- `src/data/oficina.ts` (nuevo): SOLO derivaciones — `streetAddress`,
  `direccionLineas` (3 líneas /contacto), `direccionCorta` (footer),
  `direccionTextoLargo` (legal + Maps), `direccionSchema` (PostalAddress) y
  `mapsUrl` (Google Maps search con `encodeURIComponent`, sin iframe).
- `public/admin/config.yml`: campo `direccion` registrado en Decap (un guardado
  del CMS no lo borra y el cliente puede editarlo).

**Dónde se muestra:**
1. `/contacto/`: bloque "Nuestra oficina" (`.office-card`, card blanco bajo el
   `.info-card` del sidebar — form, `.direct-contact-box`, toast y WhatsApp intactos:
   diff de contacto.astro = 47 altas / 0 bajas) con 3 líneas + botón "Cómo llegar"
   (`target="_blank" rel="noopener noreferrer"`).
2. Footer (todas las páginas): línea "Oficina · Calle Ballivián #1456, … · La Paz,
   Bolivia" y la línea de cobertura ahora etiquetada "Cobertura · La Paz · Santa
   Cruz · Cochabamba · Toda Bolivia" (contenido intacto).
3. JSON-LD BaseLayout: entidad existente **LegalService** extendida — su
   `address` (antes solo locality+country, con comentario de "pendiente") ahora es
   `PostalAddress` con `streetAddress`, `addressLocality`, `addressRegion`,
   `addressCountry: BO`; sin geo/telephone nuevos/openingHours. Sin entidades
   duplicadas (LegalService + Person + BreadcrumbList).
4. Legales: `/aviso-legal/` (párrafo "Domicilio de la oficina" en Titular) y
   `/politica-privacidad/` (nueva sección "Responsable del sitio" con domicilio).

**Checklist:** dirección sale de un solo archivo (grep `Ballivián` en src/ → solo
general.json); build 0 errores/0 warnings (2 hints preexistentes); JSON-LD parsea
como JSON válido en home y contacto; strings idénticos entre contacto/footer/schema/
legales (derivan del mismo JSON); footer con label "Oficina" vs "Cobertura" para
no contradecir la cobertura nacional; form/toast/WhatsAppFloat/worker sin tocar.
Páginas legales: existen y tienen contenido real pero siguen marcadas con TODO
("validar con el abogado el texto legal completo") — se les sumó el domicilio sin
reescribirlas. Sin git.

## 6.10 Imagen Open Graph por defecto (og-default.png) (29-sep-2026)

`BaseLayout.astro` declara `ogImage = '/og-default.png'` (og:image y twitter:image
→ `https://defensalegaldelasegurado.com/og-default.png`) pero el archivo no
existía: 404 al compartir el sitio en WhatsApp/Facebook. Se generó el archivo;
el meta tag NO se tocó.

- **Nuevo:** `public/og-default.png` — PNG 1200×630 exactos, 150.3 KB (< 300 KB).
- **Nuevo:** `scripts/generate-og-image.mjs` (script único, reproducible con
  `node scripts/generate-og-image.mjs`; se decidió dejarlo documentado en vez de
  borrarlo): compone con sharp — gradiente 135° navy-950 → navy-800 + grid 40px
  blanco 2.5% (mismo patrón del Hero), glow terracotta sutil, logo isotipo
  `src/assets/images/brand/logo.png` a 104px, barra de acento terracotta-600,
  título "DLA — Defensa Legal del Asegurado" en Fraunces 700, subtítulo
  "Abogado especialista en Derecho de Seguros · Bolivia" en Inter 400 (tamaños
  auto-ajustados por medida real del texto, tope 1020px útiles) y dominio en
  terracotta-500. Todos los colores se leen de `tokens.css` (con fallback literal).
- **Nota técnica:** librsvg (motor SVG de sharp) ignora `@font-face`; el render
  usa las familias Fraunces/Inter instaladas en la máquina (presentes aquí;
  documentado en el encabezado del script).
- **Verificación:** `npm run build` OK → `dist/og-default.png` = 153864 bytes;
  HTML de dist sigue con `og:image`/`twitter:image` idénticos (0 cambios en
  BaseLayout.astro); imagen abierta en el explorador. Sin git (usuario revisa
  localmente).

## 6.11 Página 404 personalizada (29-sep-2026)

Antes: no existía `src/pages/404.astro` → cualquier URL inexistente devolvía
una respuesta vacía (0 bytes, pantalla en blanco). Ahora sirve una página
institucional completa con status HTTP 404.

- **Nuevo:** `src/pages/404.astro` — BaseLayout completo (Header + Footer +
  WhatsAppFloat + Toast + CookieBanner), eyebrow mono "Error 404" terracotta,
  "404" grande en Fraunces navy-800 (`aria-hidden`), h1 "Página no encontrada",
  texto institucional y 3 acciones: **Volver al inicio** (primario terracotta),
  **Áreas de práctica** y **Contacto** (secundarios con borde). Solo tokens de
  `tokens.css` (colores, `--radius-card`, transiciones `--motion-*` con
  reduced-motion heredado); CRLF y sin BOM como las páginas hermanas.
- **BaseLayout.astro (único cambio fuera de la página, necesario y reportado):**
  prop opcional `noindex?: boolean` (default `false`) → `<meta name="robots"
  content="noindex">`. Sin la prop, nada cambia en el resto de páginas
  (verificado: dist/index.html sin meta robots).
- **Title:** "Página no encontrada · DLA — Defensa Legal del Asegurado" ✓.
- **wrangler.jsonc NO se tocó** — ya tenía `"not_found_handling": "404-page"`,
  así que Cloudflare Static Assets sirve `dist/404.html` con status 404; el
  worker sigue delegando todo en `env.ASSETS.fetch` (sin cambios).
- **Verificación:** dev server → `curl -I .../pagina-que-no-existe/` = HTTP 404
  con 72235 bytes de contenido; `npx wrangler dev` (mismo camino que producción:
  worker + assets) → HTTP 404 + 23186 bytes (= dist/404.html) y control `/` =
  200; `npm run build` OK (16 páginas, astro check 0 errores); screenshot
  headless local con header, footer, botones y banner de cookies correctos;
  meta robots presente solo en 404.html. Sin git (usuario revisa localmente).

## 6.12 Un solo `<h1>` en la portada — carrusel del Hero (29-sep-2026)

**Problema:** `Hero.astro:107` renderizaba `<h1 class="hero-h1">` dentro del
`.map()` de los 4 slides → `grep -c "<h1" dist/index.html` = **4** (los 4 en el
DOM a la vez para el cross-fade).

**Fix (solo estructura semántica, 0 cambios de comportamiento):**
- Slide 1 (visible por defecto) conserva `<h1 class="hero-h1">`; slides 2-4
  ahora son `<div class="hero-h1">` — no son subtítulos, son variantes del mismo
  titular (ni h2-h6). El texto siguen poniéndolo los mismos datos de
  `hero-slides`; el JS del ciclo (que solo alterna clases
  `hero-slide-active`/`aria-hidden`) no se tocó.
- `.hero-h1`: añadido `margin-top: 0.67em` explícito — era el margen UA del
  `<h1>` que los `<div>` no heredan; sin esto los slides 2-4 subirían ~29px en
  el cross-fade. Para el `<h1>` el valor es idéntico al UA → cero cambio.
- No se tocaron wordmark, badge, CTAs, animaciones ni timings.

**Verificación (numérica, CDP headless antes/después, mismo dev server):**
- `grep -c "<h1" dist/index.html` → **1** (Git grep); el único h1 = slide 1
  ("25+ años de trayectoria…"). Resto de páginas: 1 h1 cada una.
- Métricas de los 4 títulos idénticas antes/después en ambos estados del ciclo
  (x/y/w/h, margin, font-size 44px, line-height 55px, weight 600, Fraunces):
  **0 píxeles de diferencia en la zona del hero (y0–700)**; solo varía la banda
  y>700 entre ejecuciones (banner de cookies/WhatsApp, ruido ambiental — ocurre
  también entre dos ejecuciones con el mismo código).
- Ciclo intacto: active 0 → 2 con el mismo timing (3200ms/slide); capturas
  antes/después del estado intermedio fueron byte-idénticas (MD5 igual).
- `npm run build` OK (16 páginas, astro check 0 errores).
- Capturas: `_qa-h1-inicio.png` (slide 1) y `_qa-h1-ciclo.png` (slide 3 activo)
  en la raíz — temporales, sin commitear (el preview de imágenes del entorno
  estaba sirviendo caché vieja; abrir los archivos directamente). Sin git.

## 6.13 Un solo `<main>` por página — `<main>` anidados eliminados (29-sep-2026)

**Problema:** `BaseLayout.astro:135` ya define `<main class="site-main">`, pero 10
páginas declaraban un **segundo** `<main>` anidado dentro (HTML inválido:
`<main>` dentro de `<main>`) → `grep -o "<main" | wc -l` = **2** en 10 archivos
de `dist`.

**Fix (solo el nombre de la etiqueta de apertura y el cierre; clases, IDs,
atributos y contenido intactos):**
- `<section>` donde el bloque es un listado temático sin envoltorio semántico
  propio: `pillar-main` (áreas de práctica), `blog-main`, `faq-main`.
- `<div>` donde es un shell de layout que ya envuelve `<article>`/`<form>`/`<aside>`:
  `article-main` (blog/[...slug]), `contacto-main`, `about-main`, `area-main`.
- **Desviación reportada:** 4 de las 10 páginas listadas (fianzas-y-caucion,
  impugnacion-de-rechazos, seguros-de-personas, seguros-generales) **no tienen
  `<main>` propio**: lo heredan de `src/layouts/AreaLayout.astro:123`
  (`<main class="area-main">`). Por eso el fix tocó 6 páginas + AreaLayout.astro
  (layout, no página). `BaseLayout.astro` NO se tocó. También se verificó que
  ningún CSS seleccione elementos `main`/`section`/`div` ni haya
  `querySelector('main')` en JS — el cambio de tag es visualmente neutro.

**Verificación:**
- `npm run build` OK (16 páginas, `astro check` 0 errores).
- Loop sobre `dist/` (los 10 archivos de la lista): **11/11 con exactamente `1`**
  `<main>` (TOTAL=11).
- QA visual determinista (CDP headless, `prefers-reduced-motion: reduce`, banner
  de cookies pre-oculto): 4 páginas (contacto, preguntas-frecuentes, áreas,
  fianzas) capturadas antes/después — dimensiones idénticas (1264x2230,
  1264x2008, 1264x2097, 1264x2063) y diff de píxeles **0** en áreas y fianzas;
  46 bytes de 8.4M (0.0005%, ruido de antialias) en contacto y FAQ.
- Capturas en `%TEMP%\opencode\main-before\` y `%TEMP%\opencode\main-after\`
  (temporales, sin commitear). Sin git.
