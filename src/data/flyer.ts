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
 * PENDÓN ROLLER IMPRESO (RF-33): la identidad del seminario, reutilizable en otras ediciones
 * (RF-33.5). 200 cm de alto visible en 80 u 85 de ancho,
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
const VISIBLE_MM = 2000;
const VISIBLE_PX = 2700;
const MM_POR_PX_PENDON = VISIBLE_MM / VISIBLE_PX;
const SANGRADO_MM = 10;
const BASE_MM = 150;
/* Unidades del PDF. Las lee también el generador (`scripts/lib/pendon-flyer.mjs`). */
export const PT_POR_MM = 72 / 25.4;
/* Chromium imprime a 96 px por pulgada: 0,75 pt por px de lienzo. */
export const PT_POR_PX_CHROMIUM = 0.75;

/** Lo que el generador necesita de un formato impreso para escribir el PDF a tamaño real. */
interface Impreso {
  anchoMm: number;
  visibleMm: number;
  baseMm: number;
  sangradoMm: number;
  /** Milímetros impresos por px de lienzo. */
  mmPorPx: number;
  /** Sangrado y base en px de lienzo. */
  sangrado: number;
  base: number;
}

/**
 * Un formato de pieza. Todos los campos en todos los formatos: quien lo lee destructura y
 * no pregunta qué claves trae.
 */
export interface FormatoFlyerDef {
  ancho: number;
  alto: number;
  /** Franja que no lleva nada legible, desde cada borde (RF-23.2). */
  seguro: { arriba: number; abajo: number };
  /**
   * Aire sobre el primer contenido, dentro de `seguro.arriba`: 72 a lienzo entero, el
   * margen lateral del cartel; 40 bajo una franja segura, que ya separa del borde; 36 en la
   * banda del telón, que mide 403 px y no tiene alto que regalar.
   */
  relleno: number;
  /**
   * Puntos PDF por px de lienzo en el PDF **final**. Chromium imprime a 0,75; el pendón se
   * reescribe a tamaño real (RF-33.1). Lo leen el PDF, su criterio de tamaño (RF-29.3) y el
   * mapa para Illustrator: una sola fuente.
   */
  ptPorPx: number;
  /**
   * Qué hay bajo el área útil: el blanco de la franja en el pendón, para que un enrollado
   * distinto no deje ver una tira oscura (RF-33.2); negro puro en el telón (RF-34.2).
   */
  fondoInferior: 'blanco' | 'negro' | null;
  impreso: Impreso | null;
}

/*
 * `Math.ceil` sobre un cociente que debería ser entero: `2000 / 2700` no es representable y
 * un exceso de un ulp subiría un px. Se resta un margen antes de redondear.
 */
function pendon(anchoMm: number): FormatoFlyerDef {
  const px = (mm: number) => Math.ceil(mm / MM_POR_PX_PENDON - 1e-9);
  const sangrado = px(SANGRADO_MM);
  const base = px(BASE_MM);
  return {
    ancho: px(anchoMm) + 2 * sangrado,
    alto: px(VISIBLE_MM) + base + 2 * sangrado,
    seguro: { arriba: sangrado + px(30), abajo: sangrado + base + px(40) },
    relleno: 40,
    ptPorPx: MM_POR_PX_PENDON * PT_POR_MM,
    fondoInferior: 'blanco',
    impreso: {
      anchoMm,
      visibleMm: VISIBLE_MM,
      baseMm: BASE_MM,
      sangradoMm: SANGRADO_MM,
      mmPorPx: MM_POR_PX_PENDON,
      sangrado,
      base,
    },
  };
}

/** Lienzo que se ve en pantalla (redes y sede): PDF de Chromium tal cual. */
function digital(f: Pick<FormatoFlyerDef, 'ancho' | 'alto' | 'seguro' | 'relleno'> & Partial<Pick<FormatoFlyerDef, 'fondoInferior'>>): FormatoFlyerDef {
  return { fondoInferior: null, ...f, ptPorPx: PT_POR_PX_CHROMIUM, impreso: null };
}

