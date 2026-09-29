# Auditoría del sitio DLA — 29 de septiembre de 2026

## 0. Resumen ejecutivo

- **Estado general del sitio:** El sitio web de **DLA — Defensa Legal del Asegurado** cuenta con una base arquitectónica moderna, rápida y limpia basada en Astro 4 y Cloudflare Workers con Static Assets, con tiempos de compilación sobresalientes (~39 s) y cero errores de TypeScript. No obstante, **el proyecto se encuentra actualmente incompleto en su capa de contenido y en aspectos críticos de configuración para producción**: 3 de las 4 áreas de práctica contienen únicamente una oración de texto con notas de desarrollo pendientes, las secciones de casos y testimonios son maquetas de prueba (*placeholders*), la imagen para previsualizaciones sociales (`og-default.png`) no existe (error 404), el servidor en producción no redirige el tráfico HTTP hacia HTTPS, no existe una página personalizada de error 404 (provocando una pantalla en blanco), y el archivo `llms.txt` declara atención presencial en ciudades donde no existe oficina física publicada.
- **Semáforo por área:**
  - **Contenido:** 🔴 Crítico (3 de 4 áreas de práctica son textos de una línea; casos y testimonios son maquetas `TODO`; solo 1 artículo de blog publicado).
  - **SEO técnico:** 🟡 Mejorable (Puntuación: **1.18 / 2.00**; falta imagen Open Graph por defecto, 4 encabezados `<h1>` en portada, HTTP no fuerza HTTPS, sin página 404 personalizada).
  - **SEO de contenido y local:** 🔴 Crítico (Contenido extremadamente delgado en servicios troncales, sin perfiles sociales activos, sin enlaces internos cruzados hacia el único artículo de blog).
  - **AEO (Optimización para motores de respuesta e IA):** 🟡 Mejorable (Puntuación: **1.00 / 2.00**; rastreo abierto e indexación estática óptima, pero `llms.txt` afirma atención presencial no respaldada, esquema sin `sameAs` ni `WebSite`, falta de frescura).
  - **Seguridad:** 🟡 Mejorable (Honeypot y validación básica en worker correctas, pero sin Rate Limiting, sin Turnstile/CAPTCHA, sin cabeceras HSTS/CSP, HTTP accesible en texto plano).
  - **Privacidad y consentimiento:** 🟡 Mejorable (Banner de cookies bloquea Google Analytics correctamente hasta aceptación, pero el backend no almacena trazabilidad del consentimiento del formulario y Google Fonts se solicita a servidores externos).
  - **Rendimiento:** 🟡 Mejorable (HTML y JS altamente eficientes, pero existen imágenes en `dist/` y `public/` que superan 1 MB sin optimización web agresiva; rotación dinámica de Hero provoca desplazamientos potenciales).
  - **Accesibilidad:** 🟡 Mejorable (Navegación limpia, pero presenta etiquetas `<main>` anidadas en 10 páginas, saltos en la jerarquía de encabezados y contrastes de color en textos secundarios y botones que no alcanzan el umbral WCAG AA 4.5:1).
  - **Infraestructura:** 🟢 Bien (Arquitectura de Cloudflare Workers con Static Assets bien planteada, build reproducible y rápida, compatibilidad moderna).
  - **CMS (Decap):** 🟡 Mejorable (Backend GitHub configurado y funcional, pero el archivo de estilos de previsualización `/src/styles/tokens.css` no existe en producción y genera 404).
  - **Código:** 🟢 Bien (Astro check pasa con 0 errores y 0 advertencias, tokens centralizados y convención de componentes ordenada).

- **Puntuaciones de auditoría:**
  - **Puntuación SEO técnico:** **1.18 / 2.00** (58.8% de cumplimiento).
  - **Puntuación AEO (Motores de IA):** **1.00 / 2.00** (50.0% de cumplimiento).

- **Top 10 hallazgos priorizados:**
  1. `H-001` [P0] Contenido: 3 de las 4 áreas de práctica contienen únicamente una oración y marcas `TODO` de desarrollo.
  2. `H-002` [P0] Contenido: Colecciones de casos y testimonios compuestas exclusivamente por maquetas ficticias con texto "TODO".
  3. `H-003` [P1] SEO técnico: La imagen Open Graph por defecto (`/og-default.png`) no existe (404), rompiendo las previsualizaciones al compartir en redes y WhatsApp.
  4. `H-004` [P1] Seguridad: `http://defensalegaldelasegurado.com` responde con HTTP 200 en texto plano sin redirigir a HTTPS.
  5. `H-005` [P1] SEO / Infra: No existe plantilla ni página `404.astro`, generando respuestas HTTP 404 de 0 bytes (pantalla blanca al usuario).
  6. `H-006` [P1] SEO técnico: La portada renderiza simultáneamente cuatro etiquetas `<h1>` (una por cada slide del carrusel).
  7. `H-007` [P1] Accesibilidad: Diez páginas del sitio presentan una etiqueta `<main>` anidada dentro del `<main>` principal de `BaseLayout.astro`.
  8. `H-008` [P1] AEO: `llms.txt` afirma "Atención presencial en La Paz, Santa Cruz y Cochabamba", contradiciendo la información real de oficina física única en La Paz.
  9. `H-009` [P1] CMS: `public/admin/index.html` solicita `/src/styles/tokens.css` para previsualización, ruta inexistente en producción.
  10. `H-010` [P1] Privacidad: La casilla de consentimiento de la Política de Privacidad en `/contacto/` no envía confirmación, fecha ni versión al backend.

---

## 1. Historia del proyecto (qué se hizo y cuándo)

### 1.1 Línea de tiempo por hitos y temas
El repositorio registra un total de **43 commits** entre el **13 de agosto de 2026** y el **28 de septiembre de 2026**. Los autores principales en el historial son Wilson Calderon (`wilsonpolcalderonbarrios@gmail.com`), sitiosbo (`calderonwilsonpol@gmail.com`) y el bot de Decap CMS (`defensalegaldelasegurado-hash`).

- **Hito 1: Creación del proyecto y andamiaje inicial (13 de agosto de 2026)**
  - *Commits:* `4dd71cd`, `74e21d0`, `31b6120`, `412a932`, `7043eb2`, `2fa5f69`, `34e8b52`, `0b70fb8`, `6190f21`, `1f4960e`, `7b1c774`, `ab5c179`, `6e93a61`, `84909e9`, `c29c47d`.
  - *Acciones:* Se estructura el sitio Astro estático, integración de Tailwind CSS, tokens de diseño inspirados en la metodología de animación de Emil Kowalski, configuración de Decap CMS con backend de GitHub, y fijación (*pin*) de `@astrojs/sitemap` en versión `3.6.0` debido a un error en `3.7.3`.
- **Hito 2: Refinamiento de UI, Navbar y Animaciones (14 al 17 de agosto de 2026)**
  - *Commits:* `58d2648`, `b235b09`, `5274bc9`, `947940b`, `1b125f8`, `aca3160`, `8931b8c`, `82b5839`, `c23a10f`, `8bbb4e8`.
  - *Acciones:* Se ajusta el encabezado (de sticky a fixed para transparencias sobre el Hero), se corrigen las animaciones del contador de estadísticas en `TrustBar`, se programa la animación escalonada de la 'Ruta Crítica del Reclamo' en `Timeline.astro`, y se optimizan las tarjetas móviles.
- **Hito 3: Identidad, Normalización de Marca y Redes (20 al 27 de agosto de 2026)**
  - *Commits:* `2ebad1a`, `d7232ba`, `3459a72`, `6ec8b73`, `3df4e71`, `ead8ed7`, `9c63942`, `906ad99`, `6441ff3`, `de51a7a`, `b2266db`, `72e08a4`, `85e17bd`, `a7fb907`, `4f520bd`, `6c38cb7`, `68856c9`, `029b248`, `0b50ddd`, `23c51fc`.
  - *Acciones:* Se ejecuta la directiva de marca: cambio de nombre de "Dr. Ramiro Castro" a "Ramiro Guillermo Castro" en todos los archivos; creación del componente `SocialIcons.astro` en pie de página; pruebas de publicación desde Decap CMS en la colección de blog; ajustes de filtros duotono navy a imágenes.
- **Hito 4: Activos fotográficos y ajustes de contacto (4 al 24 de septiembre de 2026)**
  - *Commits:* `596095a`, `3a9d10f`, `8f04b38`, `a5c3a36`, `b1d1c7a`, `4a474da`, `117cbb7`.
  - *Acciones:* Se incorporan fotos reales del abogado en secciones de Ramos y Defensa; se actualiza el dominio oficial a `defensalegaldelasegurado.com`; se añade Google Analytics (`b1d1c7a`); se actualiza el número de WhatsApp a `59157001099`.
- **Hito 5: Cumplimiento legal, Privacidad y Banner de Cookies (26 al 28 de septiembre de 2026)**
  - *Commits:* `b12b6dc`, `7f5f58f`, `2545678`, `0360161`, `5b3b59a`.
  - *Acciones:* Corrección del esquema FAQ JSON-LD; actualización de términos en Aviso Legal y Política de Privacidad; incorporación de `CookieBanner.astro` bloqueando GA hasta consentimiento explícito; desactivación del modo local de Decap CMS (`local_backend`) previo a producción.

### 1.2 Ramas y etiquetas
- **Ramas locales y remotas:** [VERIFICADO] `main` y `feat/banner-cookies`. Ambas ramas se encuentran exactamente en el mismo commit (`5b3b59a`). No hay ramas huérfanas con trabajo pendiente sin fusionar.
- **Etiquetas (tags):** [VERIFICADO] No existe ninguna etiqueta (`git tag -l` devuelve vacío).

