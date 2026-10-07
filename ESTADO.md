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
- [ ] **Contenido de las 4 áreas de práctica (H-001, P0 — SIN RESOLVER):** solo
  `impugnacion-de-rechazos.md` tiene cuerpo completo (2 secciones + ruta crítica de 4
  fases). `fianzas-y-caucion.md`, `seguros-de-personas.md` y `seguros-generales.md`
  tienen **UNA sola oración** de cuerpo + comentario `TODO` pidiendo expandir
  (verificado en el código el 06-oct-2026; editados por Decap el 01-oct-2026 pero
  siguen sin redacción técnica-legal).
- [x] Decap CMS config (`public/admin/config.yml`)
- [x] `BaseLayout.astro` con SEO, Open Graph, Twitter Cards, Schema.org (LegalService + Person + WebSite)
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
- [x] Favicon (`public/favicon.ico` — el `favicon.svg` que se declaraba aquí nunca existió; ver 6.4)
- [x] Dependencias instaladas (`node_modules`)
- [x] `blog/index.astro` y `blog/[...slug].astro` con tipografía editorial y schema SEO
- [x] `public/admin/` — Decap CMS con OAuth embebido en el Worker (`src/worker/index.js`)
- [x] `Toast.astro` — notificaciones flotantes globales (formulario de contacto y futuras)
- [x] Optimización de imágenes: `image()` en schema blog, `<Image>` en páginas, `getImage()` para skyline
- [x] Compilación probada con `npm run build` sin errores
- [x] `SocialIcons.astro` — íconos de redes sociales en footer (Facebook, Instagram, TikTok, LinkedIn), paleta de marca (`ink-400` → `terracotta-600` en hover), gestionable desde Decap CMS (`settings/general.json` → `redes_sociales`). Pendiente: cliente debe cargar los links reales desde el panel.
- [x] `CookieBanner.astro` en todas las páginas + Google Analytics (`G-KH9TYCX64Y`) cargado **solo** tras consentimiento — ver 6.17.
- [x] Dirección de la oficina centralizada en `src/data/oficina.ts` (fuente única `general.json`) — ver 6.9.
- [x] Políticas legales (`/aviso-legal/`, `/politica-privacidad/`) actualizadas el 28-sep-2026, **sin comentarios TODO** — ver 6.17.
- [x] JSON-LD completo: `WebSite`, `OfferCatalog` con URLs reales, `BlogPosting` con `dateModified` — ver 6.16.
- [x] Contraste WCAG AA corregido en tokens (05-oct-2026), fuentes autoalojadas con Fontsource (06-oct-2026) y menú móvil con scroll propio/cierre automático (06-oct-2026) — ver 6.18.
- [x] Sitemap con `<lastmod>` real por página, resuelto **sin git en tiempo de build** (06-oct-2026) — ver 6.19.
- [x] Cabeceras de seguridad HTTP básicas (H-011): HSTS, `X-Content-Type-Options`,
  `X-Frame-Options` y `Referrer-Policy` en **todas** las respuestas del Worker
  (07-oct-2026; CSP queda fuera de alcance) — ver 6.21.

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
   estaba cargado en Google Fonts (verificado en BaseLayout.astro). *Actualización
   oct-2026: Google Fonts ya no se usa — las fuentes son autoalojadas con Fontsource,
   ver 6.18.*

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
   **Corrección 06-oct-2026 (auditoría H-027):** eso era correcto para esa sesión,
   pero **ya no aplica** — tras la reescritura del 28-sep-2026 (`2545678`),
   `/politica-privacidad/` **no** incluye el domicilio ni sección "Responsable del
   sitio"; solo dice "con domicilio en el Estado Plurinacional de Bolivia", y no
   importa `src/data/oficina.ts`. Quien sí lo importa: `contacto.astro`,
   `Footer.astro`, `aviso-legal.astro` y `BaseLayout.astro` (JSON-LD).

