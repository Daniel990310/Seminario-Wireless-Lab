/**
 * Comprobación de RF-4 — selector de tema.
 *
 * `npm run verify` es la autoridad sobre accesibilidad y peso, pero axe no puede
 * evaluar buena parte de RF-4: si hay destello al cargar, si el sitio queda en
 * claro sin JavaScript, si el control se opera con el teclado, si la preferencia
 * persiste sin cookies o si las dos instancias del selector quedan
 * sincronizadas. Este guion cubre exactamente eso.
 *
 * Uso: `npm run build && npm run verify:tema`.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
// Chromium: en el sandbox de origen vive en una ruta fija; fuera de él lo resuelve Playwright.
const chromiumFijo = '/opt/pw-browsers/chromium';
const opcionesNavegador = { args: ['--no-sandbox'] };
if (existsSync(chromiumFijo)) opcionesNavegador.executablePath = chromiumFijo;
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  let r = new URL(req.url, 'http://x').pathname;
  if (r.endsWith('/')) r += 'index.html';
  try {
    const b = await readFile(join(DIST, r));
    res.writeHead(200, { 'content-type': TIPOS[extname(r)] ?? 'text/plain' });
    res.end(b);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const URL_BASE = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch(opcionesNavegador);
const resultados = [];
const check = (nombre, ok, detalle = '') =>
  resultados.push({ nombre, ok, detalle });

// ── 1. Tema claro por omisión, sin preferencia guardada ──────────────
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(URL_BASE);
  const t = await page.evaluate(() => ({
    tema: document.documentElement.dataset.theme,
    fondo: getComputedStyle(document.body).backgroundColor,
    esquema: getComputedStyle(document.documentElement).colorScheme,
  }));
  check('RF-4.1 · claro por omisión', t.tema === 'light', `data-theme=${t.tema}, fondo ${t.fondo}`);
  check('RF-4.8 · color-scheme declarado', t.esquema === 'light', `color-scheme: ${t.esquema}`);
  await ctx.close();
}

// ── 2. Sin JavaScript queda en claro y sigue funcionando ─────────────
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL_BASE);
  const fondo = await page
    .locator('body')
    .evaluate((b) => getComputedStyle(b).backgroundColor)
    .catch(() => 'sin evaluar');
  const secciones = await page.locator('section').count();
  const enlaces = await page.locator('a[href^="#"]').count();
  check(
    'RF-4.4 · sin JS queda en claro',
    fondo === 'rgb(248, 250, 252)',
    `fondo ${fondo}`,
  );
  check('RF-4.4 · contenido presente sin JS', secciones >= 6 && enlaces > 0, `${secciones} secciones, ${enlaces} anclas`);
  await ctx.close();
}

// ── 3. Sin destello: el tema oscuro guardado se aplica antes de pintar ──
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('tema-seminario', 'dark'));

  /*
   * Se registra el tema en el primer instante en que hay estilos aplicados.
   * Si el script en línea no corriera antes del pintado, aquí se leería 'light'
   * y después cambiaría: eso es el destello que RF-4.2 prohíbe.
   */
  await page.goto(URL_BASE, { waitUntil: 'commit' });
  const temprano = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.waitForLoadState('load');
  const tarde = await page.evaluate(() => ({
    tema: document.documentElement.dataset.theme,
    fondo: getComputedStyle(document.body).backgroundColor,
  }));
  check(
    'RF-4.2 · sin destello al cargar',
    temprano === 'dark' && tarde.tema === 'dark',
    `al hacer commit=${temprano}, tras cargar=${tarde.tema}, fondo ${tarde.fondo}`,
  );
  await ctx.close();
}

