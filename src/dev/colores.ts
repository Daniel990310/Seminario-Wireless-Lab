/**
 * Colores del tema: los tokens de `src/styles/global.css`, por tema, con el
 * contraste de cada par medido en vivo. El sistema documenta cada token con su
 * razón sobre el fondo; esta perilla obliga a mirar ese número antes de enamorarse
 * de un tono, igual que el aviso de imagen bajo texto.
 */
import { aHex, aRgb, contraste, type Rgb } from './color';
import type { Tema } from './modelo';
import { REFUERZO, boton, crear, ctx, grupo } from './ui';

const TOKENS = [
  'background',
  'surface',
  'foreground',
  'muted-foreground',
  'primary',
  'primary-foreground',
  'accent',
  'accent-foreground',
  'border-control',
] as const;
type Token = (typeof TOKENS)[number];

/** Texto, fondo y umbral: 4,5 para texto (WCAG 1.4.3), 3 para límites de control (1.4.11). */
const PARES: ReadonlyArray<readonly [Token, Token, number]> = [
  ['foreground', 'background', 4.5],
  ['muted-foreground', 'background', 4.5],
  ['primary', 'background', 4.5],
  ['accent', 'background', 4.5],
  ['foreground', 'surface', 4.5],
  ['primary-foreground', 'primary', 4.5],
  ['accent-foreground', 'accent', 4.5],
  ['border-control', 'background', 3],
];

const NOMBRE_TEMA: Record<Tema, string> = { light: 'claro', dark: 'oscuro' };

function valorActual(token: Token): Rgb | null {
  const { colores, vista } = ctx.ajustes();
  const cambio = colores[vista.tema][token];
  if (cambio) return aRgb(cambio.nuevo);
  const d = ctx.pagina();
  return d ? aRgb(getComputedStyle(d.documentElement).getPropertyValue(`--${token}`)) : null;
}

/** Valor del repositorio: el guardado si ya se cambió, si no el que pinta la página ahora. */
function valorOriginal(token: Token): string {
  const { colores, vista } = ctx.ajustes();
  const cambio = colores[vista.tema][token];
  if (cambio) return cambio.original;
  const rgb = valorActual(token);
  return rgb ? aHex(rgb) : '#000000';
}

function medirPares(): Array<{ texto: string; ok: boolean; toca: Token[] }> {
  return PARES.map(([t, f, minimo]) => {
    const a = valorActual(t);
    const b = valorActual(f);
    if (!a || !b) return { texto: `--${t} sobre --${f}: sin medir`, ok: true, toca: [t, f] };
    const r = contraste(a, b);
    return {
      texto: `--${t} sobre --${f}: ${r.toFixed(2)}:1 ${r >= minimo ? '✓' : `✗ bajo ${minimo}:1`}`,
      ok: r >= minimo,
      toca: [t, f],
    };
  });
}

export function cssDeColores(): string[] {
  const l: string[] = [];
  for (const tema of ['light', 'dark'] as Tema[]) {
    const cambios = Object.entries(ctx.ajustes().colores[tema]);
    if (cambios.length === 0) continue;
    l.push(`${REFUERZO}[data-theme='${tema}'] { ${cambios.map(([t, c]) => `--${t}: ${c.nuevo};`).join(' ')} }`);
  }
  return l;
}

export function grupoColores(): HTMLElement {
  const { vista, colores } = ctx.ajustes();
  const cambios = colores[vista.tema];
  const g = grupo(`Colores del tema ${NOMBRE_TEMA[vista.tema]}`, Object.keys(cambios).length > 0);
  g.append(
    crear(
      'p',
      'nota',
      'Cambia el token en toda la página. La banda institucional (barra y pie) define sus propios ' +
        'colores y no se ve afectada. Para el otro tema, cambiá de tema en «Vista».',
    ),
  );

  const lista = crear('ul', 'diagnostico-pares');
  const pintarPares = (): void => {
    lista.textContent = '';
    for (const p of medirPares()) lista.append(crear('li', p.ok ? '' : 'falla', p.texto));
  };

  for (const token of TOKENS) {
    const original = valorOriginal(token);
    const fila = crear('div', 'fila botones color');
    const entrada = crear('input');
    entrada.type = 'color';
    entrada.value = cambios[token]?.nuevo ?? original;
    entrada.setAttribute('aria-label', `--${token}`);
    entrada.addEventListener('input', () => {
      if (entrada.value.toLowerCase() === original.toLowerCase()) delete cambios[token];
      else cambios[token] = { original, nuevo: entrada.value };
      ctx.alCambiar();
      pintarPares();
    });
    const restaurar = boton('↺', () => {
      delete cambios[token];
      entrada.value = original;
      ctx.alCambiar();
      pintarPares();
    });
    restaurar.title = `Volver a ${original}`;
    fila.append(entrada, crear('span', 'rotulo-color', `--${token}`), restaurar);
    g.append(fila);
  }
  g.append(crear('p', 'subtitulo', 'Contraste de los pares que usa el sitio'), lista);
  pintarPares();
  return g;
}

export function informeColores(): string[] {
  const { colores } = ctx.ajustes();
  const l: string[] = [];
  for (const tema of ['light', 'dark'] as Tema[]) {
    const cambios = Object.entries(colores[tema]);
    if (cambios.length === 0) continue;
    l.push(`## Colores del tema ${NOMBRE_TEMA[tema]} (src/styles/global.css, bloque :root[data-theme='${tema}'])`);
    for (const [t, c] of cambios) l.push(`- --${t}: ${c.original} → ${c.nuevo}`);
    if (tema === ctx.ajustes().vista.tema) {
      const tocados = new Set(cambios.map(([t]) => t));
      for (const p of medirPares().filter((x) => x.toca.some((t) => tocados.has(t)))) l.push(`    ${p.texto}`);
    } else {
      l.push(`    (contraste medido solo con el tema a la vista; pasá a ${NOMBRE_TEMA[tema]} para verlo)`);
    }
    l.push('');
  }
  return l;
}