**Checklist:** dirección sale de un solo archivo (grep `Ballivián` en src/ → solo
general.json); build 0 errores/0 warnings (2 hints preexistentes); JSON-LD parsea
como JSON válido en home y contacto; strings idénticos entre contacto/footer/schema/
legales (derivan del mismo JSON); footer con label "Oficina" vs "Cobertura" para
no contradecir la cobertura nacional; form/toast/WhatsAppFloat/worker sin tocar.
Páginas legales: existen y tienen contenido real pero siguen marcadas con TODO
("validar con el abogado el texto legal completo") — se les sumó el domicilio sin
reescribirlas. **Corrección 06-oct-2026:** los TODO ya no existen (la reescritura
del 28-sep-2026 los eliminó; grep → 0 resultados). Sin git.

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

## 6.14 Decap CMS: preview con tokens.css — fix del 404 en producción (29-sep-2026)

**Problema:** `public/admin/index.html:14` llamaba a
`window.CMS.registerPreviewStyle('/src/styles/tokens.css')`. `src/` no se copia a
`dist/` (verificado: no existe `dist/src/styles/tokens.css` y un server estático
sobre `dist/` responde **404** en esa ruta) → en producción el CSS nunca llegaba y
el preview del editor se veía sin estilos. En `astro dev` sí funcionaba (Vite sirve
`/src/...`), por eso nunca se había visto roto en local.

**Fix (sincronización automática, sin copias manuales):**
- `package.json`: nuevo script `"prebuild": "node scripts/copy-cms-preview-styles.mjs"`
  (npm lo ejecuta solo antes de `build`). No se tocó ningún otro script
  (`build`, `dev`, `deploy`, `preview` intactos).
- `scripts/copy-cms-preview-styles.mjs` (nuevo, cero dependencias): `fs.copyFileSync`
  de `src/styles/tokens.css` → `public/admin/tokens.css` (copia byte a byte).
- `public/admin/index.html:14` → `registerPreviewStyle('/admin/tokens.css')`.
- Sin cambios en `src/styles/tokens.css`, `config.yml` ni en el resto de `index.html`.

**Verificación:**
- `npm run build` ejecuta el prebuild (log `> prebuild` +
  `[copy-cms-preview-styles] ... -> public/admin/tokens.css (5644 bytes)`); probado
  borrando antes el archivo: se regenera solo. `dist/admin/tokens.css` existe con
  MD5 `07591A12FA8865342D320DF61F550E20` = idéntico al origen (build 16 páginas OK).
- Server estático sobre `dist/` (condiciones de producción): `/admin/tokens.css` =
  **200**, ruta vieja `/src/styles/tokens.css` = **404**, `/admin/` = 200.
