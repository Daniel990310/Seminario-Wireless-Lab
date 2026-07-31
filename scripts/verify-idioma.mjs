/**
 * Comprobación de RF-1 — sitio bilingüe.
 *
 * `npm run verify` audita las dos páginas por separado, pero no sabe que son la
 * misma página en dos idiomas: no comprueba que se enlacen entre sí, que el
 * título oficial no se traduzca ni que cambiar de idioma conserve la sección.
 * Eso es lo que cubre este guion.
 *
 * Incluye además una comprobación que no está en RF-1 y que hace falta igual:
 * detectar **traducciones olvidadas**. La interfaz de `tipos.ts` obliga a que
 * ninguna clave falte, pero no puede saber si el inglés quedó con el texto en
 * español copiado tal cual. Eso solo se ve comparando las dos páginas ya
 * generadas.
 *
 * Uso: `npm run build && npm run verify:idioma`.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const DIST = join(RAIZ, 'dist');
const chromiumFijo = '/opt/pw-browsers/chromium';
const opcionesNavegador = { args: ['--no-sandbox'] };
if (existsSync(chromiumFijo)) opcionesNavegador.executablePath = chromiumFijo;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

const server = createServer(async (req, res) => {
  let r = new URL(req.url, 'http://x').pathname;
  if (r.endsWith('/')) r += 'index.html';
  try {
    const b = await readFile(join(DIST, r));
    res.writeHead(200, { 'content-type': TIPOS[extname(r)] ?? 'text/plain' });
    res.end(b);
  } catch {
    res.writeHead(404).end('no encontrado');
  }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch(opcionesNavegador);
const resultados = [];
const check = (nombre, ok, detalle = '') => resultados.push({ nombre, ok, detalle });

/** Título oficial: debe aparecer idéntico en los dos idiomas (RF-1.2). */
const TITULO_OFICIAL = 'Beyond Connectivity: Wireless Sensing in mmWave and Sub-THz Bands';

/*
 * Textos que LEGÍTIMAMENTE coinciden en ambos idiomas, y por qué. Todo lo que
 * coincida y no encaje aquí se reporta como posible traducción olvidada.
 *
 * Mantener esta lista corta y justificada: si crece sin control deja de
 * detectar nada. Cada entrada debería poder explicarse en una frase.
 */
const COINCIDENCIA_LEGITIMA = [
  /^Beyond Connectivity/, // Título oficial (RF-1.2)
  /^International Seminar on Wireless/, // Subtítulo, parte del título oficial
  // Nombres institucionales, incluidas sus formas abreviadas de uso corriente.
  /Universidad|University|Nokia Bell Labs|Columbia|PUCV|PUC de Chile|U\. de Santiago|USACH|ANID|Agencia Nacional/,
  /Gil Zussman|Jinfeng Du|Reinaldo|Rodolfo Feick|Miguel Gutiérrez|Karel Toledo/, // Nombres de personas
  /@pucv\.cl/, // Correo
  /FOVI\d+/, // Código de proyecto
  /^Chile$/, // Se escribe igual en ambos idiomas
  /^Antonio Bellet|Providencia|Santiago/, // Dirección postal
  /^\d/, // Fechas y cifras: «21–22 OCT 2026», «2026»
  /^Español$|^English$/, // El selector de idioma es igual en ambas versiones, a propósito
  /mmWave|sub-THz|ISAC|6G/, // Términos técnicos que no se traducen
  /^©/, // Línea de copyright, compuesta de nombres institucionales
];

const esLegitima = (texto) => COINCIDENCIA_LEGITIMA.some((r) => r.test(texto));

// ---------------------------------------------------------------------------
// 1. Ambas rutas responden y declaran su idioma
// ---------------------------------------------------------------------------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

const paginas = {};
for (const [idioma, ruta] of Object.entries({ es: '/', en: '/en/' })) {
  const page = await ctx.newPage();
  const respuesta = await page.goto(BASE + ruta, { waitUntil: 'networkidle' });
  paginas[idioma] = page;

  check(
    `RF-1.1 · la ruta ${ruta} responde`,
    respuesta?.status() === 200,
    `HTTP ${respuesta?.status()}`,
  );

  const declarado = await page.evaluate(() => document.documentElement.lang);
  check(`RF-1.3 · ${ruta} declara lang="${idioma}"`, declarado === idioma, `lang="${declarado}"`);
}

