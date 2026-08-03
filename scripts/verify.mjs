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
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

/*
 * `new URL('..', import.meta.url).pathname` se rompe en Windows: da
 * `/C:/Users/...`, con una barra inicial que `readdir`/`readFile` no resuelven.
 * `fileURLToPath` sí normaliza por plataforma. Medido en este mismo proyecto: sin
 * esto, `npm run verify` fallaba con «No existe dist/» en Windows aunque `dist/`
 * existiera.
 */
const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const DIST = join(ROOT, 'dist');

/*
 * Toda ruta que se vaya a comparar con una URL o con lo que dice el HTML pasa por
 * aquí. `relative()` devuelve el separador del sistema, así que en Windows da
 * `_astro\hoja.css` mientras el HTML referencia `_astro/hoja.css`: la comparación
 * nunca coincide.
 *
 * No es teórico y costó una cifra falsa. Sin esta conversión, **todo `.js` o `.css`
 * dentro de una subcarpeta se clasificaba como huérfano** y se descontaba del peso:
 * la hoja de estilos del sitio, 11,8 kB comprimidos que el navegador sí descarga
 * porque el `<head>` la enlaza, salía del presupuesto de primera carga y el desglose
 * informaba «CSS 0,0 kB». Una sesión anterior llegó a explicar ese 0,0 diciendo que
 * el CSS iba en línea dentro del HTML; no iba, había un `<link rel="stylesheet">`.
 * Es el mismo error de plataforma que el de `import.meta.url` de arriba.
 */
const rutaWeb = (p) => p.replace(/\\/g, '/');
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

/*
 * Presupuestos de RNF-2. Cambiarlos exige cambiar primero requirements.md.
 *
 * Actualizados con D6, que adopta shadcn/ui sobre Radix. Los valores anteriores
 * —40 kB y 180 kB— los había propuesto quien implementaba, no el cliente. Los
 * actuales se derivan de una medición: React con react-dom cuesta 60,0 kB y cinco
 * primitivas de Radix suman 36,2 kB.
 */
