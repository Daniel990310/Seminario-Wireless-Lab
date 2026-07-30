/**
 * Verificación de accesibilidad y presupuestos de peso.
 *
 * Satisface RNF-6. Es la autoridad sobre el cumplimiento de RNF-1 y RNF-2: si
 * este comando no está en verde, ninguna afirmación de mejora está respaldada.
 *
 * Uso:  npm run verify            (requiere `npm run build` previo)
 *       npm run verify -- --json  (salida legible por máquina)
 *
 * Termina con código 1 si se incumple cualquier presupuesto, para servir en
 * integración continua.
 */
import { createServer } from 'node:http';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, extname, relative } from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const DIST = join(ROOT, 'dist');
const REPORT = join(ROOT, 'specs/001-mejora-calidad/verification.md');
const AXE = join(ROOT, 'node_modules/axe-core/axe.min.js');

/*
 * Unidad: kB decimal (1 kB = 1000 bytes), no KiB.
 *
 * Es la convención con la que se registró la línea base. Mezclarla con la
 * binaria hacía que el mismo archivo apareciera como 109,3 kB en las
 * especificaciones y 106,8 kB aquí, una diferencia del 2,3 % puramente
 * artificial. Se fija explícitamente para que no vuelva a pasar.
 */
const kB = (n) => `${(n / 1000).toFixed(1)} kB`;

/** Presupuestos de RNF-2. Cambiarlos exige cambiar primero requirements.md. */
const PRESUPUESTOS = {
  javascript: 40_000,
  primeraCarga: 180_000,
  tipografias: 125_000,
};

/** Línea base de specs/baseline/auditoria-2026-07-29.md, para comparar. */
const LINEA_BASE = {
  violaciones: 16,
  indeterminados: 28,
  javascript: 109_313,
  primeraCarga: 241_165,
  tipografias: 110_948,
  seccionesSinNombre: 7,
};

const VIEWPORTS = [
  { nombre: 'escritorio', width: 1440, height: 900 },
  { nombre: 'movil', width: 390, height: 844 },
];

/** Reglas de WCAG 2.1 AA. Las buenas prácticas se informan pero no bloquean. */
const REGLAS_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// ---------------------------------------------------------------------------
// Servidor estático mínimo
// ---------------------------------------------------------------------------

/*
 * Se sirve `dist/` con un servidor propio en lugar de `astro preview` para que
 * la medición no dependa de arrancar y matar un proceso externo, que es la
 * parte más frágil de este tipo de script.
 */
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

function servirDist() {
  const server = createServer(async (req, res) => {
    let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (ruta.endsWith('/')) ruta += 'index.html';
    const archivo = join(DIST, ruta);

    // No servir fuera de dist.
    if (!archivo.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const cuerpo = await readFile(archivo);
      res.writeHead(200, { 'content-type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
      res.end(cuerpo);
    } catch {
      res.writeHead(404).end('no encontrado');
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, puerto: server.address().port }));
  });
}

// ---------------------------------------------------------------------------
// Peso de los recursos
// ---------------------------------------------------------------------------

async function listarArchivos(dir) {
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...(await listarArchivos(ruta)));
    else salida.push(ruta);
  }
  return salida;
}

/*
 * Se mide sobre los archivos de `dist` con gzip nivel 9, igual que la línea
 * base. Medir la transferencia real del navegador introduciría variación por
 * la negociación de compresión del servidor, y aquí interesa un número
 * comparable entre corridas, no la latencia de una red concreta.
 *
 * Los .woff2 ya vienen comprimidos: se cuentan tal cual.
 */
async function medirPeso(rutaPagina) {
  const archivos = await listarArchivos(DIST);
  const grupos = { javascript: 0, css: 0, html: 0, tipografias: 0, imagenes: 0 };

  for (const archivo of archivos) {
    const ext = extname(archivo);
    const rel = relative(DIST, archivo);
    const tam = (await stat(archivo)).size;

    if (ext === '.woff2') grupos.tipografias += tam;
    else if (ext === '.js') grupos.javascript += gzipSync(await readFile(archivo), { level: 9 }).length;
    else if (ext === '.css') grupos.css += gzipSync(await readFile(archivo), { level: 9 }).length;
    else if (ext === '.svg') grupos.imagenes += gzipSync(await readFile(archivo), { level: 9 }).length;
    else if (rel === rutaPagina) grupos.html += gzipSync(await readFile(archivo), { level: 9 }).length;
  }

  /*
   * Primera carga (RNF-2.2) = lo que el navegador pide para pintar la página.
   * Se excluyen los logos, que llevan `loading="lazy"` y están bajo el pliegue,
   * y el mapa, que solo se solicita si la persona lo pide. Incluirlos infla la
   * cifra con bytes que la mayoría de las visitas nunca descarga.
   */
  grupos.primeraCarga = grupos.javascript + grupos.css + grupos.html + grupos.tipografias;
  return grupos;
}

