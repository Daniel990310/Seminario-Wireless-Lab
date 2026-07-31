/**
 * Comprobación de T6 — semántica, foco y operación por teclado.
 *
 * `npm run verify` cubre lo que axe puede decidir solo: contraste, nombres de
 * región, saltos de nivel. Lo que no puede decidir es si el foco **se ve**, si el
 * recorrido por teclado **llega a todo** y si el texto ampliado al 200 % desborda.
 * WCAG deja esas tres como comprobación manual, y una comprobación manual que no
 * se automatiza es una comprobación que se deja de hacer.
 *
 * `verify:tema` ya cubre el teclado del selector de tema (RF-4.5). Este guion no
 * lo repite: cubre el resto de la página.
 *
 * Uso: `npm run build && npm run verify:teclado`.
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
const check = (nombre, ok, detalle = '') => resultados.push({ nombre, ok, detalle });

/*
 * Ratio de contraste de WCAG 2.1. Se implementa aquí en lugar de importarlo de
 * axe porque axe solo evalúa texto, y el umbral de 3:1 de 1.4.11 se aplica al
 * anillo de foco, que no es texto.
 */
const luminancia = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const rgb = (css) => {
  const m = css.match(/(\d+(?:\.\d+)?)/g);
  return m ? m.slice(0, 3).map(Number) : null;
};

// ---------------------------------------------------------------------------
// 1. Jerarquía de encabezados en Expositores
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle' });

  const jerarquia = await page.evaluate(() => {
    const seccion = document.querySelector('#expositores');
    const niveles = [...seccion.querySelectorAll('h2,h3,h4')].map((h) => ({
      nivel: +h.tagName[1],
      texto: h.textContent.trim().slice(0, 40),
    }));
    return niveles;
  });

  const rotulos = jerarquia.filter((h) => h.nivel === 3);
  const nombres = jerarquia.filter((h) => h.nivel === 4);
  check(
    'T6 · nombres de expositor cuelgan del rótulo',
    rotulos.length === 2 && nombres.length >= 6,
    `${rotulos.length} rótulos h3, ${nombres.length} nombres h4`,
  );
  await ctx.close();
}

// ---------------------------------------------------------------------------
// 2. Foco visible y recorrido por teclado, en los dos temas
// ---------------------------------------------------------------------------
for (const tema of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle' });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), tema);

  /*
   * Anular las transiciones ANTES de medir el anillo de foco.
   *
   * `transition-colors` de Tailwind incluye `outline-color` entre las
   * propiedades que anima, así que al medir justo después de un `Tab` se captura
   * el color **de partida** —`currentColor`— y no el final. Eso daba 1,05:1 en
   * un anillo que en realidad cumple 7:1.
   *
   * Es la misma regla que ya estaba registrada en `specs/fuentes.md` para la
   * medición de contraste, aprendida entonces con las transiciones de opacidad:
   * toda medición de color anula antes las transiciones.
   */
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });

  // Cuántos elementos deberían poder recibir el foco.
  const enfocables = await page.evaluate(() => {
    const sel = 'a[href], button, summary, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(sel)].filter((el) => {
      /*
       * Fuera lo que está dentro de un `<details>` cerrado —el panel del menú
       * móvil, las reseñas de los expositores—: ese contenido no está expuesto,
       * así que no llegar a él con Tab es lo correcto, no un fallo. Se cuenta el
       * `summary`, que es el control que sí debe alcanzarse.
       */
      const detalle = el.closest('details');
      if (detalle && !detalle.open && el.tagName !== 'SUMMARY') return false;

      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      // Los radios del selector de tema están ocultos a la vista pero son
      // enfocables por diseño: el rótulo los representa.
      return s.visibility !== 'hidden' && s.display !== 'none' && (r.width > 0 || el.type === 'radio');
    }).length;
  });

  // Recorrido real con Tab. El tope evita un bucle si algo atrapa el foco.
  await page.evaluate(() => document.body.focus());
  const visitados = new Set();
  let sinFoco = 0;
  const TOPE = 120;
  for (let i = 0; i < TOPE; i++) {
    await page.keyboard.press('Tab');
    const marca = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      /*
       * La marca incluye las DOS coordenadas. Con solo `top`, varios controles
       * idénticos en la misma fila —los seis «Ver reseña» de los expositores,
       * por ejemplo— producían la misma marca, el bucle la tomaba por una vuelta
       * al principio y cortaba el recorrido a la mitad.
       */
      return `${el.tagName}|${el.getAttribute('href') ?? el.getAttribute('value') ?? el.textContent?.trim().slice(0, 20)}|${Math.round(r.top)}x${Math.round(r.left)}`;
    });
    if (!marca) {
      sinFoco++;
      if (sinFoco > 2) break;
      continue;
    }
    if (visitados.has(marca)) break; // volvió al principio: recorrido completo
    visitados.add(marca);
  }

  check(
    `T6 · el recorrido por teclado llega a todo (${tema})`,
    visitados.size >= enfocables,
    `${visitados.size} alcanzados de ${enfocables} enfocables`,
  );

  /*
   * Foco VISIBLE. No basta con que el elemento reciba el foco: `:focus-visible`
   * debe pintar un anillo con contraste suficiente.
   *
   * Se mide recorriendo con Tab de verdad, no llamando a `el.focus()`: el foco
   * programático no siempre activa `:focus-visible` —el navegador distingue si
   * la interacción vino del teclado— y medirlo así daba fallos que no existen.
   */
  await page.evaluate(() => document.body.focus());
  const muestras = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const m = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        etiqueta: `${el.tagName.toLowerCase()}${el.type === 'radio' ? '[radio]' : ''} «${(el.textContent ?? '').trim().slice(0, 18)}» .${(el.getAttribute('class') ?? '').split(' ')[0]}`,
        visible: el.matches(':focus-visible'),
        ancho: parseFloat(s.outlineWidth) || 0,
        estilo: s.outlineStyle,
        color: s.outlineColor,
        fondo: getComputedStyle(document.body).backgroundColor,
      };
    });
    if (m) muestras.push(m);
  }

  const sinAnillo = muestras.filter((m) => !(m.ancho >= 2 && m.estilo !== 'none'));
  check(
    `T6 · el foco se ve en todo el recorrido (${tema})`,
    sinAnillo.length === 0,
    sinAnillo.length
      ? `sin anillo: ${[...new Set(sinAnillo.map((m) => m.etiqueta))].join(', ')}`
      : `${muestras.length} paradas, todas con anillo`,
  );

  const conRatio = muestras
    .map((m) => {
      const a = rgb(m.color);
      const b = rgb(m.fondo);
      return { ...m, ratio: a && b ? ratio(a, b) : 0 };
    })
    .filter((m) => m.ratio > 0);
  const peor = conRatio.length ? conRatio.reduce((p, m) => (m.ratio < p.ratio ? m : p)) : null;
  check(
    `T6 · el anillo de foco cumple 3:1 (WCAG 1.4.11) (${tema})`,
    !!peor && peor.ratio >= 3,
    peor
      ? `peor ratio ${peor.ratio.toFixed(2)}:1 en ${peor.etiqueta} · anillo ${peor.color} · ${peor.estilo} ${peor.ancho}px · focus-visible=${peor.visible}`
      : 'sin medir',
  );

  await ctx.close();
}