### 1.3 Comentarios pendientes en el código (*TODO, FIXME, placeholders*)
[VERIFICADO mediante búsqueda en código fuente]
- `src/components/StatBar.astro:65`: `<!-- TODO: validar con el abogado la redacción exacta del disclaimer -->`. Indica que el aviso legal sobre los porcentajes de efectividad no fue validado jurídicamente.
- `src/components/Timeline.astro:84`: `<!-- TODO: validar con el abogado los plazos exactos de cada fase -->`. Los plazos de la ruta crítica legal carecen de visto bueno formal del abogado.
- `src/components/WhatsAppFloat.astro:36-37`: `TODO_NUMERO_WHATSAPP`. Lógica de contingencia por si el número no está definido.
- `src/content/casos/ejemplo-caso.md:2,5`: `titulo: "TODO: Impugnación exitosa — ramo Incendio"`, `resumen: "TODO: reemplazar con caso real anonimizado..."`. El caso de éxito publicado es ficticio.
- `src/content/testimonios/ejemplo-testimonio.md:4,5`: `texto: "TODO: reemplazar con testimonio real anonimizado..."`, `resultado: "TODO: ej. Indemnización recuperada en 45 días"`. El testimonio publicado es ficticio.
- `src/content/servicios/fianzas-y-caucion.md:11`: `<!-- TODO agente: expandir con contenido normativo específico del ramo... -->`.
- `src/content/servicios/seguros-de-personas.md:11`: `<!-- TODO agente: expandir con contenido normativo específico del ramo... -->`.
- `src/content/servicios/seguros-generales.md:11`: `<!-- TODO agente: expandir con contenido normativo específico del ramo... -->`.
- `src/content/servicios/impugnacion-de-rechazos.md:23`: `<!-- TODO agente: Esta es la página de MAYOR prioridad... -->`.
- `src/layouts/BaseLayout.astro:105`: `<!-- Favicon DLA — wordmark en SVG, pendiente diseño gráfico definitivo -->`.
- `src/pages/contacto.astro:56,153,700`: Verificaciones contra la cadena de reserva `'TODO_NUMERO_WHATSAPP'`.
- `src/pages/sobre-mi.astro:104,193,245`: Elementos con clase `.castro-portrait-placeholder` utilizados en maquetación.

### 1.4 Documentación existente frente a la realidad técnica
- **`docs/DOCUMENTACION_TECNICA.md`:** [VERIFICADO] Fecha de última actualización: 20 de agosto de 2026. No documenta los cambios sustanciales de septiembre: no menciona el banner de cookies (`CookieBanner.astro`), ni la integración de Google Analytics, ni la centralización de datos postales en `src/data/oficina.ts`, ni las nuevas políticas legales del 28 de septiembre.
- **`ESTADO.md`:** [VERIFICADO] Afirma en la sección 3: *"Contenido real de las 4 áreas de práctica migrado a markdown"*. **Discrepancia:** En la realidad, 3 de los 4 archivos markdown contienen un único párrafo de una oración.
- **`astro.config.mjs`:** [VERIFICADO: línea 7] Contiene el comentario: `// GitHub (sitiosbo/dla-seguros) es exclusivamente el repositorio de código fuente`. **Discrepancia:** El origen remoto real en git es `https://github.com/sitiosbo/dla-castro.git`.

### 1.5 Automatizaciones y mecanismo de despliegue
- **GitHub Actions:** [VERIFICADO] No existe directorio `.github/` ni flujos de integración continua (CI/CD) en el repositorio.
- **Mecanismo de despliegue:** [INFERIDO a partir de `package.json:11` y `wrangler.jsonc`] El despliegue a producción se realiza manualmente mediante el comando `npm run deploy` (`astro build && wrangler deploy`), o bien a través de la integración nativa de Cloudflare Workers Builds conectada al repositorio GitHub `sitiosbo/dla-castro`.

---

## 2. Arquitectura y stack

### 2.1 Stack y versiones
[VERIFICADO: `package.json`, `npm -v`, `node -v`]
- **Entorno de ejecución:** Node.js `v22.23.2` / npm `10.9.8`. No se encontraron archivos `.nvmrc` ni restricción `engines` en `package.json`.
- **Framework principal:** Astro `4.16.19` (configurado en modo SSG estático, `output: 'static'` por defecto).
- **Estilos:** Tailwind CSS `3.4.19` con `@astrojs/tailwind` `5.1.5` (con `applyBaseStyles: false`).
- **Sitemap:** `@astrojs/sitemap` fijado estrictamente en versión `3.6.0`.
- **TypeScript:** TypeScript `5.9.3` con `@astrojs/check` `0.9.0`. Configuración en `tsconfig.json` con `extends: "astro/tsconfigs/strict"`.
- **Infraestructura de Borde:** Cloudflare Workers con Static Assets (`wrangler` `3.114.17` en devDependencies). `compatibility_date: "2025-01-01"`.
- **Estado de dependencias (`npm outdated`):**
  - `astro`: Instalada `4.16.19`, disponible última versión mayor `7.3.5`.
  - `@astrojs/tailwind`: Instalada `5.1.5`, disponible última versión mayor `6.0.2`.
  - `tailwindcss`: Instalada `3.4.19`, disponible última versión mayor `4.3.3`.
  - `wrangler`: Instalada `3.114.17`, disponible última versión mayor `4.143.0`.
- **Vulnerabilidades (`npm audit --omit=dev`):**
  [VERIFICADO] Se detectan **7 vulnerabilidades** en dependencias de producción (1 crítica, 4 altas, 2 moderadas) asociadas a versiones transitivas de `astro` <= 7.2.7, `sharp` <= 0.35.4-rc.0, `vite`, `fast-uri` y `js-yaml`. No deben actualizarse a ciegas para evitar roturas de compilación no probadas.

### 2.2 Diagnósticos y Build
- **`npx astro check`:** [VERIFICADO] 45 archivos evaluados. **0 errores, 0 advertencias, 1 pista (hint)**:
  `src/layouts/BaseLayout.astro:123:20 - warning ts(6133): 'media' is declared but its value is never read (onload="this.media='all'")`.
- **`npm run build`:** [VERIFICADO] Proceso completado exitosamente con código de salida `0` en un tiempo de **39.50 segundos**.
- **Tamaño de salida `dist/`:** [VERIFICADO] 82 archivos en total con un peso conjunto de **4,939,582 bytes (~4.71 MB)**.

---

## 3. Rutas y enlaces (tabla de todas las páginas)

Inventario exhaustivo de los 16 archivos HTML generados en `dist/` tras el build estático:

