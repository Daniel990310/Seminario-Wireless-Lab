/**
 * Pendón impreso (RF-33): lo que `generar-flyer.mjs` hace solo con los formatos que tienen
 * `impreso` (`src/data/flyer.ts`). Mide, escribe el PDF a tamaño real y el JPG de imprenta,
 * y arma la hoja de revisión. No escribe a disco: devuelve bytes y el orquestador los
 * escribe con sus reintentos.
 *
 * Las razones de cada número, en `specs/003-difusion-redes/requirements.md`:
 *   - `PPI_MINIMO`: a 1 m, la distancia más corta a la que se mira un roller, el ojo separa
 *     0,29 mm (un minuto de arco), 87 ppi. 90 ppi alcanza; 150 es lo que piden las imprentas
 *     para mirar de cerca, y los retratos no lo tienen.
 *   - `QR_MINIMO_MM`: se lee hasta a unas diez veces su lado; 15 cm, a 1,5 m.
 *   - `QR_ALTURA_MM`: el centro del QR, a la altura de los ojos de quien se acerca (RF-33.5).
 */
import { PDFDocument } from 'pdf-lib';

export const PPI_MINIMO = 90;
export const PPI_JPG = 150;
export const QR_MINIMO_MM = 150;
export const QR_ALTURA_MM = [600, 900];
const PT_POR_MM = 72 / 25.4;
/* Chromium imprime a 96 px por pulgada: 0,75 pt por px de lienzo. */
const PT_CHROMIUM = 0.75;

export const CRITERIOS_PENDON = {
  'RF-33.1': 'Pendón: PDF a tamaño real, con caja de corte y de sangrado, releído del archivo',
  'RF-33.4': `Pendón: toda imagen ráster a ${PPI_MINIMO} ppi o más, impresa`,
  'RF-33.5': `Pendón: centro del QR entre ${QR_ALTURA_MM[0] / 10} y ${QR_ALTURA_MM[1] / 10} cm bajo el borde de arriba`,
  'RF-33.6': `Pendón: QR de ${QR_MINIMO_MM / 10} cm de lado o más`,
  'RF-33.7': `Pendón: JPG a ${PPI_JPG} ppi del tamaño exacto del lienzo`,
};

/**
 * RF-33.4, RF-33.5 y RF-33.6, sobre el lienzo: resolución impresa de cada imagen ráster,
 * posición y lado del QR. Con `object-cover` la imagen se escala hasta cubrir la caja, así
 * que manda el lado que más se agranda.
 */
export async function medirImpreso(page, { impreso, ptPorPx }) {
  const mmPorPx = ptPorPx / PT_POR_MM;
  const { imagenes, qr } = await page.evaluate((mmPorPx) => {
    const imagenes = [...document.images]
      .filter((i) => i.naturalWidth && !/\.svg(\?|$)/i.test(i.currentSrc || i.src))
      .map((i) => {
        const r = i.getBoundingClientRect();
        const escala = Math.max(r.width / i.naturalWidth, r.height / i.naturalHeight);
        return { src: (i.currentSrc || i.src).split('/').pop(), ppi: Math.round(25.4 / (escala * mmPorPx)) };
      });
    const r = document.querySelector('[data-flyer-qr] div')?.getBoundingClientRect();
    return { imagenes, qr: r ? { lado: r.width, centro: r.top + r.height / 2 } : null };
  }, mmPorPx);
  const malas = imagenes.filter((b) => b.ppi < PPI_MINIMO);
  const peor = imagenes.reduce((a, b) => (!a || b.ppi < a.ppi ? b : a), null);
  const ladoMm = qr ? qr.lado * mmPorPx : 0;
  // Desde el borde de arriba de lo visible: sin el sangrado.
  const alturaMm = qr ? (qr.centro - impreso.sangrado) * mmPorPx : NaN;
  return [
    {
      id: 'RF-33.4',
      ok: imagenes.length > 0 && !malas.length,
      detalle: malas.length
        ? malas.map((b) => `${b.src} ${b.ppi} ppi`).join(' · ')
        : peor
          ? `la más baja, ${peor.ppi} ppi (${peor.src})`
          : 'sin imágenes ráster',
    },
    {
      id: 'RF-33.5',
      ok: alturaMm >= QR_ALTURA_MM[0] && alturaMm <= QR_ALTURA_MM[1],
      detalle: qr ? `${Math.round(alturaMm)} mm` : 'sin QR',
    },
    { id: 'RF-33.6', ok: ladoMm >= QR_MINIMO_MM, detalle: `${Math.round(ladoMm)} mm` },
  ];
}

