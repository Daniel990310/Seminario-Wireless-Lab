/**
 * Pendón impreso (RF-33): lo que `generar-flyer.mjs` hace solo con los formatos que tienen
 * `impreso` (`src/data/flyer.ts`). Mide, produce el PDF a tamaño real y el JPG de imprenta,
 * verifica el PDF escrito y arma la hoja de revisión. No escribe a disco: devuelve bytes y
 * el orquestador los escribe con sus reintentos.
 *
 * Las razones de cada número, en `specs/003-difusion-redes/requirements.md`:
 *   - `PPI_MINIMO`: a 1 m, la distancia más corta a la que se mira un roller, el ojo separa
 *     0,29 mm (un minuto de arco), 87 ppi. 90 ppi alcanza; 150 es lo que piden las imprentas
 *     para mirar de cerca, y los retratos no lo tienen.
 *   - `QR_MINIMO_MM`: se lee hasta a unas diez veces su lado; 15 cm, a 1,5 m.
 *   - `QR_ALTURA_MM`: el centro del QR, a la altura de los ojos de quien se acerca (RF-33.5).
 *
 * @typedef {import('../../src/data/flyer.ts').FormatoFlyerDef} FormatoFlyerDef
 */
import { PDFDocument } from 'pdf-lib';
import { PT_POR_MM, PT_POR_PX_CHROMIUM } from '../../src/data/flyer.ts';

const PPI_MINIMO = 90;
export const PPI_JPG = 150;
const QR_MINIMO_MM = 150;
const QR_ALTURA_MM = { min: 600, max: 900 };

export const CRITERIOS_PENDON = {
  'RF-33.1': 'Pendón: PDF a tamaño real, con caja de corte y de sangrado, leído del archivo escrito',
  'RF-33.4': `Pendón: toda imagen ráster a ${PPI_MINIMO} ppi o más, impresa`,
  'RF-33.5': `Pendón: centro del QR entre ${QR_ALTURA_MM.min / 10} y ${QR_ALTURA_MM.max / 10} cm bajo el borde de arriba`,
  'RF-33.6': `Pendón: QR de ${QR_MINIMO_MM / 10} cm de lado o más`,
  'RF-33.7': `Pendón: JPG a ${PPI_JPG} ppi del tamaño exacto del lienzo`,
};

/**
 * RF-33.4, RF-33.5 y RF-33.6, sobre el lienzo: resolución impresa de cada imagen ráster,
 * posición y lado del QR. Con `object-cover` la imagen se escala hasta cubrir la caja, así
 * que manda el lado que más se agranda.
 * @param {FormatoFlyerDef} formato
 */
export async function medirImpreso(page, { impreso }) {
  const { mmPorPx, sangrado } = impreso;
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
  const alturaMm = qr ? (qr.centro - sangrado) * mmPorPx : NaN;
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
      ok: alturaMm >= QR_ALTURA_MM.min && alturaMm <= QR_ALTURA_MM.max,
      detalle: qr ? `${Math.round(alturaMm)} mm` : 'sin QR',
    },
    { id: 'RF-33.6', ok: ladoMm >= QR_MINIMO_MM, detalle: `${Math.round(ladoMm)} mm` },
  ];
}

