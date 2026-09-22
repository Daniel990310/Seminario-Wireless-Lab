/**
 * Régimen de acceso al seminario (RNF-3.7).
 *
 * **Vive en su propio archivo, sin una sola importación, a propósito.** El resto de
 * `src/data/` importa imágenes con el alias `~`, que solo resuelve dentro de Astro:
 * `node scripts/verify-seo.mjs` no puede cargar `comun.ts`. Si este dato viviera allí,
 * el verificador tendría que llevar su propia copia del precio — y entonces aprobaría
 * contra la suya el día que el sitio cambiara la otra. Es el mismo defecto que RNF-7.4
 * prohíbe para el dominio de producción.
 *
 * Así lo leen los dos de aquí: el sitio vía `comun.ts`, y el verificador directamente.
 *
 * **Confirmado por Daniel el 2026-09-22**: la asistencia es gratuita. Antes de esa
 * fecha el dato no existía y el JSON-LD no declaraba nada, porque la regla de
 * procedencia prohíbe inventarlo.
 */
export const acceso = {
  gratuito: true,
  precio: 0,
  /**
   * Se declara aunque el precio sea 0: `schema.org/Offer` la exige, y sin ella el
   * validador de Google descarta la oferta entera y el distintivo «Gratis» no sale.
   */
  moneda: 'CLP',
  /**
   * Fecha desde la que la oferta es válida (`schema.org/Offer.validFrom`).
   *
   * Google la marca como **opcional y no crítica**: sin ella el resultado de evento se
   * construye igual. Se declara porque el valor **existe y es verificable**, no para
   * silenciar el aviso: es el día en que el sitio se publicó anunciando la gratuidad.
   * Antes de esa fecha no había ninguna oferta que ofrecer.
   *
   * **No es la fecha de apertura de inscripciones.** No hay inscripciones: RF-3 está
   * fuera de alcance. Inventar una fecha de venta de entradas para un evento sin
   * entradas sería precisamente lo que la regla de procedencia prohíbe, y además
   * quedaría escrita en un resultado de búsqueda.
   */
  validoDesde: '2026-09-22',
} as const;