/**
 * RF-33.1 · el pendón a tamaño real, con sus cajas de imprenta. Recibe los bytes del PDF de
 * Chromium y devuelve los del PDF final.
 *
 * Chromium imprime el lienzo a 0,265 mm por px, un tercio del tamaño real. Agrandarlo antes
 * de imprimir no sirve: con `zoom` o con `transform: scale` la hoja de 2,17 m salió con el
 * lienzo sin agrandar, centrado y cortado `[medido: 2026-10-14]`. Así que se escala después:
 * la hoja de Chromium entra como objeto de formulario en una hoja nueva de tamaño real.
 * Texto, trazados y QR siguen vectoriales y las fotos conservan todos sus píxeles.
 *
 * Se añaden la `TrimBox` —el corte: ancho × (visible + base)— y la `BleedBox`, el corte más
 * el sangrado: con ellas el programa de la imprenta pone las marcas de corte.
 *
 * El criterio no se deduce de las constantes con que se escribió —así no podría fallar—:
 * comprueba que la hoja de Chromium mide lo que el lienzo a 0,75 pt por px (si un Chromium
 * futuro imprime a otra escala, el dibujo saldría estirado en una hoja del tamaño
 * correcto), y relee el archivo guardado contra las medidas de catálogo en mm.
 */