- Panel Decap en local (CDP headless): sesión vía `local_backend` (config.yml
  interceptado en memoria — el archivo NO se tocó) + `npx decap-server` en :8081.
  Con el artículo `ejemplo-post` abierto y su preview visible: red
  `GET /admin/tokens.css` = **200 text/css**; el iframe de preview carga
  `<link href="/admin/tokens.css">` y `--color-navy-950 = #0F1B3D`; un `span.eyebrow`
  (clase que solo define tokens.css) computa `color: rgb(181, 98, 44)` terracota +
  `IBM Plex Mono` + `uppercase`, mientras en el documento principal (sin el CSS)
  computa `rgb(121, 130, 145)` → control negativo. Capturas en
  `%TEMP%\opencode\decap-final2\` (01-panel-login, 02-panel-colecciones,
  03-editor-con-preview, 04-preview-con-tokens con la etiqueta terracota visible).

**Decisión `.gitignore` (reportada, NO aplicada):** NO agregar todavía
`public/admin/tokens.css`. Motivo: `npm run deploy` es `astro build && wrangler deploy`
y npm solo dispara `prebuild` antes de `npm run build` (no antes de `deploy` ni de
`dev`); con el archivo ignorado y sin commitear, un deploy desde un clone limpio
dejaría `dist/admin/tokens.css` ausente → volvería el 404. Alternativa pendiente de
aprobación: ignorarlo Y añadir `predeploy`/`predev` con el mismo script (eso sí
modifica scripts, prohibido en esta tarea). `wrangler.jsonc` no se tocó.
Archivos sin commitear: `package.json` y `public/admin/index.html` (M) +
`scripts/copy-cms-preview-styles.mjs` y `public/admin/tokens.css` (??). Sin git.

## 6.15 Consentimiento de Política de Privacidad propagado hasta el Sheet (01-oct-2026)

**Problema:** el checkbox `consentimiento` existía en el HTML (`contacto.astro:105`,
`required`, el navegador ya bloqueaba el envío sin marcarlo) pero el campo NO viajaba
en el `payload` del formulario ni en el reenvío del Worker a Google Apps Script → las
2 columnas nuevas del Sheet ("Consentimiento Aceptado" y "Versión Política
Privacidad", ya agregadas por Wilson en el Apps Script) quedaban siempre vacías.

**Cambios (3):**
- `src/pages/contacto.astro` — en el `payload` de `handleSubmit` (~línea 881):
  `consentimiento: (form.elements.namedItem('consentimiento') as HTMLInputElement)?.checked ?? false`.
  Checkbox HTML, `required` y demás campos intactos.
- `src/worker/index.js` — en `handleContacto`: (a) revalidación server-side suma
  `data.consentimiento !== true` → 400 `"Faltan campos obligatorios"` (bloquea un
  POST directo a `/api/contacto` sin consentimiento, saltándose el checkbox); (b) el
  `body` reenviado a `env.APPS_SCRIPT_URL` incluye
  `consentimiento: data.consentimiento === true`.
- `src/pages/contacto.astro` — solo el bloque de comentario de referencia del Apps
  Script (~líneas 616-681) actualizado al código REAL desplegado: headers con
  `'Consentimiento Aceptado'` y `'Versión Política Privacidad'`, constante
  `VERSION_POLITICA_PRIVACIDAD = '2026-09-28'` y `appendRow` con
  `data.consentimiento === true ? 'Sí' : 'No'` + la versión. Verificado línea a
  línea: las 42 líneas del bloque son idénticas al Código.gs que Wilson tiene en
  producción (diff 0). Solo documentación, no afecta comportamiento.
- NO se tocaron: `handleAuth`, `handleCallback`, otras funciones del Worker,
  `wrangler.jsonc`, secrets/variables, `.dev.vars` ni el diseño de la página.

**Verificación local (`npm run build` OK: `astro check` + 16 páginas; luego
`npx wrangler dev --port 8787`):** para no ensuciar el Sheet real se usó
`--var APPS_SCRIPT_URL=http://127.0.0.1:8788/exec` (flag CLI con precedencia sobre
`.dev.vars`) apuntando a un mock de Apps Script que imprime el body recibido.
- Positiva (formulario real en `/contacto/` vía Chrome headless CDP): campos
  llenados + checkbox marcado + enviar → toast "Consulta enviada correctamente",
  `POST /api/contacto` = **200** `{"ok":true}` y el mock registró
  `"consentimiento": true`. Capturas en `%TEMP%\opencode\consent-form\`
  (01-formulario-vacio, 02-formulario-llenado-con-check, 03-tras-envio).
- Negativa (curl directo al Worker): payload sin el campo `consentimiento` →
  **400** `{"ok":false,"error":"Faltan campos obligatorios"}`; con
  `"consentimiento": false` → **400** idéntico.
- Log de wrangler: `POST /api/contacto 200 OK` (positiva) y `400 Bad Request`
  (negativas), coherente con lo anterior.

**Nota:** el Apps Script (Google) se sigue editando a mano fuera del repo; aquí solo
se documentó su copia de referencia. Archivos sin commitear: `src/pages/contacto.astro`
y `src/worker/index.js` (M). Sin git.

## 6.16 JSON-LD completo — WebSite, logo, BlogPosting y OfferCatalog (05-oct-2026)

**Cambios (solo dentro de objetos JSON-LD, invisible al usuario):**
- `src/layouts/BaseLayout.astro`:
  - **A)** Nuevo nodo `WebSite` en el `@graph` (junto a LegalService y Person, afecta a
    TODAS las páginas): `@id …/#website`, `name`, `url`, `inLanguage: 'es-BO'`,
    `publisher → #organization`.
  - **B)** `LegalService.logo`: `/favicon.ico` → `/logo-schema.png`.
  - **C)** `hasOfferCatalog`: cada `Service` ahora incluye `url` real
    (`/areas-de-practica/{slug}/`). Los 4 slugs verificados 1:1 contra los archivos
    reales de `src/pages/areas-de-practica/` antes de aplicar.
