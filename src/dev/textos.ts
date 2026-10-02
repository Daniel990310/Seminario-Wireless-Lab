/**
 * Edición de textos en sitio, y dónde vive cada texto en el código.
 *
 * Tres defectos del panel anterior, reproducidos con Playwright el 2026-10-02
 * antes de corregirlos `[medido]`:
 *
 *   1. Un texto editado en español **aparecía en la página inglesa**: la clave no
 *      llevaba idioma, solo la posición del nodo.
 *   2. Enter metía un `<div>` dentro del párrafo. El informe pegaba las palabras
 *      («linea nuevadistancias») y, como el nodo dejaba de ser hoja, al recargar
 *      cada cambio posterior caía sobre el nodo equivocado.
 *   3. Solo se podían editar títulos y párrafos de `<main>`: ni los nombres de los
 *      expositores (`<h4>`), ni la barra, ni el pie, ni botones o enlaces.
 */
import { claveDeTexto, type CambioTexto, type Idioma } from './modelo';
import { ctx } from './ui';

const SELECTOR_TEXTO = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'dt', 'dd', 'figcaption', 'blockquote',
  'a', 'button', 'summary', 'span', 'strong', 'em', 'small', 'td', 'th', 'label', 'time',
].join(', ');

/**
 * Nodos «hoja» con texto: sin hijos elemento, para que escribir encima no borre
 * marcado. Se excluye lo `aria-hidden` —el monograma de un expositor sin foto se
 * calcula del nombre, editarlo no significa nada.
 */
function nodosDeTexto(d: Document): HTMLElement[] {
  return [...d.body.querySelectorAll<HTMLElement>(SELECTOR_TEXTO)].filter(
    (n) =>
      n.children.length === 0 &&
      (n.textContent ?? '').trim() !== '' &&
      !n.closest('[aria-hidden="true"], script, style, noscript'),
  );
}

export function seccionDe(n: Element): string {
  const s = n.closest('section[id]');
  if (s) return s.id;
  if (n.closest('header')) return 'barra';
  if (n.closest('footer')) return 'pie';
  return 'sin-seccion';
}

function originalDe(n: HTMLElement): string {
  return n.dataset.panelOriginal ?? n.textContent ?? '';
}

/**
 * Recorre los nodos numerando las repeticiones de un mismo texto dentro de su
 * sección, que es lo que distingue dos «Lugar» de la misma página.
 */
function recorrer(d: Document, visitar: (n: HTMLElement, seccion: string, ocurrencia: number) => void): void {
  const vistos = new Map<string, number>();
  for (const n of nodosDeTexto(d)) {
    const seccion = seccionDe(n);
    const k = `${seccion}|${originalDe(n)}`;
    const ocurrencia = vistos.get(k) ?? 0;
    vistos.set(k, ocurrencia + 1);
    visitar(n, seccion, ocurrencia);
  }
}

/**
 * Pinta los textos del borrador del idioma que se está viendo. Un cambio solo se
 * aplica donde el texto original sigue igual: si el sitio cambió desde que se
 * editó, el cambio queda en el informe pero no se pinta sobre otra cosa.
 */
export function aplicarTextos(d: Document): void {
  const { textos, vista } = ctx.ajustes();
  if (!Object.values(textos).some((c) => c.idioma === vista.idioma)) return;
  recorrer(d, (n, seccion, ocurrencia) => {
    const original = originalDe(n);
    const c = textos[claveDeTexto({ idioma: vista.idioma, seccion, ocurrencia, original })];
    if (!c) return;
    n.dataset.panelOriginal = original;
    if (n.textContent !== c.nuevo) n.textContent = c.nuevo;
  });
}

function registrar(n: HTMLElement, idioma: Idioma): void {
  const { textos } = ctx.ajustes();
  const c: CambioTexto = {
    idioma,
    seccion: n.dataset.panelSeccion ?? seccionDe(n),
    etiqueta: n.tagName.toLowerCase(),
    ocurrencia: Number(n.dataset.panelOcurrencia ?? 0),
    original: originalDe(n),
    nuevo: n.textContent ?? '',
  };
  const clave = claveDeTexto(c);
  if (c.nuevo === c.original) delete textos[clave];
  else textos[clave] = c;
  ctx.guardar();
}

