# Imágenes — Home (index.astro)

## Imágenes esperadas

| Archivo | Sección | Relación de aspecto | Resolución mínima de origen |
|---------|---------|---------------------|----------------------------|
| `especialista-ramos.jpg` | "Especialista en todos los ramos" (columna derecha, reemplaza pills CSS) | 4:5 (vertical) | 960 × 1200 px |
| `defensa-integral.jpg` | "Cuatro frentes de protección legal" (encabezado o card destacada) | 16:9 (panorámica) | 1280 × 720 px |
| `respaldo-nacional.jpg` | "Respaldo legal sólido y transparente" (fondo a pantalla completa) | 21:9 (ultra panorámica) | 1920 × 820 px |

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
   Si la imagen viene en otra proporción, se recortará automáticamente con `object-fit: cover`
   para llenar el contenedor sin distorsión.