// ---------------------------------------------------------------------------
// Auditoría con axe
// ---------------------------------------------------------------------------

const CSS_SIN_MOVIMIENTO = `
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
`;

async function auditar(page, url, tema) {
  await page.goto(url, { waitUntil: 'load' });

  /*
   * Anular las transiciones ANTES de medir es obligatorio: axe mezcla el color
   * del texto con el fondo cuando lo evalúa a media transición de opacidad, y
   * eso hunde artificialmente el ratio. En la línea base ese artefacto convirtió
   * 16 nodos reales en 67 aparentes.
   */
  await page.addStyleTag({ content: CSS_SIN_MOVIMIENTO });

  // Las imágenes diferidas fuera de pantalla no se evalúan si no se cargan.
  await page.evaluate(() => {
    for (const img of document.querySelectorAll('img')) img.loading = 'eager';
  });

  if (tema) {
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t;
      document.documentElement.classList.toggle('dark', t === 'dark');
    }, tema);
  }

  await page.waitForTimeout(600);
  await page.addScriptTag({ path: AXE });

  const resultado = await page.evaluate(async (reglas) => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: reglas } });

    const aplanar = (lista) =>
      lista.flatMap((v) =>
        v.nodes.map((n) => {
          const d = n.any?.[0]?.data ?? {};
          return {
            id: v.id,
            impacto: v.impact,
            ayuda: v.help,
            selector: String(n.target?.[0] ?? '').slice(0, 90),
            ratio: d.contrastRatio,
            requerido: d.expectedContrastRatio,
            fg: d.fgColor,
            bg: d.bgColor,
            tamano: d.fontSize,
          };
        }),
      );

    return {
      violaciones: aplanar(r.violations),
      indeterminados: aplanar(r.incomplete),
      fondo: getComputedStyle(document.body).backgroundColor,
    };
  }, REGLAS_WCAG);

  // Semántica que axe no cubre y que RNF-1 exige explícitamente.
  const semantica = await page.evaluate(() => {
    const secciones = [...document.querySelectorAll('section')];
    const encabezados = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      nivel: +h.tagName[1],
      texto: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
    }));
    const saltos = encabezados.filter(
      (h, i) => i > 0 && h.nivel - encabezados[i - 1].nivel > 1,
    ).length;
    return {
      secciones: secciones.length,
      seccionesSinNombre: secciones.filter(
        (s) => !s.getAttribute('aria-label') && !s.getAttribute('aria-labelledby'),
      ).length,
      encabezados: encabezados.length,
      saltosDeNivel: saltos,
      lang: document.documentElement.lang,
    };
  });

  return { ...resultado, semantica };
}

// ---------------------------------------------------------------------------
// Ejecución
// ---------------------------------------------------------------------------

if (!existsSync(DIST)) {
  console.error('No existe dist/. Ejecuta primero: npm run build');
  process.exit(1);
}

const paginas = (await listarArchivos(DIST))
  .filter((f) => f.endsWith('index.html'))
  .map((f) => relative(DIST, f))
  .sort();

if (!paginas.length) {
  console.error('No se encontró ninguna página en dist/.');
  process.exit(1);
}

// Chromium: en este entorno vive en una ruta fija; fuera de él lo resuelve Playwright.
const chromiumFijo = '/opt/pw-browsers/chromium';
const opcionesNavegador = { args: ['--no-sandbox'] };
if (existsSync(chromiumFijo)) opcionesNavegador.executablePath = chromiumFijo;

const { server, puerto } = await servirDist();
const navegador = await chromium.launch(opcionesNavegador);

const corridas = [];
let temaUnico = false;

