/**
 * Herramienta «señalar»: se elige cualquier elemento de la página y se le cambia
 * tamaño de letra, peso, márgenes, alineación o color, se oculta, o se le deja una
 * nota. Es la salida para todo lo que no tiene perilla propia, y la que sirve en
 * una reunión: «esto más grande», «esto fuera», «aquí va otra cosa».
 *
 * Igual que el resto del panel, **no toca el código**. Lo que emite es el elemento
 * (selector, sección y las clases de Tailwind que lleva hoy) y el valor medido antes
 * y después, que es lo que necesita quien lo implemente para elegir la clase.
 */
import { aRgb, contraste, fondoEfectivo } from './color';
import { TOKENS_DE_TEXTO, type AjusteElemento, type TokenDeTexto } from './modelo';
import { seccionDe } from './textos';
import { REFUERZO, boton, casilla, comoElemento, crear, ctx, deslizador, grupo, opciones } from './ui';

/** El elemento elegido ahora mismo, por su selector. */
let elegido: string | null = null;

/** Componente donde suele estar el marcado de cada zona de la página. */
const COMPONENTE: Record<string, string> = {
  top: 'src/components/Hero.astro',
  barra: 'src/components/SiteHeader.astro',
  pie: 'src/components/SiteFooter.astro',
  expositores: 'src/components/PaginaSeminario.astro + SpeakerCard.astro',
  programa: 'src/components/PaginaSeminario.astro + ProgramaJornadas.astro',
  sede: 'src/components/PaginaSeminario.astro + VenueLocator.astro',
  organizacion: 'src/components/PaginaSeminario.astro + LogoWall.astro',
};

/**
 * Selector estable: desde el ancestro con `id` más cercano, con `nth-of-type` en
 * cada nivel. Las dos rutas de idioma comparten `PaginaSeminario.astro`, así que el
 * mismo selector señala el mismo elemento en `/` y en `/en/`.
 */
function selectorDe(el: Element): string {
  const partes: string[] = [];
  for (let n: Element | null = el; n && n.tagName !== 'HTML'; n = n.parentElement) {
    if (n.id) {
      partes.unshift(`#${CSS.escape(n.id)}`);
      break;
    }
    const tag = n.tagName.toLowerCase();
    if (tag === 'body') {
      partes.unshift('body');
      break;
    }
    const hermanos = n.parentElement ? [...n.parentElement.children].filter((h) => h.tagName === n!.tagName) : [];
    partes.unshift(hermanos.length > 1 ? `${tag}:nth-of-type(${hermanos.indexOf(n) + 1})` : tag);
  }
  return partes.join(' > ');
}

function describir(el: Element): string {
  const texto = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  const corto = texto.length > 60 ? `${texto.slice(0, 57)}…` : texto;
  const alt = el.tagName === 'IMG' ? ` alt="${el.getAttribute('alt') ?? ''}"` : '';
  return `<${el.tagName.toLowerCase()}${alt}> en #${seccionDe(el)}${corto ? ` · «${corto}»` : ''}`;
}

function px(v: string): number {
  return Math.round(parseFloat(v) * 10) / 10;
}

function registrarElemento(el: Element): AjusteElemento {
  const selector = selectorDe(el);
  const { elementos } = ctx.ajustes();
  const previo = elementos[selector];
  if (previo) return previo;
  const e = el.ownerDocument.defaultView!.getComputedStyle(el);
  const nuevo: AjusteElemento = {
    selector,
    descripcion: describir(el),
    // `is-visible` lo pone en vivo la animación de entrada; no está en el código.
    clases: (el.getAttribute('class') ?? '').split(/\s+/).filter((c) => c && c !== 'is-visible').join(' '),
    seccion: seccionDe(el),
    original: {
      tamano: px(e.fontSize),
      peso: e.fontWeight,
      margenArriba: px(e.marginTop),
      margenAbajo: px(e.marginBottom),
      rellenoArriba: px(e.paddingTop),
      rellenoAbajo: px(e.paddingBottom),
      alineacion: e.textAlign,
    },
    escalaLetra: 1,
    peso: null,
    margenArriba: null,
    margenAbajo: null,
    rellenoArriba: null,
    rellenoAbajo: null,
    alineacion: null,
    color: null,
    oculto: false,
    nota: '',
  };
  elementos[selector] = nuevo;
  return nuevo;
}

