/**
 * Genera las credenciales del evento (RF-36, `specs/003-difusion-redes`).
 *
 * Por categoría escribe en `difusion/credenciales/`:
 *   - `credenciales-<categoria>.pdf`: una credencial por página, 104 × 144 mm con la caja
 *     de corte de 100 × 140 (`TrimBox`) y 2 mm de sangrado: para la imprenta.
 *   - `credenciales-<categoria>-A4.pdf`: cuatro por hoja A4, sin sangrado, con marcas de
 *     corte: para imprimir en la oficina y cortar.
 * y la hoja de revisión `difusion/revision/credenciales.png`.
 *
 * Inscritos: `--inscritos <planilla.csv>` llena la credencial de asistente en blanco con
 * cada fila —en el navegador, al capturar— y deja los PDF en `difusion/credenciales/privado/`,
 * que git ignora: son datos personales y no pasan por el sitio ni por el repositorio. Las
 * columnas se reconocen por nombre (nombre o name; institución, afiliación, affiliation u
 * organización), o se dicen con `--col-nombre` y `--col-afiliacion`.
 *
 * Mide: tamaño y cajas del PDF leído del archivo (RF-36.1), que el nombre quepa en dos
 * renglones con las fuentes del sitio y con las del PDF (RF-36.2), fuentes incrustadas sin
 * Type3 (RF-36.3), hojas A4 completas (RF-36.4) y que la carpeta de inscritos esté ignorada
 * (RF-36.5). **Un criterio en rojo termina con código 1.**
 *
 * Uso: `npm run build && npm run credenciales [-- --inscritos ruta.csv]`.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument, rgb } from 'pdf-lib';
import { RAIZ, abrirDist } from './lib/servir-dist.mjs';
import { cssPdf, fuentesDelPdf } from './lib/pdf-fuentes.mjs';

const SALIDA = join(RAIZ, 'difusion', 'credenciales');
const PRIVADO = join(SALIDA, 'privado');
const REVISION = join(RAIZ, 'difusion', 'revision');
const PT_POR_MM = 72 / 25.4;
const CORTE = { w: 100, h: 140 };
const SANGRADO = 2;
const HOJA = { w: 210, h: 297 };
/* El lienzo en px CSS a 96 por pulgada: 104 × 144 mm. */
const VIEWPORT = { width: Math.ceil(((CORTE.w + 2 * SANGRADO) / 25.4) * 96), height: Math.ceil(((CORTE.h + 2 * SANGRADO) / 25.4) * 96) };
const CATEGORIAS = ['expositor', 'organizacion', 'asistente', 'apoyo'];

const argumento = (nombre) => {
  const i = process.argv.indexOf(nombre);
  return i > 0 ? process.argv[i + 1] : undefined;
};

/** CSV con comillas dobles, comas o punto y coma (Excel en español usa `;`). */
function leerCsv(texto) {
  const sep = (texto.split('\n')[0].match(/;/g) ?? []).length > (texto.split('\n')[0].match(/,/g) ?? []).length ? ';' : ',';
  const filas = [];
  let fila = [];
  let campo = '';
  let comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (comillas) {
      if (ch === '"' && texto[i + 1] === '"') (campo += '"'), i++;
      else if (ch === '"') comillas = false;
      else campo += ch;
    } else if (ch === '"') comillas = true;
    else if (ch === sep) fila.push(campo), (campo = '');
    else if (ch === '\n') fila.push(campo.replace(/\r$/, '')), filas.push(fila), (fila = []), (campo = '');
    else campo += ch;
  }
  if (campo || fila.length) fila.push(campo), filas.push(fila);
  return filas.filter((f) => f.some((v) => v.trim()));
}

function inscritosDe(texto) {
  const [cabecera, ...filas] = leerCsv(texto.replace(/^﻿/, ''));
  const columna = (pedida, patron) => {
    const i = pedida ? cabecera.indexOf(pedida) : cabecera.findIndex((h) => patron.test(h));
    if (i < 0) throw new Error(`No encuentro la columna ${pedida ?? patron} en: ${cabecera.join(' | ')}`);
    return i;
  };
  const n = columna(argumento('--col-nombre'), /^(nombre|name|full name|nombre completo)/i);
  const a = columna(argumento('--col-afiliacion'), /(instituci|afiliaci|affiliation|organi[sz]a)/i);
  return filas.map((f) => ({ nombre: f[n].trim(), afiliacion: (f[a] ?? '').trim() })).filter((p) => p.nombre);
}