const PRESUPUESTOS = {
  javascript: 115_000,
  primeraCarga: 260_000,
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
  const grupos = {
    javascript: 0,
    javascriptEnLinea: 0,
    css: 0,
    html: 0,
    tipografias: 0,
    imagenes: 0,
    javascriptHuerfano: 0,
    cssHuerfano: 0,
    huerfanos: [],
  };

  /*
   * Solo cuenta como peso lo que la página REFERENCIA.
   *
   * `@astrojs/react` emite su runtime de cliente aunque no quede ninguna isla
   * que hidratar. Tras T3 no queda ninguna, así que `client.*.js` se genera pero
   * ningún archivo de `dist` lo menciona: son ~55 kB comprimidos que ningún
   * navegador pide jamás. Sumarlos al presupuesto es el mismo error que contar
   * los logos diferidos, y castigaría precisamente el cambio que eliminó el
   * JavaScript. Los huérfanos se miden y se informan aparte, no se ignoran: si
   * algún día uno debería estar referenciado y no lo está, hay que verlo.
   */
  const html = await readFile(join(DIST, rutaPagina), 'utf8');
  const referenciados = new Set(
    [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((m) =>
      m[1].replace(/^\//, ''),
    ),
  );

  for (const archivo of archivos) {
    const ext = extname(archivo);
    const rel = rutaWeb(relative(DIST, archivo));
    const tam = (await stat(archivo)).size;
    const comprimido = async () => gzipSync(await readFile(archivo), { level: 9 }).length;

    if (ext === '.woff2') grupos.tipografias += tam;
    else if (ext === '.js' || ext === '.css') {
      const bytes = await comprimido();
      const usado = referenciados.has(rel);
      if (usado) grupos[ext === '.js' ? 'javascript' : 'css'] += bytes;
      else {
        grupos[ext === '.js' ? 'javascriptHuerfano' : 'cssHuerfano'] += bytes;
        grupos.huerfanos.push(`${rel} (${bytes} B)`);
      }
    } else if (ext === '.svg') grupos.imagenes += await comprimido();
    else if (rel === rutaPagina) grupos.html += await comprimido();
  }

  /*
   * JavaScript EN LÍNEA. Astro 5 renderiza cada `<script>` tal como se declara:
   * no los agrupa ni los saca a un archivo, así que acaban dentro del HTML y
   * ningún `.js` los representa. Antes de medirlos, RNF-2.1 informaba «0,0 kB de
   * JavaScript» en una página que sí ejecuta JavaScript —menú móvil, selector de
   * tema, carga diferida del mapa—, y esa lectura era engañosa aunque la cifra
   * de archivos fuera correcta.
   *
   * Se mide por diferencia de gzip, con y sin esos bloques, en vez de comprimir
   * los fragmentos por separado: dentro del HTML comparten diccionario con el
   * resto del documento, y comprimirlos aislados sobrestima su costo real.
   *
   * `application/ld+json` queda fuera a propósito: son metadatos, no código.
   */
  const bloquesEnLinea = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g;
  const htmlSinEnLinea = html.replace(bloquesEnLinea, '');
  const gz = (texto) => gzipSync(Buffer.from(texto, 'utf8'), { level: 9 }).length;
  grupos.javascriptEnLinea = Math.max(0, gz(html) - gz(htmlSinEnLinea));

  /*
   * Primera carga (RNF-2.2) = lo que el navegador pide para pintar la página.
   * Se excluyen los logos, que llevan `loading="lazy"` y están bajo el pliegue,
   * y el mapa, que solo se solicita si la persona lo pide. Incluirlos infla la
   * cifra con bytes que la mayoría de las visitas nunca descarga.
   *
   * `javascriptEnLinea` NO se suma aquí: ya está contado dentro de `html`.
   * Sumarlo sería contabilizarlo dos veces.
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

/*
 * Se auditan las páginas del sitio, no los lienzos de `/og/`: esos son el
 * origen de las imágenes para compartir, miden 1200×630 fijos, nadie los visita
 * y no llevan navegación. Incluirlos ensuciaría las cifras de accesibilidad con
 * un documento que no es una página.
 */
const paginas = (await listarArchivos(DIST))
  .filter((f) => f.endsWith('index.html'))
  .filter((f) => !rutaWeb(f).includes('og/'))
  .map((f) => rutaWeb(relative(DIST, f)))
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

/*
 * El peso se mide en TODAS las páginas y el presupuesto se juzga contra la más
 * pesada, no contra la primera de la lista.
 *
 * Antes se medía `paginas[0]`, que tras ordenar alfabéticamente es `/en/`: el
 * informe daba la cifra de la versión en inglés sin decirlo, y RNF-2.1 habla de
 * peso «por idioma». Con dos idiomas de largo distinto, informar uno y llamarlo
 * el peso del sitio es una ambigüedad del mismo tipo que sumar corridas y
 * compararlas con una línea base de una sola pantalla.
 */
const pesos = [];
for (const p of paginas) pesos.push({ pagina: p, ...(await medirPeso(p)) });
const peso = pesos.reduce((a, b) => (b.primeraCarga > a.primeraCarga ? b : a));

// --- Evaluación de presupuestos ---
const totalViolaciones = corridas.reduce((s, c) => s + c.violaciones.length, 0);
const totalIndeterminados = corridas.reduce((s, c) => s + c.indeterminados.length, 0);
const semantica = corridas[0].semantica;

const comprobaciones = [
  { id: 'RNF-1.1', nombre: 'Hallazgos axe WCAG 2.1 AA', valor: totalViolaciones, limite: 0 },
  { id: 'RNF-1.3', nombre: 'Nodos con contraste indeterminado', valor: totalIndeterminados, limite: 0 },
  { id: 'RNF-1.4', nombre: 'Secciones sin nombre accesible', valor: semantica.seccionesSinNombre, limite: 0 },
  { id: 'RNF-1.5', nombre: 'Saltos de nivel en encabezados', valor: semantica.saltosDeNivel, limite: 0 },
  // Archivos + scripts en línea. Medir solo los archivos daba «0,0 kB» en una
  // página que sí ejecuta JavaScript. Ver `medirPeso`.
  { id: 'RNF-2.1', nombre: 'JavaScript comprimido', valor: peso.javascript + peso.javascriptEnLinea, limite: PRESUPUESTOS.javascript, esPeso: true },
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
      `    ${`/${c.pagina.replace(/index\.html$/, '')} ${c.viewport}/${c.tema}`.padEnd(28)} ${String(c.violaciones.length).padStart(3)} hallazgos, ` +
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
| JavaScript en archivos \`.js\` | ${kB(peso.javascript)} |
| JavaScript en línea, dentro del HTML | ${kB(peso.javascriptEnLinea)} |
| JavaScript total (RNF-2.1) | ${kB(peso.javascript + peso.javascriptEnLinea)} |
| Tipografías | ${kB(peso.tipografias)} |
| HTML (incluye los scripts en línea) | ${kB(peso.html)} |
| CSS en hojas enlazadas | ${kB(peso.css)} |
| Imágenes SVG | ${kB(peso.imagenes)} |
| **Primera carga** | **${kB(peso.primeraCarga)}** |

${
  pesos.every((p) => p.primeraCarga === peso.primeraCarga)
    ? `Las ${pesos.length} páginas auditadas pesan lo mismo. El presupuesto se juzga contra la más pesada; hoy no hay diferencia entre idiomas.`
    : `Medido sobre \`/${peso.pagina.replace(/index\.html$/, '')}\`, la **más pesada** de las auditadas, que es contra la que se juzga el presupuesto.`
}

Primera carga por página:

| Página | Primera carga |
| ------ | ------------- |
${pesos.map((p) => `| \`/${p.pagina.replace(/index\.html$/, '')}\` | ${kB(p.primeraCarga)} |`).join('\n')}

Solo se cuenta lo que la página referencia. Archivos generados que **ningún archivo
de \`dist\` menciona**, y que por tanto ningún navegador descarga:

${
  peso.huerfanos.length
    ? `| Archivo huérfano | Comprimido |\n| ---------------- | ---------- |\n${peso.huerfanos
        .map((h) => `| \`${h.split(' (')[0]}\` | ${h.match(/\((\d+) B\)/)?.[1] ?? '?'} B |`)
        .join('\n')}\n\nTotal huérfano: ${kB(peso.javascriptHuerfano + peso.cssHuerfano)}.`
    : 'Ninguno.'
}

## Por corrida

Los totales de la tabla anterior suman todas las corridas. Este desglose evita
leer un total como si fuera un valor por pantalla.

| Página | Pantalla / tema | Hallazgos | Indeterminados |
| ------ | --------------- | --------- | -------------- |
${corridas.map((c) => `| \`/${c.pagina.replace(/index\.html$/, '')}\` | ${c.viewport} / ${c.tema} | ${c.violaciones.length} | ${c.indeterminados.length} |`).join('\n')}

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
