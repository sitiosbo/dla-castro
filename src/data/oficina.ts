/**
 * Dirección de la oficina DLA — derivaciones a partir de la única fuente de datos.
 *
 * Fuente de verdad: src/content/settings/general.json → contacto.direccion
 * (el mismo lugar donde viven WhatsApp, email y ciudades de cobertura).
 * Para cambiar la dirección del sitio, editar SOLO ese JSON.
 *
 * Este módulo NO contiene datos: solo arma los textos/schema/URL que consumen
 * contacto, footer, legal y el JSON-LD de BaseLayout — así todas las fuentes
 * (Google, el usuario, el CMS) ven exactamente el mismo texto.
 */
import general from '../content/settings/general.json';

const d = general.contacto.direccion;

/** streetAddress para JSON-LD PostalAddress (sin referencia ni ciudad) */
export const streetAddress = `${d.calle}, ${d.edificio}, ${d.piso}, ${d.oficina}`;

/** Tres líneas para el bloque "Nuestra oficina" de /contacto/ */
export const direccionLineas: string[] = [
  d.calle,
  `${d.edificio}, ${d.piso}, ${d.oficina}`,
  `${d.referencia} · ${d.ciudad}, ${d.pais}`,
];

/** Texto corto en una línea para el footer */
export const direccionCorta = `${streetAddress} · ${d.ciudad}, ${d.pais}`;

/** Texto completo para páginas legales y la URL de Google Maps */
export const direccionTextoLargo = `${streetAddress}, ${d.referencia.charAt(0).toLowerCase()}${d.referencia.slice(1)}, ${d.ciudad}, ${d.pais}`;

/** PostalAddress para el JSON-LD de BaseLayout (sin geo/telefonos/horarios inventados) */
export const direccionSchema = {
  '@type': 'PostalAddress',
  streetAddress,
  addressLocality: d.ciudad,
  addressRegion: d.departamento,
  addressCountry: d.paisISO,
};

/** "Cómo llegar" — búsqueda de Google Maps (sin iframe, sin cookies de terceros) */
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionTextoLargo)}`;
