/**
 * Genera y valida las piezas de difusión en redes (`specs/003-difusion-redes`).
 *
 * Por pieza escribe en `difusion/flyer/` un PNG para publicar, un PDF vectorial para
 * Illustrator y el texto alternativo. Después mide cada criterio de
 * `specs/003-difusion-redes/requirements.md` que se puede medir, escribe el resultado en
 * `specs/003-difusion-redes/verification.md` —generado, no se edita— y deja las hojas de
 * contacto de `difusion/revision/` para la revisión humana (RF-30). **Una pieza no está
 * lista mientras haya un criterio en rojo**, y el proceso termina con código 1.
 *
 * Los criterios que se miden dentro del lienzo están en `lib/criterios-flyer.mjs`; aquí van
 * los que se miden fuera: dimensiones del PNG, QR, PDF y texto alternativo.
 *
 * Se captura con `prefers-reduced-motion: reduce` para que la figura salga en su estado
 * final, y el PDF con medios de pantalla para que las reglas de impresión del sitio no
 * cambien el cartel.
 *
 * ── EL PDF SE COMPONE CON LAS FUENTES INSTALADAS, NO CON LAS DEL SITIO ──────────
 *
 * El sitio sirve las tres familias como `woff2` **variables**, y Chromium no sabe
 * incrustar una fuente variable en un PDF: la escribe como Type3, e Illustrator abre
 * Type3 como curvas. Se midió: el primer PDF llegó con 14 fuentes Type3 e Illustrator
 * contó 0 marcos de texto `[medido: 2026-10-01]`. Para el PDF las tres variables se
 * reapuntan a las TTF estáticas, inyectadas como `data:` desde la carpeta de fuentes del
 * usuario: Chromium no ve las fuentes instaladas por usuario, se midió.
 *
 * Uso: `npm run build && npm run flyer`.
 */
import { mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { FORMATOS_FLYER, PIEZAS_FLYER, PISO_FLYER, PISO_PIE_FLYER } from '../src/data/flyer.ts';
import { RAIZ, abrirDist } from './lib/servir-dist.mjs';
import { medirLienzo } from './lib/criterios-flyer.mjs';
import { mapaATsv, mapaLienzo } from './lib/mapa-flyer.mjs';

const SALIDA = join(RAIZ, 'difusion', 'flyer');
const REVISION = join(RAIZ, 'difusion', 'revision');
const INFORME = join(RAIZ, 'specs', '003-difusion-redes', 'verification.md');
const JSQR = join(RAIZ, 'node_modules', 'jsqr', 'dist', 'jsQR.js');

/* Nombre corto de cada criterio para el informe. El texto completo es de `requirements.md`. */
const CRITERIOS = {
  'RF-23.1': 'Lienzo y PNG a tamaño exacto',
  'RF-23.2': 'Nada legible en la franja que tapa la interfaz',
  'RF-23.3': 'Lo legible dentro del recorte 3:4 de la grilla',
  'RF-24.1': `Ningún texto bajo ${PISO_FLYER} px (11 pt en teléfono); ${PISO_PIE_FLYER} en la franja de marcas`,
  'RF-24.2': 'Contraste del texto 4,5:1, o 3:1 si es grande',
  'RF-24.3': 'Nada desborda, se corta ni se monta sobre el QR',
  'RF-24.4': 'Al menos 32 px entre contenido y pie',
  'RF-25.1': 'Como mucho tres familias tipográficas',
  'RF-25.2': 'Dominio, fecha y, donde va, organizador',
  'RF-26.1': 'Logo del seminario, variante blanca, sobre su mínimo',
  'RF-26.2': 'Ninguna imagen estirada',
  'RF-26.3': 'Solo las marcas autorizadas en la franja; todos los participantes',
  'RF-26.4': 'ANID a la derecha de las demás marcas',
  'RF-26.5': 'Peso de las marcas entre 0,72× y 1,7× el de ANID',
  'RF-26.6': 'Agradecimiento de financiamiento completo',
  'RF-28.1': 'El QR lee la URL del formulario, a escala 1 y 0,5',
  'RF-28.3': 'Hueco del sticker libre, de 600 × 170 o más',
  'RF-29.1': 'Texto alternativo, entre 1 y 1000 caracteres',
  'RF-29.2': 'PDF sin Type3 y con las tres familias incrustadas',
  'RF-29.3': 'PDF del tamaño del lienzo y bajo 100 MB',
  'RF-29.4': 'Todas las imágenes cargaron',
  'RF-29.6': 'Pie de publicación, hasta 2200 caracteres',
  'RF-29.7': 'Carrusel en un PDF de tres páginas, con texto vivo y bajo 100 MB',
};

/* Variable del sitio → familia, nombre PostScript y genérica. Pesos que el cartel usa. */
const FUENTES_PDF = {
  '--font-display': ['Crimson Pro', 'CrimsonPro', 'serif'],
  '--font-body': ['Atkinson Hyperlegible Next', 'AtkinsonHyperlegibleNext', 'sans-serif'],
  '--font-mono': ['JetBrains Mono', 'JetBrainsMono', 'monospace'],
};
const PESOS = { 400: 'Regular', 600: 'SemiBold' };

async function cssPdf() {
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
 * Fuentes de un PDF de Chromium, que las guarda dentro de flujos comprimidos: cuántas
 * Type3 trae y cuáles de las tres familias del sitio faltan (RF-29.2).
 */
async function fuentesDelPdf(ruta) {
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
    faltan: Object.values(FUENTES_PDF).filter(([, ps]) => !nombres.includes(ps)).map(([f]) => f),
    caja,
    bytes: b.length,
  };
}

/** RF-28.1: el QR se decodifica sobre la captura, a tamaño real y a la mitad. */
async function leerQr(page) {
  const figura = page.locator('[data-flyer-qr]');
  if (!(await figura.count())) return null;
  const esperado = await figura.getAttribute('data-flyer-qr');
  const png = (await figura.locator('div').screenshot()).toString('base64');
  await page.addScriptTag({ path: JSQR });
  const leidos = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    return [1, 0.5].map((escala) => {
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(img.width * escala);
      lienzo.height = Math.round(img.height * escala);
      const g = lienzo.getContext('2d');
      g.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      const d = g.getImageData(0, 0, lienzo.width, lienzo.height);
      return window.jsQR(d.data, d.width, d.height)?.data ?? null;
    });
  }, png);
  const malos = leidos.filter((l) => l !== esperado);
  return { id: 'RF-28.1', ok: !malos.length, detalle: malos.length ? `lee «${malos[0]}»` : '' };
}

