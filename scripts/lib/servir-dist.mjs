/**
 * Sirve `dist/` en un puerto libre y abre Chromium, para los scripts que capturan
 * lienzos del sitio: `generar-og.mjs` y `generar-flyer.mjs`.
 *
 * Exige `npm run build` antes: lo que se captura es el sitio compilado, con sus
 * tipografías y sus tokens, no una plantilla aparte.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\\/]$/, '');
const DIST = join(RAIZ, 'dist');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.png': 'image/png',
};

export async function abrirDist() {
  if (!existsSync(DIST)) {
    console.error('No existe dist/. Corré `npm run build` antes.');
    process.exit(1);
  }

  const server = createServer(async (req, res) => {
    let r = decodeURIComponent(new URL(req.url, 'http://x').pathname);
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

  const chromiumFijo = '/opt/pw-browsers/chromium';
  const opciones = { args: ['--no-sandbox'] };
  if (existsSync(chromiumFijo)) opciones.executablePath = chromiumFijo;
  const navegador = await chromium.launch(opciones);

  return {
    base: `http://127.0.0.1:${server.address().port}`,
    navegador,
    async cerrar() {
      await navegador.close();
      server.close();
    },
  };
}