- `src/pages/blog/[...slug].astro`:
  - **D)** `articleSchema` completado: `dateModified` (igual a `fechaPublicacion`,
    sin campos nuevos en config.ts ni frontmatter), `image`
    (`${siteUrl}${imagenPortada.src}` con fallback a `/og-default.png`) y
    `publisher.logo` (`ImageObject` → `/logo-schema.png`).
- Nuevo `src/data/site.ts` con `export const siteUrl` (antes era un string local en
  BaseLayout): BaseLayout y `[...slug].astro` lo importan — sin duplicar el literal.
- NO se tocaron: config.ts, frontmatter, logo visual del header/footer, FAQPage,
  BreadcrumbList, otros nodos, `blog/index.astro` ni ningún diseño.

**Verificación:**
- `npm run build` EXIT=0 (`astro check` + 16 páginas).
- JSON-LD extraído de `dist/` ANTES y DESPUÉS (home, fianzas-y-caucion,
  ejemplo-post): `JSON.parse` OK en los 6, todos los `@type` son de schema.org, y los
  nodos ajenos a la tarea (Person, BreadcrumbList) quedaron byte-idénticos.
- HTTP 200 en local (server estático sobre dist/:8095): las 4 URLs del OfferCatalog +
  `/logo-schema.png` (recién copiado a dist por este build) + `image` del post
  (`/_astro/66116.DpTI_PdM.jpg`).
- Rich Results Test (`search.google.com/test/rich-results`, modo CÓDIGO, automatizado
  por CDP): el código cargó bien (3366 chars) y se pulsó "PROBAR CÓDIGO", pero
  **reCAPTCHA bloquea el envío automatizado** (`CONSOLE.error: "Los parámetros de la
  API no son válidos"`), y el modo URL solo analizaría la página YA publicada (con el
  JSON-LD viejo). Se valida en local en su lugar: sintaxis + tipos + campos
  concretos OK (WebSite completo, 4 URLs en Services, dateModified ISO8601, image
  absoluta, publisher.logo ImageObject). **Pendiente: re-validar en la herramienta
  tras desplegar.**
- Visual: captura de `.article-cover` en `/blog/ejemplo-post/` antes/después con MD5
  idéntico (`74939B48BEFE4B37933C13DBF1EF18B4`); métricas idénticas (natural
  832×605, render 832×448, `object-fit: contain`, filtro duotone-navy). Único cambio
  detectado: `jsonLdHasImage` false→true (invisible).
- EOLs intactos: `.astro` en CRLF, `site.ts` en LF, sin BOM.

**Archivos sin commitear:** `src/layouts/BaseLayout.astro` (M),
`src/pages/blog/[...slug].astro` (M), `src/data/site.ts` (??). En el working tree hay
además cambios del usuario ajenos a esta tarea: `public/logo-schema.png` (??) y
`public/images/lapaz-skyline.jpg` (D). Sin git.

## 6.17 Banner de cookies + Google Analytics y legales actualizadas (22/28-sep-2026)

