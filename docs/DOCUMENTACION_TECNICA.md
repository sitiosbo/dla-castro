# Documentación Técnica — DLA (Defensa Legal del Asegurado)

> **Última actualización:** 7 de octubre de 2026
> **Repositorio:** `sitiosbo/dla-castro` (GitHub)
> **Sitio en producción:** `https://defensalegaldelasegurado.com`

---

## 1. Resumen Ejecutivo

DLA (Defensa Legal del Asegurado) es un sitio web **100% estático** para un estudio jurídico especializado en Derecho de Seguros en Bolivia, liderado por el Ramiro Guillermo Castro. El sitio combina un motor de generación estática (Astro 4) con un CMS decap Headless (Decap CMS) para que el abogado pueda editar contenido sin tocar código, y se despliega en Cloudflare Workers con Static Assets.

**Stack en una frase:** Astro 4 (SSG) + Tailwind CSS + Decap CMS, desplegado en Cloudflare Workers con Static Assets, con un Worker proxy para el formulario de contacto.

---

## 2. Arquitectura General

### 2.1 Flujo del sitio

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VISITANTE                                    │
│  Navegador → https://defensalegaldelasegurado.com                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  CLOUDFLARE WORKERS (Static Assets + Worker script)                 │
│                                                                      │
│  1. Request estática → ASSETS.fetch() → archivos de dist/           │
│  2. POST /api/contacto → handleContacto() → proxy a Apps Script     │
│  3. GET /api/auth → OAuth de Decap CMS → GitHub                     │
│  4. GET /api/callback → Callback OAuth → GitHub                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
┌──────────────────────────┐    ┌──────────────────────────────────────┐
│  ARCHIVOS ESTÁTICOS     │    │  GOOGLE APPS SCRIPT                  │
│  ( Astro build → dist/ ) │    │  Recibe POST → escribe en Google     │
│  HTML, CSS, JS, WebP     │    │  Sheet con headers self-healing      │
└──────────────────────────┘    └──────────────────────────────────────┘
```

### 2.2 Justificación del stack

| Componente             | Decisión                      | Razón                                                                                                                                                                          |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Astro 4**            | SSG (Static Site Generation)  | Contenido mayormente estático (páginas legales, servicios, blog). Rendimiento óptimo: 0 JS por defecto, HTML puro. Astro optimiza imágenes a WebP automáticamente.             |
| **Cloudflare Workers** | Static Assets + Worker script | Hosting global con CDN. El Worker resuelve dos problemas: (1) sirve archivos estáticos y (2) actúa como proxy del formulario para ocultar la URL de Apps Script y evitar CORS. |
| **Decap CMS**          | CMS decap Headless            | Permite al abogado editar contenido (blog, servicios, estadísticas) directamente desde el navegador, sin saber programar. Commitea directo a GitHub.                           |
| **Tailwind CSS**       | Utility-first CSS             | Consistencia visual, tokens de diseño centralizados, responsive sin CSS custom extensivo.                                                                                      |
| **Google Apps Script** | Backend del formulario        | Gratuito, sin servidor propio. Recibe datos del formulario y los escribe en Google Sheet.                                                                                      |

---

## 3. Estructura de Carpetas

```
dla-seguros/                          # Carpeta local del clon (el repo es sitiosbo/dla-castro)
├── public/                          # Archivos estáticos sin procesar
│   ├── admin/                       # Decap CMS
│   │   ├── config.yml               # Configuración del CMS
│   │   ├── index.html               # Panel de administración
│   │   ├── logo.png                 # Logo del panel (logo_url)
│   │   └── tokens.css               # Copia de tokens.css para previews (la genera el prebuild)
│   ├── favicon.ico                  # Favicon DLA (ICO)
│   ├── images/                      # Imágenes subidas por Decap CMS
│   ├── logo-schema.png              # Logo para JSON-LD (schema.org)
│   ├── og-default.png               # Imagen Open Graph 1200×630 (generada)
│   ├── robots.txt                   # Reglas para crawlers
│   └── llms.txt                     # Archivo para Large Language Models
├── docs/
│   ├── AUDITORIA-SITIO.md           # Auditoría del sitio (hallazgos H-001 …)
│   └── DOCUMENTACION_TECNICA.md     # Este documento
├── scripts/
│   ├── copy-cms-preview-styles.mjs  # prebuild: copia tokens.css a public/admin/
│   ├── generate-og-image.mjs        # Regenera public/og-default.png (sharp)
│   └── generate-lastmod.mjs         # Regenera src/data/lastmod-static.json (correr localmente)
├── src/
│   ├── assets/                      # Imágenes optimizadas por Astro
│   │   ├── images/
│   │   │   ├── home/                # Imágenes de la página principal
│   │   │   └── proceso/             # Imágenes de la página de proceso
│   │   └── lapaz-skyline.jpg        # Skyline para sección de liderazgo
│   ├── components/                  # Componentes Astro reutilizables
│   │   ├── Header.astro             # Navegación principal (sticky, menú móvil)
│   │   ├── Footer.astro             # Pie de página (incluye "Configuración de cookies")
│   │   ├── CookieBanner.astro       # Banner de consentimiento + carga de Google Analytics
│   │   ├── Hero.astro               # Hero principal con carrusel de slides
│   │   ├── PageHero.astro           # Hero reutilizable de páginas interiores
│   │   ├── TrustBar.astro           # Barra de confianza (estadísticas)
│   │   ├── Timeline.astro           # Línea de tiempo del reclamo (elemento de firma)
│   │   ├── StatBar.astro            # Barra de estadísticas con count-up
│   │   ├── ServiceTable.astro       # Tabla de portafolio por tipo de cliente
│   │   ├── FramedImage.astro        # Imagen enmarcada con fondo crema
│   │   ├── SocialIcons.astro        # Íconos de redes sociales (gestionables desde Decap)
│   │   ├── WhatsAppFloat.astro      # Botón flotante de WhatsApp
│   │   └── Toast.astro              # Sistema de notificaciones flotantes
│   ├── content/                     # Content Collections (Astro)
│   │   ├── config.ts                # Schema de todas las colecciones
│   │   ├── servicios/               # 4 áreas de práctica (markdown)
│   │   ├── blog/                    # Posts del blog normativo
│   │   ├── testimonios/             # Testimonios anonimizados
│   │   ├── casos/                   # Casos de éxito anonimizados
│   │   └── settings/                # Configuración singleton (JSON)
│   │       └── general.json         # Estadísticas, WhatsApp, email y dirección
│   ├── data/                        # Datos estáticos
│   │   ├── hero-slides.ts           # Definición de slides del Hero
│   │   ├── hero-variantes.ts        # Variantes del Hero
│   │   ├── site.ts                  # siteUrl canónico (única fuente del dominio)
│   │   ├── oficina.ts               # Derivaciones de la dirección (fuente: general.json)
│   │   ├── page-sources.mjs         # Mapa ruta→archivo del sitemap (lastmod)
│   │   └── lastmod-static.json      # Fechas de páginas estáticas (generado por script)
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Layout base (HTML, meta, schema.org, CookieBanner)
│   │   └── AreaLayout.astro         # Layout de /areas-de-practica/* (sidebar sticky)
│   ├── pages/                       # Rutas del sitio
│   │   ├── index.astro              # Home (12 secciones)
│   │   ├── 404.astro                # Página 404 personalizada (noindex)
│   │   ├── proceso.astro            # Proceso y Estrategia Jurídica
│   │   ├── resultados.astro         # Casos de éxito
│   │   ├── sobre-mi.astro           # Sobre el abogado
│   │   ├── contacto.astro           # Formulario de contacto
│   │   ├── blog/                    # Blog (index + [slug])
│   │   ├── areas-de-practica/       # 4 áreas + pillar page
│   │   ├── preguntas-frecuentes.astro
│   │   ├── politica-privacidad.astro
│   │   └── aviso-legal.astro
│   ├── styles/
│   │   └── tokens.css               # Fuente de verdad de tokens visuales
│   ├── utils/
│   │   └── lastmod.ts               # Resolución de <lastmod> (JSON estático / frontmatter)
│   └── worker/
│       └── index.js                 # Cloudflare Worker (proxy + OAuth)
├── .dev.vars                        # Variables de entorno local (secrets)
├── .env                             # Variables de entorno públicas
├── .env.example                     # Plantilla de variables de entorno
├── astro.config.mjs                 # Configuración de Astro (incluye serialize del sitemap)
├── tailwind.config.mjs              # Configuración de Tailwind (deriva de tokens.css)
├── wrangler.jsonc                   # Configuración de Cloudflare Workers
├── tsconfig.json                    # Configuración de TypeScript
├── package.json                     # Dependencias y scripts
├── ESTADO.md                        # Estado del proyecto (memoria del agente)
└── ARQUITECTURA_SITIO_RAMIRO_CASTRO.md  # Arquitectura de diseño
```

---

## 4. Inventario de Componentes

| Componente            | Propósito                                                                                                                                     | Dependencias                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `BaseLayout.astro`    | Layout base: HTML, meta tags, schema.org (LegalService + Person + WebSite), fuentes autoalojadas (Fontsource), Open Graph, Twitter Cards. Envuelve todas las páginas e incluye `CookieBanner`. | `Header`, `Footer`, `WhatsAppFloat`, `Toast`, `CookieBanner`, `tokens.css` |
| `Header.astro`        | Navegación principal sticky (position: fixed). Wordmark "DLA" dominante. Menú responsive con hamburger (scroll propio en mobile, cierre automático al redimensionar). CTA "Agenda tu evaluación legal". | —                                                          |
| `CookieBanner.astro`  | Banner de consentimiento de cookies (rol `dialog`, botones Aceptar/Rechazar del mismo peso). Carga Google Analytics **solo** tras "Aceptar"; persiste la decisión 12 meses en `localStorage`. Ver sección 14. | — (script propio)                                          |
| `Footer.astro`        | Pie de página con datos de contacto (derivados de `oficina.ts`), links legales, botón "Configuración de cookies" (`data-cookie-settings`), copyright.                                                                                | `oficina.ts`, `SocialIcons`                                |
| `Hero.astro`          | Hero principal con carrusel de 4 slides (una imagen cada ~3.2s). Duotono navy/crema via SVG filter. Animación stagger de elementos. Solo el slide 1 usa `<h1>` (único h1 por página). | `hero-slides.ts`, `astro:assets`                           |
| `TrustBar.astro`      | Barra de confianza con 4 estadísticas animadas (count-up). Lee datos de `settings/general.json`.                                              | `settings/general.json`                                    |
| `Timeline.astro`      | Línea de tiempo del "Ruta Crítica del Reclamo" (4 fases). Elemento de firma del sitio. Animación orquestada (`--motion-duration-orquestado`). | —                                                          |
| `StatBar.astro`       | Barra de estadísticas alternada (navy background). Count-up animado.                                                                          | `settings/general.json`                                    |
| `ServiceTable.astro`  | Tabla de portafolio por tipo de cliente. Scroll horizontal en mobile.                                                                         | `content/servicios`                                        |
| `FramedImage.astro`   | Imagen enmarcada con fondo crema (`--image-frame-bg`), bordes redondeados, sombra. Reutilizable.                                              | `astro:assets`                                             |
| `PageHero.astro`      | Hero reutilizable de páginas interiores (proceso, resultados, FAQ, legales…).                                                                | `tokens.css`                                                |
| `SocialIcons.astro`   | Íconos de redes sociales del footer (Facebook, Instagram, TikTok, LinkedIn). El cliente aún no cargó los enlaces reales: apuntan a portadas genéricas (hallazgo H-021). | `settings/general.json`                           |
| `WhatsAppFloat.astro` | Botón flotante de WhatsApp con mensajes contextuales por sección.                                                                             | `settings/general.json`                                    |
| `Toast.astro`         | Sistema de notificaciones flotantes para el formulario de contacto. Soporte para success/error, auto-close, pausa en hover.                   | —                                                          |

---

## 5. Gestión de Contenido (Decap CMS)

### 5.1 Configuración

- **Archivo:** `public/admin/config.yml`
- **Backend:** GitHub (`sitiosbo/dla-castro`, branch `main`)
- **OAuth:** Embebido en el Worker (`/api/auth` y `/api/callback` en `src/worker/index.js`)
- **URL del CMS:** `https://defensalegaldelasegurado.com/admin/`

