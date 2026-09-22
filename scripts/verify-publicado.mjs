/**
 * Comprobación de RNF-7 y del cierre de RNF-3.1 — contra el sitio publicado.
 *
 * Los otros siete verificadores miden `dist/`, que es lo correcto para la
 * autoridad sobre el cumplimiento: no dependen de la red ni de terceros. Pero hay
 * criterios que `dist/` no puede responder, porque la respuesta depende de con qué
 * URL se compiló y de qué está sirviendo el proveedor:
 *
 *   - RNF-3.1 exige validar los datos estructurados «según el validador de
 *     Google». Ese servicio necesita una URL pública. Estuvo pendiente desde T8 y
 *     se cerró el 2026-07-31.
 *   - RNF-7.2 y 7.3 exigen que un despliegue con la URL sin declarar no se
 *     indexe. Eso se ve en lo servido, no en el código fuente.
 *   - RNF-3.2 exige que la imagen para compartir mida 1200×630. `verify:seo`
 *     comprueba el PNG del repositorio; aquí se comprueba que además **se sirva**,
 *     porque una plataforma que no la descarga no muestra tarjeta.
 *
 * **Queda fuera de `verify:todo` a propósito** (RNF-7.5). Depende de la red y de un
 * servicio de terceros: si entrara en la cadena, un corte de conexión bastaría para
 * que el proyecto pareciera incumplir.
 *
 * No lleva ningún dominio escrito (RNF-7.4). La URL se pasa por argumento o por
 * `SITIO_PUBLICADO`, y sin ella el guion informa OMITIDO en vez de darse por bueno.
 *
 * Uso: `npm run verify:publicado -- https://ejemplo.workers.dev`
 *      `SITIO_PUBLICADO=https://ejemplo.workers.dev npm run verify:publicado`
 */

const BASE = (process.argv[2] ?? process.env.SITIO_PUBLICADO ?? '').replace(/\/+$/, '');

if (!BASE) {
  console.log('\nComprobación del sitio publicado (RNF-7)\n');
  console.log('  ⊘ OMITIDO: nadie declaró la URL.');
  console.log('    Uso: npm run verify:publicado -- https://tu-dominio\n');
  /*
   * Sale en 0 y no en 1: no hay incumplimiento que declarar, simplemente no hay
   * nada que medir. Lo que no se hace es callarlo, porque un verificador que pasa
   * en silencio sin comprobar nada es peor que uno que falla.
   */
  process.exit(0);
}

const resultados = [];
const check = (nombre, ok, detalle = '') => resultados.push({ nombre, ok, detalle });

/*
 * Dimensiones de un PNG leídas de la cabecera IHDR, igual que en `verify-seo.mjs`:
 * doce bytes y un formato congelado desde 1996 valen más que una dependencia.
 */
const dimensionesPng = (buffer) => {
  if (buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  return { ancho: buffer.readUInt32BE(16), alto: buffer.readUInt32BE(20) };
};

/*
 * `validator.schema.org` responde por POST con un prefijo anti-JSON-hijacking
 * —`)]}'` seguido de salto de línea— que hay que quitar antes de parsear. No es un
 * detalle cosmético: sin quitarlo, `JSON.parse` lanza y parecería que el servicio
 * no funciona. Comprobado contra la respuesta real, no leído en una documentación.
 */
const validarSchema = async (url) => {
  const r = await fetch('https://validator.schema.org/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ url }),
  });
  if (!r.ok) throw new Error(`validator.schema.org respondió ${r.status}`);
  const texto = (await r.text()).replace(/^\)\]\}'\s*/, '');
  const json = JSON.parse(texto);

  // Los errores y avisos van repartidos por el árbol, no en un total.
  const errores = [];
  const avisos = [];
  const recorrer = (n) => {
    if (Array.isArray(n)) return n.forEach(recorrer);
    if (n && typeof n === 'object') {
      if (Array.isArray(n.errors)) errores.push(...n.errors);
      if (Array.isArray(n.warnings)) avisos.push(...n.warnings);
      Object.values(n).forEach(recorrer);
    }
  };
  recorrer(json);

  const tipos = new Set();
  const tiposDe = (n) => {
    if (Array.isArray(n)) return n.forEach(tiposDe);
    if (n && typeof n === 'object') {
      if (n.typeGroup) tipos.add(n.typeGroup);
      Object.values(n).forEach(tiposDe);
    }
  };
  tiposDe(json);

  return { errores, avisos, tipos: [...tipos] };
};