- **Google Analytics (22-sep-2026, `b1d1c7a`):** ID de medición `G-KH9TYCX64Y`,
  definido **solo** en `src/components/CookieBanner.astro`. No existe snippet gtag en
  el `<head>`: BaseLayout solo lleva un comentario que apunta al componente.
- **Banner de cookies (28-sep-2026, `0360161`):** `CookieBanner.astro` renderizado en
  `BaseLayout` (todas las páginas, incl. 404). Consentimiento en `localStorage`
  (`dla-cookie-consent`, 12 meses de vigencia). "Aceptar" → `loadAnalytics()` inyecta
  el script de gtag; "Rechazar" → `ga-disable-<ID>` + borra cookies `_ga`, `_ga_*`,
  `_gid`. Footer con botón `data-cookie-settings` ("Configuración de cookies") para
  reabrirlo; variable CSS `--cookie-banner-height` para subir los elementos fijos
  (WhatsAppFloat). Rechazar y Aceptar con el mismo tamaño/peso (regla de privacidad:
  rechazar debe ser tan fácil como aceptar).
- **Políticas legales (28-sep-2026, `2545678`):** `/aviso-legal/` y
  `/politica-privacidad/` actualizados. El domicilio real (vía `oficina.ts`) está en
  **`/aviso-legal/`**; `/politica-privacidad/` no lo repite — solo declara "domicilio
  en el Estado Plurinacional de Bolivia" y no importa `oficina.ts`. Grep de `TODO`
  sobre ambos archivos → **0 resultados** (ya no están "pendientes de validación"
  como decía la documentación vieja). Versión que viaja al Sheet:
  `VERSION_POLITICA_PRIVACIDAD = '2026-09-28'` en `contacto.astro`.
- La centralización de la dirección en `src/data/oficina.ts` es de esta misma corrida
  (ver 6.9).

## 6.18 Contraste WCAG AA, fuentes Fontsource y menú móvil (05–06 oct 2026)

- **Contraste (05-oct-2026, `d6988cf`, 14 archivos):** `--color-ink-400` `#6B7A90` →
  `#5F6E84` (≈5.18:1 sobre blanco), `--color-terracotta-600` `#B5622C` → `#A85A28`, y
  textos claros del footer sobre navy subidos de alpha 0.35–0.45 a **0.55**. Tocó
  `tokens.css`, `tailwind.config.mjs` y 10 componentes/páginas;
  `public/admin/tokens.css` es la copia que regenera el `prebuild` (sin edición
  manual).
- **Fuentes autoalojadas (06-oct-2026, `26fcaa9`, H-023):**
  `@fontsource-variable/fraunces/opsz.css` + `@fontsource/inter` 400/500/600 +
  `@fontsource/ibm-plex-mono` 400/500 importados en el frontmatter de `BaseLayout`;
  el `<link>` de Google Fonts salió del `<head>`. `tokens.css` y `tailwind.config.mjs`
  usan `'Fraunces Variable'`. QA: 0 peticiones a `fonts.googleapis.com`/`fonts.gstatic.com`,
  34 `.woff2` en `dist/_astro/` con `font-display: swap`, familias reales confirmadas
  por CDP.
- **Menú móvil (06-oct-2026, `64cf626`, `Header.astro` +30 líneas):** menú con
  `max-height: calc(100vh - var(--header-height))` + `overflow-y: auto` (scroll propio),
  red de seguridad `@media (min-width: 769px) { .mobile-nav { display: none !important; } }`,
  y cierre automático al cruzar el breakpoint (`matchMedia`) o al navegar desde un link
  del menú.

## 6.19 Sitemap con `<lastmod>` real, sin git en el build (06-oct-2026)

Dos commits: `1aec8b3` (lastmod por página vía `serialize`) y `29db6df` (sin git en
build de Cloudflare).

- **Páginas estáticas (14 rutas):** fechas `%cI` de `git log -1` versionadas en
  `src/data/lastmod-static.json`, generadas **localmente** con
  `node scripts/generate-lastmod.mjs`.
