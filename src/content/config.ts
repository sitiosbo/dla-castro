import { defineCollection, z } from 'astro:content';

// Áreas de práctica (las 4 del deck: Generales, Personas, Fianzas y Caución, Impugnación de Rechazos)
const servicios = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(), // usado en cards de Home
    icono: z.string().optional(), // nombre de ícono lineal (ver components/icons)
    prioridadConversion: z.enum(['alta', 'media']).default('media'),
    // alta = impugnacion-de-rechazos (mayor intención comercial, CTA más agresivo)
    ordenHome: z.number().default(99),
  }),
});

// Posts de blog normativo (Ley 1883, APS, jurisprudencia) — motor de SEO recurrente
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    fechaPublicacion: z.date(),
    resumen: z.string(),
    imagenPortada: z.string().optional(),
    categoria: z.enum(['normativa', 'siniestros', 'jurisprudencia', 'general']),
  }),
});

// Testimonios (anonimizados por confidencialidad legal)
const testimonios = defineCollection({
  type: 'content',
  schema: z.object({
    inicialesCliente: z.string(), // ej. "R.M." — nunca nombre completo
    tipoCaso: z.string(), // ej. "Rechazo de siniestro vehicular"
    texto: z.string(),
    resultado: z.string().optional(), // ej. "Indemnización recuperada en 45 días"
  }),
});

// Casos de éxito anonimizados (para /resultados/)
const casos = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(), // ej. "Impugnación exitosa — ramo Incendio"
    ramo: z.enum(['generales', 'personas', 'fianzas-caucion']),
    resultadoPorcentaje: z.number().optional(),
    resumen: z.string(),
  }),
});

// Singleton de configuración editable (estadísticas del hero, datos de contacto)
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    stats: z.object({
      aniosExperiencia: z.number(),
      recuperoIndemnizaciones: z.number(), // %
      resolucionViaAdministrativa: z.number(), // %
      arreglosDirectos: z.number(), // %
      arbitrajesFavorables: z.number(), // %
    }),
    contacto: z.object({
      whatsapp: z.string(),
      email: z.string().email().optional(),
      ciudadesCobertura: z.array(z.string()),
    }),
  }),
});

export const collections = { servicios, blog, testimonios, casos, settings };
