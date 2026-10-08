/**
 * Encuadre de los retratos dentro del círculo, mirando la foto.
 *
 * Hasta el 2026-10-02 el panel movía `object-position` y **no pasaba nada**: los
 * ocho archivos de `src/assets/expositores/` ya son cuadrados de 560×560 y el
 * círculo es el propio `<img>` cuadrado con `rounded-full`, así que con
 * `object-fit: cover` no sobra ni un píxel que desplazar `[medido: 2026-10-02]`.
 *
 * Por eso la vista previa pinta la foto como **fondo** del `<img>` (con su fuente
 * vaciada): el círculo queda fijo y la foto se mueve y se escala debajo. Lo que se
 * emite no es CSS sino el **recorte cuadrado en píxeles del original**, que es como
 * se implementa: re-exportar el archivo a 560×560 desde ese recorte.
 *
 * Alejar (zoom < 1) da aire sobre la cabeza, pero necesita píxeles que el cuadrado
 * actual ya no tiene: para eso se carga el original con «foto original».
 */
import type { AjusteRetrato } from './modelo';
import { boton, cargadorDeImagen, casilla, comoElemento, crear, ctx, deslizador, grupo } from './ui';

/** GIF transparente de 1×1: deja el `<img>` vacío para que se vea su fondo. */
const VACIO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const GUIA = 'rgba(224, 145, 58, 0.95)';

/**
 * Los ocho expositores y, desde el 2026-10-07, el retrato del director en «El seminario»
 * (RF-31): Daniel pidió poder dejarlo igual que los demás.
 */
function listaRetratos(d: Document): HTMLImageElement[] {
  return [...d.querySelectorAll<HTMLImageElement>('#expositores article img, #seminario img[aria-hidden="true"]')];
}

/**
 * El nombre del encabezado de la ficha —`<h4>` en un expositor, `<h3>` junto al director—,
 * el *original*: si se editó el texto, la clave no cambia.
 */
function claveDe(img: HTMLImageElement, i: number): string {
  const nombre = (img.closest('article') ?? img.parentElement)?.querySelector<HTMLElement>('h4, h3');
  return (nombre?.dataset.panelOriginal ?? nombre?.textContent)?.trim() || `retrato ${i + 1}`;
}

interface Fuente {
  /** URL de la foto a resolución completa: en dev, el propio archivo de `src/assets/`. */
  url: string;
  /** Ruta del archivo en el repositorio, si se reconoce. */
  archivo: string | null;
  ancho: number;
  alto: number;
}

/**
 * En `npm run dev` el `<img>` apunta a `/_image?href=/@fs/…/src/assets/…webp?origWidth=…`.
 * De ahí salen el archivo, sus medidas y una URL servible del original sin reducir.
 */
function fuenteDelSitio(img: HTMLImageElement): Fuente {
  const src = img.dataset.fuenteOriginal ?? img.getAttribute('src') ?? '';
  const href = new URL(src, location.href).searchParams.get('href');
  const original = href ? new URL(href, location.href) : null;
  const archivo = (original?.pathname ?? src).match(/\/(src\/assets\/[^?]+)/)?.[1] ?? null;
  return {
    url: original ? original.pathname : src,
    archivo,
    ancho: Number(original?.searchParams.get('origWidth')) || img.naturalWidth || 1,
    alto: Number(original?.searchParams.get('origHeight')) || img.naturalHeight || 1,
  };
}

function fuenteDe(img: HTMLImageElement, r: AjusteRetrato | undefined): Fuente {
  const sitio = fuenteDelSitio(img);
  if (!r?.imagen) return sitio;
  return { url: r.imagen.datos, archivo: sitio.archivo, ancho: r.imagen.ancho ?? 1, alto: r.imagen.altoPx ?? 1 };
}

function cambiado(r: AjusteRetrato | undefined): boolean {
  return !!r && (r.zoom !== 1 || r.x !== 50 || r.y !== 50 || r.imagen !== null);
}

function asegurar(clave: string): AjusteRetrato {
  return (ctx.ajustes().retratos[clave] ??= { x: 50, y: 50, zoom: 1, imagen: null });
}

function restaurar(img: HTMLImageElement): void {
  if (img.getAttribute('src') === VACIO) {
    img.src = img.dataset.fuenteOriginal ?? '';
    if (img.dataset.conjuntoOriginal) img.srcset = img.dataset.conjuntoOriginal;
  }
  for (const p of ['backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundColor'] as const) {
    img.style[p] = '';
  }
}

function lineaHorizontal(pct: number): string {
  return `linear-gradient(to bottom, transparent ${pct}%, ${GUIA} ${pct}%, ${GUIA} calc(${pct}% + 2px), transparent calc(${pct}% + 2px))`;
}