| URL | Archivo fuente (`src/`) | `<title>` | Longitud Title | `meta description` | Longitud Desc | `<h1>` Cant. | Indexable | JSON-LD Tipos | `<main>` anidado |
|---|---|---|:---:|---|:---:|:---:|:---:|---|:---:|
| `/` | `pages/index.astro` | Inicio · DLA — Defensa Legal del Asegurado | 42 | Abogado especialista en Derecho de Seguros en Bolivia. Más de 25 años de experiencia en impugnación de rechazos, seguros generales, personas y fianzas. | 151 | **4** ⚠️ | Sí | LegalService, Person | No |
| `/areas-de-practica/` | `pages/areas-de-practica/index.astro` | Áreas de Práctica · DLA — Defensa Legal del Asegurado | 53 | Especialista en Derecho de Seguros en Bolivia. Asesoría estratégica y patrocinio en siniestros patrimoniales, personales, fianzas e impugnación de rechazos. | 157 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/areas-de-practica/fianzas-y-caucion/` | `pages/areas-de-practica/fianzas-y-caucion.astro` | Fianzas y Caución · DLA — Defensa Legal del Asegurado | 53 | Especialista en la ejecución e impugnación de garantías para contratos públicos y privados, protegiendo el patrimonio de la empresa. | 132 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/areas-de-practica/impugnacion-de-rechazos/` | `pages/areas-de-practica/impugnacion-de-rechazos.astro` | Impugnación de Rechazos · DLA — Defensa Legal del Asegurado | 60 | Defensa técnica y legal especializada ante el rechazo injustificado de siniestros por parte de compañías de seguros en Bolivia. | 129 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/areas-de-practica/seguros-de-personas/` | `pages/areas-de-practica/seguros-de-personas.astro` | Seguros de Personas · DLA — Defensa Legal del Asegurado | 55 | Asesoría en seguros de vida, desgravamen hipotecario, accidentes personales y seguro obligatorio de accidentes (SOAT y SOATC). | 126 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/areas-de-practica/seguros-generales/` | `pages/areas-de-practica/seguros-generales.astro` | Seguros Generales · DLA — Defensa Legal del Asegurado | 53 | Atención en controversias de seguros patrimoniales, transporte de carga, ingeniería, ramos técnicos, incendio y responsabilidad civil corporativa. | 146 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/aviso-legal/` | `pages/aviso-legal.astro` | Aviso Legal · DLA — Defensa Legal del Asegurado | 47 | Aviso legal de DLA — Defensa Legal del Asegurado: titularidad del sitio, alcance de la información publicada, propiedad intelectual y limitaciones de responsabilidad. | 166 | 1 | Sí | LegalService, Person | No |
| `/blog/` | `pages/blog/index.astro` | Blog y Artículos Técnicos · DLA — Defensa Legal del Asegurado | 61 | Análisis especializado sobre normativa de seguros, regulación APS, impugnación de rechazos y jurisprudencia en Bolivia. | 119 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/blog/ejemplo-post/` | `pages/blog/[...slug].astro` | ¿Qué acciones legales tomar inmediatamente ante un rechazo de siniestro? · DLA — Defensa Legal del Asegurado | 108 ⚠️ | Pasos fundamentales, plazos reglamentarios y estrategia técnico-legal para impugnar la negativa de cobertura de una aseguradora en Bolivia. | 139 | 1 | Sí | LegalService, Person, BlogPosting, BreadcrumbList | **Sí** ⚠️ |
| `/contacto/` | `pages/contacto.astro` | Contacto y Evaluación Legal · DLA — Defensa Legal del Asegurado | 63 | Agenda una evaluación legal inicial con DLA. Asesoría experta en Derecho de Seguros en Bolivia. | 95 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/politica-privacidad/` | `pages/politica-privacidad.astro` | Política de Privacidad · DLA — Defensa Legal del Asegurado | 58 | Cómo DLA — Defensa Legal del Asegurado trata, protege y conserva los datos personales recibidos a través de este sitio web. | 123 | 1 | Sí | LegalService, Person | No |
| `/preguntas-frecuentes/` | `pages/preguntas-frecuentes.astro` | Preguntas Frecuentes · DLA — Defensa Legal del Asegurado | 56 | Respuestas a dudas comunes sobre rechazos de siniestros, reclamos en la APS, seguros generales y fianzas en Bolivia. | 116 | 1 | Sí | LegalService, Person, FAQPage, BreadcrumbList | **Sí** ⚠️ |
| `/proceso/` | `pages/proceso.astro` | Proceso Jurídico · DLA — Defensa Legal del Asegurado | 52 | Cómo trabajamos en DLA: diagnóstico técnico de pólizas, estrategia de conciliación, impugnación administrativa APS y cobro de indemnizaciones. | 142 | 1 | Sí | LegalService, Person, BreadcrumbList | No |
| `/resultados/` | `pages/resultados.astro` | Resultados y Estadísticas · DLA — Defensa Legal del Asegurado | 61 | Resultados comprobables, casos anonimizados y efectividad en el reclamo e impugnación de seguros en Bolivia. | 108 | 1 | Sí | LegalService, Person, BreadcrumbList | No |
| `/sobre-mi/` | `pages/sobre-mi.astro` | Sobre Mí · DLA — Defensa Legal del Asegurado | 44 | Ramiro Guillermo Castro — Especialista en Derecho de Seguros en Bolivia con más de 25 años de trayectoria. Fundador de DLA Defensa Legal del Asegurado. | 151 | 1 | Sí | LegalService, Person, BreadcrumbList | **Sí** ⚠️ |
| `/admin/` | `public/admin/index.html` | DLA — Panel de Contenido | 24 | (Sin descripción) | 0 | 0 | **No** (`noindex, nofollow`) | (Ninguno) | No |

### 3.1 Verificación de enlaces internos
[VERIFICADO mediante script `scratch/check_links.cjs` y `scratch/check_orphans.cjs`]
- **Total enlaces analizados:** 47 enlaces internos únicos encontrados en las 16 páginas.
- **Enlaces rotos:** **0 enlaces rotos**. Cada enlace interno resuelve a un archivo existente.
- **Consistencia de barra final (*trailingSlash*):** **100% de cumplimiento**. Todos los enlaces internos respetan la configuración `trailingSlash: 'always'`.
- **Páginas casi huérfanas o con bajo enlazado entrante:**
  - `/blog/ejemplo-post/`: **1 solo enlace entrante** (exclusivamente desde el listado `/blog/`). No está enlazado desde la portada, ni desde áreas de práctica, ni desde el proceso.
  - `/admin/`: 0 enlaces entrantes públicos (comportamiento intencional y correcto para el panel administrativo).

---

## 4. Contenido y CMS

### 4.1 Colecciones de contenido (`src/content/config.ts`)
- **`servicios` (4 archivos en `src/content/servicios/`):**
  - `impugnacion-de-rechazos.md`: 152 palabras. Presenta esquema básico de defensa y fases de reclamo.
  - `fianzas-y-caucion.md`: **33 palabras**. Solo un párrafo genérico.
  - `seguros-de-personas.md`: **20 palabras**. Una sola oración de resumen.
  - `seguros-generales.md`: **24 palabras**. Una sola oración de resumen.
  - *Diagnóstico:* 3 de las 4 páginas de servicio son contenido extremadamente delgado (*thin content*), lo que representa una debilidad de posicionamiento y conversión.
- **`blog` (1 archivo en `src/content/blog/`):**
  - `ejemplo-post.md`: Publicado con fecha `2026-08-12`. Título: *"¿Qué acciones legales tomar inmediatamente ante un rechazo de siniestro?"*. Posee contenido de buena calidad técnica citando el Código de Comercio y la APS, pero es el **único** artículo existente.
- **`testimonios` (1 archivo en `src/content/testimonios/`):**
  - `ejemplo-testimonio.md`: Contenido literal: *"TODO: reemplazar con testimonio real anonimizado del cliente, provisto por el abogado."*.
- **`casos` (1 archivo en `src/content/casos/`):**
  - `ejemplo-caso.md`: Contenido literal: *"TODO: Impugnación exitosa — ramo Incendio"*, *"TODO: reemplazar con caso real anonimizado"*.
- **`settings` (1 archivo en `src/content/settings/general.json`):**
  - Almacena estadísticas (`aniosExperiencia: 25`, `recuperoIndemnizaciones: 95`, `resolucionViaAdministrativa: 82`, etc.), datos de contacto y redes sociales.

### 4.2 Coherencia con Decap CMS (`public/admin/config.yml`)
- [VERIFICADO] Los campos declarados en `config.yml` coinciden estructuralmente con las colecciones definidas en `src/content/config.ts`.
- **Fallas en el CMS:**
  - `local_backend: true` se encuentra comentado correctamente en la línea 8 para producción [VERIFICADO].
  - `logo_url: /admin/logo.png` existe y es servido correctamente [VERIFICADO].
  - En `public/admin/index.html:14`: se invoca `window.CMS.registerPreviewStyle('/src/styles/tokens.css')`. Esta ruta genera un error HTTP 404 en producción porque la carpeta `src/` no se publica en `dist/`.

### 4.3 Datos de relleno y enlaces ficticios
- `general.json:30-35`: Las redes sociales configuradas apuntan a:
  - `instagram`: `"http://www.instagram.com"` (página de inicio genérica en protocolo no seguro HTTP).
  - `tiktok`: `"http://www.tiktok.com"` (página de inicio genérica en HTTP).
  - `linkedin`: `"http://www.linkedin.com"` (página de inicio genérica en HTTP).
  - Solo `facebook` tiene una URL específica (`"https://www.facebook.com/dlabolivia"`), aunque el perfil público aún no está activo o confirmado.
- Correo electrónico: `defensalegaldelasegurado@gmail.com` (cuenta gratuita de Gmail en lugar de correo corporativo bajo el dominio `@defensalegaldelasegurado.com`).

---

## 5. SEO técnico (evaluación por página y puntuación)

### 5.1 Tabla de evaluación de los 17 criterios técnicos

| Criterio Técnico | Estado / Observación | Puntuación (0–2) |
|---|---|:---:|
| **1. Indexabilidad** | 15 páginas indexables limpias; `/admin/` correctamente protegido con `noindex, nofollow`. | **2** |
| **2. Canonical** | Todas las páginas cuentan con etiqueta canónica absoluta, HTTPS autorreferenciada y con barra final. | **2** |
| **3. `<title>`** | Títulos únicos con marca consistente. `/` tiene título algo genérico ("Inicio") y `/blog/ejemplo-post/` tiene 108 caracteres (excede los 60 recomendados). | **1** |
| **4. `meta description`** | Presentes en el 100% de páginas públicas, con longitudes adecuadas entre 95 y 166 caracteres. | **2** |
| **5. Encabezados** | **Fallas severas:** La portada renderiza **cuatro `<h1>`** simultáneos en el carrusel; `/preguntas-frecuentes/` salta de `<h1>` a `<h3>`; `/politica-privacidad/` salta de `<h2>` a `<h4>`. | **0** |
| **6. URLs** | Limpias, en minúsculas, sin caracteres especiales ni extensiones expuestas; `/index.html` redirige con 307 a `/`. | **2** |
| **7. Enlazado interno** | No hay enlaces rotos; sin embargo, el post del blog está aislado (1 solo enlace entrante) y 3 páginas de servicios carecen de enlaces cruzados enriquecidos. | **1** |
| **8. Sitemap** | Declarado en `robots.txt` con 15 URLs canónicas; **carece por completo de marcas `<lastmod>`** para frescura de rastreo. | **1** |
| **9. `robots.txt`** | Idéntico en el repositorio y en producción; permite rastreo general y enlaza al sitemap sin directivas bloqueantes erróneas. | **2** |
| **10. Redirecciones y HTTP en prod** | `www` redirige a la raíz (301); `/contacto` añade barra final (307). **Fallas:** `http://` **no redirige a https://** (devuelve 200 OK en texto plano) y las URLs inexistentes devuelven 404 vacío de 0 bytes. | **1** |
| **11. Idioma y región** | Marcado con `<html lang="es">` y `<meta property="og:locale" content="es_BO">`. | **2** |
| **12. Open Graph / Twitter** | **Falla crítica:** La imagen por defecto `/og-default.png` declarada en `BaseLayout.astro` **no existe** en el servidor (devuelve 404 al compartir enlaces). | **0** |
| **13. Imágenes** | Astro optimiza dimensiones y formatos WebP en componentes internos; sin embargo, existen archivos como `lapaz-skyline.jpg` (1.09 MB) y `66116.jpg` (1.0 MB) que no han sido reducidos en origen. | **1** |
| **14. Datos estructurados** | Sintaxis JSON-LD válida; no obstante, el `logo` apunta a `favicon.ico` (incumple directrices de Google), falta `WebSite`, faltan campos `image` y `dateModified` en `BlogPosting`. | **1** |
| **15. Core Web Vitals (proxies)** | `viewport` correcto; JavaScript ligero; pero la carga de Google Fonts genera una advertencia de compilación y potenciales saltos de renderizado (FOUT), y los slides del Hero alternan nodos visibles. | **1** |
| **16. Seguridad como señal SEO** | Certificado SSL operativo en Cloudflare, pero la falta de redirección HTTP forzada y la ausencia de cabecera HSTS reducen la puntuación de seguridad. | **1** |
| **17. Verificación en buscadores** | No existe etiqueta meta de Google Search Console ni Bing Webmaster en el código (pendiente de verificación por DNS o manual). | **0** |

**Puntuación global SEO Técnico:** **20 / 34 puntos** = **1.18 / 2.00** (58.8%).

---

## 6. SEO de contenido, local y autoridad

### 6.1 Mapa de intención de búsqueda por página (Hipótesis)

| URL | Tema principal | Intención | Consulta probable de usuario en Bolivia | Diagnóstico / Canibalización |
|---|---|---|---|---|
| `/` | Estudio jurídico DLA en seguros | Comercial | "abogado de seguros en bolivia", "defensa legal asegurados" | Cubre marca general; diluida por falta de contenido en subpáginas. |
| `/areas-de-practica/` | Catálogo de servicios legales | Comercial | "servicios legales seguros bolivia", "derecho de seguros la paz" | Página pilar adecuada con enlaces a las 4 ramas. |
| `/areas-de-practica/impugnacion-de-rechazos/` | Rechazo de siniestros | Transaccional | "que hacer si la aseguradora no quiere pagar bolivia", "impugnar rechazo de seguro" | **Página de máxima conversión**; requiere mayor profundidad normativa. |
| `/areas-de-practica/seguros-generales/` | Pólizas patrimoniales e incendio | Comercial | "abogado seguro contra incendios bolivia", "siniestro transporte carga reclamo" | **Contenido delgado (24 palabras)**. Alto riesgo de abandono. |
| `/areas-de-practica/seguros-de-personas/` | Vida, salud y SOAT | Comercial | "abogado seguro desgravamen bolivia", "reclamo indemnizacion soat" | **Contenido delgado (20 palabras)**. No responde dudas reales. |
| `/areas-de-practica/fianzas-y-caucion/` | Boletas y pólizas de garantía | Comercial | "ejecucion boleta de garantia contrataciones estatales", "fianza cumplimiento contrato" | **Contenido delgado (33 palabras)**. |
| `/proceso/` | Metodología de trabajo y etapas | Informativa | "como reclamar a la aseguradora en bolivia", "etapas reclamo seguro aps" | Buen contenido explicativo sobre el diagnóstico y vía administrativa. |
| `/preguntas-frecuentes/` | Dudas legales recurrentes | Informativa | "plazo para avisar siniestro codigo comercio", "como denunciar a la aseguradora en la aps" | Excelente valor informativo; 5 preguntas clave con referencias legales. |
| `/resultados/` | Casos de éxito y efectividad | Comercial / Confianza | "abogados de seguros con experiencia bolivia casos ganados" | **Ficticia en producción**: los testimonios y casos son textos de prueba. |
| `/sobre-mi/` | Perfil del abogado Ramiro G. Castro | Autoridad / Marca | "ramiro guillermo castro abogado seguros", "quien es el abogado de dla seguros" | Perfil enfocado en trayectoria (25+ años); respeta directiva A11. |
| `/blog/ejemplo-post/` | Guía de actuación ante rechazo | Informativa | "pasos para impugnar rechazo de seguro bolivia aps" | Excelente artículo técnico; huérfano de enlazado cruzado. |
| `/contacto/` | Agendamiento de evaluación legal | Transaccional | "consulta abogado seguros la paz telefono whatsapp" | Formulario y enlaces a WhatsApp funcionales. |