const dimensionesPng = (b) => [b.readUInt32BE(16), b.readUInt32BE(20)];

await mkdir(SALIDA, { recursive: true });
await mkdir(REVISION, { recursive: true });
const CSS_PDF = await cssPdf();
const { base, navegador, cerrar } = await abrirDist();
const resultados = {};
// Las piezas que escribieron su PDF en esta corrida: RF-29.7 solo une esas.
const pdfsEscritos = new Set();

for (const { pieza, formato, idioma, publicacion, pie: llevaPie } of PIEZAS_FLYER) {
  const { ancho, alto, seguro } = FORMATOS_FLYER[formato];
  const r = [];
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const respuesta = await page.goto(`${base}/flyer/${pieza}/`, { waitUntil: 'networkidle' });
  if (respuesta?.status() !== 200) {
    resultados[pieza] = [{ id: 'RF-23.1', ok: false, detalle: `HTTP ${respuesta?.status()}` }];
    await ctx.close();
    continue;
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  r.push(...(await page.evaluate(medirLienzo, { seguro, ancho, alto, piso: PISO_FLYER, pisoPie: PISO_PIE_FLYER, grilla34: formato === '4x5' })));
  const qr = await leerQr(page);
  if (qr) r.push(qr);

  const rutaPng = join(SALIDA, `${pieza}.png`);
  await page.screenshot({ path: rutaPng, clip: { x: 0, y: 0, width: ancho, height: alto } });
  const [w, h] = dimensionesPng(await readFile(rutaPng));
  r.push({ id: 'RF-23.1', ok: w === ancho && h === alto, detalle: `${w}×${h}` });

  const alt = (await page.locator('meta[name="flyer-alt"]').getAttribute('content')) ?? '';
  await writeFile(join(SALIDA, `${pieza}.alt.txt`), `${alt}\n`, 'utf8');
  r.push({ id: 'RF-29.1', ok: alt.length > 0 && alt.length <= 1000, detalle: `${alt.length} caracteres` });

  /*
   * RF-29.6 · pie de publicación, uno por publicación: lo trae la lámina que `LAMINAS`
   * marca con `pie` y se escribe como `<idioma>-<publicacion>.pie.txt`. Si esa lámina no
   * lo trae, falla. 2200 caracteres es el máximo de Instagram; LinkedIn admite 3000.
   */
  if (llevaPie) {
    // Con `evaluate` y no con `locator`: el locator esperaría 30 s si la etiqueta falta.
    const pie = (await page.evaluate(() => document.querySelector('meta[name="flyer-pie"]')?.content)) ?? '';
    await writeFile(join(SALIDA, `${idioma}-${publicacion}.pie.txt`), `${pie}\n`, 'utf8');
    r.push({ id: 'RF-29.6', ok: pie.length > 0 && pie.length <= 2200, detalle: `${pie.length} caracteres` });
  }

  // Las fuentes instaladas tienen métricas apenas distintas: se vuelve a medir el lienzo.
  await page.addStyleTag({ content: CSS_PDF });
  await page.evaluate(() => document.fonts.ready);
  const enPdf = (await page.evaluate(medirLienzo, { seguro, ancho, alto, piso: PISO_FLYER, pisoPie: PISO_PIE_FLYER, grilla34: false }))
    .filter((x) => x.id === 'RF-24.3' && !x.ok)
    .map((x) => ({ ...x, detalle: `con las fuentes del PDF: ${x.detalle}` }));
  r.push(...enPdf);
  // Con las fuentes del PDF, para que las cajas sean las del PDF (ver `lib/mapa-flyer.mjs`).
  await writeFile(join(SALIDA, `${pieza}.mapa.tsv`), `${mapaATsv(await page.evaluate(mapaLienzo))}\n`, 'utf8');

  const rutaPdf = join(SALIDA, `${pieza}.pdf`);
  await page.emulateMedia({ media: 'screen' });
  await page.pdf({ path: rutaPdf, width: `${ancho}px`, height: `${alto}px`, printBackground: true, pageRanges: '1' });
  const pdf = await fuentesDelPdf(rutaPdf);
  pdfsEscritos.add(pieza);
  r.push({ id: 'RF-29.2', ok: !pdf.type3 && !pdf.faltan.length, detalle: pdf.type3 ? `${pdf.type3} Type3` : pdf.faltan.join(', ') });
  const [pw, ph] = pdf.caja;
  const cuadra = Math.abs(pw - ancho * 0.75) < 1 && Math.abs(ph - alto * 0.75) < 1;
  r.push({ id: 'RF-29.3', ok: cuadra && pdf.bytes < 100e6, detalle: `${pw}×${ph} pt, ${(pdf.bytes / 1e6).toFixed(1)} MB` });

  resultados[pieza] = r;
  await ctx.close();
}

/* RF-30.1: hojas de contacto a tamaño de teléfono, para la revisión humana. */
for (const idioma of ['es', 'en']) {
  const piezas = PIEZAS_FLYER.filter((p) => p.idioma === idioma);
  const celdas = await Promise.all(
    piezas.map(async ({ pieza }) => {
      const b64 = (await readFile(join(SALIDA, `${pieza}.png`))).toString('base64');
      return `<figure style="margin:0"><img src="data:image/png;base64,${b64}" alt="${pieza}" style="width:390px;display:block"><figcaption style="font:14px system-ui">${pieza}</figcaption></figure>`;
    }),
  );
  const page = await navegador.newPage({ viewport: { width: piezas.length * 406, height: 800 } });
  await page.setContent(`<body style="margin:0;background:#888;display:flex;gap:16px;align-items:flex-start">${celdas.join('')}</body>`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(REVISION, `telefono-${idioma}.png`), fullPage: true });
  await page.close();
}