// ---------------------------------------------------------------------------
// 2. Título oficial sin traducir, y hreflang recíproco
// ---------------------------------------------------------------------------
for (const [idioma, page] of Object.entries(paginas)) {
  const h1 = (await page.locator('h1').first().textContent())?.trim();
  check(
    `RF-1.2 · el título oficial no se traduce (${idioma})`,
    h1 === TITULO_OFICIAL,
    h1 === TITULO_OFICIAL ? 'idéntico' : `dice «${h1?.slice(0, 40)}…»`,
  );

  const alternativas = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => ({
      hreflang: l.getAttribute('hreflang'),
      href: l.getAttribute('href'),
    })),
  );
  const tiene = (h) => alternativas.some((a) => a.hreflang === h);
  check(
    `RF-1.4 · hreflang recíproco y x-default (${idioma})`,
    tiene('es') && tiene('en') && tiene('x-default'),
    alternativas.map((a) => a.hreflang).join(', ') || 'ninguno',
  );
}

// ---------------------------------------------------------------------------
// 3. Selector de idioma: teclado y estado programático (RF-1.5)
// ---------------------------------------------------------------------------
for (const [idioma, page] of Object.entries(paginas)) {
  const esperado = idioma === 'es' ? 'en' : 'es';

  /*
   * RF-1.5, enmendada el 2026-07-31: con dos idiomas el control es uno solo y
   * muestra el idioma de destino, siguiendo el patrón «Two languages» del
   * U.S. Web Design System. El idioma actual no se marca en el control porque
   * lo declara `<html lang>`, que ya se comprueba en RF-1.3.
   */
  const control = await page.evaluate(() => {
    const a = document.querySelector('a[data-cambio-idioma]');
    if (!a) return null;
    return {
      href: a.getAttribute('href'),
      lang: a.getAttribute('lang'),
      xmlLang: a.getAttribute('xml:lang'),
      hreflang: a.getAttribute('hreflang'),
      texto: a.textContent?.trim(),
    };
  });

  check(
    `RF-1.5 · un solo control, hacia el otro idioma (${idioma})`,
    !!control && control.lang === esperado && control.hreflang === esperado,
    control ? `«${control.texto}» → ${control.href}` : 'no existe',
  );

  check(
    `RF-1.5 · el control declara lang y xml:lang (${idioma})`,
    control?.lang === esperado && control?.xmlLang === esperado,
    `lang="${control?.lang}" xml:lang="${control?.xmlLang}"`,
  );

  // Alcanzable por teclado: debe aparecer en el recorrido de tabulación.
  await page.evaluate(() => document.body.focus());
  let alcanzado = false;
  for (let i = 0; i < 25 && !alcanzado; i++) {
    await page.keyboard.press('Tab');
    alcanzado = await page.evaluate(
      () => !!document.activeElement?.closest('a[data-cambio-idioma]'),
    );
  }
  check(
    `RF-1.5 · el control se alcanza con el teclado (${idioma})`,
    alcanzado,
    alcanzado ? 'sí' : 'no',
  );
}

// ---------------------------------------------------------------------------
// 4. Cambiar de idioma conserva la sección (RF-1.6)
// ---------------------------------------------------------------------------
{
  const page = await ctx.newPage();
  await page.goto(`${BASE}/#programa`, { waitUntil: 'networkidle' });
  await page.click('a[data-cambio-idioma]');
  await page.waitForLoadState('networkidle');
  const destino = new URL(page.url());
  check(
    'RF-1.6 · cambiar de idioma conserva la sección',
    destino.pathname === '/en/' && destino.hash === '#programa',
    `${destino.pathname}${destino.hash}`,
  );
  await page.close();
}