### 6.2 Cobertura temática y huecos
- **Huecos temáticos severos:** Existen términos de altísima demanda en controversias aseguradoras en Bolivia que carecen de página o sección dedicada:
  1. *Seguro de Desgravamen Hipotecario:* Rechazos por enfermedades preexistentes o exclusiones no informadas al momento de contratar el crédito bancario.
  2. *SOAT y SOATC:* Cobertura médica y de fallecimiento en accidentes de tránsito, y procedencia de reclamos ante negativas de la entidad administradora (UNIVIDA).
  3. *Seguro Automotor:* Discrepancias en liquidación por pérdida total o depreciación de repuestos.
  4. *Garantías en Contrataciones Estatales:* Ejecución indebida de pólizas de correcta inversión de anticipo o cumplimiento de contrato bajo la normativa del D.S. 0181 (SICOES).

### 6.3 Consistencia NAP (Nombre, Dirección, Teléfono) y SEO Local
- **Nombre:** Altamente consistente: *"DLA — Defensa Legal del Asegurado"* y *"Ramiro Guillermo Castro"* en footer, metadatos, schema y textos.
- **Dirección (oficina física):**
  - Declarada de forma unificada en `src/data/oficina.ts` a partir de `general.json`: *"Calle Ballivián #1456, Edificio Cervantes, Mezanine 2, Oficina 4 (Entre calles Loayza y Bueno), La Paz, Bolivia"*.
  - Aparece idéntica en `/contacto/`, `/aviso-legal/`, `/politica-privacidad/` y JSON-LD.
- **Teléfono / WhatsApp:**
  - `59157001099` (enlaces `wa.me/59157001099` y marcado telefónico internacional `+59157001099`).
- **Coherencia geográfica y ciudades:**
  - El sitio anuncia cobertura en *"La Paz, Santa Cruz, Cochabamba y toda Bolivia"*.
  - **Riesgo:** En `llms.txt:21` se afirma *"Atención presencial en La Paz, Santa Cruz y Cochabamba"*. Si un cliente o una IA interpreta que existe una oficina física en Santa Cruz o Cochabamba, se generará una expectativa frustrada, pues el despacho opera presencialmente solo en La Paz y atiende al interior de forma remota o mediante traslados específicos.
- **Directiva A11 (Sin Google Business Profile por ahora):**
  - Dado que el cliente no desea abrir ficha de GBP en esta etapa, el posicionamiento local debe reforzarse mediante:
    1. Registro profesional y menciones en directorios de abogados y colegios profesionales locales (Colegio de Abogados de La Paz - ICALP).
    2. Creación y verificación de la página oficial de Facebook con NAP idéntico.
    3. Citas de la dirección física completa en el pie de página de todas las comunicaciones y artículos.

### 6.4 Autoridad y Confianza (E-E-A-T) bajo la directiva A11
- Al tratarse de un sitio de categoría **YMYL (Your Money or Your Life)** enfocado en finanzas y litigio de seguros, los buscadores y usuarios exigen credenciales sólidas.
- Respetando la decisión de no publicar la universidad ni títulos académicos específicos:
  - **Puntos fuertes:** Se acredita de forma consistente la trayectoria de más de 25 años de ejercicio exclusivo en Derecho de Seguros; se citan artículos específicos de la legislación boliviana (Ley de Seguros N° 1883, Código de Comercio Art. 1028) y el rol de la APS.
  - **Puntos a corregir:**
    1. Las estadísticas publicadas (95% de efectividad, 82% en vía administrativa) carecen de un texto metodológico o descargo legal formal (en el código existe un comentario `TODO: validar con el abogado la redacción exacta del disclaimer`).
    2. La sección `/resultados/` pierde credibilidad al mostrar textos de prueba (*"TODO: reemplazar con caso real"*). Deben sustituirse por resúmenes fácticos de controversias resueltas (omitiendo nombres de partes para preservar el secreto profesional).

---

## 7. AEO — Optimización para motores de respuesta e IA

### 7.1 Acceso y rastreo de motores de IA (Pruebas en producción)
[VERIFICADO mediante solicitudes HEAD con `scratch/test_ai_crawlers.cjs` y `curl`]

| Agente / Rastreador de IA | User-Agent enviado | Regla en `robots.txt` | Código HTTP en `/` | Código HTTP en `/llms.txt` | Diagnóstico de acceso |
|---|---|---|:---:|:---:|---|
| **GPTBot** (OpenAI) | `Mozilla/5.0... GPTBot/1.2` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **OAI-SearchBot** (OpenAI Search) | `Mozilla/5.0... OAI-SearchBot/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **ChatGPT-User** (Navegación ChatGPT) | `Mozilla/5.0... ChatGPT-User/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **ClaudeBot** (Anthropic) | `Mozilla/5.0... ClaudeBot/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Claude-User** (Anthropic) | `Mozilla/5.0... Claude-User/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Claude-SearchBot** (Anthropic) | `Mozilla/5.0... Claude-SearchBot/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **PerplexityBot** (Perplexity AI) | `Mozilla/5.0... PerplexityBot/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Perplexity-User** (Perplexity AI) | `Mozilla/5.0... Perplexity-User/1.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Google-Extended** (Google Gemini) | `Mozilla/5.0... Google-Extended` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Googlebot** (Google Search) | `Mozilla/5.0... Googlebot/2.1` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Bingbot** (Microsoft Copilot) | `Mozilla/5.0... bingbot/2.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Applebot-Extended** (Apple Intelligence) | `Mozilla/5.0... Applebot-Extended/0.1` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **CCBot** (Common Crawl) | `CCBot/2.0` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |
| **Bytespider** (ByteDance) | `Mozilla/5.0... Bytespider` | Permitido (`*`) | **200 OK** | **200 OK** | Acceso libre en el borde. |

> [!NOTE]
> *Advertencia sobre pruebas de agente:* El resultado de cabecera HTTP refleja que Cloudflare no bloquea de forma indiscriminada por User-Agent simulado. Sin embargo, los rastreadores reales emplean rangos de IP específicos y validaciones criptográficas inversas. Se clasifica como **[INFERIDO]** para verificar en el panel de Cloudflare (sección *AI Scrapers and Crawlers*).

### 7.2 Legibilidad sin JavaScript y respuesta directa (*Answer-First*)
- **Sin JavaScript:** [VERIFICADO] El 100% del contenido esencial (textos de servicios, fases de la ruta crítica, términos de privacidad y preguntas frecuentes) se encuentra directamente impreso en el HTML inicial generado por Astro. Los acordeones de `/preguntas-frecuentes/` utilizan las etiquetas semánticas nativas `<details>` y `<summary>`, lo que garantiza que los motores de IA y extractores de texto lean la respuesta completa sin ejecutar JavaScript.
- **Formato directo (40–60 palabras):**
  - `/preguntas-frecuentes/` cumple fielmente la metodología *answer-first*: cada una de las 5 respuestas inicia con un párrafo conciso de entre 42 y 58 palabras con datos procesables.
  - `/blog/ejemplo-post/` arranca con una síntesis clara del problema y enumera documentalmente qué hacer.
  - En contraste, las 3 páginas de servicios (`seguros-generales`, `seguros-de-personas`, `fianzas-y-caucion`) carecen de respuestas específicas, impidiendo que una IA las use como fuente informativa de autoridad.

### 7.3 Claridad de entidad y Grafo de conocimiento JSON-LD
- **Entidades vinculadas:**
  - `LegalService` (`@id`: `https://defensalegaldelasegurado.com/#organization`)
  - `Person` (`@id`: `https://defensalegaldelasegurado.com/#person-castro`) con relación bidireccional `worksFor`.
- **Deficiencias detectadas para IA:**
  1. No existe entidad `WebSite` con directivas de búsqueda ni metadatos de publicación general.
  2. No existen propiedades `sameAs` hacia entidades externas verificables (como colegios de abogados, registros públicos o redes sociales confirmadas).
  3. La propiedad `logo` enlaza a `favicon.ico`, lo cual no es procesado como logotipo corporativo por Google ni por modelos multimodales.
  4. La entidad `OfferCatalog` no vincula las ofertas con las URLs directas de cada servicio (`url: "https://defensalegaldelasegurado.com/areas-de-practica/..."`).

### 7.4 Evaluación de `public/llms.txt`
- **Formato:** Texto plano servido correctamente con cabecera `Content-Type: text/plain` en producción [VERIFICADO].
- **Discrepancia crítica:** Afirma *"Atención presencial en La Paz, Santa Cruz y Cochabamba"*. La oficina física se encuentra únicamente en La Paz. Una IA generativa que lea este archivo responderá a usuarios que pueden acudir físicamente a una oficina inexistente en Santa Cruz o Cochabamba.
- **Falta de hipervínculos estructurados:** En lugar de presentar únicamente listas de texto plano, la especificación de `llms.txt` recomienda enlazar las URLs canónicas completas en formato Markdown para que el agente de búsqueda pueda indexar las fuentes directas.

### 7.5 Puntuación AEO