function tieneCambios(a: AjusteElemento): boolean {
  return (
    a.escalaLetra !== 1 ||
    a.peso !== null ||
    a.margenArriba !== null ||
    a.margenAbajo !== null ||
    // `!= null`: un borrador anterior al 2026-10-07 no trae los campos de relleno.
    a.rellenoArriba != null ||
    a.rellenoAbajo != null ||
    a.alineacion !== null ||
    a.color !== null ||
    a.oculto ||
    a.nota.trim() !== ''
  );
}

/** Descarta del borrador los elementos que se eligieron y no se tocaron. */
function podar(): void {
  const { elementos } = ctx.ajustes();
  for (const [k, a] of Object.entries(elementos)) if (k !== elegido && !tieneCambios(a)) delete elementos[k];
}

/** Reglas para la hoja inyectada, con `REFUERZO` para ganar a las clases del sitio. */
export function cssDeElementos(): string[] {
  const l: string[] = [];
  for (const a of Object.values(ctx.ajustes().elementos)) {
    const r: string[] = [];
    if (a.escalaLetra !== 1) r.push(`font-size:${(a.original.tamano * a.escalaLetra).toFixed(1)}px`);
    if (a.peso) r.push(`font-weight:${a.peso}`);
    if (a.margenArriba !== null) r.push(`margin-top:${a.margenArriba}px`);
    if (a.margenAbajo !== null) r.push(`margin-bottom:${a.margenAbajo}px`);
    if (a.rellenoArriba != null) r.push(`padding-top:${a.rellenoArriba}px`);
    if (a.rellenoAbajo != null) r.push(`padding-bottom:${a.rellenoAbajo}px`);
    if (a.alineacion) r.push(`text-align:${a.alineacion}`);
    if (a.color) r.push(`color:var(--${a.color})`);
    if (a.oculto) r.push('display:none');
    if (r.length) l.push(`${REFUERZO} ${a.selector} { ${r.join('; ')}; }`);
  }
  // Contorno de lo elegido y de lo que está bajo el puntero, solo con la herramienta activa.
  const activa = `${REFUERZO}[data-panel-herramienta="senalar"]`;
  l.push(`${activa} [data-panel-sobre] { outline: 2px solid #e0913a; outline-offset: 2px; cursor: crosshair; }`);
  if (elegido) l.push(`${activa} ${elegido} { outline: 2px dashed #e0913a; outline-offset: 4px; }`);
  return l;
}

/* --------------------------------------------------------------- en el marco */

let sobre: Element | null = null;

/** Escuchas sobre el documento del marco; hay que volver a ponerlas en cada carga. */
export function prepararSenalar(d: Document): void {
  d.addEventListener('mouseover', (e) => {
    if (ctx.herramienta !== 'senalar') return;
    sobre?.removeAttribute('data-panel-sobre');
    sobre = comoElemento(e.target);
    sobre?.setAttribute('data-panel-sobre', '');
  });
  d.addEventListener('mouseout', () => {
    sobre?.removeAttribute('data-panel-sobre');
    sobre = null;
  });
  d.addEventListener(
    'click',
    (e) => {
      const objetivo = comoElemento(e.target);
      if (ctx.herramienta !== 'senalar' || !objetivo) return;
      e.preventDefault();
      e.stopPropagation();
      elegir(objetivo);
    },
    true,
  );
}

function elegir(el: Element): void {
  registrarElemento(el);
  elegido = selectorDe(el);
  podar();
  ctx.alCambiar();
  ctx.remontar();
  // El panel conserva su desplazamiento al remontarse; sin esto la ficha queda fuera de vista.
  document.querySelector('.ficha-elegida')?.scrollIntoView({ block: 'nearest' });
}

/* ------------------------------------------------------------------ controles */