### 5.2 Colecciones

| Colección                 | Carpeta                             | Editable                    | Tipos de archivo |
| ------------------------- | ----------------------------------- | --------------------------- | ---------------- |
| **Áreas de Práctica**     | `src/content/servicios/`            | Solo edición (4 existentes) | `.md`            |
| **Blog**                  | `src/content/blog/`                 | Creación y edición          | `.md` + imágenes |
| **Testimonios**           | `src/content/testimonios/`          | Creación y edición          | `.md`            |
| **Casos de Éxito**        | `src/content/casos/`                | Creación y edición          | `.md`            |
| **Configuración General** | `src/content/settings/general.json` | Edición (stats + contacto)  | `.json`          |

> **Estado real del contenido (oct-2026, hallazgo H-001 sin resolver):** de las 4 áreas de práctica, solo `impugnacion-de-rechazos.md` tiene cuerpo completo (2 secciones + ruta crítica de 4 fases). `fianzas-y-caucion.md`, `seguros-de-personas.md` y `seguros-generales.md` tienen **una sola oración** de cuerpo y un comentario `TODO` pidiendo expandir. El CMS permite editarlas, pero todavía no hay redacción técnica-legal de esos 3 ramos.

### 5.3 Flujo de trabajo crítico

> **REGLA OPERATIVA:** Decap CMS commitea directo al repositorio de GitHub. Siempre ejecutar `git pull` antes de cualquier push manual para evitar conflictos de merge.