| Criterio AEO | Observación | Puntuación (0–2) |
|---|---|:---:|
| **1. Accesibilidad de rastreo** | Todos los bots de IA evaluados responden 200 OK en portada y `llms.txt`. | **2** |
| **2. Contenido sin JavaScript** | HTML 100% estático; preguntas y respuestas visibles sin hidratación de scripts. | **2** |
| **3. Formato respuesta directa** | Preguntas frecuentes excelentes; páginas de servicios casi vacías de contenido útil. | **1** |
| **4. Claridad de entidad** | Entidades `LegalService` y `Person` bien conectadas; falta `WebSite`, falta `sameAs`. | **1** |
| **5. Datos estructurados para IA** | Sintaxis válida, pero faltan campos en artículos (`image`, `dateModified`) y catálogo de servicios. | **1** |
| **6. Frescura de información** | Solo un artículo publicado en agosto de 2026; sin fechas de actualización en páginas. | **0** |
| **7. Hechos citables y normativa** | Cita Código de Comercio y APS, pero las estadísticas de efectividad carecen de fuente. | **1** |
| **8. Calidad de `llms.txt`** | Presente y accesible, pero contiene afirmaciones inexactas sobre oficinas en otras ciudades. | **1** |
| **9. Señales fuera del sitio** | Sin redes activas, sin enlaces de directorios, sin ficha de verificación externa. | **0** |

**Puntuación global AEO:** **9 / 18 puntos** = **1.00 / 2.00** (50.0%).

---

### 7.6 Batería de pruebas manuales para motores de IA (Lista para ejecutar)

> [!TIP]
> Esta plantilla debe ser completada por el responsable del proyecto ejecutando cada consulta en los motores indicados (ChatGPT con navegación, Perplexity AI, Gemini y Google AI Overviews), documentando si la IA cita a DLA o a competidores del mercado boliviano.

| # | Pregunta en español (Intención de usuario en Bolivia) | Motor evaluado | ¿Menciona a DLA? (Sí/No) | ¿Cita la URL del sitio? | ¿Qué fuentes o competidores cita? | ¿La información sobre DLA es exacta? | Fecha de prueba |
|---|---|---|:---:|:---:|---|---|:---:|
| 1 | ¿Qué puedo hacer si la aseguradora rechaza la cobertura de mi siniestro en Bolivia? | Perplexity / ChatGPT | | | | | |
| 2 | ¿Cuál es el plazo legal para avisar un siniestro según el Código de Comercio de Bolivia? | Gemini / Copilot | | | | | |
| 3 | ¿Cómo se presenta un reclamo formal ante la APS contra una compañía de seguros? | ChatGPT / Perplexity | | | | | |
| 4 | ¿Quién es el mejor abogado especialista en Derecho de Seguros en La Paz Bolivia? | Perplexity / Gemini | | | | | |
| 5 | ¿Qué es DLA Defensa Legal del Asegurado en Bolivia? | ChatGPT / Gemini | | | | | |
| 6 | ¿Quién es el abogado Ramiro Guillermo Castro en La Paz? | Perplexity / Copilot | | | | | |
| 7 | ¿Se puede impugnar la ejecución de una boleta de garantía de cumplimiento de contrato en Bolivia? | ChatGPT / Gemini | | | | | |
| 8 | ¿Qué cubre y qué excluye el seguro de desgravamen hipotecario en bancos bolivianos? | Perplexity / ChatGPT | | | | | |
| 9 | ¿Qué pasa si una aseguradora no responde en el plazo de 15 o 30 días en Bolivia? | Gemini / Copilot | | | | | |
| 10 | ¿Qué hacer ante la negativa de cobertura del SOAT en un accidente de tránsito en Bolivia? | ChatGPT / Perplexity | | | | | |
| 11 | ¿Dónde queda la oficina de DLA Defensa Legal del Asegurado? | Gemini / Perplexity | | | | | |
| 12 | ¿DLA Seguros tiene oficina física en Santa Cruz o Cochabamba? | ChatGPT / Gemini | | | | | |
| 13 | ¿Cómo apelar una resolución de rechazo de siniestro emitida por una aseguradora privada? | Perplexity / Copilot | | | | | |
| 14 | ¿Qué porcentaje de recupero o éxito tiene la firma DLA en reclamos de seguros? | ChatGPT / Gemini | | | | | |
| 15 | ¿Qué diferencia existe entre un reclamo administrativo ante la APS y un arbitraje comercial? | Perplexity / Gemini | | | | | |
| 16 | ¿Cuáles son las causales más comunes de rechazo de siniestros vehiculares en Bolivia? | Copilot / ChatGPT | | | | | |
| 17 | Abogado para demandar a compañía de seguros por incumplimiento de póliza en Bolivia | Perplexity / Gemini | | | | | |
| 18 | ¿Es obligatorio contratar abogado para presentar un reclamo ante la APS? | ChatGPT / Copilot | | | | | |
| 19 | Contacto de WhatsApp para asesoría urgente en siniestros de seguros La Paz | Perplexity / Gemini | | | | | |
| 20 | Teléfono y correo del abogado Ramiro Castro especialista en seguros | ChatGPT / Perplexity | | | | | |

---

## 8. Formulario y backend

### 8.1 Análisis del flujo en `src/pages/contacto.astro` y `src/worker/index.js`
- **Validación del lado cliente (`contacto.astro:56-119`):**
  - Campos obligatorios: `nombre`, `tipoCaso`, `telefono`, `consentimiento` (checkbox).
  - Campos opcionales: `aseguradora`, `email`, `mensaje`.
  - Campo trampa (*Honeypot*): `<input type="text" id="website" name="website" tabindex="-1">`.
  - Manejo de interfaz: Botón de envío bloquea doble clic (`disabled`), muestra spinner y despliega componentes Toast de éxito o error con botón de reintento y enlace directo a WhatsApp.
- **Validación del lado servidor (`src/worker/index.js:77-149`):**
  - Requiere `Content-Type: application/json`.
  - Captura y descarta bots silenciosamente: `if (data.website) return jsonResponse({ ok: true }, 200)`.
  - Revalida obligatoriedad de `nombre`, `tipoCaso` y `telefono`.
  - Valida la existencia de la variable de entorno `env.APPS_SCRIPT_URL`.
- **Destino de los datos y fallos de entrega:**
  - El Worker reenvía la petición mediante `fetch(env.APPS_SCRIPT_URL, { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify(...) })` hacia un webhook de **Google Apps Script** conectado a una hoja de cálculo de Google Sheets.
  - **Puntos vulnerables:**
    1. Si Google Apps Script responde con error o falla de red, el Worker devuelve HTTP 502. **No existe una cola de reintentos, base de datos local ni respaldo por correo electrónico**, por lo que los datos del cliente potencial se pierden irremediablemente.
    2. No se registra ninguna traza en logs (`console.log`) ni en Cloudflare KV / D1.
- **Control de abuso y spam:**
  - **No existe Rate Limiting** en el Worker ni regla de límite de peticiones en Cloudflare. Un atacante puede enviar miles de peticiones automatizadas a `/api/contacto`.
  - No cuenta con Cloudflare Turnstile ni verificación CAPTCHA.
- **Trazabilidad del consentimiento:**
  - En el formulario web existe la casilla obligatoria: `<input type="checkbox" name="consentimiento" required />`.
  - Sin embargo, en el script cliente (`contacto.astro:881-888`) el valor de `consentimiento` **no se incluye en el payload JSON**. Por ende, la hoja de cálculo receptora nunca registra la fecha, hora, IP ni constancia afirmativa de la aceptación de la Política de Privacidad.

---

## 9. Seguridad e infraestructura

### 9.1 Secretos y variables de entorno
[VERIFICADO en archivos y código fuente]
- **En el sistema de archivos:**
  - `.env`: Contiene únicamente el nombre de variable `PUBLIC_CONTACT_FORM_ENDPOINT`.
  - `.dev.vars`: Contiene únicamente el nombre de variable `APPS_SCRIPT_URL`.
  - Ambos archivos están correctamente incluidos en `.gitignore` [VERIFICADO: `.gitignore:4,6`].
- **Variables esperadas en Cloudflare Workers (`src/worker/index.js`):**
  1. `GITHUB_CLIENT_ID`: Identificador de la aplicación OAuth de GitHub.
  2. `GITHUB_CLIENT_SECRET`: Clave secreta OAuth de GitHub (valor omitido, regla A4).
  3. `APPS_SCRIPT_URL`: URL del script de Google Apps Script (valor omitido, regla A4).
- **Inspección del historial de Git (`git log -p`):** No se detectaron tokens activos commiteados en el historial reciente.

### 9.2 Decap CMS y autenticación OAuth
- **Configuración (`public/admin/config.yml`):**
  - `backend.name: github`
  - `backend.repo: sitiosbo/dla-castro`
  - `backend.branch: main`
  - `backend.base_url: https://defensalegaldelasegurado.com`
  - `backend.auth_endpoint: /api/auth`
- **Implementación en Worker (`src/worker/index.js:1-66`):**
  - Maneja `/api/auth` redirigiendo a `https://github.com/login/oauth/authorize`.
  - Solicita el alcance (*scope*): `repo user`.
  - Maneja `/api/callback` intercambiando el `code` por un `access_token` de GitHub y enviándolo a la ventana matriz vía `window.opener.postMessage`.
  - **Riesgo de seguridad en `renderCallbackBody`:** Utiliza `window.opener.postMessage("authorizing:github", "*")` con destino comodín `*` en lugar de restringir el origen a `https://defensalegaldelasegurado.com`.

### 9.3 Cabeceras de seguridad HTTP y CSP en producción
[VERIFICADO mediante solicitud a `https://defensalegaldelasegurado.com/`]
- `Strict-Transport-Security` (HSTS): **Ausente**.
- `Content-Security-Policy` (CSP): **Ausente**.
- `X-Content-Type-Options`: **Ausente**.
- `X-Frame-Options` / `frame-ancestors`: **Ausente**.
- `Referrer-Policy`: **Ausente**.
- `Permissions-Policy`: **Ausente**.
- El archivo `public/_headers` **no existe** en el repositorio. El Worker se limita a delegar en `env.ASSETS.fetch(request)` sin inyectar cabeceras de respuesta de seguridad.

### 9.4 Configuración del Worker (`wrangler.jsonc`)
- `compatibility_date: "2025-01-01"`.
- `run_worker_first: true`. Todas las peticiones pasan primero por el Worker.
- El orden de enrutamiento evalúa `/api/auth`, `/api/callback` y `POST /api/contacto`. Todo lo demás es transferido a `env.ASSETS.fetch(request)`. Por esta razón, `/robots.txt`, `/llms.txt`, `/sitemap-index.xml` y los archivos estáticos se entregan sin interferencias.

---

## 10. Privacidad y consentimiento

