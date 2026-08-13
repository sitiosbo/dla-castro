# Arquitectura Web — DLA (Defensa Legal del Asegurado)
### Astro + Decap CMS · sitiosbo

---

## 0. Definición de marca (confirmado con el cliente)

- **DLA — Defensa Legal del Asegurado** es la marca comercial. Va en el logotipo/wordmark, título del sitio (`<title>`), favicon, dominio y todos los metadatos SEO.
- **Castro** es el apellido del abogado responsable. Funciona como **firma de autoridad**, no como co-marca ni se fusiona en el logotipo. Aparece en lugares puntuales donde se necesita credencial humana: pie de página ("Abogado responsable: Castro"), página `/sobre-mi/`, firma de contrato/consulta, y schema.org `Person` vinculado a la organización `LegalService`.
- **Jerarquía visual del logo:** wordmark "DLA" como elemento dominante (tamaño, peso, posición). El nombre "Castro" nunca comparte el mismo nivel jerárquico — va como subtítulo pequeño o tagline ("DLA · Defensa Legal del Asegurado — Abogado Castro"), similar al patrón de firmas internacionales tipo DLA Piper, donde las siglas quedaron como marca pura y los apellidos de socios se usan solo como credencial.
- **Dominio:** pendiente de definición final con el cliente. Working placeholder para esta arquitectura: `dlaseguros.bo` (o `.com.bo`) — cumple el requisito de traer "seguros" en el dominio para SEO de nicho. Se ajusta fácilmente sin tocar el resto de la arquitectura.

---

## 1. Diagnóstico del brief (deck fuente)

El PDF posiciona a Ramiro Castro como:
- Especialista de nicho (Derecho de Seguros), no generalista → esto es oro para SEO/AEO porque hay cero competencia de "abogado de seguros" long-tail en Bolivia.
- 25+ años de trayectoria → activo de confianza (E-E-A-T), debe explotarse en todo el sitio, no solo en una sección.
- Público dual: (a) asegurados/empresas que sufren rechazo de siniestro (B2C/B2B reactivo, alta urgencia emocional) y (b) aseguradoras/corredores/reaseguradoras (B2B técnico, ventas de asesoría recurrente).
- Datos duros ya validados: 95% recupero de indemnizaciones, 88% arreglos directos, tabla de portafolio por tipo de cliente, ruta crítica del reclamo (4 fases).

Esto cambia la estrategia frente a Castro & Monje: ahí vendíamos un despacho generalista; aquí vendemos **autoridad técnica individual en un nicho regulatorio**. El copy y la estructura deben sonar a "el especialista que dictamina", no a "bufete que atiende de todo".

---

## 2. ¿Multipágina o single page? → **Multipágina (recomendado, con fuerte argumento)**

| Criterio | Single page | Multipágina |
|---|---|---|
| SEO/AEO/GEO | 1 URL compite por todo → débil | Cada práctica (Seguros Generales, Fianzas, Personas, Impugnación de Rechazos) es su propia URL indexable, con intención de búsqueda específica ("abogado rechazo de siniestro La Paz", "impugnación APS seguros") |
| Autoridad (E-E-A-T de Google) | Difícil demostrar profundidad | Páginas dedicadas = señal de expertise por tema |
| AEO (respuestas de IA / featured snippets) | Una sola página diluye respuestas | Cada página responde UNA pregunta específica → mejor candidato a ser citado por LLMs y snippets |
| Blog / contenido recurrente | No cabe naturalmente | Decap CMS alimenta blog sin fricción, refuerza autoridad mes a mes |
| Journey del usuario en crisis (rechazo de siniestro) | Debe scrollear todo | Puede llegar directo por Google a la página exacta de su problema y convertir en 1 clic |
| Costo/complejidad de build | Menor | Ligeramente mayor, pero tu stack Astro + Decap ya lo resuelve sin fricción (mismo patrón que Castro & Monje) |

**Conclusión:** El deck ya trae 4 áreas de práctica + 4 fases de proceso + estadísticas + testimoniales potenciales. Meterlo todo en una landing mata el SEO de nicho, que es exactamente la ventaja competitiva de Ramiro (nadie más en Bolivia está optimizado para "derecho de seguros"). Multipágina no es un lujo aquí, es la tesis comercial.