function contrasteDe(sel: string): string {
  const el = ctx.pagina()?.querySelector(sel);
  if (!el) return '';
  const texto = aRgb(el.ownerDocument.defaultView!.getComputedStyle(el).color);
  const fondo = fondoEfectivo(el);
  if (!texto) return '';
  if (!fondo) return 'Contraste: indeterminado (hay una imagen o degradado detrás; axe lo marca y verify falla).';
  const r = contraste(texto, fondo);
  const minimo = 4.5;
  return `Contraste ahora: ${r.toFixed(2)}:1 ${r >= minimo ? '✓' : `✗ bajo el ${minimo}:1 de WCAG 1.4.3`}`;
}

export function grupoElementos(): HTMLElement {
  const g = grupo('Elementos señalados');
  const { elementos } = ctx.ajustes();
  g.append(
    crear(
      'p',
      'nota',
      'Elegí la herramienta «señalar» y hacé clic sobre cualquier cosa de la página. ' +
        'Para tomar el bloque que la contiene, usá «subir al contenedor».',
    ),
  );

  const a = elegido ? elementos[elegido] : undefined;
  const el = elegido ? ctx.pagina()?.querySelector(elegido) : null;
  if (a) {
    const ficha = crear('div', 'subgrupo ficha-elegida');
    ficha.append(crear('p', 'subtitulo', a.descripcion));
    if (!el) ficha.append(crear('p', 'nota', 'No está en esta página: el sitio cambió o es de la otra vista.'));

    const nav = crear('div', 'fila botones');
    const padre = el?.parentElement;
    if (padre && padre.tagName !== 'BODY') nav.append(boton('subir al contenedor', () => elegir(padre)));
    nav.append(
      boton('deshacer cambios', () => {
        delete elementos[a.selector];
        // Primero se retiran las reglas: medir antes leería el tamaño ya cambiado como «original».
        ctx.alCambiar();
        if (el) registrarElemento(el);
        else elegido = null;
        ctx.alCambiar();
        ctx.remontar();
      }),
      boton('soltar', () => {
        elegido = null;
        podar();
        ctx.alCambiar();
        ctx.remontar();
      }),
    );
    const notaContraste = crear('p', 'nota', contrasteDe(a.selector));
    const medir = (): void => {
      requestAnimationFrame(() => (notaContraste.textContent = contrasteDe(a.selector)));
    };

    ficha.append(
      nav,
      deslizador({
        etiqueta: `tamaño de letra (hoy ${a.original.tamano}px)`,
        min: 0.5,
        max: 2.5,
        paso: 0.05,
        unidad: '×',
        leer: () => a.escalaLetra,
        escribir: (v) => (a.escalaLetra = v),
      }),
      crear('span', 'rotulo', `peso (hoy ${a.original.peso})`),
      opciones(
        [['igual', null], ['400', '400'], ['500', '500'], ['600', '600'], ['700', '700']] as const,
        a.peso as string | null,
        (v) => {
          a.peso = v;
          ctx.alCambiar();
        },
      ),
      deslizador({
        etiqueta: `margen arriba (hoy ${a.original.margenArriba}px)`,
        min: -40,
        max: 160,
        paso: 2,
        unidad: 'px',
        leer: () => a.margenArriba ?? a.original.margenArriba,
        escribir: (v) => (a.margenArriba = v),
      }),
      deslizador({
        etiqueta: `margen abajo (hoy ${a.original.margenAbajo}px)`,
        min: -40,
        max: 160,
        paso: 2,
        unidad: 'px',
        leer: () => a.margenAbajo ?? a.original.margenAbajo,
        escribir: (v) => (a.margenAbajo = v),
      }),
      deslizador({
        etiqueta: `relleno arriba (hoy ${a.original.rellenoArriba ?? 0}px)`,
        min: 0,
        max: 240,
        paso: 4,
        unidad: 'px',
        leer: () => a.rellenoArriba ?? a.original.rellenoArriba ?? 0,
        escribir: (v) => (a.rellenoArriba = v),
      }),
      deslizador({
        etiqueta: `relleno abajo (hoy ${a.original.rellenoAbajo ?? 0}px)`,
        min: 0,
        max: 240,
        paso: 4,
        unidad: 'px',
        leer: () => a.rellenoAbajo ?? a.original.rellenoAbajo ?? 0,
        escribir: (v) => (a.rellenoAbajo = v),
      }),
      crear('span', 'rotulo', `alineación (hoy ${a.original.alineacion})`),
      opciones(
        [['igual', null], ['izquierda', 'left'], ['centro', 'center'], ['derecha', 'right']] as const,
        a.alineacion as string | null,
        (v) => {
          a.alineacion = v;
          ctx.alCambiar();
        },
      ),
      crear('span', 'rotulo', 'color de texto (tokens del sitio, valen en los dos temas)'),
      opciones(
        [['igual', null], ...TOKENS_DE_TEXTO.map((t) => [t, t] as const)] as ReadonlyArray<readonly [string, TokenDeTexto | null]>,
        a.color,
        (v) => {
          a.color = v;
          ctx.alCambiar();
          medir();
        },
      ),
      notaContraste,
      casilla('ocultar este elemento', a.oculto, (v) => {
        a.oculto = v;
        ctx.alCambiar();
      }),
    );

    const nota = crear('textarea');
    nota.rows = 3;
    nota.placeholder = 'Nota para quien lo implemente: «aquí va el logo de CYTED», «quitar», …';
    nota.value = a.nota;
    nota.addEventListener('input', () => {
      a.nota = nota.value;
      ctx.guardar();
    });
    ficha.append(crear('span', 'rotulo', 'nota'), nota);
    g.append(ficha);
  }

  const otros = Object.values(elementos).filter((x) => x.selector !== elegido && tieneCambios(x));
  if (otros.length) {
    const lista = crear('div', 'subgrupo');
    lista.append(crear('p', 'subtitulo', `Con cambios (${otros.length})`));
    for (const x of otros) {
      const fila = crear('div', 'fila botones');
      fila.append(
        boton(x.descripcion.slice(0, 70), () => {
          elegido = x.selector;
          ctx.alCambiar();
          ctx.remontar();
        }, 'menor crecer'),
        boton('✕', () => {
          delete elementos[x.selector];
          ctx.alCambiar();
          ctx.remontar();
        }),
      );
      lista.append(fila);
    }
    g.append(lista);
  }
  return g;
}