/* Alto de la banda de gráfica del telón, `[medido sobre la plantilla de la sede]` (RF-34.2). */
const BANDA_TELON = 403;

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
  '4x5': digital({ ancho: 1080, alto: 1350, seguro: { arriba: 0, abajo: 0 }, relleno: 72 }),
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
  '9x16': digital({ ancho: 1080, alto: 1920, seguro: { arriba: 250, abajo: 250 }, relleno: 40 }),
  '80x200': pendon(800),
  '85x200': pendon(850),
  /*
   * Pantallas de la sede (RF-34), 1920 × 1080: las plantillas que mandó la Sede PUCV
   * Santiago el 2026-10-15. La de acceso usa el lienzo entero. La del telón del auditorio
   * lleva la gráfica solo en la banda de arriba, `BANDA_TELON`, y el resto en **negro
   * puro**, como pide la plantilla: es el fondo detrás de quien expone y de las fotos.
   */
  '16x9': digital({ ancho: 1920, alto: 1080, seguro: { arriba: 0, abajo: 0 }, relleno: 72 }),
  '16x9-telon': digital({ ancho: 1920, alto: 1080, seguro: { arriba: 0, abajo: 1080 - BANDA_TELON }, relleno: 36, fondoInferior: 'negro' }),
} satisfies Record<string, FormatoFlyerDef>;

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
 * Lo que depende de la lámina y no de la pieza:
 *   - `emisor`: altura del emisor de la figura (borde derecho) bajo el inicio del contenido,
 *     el centro del hueco que la lámina deja a la derecha. Ver `CartelFlyer.astro`.
 *   - `organizador`: si la lámina nombra al organizador, para RF-25.2.
 *   - `participantes`: si lleva la fila de instituciones participantes sobre la franja. La
 *     de expositores no, porque les quitaría alto a los retratos; el telón tampoco, porque
 *     su banda mide `BANDA_TELON` y no le cabe.
 *   - `qr`: a dónde lleva el QR, si lo hay. El generador lo compara con lo que decodifica
 *     (RF-28.1): el formulario de inscripción; el programa del sitio en la pantalla de
 *     acceso, donde el día del evento se busca la hora de cada charla (RF-34.1); el sitio en
 *     el pendón, que sirve más de una edición (RF-33.5).
 *   - `fecha`: si la lámina dice la fecha (RF-25.2). Todas, salvo el pendón: se reutiliza.
 *   - `escalaFranja` y `escalaParticipantes`: cuánto crecen las marcas y la fila de
 *     participantes. En el pendón, las colaboraciones son lo que más se lee (RF-33.5); la
 *     franja no pasa de 1,2 porque PUCV (511 px) y CYTED (300 px) bajarían de 90 ppi (RF-33.4).
 */
interface DatosLamina {
  emisor: number;
  organizador: boolean;
  participantes: boolean;
  qr: 'registro' | 'programa' | 'sitio' | null;
  fecha: boolean;
  escalaFranja: number;
  escalaParticipantes: number;
}
const COMUN = { fecha: true, escalaFranja: 1, escalaParticipantes: 1 };
const POR_LAMINA: Record<LaminaFlyer, DatosLamina> = {
  // Emisor [medido sobre las capturas de 2026-10-01]
  unica: { ...COMUN, emisor: 230, organizador: true, participantes: true, qr: 'registro' },
  portada: { ...COMUN, emisor: 700, organizador: true, participantes: true, qr: null },
  historia: { ...COMUN, emisor: 900, organizador: true, participantes: true, qr: null },
  expositores: { ...COMUN, emisor: 700, organizador: false, participantes: false, qr: null },
  inscripcion: { ...COMUN, emisor: 820, organizador: false, participantes: true, qr: 'registro' },
  // Emisor [medido sobre las capturas de 2026-10-14 y 2026-10-15]
  pendon: { emisor: 330, organizador: true, participantes: true, qr: 'sitio', fecha: false, escalaFranja: 1.2, escalaParticipantes: 2.6 },
  acceso: { ...COMUN, emisor: 470, organizador: true, participantes: true, qr: 'programa' },
  telon: { ...COMUN, emisor: 150, organizador: false, participantes: false, qr: null },
};

/*
 * A qué publicación pertenece cada pieza, y si se ve en un teléfono: la hoja de contacto
 * de RF-30.1 lleva solo esas. Ni el pendón ni las pantallas de la sede.
 */
const EN_TELEFONO = { unica: true, carrusel: true, historia: true, impreso: false, pantalla: false } as const;
type Publicacion = keyof typeof EN_TELEFONO;

/*
 * `pie`: la lámina que abre una publicación con pie (carrusel y pieza única; las historias
 * no llevan) trae el pie de publicación.
 */
const LAMINAS = [
  { id: 'unica', formato: '4x5', lamina: 'unica', publicacion: 'unica', pie: true },
  { id: 'carrusel-1', formato: '4x5', lamina: 'portada', publicacion: 'carrusel', pie: true },
  { id: 'carrusel-2', formato: '4x5', lamina: 'expositores', publicacion: 'carrusel', pie: false },
  { id: 'carrusel-3', formato: '4x5', lamina: 'inscripcion', publicacion: 'carrusel', pie: false },
  { id: 'historia-1', formato: '9x16', lamina: 'historia', publicacion: 'historia', pie: false },
  { id: 'historia-2', formato: '9x16', lamina: 'expositores', publicacion: 'historia', pie: false },
  { id: 'pendon-80x200', formato: '80x200', lamina: 'pendon', publicacion: 'impreso', pie: false },
  { id: 'pendon-85x200', formato: '85x200', lamina: 'pendon', publicacion: 'impreso', pie: false },
  { id: 'pantalla-acceso', formato: '16x9', lamina: 'acceso', publicacion: 'pantalla', pie: false },
  { id: 'pantalla-telon', formato: '16x9-telon', lamina: 'telon', publicacion: 'pantalla', pie: false },
] as const satisfies ReadonlyArray<{
  id: string;
  formato: FormatoFlyer;
  lamina: LaminaFlyer;
  publicacion: Publicacion;
  pie: boolean;
}>;

const IDIOMAS_FLYER = ['es', 'en'] as const satisfies readonly Idioma[];

export const PIEZAS_FLYER = IDIOMAS_FLYER.flatMap((idioma) =>
  LAMINAS.map((l) => ({
    ...l,
    ...POR_LAMINA[l.lamina],
    enTelefono: EN_TELEFONO[l.publicacion],
    idioma,
    pieza: `${idioma}-${l.id}`,
  })),
);