```
Abogado edita en /admin/ → Decap CMS crea PR o push directo a GitHub
→ Repository se actualiza → Agente hace git pull antes de su propio push
→ npm run build → wrangler deploy
```

---

## 6. Formulario de Contacto — Flujo de Datos Completo

### 6.1 Diagrama end-to-end

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. VALIDACIÓN CLIENT-SIDE (navegador)                              │
│     - Campos required: nombre, tipoCaso, telefono                   │
│     - Checkbox consentimiento (Política de Privacidad)              │
│     - Honeypot: campo "website" oculto (bots lo rellenan)          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ Submit
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. JavaScript (contacto.astro <script>)                           │
│     - Verifica honeypot (si tiene contenido → aborta)              │
│     - Construye payload JSON con: nombre, tipoCaso, aseguradora,   │
│       telefono, email, mensaje, consentimiento (boolean)           │
│     - POST a /api/contacto                                         │
│     - Muestra toast de éxito/error                                  │
│     - En éxito: form.reset() + toast auto-close 7s                  │
│     - En error: formulario preservado + toast con retry/WhatsApp    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. CLOUDFLARE WORKER (src/worker/index.js → handleContacto)       │
│     - Valida Content-Type: application/json                         │
│     - Parsea JSON                                                   │
│     - Honeypot check: si data.website → responde 200 OK (ignora)   │
│     - Valida campos obligatorios: nombre, tipoCaso, telefono       │
│     - Valida consentimiento: distinto de true → 400 (aunque el     │
│       checkbox ya lo exige en cliente: evita POST directos)        │
│     - Reenvía a APPS_SCRIPT_URL (POST, text/plain), incluyendo     │
│       consentimiento normalizado a booleano                        │
│     - Retorna 200 OK / 400 / 500 / 502 según resultado            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. GOOGLE APPS SCRIPT                                              │
│     - Recibe JSON en doPost(e)                                      │
│     - Auto-crea headers si la hoja está vacía                       │
│     - appendRow() con: Fecha, Nombre, TipoCaso, Aseguradora,       │
│       Teléfono, Email, Mensaje, Consentimiento Aceptado (Sí/No),   │
│       Versión Política Privacidad (constante 2026-09-28)           │
│     - Retorna { ok: true }                                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. GOOGLE SHEET                                                    │
│     - Fila nueva con datos del formulario                           │
│     - Headers en fila 1 (frozen, bold)                              │
│     - Acceso: solo el abogado (propietario del Sheet)               │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 ¿Por qué existe el proxy?

El formulario original enviaba directamente a la URL de Google Apps Script. Esto causaba dos problemas:

1. **CORS:** El navegador bloquea requests cross-origin a menos que el servidor destino envíe headers `Access-Control-Allow-Origin`. Google Apps Script no los envía por defecto.
2. **Seguridad:** La URL completa de Apps Script (incluyendo el ID de ejecución) quedaría expuesta en el HTML del navegador, permitiendo que cualquier persona envíe datos directamente al Sheet.

El Worker proxy resuelve ambos: actúa como intermediario same-origin, oculta la URL de Apps Script, y agrega validación server-side.

---

## 7. Variables de Entorno y Secrets

