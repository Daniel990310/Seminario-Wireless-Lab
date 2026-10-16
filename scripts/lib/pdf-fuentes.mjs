/**
 * Fuentes del PDF, compartidas por las piezas de difusión (`generar-flyer.mjs`) y las
 * credenciales (`generar-credenciales.mjs`). Por qué las TTF estáticas y no las del sitio:
 * ver la cabecera de `generar-flyer.mjs`, «EL PDF SE COMPONE CON LAS FUENTES INSTALADAS».
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

/* Variable del sitio → familia, nombre PostScript y genérica. Pesos que el cartel usa. */
const FUENTES_PDF = {
  '--font-display': ['Crimson Pro', 'CrimsonPro', 'serif'],
  '--font-body': ['Atkinson Hyperlegible Next', 'AtkinsonHyperlegibleNext', 'sans-serif'],
  '--font-mono': ['JetBrains Mono', 'JetBrainsMono', 'monospace'],
};
const PESOS = { 400: 'Regular', 600: 'SemiBold' };

export async function cssPdf() {
  const carpeta = join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'Windows', 'Fonts');
  const caras = [];
  for (const [familia, postscript] of Object.values(FUENTES_PDF)) {
    for (const [peso, estilo] of Object.entries(PESOS)) {
      const ruta = join(carpeta, `${postscript}-${estilo}.ttf`);
      const ttf = await readFile(ruta).catch(() => null);
      if (!ttf) throw new Error(`Falta ${ruta}. Instalar la fuente (ver specs/habilidades.md).`);
      caras.push(
        `@font-face{font-family:"${familia}";font-weight:${peso};src:url(data:font/ttf;base64,${ttf.toString('base64')}) format("truetype")}`,
      );
    }
  }
  const variables = Object.entries(FUENTES_PDF)
    .map(([v, [familia, , generica]]) => `${v}:"${familia}",${generica}`)
    .join(';');
  return `${caras.join('')}html:root{${variables}}`;
}

/**
 * Las familias que la página usa de verdad, como variables de `FUENTES_PDF`: las de los
 * elementos con texto propio. Así RF-29.2 pide incrustada cada familia que se ve, y no una
 * que la pieza ya no usa (el telón quedó sin serif el 2026-10-15).
 */
export async function familiasUsadas(page) {
  const usadas = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .map((el) => getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')),
  );
  return Object.entries(FUENTES_PDF)
    .filter(([, [familia]]) => usadas.includes(familia))
    .map(([variable]) => variable);
}

/**
 * Fuentes de un PDF de Chromium, que las guarda dentro de flujos comprimidos: cuántas
 * Type3 trae y cuáles de las familias esperadas faltan (RF-29.2). Por omisión, las tres
 * del sitio; una pieza que no usa alguna pasa solo las suyas, como variables de `FUENTES_PDF`.
 */
export async function fuentesDelPdf(ruta, familias = Object.keys(FUENTES_PDF)) {
  const b = await readFile(ruta);
  const s = b.toString('latin1');
  let todo = s;
  for (const m of s.matchAll(/stream\r?\n/g)) {
    const ini = m.index + m[0].length;
    try {
      todo += inflateSync(b.subarray(ini, s.indexOf('endstream', ini))).toString('latin1');
    } catch {
      // Flujo sin comprimir o de imagen: no lleva fuentes.
    }
  }
  const caja = (todo.match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/) ?? []).slice(1).map(Number);
  const nombres = [...new Set(todo.match(/\/BaseFont\s*\/[^\s/\]>]+/g) ?? [])].join(' ');
  return {
    type3: (todo.match(/\/Subtype\s*\/Type3/g) ?? []).length,
    faltan: familias.map((v) => FUENTES_PDF[v]).filter(([, ps]) => !nombres.includes(ps)).map(([f]) => f),
    caja,
    bytes: b.length,
  };
}