### 10.1 Gestión de cookies y Google Analytics
- **Implementación (`src/components/CookieBanner.astro`):**
  - Identificador: `G-KH9TYCX64Y`.
  - [VERIFICADO] Google Analytics **no** se ejecuta en la carga inicial. Se inicializa dinámicamente mediante `loadAnalytics()` solo si el usuario pulsa "Aceptar".
  - Si el usuario pulsa "Rechazar", se marca `window['ga-disable-G-KH9TYCX64Y'] = true` y se eliminan las cookies de rastreo existentes (`_ga`, `_ga_XXXX`, `_gid`).
  - La decisión se almacena en `localStorage` con clave `dla_cookie_consent_v1` por un periodo de 12 meses.
  - Enlace de revocación: Existe el botón "Configuración de cookies" en el pie de página (`Footer.astro`), el cual reabre el banner para cambiar la decisión en cualquier momento.

### 10.2 Conexiones y solicitudes a terceros
1. **Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`):** Se solicitan de manera incondicional en todas las páginas públicas desde `BaseLayout.astro:109-124`. Esto transfiere la dirección IP del visitante a los servidores de Google sin previo consentimiento.
2. **Google Tag Manager / Analytics (`googletagmanager.com`):** Condicionado al consentimiento en el banner de cookies.
3. **Cloudflare Web Analytics (`static.cloudflareinsights.com`):** Inyectado automáticamente por la red de borde de Cloudflare. No utiliza cookies ni almacena datos personales identificables.
4. **Decap CMS (`unpkg.com`):** Se carga exclusivamente en la ruta `/admin/` para el panel de administración.

---

## 11. Rendimiento

### 11.1 Peso de activos e imágenes en `dist/`
[VERIFICADO mediante script `scratch/analyze_performance.cjs`]
- **Las 10 imágenes más pesadas en `dist/`:**
  1. `images/lapaz-skyline.jpg`: **1,093.17 KB (1.09 MB)** — JPG sin compresión web moderna en carpeta `public/`.
  2. `_astro/especialista-ramos.CYc4q-EW.jpg`: **887.41 KB** — Foto de retrato en alta resolución.
  3. `_astro/defensa-integral.CUtHehEL.jpg`: **525.22 KB** — Foto de portada institucional.
  4. `_astro/lapaz-skyline.Db2UqlBZ_Z1nFSyn.webp`: **254.44 KB** — Versión WebP de la cabecera.
  5. `_astro/66116.DpTI_PdM_18n39O.webp`: **136.05 KB** — Portada del blog.
  6. `_astro/ramos-sellos.BGfVw4hq_Z2g3uND.webp`: **72.86 KB**.
  7. `_astro/defensa-edificio.DRq__36u_Z2sGXMB.webp`: **66.80 KB**.
  8. `_astro/hero-defensa.B63pEVdy_Z173s67.webp`: **66.67 KB**.
  9. `_astro/hero-defensa.B63pEVdy_Z1TaY2N.webp`: **57.93 KB**.
  10. `_astro/ramiro-castro.CESmRkjS_1fWNub.webp`: **57.67 KB**.
- **Diagnóstico:** Los tres archivos más pesados suman más de 2.5 MB de los 4.7 MB totales del sitio. La imagen `public/images/lapaz-skyline.jpg` debe eliminarse o reemplazarse por una versión WebP comprimida de menos de 100 KB.

### 11.2 Activos CSS y JavaScript
- **JavaScript compilado:** El sitio entrega un promedio de apenas 4 a 10 KB de JS por página (fragmentos *hoisted* de interactividad mínima: banner de cookies, menú móvil y formulario). Cumple con el estándar de rendimiento estático de Astro.
- **CSS compilado:** El archivo CSS principal de la portada tiene 39.80 KB, mientras que las subpáginas cargan entre 4 KB y 17 KB de CSS purgado por Tailwind.

---

## 12. Accesibilidad

### 12.1 Jerarquía semántica y etiquetas de referencia
- **Etiqueta `<main>` anidada (Violación de especificación W3C):**
  - `BaseLayout.astro:131` envuelve todo el contenido de las páginas con `<main class="site-main"><slot /></main>`.
  - Sin embargo, **10 páginas y layouts internos declaran un segundo `<main>` dentro del slot**:
    1. `src/layouts/AreaLayout.astro:123` (`<main class="area-main">`) → Afecta a las 4 subpáginas de servicios.
    2. `src/pages/areas-de-practica/index.astro:46` (`<main class="pillar-main">`).
    3. `src/pages/blog/index.astro:58` (`<main class="blog-main">`).
    4. `src/pages/blog/[...slug].astro:95` (`<main class="article-main">`).
    5. `src/pages/contacto.astro:46` (`<main class="contacto-main">`).
    6. `src/pages/preguntas-frecuentes.astro:88` (`<main class="faq-main">`).
    7. `src/pages/sobre-mi.astro:54` (`<main class="about-main">`).
- **Nivel de encabezados:**
  - `/` (Home): Presenta 4 encabezados `<h1>` simultáneos por el carrusel en `Hero.astro`.
  - `/preguntas-frecuentes/`: Salta directamente de `<h1>` a `<h3>` en el banner de pie de página.
  - `/politica-privacidad/`: Salta de `<h2>` a `<h4>` en la cláusula 7.
- **Enlace "Saltar al contenido" (*Skip to content*):** Ausente en `BaseLayout.astro`. Los usuarios que navegan mediante teclado se ven forzados a tabular por todos los enlaces de la cabecera en cada recarga.

### 12.2 Razones de contraste de color (WCAG 2.1)
[VERIFICADO mediante cálculo en `scratch/contrast_ratios.cjs`]

| Par de colores evaluado | Color de texto | Color de fondo | Razón calculada | Cumplimiento WCAG AA Normal (4.5:1) | Cumplimiento WCAG AA Grande (3.0:1) |
|---|:---:|:---:|:---:|:---:|:---:|
| `ink-600` sobre blanco (cuerpo de texto) | `#4A5568` | `#FFFFFF` | **7.53 : 1** | **PASA** | **PASA** |
| `ink-400` sobre blanco (metadatos/fechas) | `#6B7A90` | `#FFFFFF` | **4.36 : 1** | **FALLA** ⚠️ | **PASA** |
| `navy-800` sobre blanco (encabezados/títulos) | `#1B2A5B` | `#FFFFFF` | **13.74 : 1** | **PASA** | **PASA** |
| `terracotta-600` sobre blanco (enlaces) | `#B5622C` | `#FFFFFF` | **4.42 : 1** | **FALLA** ⚠️ | **PASA** |
| `white` sobre `terracotta-600` (texto de botones CTA) | `#FFFFFF` | `#B5622C` | **4.42 : 1** | **FALLA** ⚠️ | **PASA** |
| `white` sobre `navy-950` (fondo hero y pie) | `#FFFFFF` | `#0F1B3D` | **16.87 : 1** | **PASA** | **PASA** |
| `cream-100` sobre `navy-950` (insignias y etiquetas) | `#F7EAC8` | `#0F1B3D` | **14.11 : 1** | **PASA** | **PASA** |

> [!WARNING]
> La variable `--color-ink-400` en `tokens.css:18` incluye un comentario que afirma `/* texto secundario, captions, metadata — WCAG AA 5.2:1 */`. Sin embargo, la razón matemática real del valor hexadecimal `#6B7A90` es **4.36:1**, quedando por debajo del mínimo de 4.5:1 exigido para texto normal.

---

## 13. Lo que existe hoy (inventario de funcionalidades)

En términos operativos para una persona no técnica, el sitio web ofrece hoy las siguientes capacidades:
1. **Presentación corporativa de la marca DLA:** Página de inicio estructurada con propuesta de valor, cifras de experiencia, áreas de trabajo y llamado a la acción.
2. **Navegación completa e institucional:** 15 páginas públicas que abarcan Áreas de Práctica, Proceso Jurídico, Preguntas Frecuentes, Sobre el Abogado, Resultados, Blog y Contacto.
3. **Formulario de evaluación jurídica en línea:** Los clientes potenciales pueden enviar sus datos de contacto y detalles de su siniestro, los cuales son recibidos mediante un script y almacenados en una hoja de Google Sheets.
4. **Botón directo de WhatsApp flotante:** Acceso inmediato a chat por WhatsApp con mensaje precargado en todas las páginas, adaptado para no tapar el pie de página ni el aviso de cookies.
5. **Panel administrativo de contenidos (Decap CMS):** Módulo en `/admin/` para que el abogado pueda redactar artículos de blog y modificar teléfonos o direcciones sin manipular código.
6. **Cumplimiento legal y banner de cookies:** Aviso de consentimiento que no activa las estadísticas de Google Analytics hasta que el usuario hace clic en "Aceptar".
7. **Documentación pública de privacidad y aviso legal:** Cláusulas sobre tratamiento de datos personales adaptadas a la legislación boliviana y directrices profesionales.

---

## 14. Lo que falta o está incompleto

Las áreas pendientes o no aptas para una campaña de promoción formal son:
1. **Contenido de las áreas de práctica:** 3 de las 4 especialidades legales carecen de desarrollo (tienen una sola frase redactada).
2. **Casos reales y testimonios:** La página de resultados y la sección de testimonios exhiben datos de prueba con la etiqueta visible "TODO".
3. **Tarjeta de previsualización en redes sociales (Open Graph):** Al enviar cualquier enlace del sitio por WhatsApp, Facebook o LinkedIn, no aparece imagen descriptiva porque el archivo `/og-default.png` no existe.
4. **Página de error 404:** Escribir una dirección errónea muestra una pantalla en blanco en lugar de un mensaje orientativo con botones para volver al inicio.
5. **Seguridad en la conexión web (HTTPS forzado):** El dominio permite el acceso mediante el protocolo antiguo no cifrado `http://` sin redirigir al candado seguro.
6. **Perfiles reales de redes sociales:** Los íconos en el pie de página conducen a las portadas generales de Instagram, TikTok y LinkedIn.
7. **Consistencia de presencia física en `llms.txt`:** El archivo de inteligencia artificial indica que se atiende en persona en 3 ciudades, cuando en realidad solo existe oficina en La Paz.
8. **Trazabilidad en el formulario:** No se guarda constancia técnica ni fecha de la aceptación de las políticas por parte de los consultantes.

---

## 15. Registro completo de hallazgos

