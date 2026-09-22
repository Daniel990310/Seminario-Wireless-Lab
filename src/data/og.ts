/**
 * Nombre de archivo de las imágenes para compartir (RNF-3.2).
 *
 * **Vive en su propio archivo y sin importaciones**, por el mismo motivo que
 * `acceso.ts`: `scripts/verify-seo.mjs` y `scripts/generar-og.mjs` corren en Node
 * puro y no pueden cargar `comun.ts`, que importa imágenes con el alias `~`. Si la
 * ruta se escribiera en cada sitio, habría tres copias y el verificador aprobaría
 * contra la suya.
 *
 * ── POR QUÉ EL NOMBRE LLEVA VERSIÓN ──────────────────────────────────────────
 *
 * **WhatsApp, LinkedIn y Facebook cachean la vista previa por URL, y durante
 * mucho tiempo.** Cambiar el contenido de `og/es.png` dejando el mismo nombre no
 * actualiza los enlaces ya compartidos: quien reciba el enlace —o quien lo
 * reenvíe— sigue viendo la tarjeta vieja, y no hay forma de purgar esa caché
 * desde el sitio. Facebook tiene un depurador manual; WhatsApp no tiene ninguno.
 *
 * Subir el número cambia la URL y fuerza a todas las plataformas a pedirla de
 * nuevo. **Hay que subirlo cada vez que cambie el aspecto del cartel**, no cada
 * vez que se regenera por costumbre.
 *
 * Historial:
 *   1 · Texto a la izquierda, figura a la derecha. Correcta a 1200×630, pero la
 *       miniatura cuadrada de WhatsApp la recortaba a media palabra.
 *   2 · Composición centrada dentro del cuadrado central. 2026-09-22.
 */
export const OG_VERSION = 2;

/** Ruta pública de la imagen para compartir de un idioma. */
export const rutaOg = (idioma: string) => `/og/${idioma}-${OG_VERSION}.png`;