| Variable                       | Ubicación                                                | Tipo                 | Descripción                                                                                                                                                                                |
| ------------------------------ | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `APPS_SCRIPT_URL`              | `.dev.vars` (local) / `wrangler secret put` (producción) | **Secret** (privada) | URL de ejecución del Google Apps Script que recibe el formulario. Nunca debe exponerse al cliente.                                                                                         |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | `.env` / `.env.example`                                  | Pública              | URL del endpoint de Apps Script. Prefijo `PUBLIC_` indica que Astro la expone al cliente. Actualmente **no se usa en el código** (el formulario envía a `/api/contacto` via Worker proxy). |
| `GITHUB_CLIENT_ID`             | `wrangler secret put`                                    | **Secret** (privada) | Client ID de la OAuth app de GitHub para Decap CMS.                                                                                                                                        |
| `GITHUB_CLIENT_SECRET`         | `wrangler secret put`                                    | **Secret** (privada) | Client secret de la OAuth app de GitHub para Decap CMS.                                                                                                                                    |

### 7.1 Configuración de secrets

```bash
# Local (desarrollo)
# Editar .dev.vars con las URLs reales
APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_ID/exec

# Producción (Cloudflare Workers)
npx wrangler secret put APPS_SCRIPT_URL
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

---

## 8. Deploy y CI/CD

### 8.1 Proceso de deploy actual

No hay CI/CD automatizado (sin GitHub Actions). El deploy es manual:

```bash
# Build + deploy en un solo comando
npm run deploy

# O paso a paso:
npm run build          # astro check && astro build → genera dist/
wrangler deploy        # Sube dist/ a Cloudflare Workers
```

### 8.2 Rollback

Si un deploy rompe algo en producción:

```bash
# Listar deploys recientes
wrangler deployments list

# Revertir al deploy anterior
wrangler rollback <deployment-id>
```

### 8.3 Variables de entorno en producción

```bash
# Verificar secrets configurados
wrangler secret list

# Actualizar un secret
npx wrangler secret put APPS_SCRIPT_URL
```

---

## 9. Seguridad

### 9.1 Decisiones tomadas

| Medida                     | Implementación                                                                                                             | Estado    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Proxy Worker**           | `src/worker/index.js` oculta la URL de Apps Script                                                                         | ✅ Activo |
| **Honeypot**               | Campo `website` invisible en el DOM. Si se rellena, el Worker responde 200 OK sin procesar (bot ignorado silenciosamente). | ✅ Activo |
| **Validación server-side** | Worker rechaza requests sin `nombre`, `tipoCaso` o `telefono` (400).                                                       | ✅ Activo |
| **Validación client-side** | Campos `required` nativos del navegador + checkbox de consentimiento.                                                      | ✅ Activo |
| **Content-Type check**     | Worker rechaza requests sin `Content-Type: application/json`.                                                              | ✅ Activo |
| **Consentimiento de cookies** | `CookieBanner.astro`: Google Analytics no se carga hasta que la persona pulsa "Aceptar". "Rechazar" limpia las cookies `_ga*`. Ver sección 14. | ✅ Activo |
| **Consentimiento server-side** | El Worker rechaza con 400 los POST a `/api/contacto` sin `consentimiento: true` (sección 6.15 de `ESTADO.md`).          | ✅ Activo |
| **Cabeceras de seguridad HTTP** | `withSecurityHeaders()` en `src/worker/index.js` añade HSTS, `nosniff`, `X-Frame-Options: SAMEORIGIN` y `Referrer-Policy` a **toda** respuesta (estáticas, 404, OAuth y formulario). Ver sección 20. | ✅ Activo |
| **Secrets**                | `APPS_SCRIPT_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` en `wrangler secret`, nunca en código fuente.                | ✅ Activo |

### 9.2 Riesgos conocidos y pendientes

| Riesgo                                 | Severidad | Estado                                                                                                                                                                               |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Sin rate limiting**                  | Media     | El Worker no limita la tasa de requests. Un atacante podría enviar miles de formularios. Pendiente implementar (ej: 5 requests/min por IP).                                          |
| **Sin CAPTCHA**                        | Baja      | El honeypot captura bots básicos. Un bot sofisticado podría ignorarlo. Considerar Cloudflare Turnstile en el futuro.                                                                 |
| **APPS_SCRIPT_URL expuesta en `.env`** | Baja      | El archivo `.env` tiene la URL real (prefijo `PUBLIC_`). No es un secret, pero podría usarse para enviar spam directamente a Apps Script. El Worker no valida la origen del request. |
| **GA_ID hardcodeada**                  | Baja      | El ID de medición `G-KH9TYCX64Y` vive en `src/components/CookieBanner.astro`. Cambiar de propiedad de GA implica tocar código.                                                        |
| **Sin Content-Security-Policy (CSP)**  | Media     | **Fuera de alcance de H-011 a propósito:** una CSP mal calibrada rompería `/admin/` (Decap carga scripts desde `unpkg.com`) y Google Analytics (`googletagmanager.com`). Se evalúa en una tarea aparte, con pruebas sin apuro. |

---

## 10. SEO y Accesibilidad

### 10.1 Metadatos por página

| Página               | `<title>`                         | `<meta description>`                          | Open Graph | Schema.org                             |
| -------------------- | --------------------------------- | --------------------------------------------- | ---------- | -------------------------------------- |
| Home                 | Inicio · DLA                      | Abogado especialista en Derecho de Seguros... | ✅         | @graph: LegalService (con `hasOfferCatalog` de las 4 áreas) + Person + WebSite + BreadcrumbList |
| Proceso              | Proceso Jurídico · DLA            | Cómo trabajamos en DLA...                     | ✅         | BreadcrumbList                         |
| Contacto             | Contacto y Evaluación Legal · DLA | Agenda una evaluación legal...                | ✅         | BreadcrumbList                         |
| Blog                 | Blog · DLA                        | (dinámico por post)                           | ✅         | BlogPosting (con `dateModified`, `image`, `publisher.logo`) |
| Áreas                | (dinámico por área)               | (dinámico)                                    | ✅         | Service + BreadcrumbList               |
| Preguntas Frecuentes | Preguntas Frecuentes · DLA        | (estático)                                    | ✅         | FAQPage + BreadcrumbList               |

> **Última actualización de JSON-LD (05-oct-2026):** el `@graph` de `BaseLayout.astro` suma el nodo `WebSite` (`inLanguage: es-BO`, `publisher → #organization`), el logo del `LegalService` es `/logo-schema.png` y el `hasOfferCatalog` incluye la URL real de cada área. El `BlogPosting` del artículo completa `dateModified`, `image` y `publisher.logo`. El dominio sale de `src/data/site.ts` (`siteUrl`), sin literales duplicados.