- **Colecciones (blog):** **SOLO frontmatter** (`fechaPublicacion`) — se quitó el
  `max(frontmatter, git)` porque git no existe en el build de Cloudflare; si un post se
  edita después, agregar `fechaActualizacion` al frontmatter (Decap puede editarlo).
- **Piezas:** tabla compartida `src/data/page-sources.mjs` (config + script),
  `src/utils/lastmod.ts` (lee JSON/frontmatter, try/catch por página, fallback a fecha
  de build + `console.warn`), `serialize` en `astro.config.mjs` con try/catch por URL.
- **Regla operativa:** editar/agregar una página estática listada en `page-sources.mjs`
  → correr el script y commitear el JSON junto con el cambio (documentado en
  `astro.config.mjs`, en el propio módulo y en `docs/DOCUMENTACION_TECNICA.md` §17).
- **Verificación:** `npm run build` EXIT=0 con `.git` renombrado Y sin `git` en el PATH;
  15 URLs con `<lastmod>` (6 fechas distintas, ninguna = fecha de build);
  `/blog/ejemplo-post/` = `2026-08-12` (frontmatter). `@astrojs/sitemap` sigue pineado
  en `3.6.0` (ver 4.7).

## 6.20 Documentación técnica re-auditada (H-027, 06-oct-2026)

`docs/DOCUMENTACION_TECNICA.md` (última actualización antes: 20-ago-2026) actualizada
contra el código real: nuevas secciones 14–19 (cookies+GA, oficina.ts, legales,
sitemap lastmod, Fontsource, contraste/menú), árbol de carpetas e inventario de
componentes corregidos, y eliminadas las filas falsas de deuda técnica ("cookie notice
pendiente", "Google Fonts media warning", "aviso legal con TODO"). En esta misma tarea:
sección 3 de ESTADO.md corregida (H-001: 3 de 4 áreas siguen con una oración),
correcciones de 6.9 (politica-privacidad no incluye domicilio) y del favicon de la
sección 3, y comentario de repo en `astro.config.mjs` corregido a `sitiosbo/dla-castro`.

## 6.21 Cabeceras de seguridad HTTP básicas (H-011, 07-oct-2026)

Tarea de auditoría H-011 (P2): el sitio no enviaba **ningún** header de seguridad
HTTP. Implementado solo en `src/worker/index.js` (sin tocar el Dashboard de
Cloudflare), cubriendo **todas** las respuestas —estáticas vía `env.ASSETS.fetch()`
y las del Worker (`/api/auth`, `/api/callback`, `/api/contacto`)— mediante
`withSecurityHeaders()`, que clona la respuesta (`new Response(response.body, response)`)
y hace `headers.set(...)` **sin modificar el body**:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — **sin `preload`**
  a propósito: es difícil de revertir una vez que el navegador lo cachea.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

- **CSP fuera de alcance a propósito** (así lo define H-011): el panel Decap carga
  scripts desde `unpkg.com` y GA desde `googletagmanager.com`; una CSP mal calibrada
  rompería `/admin/`. Queda como tarea aparte (riesgo registrado en
  `docs/DOCUMENTACION_TECNICA.md` §9.2).
- **Verificación (07-oct-2026, `wrangler dev` local):** `npm run build` EXIT=0;
  `curl -sI` con los 4 headers en `/`, `/admin/`, `/contacto/`, `/admin/config.yml`,
  respuesta 404, `GET /api/auth` (301) y `GET /api/callback`; bodies de `/`,
  `/admin/` y `/contacto/` **idénticos byte a byte** al build; `POST /api/contacto`
  end-to-end → 200 `{"ok":true}` y 400 sin `consentimiento` (flujo intacto).
- **X-Frame-Options sin efectos adversos:** el sitio no se embebe en iframes propios
  ni de terceros. Si en producción aparece algún iframe embebido, **reportarlo** antes
  de retirar la cabecera (no se quitó silenciosamente).
