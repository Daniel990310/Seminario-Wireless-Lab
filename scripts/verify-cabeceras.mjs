/**
 * Comprobación de RNF-7.6 y RNF-7.7 — página 404 y cabeceras de seguridad.
 *
 * Mira `dist/`, no la red: la autoridad sobre el cumplimiento no puede depender de
 * que haya conexión (RNF-7.5). Lo que solo se ve en vivo —que Cloudflare entregue de
 * verdad estas cabeceras— lo comprueba `verify:publicado`.
 *
 * El criterio que de verdad importa es el tercero: que **todos** los hashes de los
 * scripts en línea de **todas** las páginas estén en la CSP. Es lo que detecta el
 * fallo silencioso: alguien cambia una página, no regenera, y el navegador deja de
 * ejecutar el guion del tema sin decir nada a nadie.
 *
 * Uso: `npm run build && npm run verify:cabeceras`.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url)).replace(/[\/]$/, '');
const DIST = join(RAIZ, 'dist');

const resultados = [];
const check = (nombre, ok, detalle = '') => resultados.push({ nombre, ok, detalle });

const sha256 = (t) => `'sha256-${createHash('sha256').update(t, 'utf8').digest('base64')}'`;

function paginas(dir) {
  const s = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) s.push(...paginas(p));
    else if (e.name.endsWith('.html')) s.push(p);
  }
  return s;
}

/* ── RNF-7.6 · la página 404 ─────────────────────────────────────────────── */

const ruta404 = join(DIST, '404.html');
if (!existsSync(ruta404)) {
  check('RNF-7.6 · existe dist/404.html', false, 'falta: Cloudflare servirá una página vacía');
} else {
  const html = readFileSync(ruta404, 'utf8');
  check('RNF-7.6 · existe dist/404.html', true, `${(html.length / 1024).toFixed(1)} kB`);
  check(
    'RNF-7.6 · la 404 no está vacía',
    html.length > 1000,
    `${html.length} bytes`,
  );
  check(
    'RNF-7.6 · ofrece vuelta a las dos versiones del inicio',
    /href="\/"/.test(html) && /href="\/en\/"/.test(html),
    'enlaces a / y /en/',
  );
  check(
    'RNF-7.6 · el mensaje está en los dos idiomas',
    /lang="en"/.test(html) && /<html lang="es"/.test(html),
    'es + en en la misma página',
  );
  check(
    'RNF-7.6 · la 404 no se indexa',
    /<meta name="robots" content="noindex"/.test(html),
    'noindex',
  );
  check(
    'RNF-7.6 · la 404 no lleva datos estructurados del evento',
    !/application\/ld\+json/.test(html),
    'sin JSON-LD: una URL inexistente no es el seminario',
  );
  const sitemap = join(DIST, 'sitemap-0.xml');
  check(
    'RNF-7.6 · la 404 no está en el sitemap',
    !existsSync(sitemap) || !readFileSync(sitemap, 'utf8').includes('404'),
    'ausente del sitemap',
  );
}

/* ── RNF-7.7 · la CSP ────────────────────────────────────────────────────── */

const rutaHeaders = join(DIST, '_headers');
if (!existsSync(rutaHeaders)) {
  check('RNF-7.7 · existe dist/_headers', false, 'falta');
} else {
  const headers = readFileSync(rutaHeaders, 'utf8');
  const csp = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1] ?? '';

  check('RNF-7.7 · existe dist/_headers', true, `${headers.length} bytes`);
  check(
    'RNF-7.7 · se declara una Content-Security-Policy',
    csp.length > 0,
    csp ? `${csp.length} caracteres` : 'NO generada: ¿corrió scripts/generar-csp.mjs?',
  );

  const directiva = (nombre) =>
    csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(nombre + ' ')) ?? '';

  const scriptSrc = directiva('script-src');
  const styleSrc = directiva('style-src');

  /*
   * EL CRITERIO CENTRAL. Sin él, la CSP puede quedar obsoleta y el sitio romperse en
   * silencio: el navegador no avisa de un script bloqueado, simplemente no lo ejecuta.
   */
  const faltantes = [];
  let totalScripts = 0;
  let totalEstilos = 0;
  for (const archivo of paginas(DIST)) {
    const html = readFileSync(archivo, 'utf8');
    const donde = relative(DIST, archivo).split(sep).join('/');
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      totalScripts++;
      if (!scriptSrc.includes(sha256(m[1]))) faltantes.push(`script en ${donde}`);
    }
    for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      totalEstilos++;
      if (!styleSrc.includes(sha256(m[1]))) faltantes.push(`estilo en ${donde}`);
    }
  }
  check(
    'RNF-7.7 · la CSP cubre todo lo que está en línea',
    faltantes.length === 0,
    faltantes.length === 0
      ? `${totalScripts} scripts y ${totalEstilos} estilos, todos con hash`
      : `${faltantes.length} sin hash: ${[...new Set(faltantes)].slice(0, 3).join(', ')}`,
  );

  check(
    "RNF-7.7 · script-src no permite 'unsafe-inline'",
    scriptSrc !== '' && !scriptSrc.includes("'unsafe-inline'"),
    scriptSrc.includes("'unsafe-inline'")
      ? "lo permite: un script inyectado se ejecutaría"
      : 'solo hashes',
  );
  check(
    "RNF-7.7 · script-src no permite 'unsafe-eval'",
    !scriptSrc.includes("'unsafe-eval'"),
    'sin eval',
  );
  for (const d of ["object-src 'none'", "base-uri 'self'", "form-action 'none'"]) {
    check(`RNF-7.7 · ${d}`, csp.includes(d), csp.includes(d) ? 'declarada' : 'ausente');
  }
  check(
    'RNF-7.7 · frame-ancestors concuerda con X-Frame-Options',
    csp.includes("frame-ancestors 'self'") && /X-Frame-Options:\s*SAMEORIGIN/i.test(headers),
    "'self' ↔ SAMEORIGIN",
  );
  check(
    'RNF-7.7 · las cabeceras de public/_headers sobreviven a la generación',
    ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Cache-Control'].every(
      (h) => headers.includes(h),
    ),
    'las cuatro presentes',
  );
}

console.log('\nComprobación de RNF-7.6 y RNF-7.7 — página 404 y cabeceras\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(56)} ${r.detalle}`);
}
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
