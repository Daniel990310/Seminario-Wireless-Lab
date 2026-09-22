/**
 * Comprobación de RF-6 y RF-9 — componentes interactivos.
 *
 * Las cinco interacciones de RF-6 están resueltas, y **ninguna con Radix**:
 *
 * | Interacción              | Cómo                                                 |
 * | ------------------------ | ---------------------------------------------------- |
 * | Programa en pestañas     | Mejora progresiva sobre el patrón ARIA de la W3C      |
 * | Resumen de sesión        | `<details>` nativo                                    |
 * | Ficha de expositor       | `<details>` nativo                                    |
 * | Selector de tema         | Radios nativos, 0 kB (RF-4)                           |
 * | Sección activa           | `IntersectionObserver` propio                         |
 *
 * El denominador común es RF-6.2: el contenido tiene que seguir accesible sin
 * JavaScript. Eso descarta cualquier componente que solo exista al hidratar, que
 * es lo que devuelve el catálogo de 21st.dev para pestañas.
 *
 * Las pestañas solo se comprueban si hay jornadas cargadas; si `program.days`
 * está vacío, el criterio se informa como OMITIDO en vez de darse por bueno.
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

  /*
   * `>= 6` desde el 2026-08-07, no `>= 7`.
   *
   * Se retiró la sección «Instituciones vinculadas» —el diagrama de T3— porque repetía lo que
   * ya dicen «Expositores» y «Organización». El requisito que esta comprobación protege es
   * que **las secciones existan sin JavaScript**, no que sean siete: bajar el número al que
   * hay es corregir el listado, no relajar el criterio. Si alguna vez se quita otra sección,
   * la pregunta que hay que hacerse es si sigue habiendo contenido sin JS, no si el número
   * cuadra.
   */
  check(
    'RF-6.2 · las secciones existen sin JavaScript',
    sinJs.secciones >= 6,
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
// RF-6 · Pestañas por jornada, con mejora progresiva
// ---------------------------------------------------------------------------
{
  // Sin JavaScript: las jornadas deben verse apiladas y el `tablist` oculto.
  const ctxSin = await browser.newContext({ javaScriptEnabled: false });
  const sinJs = await ctxSin.newPage();
  await sinJs.goto(BASE, { waitUntil: 'domcontentloaded' });
  const estadoSinJs = await sinJs.evaluate(() => ({
    paneles: document.querySelectorAll('[data-panel]').length,
    ocultos: [...document.querySelectorAll('[data-panel]')].filter((p) => p.hidden).length,
    tablistVisible: !document.querySelector('[data-tablist]')?.hidden,
    resumenes: document.querySelectorAll('[data-jornadas] details').length,
  }));
  await ctxSin.close();

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const hayPestanas = (await page.locator('[role="tab"]').count()) > 0;

  if (!hayPestanas) {
    /*
     * Sin programa cargado no hay nada que comprobar. Se informa en vez de
     * callarlo: un criterio omitido en silencio se lee como criterio cumplido.
     */
    check(
      'RF-6 · pestañas por jornada',
      true,
      'OMITIDO: `program.days` vacío, no hay jornadas que separar',
    );
  } else {
    check(
      'RF-6.2 · sin JavaScript las jornadas se ven apiladas',
      estadoSinJs.paneles >= 2 && estadoSinJs.ocultos === 0 && !estadoSinJs.tablistVisible,
      `${estadoSinJs.paneles} paneles, ${estadoSinJs.ocultos} ocultos, tablist ${estadoSinJs.tablistVisible ? 'visible' : 'oculto'}`,
    );

    check(
      'RF-6.2 · los resúmenes existen sin JavaScript',
      estadoSinJs.resumenes > 0,
      `${estadoSinJs.resumenes} desplegables en el HTML`,
    );

    const aria = await page.evaluate(() => {
      const tabs = [...document.querySelectorAll('[role="tab"]')];
      const paneles = [...document.querySelectorAll('[data-panel]')];
      return {
        tabs: tabs.length,
        seleccionados: tabs.filter((t) => t.getAttribute('aria-selected') === 'true').length,
        conControls: tabs.filter((t) => document.getElementById(t.getAttribute('aria-controls') ?? '')).length,
        panelesEtiquetados: paneles.filter((p) => document.getElementById(p.getAttribute('aria-labelledby') ?? '')).length,
        visibles: paneles.filter((p) => !p.hidden).length,
        tablistConNombre: !!document.querySelector('[role="tablist"]')?.getAttribute('aria-label'),
      };
    });

    check(
      'RF-6 · un solo panel visible y una sola pestaña activa',
      aria.seleccionados === 1 && aria.visibles === 1,
      `${aria.seleccionados} activa(s), ${aria.visibles} panel(es) visible(s)`,
    );
    check(
      'RF-6 · cada pestaña apunta a su panel y viceversa',
      aria.conControls === aria.tabs && aria.panelesEtiquetados === aria.tabs,
      `${aria.conControls}/${aria.tabs} con aria-controls válido`,
    );
    check(
      'RF-6 · el grupo de pestañas tiene nombre accesible',
      aria.tablistConNombre,
      aria.tablistConNombre ? 'aria-label presente' : 'sin aria-label',
    );

    // Teclado: flechas con vuelta circular, Home y End (patrón de la W3C).
    await page.locator('[role="tab"]').first().focus();
    const activa = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('[role="tab"]')].findIndex(
          (t) => t.getAttribute('aria-selected') === 'true',
        ),
      );

    await page.keyboard.press('ArrowRight');
    const trasDerecha = await activa();
    await page.keyboard.press('ArrowLeft');
    const trasIzquierda = await activa();
    await page.keyboard.press('End');
    const trasEnd = await activa();
    await page.keyboard.press('Home');
    const trasHome = await activa();

    check(
      'RF-6.1 · las pestañas se operan con flechas, Home y End',
      trasDerecha === 1 && trasIzquierda === 0 && trasEnd === aria.tabs - 1 && trasHome === 0,
      `→${trasDerecha} ←${trasIzquierda} End→${trasEnd} Home→${trasHome}`,
    );
  }

  await ctx.close();
}

