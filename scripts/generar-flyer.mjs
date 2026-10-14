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
import { FORMATOS_FLYER, MM_POR_PX_PENDON, PIEZAS_FLYER, PISO_FLYER, PISO_PIE_FLYER } from '../src/data/flyer.ts';
import { RAIZ, abrirDist } from './lib/servir-dist.mjs';
import { medirLienzo } from './lib/criterios-flyer.mjs';
import { mapaATsv, mapaLienzo } from './lib/mapa-flyer.mjs';

const SALIDA = join(RAIZ, 'difusion', 'flyer');
const REVISION = join(RAIZ, 'difusion', 'revision');
const INFORME = join(RAIZ, 'specs', '003-difusion-redes', 'verification.md');
const JSQR = join(RAIZ, 'node_modules', 'jsqr', 'dist', 'jsQR.js');

/*
 * PENDÓN IMPRESO (RF-33). Las razones de cada número, en `requirements.md`.
 *   - `ZOOM_PENDON`: el lienzo se dibuja a 0,741 mm por px y Chromium imprime a 96 px por
 *     pulgada (0,265 mm por px): el PDF de Chromium es el pendón a escala 1:2,8, y
 *     `aTamanoReal` lo agranda.
 *   - `PPI_MINIMO`: a 1 m, la distancia más corta a la que se mira un roller, el ojo
 *     separa 0,29 mm (un minuto de arco), 87 ppi. 90 ppi alcanza; 150 es lo que piden las
 *     imprentas para mirar de cerca, y los retratos no lo tienen.
 *   - `QR_MINIMO_MM`: se lee hasta a unas diez veces su lado; 15 cm, a 1,5 m.
 */
const ZOOM_PENDON = MM_POR_PX_PENDON / (25.4 / 96);
const PPI_MINIMO = 90;
const PPI_JPG = 150;
const QR_MINIMO_MM = 150;
const PT_POR_MM = 72 / 25.4;

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
  'RF-33.1': 'Pendón: PDF a tamaño real, con caja de corte y de sangrado',
  'RF-33.4': `Pendón: toda imagen ráster a ${PPI_MINIMO} ppi o más, impresa`,
  'RF-33.6': `Pendón: QR de ${QR_MINIMO_MM / 10} cm de lado o más`,
  'RF-33.7': `Pendón: JPG a ${PPI_JPG} ppi del tamaño exacto del lienzo`,
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

/*
 * Escribe con reintentos. El repositorio vive en OneDrive, que bloquea unos segundos el
 * archivo que acaba de sincronizar: al regenerar, abrir el PDF de la corrida anterior falló
 * con `UNKNOWN` (errno -4094) dos veces seguidas en la misma pieza `[medido: 2026-10-14]`.
 */
async function escribir(ruta, datos, intentos = 6) {
  for (let i = 1; ; i++) {
    try {
      return await writeFile(ruta, datos);
    } catch (e) {
      if (i >= intentos || !['UNKNOWN', 'EBUSY', 'EPERM'].includes(e.code)) throw e;
      await new Promise((ok) => setTimeout(ok, 1000 * i));
    }
  }
}

/**
 * RF-33.4 y RF-33.6, sobre el lienzo sin `zoom`: resolución impresa de cada imagen ráster
 * y lado del QR. Con `object-cover` la imagen se escala hasta cubrir la caja, así que manda
 * el lado que más se agranda.
 */
async function medirImpreso(page) {
  const { bajas, qrMm } = await page.evaluate((mmPorPx) => {
    const pulgadas = (px) => (px * mmPorPx) / 25.4;
    const bajas = [...document.images]
      .filter((i) => i.naturalWidth && !/\.svg(\?|$)/i.test(i.currentSrc || i.src))
      .map((i) => {
        const r = i.getBoundingClientRect();
        const escala = Math.max(r.width / i.naturalWidth, r.height / i.naturalHeight);
        return { src: (i.currentSrc || i.src).split('/').pop(), ppi: Math.round(1 / (pulgadas(escala))) };
      });
    const qr = document.querySelector('[data-flyer-qr] div')?.getBoundingClientRect();
    return { bajas, qrMm: qr ? qr.width * mmPorPx : 0 };
  }, MM_POR_PX_PENDON);
  const malas = bajas.filter((b) => b.ppi < PPI_MINIMO);
  const peor = bajas.reduce((a, b) => (b.ppi < a.ppi ? b : a), { ppi: Infinity });
  return [
    {
      id: 'RF-33.4',
      ok: bajas.length > 0 && !malas.length,
      detalle: malas.length ? malas.map((b) => `${b.src} ${b.ppi} ppi`).join(' · ') : `la más baja, ${peor.ppi} ppi (${peor.src})`,
    },
    { id: 'RF-33.6', ok: qrMm >= QR_MINIMO_MM, detalle: `${Math.round(qrMm)} mm` },
  ];
}