/**
 * El pendón a tamaño real, con sus cajas de imprenta. Recibe los bytes del PDF de Chromium
 * y devuelve los del PDF final, más el tamaño de la hoja de Chromium para `verificarPdfReal`.
 *
 * Chromium imprime el lienzo a 0,265 mm por px, un tercio del tamaño real. Agrandarlo antes
 * de imprimir no sirve: con `zoom` o con `transform: scale` la hoja de 2,17 m salió con el
 * lienzo sin agrandar, centrado y cortado `[medido: 2026-10-14]`. Así que se escala después:
 * la hoja de Chromium entra como objeto de formulario en una hoja nueva de tamaño real.
 * Texto, trazados y QR siguen vectoriales y las fotos conservan todos sus píxeles.
 *
 * Se añaden la `TrimBox` —el corte: ancho × (visible + base)— y la `BleedBox`, el corte más
 * el sangrado: con ellas el programa de la imprenta pone las marcas de corte.
 * @param {FormatoFlyerDef} formato
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
  return { bytes: await doc.save(), hojaChromium: { w: lienzo.width, h: lienzo.height } };
}

/**
 * RF-33.1 · lee el PDF **escrito en disco** y lo compara con lo que el lienzo y el catálogo
 * dicen, no con las constantes con que se escribió (así no podría fallar):
 *   - la hoja de Chromium mide el lienzo a 0,75 pt por px: si un Chromium futuro imprime a
 *     otra escala, el dibujo saldría estirado en una hoja del tamaño correcto;
 *   - la hoja mide el corte de catálogo más el sangrado, con tres px de holgura: los px del
 *     lienzo se redondean hacia arriba en sangrado, base y ancho, 0,37 mm cada uno;
 *   - la caja de corte queda a `sangradoMm` de cada borde de la hoja, con dos px de
 *     holgura: abajo y a la derecha se suman dos redondeos (sangrado y base, o sangrado y
 *     ancho), 0,74 mm. La hoja sale de los px del lienzo y el corte de los mm de catálogo:
 *     son fuentes distintas, y un corte corrido se ve aquí;
 *   - la caja de sangrado cabe en la hoja.
 * @param {FormatoFlyerDef} formato
 */
export async function verificarPdfReal(bytesDisco, { ancho, alto, impreso }, hojaChromium) {
  const problemas = [];
  const mm = (pt) => pt / PT_POR_MM;
  const f1 = (v) => v.toFixed(1);
  const cerca = (a, b, tol) => Math.abs(a - b) <= tol;
  const esperadaChromium = { w: ancho * PT_POR_PX_CHROMIUM, h: alto * PT_POR_PX_CHROMIUM };
  if (!cerca(hojaChromium.w, esperadaChromium.w, 1) || !cerca(hojaChromium.h, esperadaChromium.h, 1)) {
    problemas.push(`Chromium imprimió ${f1(hojaChromium.w)}×${f1(hojaChromium.h)} pt, no ${f1(esperadaChromium.w)}×${f1(esperadaChromium.h)}`);
  }
  const pagina = (await PDFDocument.load(bytesDisco)).getPage(0);
  const hoja = pagina.getSize();
  const trim = pagina.getTrimBox();
  const bleed = pagina.getBleedBox();
  const px = impreso.mmPorPx;
  const hojaMm = { w: impreso.anchoMm + 2 * impreso.sangradoMm, h: impreso.visibleMm + impreso.baseMm + 2 * impreso.sangradoMm };
  if (!cerca(mm(hoja.width), hojaMm.w, 3 * px) || !cerca(mm(hoja.height), hojaMm.h, 3 * px)) {
    problemas.push(`hoja ${f1(mm(hoja.width))}×${f1(mm(hoja.height))} mm, se esperaba ${hojaMm.w}×${hojaMm.h} ± ${f1(3 * px)}`);
  }
  const margenes = {
    izquierda: mm(trim.x),
    derecha: mm(hoja.width - trim.x - trim.width),
    abajo: mm(trim.y),
    arriba: mm(hoja.height - trim.y - trim.height),
  };
  const corridos = Object.entries(margenes).filter(([, v]) => !cerca(v, impreso.sangradoMm, 2 * px));
  if (corridos.length) {
    problemas.push(`corte a ${corridos.map(([lado, v]) => `${f1(v)} mm por ${lado}`).join(', ')}, no ${impreso.sangradoMm}`);
  }
  const dentro = bleed.x >= -0.5 && bleed.y >= -0.5 && bleed.x + bleed.width <= hoja.width + 0.5 && bleed.y + bleed.height <= hoja.height + 0.5;
  if (!dentro) problemas.push('la caja de sangrado sale de la hoja');
  const r = (v) => Math.round(mm(v));
  return {
    id: 'RF-33.1',
    ok: !problemas.length,
    detalle: problemas.length ? problemas.join('; ') : `hoja ${r(hoja.width)}×${r(hoja.height)} mm, corte ${r(trim.width)}×${r(trim.height)} mm`,
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
 * @param {FormatoFlyerDef} formato
 */
export async function jpgDeImprenta(navegador, url, { ancho, alto, impreso }) {
  const escala = (PPI_JPG * impreso.mmPorPx) / 25.4;
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
 * @param {FormatoFlyerDef} formato
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