try {
  for (const pagina of paginas) {
    const url = `http://127.0.0.1:${puerto}/${pagina.replace(/index\.html$/, '')}`;

    /*
     * Se prueban los dos temas. Si el fondo resulta idéntico, el sitio todavía
     * no los distingue (RF-4 pendiente): se informa y se cuenta una sola vez,
     * para no duplicar los mismos hallazgos.
     */
    const fondos = new Set();

    for (const viewport of VIEWPORTS) {
      for (const tema of ['light', 'dark']) {
        const page = await navegador.newPage({
          viewport: { width: viewport.width, height: viewport.height },
          reducedMotion: 'reduce',
        });
        const r = await auditar(page, url, tema);
        await page.close();

        fondos.add(r.fondo);
        if (fondos.size === 1 && tema === 'dark') {
          temaUnico = true;
          continue; // mismo resultado que 'light': no se duplica
        }
        corridas.push({ pagina, viewport: viewport.nombre, tema, ...r });
      }
    }
  }
} finally {
  await navegador.close();
  server.close();
}

const peso = await medirPeso(paginas[0]);

// --- Evaluación de presupuestos ---
const totalViolaciones = corridas.reduce((s, c) => s + c.violaciones.length, 0);
const totalIndeterminados = corridas.reduce((s, c) => s + c.indeterminados.length, 0);
const semantica = corridas[0].semantica;

const comprobaciones = [
  { id: 'RNF-1.1', nombre: 'Hallazgos axe WCAG 2.1 AA', valor: totalViolaciones, limite: 0 },
  { id: 'RNF-1.3', nombre: 'Nodos con contraste indeterminado', valor: totalIndeterminados, limite: 0 },
  { id: 'RNF-1.4', nombre: 'Secciones sin nombre accesible', valor: semantica.seccionesSinNombre, limite: 0 },
  { id: 'RNF-1.5', nombre: 'Saltos de nivel en encabezados', valor: semantica.saltosDeNivel, limite: 0 },
  { id: 'RNF-2.1', nombre: 'JavaScript comprimido', valor: peso.javascript, limite: PRESUPUESTOS.javascript, esPeso: true },
  { id: 'RNF-2.2', nombre: 'Primera carga comprimida', valor: peso.primeraCarga, limite: PRESUPUESTOS.primeraCarga, esPeso: true },
  { id: 'RNF-2.6', nombre: 'Tipografías', valor: peso.tipografias, limite: PRESUPUESTOS.tipografias, esPeso: true },
];

for (const c of comprobaciones) c.cumple = c.valor <= c.limite;
const todoCumple = comprobaciones.every((c) => c.cumple);

// --- Salida por consola ---
const fmt = (c) => (c.esPeso ? `${kB(c.valor)} / ${kB(c.limite)}` : `${c.valor} / ${c.limite}`);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ comprobaciones, peso, corridas, semantica }, null, 2));
} else {
  console.log(`\nVerificación — ${paginas.length} página(s), ${corridas.length} corridas`);
  if (temaUnico) {
    console.log('  Aviso: los temas claro y oscuro dan el mismo fondo. RF-4 aún no implementado.');
  }
  console.log('');
  for (const c of comprobaciones) {
    console.log(`  ${c.cumple ? '✓' : '✗'} ${c.id.padEnd(8)} ${c.nombre.padEnd(38)} ${fmt(c)}`);
  }

  /*
   * Desglose por corrida. Los totales suman todas las corridas, así que sin
   * esto un «32» resulta ambiguo frente a la línea base de 16 por viewport.
   */
  console.log('\n  Por corrida:');
  for (const c of corridas) {
    console.log(
      `    ${`${c.viewport}/${c.tema}`.padEnd(20)} ${String(c.violaciones.length).padStart(3)} hallazgos, ` +
        `${String(c.indeterminados.length).padStart(3)} indeterminados`,
    );
  }

  // Agrupar hallazgos por causa raíz: 16 nodos con 2 causas se arreglan en 2 sitios.
  const porCausa = new Map();
  for (const c of corridas) {
    for (const v of c.violaciones) {
      const clave = `${v.id}|${v.fg ?? ''}|${v.bg ?? ''}|${v.tamano ?? ''}`;
      if (!porCausa.has(clave)) porCausa.set(clave, { ...v, n: 0 });
      porCausa.get(clave).n++;
    }
  }
  if (porCausa.size) {
    console.log(`\n  Hallazgos por causa raíz (${porCausa.size} distintas):`);
    for (const v of [...porCausa.values()].sort((a, b) => (a.ratio ?? 9) - (b.ratio ?? 9))) {
      const detalle = v.ratio ? `${v.ratio}:1 (req. ${v.requerido}) ${v.fg} sobre ${v.bg}, ${v.tamano}` : v.ayuda;
      console.log(`    ${String(v.n).padStart(3)}x  ${v.id}  ${detalle}`);
    }
  }
  console.log(`\n  ${todoCumple ? 'TODOS LOS PRESUPUESTOS CUMPLIDOS' : 'PRESUPUESTOS INCUMPLIDOS'}\n`);
}

