/**
 * Comprobación de RF-6 — componentes interactivos.
 *
 * De las cinco interacciones de RF-6, hoy solo una está implementada, y no por
 * decisión técnica sino porque **el contenido de las otras no existe**:
 *
 * | Interacción              | Estado                                              |
 * | ------------------------ | --------------------------------------------------- |
 * | Programa en pestañas     | Bloqueada: `program.days` está vacío                 |
 * | Resumen desplegable      | Bloqueada: no hay sesiones ni resúmenes              |
 * | Ficha de expositor       | Bloqueada: los datos no traen reseña ni línea de inv.|
 * | Selector de tema         | Resuelta sin Radix: radios nativos, 0 kB (RF-4)      |
 * | Sección activa           | **Implementada aquí**                                |
 *
 * RF-6.4 prohíbe instalar una primitiva sin un componente que la use, así que
 * montar `Tabs` sobre un array vacío incumpliría el propio requisito. Este guion
 * crecerá cuando lleguen los datos.
 *
 * Uso: `npm run build && npm run verify:interaccion`.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const chromiumFijo = '/opt/pw-browsers/chromium';
const opcionesNavegador = { args: ['--no-sandbox'] };
if (existsSync(chromiumFijo)) opcionesNavegador.executablePath = chromiumFijo;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
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
const BASE = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch(opcionesNavegador);
const resultados = [];
const check = (nombre, ok, detalle = '') => resultados.push({ nombre, ok, detalle });

// ---------------------------------------------------------------------------
// RF-6.2 · El contenido sigue accesible sin JavaScript
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  const sinJs = await page.evaluate(() => ({
    secciones: document.querySelectorAll('main section, section#top').length,
    enlacesNav: document.querySelectorAll('a[data-nav]').length,
    textoVisible: document.body.innerText.replace(/\s+/g, ' ').trim().length,
  }));

  check(
    'RF-6.2 · las secciones existen sin JavaScript',
    sinJs.secciones >= 7,
    `${sinJs.secciones} secciones`,
  );
  check(
    'RF-6.2 · la navegación funciona sin JavaScript',
    sinJs.enlacesNav > 0,
    `${sinJs.enlacesNav} enlaces con destino`,
  );
  check(
    'RF-6.2 · el contenido está en el HTML, no al hidratar',
    sinJs.textoVisible > 2000,
    `${sinJs.textoVisible} caracteres de texto`,
  );
  await ctx.close();
}

// ---------------------------------------------------------------------------
// RF-6 · Sección activa en la navegación
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });

  const activo = async () =>
    page.evaluate(
      () => document.querySelector('a[data-nav][aria-current]')?.getAttribute('data-nav') ?? null,
    );

  /*
   * Se cuentan SECCIONES distintas marcadas, no enlaces: la barra y el menú
   * móvil son dos instancias de la misma navegación y las dos deben reflejar la
   * sección activa, igual que las dos instancias del selector de tema.
   */
  const seccionesMarcadas = async () =>
    page.evaluate(
      () =>
        new Set(
          [...document.querySelectorAll('a[data-nav][aria-current]')].map((a) => a.dataset.nav),
        ).size,
    );

  // Recorre varias secciones y comprueba que el resaltado las sigue.
  const aciertos = [];
  for (const id of ['seminario', 'expositores', 'sede', 'organizacion']) {
    await page.evaluate((s) => document.getElementById(s)?.scrollIntoView(), id);
    await page.waitForTimeout(350);
    const marcado = await activo();
    aciertos.push({ id, marcado, ok: marcado === id });
  }

  const fallidos = aciertos.filter((a) => !a.ok);
  check(
    'RF-6 · el resaltado sigue a la sección visible',
    fallidos.length === 0,
    fallidos.length
      ? fallidos.map((f) => `${f.id}→${f.marcado ?? 'ninguna'}`).join(', ')
      : `${aciertos.length} secciones seguidas`,
  );

  const marcadas = await seccionesMarcadas();
  check('RF-6 · nunca hay dos secciones marcadas a la vez', marcadas <= 1, `${marcadas} sección(es)`);

  // Las dos instancias de la navegación deben coincidir, como en RF-4.6.
  const coinciden = await page.evaluate(() => {
    const marcados = [...document.querySelectorAll('a[data-nav][aria-current]')];
    return marcados.length >= 2 && new Set(marcados.map((a) => a.dataset.nav)).size === 1;
  });
  check(
    'RF-6 · barra y menú móvil marcan la misma sección',
    coinciden,
    coinciden ? 'sincronizados' : 'difieren o falta uno',
  );

  /*
   * RF-6.1 dice que el estado se comunique de forma programática, no solo por
   * color: se comprueba el atributo, no la clase de color.
   */
  const valor = await page.evaluate(
    () => document.querySelector('a[data-nav][aria-current]')?.getAttribute('aria-current') ?? null,
  );
  check(
    'RF-6.1 · el estado se expone con aria-current="location"',
    valor === 'location',
    `aria-current="${valor}"`,
  );

  await ctx.close();
}

// ---------------------------------------------------------------------------
// RF-6.4 · Ninguna primitiva instalada sin componente que la use
// ---------------------------------------------------------------------------
{
  const paquete = JSON.parse(
    await readFile(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'),
  );
  const radix = Object.keys({ ...paquete.dependencies, ...paquete.devDependencies }).filter((d) =>
    d.startsWith('@radix-ui/'),
  );
  check(
    'RF-6.4 · ninguna primitiva de Radix sin usar',
    radix.length === 0,
    radix.length ? `instaladas sin uso: ${radix.join(', ')}` : 'ninguna instalada',
  );
}

await browser.close();
server.close();

console.log('\nComprobación de RF-6 — componentes interactivos\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(52)} ${r.detalle}`);
}
console.log(
  '\n  Nota: 3 de las 5 interacciones de RF-6 están bloqueadas por falta de\n' +
    '  contenido (programa vacío, expositores sin reseña). Ver `ESTADO.md` §5h.',
);
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