### 10.2 Sitemap

- **Generado por:** `@astrojs/sitemap` (integración de Astro, **fijado en `3.6.0`**)
- **Archivo:** `dist/sitemap-index.xml` → `dist/sitemap-0.xml` (15 URLs canónicas; `/admin/` y `/404` quedan fuera)
- **Referencia en:** `public/robots.txt` → `Sitemap: https://defensalegaldelasegurado.com/sitemap-index.xml`
- **`<lastmod>` por página:** inyectado por `serialize()` en `astro.config.mjs` con la ayuda de `src/utils/lastmod.ts`:
  - **Páginas estáticas:** fecha leída de `src/data/lastmod-static.json` (último commit de git, `%cI`). Ese JSON se genera **localmente** con `node scripts/generate-lastmod.mjs` y se versiona — el build de Cloudflare **no ejecuta git**, por eso el `lastmod` no depende del entorno de build.
  - **Colecciones (blog):** solo la fecha de frontmatter (`fechaPublicacion`); si en el futuro un post se edita tras publicarse, agregar `fechaActualizacion` al frontmatter en vez de depender de git.
  - **Ruta sin fecha:** fallback a la fecha de build + `console.warn` en el log de build (diagnóstico de JSON desactualizado). Ver detalle en la sección 17.

> **Deuda técnica:** `@astrojs/sitemap` está fijado en `3.6.0` porque la versión `3.7.3` tiene un bug conocido (`Cannot read properties of undefined (reading 'reduce')`). Si alguien intenta actualizar sin saber esto, el build fallará. Ver sección 12.

### 10.3 Accesibilidad

- **`aria-live`:** Usado en el sistema de toasts (`role="status"` para éxito, `role="alert"` para errores). El banner de cookies es `role="dialog"` con `aria-labelledby`/`aria-describedby`.
- **Semántica HTML:** Un solo `<h1>` por página (solo el slide 1 del Hero es `<h1>`) y un solo `<main>` por página (`<main>` anidados eliminados, 29-sep-2026). Formulario usa `<label>` asociado a inputs, `<select>` nativo, `<fieldset>` implícito vía CSS grid.
- **Contraste WCAG AA (re-verificado 05-oct-2026):** `--color-ink-400` #5F6E84 ≈ 5.18:1 sobre blanco; `--color-terracotta-600` #A85A28; textos claros del footer sobre navy subidos de alpha 0.35–0.45 a 0.55.
- **Tipografía sin dependencias externas:** fuentes autoalojadas con Fontsource — sin peticiones a Google Fonts (ver sección 18).
- **Menú móvil:** con scroll propio (`max-height: 100vh - header`) y cierre automático al cruzar el breakpoint o al navegar (06-oct-2026).
- **`prefers-reduced-motion`:** Todas las animaciones CSS se desactivan cuando el usuario tiene activada esta preferencia del sistema.
- **Skip links:** No implementados (pendiente).
- **`alt` text:** Imágenes decorativas tienen `alt=""`, imágenes informativas tienen descripción concisa.

---

## 11. Privacidad y Manejo de Datos Personales

### 11.1 Datos recolectados

El formulario de contacto recolecta:

| Campo            | Obligatorio | Finalidad                                      |
| ---------------- | ----------- | ---------------------------------------------- |
| `nombre`         | Sí          | Identificar al consultante                     |
| `tipoCaso`       | Sí          | Clasificar la consulta                         |
| `aseguradora`    | No          | Contexto del caso                              |
| `telefono`       | Sí          | Contacto para seguimiento                      |
| `email`          | No          | Contacto alternativo                           |
| `mensaje`        | No          | Detalles de la consulta                        |
| `consentimiento` | Sí          | Confirmar aceptación de Política de Privacidad (viaja al Sheet como "Sí"/"No" + versión) |

### 11.2 Almacenamiento

- **Google Sheet:** Los datos se almacenan en una hoja de cálculo de Google Sheets, accedida por el Google Apps Script.
- **Acceso:** Solo el propietario del Sheet (el abogado) tiene acceso. No hay sharing público.
- **Retención:** No se define política de retención automática. Los datos permanecen indefinidamente a menos que el abogado los elimine manualmente.

### 11.3 Política de Privacidad y Aviso Legal

- **Rutas publicadas:** `/politica-privacidad/` y `/aviso-legal/`.
- **Última modificación real:** 28 de septiembre de 2026 (commit `2545678` — dirección de la oficina, textos de privacidad/aviso legal y corrección de áreas de práctica).
- **Estado:** ambos textos publicados y **sin comentarios `<!-- TODO -->`** (verificado con grep en oct-2026). Incluyen: datos recopilados, finalidad, cookies/analítica, responsable y domicilio de la oficina.
- **Versión de la política citada en el Sheet:** `VERSION_POLITICA_PRIVACIDAD = '2026-09-28'` (constante en `contacto.astro`, se registra en cada envío del formulario).

### 11.4 Checkbox de consentimiento