/**
 * RF-33.1 · el pendón a tamaño real, con sus cajas de imprenta.
 *
 * Chromium imprime el lienzo a 0,265 mm por px, un tercio del tamaño real. Agrandarlo antes
 * de imprimir no sirve: con `zoom` o con `transform: scale` la hoja de 2,17 m salió con el
 * lienzo sin agrandar, centrado y cortado `[medido: 2026-10-14]`. Así que se escala después:
 * la hoja de Chromium entra como objeto de formulario en una hoja nueva de tamaño real.
 * Texto, trazados y QR siguen vectoriales y las fotos conservan todos sus píxeles.
 *
 * Se añaden la `TrimBox` —el corte: ancho × (visible + base)— y la `BleedBox`, el corte más
 * el sangrado: con ellas el programa de la imprenta pone las marcas de corte sin que nadie
 * las mida a mano.
 */
async function aTamanoReal(ruta, { ancho, alto, impreso }) {
  const origen = await PDFDocument.load(await readFile(ruta));
  const doc = await PDFDocument.create();
  doc.setTitle(origen.getTitle() ?? '');
  const pt = (px) => px * MM_POR_PX_PENDON * PT_POR_MM;
  const medio = { w: pt(ancho), h: pt(alto) };
  const [lienzo] = await doc.embedPdf(origen, [0]);
  const hoja = doc.addPage([medio.w, medio.h]);
  hoja.drawPage(lienzo, { x: 0, y: 0, width: medio.w, height: medio.h });
  const corte = {
    x: pt(impreso.sangrado),
    w: impreso.anchoMm * PT_POR_MM,
    h: (impreso.visibleMm + impreso.baseMm) * PT_POR_MM,
  };
  // pdf-lib mide desde abajo a la izquierda; el corte empieza a `sangrado` del borde de arriba.
  corte.y = medio.h - pt(impreso.sangrado) - corte.h;
  const s = impreso.sangradoMm * PT_POR_MM;
  hoja.setTrimBox(corte.x, corte.y, corte.w, corte.h);
  hoja.setBleedBox(corte.x - s, corte.y - s, corte.w + 2 * s, corte.h + 2 * s);
  await escribir(ruta, await doc.save());
  // El sangrado tiene que caber en la hoja por los cuatro lados.
  const margenes = [corte.x - s, corte.y - s, medio.w - corte.x - corte.w - s, medio.h - corte.y - corte.h - s];
  const ok = margenes.every((m) => m >= -0.5);
  const mm = (v) => Math.round(v / PT_POR_MM);
  return { id: 'RF-33.1', ok, detalle: `hoja ${mm(medio.w)}×${mm(medio.h)} mm, corte ${mm(corte.w)}×${mm(corte.h)} mm` };
}

/**
 * RF-33.7 · el pendón también como JPG a `PPI_JPG`, para la imprenta que no recibe PDF. Se
 * captura de nuevo con más píxeles por px de lienzo: es el mismo dibujo, no una ampliación.
 */
async function jpgDeImprenta(navegador, url, pieza, { ancho, alto }) {
  const escala = (PPI_JPG * MM_POR_PX_PENDON) / 25.4;
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: escala, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const jpg = await page.screenshot({ type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: ancho, height: alto } });
  await ctx.close();
  /*
   * Chromium escribe la cabecera JFIF con densidad 1:1 sin unidad, y un programa de
   * imprenta lo abre a 72 ppi y 4 m de ancho. Se escribe la densidad en ppi: unidad 1 en el
   * byte 13, horizontal y vertical en los 14–17.
   */
  const jfif = jpg.toString('latin1', 6, 11) === 'JFIF\0';
  if (jfif) {
    jpg[13] = 1;
    jpg.writeUInt16BE(PPI_JPG, 14);
    jpg.writeUInt16BE(PPI_JPG, 16);
  }
  await escribir(join(SALIDA, `${pieza}-${PPI_JPG}ppi.jpg`), jpg);
  const [w, h] = dimensionesJpg(jpg);
  const esperado = [Math.round(ancho * escala), Math.round(alto * escala)];
  const ok = jfif && Math.abs(w - esperado[0]) <= 1 && Math.abs(h - esperado[1]) <= 1;
  return { id: 'RF-33.7', ok, detalle: `${w}×${h}${jfif ? '' : ', sin cabecera JFIF'}, ${(jpg.length / 1e6).toFixed(1)} MB` };
}