await cerrar();

/*
 * RF-29.7 · el carrusel como un solo PDF, para publicarlo en LinkedIn como documento: así
 * se ve deslizable; las tres imágenes sueltas las muestra en cuadrícula. Se unen los PDF
 * vectoriales de las láminas, con su texto vivo, y se le vuelve a medir RF-29.2 (sin Type3,
 * las tres familias). El resultado se anota en la lámina que abre el carrusel.
 */
// Se fija aparte y no se deduce de `LAMINAS`: deducido, el criterio no podría fallar. Si
// el carrusel gana o pierde láminas, se cambia junto con `LAMINAS`.
const PAGINAS_CARRUSEL = 3;
for (const idioma of ['es', 'en']) {
  const laminas = PIEZAS_FLYER.filter((p) => p.idioma === idioma && p.publicacion === 'carrusel');
  const abre = laminas.find((p) => p.pie)?.pieza;
  if (!abre) throw new Error(`El carrusel ${idioma} no tiene lámina con pie en LAMINAS (src/data/flyer.ts).`);
  const ruta = join(SALIDA, `${idioma}-carrusel.pdf`);
  // Una lámina que no llegó a su PDF en esta corrida (falló al cargar) no se une: el PDF que
  // haya en disco sería el de una corrida anterior. Se borra el carrusel viejo para que no
  // quede uno desactualizado junto al informe en rojo.
  const sinPdf = laminas.filter(({ pieza }) => !pdfsEscritos.has(pieza));
  if (sinPdf.length) {
    await rm(ruta, { force: true });
    resultados[abre].push({ id: 'RF-29.7', ok: false, detalle: `sin PDF de ${sinPdf.map((p) => p.pieza).join(', ')}` });
    continue;
  }
  const origenes = await Promise.all(laminas.map(({ pieza }) => readFile(join(SALIDA, `${pieza}.pdf`)).then((b) => PDFDocument.load(b))));
  const carrusel = await PDFDocument.create();
  // El título del documento, el `<title>` de las láminas: es el que LinkedIn muestra.
  carrusel.setTitle(origenes[0].getTitle() ?? '');
  for (const origen of origenes) {
    for (const pagina of await carrusel.copyPages(origen, origen.getPageIndices())) carrusel.addPage(pagina);
  }
  await writeFile(ruta, await carrusel.save());
  const pdf = await fuentesDelPdf(ruta);
  const paginas = carrusel.getPageCount();
  const detalle = [
    `${paginas} páginas`,
    `${(pdf.bytes / 1e6).toFixed(1)} MB`,
    pdf.type3 && `${pdf.type3} Type3`,
    pdf.faltan.length && `faltan ${pdf.faltan.join(', ')}`,
  ].filter(Boolean);
  resultados[abre].push({
    id: 'RF-29.7',
    ok: paginas === PAGINAS_CARRUSEL && !pdf.type3 && !pdf.faltan.length && pdf.bytes < 100e6,
    detalle: detalle.join(', '),
  });
}