const paginas = { es: '/', en: '/en/' };
const meta = {};

/*
 * Todo lo que sale a la red va envuelto. Un dominio que no resuelve tiene que
 * salir como criterio incumplido, no como excepción sin capturar: la primera
 * versión de este guion abortaba con un rastro de pila al medir un build cuyo
 * `og:image` apuntaba al dominio de producción, que todavía no existe. Lo destapó
 * la prueba de sensibilidad, no un despliegue real.
 */
const pedir = async (url, opciones) => {
  try {
    return { respuesta: await fetch(url, opciones), error: null };
  } catch (e) {
    return { respuesta: null, error: e.cause?.code ?? e.message };
  }
};

for (const [idioma, ruta] of Object.entries(paginas)) {
  const url = `${BASE}${ruta}`;
  const { respuesta, error } = await pedir(url);

  check(
    `RNF-7.1 · ${ruta} responde`,
    respuesta?.status === 200,
    error ? `no resuelve: ${error}` : `HTTP ${respuesta.status}`,
  );
  if (respuesta?.status !== 200) continue;

  const html = await respuesta.text();
  const leer = (patron) => html.match(patron)?.[1] ?? null;

  const m = {
    lang: leer(/<html[^>]*lang="([^"]+)"/),
    robots: leer(/<meta name="robots" content="([^"]+)"/),
    canonical: leer(/<link rel="canonical" href="([^"]+)"/),
    ogUrl: leer(/<meta property="og:url" content="([^"]+)"/),
    ogImage: leer(/<meta property="og:image" content="([^"]+)"/),
  };
  meta[idioma] = m;

  check(
    `RF-1.3 · ${ruta} declara su idioma`,
    m.lang === idioma,
    `lang="${m.lang ?? 'ausente'}"`,
  );

  /*
   * RNF-7.2 y 7.3 · el dominio provisional no se indexa.
   *
   * «Provisional» se decide por el sufijo del host servido, no por una lista de
   * dominios propios: `workers.dev` y `pages.dev` son de Cloudflare y nunca van a
   * ser el dominio definitivo de un seminario de la PUCV. Así el criterio sigue
   * valiendo cuando cambie el dominio, que es lo que exige RNF-7.4.
   */
  const host = new URL(BASE).host;
  const esProvisional = /\.(workers|pages)\.dev$/.test(host);
  check(
    `RNF-7.3 · noindex en dominio provisional (${ruta})`,
    esProvisional ? !!m.robots?.includes('noindex') : true,
    esProvisional
      ? `${host} → ${m.robots ?? 'SIN noindex'}`
      : `${host} no es provisional: criterio no aplica`,
  );

  check(
    `RNF-3.3 · el canónico apunta al host servido (${ruta})`,
    !!m.canonical && new URL(m.canonical).host === host,
    m.canonical ?? 'sin canonical',
  );

  check(
    `RNF-3.2 · og:url coincide con el canónico (${ruta})`,
    m.ogUrl === m.canonical,
    m.ogUrl === m.canonical ? 'coinciden' : `og:url ${m.ogUrl ?? 'ausente'}`,
  );

  // La imagen tiene que servirse, no solo estar declarada ni existir en el repo.
  const nombreImagen = `RNF-3.2 · la imagen se sirve y mide 1200×630 (${ruta})`;
  if (!m.ogImage) {
    check(nombreImagen, false, 'sin og:image');
  } else {
    const { respuesta: img, error: errorImg } = await pedir(m.ogImage);
    if (!img) {
      check(nombreImagen, false, `${new URL(m.ogImage).host} no resuelve: ${errorImg}`);
    } else {
      const buffer = Buffer.from(await img.arrayBuffer());
      const dim = dimensionesPng(buffer);
      check(
        nombreImagen,
        img.status === 200 && dim?.ancho === 1200 && dim?.alto === 630,
        `HTTP ${img.status} · ${dim ? `${dim.ancho}×${dim.alto}` : 'no es PNG'} · ${Math.round(buffer.length / 1000)} kB`,
      );
    }
  }

  // RNF-3.1 · la validación oficial, que es la que el requisito exige.
  try {
    const { errores, avisos, tipos } = await validarSchema(url);

    /*
     * Este criterio va PRIMERO y no es decorativo. Si el validador no alcanza la
     * URL —un `127.0.0.1`, un host detrás de autenticación—, responde sin nodos:
     * cero errores y cero avisos sobre cero datos. Sin esta comprobación, «sin
     * errores» pasaba en verde habiendo validado nada, que es el mismo falso
     * positivo que en T2 dejó el selector de tema sin ninguna opción marcada con
     * axe en cero hallazgos. Lo destapó la prueba de sensibilidad.
     */
    check(
      `RNF-3.1 · el validador reconoce el Event (${ruta})`,
      tipos.includes('Event'),
      tipos.length ? `tipos: ${tipos.join(', ')}` : 'el validador no leyó ningún dato',
    );

    check(
      `RNF-3.1 · validator.schema.org sin errores (${ruta})`,
      errores.length === 0,
      errores.length ? JSON.stringify(errores.slice(0, 2)) : `tipos: ${tipos.join(', ')}`,
    );
    check(
      `RNF-3.1 · validator.schema.org sin avisos (${ruta})`,
      avisos.length === 0,
      avisos.length ? JSON.stringify(avisos.slice(0, 2)) : '0 avisos',
    );
  } catch (e) {
    check(`RNF-3.1 · validator.schema.org responde (${ruta})`, false, e.message);
  }
}