- **Implementado:** En `contacto.astro`, antes del botón de envío.
- **Funcionamiento:** Checkbox `required` nativo del navegador. Bloquea el envío si no está marcado.
- **Link:** Apunta a `/politica-privacidad/` (se abre en nueva pestaña).
- **Validación server-side (desde 01-oct-2026):** el Worker rechaza con **400** cualquier POST a `/api/contacto` cuyo `consentimiento` no sea `true` — así un POST directo al endpoint no se salta el checkbox. El campo **sí viaja** al Apps Script (`consentimiento` booleano) y se registra en el Sheet junto con la versión de la política (`2026-09-28`).

### 11.5 Aviso de cookies

> **IMPLEMENTADO** (28-sep-2026, commit `0360161`): `src/components/CookieBanner.astro`, presente en todas las páginas vía `BaseLayout`. Solo se usan cookies de Google Analytics y **no se cargan hasta que la persona acepta**. El detalle del flujo está en la sección 14.

---

## 12. Deuda Técnica Conocida

| Ítem                                        | Severidad   | Descripción                                                                                                                                                          | Acción requerida                                                                                      |
| ------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `@astrojs/sitemap` pineado en `3.6.0`       | Media       | La versión `3.7.3` tiene un bug que rompe el build. No hay fix publicado.                                                                                            | Revisar periódicamente (`npm view @astrojs/sitemap dist-tags`). Actualizar cuando se confirme el fix. |
| **Sin rate limiting** en `/api/contacto`    | Media       | Un atacante podría enviar miles de formularios.                                                                                                                      | Implementar rate limiting en el Worker (ej: KV store con counter por IP).                             |
| **`PUBLIC_CONTACT_FORM_ENDPOINT` sin usar** | Baja        | La variable existe en `.env` pero el formulario envía a `/api/contacto`.                                                                                             | Considerar eliminar o usar como fallback.                                                             |
| **Contenido de 3 áreas de práctica (H-001)** | **Alta (P0)** | `src/content/servicios/fianzas-y-caucion.md`, `seguros-de-personas.md` y `seguros-generales.md` tienen **una sola oración** de cuerpo (con comentario `TODO` de expansión). Solo `impugnacion-de-rechazos.md` tiene contenido completo. | Redactar el contenido técnico-legal de cada ramo. **Sin resolver.**                                    |
| **`lastmod-static.json` requiere regeneración** | Baja   | Si se edita o agrega una página estática, el `<lastmod>` queda desactualizado hasta regenerar el JSON.                                                                 | Correr `node scripts/generate-lastmod.mjs` localmente y commitear el JSON junto al cambio (sección 17). |
| **Falta foto de Castro en `/sobre-mi/`**    | Baja        | La página existe pero no tiene foto personal del abogado.                                                                                                            | Agregar `src/assets/castro-foto.jpg` cuando el abogado provea la imagen.                              |
| **Blog operativo**                          | Informativa | El blog está implementado, funcionando al 100% y probado. Publicaciones via Decap CMS en `/blog/`.                                                                   | Ninguna — funcional.                                                                                  |
| **Dominio definitivo**                      | Informativa | `defensalegaldelasegurado.com` es el dominio definitivo y activo (sin `www`).                                                                                        | Ninguna — dominio confirmado.                                                                        |
| **Enlaces de redes genéricos (H-021)**      | Informativa | `SocialIcons.astro` muestra Instagram/TikTok/LinkedIn con portadas genéricas: el cliente no cargó los perfiles reales.                                                | Ocultar los íconos o rellenar las URLs cuando existan los perfiles.                                   |

---

## 13. Guía Rápida de Onboarding

### 13.1 Comandos esenciales

```bash
# Instalar dependencias
npm install

# Desarrollo local (hot reload)
npm run dev

# Build de producción
npm run build

# Build + deploy a Cloudflare Workers
npm run deploy

# Solo deploy (si ya se hizo build)
wrangler deploy
```

### 13.2 Dónde están las piezas clave

| Qué                                              | Dónde                               |
| ------------------------------------------------ | ----------------------------------- |
| Tokens de diseño (colores, fuentes, animaciones) | `src/styles/tokens.css`             |
| Layout base (HTML, meta, schema.org)             | `src/layouts/BaseLayout.astro`      |
| Formulario de contacto                           | `src/pages/contacto.astro`          |
| Worker proxy (API del formulario)                | `src/worker/index.js`               |
| Configuración de Decap CMS                       | `public/admin/config.yml`           |
| Content collections (schema)                     | `src/content/config.ts`             |
| Datos de contacto y estadísticas                 | `src/content/settings/general.json` |
| Derivaciones de la dirección (footer, contacto, legal, JSON-LD) | `src/data/oficina.ts`    |
| Dominio canónico (`siteUrl`)                     | `src/data/site.ts`                    |
| Banner de cookies + Google Analytics             | `src/components/CookieBanner.astro`   |
| `<lastmod>` del sitemap                          | `astro.config.mjs` + `src/utils/lastmod.ts` + `src/data/lastmod-static.json` |
| Regenerador de fechas del sitemap                | `scripts/generate-lastmod.mjs`        |
| Configuración de Astro                           | `astro.config.mjs`                  |
| Configuración de Cloudflare Workers              | `wrangler.jsonc`                    |

### 13.3 Antes de tocar el formulario de contacto

1. **Entender el flujo completo** (sección 6 de este documento).
2. **No modificar la URL de Apps Script** directamente en el código — está en los secrets de Cloudflare Workers.
3. **Probar localmente** con `wrangler dev` (no `npm run dev`) para que el Worker funcione.
4. **Verificar que el honeypot no se rompa** — el campo `website` debe permanecer invisible y con `tabindex="-1"`.
5. **No agregar campos al payload** sin verificar que Apps Script los maneje (el Sheet tiene columnas fijas).

