/**
 * Genera `dist/_headers` con la Content-Security-Policy del sitio (RNF-7.7).
 *
 * Corre DESPUÉS de `astro build`, dentro de `npm run build`. No es opcional: si no
 * corre, `dist/_headers` es la copia literal de `public/_headers` y el sitio sale sin
 * CSP. `verify-cabeceras.mjs` falla en ese caso.
 *
 * POR QUÉ SE GENERA Y NO SE ESCRIBE A MANO
 *
 * Cada página lleva 9 scripts en línea y 4 estilos en línea, todos producidos por
 * Astro, y sus hashes cambian en cada build. Una CSP escrita a mano quedaría obsoleta
 * al primer cambio de contenido y **rompería el sitio en silencio**: el navegador no
 * avisa, simplemente deja de ejecutar el guion del tema y la página se queda en claro.
 *
 * QUÉ CUBRE Y QUÉ NO
 *
 * `script-src` va con hashes y SIN `'unsafe-inline'`: un script inyectado no se
 * ejecuta. Eso es lo que de verdad compra esta cabecera.
 *
 * `style-src-attr 'unsafe-inline'` es la concesión, y se declara en voz alta en vez de
 * presentar la política como más estricta de lo que es. Las páginas llevan 34 atributos
 * `style="…"` —retardos de transición, variables de animación y ocho alturas— y los
 * hashes de `style-src` no se aplican a los atributos. Cubrirlos exigiría
 * `'unsafe-hashes'` con 34 hashes que cambian en cada build: peor que el problema.
 *
 * La política es la UNIÓN de los hashes de todas las páginas, en un solo bloque `/*`.
 * Un bloque por ruta sería marginalmente más estricto —un hash válido en una página no
 * lo sería en otra— y bastante más frágil. Para cinco páginas estáticas no compensa.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(RAIZ, 'dist');
const BASE = join(RAIZ, 'public', '_headers');
const SALIDA = join(DIST, '_headers');

/** Único tercero del sitio: el mapa de la sede, cargado solo bajo demanda (RNF-4.2). */
const MAPA = 'https://www.openstreetmap.org';

const sha256 = (texto) => `'sha256-${createHash('sha256').update(texto, 'utf8').digest('base64')}'`;

function paginas(dir) {
  const salida = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) salida.push(...paginas(p));
    else if (e.name.endsWith('.html')) salida.push(p);
  }
  return salida;
}

const hashesScript = new Set();
const hashesEstilo = new Set();
/** Lo que la política NO contempla. Si aparece algo aquí, se aborta el build. */
const sinCubrir = [];

for (const archivo of paginas(DIST)) {
  const html = readFileSync(archivo, 'utf8');
  const donde = relative(DIST, archivo).split(sep).join('/');

  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    hashesScript.add(sha256(m[1]));
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    hashesEstilo.add(sha256(m[1]));
  }

  /*
   * Guardas. Cada una corresponde a una directiva que hoy está cerrada porque el sitio
   * no usa eso. El día que alguien lo use, el build para y obliga a decidir, en vez de
   * publicar una página que el navegador romperá en silencio.
   */
  for (const m of html.matchAll(/<script[^>]*\bsrc="(https?:\/\/[^"]+)"/g)) {
    sinCubrir.push(`${donde}: script externo ${m[1]} — script-src solo permite 'self'`);
  }
  for (const m of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(https?:\/\/[^"]+)"/g)) {
    sinCubrir.push(`${donde}: hoja de estilos externa ${m[1]} — style-src solo permite 'self'`);
  }
  for (const m of html.matchAll(/<img[^>]*src="((?:https?:|data:)[^"]*)"/g)) {
    sinCubrir.push(`${donde}: imagen ${m[1].slice(0, 60)} — img-src solo permite 'self'`);
  }
  for (const m of html.matchAll(/<iframe[^>]*src="(https?:\/\/[^"]+)"/g)) {
    if (!m[1].startsWith(MAPA)) {
      sinCubrir.push(`${donde}: iframe a ${m[1]} — frame-src solo permite ${MAPA}`);
    }
  }
  if (/<form[\s>]/.test(html)) {
    sinCubrir.push(`${donde}: hay un <form> — form-action está en 'none'`);
  }
}

if (sinCubrir.length) {
  console.error('\n✗ La CSP no cubre lo que el sitio ahora contiene:\n');
  for (const s of sinCubrir) console.error(`  · ${s}`);
  console.error('\nAmpliar la directiva en scripts/generar-csp.mjs y decirlo en RNF-7.7.\n');
  process.exit(1);
}

const orden = (s) => [...s].sort();

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // El sitio no tiene formularios [medido]. Si aparece uno, la guarda de arriba lo para.
  "form-action 'none'",
  // 'self' y no 'none' para no contradecir al X-Frame-Options: SAMEORIGIN de public/_headers.
  "frame-ancestors 'self'",
  `script-src 'self' ${orden(hashesScript).join(' ')}`,
  `style-src 'self' ${orden(hashesEstilo).join(' ')}`,
  // La concesión. Ver la cabecera de este archivo.
  "style-src-attr 'unsafe-inline'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  `frame-src ${MAPA}`,
  'upgrade-insecure-requests',
].join('; ');

const cabecera = `
# ─────────────────────────────────────────────────────────────────────────────
# GENERADO por scripts/generar-csp.mjs en cada build. NO EDITAR A MANO.
# Los hashes cambian con el contenido; una copia editada a mano rompe el sitio
# en silencio la próxima vez que cambie una página. Ver RNF-7.7.
# ${orden(hashesScript).length} hashes de script · ${orden(hashesEstilo).length} de estilo
# ─────────────────────────────────────────────────────────────────────────────
/*
  Content-Security-Policy: ${csp}
`;

writeFileSync(SALIDA, readFileSync(BASE, 'utf8').trimEnd() + '\n' + cabecera, 'utf8');
console.log(
  `[csp] dist/_headers generado — ${orden(hashesScript).length} hashes de script, ` +
    `${orden(hashesEstilo).length} de estilo, ${paginas(DIST).length} páginas`,
);