// Las dos versiones se referencian entre sí sobre el host servido (RF-1.4).
if (meta.es && meta.en) {
  check(
    'RF-1.4 · cada versión canoniza su propia ruta',
    new URL(meta.es.canonical).pathname === '/' && new URL(meta.en.canonical).pathname === '/en/',
    `${new URL(meta.es.canonical).pathname} · ${new URL(meta.en.canonical).pathname}`,
  );
  check(
    'RNF-3.2 · cada versión sirve su propia imagen',
    meta.es.ogImage !== meta.en.ogImage,
    meta.es.ogImage === meta.en.ogImage ? 'comparten imagen' : 'una por idioma',
  );
}

/*
 * RNF-7.6 y RNF-7.7 en vivo.
 *
 * `verify:cabeceras` ya comprueba que `dist/` contenga la 404 y la CSP. Esto es otra
 * cosa: que el borde las **entregue**. Son dos fallos distintos y el de `dist/` no
 * detecta el segundo — `_headers` es un archivo que el proveedor puede ignorar, y
 * hasta el 2026-09-22 nadie en este proyecto había medido si Workers lo respeta.
 */
{
  const rutaInexistente = `${BASE}/esta-ruta-no-existe-${Date.now()}`;
  const { respuesta, error } = await pedir(rutaInexistente);
  if (!respuesta) {
    check('RNF-7.6 · una URL inexistente responde', false, error);
  } else {
    const cuerpo = await respuesta.text();
    check(
      'RNF-7.6 · una URL inexistente devuelve 404',
      respuesta.status === 404,
      `HTTP ${respuesta.status}`,
    );
    check(
      'RNF-7.6 · la 404 servida no está en blanco',
      cuerpo.length > 1000,
      `${cuerpo.length} bytes${cuerpo.length === 0 ? ' — página en blanco' : ''}`,
    );
    check(
      'RNF-7.6 · la 404 servida es la del sitio',
      /Error 404/.test(cuerpo) && cuerpo.includes('href="/en/"'),
      'con el mensaje y los dos enlaces',
    );
  }

  const { respuesta: raiz, error: errorRaiz } = await pedir(`${BASE}/`);
  if (!raiz) {
    check('RNF-7.7 · el borde entrega las cabeceras', false, errorRaiz);
  } else {
    const csp = raiz.headers.get('content-security-policy');
    check(
      'RNF-7.7 · el borde entrega la Content-Security-Policy',
      !!csp,
      csp ? `${csp.length} caracteres` : 'AUSENTE: el proveedor ignora dist/_headers',
    );
    check(
      "RNF-7.7 · la CSP servida no permite 'unsafe-inline' en script-src",
      !!csp && !/script-src[^;]*'unsafe-inline'/.test(csp),
      csp ? 'solo hashes' : 'sin CSP',
    );
    for (const [cabecera, esperado] of [
      ['x-content-type-options', 'nosniff'],
      ['x-frame-options', 'SAMEORIGIN'],
      ['referrer-policy', 'strict-origin-when-cross-origin'],
    ]) {
      const v = raiz.headers.get(cabecera);
      check(`RNF-7.7 · ${cabecera}`, v?.toLowerCase() === esperado.toLowerCase(), v ?? 'ausente');
    }
    /*
     * HSTS no sale de `_headers`: lo inyecta Cloudflare desde la configuración de la
     * zona, que NO está versionada. Por eso se comprueba aquí y no contra `dist/`: es
     * la única forma de notar que alguien lo apagó en el panel.
     */
    const hsts = raiz.headers.get('strict-transport-security');
    const edad = Number(hsts?.match(/max-age=(\d+)/)?.[1] ?? 0);
    check(
      'RNF-7.7 · HSTS activo (ajuste de zona, no versionado)',
      edad >= 15552000,
      hsts ?? 'ausente',
    );
  }

  const { respuesta: claro } = await pedir(`${BASE.replace('https://', 'http://')}/`, {
    redirect: 'manual',
  });
  check(
    'RNF-7.7 · http:// redirige a https://',
    !!claro && claro.status >= 300 && claro.status < 400,
    claro ? `HTTP ${claro.status} → ${claro.headers.get('location') ?? '?'}` : 'sin respuesta',
  );
}

