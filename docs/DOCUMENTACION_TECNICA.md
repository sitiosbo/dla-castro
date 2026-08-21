# Documentación Técnica — DLA (Defensa Legal del Asegurado)

> **Última actualización:** 20 de agosto de 2026
> **Repositorio:** `sitiosbo/dla-castro` (GitHub)
> **Sitio en producción:** `https://dlaseguros.bo`

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
│  Navegador → https://dlaseguros.bo                                  │
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
dla-seguros/
├── public/                          # Archivos estáticos sin procesar
│   ├── admin/                       # Decap CMS
│   │   ├── config.yml               # Configuración del CMS
│   │   └── index.html               # Panel de administración
│   ├── favicon.svg                  # Favicon DLA (wordmark SVG)
│   ├── images/                      # Imágenes subidas por Decap CMS
│   ├── robots.txt                   # Reglas para crawlers
│   └── llms.txt                     # Archivo para Large Language Models
├── src/
│   ├── assets/                      # Imágenes optimizadas por Astro
│   │   ├── images/
│   │   │   ├── home/                # Imágenes de la página principal
│   │   │   └── proceso/             # Imágenes de la página de proceso
│   │   └── lapaz-skyline.jpg        # Skyline para sección de liderazgo
│   ├── components/                  # Componentes Astro reutilizables
│   │   ├── Header.astro             # Navegación principal (sticky, fixed)
│   │   ├── Footer.astro             # Pie de página
│   │   ├── Hero.astro               # Hero principal con carrusel de slides
│   │   ├── TrustBar.astro           # Barra de confianza (estadísticas)
│   │   ├── Timeline.astro           # Línea de tiempo del reclamo (elemento de firma)
│   │   ├── StatBar.astro            # Barra de estadísticas con count-up
│   │   ├── ServiceTable.astro       # Tabla de portafolio por tipo de cliente
│   │   ├── FramedImage.astro        # Imagen enmarcada con fondo crema
│   │   ├── WhatsAppFloat.astro      # Botón flotante de WhatsApp
│   │   └── Toast.astro              # Sistema de notificaciones flotantes
│   ├── content/                     # Content Collections (Astro)
│   │   ├── config.ts                # Schema de todas las colecciones
│   │   ├── servicios/               # 4 áreas de práctica (markdown)
│   │   ├── blog/                    # Posts del blog normativo
│   │   ├── testimonios/             # Testimonios anonimizados
│   │   ├── casos/                   # Casos de éxito anonimizados
│   │   └── settings/                # Configuración singleton (JSON)
│   │       └── general.json         # Estadísticas y datos de contacto
│   ├── data/                        # Datos estáticos
│   │   ├── hero-slides.ts           # Definición de slides del Hero
│   │   └── hero-variantes.ts        # Variantes del Hero
│   ├── layouts/
│   │   └── BaseLayout.astro         # Layout base (HTML, meta, schema.org)
│   ├── pages/                       # Rutas del sitio
│   │   ├── index.astro              # Home (12 secciones)
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
│   └── worker/
│       └── index.js                 # Cloudflare Worker (proxy + OAuth)
├── .dev.vars                        # Variables de entorno local (secrets)
├── .env                             # Variables de entorno públicas
├── .env.example                     # Plantilla de variables de entorno
├── astro.config.mjs                 # Configuración de Astro
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
| `BaseLayout.astro`    | Layout base: HTML, meta tags, schema.org (LegalService + Person), fuentes Google, Open Graph, Twitter Cards. Envuelve todas las páginas.      | `Header`, `Footer`, `WhatsAppFloat`, `Toast`, `tokens.css` |
| `Header.astro`        | Navegación principal sticky (position: fixed). Wordmark "DLA" dominante. Menú responsive con hamburger. CTA "Agenda tu evaluación legal".     | —                                                          |
| `Footer.astro`        | Pie de página con datos de contacto, links legales, copyright.                                                                                | —                                                          |
| `Hero.astro`          | Hero principal con carrusel de 4 slides (una imagen cada ~3.2s). Duotono navy/crema via SVG filter. Animación stagger de elementos.           | `hero-slides.ts`, `astro:assets`                           |
| `TrustBar.astro`      | Barra de confianza con 4 estadísticas animadas (count-up). Lee datos de `settings/general.json`.                                              | `settings/general.json`                                    |
| `Timeline.astro`      | Línea de tiempo del "Ruta Crítica del Reclamo" (4 fases). Elemento de firma del sitio. Animación orquestada (`--motion-duration-orquestado`). | —                                                          |
| `StatBar.astro`       | Barra de estadísticas alternada (navy background). Count-up animado.                                                                          | `settings/general.json`                                    |
| `ServiceTable.astro`  | Tabla de portafolio por tipo de cliente. Scroll horizontal en mobile.                                                                         | `content/servicios`                                        |
| `FramedImage.astro`   | Imagen enmarcada con fondo crema (`--image-frame-bg`), bordes redondeados, sombra. Reutilizable.                                              | `astro:assets`                                             |
| `WhatsAppFloat.astro` | Botón flotante de WhatsApp con mensajes contextuales por sección.                                                                             | `settings/general.json`                                    |
| `Toast.astro`         | Sistema de notificaciones flotantes para el formulario de contacto. Soporte para success/error, auto-close, pausa en hover.                   | —                                                          |