// --- Informe ---
let commit = 'desconocido';
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
} catch {}

const fecha = new Date().toISOString().slice(0, 10);
const filaComparacion = (c, base) =>
  `| ${c.id} | ${c.nombre} | ${base === undefined ? '—' : c.esPeso ? kB(base) : base} | ${fmt(c).split(' / ')[0]} | ${c.esPeso ? kB(c.limite) : c.limite} | ${c.cumple ? 'cumple' : '**incumple**'} |`;

const baseDe = {
  'RNF-1.1': LINEA_BASE.violaciones,
  'RNF-1.3': LINEA_BASE.indeterminados,
  'RNF-1.4': LINEA_BASE.seccionesSinNombre,
  'RNF-1.5': 0,
  'RNF-2.1': LINEA_BASE.javascript,
  'RNF-2.2': LINEA_BASE.primeraCarga,
  'RNF-2.6': LINEA_BASE.tipografias,
};

await writeFile(
  REPORT,
  `# Verificación

Generado por \`npm run verify\`. **No editar a mano**: se sobrescribe en cada corrida.

**Fecha:** ${fecha} · **Commit:** \`${commit}\`
**Resultado:** ${todoCumple ? 'todos los presupuestos cumplidos' : '**presupuestos incumplidos**'}

Método: axe-core sobre el build servido localmente, en ${VIEWPORTS.map((v) => `${v.width}×${v.height}`).join(' y ')},
con \`prefers-reduced-motion: reduce\` y **transiciones anuladas antes de medir**
(ver la nota metodológica de [la línea base](../baseline/auditoria-2026-07-29.md)).
Peso medido con gzip nivel 9 sobre \`dist/\` en **kB decimal (1 kB = 1000 bytes)**;
los woff2 se cuentan tal cual porque ya vienen comprimidos. La primera carga
excluye los logos, que son diferidos, y el mapa, que se pide a petición.

Nota: este script comprime con \`zlib\` de Node y la línea base usó \`gzip -9\` de
GNU. Las dos implementaciones difieren en torno al 0,3 %, así que una variación
de ese orden respecto de la línea base no indica un cambio real.

## Presupuestos

| Requisito | Comprobación | Línea base | Actual | Límite | Estado |
| --------- | ------------ | ---------- | ------ | ------ | ------ |
${comprobaciones.map((c) => filaComparacion(c, baseDe[c.id])).join('\n')}

En RNF-1.1 y RNF-1.3 la columna «Actual» **suma todas las corridas**, mientras que
la línea base se midió solo en escritorio. Para compararlas de igual a igual, ver
el desglose por corrida más abajo.

## Desglose de peso

| Recurso | Comprimido |
| ------- | ---------- |
| JavaScript | ${kB(peso.javascript)} |
| Tipografías | ${kB(peso.tipografias)} |
| HTML | ${kB(peso.html)} |
| CSS | ${kB(peso.css)} |
| Imágenes SVG | ${kB(peso.imagenes)} |
| **Primera carga** | **${kB(peso.primeraCarga)}** |

## Por corrida

Los totales de la tabla anterior suman todas las corridas. Este desglose evita
leer un total como si fuera un valor por pantalla.

| Pantalla / tema | Hallazgos | Indeterminados |
| --------------- | --------- | -------------- |
${corridas.map((c) => `| ${c.viewport} / ${c.tema} | ${c.violaciones.length} | ${c.indeterminados.length} |`).join('\n')}

## Cobertura

| Dato | Valor |
| ---- | ----- |
| Páginas auditadas | ${paginas.map((p) => `\`/${p.replace(/index\.html$/, '')}\``).join(', ')} |
| Corridas | ${corridas.length} |
| Temas distinguibles | ${temaUnico ? 'no — RF-4 pendiente' : 'sí'} |
| Secciones | ${semantica.secciones} |
| Encabezados | ${semantica.encabezados} |
| Idioma declarado | \`${semantica.lang || 'sin declarar'}\` |
${
  totalIndeterminados
    ? `
## Nodos indeterminados

axe no pudo calcular el contraste en **${totalIndeterminados}** nodos. Ocurre
cuando el texto se superpone a un fondo no uniforme. **No son aprobaciones**:
RNF-1.3 exige resolverlos, midiendo un ratio que cumpla o eliminando la
superposición.
`
    : ''
}`,
  'utf8',
);

console.log(`Informe escrito en ${relative(ROOT, REPORT)}`);
process.exit(todoCumple ? 0 : 1);
