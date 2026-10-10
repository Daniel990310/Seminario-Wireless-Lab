/**
 * Piezas de difusión en redes: formatos, zonas seguras, piso tipográfico y la lista de
 * piezas que se generan.
 *
 * Lo leen la página que las dibuja (`src/pages/flyer/[pieza].astro`) y el script que
 * las captura (`scripts/generar-flyer.mjs`). Por eso este archivo no importa nada con
 * imágenes ni datos del sitio: Node lo carga directo, sin pasar por Astro.
 */
import type { Idioma } from './contenido';

/*
 * `seguro` es la franja que la interfaz de la red tapa, medida desde cada borde. El
 * generador comprueba que nada legible caiga ahí.
 */
export const FORMATOS_FLYER = {
  /*
   * 4:5, feed de Instagram y de LinkedIn: la proporción más alta que ambos muestran sin
   * recortar. La grilla del perfil de Instagram la reduce a 3:4 central, 34 px por lado
   * `[supuesto: cambio de la grilla de Instagram, 2025]`; el margen lateral los cubre.
   */
  '4x5': { ancho: 1080, alto: 1350, seguro: { arriba: 0, abajo: 0 } },
  /*
   * 9:16, historias de Instagram y estado de WhatsApp. Arriba van la barra de progreso y
   * el nombre de la cuenta; abajo, el campo de respuesta.
   * 250 px arriba y 250 abajo: los cubren el nombre de la cuenta y la barra de respuesta
   * `[verificado: guías de tamaños de Instagram 2026, ver specs/fuentes.md]`.
   *
   * > Corregido 2026-10-01: abajo estuvo en 340, en 220 y en 80. Bajarlo fue para que la
   * > franja de marcas no flotara sobre una banda vacía, y era un supuesto sin fuente; las
   * > guías dicen 250. El hueco de abajo ahora lo cruzan los arcos de la figura, no la
   * > franja: la franja termina donde termina la zona segura (RF-23.2).
   */
  '9x16': { ancho: 1080, alto: 1920, seguro: { arriba: 250, abajo: 250 } },
} as const;

export type FormatoFlyer = keyof typeof FORMATOS_FLYER;

/*
 * PISO TIPOGRÁFICO, en px de lienzo. Estas piezas se ven sobre todo en un teléfono, donde
 * el lienzo de 1080 px ocupa unos 390 pt: escala 0,361. El mínimo de texto de iOS es 11 pt
 * (Human Interface Guidelines), y 11 / 0,361 = 30,5 → **31 px**.
 *
 * La primera versión no tenía piso y se midió en el teléfono simulado: afiliaciones a
 * 7,2 pt, mención de ANID a 6,1 pt y rótulo del QR a 5,4 pt `[medido: 2026-10-01]`. Se
 * veía bien en el monitor. El generador falla si un texto queda por debajo de esto.
 */
export const PISO_FLYER = 31;

/*
 * Piso de la mención de financiamiento: letra legal, que se lee acercando, no el mensaje.
 * 20 px son 7,2 pt en el teléfono. Era 24 desde el 2026-10-08; bajó a 20 el 2026-10-09
 * para que el agradecimiento de Mauricio, más largo, quepa en tres renglones y la franja
 * no crezca («la letra lo más pequeña posible para que no se afecten las proporciones»).
 */
export const PISO_PIE_FLYER = 20;

/*
 * Qué lleva cada lámina. Ocho expositores no caben a tamaño legible junto a la portada,
 * así que el feed va en carrusel —Instagram lo muestra como carrusel y LinkedIn como
 * documento PDF— y se mantiene una pieza única de respaldo, para WhatsApp o para quien
 * no quiera publicar varias. Las historias van en dos: en una historia el QR no sirve
 * (se ve en el mismo teléfono), así que la portada deja hueco para el sticker de enlace.
 */
export type LaminaFlyer = 'unica' | 'portada' | 'expositores' | 'inscripcion' | 'historia';

/*
 * `publicacion`: a qué publicación pertenece la lámina. `pie`: la lámina que abre una
 * publicación con pie (carrusel y pieza única; las historias no llevan) trae el pie de
 * publicación. `participantes`: si lleva la fila de instituciones participantes sobre la
 * franja; la de expositores no, porque les quitaría alto a los retratos.
 */
const LAMINAS = [
  { id: 'unica', formato: '4x5', lamina: 'unica', publicacion: 'unica', pie: true, participantes: true },
  { id: 'carrusel-1', formato: '4x5', lamina: 'portada', publicacion: 'carrusel', pie: true, participantes: true },
  { id: 'carrusel-2', formato: '4x5', lamina: 'expositores', publicacion: 'carrusel', pie: false, participantes: false },
  { id: 'carrusel-3', formato: '4x5', lamina: 'inscripcion', publicacion: 'carrusel', pie: false, participantes: true },
  { id: 'historia-1', formato: '9x16', lamina: 'historia', publicacion: 'historia', pie: false, participantes: true },
  { id: 'historia-2', formato: '9x16', lamina: 'expositores', publicacion: 'historia', pie: false, participantes: false },
] as const satisfies ReadonlyArray<{
  id: string;
  formato: FormatoFlyer;
  lamina: LaminaFlyer;
  publicacion: 'unica' | 'carrusel' | 'historia';
  pie: boolean;
  participantes: boolean;
}>;

const IDIOMAS_FLYER = ['es', 'en'] as const satisfies readonly Idioma[];

export const PIEZAS_FLYER = IDIOMAS_FLYER.flatMap((idioma) =>
  LAMINAS.map((l) => ({ ...l, idioma, pieza: `${idioma}-${l.id}` })),
);
