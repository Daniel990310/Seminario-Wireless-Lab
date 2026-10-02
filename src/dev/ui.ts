/**
 * Piezas comunes del panel: el contexto que comparten los módulos y los
 * constructores de controles. `panel.ts` rellena `ctx` al arrancar; los demás
 * módulos solo lo leen, así ninguno importa a `panel.ts` y no hay ciclos.
 */
import type { Ajustes, Herramienta, ImagenCargada } from './modelo';

interface Contexto {
  ajustes: () => Ajustes;
  pagina: () => Document | null;
  /** Aplica el borrador a la página y lo guarda. */
  alCambiar: () => void;
  /** Solo guarda y rehace el informe: para lo que ya está pintado, como un texto tecleado. */
  guardar: () => void;
  /** Vuelve a pintar los controles; necesario cuando cambia lo que hay que mostrar. */
  remontar: () => void;
  avisar: (texto: string, ms?: number) => void;
  herramienta: Herramienta;
}

export const ctx: Contexto = {
  ajustes: () => {
    throw new Error('panel sin arrancar');
  },
  pagina: () => null,
  alCambiar: () => {},
  guardar: () => {},
  remontar: () => {},
  avisar: () => {},
  herramienta: 'navegar',
};

/**
 * El objetivo de un evento de la página como `Element`, o `null`.
 *
 * **No sirve `instanceof Element`**: los nodos del marco son de *su* ventana, y su
 * `Element` es otro objeto que el de este documento, así que la comprobación da
 * `false` siempre. Con ella, la herramienta «señalar» no elegía nada y el modo de
 * textos dejaba navegar los enlaces `[medido: 2026-10-02]`.
 */
export function comoElemento(objetivo: EventTarget | null): Element | null {
  return objetivo && (objetivo as Node).nodeType === Node.ELEMENT_NODE ? (objetivo as Element) : null;
}

/**
 * Prefijo que da a una regla inyectada especificidad de id aunque el elemento no
 * tenga uno: `:is()` toma la de su argumento más específico, y `#panel-refuerzo` no
 * existe, así que solo coincide `html`. Gana a las clases de Tailwind y a los
 * estilos con ámbito de Astro sin recurrir a `!important`; solo lo supera un
 * estilo en línea.
 */
export const REFUERZO = ':is(html, #panel-refuerzo)';

export function crear<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  clase = '',
  texto = '',
): HTMLElementTagNameMap[K] {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

export function boton(texto: string, alPulsar: () => void, clase = 'menor'): HTMLButtonElement {
  const b = crear('button', clase, texto);
  b.type = 'button';
  b.addEventListener('click', alPulsar);
  return b;
}

function marcarActivo(contenedor: HTMLElement, activo: HTMLElement): void {
  for (const b of contenedor.querySelectorAll('button')) b.classList.remove('activo');
  activo.classList.add('activo');
}

/** Fila de botones excluyentes: el que coincide con `actual` sale marcado. */
export function opciones<T>(
  lista: ReadonlyArray<readonly [string, T]>,
  actual: T,
  alElegir: (valor: T) => void,
): HTMLElement {
  const fila = crear('div', 'fila botones');
  for (const [nombre, valor] of lista) {
    const b = boton(nombre, () => {
      alElegir(valor);
      marcarActivo(fila, b);
    });
    if (valor === actual) b.classList.add('activo');
    fila.append(b);
  }
  return fila;
}

export function grupo(titulo: string, abierto = true): HTMLDetailsElement {
  const d = crear('details', 'grupo');
  d.open = abierto;
  d.append(crear('summary', '', titulo));
  return d;
}

export function casilla(texto: string, valor: boolean, alCambiar: (v: boolean) => void): HTMLLabelElement {
  const fila = crear('label', 'fila interruptor');
  const entrada = crear('input');
  entrada.type = 'checkbox';
  entrada.checked = valor;
  entrada.addEventListener('change', () => alCambiar(entrada.checked));
  fila.append(entrada, crear('span', '', texto));
  return fila;
}

export interface OpcionesDeslizador {
  etiqueta: string;
  min: number;
  max: number;
  paso: number;
  unidad?: string;
  leer: () => number;
  escribir: (v: number) => void;
}

export function deslizador(o: OpcionesDeslizador): HTMLElement {
  const fila = crear('div', 'fila');
  const rotulo = crear('label', 'rotulo');
  const valor = crear('span', 'valor', `${o.leer()}${o.unidad ?? ''}`);
  rotulo.append(crear('span', '', o.etiqueta), valor);

  const entrada = crear('input');
  entrada.type = 'range';
  entrada.min = String(o.min);
  entrada.max = String(o.max);
  entrada.step = String(o.paso);
  entrada.value = String(o.leer());
  entrada.addEventListener('input', () => {
    const v = Number(entrada.value);
    o.escribir(v);
    valor.textContent = `${v}${o.unidad ?? ''}`;
    ctx.alCambiar();
  });

  rotulo.append(entrada);
  fila.append(rotulo);
  return fila;
}

/**
 * Reduce la imagen antes de guardarla. Sin esto, una fotografía de cámara o de
 * Gemini —3,58 MB, 2752×1536 en el caso que lo motivó— no cabe en `localStorage`
 * y el borrador se pierde en cada recarga. 1800 px de ancho sobran: la franja
 * nunca pinta más de 166 px de alto `[medido: 2026-09-22]`.
 *
 * Es solo para *ver*. El archivo que se instale en `src/assets/` sale del
 * original, no de esta reducción.
 */
function reducir(archivo: File): Promise<ImagenCargada> {
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.addEventListener('load', () => {
      const ANCHO_MAX = 1800;
      const escala = Math.min(1, ANCHO_MAX / img.naturalWidth);
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(img.naturalWidth * escala);
      lienzo.height = Math.round(img.naturalHeight * escala);
      lienzo.getContext('2d')?.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      URL.revokeObjectURL(url);
      resolver({
        nombre: archivo.name,
        datos: lienzo.toDataURL('image/webp', 0.82),
        ancho: img.naturalWidth,
        altoPx: img.naturalHeight,
      });
    });
    img.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      rechazar(new Error('no se pudo leer la imagen'));
    });
    img.src = url;
  });
}

export function cargadorDeImagen(etiqueta: string, alCargar: (img: ImagenCargada | null) => void): HTMLElement {
  const fila = crear('div', 'fila');
  fila.append(crear('span', 'rotulo', etiqueta));

  const entrada = crear('input');
  entrada.type = 'file';
  entrada.accept = 'image/*';
  entrada.addEventListener('change', () => {
    const archivo = entrada.files?.[0];
    if (!archivo) return;
    void reducir(archivo)
      .then((img) => {
        alCargar(img);
        ctx.alCambiar();
        ctx.avisar(
          `${img.nombre}: ${img.ancho}×${img.altoPx} px, reducida a 1800 px de ancho para el borrador. ` +
            'El archivo que se instale saldrá del original.',
          5000,
        );
      })
      .catch(() => ctx.avisar(`No se pudo leer ${archivo.name}.`));
  });

  const quitar = boton('quitar', () => {
    entrada.value = '';
    alCargar(null);
    ctx.alCambiar();
  });

  fila.append(entrada, quitar);
  return fila;
}