/*
 * RF-36.2: el nombre en dos renglones o menos, y nada que se salga de su caja. Un nombre
 * largo baja de cuerpo de medio en medio milímetro hasta caber, sin bajar de 6,5 mm: de ahí
 * para abajo ya no se lee a un metro, y vale más que el criterio falle y alguien lo abrevie.
 */
const ajustarNombre = () => {
  const el = document.querySelector('[data-credencial-nombre]');
  if (!el.firstChild) return { renglones: 0, desborda: false };
  const renglones = () => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size;
  };
  let cuerpo = (parseFloat(getComputedStyle(el).fontSize) * 25.4) / 96;
  while (cuerpo > 6.5 && renglones() > 2) {
    cuerpo -= 0.5;
    el.style.fontSize = `${cuerpo}mm`;
  }
  const main = el.closest('main');
  return { renglones: renglones(), desborda: el.scrollWidth > el.clientWidth + 1 || main.scrollHeight > main.clientHeight + 1 };
};

/** Pone la caja de corte y la de sangrado; devuelve los bytes. */
async function conCajas(bytes) {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const p = doc.getPage(0);
  p.setTrimBox(SANGRADO * PT_POR_MM, SANGRADO * PT_POR_MM, CORTE.w * PT_POR_MM, CORTE.h * PT_POR_MM);
  p.setBleedBox(0, 0, p.getWidth(), p.getHeight());
  return doc.save();
}

/** RF-36.1, leído del archivo escrito: hoja de 104 × 144 y corte de 100 × 140 a 2 mm. */
async function verificarCajas(bytes) {
  const p = (await PDFDocument.load(bytes)).getPage(0);
  const mm = (v) => v / PT_POR_MM;
  const t = p.getTrimBox();
  const medidas = [mm(p.getWidth()), mm(p.getHeight()), mm(t.x), mm(t.y), mm(t.width), mm(t.height)];
  const esperadas = [CORTE.w + 2 * SANGRADO, CORTE.h + 2 * SANGRADO, SANGRADO, SANGRADO, CORTE.w, CORTE.h];
  const ok = medidas.every((v, i) => Math.abs(v - esperadas[i]) <= 0.5);
  return { ok, detalle: medidas.map((v) => v.toFixed(1)).join(' · ') };
}

/** Cuatro credenciales por hoja A4, recortadas a la caja de corte, con marcas de corte. */
async function hojasA4(paginas) {
  const doc = await PDFDocument.create({ updateMetadata: false });
  const w = CORTE.w * PT_POR_MM;
  const h = CORTE.h * PT_POR_MM;
  const x0 = ((HOJA.w - 2 * CORTE.w) / 2) * PT_POR_MM;
  const y0 = ((HOJA.h - 2 * CORTE.h) / 2) * PT_POR_MM;
  const s = SANGRADO * PT_POR_MM;
  for (let i = 0; i < paginas.length; i += 4) {
    const hoja = doc.addPage([HOJA.w * PT_POR_MM, HOJA.h * PT_POR_MM]);
    for (const [j, bytes] of paginas.slice(i, i + 4).entries()) {
      const origen = await PDFDocument.load(bytes);
      // Solo la caja de corte: en la hoja de oficina no hay sangrado; las credenciales se tocan.
      const recorte = await doc.embedPage(origen.getPage(0), { left: s, bottom: s, right: s + w, top: s + h });
      const col = j % 2;
      const fila = Math.floor(j / 2);
      hoja.drawPage(recorte, { x: x0 + col * w, y: y0 + (1 - fila) * h, width: w, height: h });
    }
    // Marcas de corte en el margen: 4 mm, sin entrar en la credencial.
    const largo = 4 * PT_POR_MM;
    const linea = (a, b) => hoja.drawLine({ start: a, end: b, thickness: 0.4, color: rgb(0, 0, 0) });
    for (const x of [x0, x0 + w, x0 + 2 * w]) {
      linea({ x, y: y0 - largo - 1 }, { x, y: y0 - 1 });
      linea({ x, y: y0 + 2 * h + 1 }, { x, y: y0 + 2 * h + largo + 1 });
    }
    for (const y of [y0, y0 + h, y0 + 2 * h]) {
      linea({ x: x0 - largo - 1, y }, { x: x0 - 1, y });
      linea({ x: x0 + 2 * w + 1, y }, { x: x0 + 2 * w + largo + 1, y });
    }
  }
  return doc.save();
}