export function aplicarRetratos(d: Document): void {
  const { retratos, guias } = ctx.ajustes();
  listaRetratos(d).forEach((img, i) => {
    const clave = claveDe(img, i);
    img.dataset.retrato = clave;
    if (img.dataset.fuenteOriginal === undefined) {
      img.dataset.fuenteOriginal = img.getAttribute('src') ?? '';
      img.dataset.conjuntoOriginal = img.getAttribute('srcset') ?? '';
    }
    const r = retratos[clave];
    if (!cambiado(r) && !guias.activas) {
      restaurar(img);
      return;
    }
    const f = fuenteDe(img, r);
    const zoom = r?.zoom ?? 1;
    const capas: string[] = [];
    if (guias.activas) {
      capas.push(
        lineaHorizontal(guias.coronilla),
        lineaHorizontal(guias.menton),
        `linear-gradient(to right, transparent calc(50% - 1px), ${GUIA} calc(50% - 1px), ${GUIA} calc(50% + 1px), transparent calc(50% + 1px))`,
      );
    }
    const guiasTam = capas.map(() => '100% 100%');
    const guiasPos = capas.map(() => '0 0');
    capas.push(`url("${f.url}")`);
    // «Cover» para un cuadrado es que el lado corto ocupe el círculo; el zoom lo multiplica.
    const tam = f.ancho >= f.alto ? `auto ${100 * zoom}%` : `${100 * zoom}% auto`;
    img.removeAttribute('srcset');
    if (img.getAttribute('src') !== VACIO) img.src = VACIO;
    img.style.backgroundImage = capas.join(', ');
    img.style.backgroundSize = [...guiasTam, tam].join(', ');
    img.style.backgroundPosition = [...guiasPos, `${r?.x ?? 50}% ${r?.y ?? 50}%`].join(', ');
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundColor = 'var(--surface)';
  });
}

/* ------------------------------------------------- arrastrar y hacer zoom */