/* -------------------------------------------------------------------- informe */

export function informeElementos(): string[] {
  const cambiados = Object.values(ctx.ajustes().elementos).filter(tieneCambios);
  if (cambiados.length === 0) return [];
  const l = ['## Elementos señalados'];
  for (const a of cambiados) {
    const o = a.original;
    l.push(`- ${a.descripcion}`);
    l.push(`    selector: ${a.selector}`);
    l.push(`    dónde: ${COMPONENTE[a.seccion] ?? 'src/components/PaginaSeminario.astro'}`);
    if (a.clases) l.push(`    clases de hoy: ${a.clases}`);
    if (a.escalaLetra !== 1) {
      l.push(`    tamaño de letra: ${o.tamano}px → ${(o.tamano * a.escalaLetra).toFixed(1)}px (×${a.escalaLetra}, en el ancho de vista usado)`);
    }
    if (a.peso) l.push(`    peso: ${o.peso} → ${a.peso}`);
    if (a.margenArriba !== null) l.push(`    margen arriba: ${o.margenArriba}px → ${a.margenArriba}px`);
    if (a.margenAbajo !== null) l.push(`    margen abajo: ${o.margenAbajo}px → ${a.margenAbajo}px`);
    if (a.rellenoArriba != null) l.push(`    relleno arriba: ${o.rellenoArriba ?? 0}px → ${a.rellenoArriba}px`);
    if (a.rellenoAbajo != null) l.push(`    relleno abajo: ${o.rellenoAbajo ?? 0}px → ${a.rellenoAbajo}px`);
    if (a.alineacion) l.push(`    alineación: ${o.alineacion} → ${a.alineacion}`);
    if (a.color) l.push(`    color: → var(--${a.color}) · ${contrasteDe(a.selector) || 'contraste sin medir'}`);
    if (a.oculto) l.push('    QUITAR (oculto en la vista previa)');
    if (a.nota.trim()) l.push(`    nota: ${a.nota.trim()}`);
  }
  l.push('');
  return l;
}