/*
 * RNF-4.1 en vivo — «sin analítica, sin cookies y sin tipografías remotas».
 *
 * ESTE CRITERIO EXISTE POR UN FALLO REAL, no por precaución. El 2026-09-22, dos
 * segundos después de que la zona de Cloudflare activara, Cloudflare creó **solo** un
 * sitio de Web Analytics con `auto_install: true` y regla `host:* paths:*`, y empezó a
 * inyectar `static.cloudflareinsights.com/beacon.min.js` en todas las páginas
 * `[medido]`. Nadie lo pidió y ningún verificador lo vio.
 *
 * Por qué no lo vio nadie: **todos los demás verificadores miran `dist/`**, y esto no
 * está en `dist/`. Lo añade el borde, DESPUÉS del despliegue, y solo ante peticiones
 * que parecen de navegador —un `curl` por omisión no lo recibe—. De ahí el
 * `User-Agent`: sin él, este criterio pasaría en verde con el beacon puesto.
 *
 * Lo destapó la CSP al bloquearlo. Sin CSP habría seguido ahí indefinidamente.
 */
{
  const COMO_NAVEGADOR = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/141.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml',
  };
  const propio = new URL(BASE).host;

  for (const ruta of ['/', '/en/']) {
    // El parámetro evita que responda una copia en caché de antes del arreglo.
    const { respuesta, error } = await pedir(`${BASE}${ruta}?verificacion=${Date.now()}`, {
      headers: COMO_NAVEGADOR,
    });
    if (!respuesta) {
      check(`RNF-4.1 · sin terceros en el HTML servido (${ruta})`, false, error);
      continue;
    }
    const html = await respuesta.text();
    const terceros = [
      ...new Set(
        [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
          .map((m) => new URL(m[1]).host)
          .filter((h) => h !== propio),
      ),
    ];
    /*
     * Solo cuentan los SUBRECURSOS: `<script src>`, `<link href>`, `<img src>`,
     * `<iframe src>`. Los enlaces `<a href>` a las universidades y a los perfiles de
     * los expositores son navegación, no peticiones, y RNF-4.1 no los prohíbe.
     */
    const subrecursos = [
      ...new Set(
        [
          ...html.matchAll(/<(?:script|img|iframe)[^>]*\bsrc="(https?:\/\/[^"]+)"/g),
          ...html.matchAll(/<link[^>]*\bhref="(https?:\/\/[^"]+)"/g),
        ]
          .map((m) => new URL(m[1]).host)
          .filter((h) => h !== propio),
      ),
    ];
    check(
      `RNF-4.1 · el borde no inyecta terceros en ${ruta}`,
      subrecursos.length === 0,
      subrecursos.length === 0
        ? `0 subrecursos externos (${terceros.length} enlaces de navegación, permitidos)`
        : `INYECTADO: ${subrecursos.join(', ')}`,
    );
  }
}

console.log(`\nComprobación del sitio publicado — ${BASE}\n`);
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(54)} ${r.detalle}`);
}
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}`);

/*
 * Lo que este guion NO puede comprobar, y por eso queda escrito aquí: cómo se ve
 * la tarjeta al compartir el enlace en una plataforma real. Eso exige compartirlo
 * y mirarlo. Además, con `noindex, nofollow` puesto hay plataformas que suprimen
 * la previsualización, así que la prueba definitiva solo es posible con el dominio
 * definitivo y sin `noindex`.
 */
console.log('Queda fuera: la previsualización real al compartir. Exige mirarla.\n');
process.exit(fallos === 0 ? 0 : 1);