### 13.4 Antes de tocar el Apps Script

1. **El script vive en Google Apps Script**, no en este repositorio.
2. **Los headers del Sheet son self-healing** — el script los auto-crea si la fila 1 está vacía.
3. **El script espera `text/plain`** en el body (no `application/json`), por eso el Worker envía `Content-Type: text/plain`.
4. **Cambios en el Apps Script** no requieren deploy del sitio, pero sí deploy del script en Google (Extensiones > Apps Script > Desplegar).

### 13.5 Regla de Decap CMS

> **SIEMPRE ejecutar `git pull` antes de hacer push.** Decap CMS commitea directo a GitHub. Si el agente hace push sin pull, creará un conflicto de merge.

- para ingresar al admin del blog en modo local colocar en la terminal: wrangler dev y en la barra de direcciones del navegador http://localhost:8787/admin/

---

## 14. Banner de cookies y Google Analytics

**Archivos:** `src/components/CookieBanner.astro` (importado y renderizado en `BaseLayout.astro`, presente en **todas** las páginas, incluida la 404). Banner agregado el 28-sep-2026 (commit `0360161`); GA integrado el 22-sep-2026 (commit `b1d1c7a`).

- **ID de medición:** `G-KH9TYCX64Y` — constante en el frontmatter del componente y expuesta al script como `data-ga-id`. Es el **único** punto donde se define (no hay snippet gtag en el `<head>`; solo hay un comentario en `BaseLayout.astro` que apunta al componente).
- **No hay carga automática:** el script `https://www.googletagmanager.com/gtag/js?id=…` se inyecta dinámicamente en `loadAnalytics()` **únicamente** cuando la persona pulsa "Aceptar" (o cuando ya existe consentimiento previo). Mientras tanto `window['ga-disable-<ID>']` mantiene el flag de desactivación.
- **Persistencia:** `localStorage` key `dla-cookie-consent` = `{ analytics: 'granted'|'denied', ts }`, con caducidad de **12 meses**; al vencer vuelve a preguntar. Si el almacenamiento está bloqueado (modo privado), la decisión vale solo para esa visita.
- **Rechazar:** `disableAnalytics()` fija `ga-disable-<ID>` y **borra las cookies** `_ga`, `_ga_*` y `_gid` en el host, dominio y dominio raíz.
- **Reapertura:** el Footer tiene el botón `data-cookie-settings` ("Configuración de cookies") que vuelve a mostrar el banner y mueve el foco a él.
- **Coordinación con elementos fijos:** el banner publica `--cookie-banner-height` en `:root` para que los elementos fijos (WhatsAppFloat) se suban por encima.
- **Accesibilidad:** `role="dialog"`, `aria-labelledby`/`aria-describedby`, foco inicial en el diálogo, y **"Rechazar" con el mismo tamaño y peso que "Aceptar"** (rechazar debe ser tan fácil como aceptar). `outline` terracotta en `:focus-visible`.
- **Copy:** enlaza a `/politica-privacidad/` y explica que solo se usan cookies de analítica.

## 15. Dirección de la oficina — centralización

**Archivos:** `src/data/oficina.ts` (solo derivaciones) ← fuente única `src/content/settings/general.json` → `contacto.direccion` (commiteado el 28-sep-2026, commit `2545678`).

Exporta: `streetAddress` (para `PostalAddress`), `direccionLineas` (3 líneas de `/contacto/`), `direccionCorta` (footer), `direccionTextoLargo` (legal + Maps), `direccionSchema` (JSON-LD) y `mapsUrl` (búsqueda de Google Maps sin iframe/cookies de terceros). Consumidores reales (grep de imports): `contacto.astro`, `Footer.astro`, `aviso-legal.astro` y `BaseLayout.astro` (JSON-LD). **`politica-privacidad.astro` NO lo usa**: su texto solo dice "con domicilio en el Estado Plurinacional de Bolivia".

**Regla:** para cambiar la dirección del sitio se edita **solo** `general.json` (campo también editable desde Decap). `oficina.ts` no contiene datos, solo arma los textos — así Google, el usuario y el CMS ven exactamente el mismo string.

## 16. Políticas legales (28-sep-2026)

`/aviso-legal/` y `/politica-privacidad/` fueron actualizados el 28-sep-2026 (commit `2545678`, junto con la dirección y la corrección de áreas de práctica):

- Incluye el domicilio real de la oficina en `/aviso-legal/` (párrafo "Domicilio de la oficina", con `direccionTextoLargo` de `oficina.ts`). **`/politica-privacidad/` no repite el domicilio**: solo declara "domicilio en el Estado Plurinacional de Bolivia".
- Cubren cookies/analítica y el mecanismo de consentimiento del formulario.
- **Sin comentarios `<!-- TODO -->`** en ninguno de los dos archivos (verificado con grep en oct-2026).
- La versión de la política que se registra en el Sheet del formulario es `2026-09-28` (constante `VERSION_POLITICA_PRIVACIDAD` en `contacto.astro`).

## 17. Sitemap con `<lastmod>` real (H-015)

`@astrojs/sitemap` (fijado en `3.6.0`) genera 15 URLs canónicas. Desde el 06-oct-2026 (commits `1aec8b3` y `29db6df`) cada URL lleva `<lastmod>`:

| Pieza | Rol |
| ----- | --- |
| `astro.config.mjs` → `sitemap({ serialize })` | Asigna `item.lastmod` URL por URL, con try/catch individual (un fallo nunca rompe el sitemap). |
| `src/data/page-sources.mjs` | Tabla compartida ruta → archivo fuente (la consumen config y el script). |
| `src/utils/lastmod.ts` | Resuelve la fecha: colecciones → **solo frontmatter**; estáticas → `lastmod-static.json`; sin fecha → fallback a la fecha de build + `console.warn`. **Nunca ejecuta git.** |
| `src/data/lastmod-static.json` | Fechas `%cI` del último commit de cada página estática (14 rutas), versionado. |
| `scripts/generate-lastmod.mjs` | Generador **local** (usa `git log`): `node scripts/generate-lastmod.mjs`. |

