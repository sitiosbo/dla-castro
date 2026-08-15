# Formulario de Contacto — Instrucciones

## Arquitectura

El formulario de la página `/contacto` envía los datos del usuario a un **Google Apps Script Web App** que los escribe en un Google Sheet.

```
Browser → POST JSON → Google Apps Script → Google Sheet
```

El script del frontend (`src/pages/contacto.astro`, línea 243) ejecuta un `fetch()` al endpoint del Web App. La URL del endpoint se lee de una variable de entorno.

---

## Archivos involucrados

| Archivo | Qué contiene |
|---|---|
| `src/pages/contacto.astro` | Formulario HTML + script JS que hace `fetch()` al endpoint |
| `.env` | URL real del Web App (NO se sube al repo) |
| `.env.example` | Placeholder de la variable para que otros desarrolladores sepan qué configurar |
| `src/content/settings/general.json` | Datos de contacto (WhatsApp, email, ciudades) que alimentan el panel lateral |

---

## Cambiar la URL del Apps Script

Cuando se cambia de cuenta de Google (o se genera un nuevo despliegue), la URL del Web App cambia. El procedimiento es:

### 1. Actualizar el endpoint

Editar `.env` en la raíz del proyecto:

```
PUBLIC_CONTACT_FORM_ENDPOINT=https://script.google.com/macros/s/LA_NUEVA_URL/exec
```

### 2. Redesplegar

```bash
npm run build
npm run deploy
```

**Eso es todo.** No se toca ningún archivo de código.

---

## Cambiar otros datos de contacto

Los datos que aparecen en el panel lateral de la página de contacto (WhatsApp, email, ciudades) están en:

**`src/content/settings/general.json`**

```json
{
  "stats": {
    "aniosExperiencia": 25,
    "recuperoIndemnizaciones": 95
  },
  "contacto": {
    "whatsapp": "59170557088",
    "email": "contacto@dlaseguros.bo",
    "ciudadesCobertura": ["La Paz", "Santa Cruz", "Cochabamba", "Toda Bolivia"]
  }
}
```

| Campo | Qué controla |
|---|---|
| `whatsapp` | Número para el botón "Consulta Inmediata por WhatsApp" (formato: `591XXXXXXXXX`) |
| `email` | Correo que se muestra y se usa en el enlace `mailto:` |
| `ciudadesCobertura` | Ciudades listadas en el panel de información |

---

## Configurar el Google Apps Script (desde cero)

1. Crear un Google Sheet vacío.
2. Ir a **Extensiones > Apps Script**.
3. Pegar este código:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.openById('TU_SHEET_ID').getActiveSheet();
  sheet.appendRow([
    new Date(),
    data.nombre   || '',
    data.tipoCaso || '',
    data.aseguradora || '',
    data.telefono || '',
    data.email    || '',
    data.mensaje  || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Reemplazar `TU_SHEET_ID` con el ID real del Google Sheet.
5. **Guardar**, luego: **Desplegar > Nuevo despliegue > Tipo: App web**
   - Ejecutar como: Yo mismo
   - Quién tiene acceso: Cualquier usuario
6. Copiar la URL del despliegue.
7. Pegarla en `.env`:

```
PUBLIC_CONTACT_FORM_ENDPOINT=https://script.google.com/macros/s/LA_URL/exec
```

---

## Campos del formulario

| Campo HTML | Nombre | Tipo | Requerido |
|---|---|---|---|
| `nombre` | Nombre Completo o Empresa | `text` | Sí |
| `tipoCaso` | Tipo de Reclamo / Ramo | `select` | Sí |
| `aseguradora` | Aseguradora Involucrada | `text` | No |
| `telefono` | Teléfono / WhatsApp | `tel` | Sí |
| `email` | Correo Electrónico | `email` | No |
| `mensaje` | Resumen de la Consulta | `textarea` | No |

### Opciones del select `tipoCaso`

| Value | Texto |
|---|---|
| `impugnacion` | Impugnación de Rechazo de Siniestro |
| `generales` | Seguros Generales / Patrimoniales |
| `personas` | Seguros de Personas / Vida / Desgravamen |
| `fianzas` | Fianzas y Garantías Contractuales |
| `consultoria` | Consultoría Técnico-Regulatoria |

---

## Variables de entorno

| Variable | Prefijo | Disponible en | Descripción |
|---|---|---|---|
| `PUBLIC_CONTACT_FORM_ENDPOINT` | `PUBLIC_` | Cliente (browser) | URL del Google Apps Script Web App |

> **Nota:** El prefijo `PUBLIC_` es obligatorio en Astro para que la variable esté disponible en código de cliente (`<script>` del navegador). Sin el prefijo, `import.meta.env.PUBLIC_*` sería `undefined` en runtime.

---

## Seguridad

- `.env` está en `.gitignore` — nunca se sube al repo.
- `.env.example` contiene un placeholder (`TU_ID_AQUI`) para referencia.
- El Google Apps Script recibe datos sin autenticación (cualquiera puede enviar). Si se necesita protección, agregar Cloudflare Turnstile al formulario.

---

## Estados del formulario

El formulario maneja tres estados visuales:

### 1. Envío (loading)

- El botón muestra "Enviando…" con un spinner CSS.
- El botón se deshabilita para evitar doble envío.
- Transición: `--motion-duration-micro` / `--motion-ease-micro`.

### 2. Éxito

- El formulario se oculta y se muestra un bloque de confirmación con:
  - Mensaje: "Consulta enviada correctamente"
  - Sugerencia de WhatsApp para seguimiento inmediato (botón directo a `wa.me/<NUMERO>`).
- El número de WhatsApp se toma del `data-whatsapp` del formulario (provisto por el frontmatter desde `general.json`).

### 3. Error

- El formulario se oculta y se muestra un bloque de error con:
  - Mensaje: "No se pudo enviar la consulta"
  - Explicación de posible causa (conexión, cuota, etc.)
  - **Botón "Reintentar"** que vuelve al formulario.
  - **Botón "Contactar por WhatsApp"** como fallback directo.
- El usuario nunca queda en un callejón sin salida.

### Flujo de estados

```
[Formulario] → submit → [Loading: spinner + "Enviando…"]
   ↓ éxito
[Éxito: confirmación + link WhatsApp]
   ↓ error
[Error: mensaje + Reintentar + link WhatsApp]
   ↓ retry
[Formulario (reset)]
```