function hacerEditable(n: HTMLElement, activo: boolean): void {
  if (!activo) {
    n.removeAttribute('contenteditable');
    return;
  }
  try {
    // Pegar desde Word o desde un correo trae marcado; `plaintext-only` lo descarta.
    n.contentEditable = 'plaintext-only';
  } catch {
    n.contentEditable = 'true';
  }
}

/** Activa o retira la edición según la herramienta elegida. Se llama en cada carga del marco. */
export function prepararEdicion(d: Document): void {
  const activo = ctx.herramienta === 'textos';
  recorrer(d, (n, seccion, ocurrencia) => {
    hacerEditable(n, activo);
    if (!activo || n.dataset.panelAtado === 'si') return;
    n.dataset.panelAtado = 'si';
    n.dataset.panelOriginal = originalDe(n);
    n.dataset.panelSeccion = seccion;
    n.dataset.panelOcurrencia = String(ocurrencia);
    n.addEventListener('keydown', (e) => {
      // Un salto de línea no existe en estos textos: son cadenas de una línea en `es.ts`.
      if (ctx.herramienta === 'textos' && e.key === 'Enter') e.preventDefault();
    });
    n.addEventListener('input', () => registrar(n, ctx.ajustes().vista.idioma));
  });
}

/* ------------------------------------------------------- dónde está en código */

/**
 * Los fuentes donde puede estar un texto, leídos en crudo. Solo existe en
 * `npm run dev`, igual que todo el panel: en el build esta importación no corre.
 */
const FUENTES = import.meta.glob<string>(['/src/data/*.ts', '/src/components/*.astro', '/src/layouts/*.astro'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

function normalizar(s: string): string {
  return s
    .replace(/\\u00a0|&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * `archivo:línea` donde aparece el texto. Un texto corto como «Lugar» sale en
 * comentarios y nombres de variable, así que por debajo de 25 caracteres solo
 * cuenta si está entero entre comillas o entre `>` y `<`.
 */
function ubicar(texto: string): string[] {
  const buscado = normalizar(texto);
  if (buscado.length < 2) return [];
  const exacto =
    buscado.length < 25 ? new RegExp(`(['"\`>])\\s*${escaparRegex(buscado)}\\s*(['"\`<])`) : null;
  const hallados: string[] = [];
  const buscar = (aguja: string, sufijo: string): void => {
    for (const [ruta, contenido] of Object.entries(FUENTES)) {
      contenido.split('\n').forEach((linea, i) => {
        const l = normalizar(linea);
        const coincide = exacto && aguja === buscado ? exacto.test(l) : l.includes(aguja);
        if (coincide) hallados.push(`${ruta.slice(1)}:${i + 1}${sufijo}`);
      });
    }
  };
  buscar(buscado, '');
  // Un texto largo suele estar partido en varias líneas del fuente: se busca su comienzo.
  if (hallados.length === 0 && buscado.length > 50) buscar(buscado.slice(0, 40), ' (por el comienzo)');
  return hallados.slice(0, 6);
}

export function informeTextos(): string[] {
  const textos = Object.values(ctx.ajustes().textos);
  if (textos.length === 0) return [];
  const l = ['## Textos', 'Cada texto de es.ts tiene su par en en.ts: cambiar uno sin el otro rompe el selector de idioma.'];
  for (const t of textos) {
    const donde = ubicar(t.original);
    l.push(`- [${t.idioma}] #${t.seccion} <${t.etiqueta}> → ${donde.length ? donde.join(', ') : 'no aparece literal: puede venir compuesto o de un componente'}`);
    l.push(`    antes: ${normalizar(t.original)}`);
    l.push(`    ahora: ${normalizar(t.nuevo)}`);
  }
  l.push('');
  return l;
}
