/**
 * Tamaño de un logo por área, para que un conjunto de marcas pese parejo. Lo usan el muro
 * del sitio (`LogoWall.astro`) y la fila de participantes del flyer
 * (`flyer/Participantes.astro`). Corre en el build: lee archivos de `public/`.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Logo } from '~/data/comun';

/*
 * Un SVG llega como ruta de `/public`; un ráster llega importado, como objeto.
 *
 * La distinción no es un detalle de tipos: `<Image />` **solo** puede optimizar lo segundo,
 * y para un SVG no haría nada porque el optimizador los pasa sin tocar. Se ramifica aquí en
 * lugar de en los datos para que `comun.ts` siga describiendo qué logo es cada cual, y no
 * cómo se dibuja.
 */
export const esRaster = (logo: Logo): logo is ImageMetadata => typeof logo !== 'string';

/*
 * ═══ POR QUÉ NO SE ALINEAN POR ALTURA ═══
 *
 * Antes todos los logos compartían altura (`h-10 w-auto`) y la sección se veía descompuesta.
 * La causa es que **la altura es el normalizador equivocado cuando las proporciones difieren
 * tanto**: Columbia es 7,7 veces más ancho que alto y USACH es más alto que ancho (0,71). A
 * igual altura, Columbia ocupa **once veces más superficie** que USACH, así que uno grita y
 * el otro desaparece.
 *
 * Lo que iguala el peso visual de un conjunto de marcas no es la altura ni la anchura: es el
 * **área**. Para que todas ocupen la misma superficie manteniendo su proporción:
 *
 *     área = alto × ancho = alto × (alto × proporción)  ⇒  alto = √(área / proporción)
 *
 * Se expresa relativo a una proporción de referencia —2,2, la típica de un logo horizontal
 * con escudo y texto— para que un logo de esa forma conserve exactamente la altura base y el
 * ajuste solo actúe sobre los extremos.
 *
 * Se acota entre 0,72× y 1,7×: sin tope, un logo muy apaisado se volvería una línea
 * ilegible y uno vertical rompería el ritmo de la fila. Es un compromiso deliberado entre
 * área constante y legibilidad, no un cálculo puro.
 */
const PROPORCION_REFERENCIA = 2.2;

/** Proporción ancho/alto de una marca, venga como ráster importado o como SVG de `/public`. */
export const proporcionDe = (logo: Logo): number => {
  if (esRaster(logo)) return logo.width / logo.height;
  /*
   * Para un SVG hay que leer el `viewBox` del archivo. Se hace en el build: no llega ni un
   * byte de esto al navegador. Si el archivo no declara `viewBox` se cae a la proporción de
   * referencia, que deja ese logo con la altura base en lugar de romper la página.
   */
  try {
    /*
     * Desde `process.cwd()` y NO desde `import.meta.url`: en el build Astro compila
     * este código a `dist/.prerender/chunks/`, así que `import.meta.url` apunta
     * ahí y `../../public` resolvía a `dist/public`. Este camino **nunca llegó a
     * ejecutarse bien**; el `catch` devolvía la proporción de reserva en silencio y
     * cualquier logo SVG habría salido con la altura equivocada sin avisar. Estaba
     * dormido porque hoy ningún SVG pasa por este componente
     * `[medido: 2026-09-22, en el gemelo de PaginaSeminario]`.
     */
    const ruta = join(process.cwd(), 'public', logo.replace(/^\//, ''));
    const svg = readFileSync(ruta, 'utf8');
    const vb = svg.match(/viewBox="([\d.\-\s]+)"/)?.[1]?.trim().split(/\s+/).map(Number);
    if (vb && vb.length === 4 && vb[2] && vb[3]) return vb[2] / vb[3];
    const ancho = Number(svg.match(/\swidth="([\d.]+)"/)?.[1]);
    const alto = Number(svg.match(/\sheight="([\d.]+)"/)?.[1]);
    if (ancho && alto) return ancho / alto;
  } catch (e) {
    // Ruidoso a propósito: el silencio es lo que mantuvo el defecto escondido.
    console.warn(`[logos] no se pudo leer ${logo}, se usa la proporción de referencia: ${e instanceof Error ? e.message : e}`);
  }
  return PROPORCION_REFERENCIA;
};

/** Alto en px para que el logo ocupe la misma área que uno de proporción 2,2 a `base` px. */
export const alturaPorArea = (logo: Logo, base: number, escalaOptica = 1): number => {
  const factor = Math.sqrt(PROPORCION_REFERENCIA / proporcionDe(logo));
  // El acotado se aplica al factor calculado; la corrección óptica va **después**, porque es
  // un juicio deliberado sobre la marca concreta y no debe quedar recortado por el tope.
  return Math.round(base * Math.min(1.7, Math.max(0.72, factor)) * escalaOptica);
};
