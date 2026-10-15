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
 * PENDÓN ROLLER IMPRESO (RF-33): la pieza que junta en una sola lámina lo que el carrusel
 * reparte en tres, más el retrato de Mauricio. 200 cm de alto visible en 80 u 85 de ancho,
 * las dos medidas de catálogo más comunes (fuentes en `specs/003-difusion-redes`, RF-33).
 *
 * Se dibuja en la **misma escala de px que el carrusel**, para reutilizar sus componentes y
 * su escala tipográfica: los 200 cm visibles son 2700 px, así que 1 px de lienzo mide
 * 0,741 mm y los 1080 px de ancho del carrusel son justo los 80 cm. El generador escribe el
 * PDF a tamaño real con esta razón.
 *
 * El lienzo trae, además del área visible, lo que pide la imprenta:
 *   - **Sangrado** de 10 mm por lado (14 px): el fondo sigue más allá del corte.
 *   - **Base** de 150 mm (203 px) bajo el área visible, que entra en el cassette del roller
 *     y no se ve. Ahí no va nada legible: sigue el blanco de la franja de marcas.
 * `seguro` suma a eso un margen dentro del corte —30 mm arriba, bajo la barra que cuelga la
 * tela, y 40 abajo, sobre el labio del cassette— donde tampoco va texto (RF-23.2).
 */
export const MM_POR_PX_PENDON = 2000 / 2700;
const VISIBLE_MM = 2000;
const SANGRADO_MM = 10;
const BASE_MM = 150;

function pendon(anchoMm: number) {
  const px = (mm: number) => Math.ceil(mm / MM_POR_PX_PENDON);
  const sangrado = px(SANGRADO_MM);
  const base = px(BASE_MM);
  return {
    ancho: px(anchoMm) + 2 * sangrado,
    alto: px(VISIBLE_MM) + base + 2 * sangrado,
    seguro: { arriba: sangrado + px(30), abajo: sangrado + base + px(40) },
    impreso: { anchoMm, visibleMm: VISIBLE_MM, baseMm: BASE_MM, sangradoMm: SANGRADO_MM, sangrado, base },
  };
}

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
  '80x200': pendon(800),
  '85x200': pendon(850),
  /*
   * Pantallas de la sede (RF-34), 1920 × 1080: las plantillas que mandó la Sede PUCV
   * Santiago el 2026-10-15. La de acceso usa el lienzo entero. La del telón del auditorio
   * lleva la gráfica solo en la banda de arriba, 403 px `[medido sobre la plantilla]`, y
   * el resto en **negro puro**, como pide la plantilla: es el fondo detrás de quien expone
   * y de las fotos. `negro` es esa franja; `relleno`, el aire sobre el contenido.
   */
  '16x9': { ancho: 1920, alto: 1080, seguro: { arriba: 0, abajo: 0 } },
  '16x9-telon': { ancho: 1920, alto: 1080, seguro: { arriba: 0, abajo: 677 }, negro: 677, relleno: 36 },
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
 *
 * En el pendón el mismo piso mide 23 mm de cuerpo, unos 16 mm de mayúscula: se lee a unos
 * 2 m, la distancia de quien pasa frente al roller (RF-33.3).
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
 * El pendón es para imprimir: cabe todo porque mide lo que tres láminas juntas. Acceso y
 * telón son las pantallas de la sede durante el evento (RF-34).
 */
export type LaminaFlyer = 'unica' | 'portada' | 'expositores' | 'inscripcion' | 'historia' | 'pendon' | 'acceso' | 'telon';

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
  { id: 'pendon-80x200', formato: '80x200', lamina: 'pendon', publicacion: 'impreso', pie: false, participantes: true },
  { id: 'pendon-85x200', formato: '85x200', lamina: 'pendon', publicacion: 'impreso', pie: false, participantes: true },
  { id: 'pantalla-acceso', formato: '16x9', lamina: 'acceso', publicacion: 'pantalla', pie: false, participantes: true },
  // Sin fila de participantes: la banda del telón mide 403 px y no le cabe.
  { id: 'pantalla-telon', formato: '16x9-telon', lamina: 'telon', publicacion: 'pantalla', pie: false, participantes: false },
] as const satisfies ReadonlyArray<{
  id: string;
  formato: FormatoFlyer;
  lamina: LaminaFlyer;
  publicacion: 'unica' | 'carrusel' | 'historia' | 'impreso' | 'pantalla';
  pie: boolean;
  participantes: boolean;
}>;

const IDIOMAS_FLYER = ['es', 'en'] as const satisfies readonly Idioma[];

export const PIEZAS_FLYER = IDIOMAS_FLYER.flatMap((idioma) =>
  LAMINAS.map((l) => ({ ...l, idioma, pieza: `${idioma}-${l.id}` })),
);