> **REGLA OPERATIVA:** al editar o agregar una página estática listada en `page-sources.mjs`, correr el script localmente y commitear el JSON junto con el cambio. El build de Cloudflare **no tiene git**, así que sin JSON actualizado esa URL cae en el fallback (y el log del build avisa).

## 18. Fuentes autoalojadas — Fontsource (H-023)

Desde el 06-oct-2026 (commit `26fcaa9`) **no hay peticiones a `fonts.googleapis.com` / `fonts.gstatic.com`**:

- Paquetes npm: `@fontsource-variable/fraunces` (eje `opsz 9..144` + `wght`), `@fontsource/inter` (400/500/600), `@fontsource/ibm-plex-mono` (400/500).
- Imports en el frontmatter de `BaseLayout.astro`; el bloque `<link>` de Google Fonts fue eliminado del `<head>`.
- `tokens.css` y `tailwind.config.mjs` usan `'Fraunces Variable'` como familia display.
- Verificado en build: 0 peticiones a dominios de Google, `font-display: swap` en los 34 `.woff2` servidos desde `dist/_astro/`, y las familias reales (Fraunces/Inter/IBM Plex Mono) confirmadas vía CDP `CSS.getPlatformFontsForNode`.

## 19. Correcciones recientes de contraste y menú móvil

- **Contraste WCAG AA (05-oct-2026, commit `d6988cf`, 14 archivos):** `--color-ink-400` `#6B7A90` → `#5F6E84` (≈5.18:1 sobre blanco), `--color-terracotta-600` `#B5622C` → `#A85A28`, y textos claros del footer sobre navy subidos de alpha 0.35–0.45 a **0.55** (incluye `tailwind.config.mjs` y la copia del CMS). `public/admin/tokens.css` se regenera en cada build vía `prebuild`.
- **Menú móvil (06-oct-2026, commit `64cf626`, `Header.astro` +30 líneas):** el menú desplegable tiene `max-height: calc(100vh - var(--header-height))` con `overflow-y: auto` (scroll propio en pantallas bajas); red de seguridad `@media (min-width: 769px) { .mobile-nav { display: none !important } }`; y el script cierra el menú al cruzar el breakpoint (`matchMedia('(min-width: 769px)')`) o al navegar desde un link del menú.
- **JSON-LD completo (05-oct-2026):** ver nota en la sección 10.1.

---

## 20. Cabeceras de seguridad HTTP (H-011)

Implementadas el 07-oct-2026 **solo en** `src/worker/index.js` (sin tocar el Dashboard de Cloudflare): la constante `SECURITY_HEADERS` + `withSecurityHeaders()` envuelven las cuatro ramas del `fetch()` del Worker (`/api/auth`, `/api/callback`, `/api/contacto` y `env.ASSETS.fetch()`), clonando la respuesta con `new Response(response.body, response)` y añadiendo los headers **sin modificar el body**:

| Header                      | Valor                                    | Nota                                                                                          |
| --------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`    | **Sin `preload`** a propósito: es difícil de revertir una vez que el navegador lo cachea.       |
| `X-Content-Type-Options`    | `nosniff`                                | Impide que el navegador "adivine" el MIME type de la respuesta.                                |
| `X-Frame-Options`           | `SAMEORIGIN`                             | El sitio no se embebe en iframes; si aparece algún embebedor en producción, **reportarlo** antes de retirarla. |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`        | Solo envía el origin en cross-origin; el OAuth de GitHub usa el `redirect_uri` registrado, no el referrer. |

- **Aplica a toda respuesta:** páginas estáticas, assets, 404, OAuth (`/api/auth` → 301, `/api/callback`) y el proxy del formulario.
- **CSP queda fuera de alcance (tarea aparte):** es la cabecera más propensa a romper el panel de Decap CMS (scripts desde `unpkg.com`) o Google Analytics si no se calibra con cuidado — ver riesgo en 9.2.
- **Verificación (07-oct-2026):** `npm run build` EXIT=0; `curl -sI` contra `wrangler dev` confirma los 4 headers en `/`, `/admin/` y assets; bodies idénticos byte a byte al build; `POST /api/contacto` end-to-end → 200 `{"ok":true}` y 400 sin consentimiento. Detalle completo en `ESTADO.md` §6.21.

---

## Checklist de Validación Final

- [x] El checkbox de consentimiento aparece antes del botón submit, bloquea el envío si no está marcado, y el link a la Política de Privacidad apunta a `/politica-privacidad/`.
- [x] El Worker `/api/contacto` valida el consentimiento server-side (400 sin `consentimiento: true`) y reenvía el campo a Apps Script sin romper el resto del flujo.
- [x] Las 4 cabeceras de seguridad HTTP (H-011) se inyectan en el Worker para toda respuesta (estáticas, 404, OAuth y formulario); CSP queda explícitamente pendiente (sección 9.2) — ver sección 20.
- [x] `docs/DOCUMENTACION_TECNICA.md` existe y cubre las 20 secciones completas, con información verificada contra el código real (re-auditada el 06-oct-2026; §20 de H-011 agregada el 07-oct-2026).
- [x] La tabla de variables de entorno (sección 7) coincide exactamente con lo que hay en `wrangler.jsonc`, `.dev.vars`, `.env` y secrets configurados.
- [x] La sección de deuda técnica (sección 12) lista todos los pendientes reales encontrados en el repo, incluido H-001 (contenido de 3 de 4 áreas de práctica).