/** Une páginas de una credencial cada una en un documento. */
async function unir(paginas) {
  const doc = await PDFDocument.create({ updateMetadata: false });
  for (const bytes of paginas) {
    const origen = await PDFDocument.load(bytes);
    const [p] = await doc.copyPages(origen, [0]);
    doc.addPage(p);
  }
  return doc.save();
}

const inscritosCsv = argumento('--inscritos');
const inscritos = inscritosCsv ? inscritosDe(await readFile(inscritosCsv, 'utf8')) : [];
await mkdir(SALIDA, { recursive: true });
await mkdir(REVISION, { recursive: true });
const CSS_PDF = await cssPdf();
const { base, navegador, cerrar } = await abrirDist();
const ids = (await readdir(join(RAIZ, 'dist', 'credencial'), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
const fallas = [];
const falla = (quien, id, detalle) => fallas.push(`${quien} ${id}: ${detalle}`);

/**
 * Captura una credencial. `persona` llena la plantilla en blanco. `quien` es lo que se
 * escribe en un error: el id, o «inscrito N» para no imprimir nombres en la consola.
 */
async function capturar(id, quien, persona) {
  const page = await navegador.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const respuesta = await page.goto(`${base}/credencial/${id}/`, { waitUntil: 'networkidle' });
  if (respuesta?.status() !== 200) throw new Error(`/credencial/${id}/: HTTP ${respuesta?.status()}`);
  if (persona) {
    await page.evaluate(({ nombre, afiliacion }) => {
      document.querySelector('[data-credencial-nombre]').textContent = nombre;
      document.querySelector('[data-credencial-afiliacion]').textContent = afiliacion;
      document.querySelector('[data-credencial-lineas]')?.remove();
    }, persona);
  }
  await page.evaluate(() => document.fonts.ready);
  for (const fuentes of ['del sitio', 'del PDF']) {
    if (fuentes === 'del PDF') {
      await page.addStyleTag({ content: CSS_PDF });
      await page.evaluate(() => document.fonts.ready);
    }
    const { renglones, desborda } = await page.evaluate(ajustarNombre);
    if (renglones > 2 || desborda) falla(quien, '', `con las fuentes ${fuentes}, el nombre ocupa ${renglones} renglones${desborda ? ' y se sale' : ''} (RF-36.2)`);
  }
  const png = await page.screenshot({ clip: { x: 0, y: 0, ...VIEWPORT } });
  await page.emulateMedia({ media: 'screen' });
  const pdf = await conCajas(await page.pdf({ width: '104mm', height: '144mm', printBackground: true, pageRanges: '1' }));
  await page.close();
  return { pdf, png };
}

const porCategoria = Object.fromEntries(CATEGORIAS.map((c) => [c, []]));
const pngs = [];
for (const id of ids) {
  const categoria = CATEGORIAS.find((c) => id.startsWith(`${c}-`));
  const { pdf, png } = await capturar(id, id);
  porCategoria[categoria].push({ id, pdf });
  pngs.push({ id, png });
}

async function escribirCategoria(carpeta, nombre, paginas) {
  // Las en blanco al final: se imprimen las que hagan falta.
  const ordenadas = [...paginas.filter((p) => !p.id.endsWith('-en-blanco')), ...paginas.filter((p) => p.id.endsWith('-en-blanco'))].map((p) => p.pdf);
  const ruta = join(carpeta, `${nombre}.pdf`);
  const rutaA4 = join(carpeta, `${nombre}-A4.pdf`);
  await writeFile(ruta, await unir(ordenadas));
  await writeFile(rutaA4, await hojasA4(ordenadas));
  // RF-36.1 y RF-36.3, leídos de los archivos escritos.
  for (const r of [ruta, rutaA4]) {
    const f = await fuentesDelPdf(r);
    if (f.type3 || f.faltan.length) falla(nombre, '', `${r.endsWith('-A4.pdf') ? 'A4' : 'PDF'} con ${f.type3} Type3, faltan ${f.faltan.join(', ') || 'ninguna'} (RF-36.3)`);
  }
  const doc = await PDFDocument.load(await readFile(ruta));
  for (const [i] of doc.getPages().entries()) {
    const sola = await PDFDocument.create();
    const [p] = await sola.copyPages(doc, [i]);
    sola.addPage(p);
    const { ok, detalle } = await verificarCajas(await sola.save());
    if (!ok) falla(nombre, `página ${i + 1}`, `hoja y corte ${detalle} mm (RF-36.1)`);
  }
  // RF-36.4: hojas A4 de 210 × 297, tantas como hagan falta para cuatro por hoja.
  const a4 = await PDFDocument.load(await readFile(rutaA4));
  const tamanoOk = a4.getPages().every((p) => Math.abs(p.getWidth() / PT_POR_MM - HOJA.w) < 0.5 && Math.abs(p.getHeight() / PT_POR_MM - HOJA.h) < 0.5);
  if (!tamanoOk || a4.getPageCount() !== Math.ceil(ordenadas.length / 4)) falla(nombre, 'A4', `${a4.getPageCount()} hojas para ${ordenadas.length} credenciales (RF-36.4)`);
}

for (const categoria of CATEGORIAS) await escribirCategoria(SALIDA, `credenciales-${categoria}`, porCategoria[categoria]);

if (inscritos.length) {
  // RF-36.5: los datos personales solo a una carpeta que git ignora.
  await mkdir(PRIVADO, { recursive: true });
  try {
    execFileSync('git', ['check-ignore', '-q', join(PRIVADO, 'x.pdf')], { cwd: RAIZ });
  } catch {
    throw new Error(`${PRIVADO} no está en .gitignore: no se escriben datos de inscritos ahí (RF-36.5).`);
  }
  const paginas = [];
  for (const [i, persona] of inscritos.entries()) {
    const { pdf } = await capturar('asistente-en-blanco', `inscrito ${i + 1}`, persona);
    paginas.push({ id: `inscrito-${i + 1}`, pdf });
  }
  await escribirCategoria(PRIVADO, 'credenciales-inscritos', paginas);
}

/* Hoja de revisión: todas las credenciales públicas lado a lado, a escala de pantalla. */
const celdas = pngs.map(
  ({ id, png }) =>
    `<figure style="margin:0"><img src="data:image/png;base64,${png.toString('base64')}" alt="${id}" width="260" height="${Math.round((260 * VIEWPORT.height) / VIEWPORT.width)}" style="display:block"><figcaption style="font:12px system-ui">${id}</figcaption></figure>`,
);
const hoja = await navegador.newPage({ viewport: { width: 6 * 276, height: 800 } });
await hoja.setContent(`<body style="margin:0;padding:16px;background:#888;display:flex;flex-wrap:wrap;gap:16px">${celdas.join('')}</body>`);
await hoja.waitForTimeout(200);
await writeFile(join(REVISION, 'credenciales.png'), await hoja.screenshot({ fullPage: true }));
await cerrar();

console.log(`\n${ids.length} credenciales públicas${inscritos.length ? ` y ${inscritos.length} de inscritos (en difusion/credenciales/privado/)` : ''}.`);
console.log(`PDF en difusion/credenciales/ · revisión en difusion/revision/credenciales.png\n`);
if (fallas.length) {
  for (const f of fallas) console.error(`  ✗ ${f}`);
  process.exitCode = 1;
} else {
  console.log('  ✓ RF-36.1 a RF-36.5 en verde. Falta la revisión humana y una prueba impresa.\n');
}