// ── 4. Persistencia y operación por teclado ──────────────────────────
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(URL_BASE);

  /*
   * El ámbito de un grupo de radios es el documento, no el `fieldset`. Si dos
   * instancias del selector comparten `name`, forman UN grupo y solo una de las
   * seis opciones puede quedar marcada: al inicializar la segunda se desmarca la
   * primera. Eso ocurrió, y la barra de escritorio quedaba sin opción resaltada.
   * De aquí en adelante se comprueba instancia por instancia.
   */
  const estado = await page.evaluate(() =>
    [...document.querySelectorAll('[data-theme-selector]')].map((g) => {
      const radios = [...g.querySelectorAll('input[type="radio"]')];
      return {
        nombre: radios[0]?.name,
        opciones: radios.length,
        marcado: radios.find((r) => r.checked)?.value ?? null,
        // Resaltado real: el fondo que pinta `has-checked:bg-primary`.
        resaltados: [...g.querySelectorAll('label')].filter(
          (l) => getComputedStyle(l).backgroundColor !== 'rgba(0, 0, 0, 0)',
        ).length,
      };
    }),
  );

  const nombres = new Set(estado.map((g) => g.nombre));
  check(
    'RF-4.1 · un grupo de radios por instancia',
    estado.length > 0 && nombres.size === estado.length,
    `${estado.length} selectores, nombres: ${[...nombres].join(', ')}`,
  );
  check(
    'RF-4.1 · tres estados en cada instancia',
    estado.every((g) => g.opciones === 3),
    estado.map((g) => `${g.nombre}:${g.opciones}`).join(' '),
  );
  check(
    'RF-4.6 · todas las instancias reflejan el tema',
    estado.every((g) => g.marcado === 'light' && g.resaltados === 1),
    estado.map((g) => `${g.nombre}=${g.marcado}/${g.resaltados} resaltado`).join(' '),
  );

  // Enfocar el primer radio de la barra y recorrer con flechas, sin ratón.
  const barra = page.locator('[data-theme-selector]').first();
  const radios = barra.locator('input[type="radio"]');
  await radios.first().focus();
  const enfocadoInicial = await page.evaluate(() => document.activeElement?.getAttribute('value'));
  await page.keyboard.press('ArrowRight');
  const trasFlecha = await page.evaluate(() => ({
    activo: document.activeElement?.getAttribute('value'),
    tema: document.documentElement.dataset.theme,
  }));
  check(
    'RF-4.5 · recorrido con flechas',
    enfocadoInicial === 'light' && trasFlecha.activo === 'dark' && trasFlecha.tema === 'dark',
    `foco ${enfocadoInicial} → ${trasFlecha.activo}, tema ${trasFlecha.tema}`,
  );

  // Cambiar en una instancia debe reflejarse en la otra.
  const sincronizado = await page.evaluate(() =>
    [...document.querySelectorAll('[data-theme-selector]')].map(
      (g) => [...g.querySelectorAll('input[type="radio"]')].find((r) => r.checked)?.value ?? null,
    ),
  );
  check(
    'RF-4.6 · las instancias quedan sincronizadas',
    sincronizado.every((v) => v === 'dark'),
    sincronizado.join(', '),
  );

  const guardado = await page.evaluate(() => localStorage.getItem('tema-seminario'));
  check('RF-4.3 · preferencia persistida', guardado === 'dark', `localStorage=${guardado}`);

  const cookies = await ctx.cookies();
  check('RF-4.3 · sin cookies', cookies.length === 0, `${cookies.length} cookies`);

  // Al recargar debe mantenerse el oscuro y TODOS los controles reflejarlo.
  await page.reload();
  const tras = await page.evaluate(() => ({
    tema: document.documentElement.dataset.theme,
    marcados: [...document.querySelectorAll('[data-theme-selector]')].map(
      (g) => [...g.querySelectorAll('input[type="radio"]')].find((r) => r.checked)?.value ?? null,
    ),
  }));
  check(
    'RF-4.3 · sobrevive a la recarga',
    tras.tema === 'dark' && tras.marcados.every((v) => v === 'dark'),
    `tema ${tras.tema}, marcados ${tras.marcados.join(', ')}`,
  );
  await ctx.close();
}

// ── 4b. El selector del menú móvil cabe dentro del panel ─────────────
{
  /*
   * El panel del menú lleva `overflow-hidden`, así que un selector más ancho que
   * el panel no desborda: se recorta en silencio. Ocurrió con el rótulo y el
   * control en la misma fila, y «Sistema» quedaba cortado. Se mide la caja de
   * cada opción contra la del ancestro que recorta.
   */
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(URL_BASE);
  await page.locator('[data-mobile-menu] > summary').click();
  await page.waitForTimeout(350);

  const desbordes = await page.evaluate(() => {
    const recortador = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p);
        if (o.overflowX !== 'visible' || o.overflowY !== 'visible') return p;
      }
      return document.documentElement;
    };
    const malos = [];
    for (const grupo of document.querySelectorAll('[data-theme-selector]')) {
      if (!grupo.getClientRects().length) continue; // instancia oculta
      const caja = recortador(grupo).getBoundingClientRect();
      for (const label of grupo.querySelectorAll('label')) {
        const r = label.getBoundingClientRect();
        // Medio píxel de tolerancia por el redondeo del trazado.
        if (r.right > caja.right + 0.5 || r.left < caja.left - 0.5) {
          malos.push(`${label.textContent.trim()} (${r.right.toFixed(0)} > ${caja.right.toFixed(0)})`);
        }
      }
    }
    return malos;
  });
  check(
    'RF-4.7 · el selector cabe en el menú móvil',
    desbordes.length === 0,
    desbordes.length ? `recortados: ${desbordes.join(', ')}` : 'ninguna opción recortada',
  );
  await ctx.close();
}

// ── 5. «Según el sistema» sigue la preferencia del sistema operativo ──
{
  for (const esquema of ['dark', 'light']) {
    const ctx = await browser.newContext({ colorScheme: esquema });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('tema-seminario', 'system'));
    await page.goto(URL_BASE);
    const t = await page.evaluate(() => document.documentElement.dataset.theme);
    check(`RF-4.1 · «sistema» con SO en ${esquema}`, t === esquema, `resolvió a ${t}`);
    await ctx.close();
  }
}

// ── 6. La figura funciona en ambos temas sin duplicarse ──────────────
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(URL_BASE);
  const figuras = await page.locator('.propagation-figure').count();
  const trazos = await page.evaluate(() => {
    const svg = document.querySelector('.propagation-figure');
    if (!svg) return null;
    const leer = (t) => getComputedStyle(document.documentElement).getPropertyValue(t).trim();
    document.documentElement.dataset.theme = 'light';
    const claro = leer('--primary');
    document.documentElement.dataset.theme = 'dark';
    const oscuro = leer('--primary');
    return { claro, oscuro };
  });
  check(
    'RF-4.9 · figura única en ambos temas',
    figuras === 1 && trazos && trazos.claro !== trazos.oscuro,
    `${figuras} SVG; primary ${trazos?.claro} → ${trazos?.oscuro}`,
  );
  await ctx.close();
}

await browser.close();
server.close();

console.log('\nComprobación de RF-4\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(42)} ${r.detalle}`);
}
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
