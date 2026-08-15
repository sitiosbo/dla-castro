/**
 * Variantes del Hero — texto de apoyo que rota automáticamente.
 *
 * REGLAS:
 * - El H1, subhead, badge y CTAs NUNCA rotan. Son fijos.
 * - Solo rota esta zona secundaria de apoyo.
 * - El gradiente dominante sugiere qué color de las franjas se intensifica
 *   sutilmente durante esa variante (cambio ambiental, no protagónico).
 * - prefers-reduced-motion: detiene toda rotación, muestra la primera variante.
 *
 * Todos los textos son contenido ya existente en el sitio:
 *   - aniosExperiencia / recuperoIndemnizaciones → settings/general.json
 *   - Áreas de práctica → pages publicadas en /areas-de-practica/
 *   - Ciudades → settings/general.json (contacto.ciudadesCobertura)
 */

export interface HeroVariante {
  /** Texto corto para la zona de apoyo del Hero */
  texto: string;
  /** Color dominante sugerido para las franjas durante esta variante */
  gradiente: 'navy' | 'terracotta' | 'success' | 'violet';
}

export const heroVariantes: HeroVariante[] = [
  {
    texto: '25+ años de trayectoria en Derecho de Seguros',
    gradiente: 'navy',
  },
  {
    texto: '95% de efectividad en recupero de indemnizaciones',
    gradiente: 'terracotta',
  },
  {
    texto: 'Especialista en Seguros Generales, Personas, Fianzas y Caución',
    gradiente: 'success',
  },
  {
    texto: 'Cobertura en La Paz, Santa Cruz, Cochabamba y todo el país',
    gradiente: 'violet',
  },
];
