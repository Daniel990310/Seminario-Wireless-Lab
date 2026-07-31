/**
 * Genera las imágenes para compartir, una por idioma (RNF-3.2).
 *
 * Captura con Playwright los lienzos de `dist/og/<idioma>/` y escribe
 * `public/og/<idioma>.png` a 1200×630.
 *
 * **Por qué Playwright y no `satori` + `sharp`,** que es la vía que documenta
 * Astro: Playwright ya está instalado para los verificadores, así que esto no
 * añade ninguna dependencia. Además el lienzo es una página real del proyecto,
 * con sus tipografías y sus tokens, de modo que la previsualización de un enlace
 * se parece a lo que la persona encuentra al abrirlo. Con Satori habría que
 * describir el cartel otra vez, en otro lenguaje, y mantener las dos versiones
 * sincronizadas a mano.
 *
 * Se descartó también `web-asset-generator`, que la tarea mandaba evaluar: es un
 * skill de Claude Code que exige Python y Pillow, y `AGENTS.md` establece que el
 * proyecto no debe depender de Claude Code para nada.
 *
 * **No corre en cada build a propósito.** Son activos estables que solo cambian
 * si cambia el título o la fecha; hacer que `npm run build` dependa de arrancar
 * un navegador es frágil justo donde más caro sale. Se regenera a mano con
 * `npm run og` y el resultado se versiona.
 *
 * Uso: `npm run build && npm run og`.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const DIST = join(RAIZ, 'dist');
const SALIDA = join(RAIZ, 'public', 'og');

const ANCHO = 1200;
const ALTO = 630;

if (!existsSync(DIST)) {
  console.error('No existe dist/. Corré `npm run build` antes.');
  process.exit(1);
}

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
const BASE = `http://127.0.0.1:${server.address().port}`;

await mkdir(SALIDA, { recursive: true });

const navegador = await chromium.launch(opcionesNavegador);
const generadas = [];

for (const idioma of ['es', 'en']) {
  const ctx = await navegador.newContext({
    viewport: { width: ANCHO, height: ALTO },
    // Sin escalado: el archivo debe medir exactamente 1200×630 (RNF-3.2).
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const respuesta = await page.goto(`${BASE}/og/${idioma}/`, { waitUntil: 'networkidle' });

  if (respuesta?.status() !== 200) {
    console.error(`No se pudo abrir /og/${idioma}/: HTTP ${respuesta?.status()}`);
    process.exitCode = 1;
    await ctx.close();
    continue;
  }

  // Las tipografías se cargan con `preload`, pero conviene esperarlas: capturar
  // antes deja el cartel con la fuente de reserva y métricas distintas.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const destino = join(SALIDA, `${idioma}.png`);
  await page.screenshot({ path: destino, clip: { x: 0, y: 0, width: ANCHO, height: ALTO } });
  generadas.push(`public/og/${idioma}.png`);
  await ctx.close();
}

await navegador.close();
server.close();

console.log(`\nImágenes para compartir (${ANCHO}×${ALTO}):\n`);
for (const g of generadas) console.log(`  ✓ ${g}`);
console.log('\nSe versionan: forman parte del sitio, no son un subproducto del build.\n');
