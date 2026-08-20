# Imágenes — Proceso (proceso.astro)

## Imágenes esperadas

| Archivo | Sección | Relación de aspecto | Resolución mínima de origen |
|---------|---------|---------------------|----------------------------|
| `diagnostico-tecnico.jpg` | Pilar 01 — "Diagnóstico de Cobertura" | 4:3 (cuadrada宽) | 800 × 600 px |
| `estrategia-conciliacion.jpg` | Pilar 02 — "Vía Administrativa APS" | 4:3 | 800 × 600 px |
| `cobro-indemnizacion.jpg` | Pilar 03 — "Prueba Técnica y Peritaje" | 4:3 | 800 × 600 px |

## Instrucciones para Ramiro

1. **Entregar el archivo original** en JPG o PNG, sin comprimir ni convertir a WebP.
   Astro (vía Sharp) se encarga automáticamente de:
   - Conversión a formato optimizado (WebP/AVIF según configuración del build).
   - Compresión inteligente sin pérdida visible de calidad.
   - Generación de variantes responsivas (`widths` configurados en el `<Image>`).

2. **No renombrar manualmente** — el nombre del archivo debe coincidir exactamente con
   los de la tabla anterior (sin espacios, en minúsculas, guiones como separador).

3. **Resolución de origen**: el archivo debe ser al menos tan grande como el mayor tamaño
   en que se mostrará. Las variantes responsivas se generan desde el original reduciendo,
   nunca agrandando. Un archivo más pequeño que el tamaño de render producirá imágenes borrosas.

4. **Relación de aspecto**: se recomienda entregar la imagen en la proporción indicada.
   Los tres pilares ocupan una grid de 3 columnas (1fr cada una). En desktop, cada card
   tiene ~380px de ancho. Si la imagen viene en otra proporción, se recortará
   automáticamente con `object-fit: cover`.