// ---------------------------------------------------------------------------
// 3. Menú móvil operable por teclado
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle' });

  const sumario = page.locator('[data-mobile-menu] > summary');
  await sumario.focus();
  await page.keyboard.press('Enter');
  const abierto = await page.evaluate(() => document.querySelector('[data-mobile-menu]').open);

  // Con el menú abierto, el siguiente Tab debe entrar en él, no saltárselo.
  await page.keyboard.press('Tab');
  const dentro = await page.evaluate(() =>
    document.querySelector('[data-mobile-menu]').contains(document.activeElement),
  );

  await page.keyboard.press('Escape');
  const cerrado = await page.evaluate(() => !document.querySelector('[data-mobile-menu]').open);

  check('T6 · el menú móvil abre con Enter', abierto, abierto ? 'abre' : 'no abre');
  check('T6 · el foco entra en el menú abierto', dentro, dentro ? 'entra' : 'lo salta');
  check('T6 · el menú cierra con Escape', cerrado, cerrado ? 'cierra' : 'sigue abierto');
  await ctx.close();
}

// ---------------------------------------------------------------------------
// 4. Zoom de texto al 200 % sin desbordamiento horizontal (WCAG 1.4.4)
// ---------------------------------------------------------------------------
for (const vp of [
  { nombre: 'escritorio', width: 1440, height: 900 },
  { nombre: 'movil', width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle' });
  // 200 % del tamaño base del navegador.
  await page.evaluate(() => (document.documentElement.style.fontSize = '32px'));
  await page.waitForTimeout(300);

  /*
   * No se mide `scrollWidth`: `body { overflow-x: hidden }` lo enmascararía. Se
   * buscan elementos con contenido cuyo borde derecho se salga del viewport, que
   * es el desbordamiento que una persona sufriría aunque no vea barra.
   */
  const desbordan = await page.evaluate(() => {
    const limite = document.documentElement.clientWidth + 1;
    return [...document.querySelectorAll('body *')]
      .filter((el) => {
        if (!el.textContent?.trim()) return false;
        if (getComputedStyle(el).position === 'fixed') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > limite;
      })
      .slice(0, 4)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName.toLowerCase()}.${(el.getAttribute('class') ?? '').split(' ')[0]} +${Math.round(r.right - limite)}px`;
      });
  });

  check(
    `T6 · texto al 200 % sin desbordar (${vp.nombre})`,
    desbordan.length === 0,
    desbordan.length ? desbordan.join(', ') : 'ningún elemento se sale',
  );
  await ctx.close();
}

await browser.close();
server.close();

console.log('\nComprobación de T6 — semántica, foco y teclado\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(52)} ${r.detalle}`);
}
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
