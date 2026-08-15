/**
 * Slides completos del Hero — secuencia única que termina en la variante canónica.
 *
 * REGLAS:
 * - El último slide SIEMPRE es la variante principal (la que permanece fija).
 * - La secuencia corre una sola vez al cargar la página, no se repite.
 * - Los CTAs son visibles y clicables desde el primer frame.
 * - prefers-reduced-motion: carga directo en el slide final (canónico).
 * - No inventar cifras ni copy nuevo: todo viene de settings/general.json
 *   o del contenido ya publicado en el sitio.
 * - Todos los H1 deben tener largo visual similar (~3 líneas) para que el
 *   contenedor no tenga saltos de altura entre slides (CLS).
 * - Fondos: solo tokens ya definidos en tokens.css (navy-950, navy-800,
 *   terracotta-600, success-500). No colores nuevos.
 */

export type HeroBackground = 'navy' | 'success' | 'terracotta';

export interface HeroSlide {
  /** Título principal (H1) del slide */
  titulo: string;
  /** Subtítulo debajo del H1 */
  subhead: string;
  /** Variante de fondo para este slide */
  background: HeroBackground;
  /** Si es true, este slide es el final permanente */
  esCanonical: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    titulo: '25+ años de trayectoria\ndefendiendo los derechos\nde los asegurados.',
    subhead:
      'Defensa legal especializada en Derecho de Seguros. Asesoría estratégica, patrocinio en siniestros e impugnación de rechazos.',
    background: 'navy',
    esCanonical: false,
  },
  {
    titulo: '95% de efectividad en\nrecupero de indemnizaciones\npara nuestros clientes.',
    subhead:
      'Resultados históricos en los principales ramos del mercado asegurador boliviano. Casos complejos, resueltos.',
    background: 'success',
    esCanonical: false,
  },
  {
    titulo: 'Especialista en los 4\nramos principales de seguros\ngarantizando cobertura.',
    subhead:
      'Asesoría integral en Seguros Generales, Personas, Fianzas y Caución. Implantación de estrategias efectivas en cada rama.',
    background: 'terracotta',
    esCanonical: false,
  },
  {
    titulo: 'Su reclamo tiene\nderechos.\nNosotros los defendemos.',
    subhead:
      'Más de 25+ años de experiencia especializada en Derecho de Seguros. Asesoría estratégica, patrocinio en siniestros e impugnación de rechazos ante aseguradoras y la APS.',
    background: 'navy',
    esCanonical: true,
  },
];