export async function aTamanoReal(bytesChromium, { ancho, alto, impreso, ptPorPx }) {
  const origen = await PDFDocument.load(bytesChromium);
  // Sin fecha ni productor: así el PDF no cambia byte a byte si el dibujo no cambió.
  const doc = await PDFDocument.create({ updateMetadata: false });
  doc.setTitle(origen.getTitle() ?? '');
  const pt = (px) => px * ptPorPx;
  const [lienzo] = await doc.embedPdf(origen, [0]);
  const hoja = doc.addPage([pt(ancho), pt(alto)]);
  hoja.drawPage(lienzo, { x: 0, y: 0, width: pt(ancho), height: pt(alto) });
  const corte = {
    x: pt(impreso.sangrado),
    w: impreso.anchoMm * PT_POR_MM,
    h: (impreso.visibleMm + impreso.baseMm) * PT_POR_MM,
  };
  // pdf-lib mide desde abajo a la izquierda; el corte empieza a `sangrado` del borde de arriba.
  corte.y = pt(alto) - pt(impreso.sangrado) - corte.h;
  const s = impreso.sangradoMm * PT_POR_MM;
  hoja.setTrimBox(corte.x, corte.y, corte.w, corte.h);
  hoja.setBleedBox(corte.x - s, corte.y - s, corte.w + 2 * s, corte.h + 2 * s);
  const bytes = await doc.save();

  const problemas = [];
  const cerca = (a, b, tol) => Math.abs(a - b) <= tol;
  if (!cerca(lienzo.width, ancho * PT_CHROMIUM, 1) || !cerca(lienzo.height, alto * PT_CHROMIUM, 1)) {
    problemas.push(`Chromium imprimió ${lienzo.width.toFixed(0)}×${lienzo.height.toFixed(0)} pt, no ${ancho * PT_CHROMIUM}×${alto * PT_CHROMIUM}`);
  }
  const releida = (await PDFDocument.load(bytes)).getPage(0);
  const mm = (v) => v / PT_POR_MM;
  const tamano = releida.getSize();
  const trim = releida.getTrimBox();
  const bleed = releida.getBleedBox();
  const hojaMm = [impreso.anchoMm + 2 * impreso.sangradoMm, impreso.visibleMm + impreso.baseMm + 2 * impreso.sangradoMm];
  // 1,5 mm: los px del lienzo se redondean hacia arriba y la hoja crece hasta 0,7 mm.
  if (!cerca(mm(tamano.width), hojaMm[0], 1.5) || !cerca(mm(tamano.height), hojaMm[1], 1.5)) problemas.push('hoja');
  if (!cerca(mm(trim.width), impreso.anchoMm, 0.1) || !cerca(mm(trim.height), impreso.visibleMm + impreso.baseMm, 0.1)) problemas.push('TrimBox');
  if (!cerca(mm(bleed.width - trim.width), 2 * impreso.sangradoMm, 0.1)) problemas.push('BleedBox');
  const dentro = bleed.x >= -0.5 && bleed.y >= -0.5 && bleed.x + bleed.width <= tamano.width + 0.5 && bleed.y + bleed.height <= tamano.height + 0.5;
  if (!dentro) problemas.push('sangrado fuera de la hoja');
  const r = (v) => Math.round(mm(v));
  return {
    bytes,
    resultado: {
      id: 'RF-33.1',
      ok: !problemas.length,
      detalle: problemas.length
        ? problemas.join(', ')
        : `hoja ${r(tamano.width)}×${r(tamano.height)} mm, corte ${r(trim.width)}×${r(trim.height)} mm`,
    },
  };
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

/**
 * RF-33.7 · el pendón también como JPG a `PPI_JPG`, para la imprenta que no recibe PDF. Se
 * captura de nuevo con más píxeles por px de lienzo: es el mismo dibujo, no una ampliación.
 */
export async function jpgDeImprenta(navegador, url, { ancho, alto, ptPorPx }) {
  const escala = (PPI_JPG * ptPorPx) / 72;
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
  const [w, h] = dimensionesJpg(jpg);
  const esperado = [Math.round(ancho * escala), Math.round(alto * escala)];
  const ok = jfif && Math.abs(w - esperado[0]) <= 1 && Math.abs(h - esperado[1]) <= 1;
  return {
    jpg,
    resultado: { id: 'RF-33.7', ok, detalle: `${w}×${h}${jfif ? '' : ', sin cabecera JFIF'}, ${(jpg.length / 1e6).toFixed(1)} MB` },
  };
}

/**
 * RF-33.8: celda de la hoja de revisión del pendón. Muestra lo que se ve con el pendón
 * armado, a 1200 px de alto, y debajo, rayada, la base que entra en el cassette: con la
 * base pintada igual que lo visible, la franja blanca parecía el doble de alta de lo que
 * se ve (Daniel, 2026-10-14).
 */
export function celdaRevisionPendon(pieza, png, { ancho, alto, impreso }) {
  const { sangrado, base } = impreso;
  const k = 1200 / (alto - 2 * sangrado - base);
  const visible = `width:${Math.round((ancho - 2 * sangrado) * k)}px;height:1200px;overflow:hidden`;
  const lienzo = `width:${Math.round(ancho * k)}px;display:block;margin:-${Math.round(sangrado * k)}px 0 0 -${Math.round(sangrado * k)}px`;
  const rayado = `height:${Math.round(base * k)}px;background:repeating-linear-gradient(45deg,#bbb 0 6px,#999 6px 12px);font:12px system-ui;color:#333;padding:6px`;
  const img = `<img src="data:image/png;base64,${png.toString('base64')}" alt="${pieza}" width="${Math.round(ancho * k)}" height="${Math.round(alto * k)}" style="${lienzo}">`;
  return `<figure style="margin:0"><div style="${visible}">${img}</div><div style="${rayado}">${impreso.baseMm / 10} cm de base: entra en el cassette, no se ve</div><figcaption style="font:14px system-ui">${pieza}</figcaption></figure>`;
}