function limitar(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Arrastrar mueve la foto dentro del círculo; Mayús + rueda la acerca o la aleja. Solo en «navegar». */
export function prepararRetratos(d: Document): void {
  const retratoDe = (e: Event): HTMLImageElement | null => {
    if (ctx.herramienta !== 'navegar') return null;
    return comoElemento(e.target)?.closest<HTMLImageElement>('img[data-retrato]') ?? null;
  };

  d.addEventListener('dragstart', (e) => {
    if (retratoDe(e)) e.preventDefault();
  });

  d.addEventListener('pointerdown', (e) => {
    const img = retratoDe(e);
    if (!img) return;
    e.preventDefault();
    const r = asegurar(img.dataset.retrato!);
    const f = fuenteDe(img, r);
    const caja = img.getBoundingClientRect().width;
    // Medidas de la foto tal como se pinta, para pasar píxeles arrastrados a porcentaje.
    const escala = (caja * r.zoom) / Math.min(f.ancho, f.alto);
    const sobraX = f.ancho * escala - caja;
    const sobraY = f.alto * escala - caja;
    const inicio = { x: e.clientX, y: e.clientY, rx: r.x, ry: r.y };
    img.setPointerCapture(e.pointerId);

    const mover = (ev: PointerEvent): void => {
      if (Math.abs(sobraX) > 1) r.x = Math.round(limitar(inicio.rx - ((ev.clientX - inicio.x) / sobraX) * 100, 0, 100));
      if (Math.abs(sobraY) > 1) r.y = Math.round(limitar(inicio.ry - ((ev.clientY - inicio.y) / sobraY) * 100, 0, 100));
      ctx.alCambiar();
    };
    const soltar = (): void => {
      img.removeEventListener('pointermove', mover);
      ctx.remontar();
    };
    img.addEventListener('pointermove', mover);
    img.addEventListener('pointerup', soltar, { once: true });
    img.addEventListener('pointercancel', soltar, { once: true });
  });

  d.addEventListener(
    'wheel',
    (e) => {
      const img = retratoDe(e);
      if (!img || !e.shiftKey) return;
      e.preventDefault();
      // Con Mayús, Chrome manda la rueda como desplazamiento horizontal.
      const delta = e.deltaY || e.deltaX;
      const r = asegurar(img.dataset.retrato!);
      r.zoom = Math.round(limitar(r.zoom - Math.sign(delta) * 0.05, 0.5, 3) * 100) / 100;
      ctx.alCambiar();
    },
    { passive: false },
  );
}

/* ------------------------------------------------------------- controles */

export function grupoRetratos(d: Document): HTMLElement | null {
  const imgs = listaRetratos(d);
  if (imgs.length === 0) return null;
  const { retratos, guias } = ctx.ajustes();
  const g = grupo('Retratos de expositores', Object.values(retratos).some(cambiado) || guias.activas);
  g.append(
    crear(
      'p',
      'nota',
      'Con «navegar», arrastrá la foto dentro del círculo y usá Mayús + rueda para el zoom. ' +
        'Las fotos son cuadradas: sin acercar no hay margen para moverlas. Para más aire sobre la ' +
        'cabeza (zoom bajo 1×) cargá el original en «foto original»; si no, el círculo muestra un borde vacío.',
    ),
    casilla('guías de cabeza en todos los retratos', guias.activas, (v) => {
      guias.activas = v;
      ctx.alCambiar();
      ctx.remontar();
    }),
  );
  if (guias.activas) {
    g.append(
      deslizador({ etiqueta: 'línea de coronilla', min: 0, max: 60, paso: 1, unidad: '%', leer: () => guias.coronilla, escribir: (v) => (guias.coronilla = v) }),
      deslizador({ etiqueta: 'línea de mentón', min: 30, max: 100, paso: 1, unidad: '%', leer: () => guias.menton, escribir: (v) => (guias.menton = v) }),
    );
  }

  imgs.forEach((img, i) => {
    const clave = claveDe(img, i);
    const r = asegurar(clave);
    const sub = crear('div', 'subgrupo');
    sub.append(
      crear('p', 'subtitulo', clave),
      deslizador({ etiqueta: 'zoom', min: 0.5, max: 3, paso: 0.01, unidad: '×', leer: () => r.zoom, escribir: (v) => (r.zoom = v) }),
      deslizador({ etiqueta: '↔', min: 0, max: 100, paso: 1, unidad: '%', leer: () => r.x, escribir: (v) => (r.x = v) }),
      deslizador({ etiqueta: '↕', min: 0, max: 100, paso: 1, unidad: '%', leer: () => r.y, escribir: (v) => (r.y = v) }),
      cargadorDeImagen('foto original o nueva', (nueva) => (r.imagen = nueva)),
      boton('volver al recorte de hoy', () => {
        Object.assign(r, { x: 50, y: 50, zoom: 1, imagen: null });
        ctx.alCambiar();
        ctx.remontar();
      }),
    );
    g.append(sub);
  });
  return g;
}

/* -------------------------------------------------------------- informe */

/**
 * El recorte cuadrado que se ve, en píxeles de la foto de partida. Es la misma
 * geometría que `background-size`/`background-position`: el lado visible es el
 * lado corto dividido por el zoom, y el porcentaje reparte lo que sobra.
 */
function recorte(f: Fuente, r: AjusteRetrato): { izquierda: number; arriba: number; lado: number } {
  const lado = Math.min(f.ancho, f.alto) / r.zoom;
  return {
    izquierda: Math.round(((f.ancho - lado) * r.x) / 100),
    arriba: Math.round(((f.alto - lado) * r.y) / 100),
    lado: Math.round(lado),
  };
}

export function informeRetratos(): string[] {
  const d = ctx.pagina();
  const { retratos, guias } = ctx.ajustes();
  const cambiados = Object.entries(retratos).filter(([, r]) => cambiado(r));
  if (cambiados.length === 0 || !d) return [];
  const porClave = new Map(listaRetratos(d).map((img, i) => [claveDe(img, i), img]));
  const l = [
    '## Retratos (re-exportar cada archivo a su tamaño actual, en WebP, desde el recorte indicado)',
    'El recorte va en píxeles de la foto de partida: izquierda, arriba y lado del cuadrado.',
  ];
  for (const [clave, r] of cambiados) {
    const img = porClave.get(clave);
    if (!img) {
      l.push(`- ${clave}: no está en esta página`);
      continue;
    }
    const f = fuenteDe(img, r);
    const c = recorte(f, r);
    const partida = r.imagen ? `${r.imagen.nombre} (cargada, ${f.ancho}×${f.alto})` : `${f.archivo ?? 'archivo sin identificar'} (${f.ancho}×${f.alto})`;
    l.push(`- ${clave} → ${f.archivo ?? 'src/assets/expositores/'}`);
    l.push(`    partida: ${partida}`);
    l.push(`    zoom ${r.zoom}× · encuadre ${r.x}% ${r.y}% → recorte izquierda=${c.izquierda} arriba=${c.arriba} lado=${c.lado} px`);
    const fuera = c.izquierda < 0 || c.arriba < 0 || c.izquierda + c.lado > f.ancho || c.arriba + c.lado > f.alto;
    if (fuera) l.push('    ⚠ el recorte sale de la foto: hace falta el original más amplio o rellenar el borde');
    if (r.imagen) l.push('    si no es el original de la foto ya autorizada, publicarla exige autorización expresa (RF-11.1)');
  }
  if (guias.activas) l.push(`    guías usadas: coronilla ${guias.coronilla}% · mentón ${guias.menton}% del alto del círculo`);
  l.push('');
  return l;
}

export function avisosRetratos(): string[] {
  return Object.entries(ctx.ajustes().retratos)
    .filter(([, r]) => r.imagen)
    .map(([clave]) => `${clave}: foto cargada. Si no es el original de la ya autorizada, publicarla exige autorización expresa (RF-11.1).`);
}