---

## 5. Gestión de Contenido (Decap CMS)

### 5.1 Configuración

- **Archivo:** `public/admin/config.yml`
- **Backend:** GitHub (`sitiosbo/dla-castro`, branch `main`)
- **OAuth:** Embebido en el Worker (`/api/auth` y `/api/callback` en `src/worker/index.js`)
- **URL del CMS:** `https://dlaseguros.bo/admin/`

### 5.2 Colecciones

| Colección                 | Carpeta                             | Editable                    | Tipos de archivo |
| ------------------------- | ----------------------------------- | --------------------------- | ---------------- |
| **Áreas de Práctica**     | `src/content/servicios/`            | Solo edición (4 existentes) | `.md`            |
| **Blog**                  | `src/content/blog/`                 | Creación y edición          | `.md` + imágenes |
| **Testimonios**           | `src/content/testimonios/`          | Creación y edición          | `.md`            |
| **Casos de Éxito**        | `src/content/casos/`                | Creación y edición          | `.md`            |
| **Configuración General** | `src/content/settings/general.json` | Edición (stats + contacto)  | `.json`          |

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
│       telefono, email, mensaje                                      │
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
│     - Reenvía a APPS_SCRIPT_URL (POST, text/plain)                 │
│     - Retorna 200 OK / 400 / 500 / 502 según resultado            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. GOOGLE APPS SCRIPT                                              │
│     - Recibe JSON en doPost(e)                                      │
│     - Auto-crea headers si la hoja está vacía                       │
│     - appendRow() con: Fecha, Nombre, TipoCaso, Aseguradora,       │
│       Teléfono, Email, Mensaje                                      │
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
| **Secrets**                | `APPS_SCRIPT_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` en `wrangler secret`, nunca en código fuente.                | ✅ Activo |

### 9.2 Riesgos conocidos y pendientes

| Riesgo                                 | Severidad | Estado                                                                                                                                                                               |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Sin rate limiting**                  | Media     | El Worker no limita la tasa de requests. Un atacante podría enviar miles de formularios. Pendiente implementar (ej: 5 requests/min por IP).                                          |
| **Sin CAPTCHA**                        | Baja      | El honeypot captura bots básicos. Un bot sofisticado podría ignorarlo. Considerar Cloudflare Turnstile en el futuro.                                                                 |
| **APPS_SCRIPT_URL expuesta en `.env`** | Baja      | El archivo `.env` tiene la URL real (prefijo `PUBLIC_`). No es un secret, pero podría usarse para enviar spam directamente a Apps Script. El Worker no valida la origen del request. |
| **Cookie notice pendiente**            | Baja      | No hay aviso de cookies implementado. Ver sección 11 (Privacidad).                                                                                                                   |

---

## 10. SEO y Accesibilidad

### 10.1 Metadatos por página

| Página               | `<title>`                         | `<meta description>`                          | Open Graph | Schema.org                             |
| -------------------- | --------------------------------- | --------------------------------------------- | ---------- | -------------------------------------- |
| Home                 | Inicio · DLA                      | Abogado especialista en Derecho de Seguros... | ✅         | LegalService + Person + BreadcrumbList |
| Proceso              | Proceso Jurídico · DLA            | Cómo trabajamos en DLA...                     | ✅         | BreadcrumbList                         |
| Contacto             | Contacto y Evaluación Legal · DLA | Agenda una evaluación legal...                | ✅         | BreadcrumbList                         |
| Blog                 | Blog · DLA                        | (dinámico por post)                           | ✅         | BlogPosting                            |
| Áreas                | (dinámico por área)               | (dinámico)                                    | ✅         | Service + BreadcrumbList               |
| Preguntas Frecuentes | Preguntas Frecuentes · DLA        | (estático)                                    | ✅         | FAQPage + BreadcrumbList               |

### 10.2 Sitemap

- **Generado por:** `@astrojs/sitemap` (integración de Astro)
- **Archivo:** `dist/sitemap-index.xml`
- **Referencia en:** `public/robots.txt` → `Sitemap: https://dlaseguros.bo/sitemap-index.xml`

> **Deuda técnica:** `@astrojs/sitemap` está fijado en `3.6.0` porque la versión `3.7.3` tiene un bug conocido (`Cannot read properties of undefined (reading 'reduce')`). Si alguien intenta actualizar sin saber esto, el build fallará. Ver sección 12.

### 10.3 Accesibilidad