/* Informe: una fila por criterio, una columna por pieza. */
const piezas = Object.keys(resultados);
const filas = Object.entries(CRITERIOS).map(([id, nombre]) => {
  const celdas = piezas.map((p) => {
    const de = resultados[p].filter((x) => x.id === id);
    if (!de.length) return 'n/a';
    return de.every((x) => x.ok) ? '✓' : `✗ ${de.filter((x) => !x.ok).map((x) => x.detalle).join('; ')}`;
  });
  return `| ${id} | ${nombre} | ${celdas.join(' | ')} |`;
});
const fallas = piezas.flatMap((p) => resultados[p].filter((x) => !x.ok).map((x) => ({ p, ...x })));
const sello = new Date().toISOString().slice(0, 16).replace('T', ' ');
await writeFile(
  INFORME,
  [
    '# Verificación de las piezas de difusión',
    '',
    `> **Generado por \`npm run flyer\` el ${sello} UTC. No editar.** Criterios en`,
    '> [`requirements.md`](requirements.md). `n/a` = el criterio no aplica a esa pieza.',
    '',
    fallas.length
      ? `**${fallas.length} criterio(s) en rojo: las piezas NO están listas.**`
      : '**Todos los criterios medibles en verde.** Falta la revisión humana de RF-30 antes de publicar.',
    '',
    `| Criterio | Qué | ${piezas.join(' | ')} |`,
    `| --- | --- | ${piezas.map(() => '---').join(' | ')} |`,
    ...filas,
    '',
  ].join('\n'),
  'utf8',
);

console.log(`\nPiezas en difusion/flyer/ · hojas de revisión en difusion/revision/ · informe en specs/003-difusion-redes/verification.md\n`);
if (fallas.length) {
  for (const f of fallas) console.error(`  ✗ ${f.p}  ${f.id} ${CRITERIOS[f.id] ?? ''}${f.detalle ? ` — ${f.detalle}` : ''}`);
  console.error(`\n${fallas.length} criterio(s) en rojo: no están listas.\n`);
  process.exitCode = 1;
} else {
  console.log(`  ✓ ${piezas.length} piezas, ${Object.keys(CRITERIOS).length} criterios medibles en verde. Falta RF-30 (revisión humana).\n`);
}