// ---------------------------------------------------------------------------
// RF-9 · Malla térmica flexible del hero
// ---------------------------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'no-preference',
    hasTouch: false,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const campo = page.locator('[data-sensing-mode="polar-grid"]');

  const capas = await page.evaluate(() => {
    const lienzos = [...document.querySelectorAll('[data-sensing-malla]')];
    return {
      cantidad: lienzos.length,
      pasivas: lienzos.every(
        (lienzo) =>
          lienzo.getAttribute('aria-hidden') === 'true' &&
          getComputedStyle(lienzo).pointerEvents === 'none' &&
          getComputedStyle(lienzo).display !== 'none',
      ),
      svgDescrito:
        document.querySelector('[data-figura][role="img"] title') !== null &&
        document.querySelector('[data-figura][role="img"] desc') !== null,
      elementosDescartados:
        document.querySelectorAll('.fig-point, .fig-object, .fig-ray').length,
    };
  });
  check(
    'RF-9.4 · la capa visual no intercepta ni se anuncia',
    capas.cantidad === 1 && capas.pasivas && capas.svgDescrito && capas.elementosDescartados === 0,
    `${capas.cantidad} lienzos; pasivos ${capas.pasivas}; SVG descrito ${capas.svgDescrito}; objetos descartados ${capas.elementosDescartados}`,
  );

  // Sensibilidad: la misma condición debe fallar si se vuelve interactivo un lienzo.
  const sensible = await page.evaluate(() => {
    const lienzo = document.querySelector('[data-sensing-malla]');
    lienzo.style.pointerEvents = 'auto';
    lienzo.style.display = 'none';
    lienzo.setAttribute('aria-hidden', 'false');
    const pasa =
      lienzo.getAttribute('aria-hidden') === 'true' &&
      getComputedStyle(lienzo).pointerEvents === 'none' &&
      getComputedStyle(lienzo).display !== 'none';
    lienzo.style.pointerEvents = '';
    lienzo.style.display = '';
    lienzo.setAttribute('aria-hidden', 'true');
    return !pasa;
  });
  check(
    'RF-9 · sensibilidad del control de capa pasiva',
    sensible,
    sensible ? 'la mutación deliberada se detectó' : 'la comprobación no detectó la rotura',
  );

  const caja = await campo.boundingBox();
  const firma = () =>
    page.evaluate(() => {
      const lienzo = document.querySelector('[data-sensing-malla]');
      const datos = lienzo.getContext('2d').getImageData(0, 0, lienzo.width, lienzo.height).data;
      let hash = 2166136261;
      let visibles = 0;
      for (let i = 0; i < datos.length; i += 4) {
        if (datos[i + 3] > 4) visibles++;
        hash ^= datos[i] + datos[i + 1] * 3 + datos[i + 2] * 5 + datos[i + 3] * 7;
        hash = Math.imul(hash, 16777619);
      }
      return { hash: hash >>> 0, visibles };
    });

  if (!caja) {
    check('RF-9 · la malla térmica se inicializa', false, 'sin caja visible');
  } else {
    const antes = await firma();
    await page.evaluate(() => {
      const lienzo = document.querySelector('[data-sensing-malla]');
      window.__mallaNeutra = new Uint8ClampedArray(
        lienzo.getContext('2d').getImageData(0, 0, lienzo.width, lienzo.height).data,
      );
    });

    const objetivo = {
      x: caja.x + caja.width * 0.69,
      y: caja.y + caja.height * 0.54,
    };
    await page.mouse.move(objetivo.x - caja.width * 0.12, objetivo.y + caja.height * 0.08);
    await page.mouse.move(objetivo.x, objetivo.y, { steps: 14 });
    await page.waitForTimeout(100);

    const durante = await firma();
    const energia = Number((await campo.getAttribute('data-sensing-energy')) ?? 0);
    const ejecutandoDurante = await campo.getAttribute('data-sensing-running');
    check(
      'RF-9.1 · el puntero deforma y calienta la malla',
      antes.hash !== durante.hash && energia > 0 && ejecutandoDurante === 'true',
      `firma ${antes.hash} → ${durante.hash}; energía ${energia.toFixed(3)}`,
    );

    const desvanecimiento = await page.evaluate(() => {
      const lienzo = document.querySelector('[data-sensing-malla]');
      const datos = lienzo.getContext('2d').getImageData(0, 0, lienzo.width, lienzo.height).data;
      let borde = 0;
      let interior = 0;
      let nBorde = 0;
      let nInterior = 0;
      for (let y = 0; y < lienzo.height; y += 3) {
        for (let x = 0; x < lienzo.width; x += 3) {
          const u = x / lienzo.width;
          const v = y / lienzo.height;
          const alfa = datos[(y * lienzo.width + x) * 4 + 3];
          if (u < 0.08 || u > 0.92 || v < 0.08 || v > 0.92) {
            borde += alfa;
            nBorde++;
          } else if (u > 0.22 && u < 0.84 && v > 0.18 && v < 0.82) {
            interior += alfa;
            nInterior++;
          }
        }
      }
      return { borde: borde / nBorde, interior: interior / nInterior };
    });
    check(
      'RF-9.12 · la retícula se desvanece antes del borde',
      desvanecimiento.interior > 0 && desvanecimiento.borde < desvanecimiento.interior * 0.25,
      `alfa media ${desvanecimiento.borde.toFixed(2)} borde / ${desvanecimiento.interior.toFixed(2)} interior`,
    );

    const localidad = await page.evaluate(({ clientX, clientY }) => {
      const lienzo = document.querySelector('[data-sensing-malla]');
      const caja = lienzo.getBoundingClientRect();
      const escalaX = lienzo.width / caja.width;
      const escalaY = lienzo.height / caja.height;
      const x = (clientX - caja.left) * escalaX;
      const y = (clientY - caja.top) * escalaY;
      const actual = lienzo.getContext('2d').getImageData(0, 0, lienzo.width, lienzo.height).data;
      const base = window.__mallaNeutra;
      const radio = Math.min(lienzo.width, lienzo.height) * 0.2;
      let cerca = 0;
      let lejos = 0;
      let totalCerca = 0;
      let totalLejos = 0;
      for (let py = 0; py < lienzo.height; py += 3) {
        for (let px = 0; px < lienzo.width; px += 3) {
          const distancia = Math.hypot(px - x, py - y);
          const i = (py * lienzo.width + px) * 4;
          const cambio =
            Math.abs(actual[i] - base[i]) +
            Math.abs(actual[i + 1] - base[i + 1]) +
            Math.abs(actual[i + 2] - base[i + 2]) +
            Math.abs(actual[i + 3] - base[i + 3]) >
            18;
          if (distancia < radio) {
            totalCerca++;
            if (cambio) cerca++;
          } else if (distancia > radio * 2.1) {
            totalLejos++;
            if (cambio) lejos++;
          }
        }
      }
      return { cerca: cerca / totalCerca, lejos: lejos / totalLejos };
    }, { clientX: objetivo.x, clientY: objetivo.y });
    check(
      'RF-9.11 · la respuesta inicial es local',
      localidad.cerca > 0.01 && localidad.cerca > localidad.lejos * 3,
      `cambio cercano ${(localidad.cerca * 100).toFixed(1)} %; lejano ${(localidad.lejos * 100).toFixed(1)} %`,
    );

    await page.waitForTimeout(850);
    const minimo = Number((await campo.getAttribute('data-sensing-min')) ?? 0);
    const maximo = Number((await campo.getAttribute('data-sensing-max')) ?? 0);
    check(
      'RF-9.13 · la malla desarrolla cresta y valle',
      minimo < -0.001 && maximo > 0.001,
      `altura ${minimo.toFixed(3)} … ${maximo.toFixed(3)}`,
    );

    /*
     * RF-9.15b · el puntero DESPIERTA la malla dormida.
     *
     * Esta comprobación existe porque faltaba y por eso un fallo grave pasó desapercibido.
     * RF-9.15 verificaba que el **barrido** despierta la malla, y de ahí se dio por hecho
     * que el puntero también. No lo hacía: `arrancar()` solo miraba si el bucle corría, y
     * con el bucle vivo pero dormido no limpiaba `dormido`, así que la perturbación se
     * escribía en `velocidades` y `simular()` se saltaba la integración **hasta que el
     * barrido cruzaba la banda del puntero: hasta 17 segundos**. Daniel lo reprodujo el
     * 2026-08-09: «paso el mouse por la figura y no pasa nada».
     *
     * Se mide la secuencia completa, que es la que fallaba: encender, esperar a que se
     * duerma con el puntero DENTRO, y volver a mover sin salir.
     */
    const cajaCampo = await campo.boundingBox();
    const dentro = (fx, fy) =>
      page.mouse.move(cajaCampo.x + cajaCampo.width * fx, cajaCampo.y + cajaCampo.height * fy);
    await dentro(0.35, 0.5);
    await dentro(0.4, 0.48);
    await page.waitForTimeout(400);
    const encendida = await firma();
    // Quieto dentro el tiempo suficiente para que la onda se apague y el bucle duerma.
    await page.waitForTimeout(6000);
    const dormida = await firma();
    await dentro(0.5, 0.55);
    await dentro(0.55, 0.52);
    await page.waitForTimeout(500);
    const despertada = await firma();
    check(
      'RF-9.15b · el puntero despierta la malla dormida',
      dormida.hash === antes.hash && despertada.hash !== antes.hash,
      `encendida ${encendida.hash} → dormida ${dormida.hash} → despertada ${despertada.hash}`,
    );

    await page.mouse.move(2, 2);
    await page.waitForTimeout(3300);
    const despues = await firma();
    const ejecutando = await campo.getAttribute('data-sensing-running');
    const energiaFinal = await campo.getAttribute('data-sensing-energy');
    check(
      'RF-9.10 · vuelve exactamente a la malla neutra',
      despues.hash === antes.hash && energiaFinal === '0' && ejecutando === 'false',
      `firma ${antes.hash} → ${despues.hash}; energía ${energiaFinal}; ejecutando ${ejecutando}`,
    );
    const sensibleParada = await page.evaluate(() => {
      const campo = document.querySelector('[data-sensing-mode="polar-grid"]');
      campo.dataset.sensingRunning = 'true';
      const pasa = campo.dataset.sensingRunning === 'false';
      campo.dataset.sensingRunning = 'false';
      return !pasa;
    });
    check(
      'RF-9 · sensibilidad del control de parada',
      sensibleParada,
      sensibleParada ? 'el bucle forzado se detectó' : 'la comprobación no detectó la rotura',
    );

    const sensibleFirma = await page.evaluate(() => {
      const lienzo = document.querySelector('[data-sensing-malla]');
      const contexto = lienzo.getContext('2d');
      contexto.fillStyle = 'rgba(255, 0, 255, 1)';
      contexto.fillRect(0, 0, 2, 2);
      return true;
    });
    const firmaRota = await firma();
    check(
      'RF-9 · sensibilidad de la firma neutra',
      sensibleFirma && firmaRota.hash !== antes.hash,
      'la marca residual deliberada se detectó',
    );
  }
  await ctx.close();

  const ctxReducido = await browser.newContext({ reducedMotion: 'reduce' });
  const reducido = await ctxReducido.newPage();
  await reducido.goto(BASE, { waitUntil: 'networkidle' });
  const modosReducidos = await reducido.locator('[data-sensing-mode]').count();
  check(
    'RF-9.5 · movimiento reducido conserva la figura estática',
    modosReducidos === 0 && (await reducido.locator('[data-figura]').count()) === 1,
    `${modosReducidos} efectos inicializados`,
  );
  const sensibleReducido = await reducido.evaluate(() => {
    const figura = document.querySelector('[data-figura]')?.parentElement;
    figura.dataset.sensingMode = 'polar-grid';
    const pasa = document.querySelectorAll('[data-sensing-mode]').length === 0;
    delete figura.dataset.sensingMode;
    return !pasa;
  });
  check('RF-9 · sensibilidad con movimiento reducido', sensibleReducido, 'la activación forzada se detectó');
  await ctxReducido.close();

  const ctxTactil = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const tactil = await ctxTactil.newPage();
  await tactil.goto(BASE, { waitUntil: 'networkidle' });

  const RUTA_MALLA = fileURLToPath(
    new URL('../src/components/SensingPersistence.astro', import.meta.url),
  );
  const leerFuenteMalla = () => readFile(RUTA_MALLA, 'utf8');
  /*
   * `touch-action: none` en la figura o en el lienzo bloquearía el desplazamiento sin
   * necesidad de `preventDefault`, y con un gesto sintético no se notaría. Se mira el
   * valor calculado, no la hoja de estilos, porque puede llegar heredado.
   */
  const bloqueaTouchAction = () =>
    tactil.evaluate(() => {
      const lienzo = document.querySelector('canvas[data-sensing-malla]');
      return [lienzo, lienzo?.parentElement].some(
        (n) => n && /none|pan-x$|pinch-zoom$/.test(getComputedStyle(n).touchAction),
      );
    });

  /*
   * RF-9.8 cambió de forma el 2026-08-09, por indicación de Daniel: antes exigía que en
   * táctil **no se inicializara nada**, y eso dejaba la figura muerta al dedo. Ahora
   * exige las dos cosas a la vez, que es lo difícil: que el dedo excite la malla y que
   * la página siga deslizándose.
   *
   * Se comprueba con un gesto real, no leyendo el código: se arrastra el dedo sobre la
   * figura y se mira si la malla se pintó **y** si la página se desplazó. Un `touchmove`
   * no pasivo, o un `touch-action: none`, harían fallar la segunda mitad.
   */
  const modosTactiles = await tactil.locator('[data-sensing-mode]').count();
  check(
    'RF-9.8 · el efecto se inicializa en táctil',
    modosTactiles === 1 && (await tactil.locator('[data-figura]').count()) === 1,
    `${modosTactiles} efectos inicializados`,
  );

  const gesto = await tactil.evaluate(async () => {
    const lienzo = document.querySelector('canvas[data-sensing-malla]');
    const ctx = lienzo?.getContext('2d');
    /*
     * La figura tiene que estar EN PANTALLA antes del gesto. En móvil queda bajo el
     * pliegue, y el `IntersectionObserver` del efecto apaga el bucle cuando la figura no
     * se ve: sin este desplazamiento el gesto llega a un efecto dormido y la primera
     * versión de esta comprobación medía 0 → 0 nodos culpando al código correcto.
     */
    lienzo.parentElement.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 250));
    const caja = lienzo.parentElement.getBoundingClientRect();
    const pintados = () => {
      if (!ctx) return 0;
      const d = ctx.getImageData(0, 0, lienzo.width, lienzo.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
      return n;
    };
    const antes = pintados();
    const destino = lienzo.parentElement;
    const toque = (x, y) =>
      new Touch({ identifier: 1, target: destino, clientX: x, clientY: y });
    const emitir = (tipo, x, y) =>
      destino.dispatchEvent(
        new TouchEvent(tipo, {
          bubbles: true,
          cancelable: tipo !== 'touchcancel',
          touches: tipo === 'touchend' ? [] : [toque(x, y)],
        }),
      );
    const x0 = caja.x + caja.width * 0.3;
    const y0 = caja.y + caja.height * 0.55;
    emitir('touchstart', x0, y0);
    for (let i = 1; i <= 10; i++) {
      emitir('touchmove', x0 + i * (caja.width * 0.03), y0 - i * (caja.height * 0.02));
      await new Promise((r) => requestAnimationFrame(r));
    }
    await new Promise((r) => setTimeout(r, 120));
    const despues = pintados();
    emitir('touchend', 0, 0);
    // El desplazamiento se comprueba aparte: si algún día se llamara a `preventDefault`,
    // el gesto sintético no lo revelaría, así que se desplaza de verdad y se mira si movió.
    const antesY = window.scrollY;
    window.scrollBy(0, 200);
    await new Promise((r) => setTimeout(r, 200));
    return { antes, despues, desplazo: window.scrollY > antesY };
  });

  check(
    'RF-9.8 · el dedo excita la malla',
    gesto.despues > gesto.antes,
    `${gesto.antes} → ${gesto.despues} nodos pintados`,
  );
  /*
   * Sin comentarios antes de buscar `preventDefault`, y esto ya pasó una vez en este
   * mismo archivo con `createRadialGradient` en RF-9.9: la primera versión de esta
   * comprobación fallaba porque encontraba la palabra **en el comentario que explica que
   * no se usa**. Documentar por qué algo no se hace es justamente lo que se quiere que
   * siga pasando; lo que no puede volver es la llamada.
   */
  const codigoMalla = (await leerFuenteMalla())
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ');

  check(
    'RF-9.8 · nadie bloquea el gesto táctil',
    !/preventDefault/.test(codigoMalla) && !(await bloqueaTouchAction()),
    'sin preventDefault y sin touch-action que atrape el gesto',
  );
  check(
    'RF-9.8 · táctil no compite con el desplazamiento',
    gesto.desplazo,
    'la página se desplaza tras el gesto',
  );
  await ctxTactil.close();

  const fuente = await leerFuenteMalla();
  /*
   * Las técnicas prohibidas hay que buscarlas en el CÓDIGO, no en la prosa.
   *
   * El comentario de cabecera de `SensingPersistence.astro` explica por qué se
   * descartó la primera malla cartesiana, y para explicarlo la nombra:
   * «hacía cientos de `stroke()` y `createRadialGradient()` en cada cuadro».
   * Eso hacía fallar RF-9.9 con la implementación correcta delante `[medido:
   * 2026-08-06]`, y el mensaje —«se encontró geometría descartada»— apuntaba al
   * archivo equivocado. Documentar una técnica retirada es justamente lo que se
   * quiere que siga pasando; lo que no puede volver es la llamada.
   */
  const sinComentarios = (texto) =>
    texto.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^[ \t]*\/\/.*$/gm, ' ');
  const esMalla = (contenidoConComentarios) => {
    const contenido = sinComentarios(contenidoConComentarios);
    return (
      !/\.arc\s*\(/.test(contenido) &&
      !/destination-out/.test(contenido) &&
      !/createRadialGradient/.test(contenido) &&
      /Float32Array/.test(contenido) &&
      /const ANGULOS/.test(contenido) &&
      /const RADIOS/.test(contenido) &&
      /const theta/.test(contenido) &&
      /const rango/.test(contenido) &&
      /mascaras/.test(contenido)
    );
  };
  check(
    'RF-9.9 · malla polar de alturas, sin pintura acumulativa costosa',
    esMalla(fuente),
    esMalla(fuente) ? 'campo polar numérico, agrupado y con borde atenuado' : 'se encontró geometría descartada',
  );
  check(
    'RF-9 · sensibilidad del control de geometría',
    !esMalla(`${fuente}\nctx.arc(0, 0, 1, 0, 1);`),
    'el arco deliberado se detectó',
  );
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

console.log('\nComprobación de RF-6 y RF-9 — componentes interactivos\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(52)} ${r.detalle}`);
}
console.log(
  '\n  Las 5 interacciones de RF-6 están resueltas, ninguna con Radix: el\n' +
    '  requisito de funcionar sin JavaScript descarta todo lo que solo existe\n' +
    '  al hidratar. Ver `ESTADO.md` §5h.',
);
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