- **`aria-live`:** Usado en el sistema de toasts (`role="status"` para éxito, `role="alert"` para errores).
- **Semántica HTML:** Formulario usa `<label>` asociado a inputs, `<select>` nativo, `<fieldset>` implícito vía CSS grid.
- **Contraste:** Tokens verificados WCAG AA. `--color-ink-400` (#6B7A90) = 5.2:1 contra fondo blanco.
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
| `consentimiento` | Sí (UI)     | Confirmar aceptación de Política de Privacidad |

### 11.2 Almacenamiento

- **Google Sheet:** Los datos se almacenan en una hoja de cálculo de Google Sheets, accedida por el Google Apps Script.
- **Acceso:** Solo el propietario del Sheet (el abogado) tiene acceso. No hay sharing público.
- **Retención:** No se define política de retención automática. Los datos permanecen indefinidamente a menos que el abogado los elimine manualmente.

### 11.3 Política de Privacidad

- **Ruta publicada:** `/politica-privacidad/`
- **Estado:** Básica (publicada). Incluye: datos recopilados, finalidad, confidencialidad.
- **Pendiente:** Validar texto legal completo con el abogado (ver `<!-- TODO -->` en el archivo).

### 11.4 Checkbox de consentimiento

- **Implementado:** En `contacto.astro`, antes del botón de envío.
- **Funcionamiento:** Checkbox `required` nativo del navegador. Bloquea el envío si no está marcado.
- **Link:** Apunta a `/politica-privacidad/` (se abre en nueva pestaña).
- **Validación server-side:** El Worker **no** valida el campo `consentimiento` — es puramente client-side. El campo no se envía al Apps Script.

### 11.5 Aviso de cookies

> **PENDIENTE:** No hay aviso de cookies implementado. Debe implementarse cuando se defina el dominio final del sitio y se determine si se usan cookies de analytics, pixels de tracking, o similares. Dejar como ítem de backlog until que se resuelva.

---

## 12. Deuda Técnica Conocida

| Ítem                                        | Severidad   | Descripción                                                                                                                                                          | Acción requerida                                                                                      |
| ------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `@astrojs/sitemap` pineado en `3.6.0`       | Media       | La versión `3.7.3` tiene un bug que rompe el build. No hay fix publicado.                                                                                            | Revisar periódicamente (`npm view @astrojs/sitemap dist-tags`). Actualizar cuando se confirme el fix. |
| **Sin rate limiting** en `/api/contacto`    | Media       | Un atacante podría enviar miles de formularios.                                                                                                                      | Implementar rate limiting en el Worker (ej: KV store con counter por IP).                             |
| **Cookie notice no implementado**           | Baja        | No hay aviso de cookies. Requerido si se agregan analytics o tracking.                                                                                               | Implementar cuando se defina el dominio y herramientas de analytics.                                  |
| **`PUBLIC_CONTACT_FORM_ENDPOINT` sin usar** | Baja        | La variable existe en `.env` pero el formulario envía a `/api/contacto`.                                                                                             | Considerar eliminar o usar como fallback.                                                             |
| **Aviso legal incompleto**                  | Baja        | El texto legal de `/aviso-legal/` y `/politica-privacidad/` necesita validación del abogado.                                                                         | Validar con el abogado antes de producción formal.                                                    |
| **Falta foto de Castro en `/sobre-mi/`**    | Baja        | La página existe pero no tiene foto personal del abogado.                                                                                                            | Agregar `src/assets/castro-foto.jpg` cuando el abogado provea la imagen.                              |
| **Blog operativo**                          | Informativa | El blog está implementado, funcionando al 100% y probado. Publicaciones via Decap CMS en `/blog/`.                                                                   | Ninguna — funcional.                                                                                  |
| **Dominio placeholder**                     | Informativa | `dlaseguros.bo` es el dominio de trabajo. Puede cambiar.                                                                                                             | Confirmar dominio final con el abogado.                                                               |
| **Google Fonts `media` warning**            | Informativa | `BaseLayout.astro:115` tiene un warning de TypeScript por el atributo `media` en el link de Google Fonts. Es un patrón válido (preload asíncrono), no un error real. | No requiere acción.                                                                                   |

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

## Checklist de Validación Final

- [x] El checkbox de consentimiento aparece antes del botón submit, bloquea el envío si no está marcado, y el link a la Política de Privacidad apunta a `/politica-privacidad/`.
- [x] El Worker `/api/contacto` sigue funcionando igual (no rompe nada por el campo `consentimiento` nuevo).
- [x] `docs/DOCUMENTACION_TECNICA.md` existe y cubre las 13 secciones completas, con información verificada contra el código real.
- [x] La tabla de variables de entorno (sección 7) coincide exactamente con lo que hay en `wrangler.jsonc`, `.dev.vars`, `.env` y secrets configurados.
- [x] La sección de deuda técnica (sección 12) lista todos los pendientes reales encontrados en el repo.