---

## 3. ¿Qué tipo de diseño? → **Formal-institucional con prestigio discreto** (no "lujoso" en el sentido ostentoso)

Argumentos:
1. **El comprador de servicios legales de seguros no busca "bonito", busca "confiable y serio".** Un diseño demasiado lujoso (dorados brillantes, animaciones vistosas, mucho lifestyle) puede leerse como marketing agresivo, lo cual es contraproducente en Derecho — el mercado legal premia sobriedad.
2. **El propio deck ya define el tono:** navy + serif + acentos terracota + mucho whitespace = lenguaje visual de despacho serio, no de agencia creativa. Hay que respetarlo y refinarlo, no reinventarlo.
3. **Diferenciación de Castro & Monje:** si ambos sitios quedan "iguales" en tono, se canibaliza percepción de marca. Ramiro debe sentirse más **técnico-regulatorio** (números, tablas, %, normativa citada) que "despacho tradicional". Esto también es más creíble para el público B2B (aseguradoras, corredores).
4. **Toques de prestigio SIN lujo:** tipografía serif de autoridad, mucho aire, íconos lineales finos, transiciones sutiles (tu metodología Emil Kowalski encaja perfecto: micro-interacciones discretas, nunca decorativas).

**Definición de estilo:** *Corporate-legal premium, data-driven, sobrio.* Piensa "informe de aseguradora internacional" cruzado con "despacho de abogados boutique", no "hotel 5 estrellas".

---

## 4. Sitemap completo

```
/                                → Home (conversión principal)
/sobre-mi/                       → Trayectoria, credenciales, 25+ años
/areas-de-practica/              → Pillar page (hub de las 4 sub-áreas)
  /areas-de-practica/seguros-generales/
  /areas-de-practica/seguros-de-personas/
  /areas-de-practica/fianzas-y-caucion/
  /areas-de-practica/impugnacion-de-rechazos/   ← página de mayor intención comercial
/proceso/                        → Las 4 fases + "cómo trabajo" (diagnóstico→estrategia→cobro)
/resultados/                     → Estadísticas (95%, 88%, etc.), casos anonimizados, testimonios
/blog/                           → Decap CMS, contenido normativo (Ley 1883, APS, jurisprudencia)
  /blog/[slug]/
/preguntas-frecuentes/           → FAQPage schema (clave para AEO / IA generativa)
/contacto/                       → Agenda de evaluación legal, formulario + WhatsApp
/aviso-legal/  /politica-privacidad/   → Compliance, footer
```

**Nota de prioridad SEO:** `impugnacion-de-rechazos` es la página con mayor urgencia/intención de conversión (alguien buscando esto YA tiene un siniestro rechazado). Debe llevar el CTA más agresivo del sitio y aparecer también linkeada desde Home por encima del fold.

---

## 5. Estructura de Home (alta conversión)

1. **Hero** — navy gradient (igual que el deck), logo lockup "DLA" dominante + tagline pequeño "Defensa Legal del Asegurado", badge "Abogado Especialista en Seguros | Bolivia", H1 + subhead + CTA primario ("Agenda tu evaluación legal") + CTA secundario (WhatsApp directo). El nombre "Castro" aparece recién en la barra de confianza (sección 2) como credencial, no en el hero principal.
2. **Barra de confianza** — 25+ años / 95% recupero / La Paz·Santa Cruz·Cochabamba·Nacional (social proof inmediato, sin scroll).
3. **Soluciones legales de alto nivel** — 2 columnas (Asesoría Técnica / Patrocinio en Siniestros) tal como el deck.
4. **Especialista en todos los ramos** — imagen + copy (reusar layout imagen-derecha del deck).
5. **Defensa integral de asegurados** — 4 bullets clave (Impugnación, Cuantificación, Garantías, Procesos Administrativos) — cada bullet linkea a su página de área de práctica.
6. **Áreas clave** — 3 cards con íconos (Generales / Fianzas / Personas) → enlazan a subpáginas.
7. **Efectividad en reclamos** — gráfico de barras (88/82/79/95%) — usar como widget interactivo real, no imagen estática, refuerza autoridad con datos.
8. **Ruta crítica del reclamo** — timeline de 4 fases (excelente para reducir ansiedad del usuario en crisis, aumenta conversión).
9. **Portafolio de servicios por tipo de cliente** — la tabla comparativa (Asegurados / Corredores / Aseguradoras) segmenta automáticamente al visitante, muy fuerte para conversión B2B.
10. **Testimonios** *(nuevo, no está en el deck — recomendado agregar, aunque sea 2-3 anonimizados por confidencialidad de casos legales)*.
11. **CTA final** — "¿Consultas o casos de seguros?" con datos de contacto directo (igual al cierre del deck).
12. **Footer** — enlaces a áreas de práctica, blog, aviso legal, WhatsApp flotante persistente en todo el sitio.