| ID | Área | Severidad | Estado | Evidencia | Descripción | Recomendación | Esfuerzo |
|---|---|:---:|:---:|---|---|---|:---:|
| `H-001` | Contenido | **P0** | [VERIFICADO] | `src/content/servicios/`: `fianzas-y-caucion.md:9-11`, `seguros-de-personas.md:9-11`, `seguros-generales.md:9-11` | Tres áreas de práctica tienen solo una oración de contenido y marcas `TODO`. | Redactar el contenido técnico-legal completo con casos, preguntas y marco legal de cada área. | M |
| `H-002` | Contenido | **P0** | [VERIFICADO] | `src/content/casos/ejemplo-caso.md:2-5`, `src/content/testimonios/ejemplo-testimonio.md:4-5` | Las colecciones de casos y testimonios contienen maquetas con textos literales `TODO: reemplazar con caso real`. | Cargar al menos 2 a 3 casos reales anonimizados y testimonios autorizados por el abogado. | S |
| `H-003` | SEO técnico | **P1** | [VERIFICADO] | `src/layouts/BaseLayout.astro:26`, petición a `https://defensalegaldelasegurado.com/og-default.png` (HTTP 404) | La imagen Open Graph por defecto `/og-default.png` no existe, rompiendo previsualizaciones sociales. | Diseñar y colocar una imagen institucional de 1200×630 px en `public/og-default.png`. | S |
| `H-004` | Seguridad | **P1** | [VERIFICADO] | `curl -sI http://defensalegaldelasegurado.com` devuelve `HTTP/1.1 200 OK` | El sitio no redirige HTTP a HTTPS en producción; Cloudflare sirve tráfico sin cifrado. | Activar la directiva "Always Use HTTPS" y habilitar HSTS en el panel de Cloudflare. | S |
| `H-005` | SEO / Infra | **P1** | [VERIFICADO] | `wrangler.jsonc:9`, ausencia de `src/pages/404.astro`, petición inexistente devuelve 0 bytes | No existe página de error 404; el servidor entrega una pantalla en blanco de 0 bytes ante URLs inválidas. | Crear `src/pages/404.astro` con navegación clara y enlace de regreso al inicio. | S |
| `H-006` | SEO técnico | **P1** | [VERIFICADO] | `src/components/Hero.astro:100-110`, `dist/index.html` | La portada renderiza 4 encabezados `<h1>` simultáneamente en los slides del carrusel. | Dejar un único `<h1>` fijo y cambiar los textos de los demás slides a `<p class="hero-h1">` o `<span>`. | S |
| `H-007` | Accesibilidad | **P1** | [VERIFICADO] | `src/layouts/BaseLayout.astro:131`, `AreaLayout.astro:123`, `contacto.astro:46`, etc. | 10 páginas tienen una etiqueta `<main>` anidada dentro del `<main>` principal de BaseLayout. | Reemplazar las etiquetas `<main>` internas de páginas y layouts por `<section>` o `<div>`. | S |
| `H-008` | AEO | **P1** | [VERIFICADO] | `public/llms.txt:21` vs `src/content/settings/general.json:12-22` | `llms.txt` afirma atención presencial en Santa Cruz y Cochabamba sin tener oficina publicada allí. | Ajustar el texto indicando oficina física en La Paz y patrocinio legal a distancia para el resto del país. | S |
| `H-009` | CMS | **P1** | [VERIFICADO] | `public/admin/index.html:14` | Decap CMS intenta cargar `/src/styles/tokens.css`, archivo que no existe en `dist/` (404). | Compilar o enlazar una hoja de estilos estática válida en `public/admin/` para las vistas previas. | S |
| `H-010` | Privacidad | **P1** | [VERIFICADO] | `src/pages/contacto.astro:881-888`, `src/worker/index.js:117-124` | El formulario exige marcar el consentimiento de privacidad, pero este dato no se envía al backend ni a Google Sheets. | Incluir en el payload `consentimiento: true`, timestamp y versión de la política de privacidad. | S |
| `H-011` | Seguridad | **P2** | [VERIFICADO] | `https://defensalegaldelasegurado.com/` (cabeceras de producción) | Ausencia total de cabeceras de seguridad HTTP (`Strict-Transport-Security`, CSP, X-Frame-Options, X-Content-Type). | Configurar cabeceras de seguridad en Cloudflare o a través del Worker en `env.ASSETS.fetch`. | M |
| `H-012` | Seguridad | **P2** | [VERIFICADO] | `src/worker/index.js:77-149` | El endpoint `/api/contacto` carece de límite de peticiones (*rate limiting*) y protección anti-spam avanzada (Turnstile). | Implementar Cloudflare Turnstile y regla de límite de frecuencia en Cloudflare para prevenir saturación. | M |
| `H-013` | Backend | **P2** | [VERIFICADO] | `src/worker/index.js:114-148` | Si Google Apps Script falla, el contacto se pierde de inmediato sin respaldo en base de datos ni reintentos. | Implementar almacenamiento de respaldo en Cloudflare KV/D1 o notificación redundante por correo. | M |
| `H-014` | Seguridad | **P2** | [VERIFICADO] | `src/worker/index.js:26` | El callback de OAuth envía el token mediante `postMessage("...", "*")` con comodín abierto de origen. | Restringir el origen en `postMessage` estrictamente a `https://defensalegaldelasegurado.com`. | S |
| `H-015` | SEO técnico | **P2** | [VERIFICADO] | `dist/sitemap-0.xml` | El sitemap XML carece por completo de marcas temporales de última modificación (`<lastmod>`). | Configurar `@astrojs/sitemap` con función `serialize` para inyectar fechas de actualización reales. | S |
| `H-016` | SEO técnico | **P2** | [VERIFICADO] | `dist/blog/ejemplo-post/index.html` (JSON-LD) | El esquema `BlogPosting` carece de las propiedades obligatorias de Google `image`, `dateModified` y `mainEntityOfPage`. | Incorporar `image` con URL absoluta y `dateModified` al esquema del blog en `src/pages/blog/[...slug].astro`. | S |
| `H-017` | AEO / SEO | **P2** | [VERIFICADO] | `src/layouts/BaseLayout.astro:36-77` | El esquema global carece de nodo `WebSite` y no incluye propiedades `sameAs` ni el correo en `LegalService`. | Completar el grafo JSON-LD agregando `WebSite`, `sameAs` y vinculando los servicios a sus URLs individuales. | S |
| `H-018` | Rendimiento | **P2** | [VERIFICADO] | `public/images/lapaz-skyline.jpg` (1,093 KB) | Imagen de fondo de 1.09 MB en formato JPG sin optimizar alojada directamente en `public/`. | Convertir a WebP optimizado con resolución adaptada, reduciendo su peso por debajo de 120 KB. | S |
| `H-019` | Accesibilidad | **P2** | [VERIFICADO] | `src/styles/tokens.css:18`, cálculo en `scratch/contrast_ratios.cjs` | `--color-ink-400` (`#6B7A90`) y `terracotta-600` (`#B5622C`) tienen contrastes de 4.36:1 y 4.42:1 (fallan WCAG AA 4.5:1). | Oscurecer ligeramente `ink-400` a `#5C6B80` y `terracotta-600` a `#A85524` para superar 4.5:1. | S |
| `H-020` | Accesibilidad | **P2** | [VERIFICADO] | `src/layouts/BaseLayout.astro:129-133` | Ausencia de enlace "Saltar al contenido" para usuarios de teclado y lectores de pantalla. | Agregar `<a href="#main-content" class="sr-only focus:not-sr-only">Saltar al contenido principal</a>` en BaseLayout. | S |
| `H-021` | Contenido | **P2** | [VERIFICADO] | `src/content/settings/general.json:30-35` | Los enlaces a Instagram, TikTok y LinkedIn en el pie de página apuntan a las URLs genéricas de cada plataforma. | Ocultar los botones de redes sociales en el componente hasta que los perfiles oficiales existan. | S |
| `H-022` | E-E-A-T | **P2** | [VERIFICADO] | `src/components/StatBar.astro:65`, `src/content/settings/general.json:2-8` | Cifras estadísticas de efectividad (95%, 82%) se presentan sin referencia metodológica ni descargo validado. | Redactar un descargo legal informativo formal al pie de las estadísticas para blindar la reputación legal. | S |
| `H-023` | Privacidad | **P2** | [VERIFICADO] | `src/layouts/BaseLayout.astro:109-124` | Google Fonts se carga desde servidores externos de Google en todas las páginas sin consentimiento previo. | Autoalojar las fuentes tipográficas (Fraunces, Inter, IBM Plex Mono) en `public/fonts/`. | M |
| `H-024` | Código | **P3** | [VERIFICADO] | `src/data/hero-variantes.ts` | Archivo con variantes de texto para Hero no importado en ningún componente del proyecto (código muerto). | Eliminar el archivo o integrarlo en la documentación de pruebas de copy. | S |
| `H-025` | Código | **P3** | [VERIFICADO] | `src/layouts/BaseLayout.astro:123` | Advertencia TypeScript `ts(6133): 'media' is declared but its value is never read`. | Corregir la sintaxis de carga asíncrona de estilos o eliminarla al autoalojar las fuentes. | S |
| `H-026` | Dependencias | **P3** | [VERIFICADO] | `npm audit --omit=dev` | Astro 4.16.19 y librerías transitivas acumulan 7 avisos de vulnerabilidad en auditoría npm. | Planificar la migración ordenada a Astro 5/6 en una rama de pruebas aislada. | L |
| `H-027` | Documentación | **P3** | [VERIFICADO] | `docs/DOCUMENTACION_TECNICA.md`, `ESTADO.md`, `astro.config.mjs:7` | Documentación desactualizada (no refleja GA ni cookies) y mención errónea al repo `dla-seguros`. | Actualizar los documentos técnicos con la realidad del código y corregir el nombre del repositorio. | S |

---

## 16. Roadmap sugerido

### Bloque Quick Wins (Mayor impacto, menor esfuerzo — 1 a 2 días de trabajo)
- [ ] **QW-1:** Crear y subir `public/og-default.png` (1200×630 px) con la identidad de DLA para solucionar las previsualizaciones sociales (`H-003`).
- [ ] **QW-2:** Activar en Cloudflare la opción *"Always Use HTTPS"* para forzar la redirección automática de HTTP a HTTPS (`H-004`).
- [ ] **QW-3:** Corregir `public/llms.txt` eliminando la afirmación de atención presencial en Santa Cruz y Cochabamba (`H-008`).
- [ ] **QW-4:** Crear la página `src/pages/404.astro` con diseño institucional y enlaces al inicio y a contacto (`H-005`).
- [ ] **QW-5:** Dejar un único `<h1>` en `src/components/Hero.astro` convirtiendo los títulos secundarios del carrusel en elementos no `<h1>` (`H-006`).
- [ ] **QW-6:** Ocultar temporalmente los íconos de Instagram, TikTok y LinkedIn en `Footer.astro` que apuntan a portadas genéricas (`H-021`).

