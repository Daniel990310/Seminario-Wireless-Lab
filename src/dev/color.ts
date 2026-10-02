/**
 * Color y contraste para el panel. Se resuelve pintando un píxel y no leyendo el
 * texto del CSS: los tokens del sitio llegan como `var(--navy-700)`, `oklch(…)` o
 * hexadecimal según el caso, y el lienzo los reduce todos a sRGB.
 */

export type Rgb = [number, number, number];

let pixel: CanvasRenderingContext2D | null = null;

/** Color y opacidad (0–255). `null` si el valor no es un color pintable. */
function aRgba(valor: string): [number, number, number, number] | null {
  const v = valor.trim();
  if (!v) return null;
  pixel ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!pixel) return null;
  pixel.clearRect(0, 0, 1, 1);
  // Si `v` no es un color, `fillStyle` conserva el anterior: el negro marca el fallo.
  pixel.fillStyle = 'rgba(0, 0, 0, 0)';
  pixel.fillStyle = v;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a];
}

/** `null` si el valor no es un color pintable (vacío, `transparent`…). */
export function aRgb(valor: string): Rgb | null {
  const c = aRgba(valor);
  return c && c[3] > 0 ? [c[0], c[1], c[2]] : null;
}

export function aHex([r, g, b]: Rgb): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

function luminancia([r, g, b]: Rgb): number {
  const lineal = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b);
}

/** Razón de contraste WCAG 2.x, la misma que usa axe en `npm run verify`. */
export function contraste(a: Rgb, b: Rgb): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Fondo efectivo de un elemento: el primer ancestro con fondo opaco. Devuelve
 * `null` si por el camino aparece una imagen, porque entonces el contraste es
 * indeterminado —lo mismo que reporta axe y que hace fallar RNF-1.3.
 */
export function fondoEfectivo(el: Element): Rgb | null {
  const vista = el.ownerDocument.defaultView;
  if (!vista) return null;
  for (let n: Element | null = el; n; n = n.parentElement) {
    const estilo = vista.getComputedStyle(n);
    if (estilo.backgroundImage !== 'none') return null;
    const c = aRgba(estilo.backgroundColor);
    if (c && c[3] >= 250) return [c[0], c[1], c[2]];
  }
  return [255, 255, 255];
}