---

## 6. Elementos de conversión a implementar (no están en el deck, pero son estándar de alta conversión legal)

- **Botón flotante de WhatsApp** — la vía #1 de contacto legal en Bolivia, debe estar en todas las páginas.
- **Formulario de "evaluación legal inicial"** corto (nombre, tipo de caso, aseguradora involucrada, teléfono) — no pedir demasiado, es momento de crisis para el usuario.
- **Schema.org**: `LegalService` + `Person` (Ramiro) + `FAQPage` en la página de preguntas frecuentes + `BreadcrumbList` en subpáginas — mismo patrón que ya implementaste en Castro & Monje.
- **Barra de urgencia contextual** en la página de Impugnación de Rechazos: recordar plazos legales (Art. 1028 Cód. Comercio) genera urgencia legítima sin ser agresivo.
- **Prueba social cuantitativa** repetida como micro-copy en botones ("Agenda tu evaluación — 95% de recupero histórico").

---

## 7. Stack técnico (consistente con tu setup actual)

```
astro.config.mjs        → misma config dual GitHub Pages / Cloudflare Pages que ya resolviste en Castro & Monje
src/
  content/
    config.ts           → content collections: blog, testimonios, casos, servicios
    blog/                → posts .md/.mdx vía Decap
    testimonios/
    servicios/           → 4 áreas de práctica como entradas editables (título, copy, %, ícono)
  components/
    Hero.astro
    TrustBar.astro
    StatBar.astro         → barras de efectividad (reutilizable, data-driven desde content collection)
    Timeline.astro         → ruta crítica del reclamo
    ServiceTable.astro     → tabla portafolio por tipo de cliente
    WhatsAppFloat.astro
  pages/
    index.astro
    sobre-mi.astro
    areas-de-practica/
      index.astro
      seguros-generales.astro
      seguros-de-personas.astro
      fianzas-y-caucion.astro
      impugnacion-de-rechazos.astro
    proceso.astro
    resultados.astro
    blog/[...slug].astro
    preguntas-frecuentes.astro
    contacto.astro
public/admin/
  config.yml             → Decap CMS
  index.html
```

### Colecciones Decap CMS sugeridas (`config.yml`)
1. **Blog** — posts normativos (Ley de Seguros, APS, jurisprudencia) → motor de SEO recurrente.
2. **Testimonios** — texto + iniciales/anonimizado (confidencialidad legal).
3. **Casos de éxito** — anonimizados, con % o resultado, sin datos identificables de clientes.
4. **Servicios/Áreas de práctica** — para que Ramiro pueda ajustar copy sin tocar código.
5. **Estadísticas del hero** (settings singleton) — para actualizar los % de efectividad sin deploy manual.

---

## 8. Siguiente paso sugerido

Puedo generar directamente el scaffold del proyecto Astro (estructura de carpetas, `astro.config.mjs` dual-deploy, `content/config.ts`, componentes base con la paleta ya aplicada) igual que hicimos con Castro & Monje — dime si quieres que arranque con eso o si primero quieres ajustar algo de esta arquitectura (por ejemplo, si Ramiro tiene relación con el despacho Castro & Monje y conviene diferenciarlo más o, al contrario, cruzar referencias entre ambos sitios).