### Etapa 1: Correcciones Críticas de Contenido y Estructura (Semana 1)
- [ ] **P0-1:** Redactar y publicar el contenido completo para *Fianzas y Caución*, *Seguros de Personas* y *Seguros Generales* (`H-001`).
- [ ] **P0-2:** Reemplazar los archivos de ejemplo en `casos/` y `testimonios/` por casos reales anonimizados redactados con el abogado (`H-002`).
- [ ] **P1-1:** Eliminar las etiquetas `<main>` anidadas en `AreaLayout.astro`, `contacto.astro`, `sobre-mi.astro`, etc. (`H-007`).
- [ ] **P1-2:** Ajustar el script del formulario en `contacto.astro` para enviar el estado del consentimiento de privacidad al backend (`H-010`).
- [ ] **P1-3:** Corregir la ruta de estilos de previsualización en `public/admin/index.html` para el panel Decap CMS (`H-009`).

### Etapa 2: Seguridad, Accesibilidad y Datos Estructurados (Semana 2)
- [ ] **P1-4:** Configurar cabeceras de seguridad HTTP básicas (HSTS, X-Content-Type-Options, Referrer-Policy) en Cloudflare (`H-011`).
- [ ] **P2-1:** Ajustar los colores `--color-ink-400` y `--color-terracotta-600` para garantizar cumplimiento WCAG AA en texto normal (`H-019`).
- [ ] **P2-2:** Añadir el enlace "Saltar al contenido principal" en `BaseLayout.astro` (`H-020`).
- [ ] **P2-3:** Enriquecer los esquemas JSON-LD (`WebSite`, imagen en `BlogPosting`, fecha de modificación) (`H-016`, `H-017`).
- [ ] **P2-4:** Optimizar y comprimir imágenes pesadas en `dist/` y `public/` (`H-018`).
- [ ] **P2-5:** Añadir un descargo legal metodológico visible para las estadísticas de efectividad (`H-022`).

### Etapa 3: Resiliencia y SEO Avanzado (Semana 3+)
- [ ] **P2-6:** Implementar Cloudflare Turnstile en `/contacto/` y límite de peticiones en el Worker (`H-012`).
- [ ] **P2-7:** Autoalojar las fuentes tipográficas en `public/fonts/` eliminando llamadas externas a Google Fonts (`H-023`).
- [ ] **P2-8:** Configurar almacenamiento de respaldo en Cloudflare KV/D1 para contactos del formulario (`H-013`).
- [ ] **P3-1:** Actualizar la documentación técnica del proyecto (`H-027`).

---

## 17. Verificaciones manuales para el responsable

Los siguientes puntos corresponden a plataformas externas, paneles administrativos y servicios de terceros a los que el agente de código **no tiene acceso**:

### 1. Panel de Cloudflare (Dominio `defensalegaldelasegurado.com`)
- **A. Forzado de HTTPS:**
  - *Ruta:* SSL/TLS → Edge Certificates → Activar la casilla **Always Use HTTPS**.
  - *Resultado esperado:* Las peticiones por `http://` deben devolver inmediatamente un código de estado `301 Moved Permanently` hacia `https://`.
- **B. HSTS (HTTP Strict Transport Security):**
  - *Ruta:* SSL/TLS → Edge Certificates → Enable HSTS (definir max-age de al menos 6 meses).
  - *Resultado esperado:* La cabecera `Strict-Transport-Security: max-age=...` debe aparecer en `curl -sI https://defensalegaldelasegurado.com/`.
- **C. Rastreadores y Bots de IA:**
  - *Ruta:* Security → Bots → Comprobar la configuración de **AI Scrapers and Crawlers**.
  - *Resultado esperado:* Si se desea que ChatGPT, Perplexity y Gemini citen el sitio, la opción debe permitir el paso (*Allow* o no bloquear).
- **D. Web Analytics:**
  - *Ruta:* Analytics & Logs → Web Analytics.
  - *Resultado esperado:* Confirmar que el token de Cloudflare Web Analytics coincide con el script `beacon.min.js` inyectado en el HTML.

### 2. Google Search Console y Bing Webmaster Tools
- **A. Estado de verificación de propiedad:**
  - *Pasos:* Ingresar a `search.google.com/search-console` con la cuenta corporativa.
  - *Resultado esperado:* Si la propiedad no está verificada, añadir un registro TXT en el DNS de Cloudflare o insertar la etiqueta meta `<meta name="google-site-verification" content="..." />`.
- **B. Envío del Sitemap XML:**
  - *Pasos:* Enviar la URL `https://defensalegaldelasegurado.com/sitemap-index.xml`.
  - *Resultado esperado:* Estado "Correcto" con 15 páginas detectadas e indexadas sin errores de cobertura.

### 3. Google Analytics (GA4)
- **A. Recepción de eventos en tiempo real:**
  - *Pasos:* Abrir GA4 → Informes en tiempo real. En una ventana de incógnito, entrar al sitio web y pulsar **Aceptar** en el banner de cookies.
  - *Resultado esperado:* Debe registrarse la visita y el evento de página vista (`page_view`). Si se pulsa **Rechazar**, no debe figurar ninguna visita en tiempo real.

### 4. Decap CMS en el navegador
- **A. Prueba de inicio de sesión con GitHub:**
  - *Pasos:* Visitar `https://defensalegaldelasegurado.com/admin/`. Hacer clic en "Login with GitHub".
  - *Resultado esperado:* Debe abrirse la ventana emergente de GitHub solicitando autorización de la OAuth App y retornar autenticado al panel con las colecciones listadas.
- **B. Creación de un borrador de prueba:**
  - *Pasos:* En la colección "Blog", redactar un artículo borrador y guardar.
  - *Resultado esperado:* El CMS debe generar un commit en la rama `main` del repositorio `sitiosbo/dla-castro`.

---

## 18. Preguntas abiertas para el cliente y el abogado

1. **Contenido de las 3 áreas de práctica:** ¿Dispone el abogado de minutas, presentaciones o casos típicos sobre *Seguros Generales*, *Seguros de Personas* y *Fianzas y Caución* para redactar los contenidos de fondo de cada especialidad?
2. **Casos reales anonimizados:** ¿Qué 2 o 3 casos exitosos emblemáticos pueden publicarse de forma anonimizada (ej. monto o indemnización recuperada, ramo del seguro, vía de solución) para sustituir las maquetas de `/resultados/`?
3. **Cifras de efectividad (95% y 82%):** ¿Desea el abogado mantener estas cifras en el encabezado? De ser así, se requiere validar el texto del descargo legal aclarando que los resultados pasados no garantizan resultados futuros.
4. **Presencia física en Santa Cruz y Cochabamba:** Dado que `llms.txt` anunciaba atención presencial en dichas ciudades, ¿se atiende únicamente mediante audiencias virtuales y traslados específicos, o existe alguna oficina de correspondencia o sala de reuniones asociada?
5. **Redes sociales corporativas:** ¿Se van a crear perfiles oficiales de DLA en LinkedIn o Facebook a corto plazo, o prefiere ocultar dichos botones del sitio web para evitar enlaces rotos o genéricos?
6. **Correo corporativo:** ¿Se gestionará un buzón bajo el dominio propio (ejemplo: `contacto@defensalegaldelasegurado.com`) para reemplazar la cuenta pública de Gmail?

---

## 19. Apéndice: comandos ejecutados, salidas relevantes y límites de esta auditoría

### 19.1 Comandos principales ejecutados durante la auditoría
- `git log --pretty=format:"%h | %ad | %an | %s" --date=short`: Reconstrucción completa del historial de 43 commits.
- `git branch -a`, `git tag -l`: Identificación de ramas (`main`, `feat/banner-cookies`) y ausencia de etiquetas.
- `npm outdated`: Verificación de versiones obsoletas frente a las versiones mayores del ecosistema npm.
- `npm audit --omit=dev`: Identificación de 7 avisos de vulnerabilidad en dependencias de producción.
- `npx astro check`: Análisis estático de tipos y diagnóstico de archivos Astro (0 errores, 0 warnings, 1 hint).
- `Measure-Command { npm run build }`: Medición del tiempo de compilación estática (39.50 segundos).
- `curl.exe -sI http://defensalegaldelasegurado.com`: Diagnóstico del comportamiento sin cifrar HTTP (retorna 200 OK sin redirección).
- `curl.exe -sI https://www.defensalegaldelasegurado.com`: Confirmación de redirección 301 de `www` al dominio canónico sin `www`.
- `curl.exe -sI https://defensalegaldelasegurado.com/`: Inspección de cabeceras de respuesta del borde (Cloudflare).
- `curl.exe -4 -sI -A "<User-Agent>"`: Verificación de acceso para 14 motores de rastreo e IA.

### 19.2 Scripts de análisis temporal ejecutados en entorno de scratch
- `scratch/analyze_pages.cjs`: Extracción y análisis estructural de los 16 archivos HTML en `dist/` (títulos, descripciones, etiquetas canónicas, robots, recuento de `<h1>`, `<main>` anidados y saltos de encabezados).
- `scratch/check_links.cjs` y `scratch/check_orphans.cjs`: Comprobación exhaustiva de los 47 enlaces internos, resolución de archivos, consistencia de barra final e identificación de enlaces entrantes.
- `scratch/analyze_performance.cjs`: Medición de peso de archivos por extensión y detección de imágenes desoptimizadas.
- `scratch/contrast_ratios.cjs`: Algoritmo matemático para el cálculo de contraste relativo según fórmula WCAG 2.1 en espacio de color sRGB para los tokens del sitio.
- `scratch/test_ai_crawlers.cjs`: Batería automatizada de solicitudes HTTP HEAD con firmas User-Agent hacia producción.

### 19.3 Límites metodológicos de esta auditoría
1. **Sin acceso a paneles restringidos:** No se dispone de credenciales de acceso al panel de control de Cloudflare, Google Search Console, Google Analytics ni GitHub OAuth App. Las afirmaciones sobre configuraciones internas de dichos paneles quedan clasificadas como **[INFERIDO]** y sujetas a la verificación manual del responsable (Sección 17).
2. **Sin pruebas intrusivas en backend:** Conforme a la regla A3, no se realizaron envíos reales de prueba mediante peticiones `POST` a `/api/contacto` en el entorno de producción ni se interactuó con la hoja receptora de Google Sheets. El análisis del backend se fundamenta en la lectura del código fuente del Worker y de los scripts del cliente.
3. **Sin estimaciones especulativas de mercado:** No se disponen de cifras de tráfico analítico ni volumen de búsquedas por palabra clave en Bolivia (regla A10). Las consultas y términos sugeridos en el mapa de intención se presentan formalmente como hipótesis técnico-legales.