/** Ancho y alto de un JPEG: el primer marcador SOF (C0–C3) los trae. */
function dimensionesJpg(b) {
  for (let i = 2; i + 9 < b.length; ) {
    const marcador = b[i + 1];
    if (marcador >= 0xc0 && marcador <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return [0, 0];
}

await mkdir(SALIDA, { recursive: true });
await mkdir(REVISION, { recursive: true });
const CSS_PDF = await cssPdf();
const { base, navegador, cerrar } = await abrirDist();
const resultados = {};
// Las piezas que escribieron su PDF en esta corrida: RF-29.7 solo une esas.
const pdfsEscritos = new Set();

for (const { pieza, formato, idioma, publicacion, pie: llevaPie } of PIEZAS_FLYER) {
  const { ancho, alto, seguro, impreso } = FORMATOS_FLYER[formato];
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
  // El pendón no se publica en ninguna red: el tope de Instagram no le aplica.
  r.push({ id: 'RF-29.1', ok: alt.length > 0 && (impreso || alt.length <= 1000), detalle: `${alt.length} caracteres` });

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
  // En el pendón el PDF va a tamaño real (`aTamanoReal`): las cajas del mapa crecen igual.
  const zoom = impreso ? ZOOM_PENDON : 1;
  const mapa = (await page.evaluate(mapaLienzo)).map((o) => ({ ...o, caja: o.caja.map((v) => v * zoom) }));
  await writeFile(join(SALIDA, `${pieza}.mapa.tsv`), `${mapaATsv(mapa)}\n`, 'utf8');

  if (impreso) r.push(...(await medirImpreso(page)));

  const rutaPdf = join(SALIDA, `${pieza}.pdf`);
  await page.emulateMedia({ media: 'screen' });
  await escribir(rutaPdf, await page.pdf({ width: `${ancho}px`, height: `${alto}px`, printBackground: true, pageRanges: '1' }));
  if (impreso) r.push(await aTamanoReal(rutaPdf, { ancho, alto, impreso }));
  const pdf = await fuentesDelPdf(rutaPdf);
  pdfsEscritos.add(pieza);
  r.push({ id: 'RF-29.2', ok: !pdf.type3 && !pdf.faltan.length, detalle: pdf.type3 ? `${pdf.type3} Type3` : pdf.faltan.join(', ') });
  const [pw, ph] = pdf.caja;
  const ptPorPx = impreso ? MM_POR_PX_PENDON * PT_POR_MM : 0.75;
  const cuadra = Math.abs(pw - ancho * ptPorPx) < 1 && Math.abs(ph - alto * ptPorPx) < 1;
  r.push({ id: 'RF-29.3', ok: cuadra && pdf.bytes < 100e6, detalle: `${pw}×${ph} pt, ${(pdf.bytes / 1e6).toFixed(1)} MB` });

  if (impreso) r.push(await jpgDeImprenta(navegador, `${base}/flyer/${pieza}/`, pieza, { ancho, alto }));

  resultados[pieza] = r;
  await ctx.close();
}

/* RF-30.1: hojas de contacto a tamaño de teléfono, para la revisión humana. */
for (const idioma of ['es', 'en']) {
  const piezas = PIEZAS_FLYER.filter((p) => p.idioma === idioma && p.publicacion !== 'impreso');
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

/*
 * RF-33.8: hoja del pendón para la revisión humana, los dos anchos lado a lado y el lienzo
 * entero a 1200 px de alto, sangrado y base incluidos.
 */
for (const idioma of ['es', 'en']) {
  const piezas = PIEZAS_FLYER.filter((p) => p.idioma === idioma && p.publicacion === 'impreso');
  const celdas = await Promise.all(
    piezas.map(async ({ pieza, formato }) => {
      const b64 = (await readFile(join(SALIDA, `${pieza}.png`))).toString('base64');
      const ancho = Math.round((FORMATOS_FLYER[formato].ancho / FORMATOS_FLYER[formato].alto) * 1200);
      return `<figure style="margin:0"><img src="data:image/png;base64,${b64}" alt="${pieza}" style="width:${ancho}px;display:block"><figcaption style="font:14px system-ui">${pieza}</figcaption></figure>`;
    }),
  );
  const page = await navegador.newPage({ viewport: { width: 1200, height: 1300 } });
  await page.setContent(`<body style="margin:0;padding:16px;background:#888;display:flex;gap:32px;align-items:flex-start">${celdas.join('')}</body>`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(REVISION, `pendon-${idioma}.png`), fullPage: true });
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