// ---------------------------------------------------------------------------
// 5. Sitemap con ambas versiones (RF-1.8)
// ---------------------------------------------------------------------------
{
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sitemap-0.xml`);
  const xml = await page.content();

  /*
   * El host no se da por sabido: se lee del propio sitemap. Antes estaba escrito
   * `seminario-wireless.pucv.cl` a mano, y el criterio falló en cuanto el sitio
   * se construyó con la URL real del despliegue, que es lo normal. Un
   * verificador que solo pasa en un dominio no verifica el sitio, verifica el
   * dominio.
   */
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));
  const tieneEs = locs.some((u) => u.pathname === '/');
  const tieneEn = locs.some((u) => u.pathname === '/en/');
  check(
    'RF-1.8 · el sitemap incluye ambas versiones',
    tieneEs && tieneEn,
    `es: ${tieneEs ? 'sí' : 'no'} · en: ${tieneEn ? 'sí' : 'no'}`,
  );
  await page.close();
}

// ---------------------------------------------------------------------------
// 6. Traducciones olvidadas: mismo texto en ambos idiomas sin justificación
// ---------------------------------------------------------------------------
{
  const extraer = (page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,button,summary,figcaption,legend,span')]
        .filter((el) => !el.querySelector('h1,h2,h3,h4,p,li,dt,dd,button,summary,span'))
        // Sin filtrar por longitud: filtrar aquí desalinearía la comparación
        // por posición, porque un rótulo corto en un idioma puede ser largo en
        // el otro («Red» → «Network»). El filtro se aplica al reportar.
        .map((el) => el.textContent?.replace(/\s+/g, ' ').trim() ?? ''),
    );

  const [textosEs, textosEn] = await Promise.all([extraer(paginas.es), extraer(paginas.en)]);

  // Se comparan por posición: el marcado es el mismo componente en ambos
  // idiomas, así que el elemento n.º i de una página es el n.º i de la otra.
  const sospechosos = [];
  const total = Math.min(textosEs.length, textosEn.length);
  for (let i = 0; i < total; i++) {
    if (textosEs[i].length <= 3) continue; // «·», cifras sueltas: no son frases
    if (textosEs[i] === textosEn[i] && !esLegitima(textosEs[i])) {
      sospechosos.push(textosEs[i].slice(0, 48));
    }
  }

  check(
    'T7 · ningún texto quedó sin traducir',
    sospechosos.length === 0,
    sospechosos.length
      ? `${sospechosos.length}: ${[...new Set(sospechosos)].slice(0, 3).join(' | ')}`
      : `${total} textos comparados, todos distintos o justificados`,
  );

  check(
    'T7 · ambas versiones tienen la misma estructura',
    textosEs.length === textosEn.length,
    `${textosEs.length} vs ${textosEn.length} bloques de texto`,
  );
}

// ---------------------------------------------------------------------------
// 7. Cero cadenas escritas en los componentes (RF-1.7)
// ---------------------------------------------------------------------------
{
  const listar = async (dir) => {
    const salida = [];
    for (const entrada of await readdir(dir, { withFileTypes: true })) {
      const ruta = join(dir, entrada.name);
      if (entrada.isDirectory()) salida.push(...(await listar(ruta)));
      else if (entrada.name.endsWith('.astro')) salida.push(ruta);
    }
    return salida;
  };

  /*
   * Busca texto literal en el marcado: contenido entre `>` y `<` con al menos
   * dos palabras y sin `{`. Dos palabras y no una para no marcar como error
   * fragmentos como `>·<` o `>2026<`, que son datos y no frases.
   */
  const literal = /> *([A-ZÁÉÍÓÚÑa-záéíóúñ][^<>{}]*\s+[A-Za-zÁÉÍÓÚÑáéíóúñ][^<>{}]*?) *</g;

  const infractores = [];
  for (const archivo of await listar(join(RAIZ, 'src'))) {
    const codigo = await readFile(archivo, 'utf8');
    // Fuera los comentarios HTML y el frontmatter, que no llegan a la página.
    const marcado = codigo.replace(/^---[\s\S]*?^---/m, '').replace(/<!--[\s\S]*?-->/g, '');
    for (const m of marcado.matchAll(literal)) {
      const texto = m[1].trim();
      if (texto.length < 6) continue;
      infractores.push(`${archivo.replace(RAIZ, '').replace(/\\/g, '/')}: «${texto.slice(0, 40)}»`);
    }
  }

  check(
    'RF-1.7 · ninguna cadena escrita en los componentes',
    infractores.length === 0,
    infractores.length ? infractores.slice(0, 3).join(' · ') : 'ninguna',
  );
}

await ctx.close();
await browser.close();
server.close();

console.log('\nComprobación de RF-1 — sitio bilingüe\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(48)} ${r.detalle}`);
}
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
