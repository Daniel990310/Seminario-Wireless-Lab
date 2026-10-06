/**
 * Iniciales de un expositor, para el monograma que ocupa el lugar del retrato.
 *
 * Las usan la ficha del sitio (`SpeakerCard.astro`) y las piezas de difusión
 * (`CartelFlyer.astro`); por eso viven aquí y no dentro de un componente.
 *
 * El filtro se queda con las palabras que son **nombre o apellido de verdad**: una
 * mayúscula seguida de minúscula. Así caen tanto las partículas —«de», «la»— como las
 * iniciales con punto, que es lo que este filtro no hacía y se vio en cuanto entró
 * alguien sin foto: `filter(part => part.length > 1)` dejaba pasar «A.» —dos caracteres,
 * letra y punto— y «Gustavo A. Siles Soria» daba **GA** en vez de GS `[medido: 2026-09-22]`.
 *
 * Solo se notó entonces porque los seis expositores anteriores tienen retrato y el
 * monograma no llega a pintarse. «Reinaldo A. Valenzuela» tenía el mismo defecto latente:
 * daba RA.
 */
export const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .filter((part) => /^\p{Lu}\p{Ll}/u.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
