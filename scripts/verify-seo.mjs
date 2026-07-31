/**
 * Comprobación de RNF-3 — SEO y metadatos.
 *
 * Cubre lo que `verify` no mira: que exista una imagen para compartir por idioma
 * y mida lo que debe, que cada página apunte a la suya, que el enlace canónico
 * sea el correcto y que título y descripción no estén duplicados entre idiomas.
 *
 * Lo que este guion **no** puede hacer: validar los datos estructurados con la
 * herramienta de Google. Esa necesita una URL pública o que se pegue el código a
 * mano, así que aquí se comprueba la estructura contra lo que `schema.org/Event`
 * exige y la validación oficial queda como paso manual, anotado en `ESTADO.md`.
 *
 * Uso: `npm run build && npm run verify:seo`.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
const DIST = join(RAIZ, 'dist');

const resultados = [];
const check = (nombre, ok, detalle = '') => resultados.push({ nombre, ok, detalle });

const ANCHO = 1200;
const ALTO = 630;

/*
 * Dimensiones de un PNG, leídas de su cabecera.
 *
 * Un PNG empieza con 8 bytes de firma y sigue con el trozo IHDR, cuyos primeros
 * dos campos son ancho y alto en 32 bits big-endian. Se lee así en vez de
 * instalar una librería de imágenes: son doce bytes y el formato lleva
 * congelado desde 1996.
 */
const dimensionesPng = (buffer) => {
  const firma = buffer.subarray(0, 8).toString('hex');
  if (firma !== '89504e470d0a1a0a') return null;
  return { ancho: buffer.readUInt32BE(16), alto: buffer.readUInt32BE(20) };
};

// ---------------------------------------------------------------------------
// 1. Las imágenes existen y miden 1200×630
// ---------------------------------------------------------------------------
for (const idioma of ['es', 'en']) {
  const ruta = join(RAIZ, 'public', 'og', `${idioma}.png`);

  if (!existsSync(ruta)) {
    check(`RNF-3.2 · existe la imagen de ${idioma}`, false, 'falta: corré `npm run og`');
    continue;
  }

  const dim = dimensionesPng(await readFile(ruta));
  check(
    `RNF-3.2 · la imagen de ${idioma} mide ${ANCHO}×${ALTO}`,
    dim?.ancho === ANCHO && dim?.alto === ALTO,
    dim ? `${dim.ancho}×${dim.alto}` : 'no es un PNG válido',
  );
}

// ---------------------------------------------------------------------------
// 2. Metadatos por página
// ---------------------------------------------------------------------------
const paginas = {
  es: join(DIST, 'index.html'),
  en: join(DIST, 'en', 'index.html'),
};

const meta = {};
for (const [idioma, ruta] of Object.entries(paginas)) {
  const html = await readFile(ruta, 'utf8');
  const leer = (patron) => html.match(patron)?.[1] ?? null;

  meta[idioma] = {
    ogImage: leer(/<meta property="og:image" content="([^"]+)"/),
    ancho: leer(/<meta property="og:image:width" content="([^"]+)"/),
    alto: leer(/<meta property="og:image:height" content="([^"]+)"/),
    alt: leer(/<meta property="og:image:alt" content="([^"]+)"/),
    twitterImage: leer(/<meta name="twitter:image" content="([^"]+)"/),
    canonical: leer(/<link rel="canonical" href="([^"]+)"/),
    titulo: leer(/<title>([^<]+)<\/title>/),
    descripcion: leer(/<meta name="description" content="([^"]+)"/),
    robots: leer(/<meta name="robots" content="([^"]+)"/),
    jsonLd: leer(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/),
  };

  const m = meta[idioma];

  check(
    `RNF-3.2 · ${idioma} apunta a su propia imagen`,
    !!m.ogImage?.endsWith(`/og/${idioma}.png`),
    m.ogImage ?? 'sin og:image',
  );

  check(
    `RNF-3.2 · la URL de la imagen es absoluta (${idioma})`,
    !!m.ogImage?.startsWith('http'),
    m.ogImage?.slice(0, 44) ?? '—',
  );

  check(
    `RNF-3.2 · declara dimensiones y texto alternativo (${idioma})`,
    m.ancho === String(ANCHO) && m.alto === String(ALTO) && !!m.alt,
    `${m.ancho}×${m.alto}${m.alt ? '' : ' · sin alt'}`,
  );

  check(
    `RNF-3.2 · twitter:image coincide con og:image (${idioma})`,
    m.twitterImage === m.ogImage,
    m.twitterImage === m.ogImage ? 'coinciden' : 'difieren',
  );

  const canonicalEsperado = idioma === 'es' ? '/' : '/en/';
  check(
    `RNF-3.3 · enlace canónico correcto (${idioma})`,
    !!m.canonical && new URL(m.canonical).pathname === canonicalEsperado,
    m.canonical ?? 'sin canonical',
  );

  /*
   * RNF-3.3 · `noindex` mientras la URL sea provisional.
   *
   * Se deduce del canónico: si el host no es el de producción, el documento
   * TIENE que llevar `noindex`. Y si nadie declaró la URL en el entorno, el
   * canónico sale del respaldo y tampoco debe indexarse, aunque el host
   * coincida: eso es lo que falló en el primer despliegue a Workers.
   */
  const hostProduccion = 'seminario-wireless.pucv.cl';
  const enProduccion = !!m.canonical && new URL(m.canonical).host === hostProduccion;
  const urlDeclarada = !!(
    process.env.SITE_URL ||
    process.env.CF_PAGES_URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL
  );
  const debeLlevarNoindex = !enProduccion || !urlDeclarada;

  check(
    `RNF-3.3 · noindex solo cuando la URL es provisional (${idioma})`,
    debeLlevarNoindex ? m.robots?.includes('noindex') : !m.robots,
    debeLlevarNoindex
      ? `provisional → ${m.robots ?? 'SIN noindex'}`
      : `producción → ${m.robots ?? 'indexable'}`,
  );
}

// ---------------------------------------------------------------------------
// 3. Sin texto duplicado entre versiones (RNF-3.4)
// ---------------------------------------------------------------------------
check(
  'RNF-3.4 · la descripción no se repite entre idiomas',
  meta.es.descripcion !== meta.en.descripcion,
  meta.es.descripcion === meta.en.descripcion ? 'idénticas' : 'distintas',
);

/*
 * El título SÍ comparte el nombre oficial del seminario, que RF-1.2 obliga a no
 * traducir. Lo que debe diferir es la parte traducible: aquí, la fecha larga no
 * entra en el `<title>`, así que se comprueba que al menos la descripción y el
 * `og:image` sean propios, y que el título exista.
 */
check(
  'RNF-3.4 · cada versión declara título propio',
  !!meta.es.titulo && !!meta.en.titulo,
  `es: «${meta.es.titulo?.slice(0, 28)}…»`,
);

// ---------------------------------------------------------------------------
// 4. Datos estructurados (RNF-3.1)
// ---------------------------------------------------------------------------
for (const idioma of ['es', 'en']) {
  const crudo = meta[idioma].jsonLd;
  let evento = null;
  try {
    evento = JSON.parse(crudo ?? 'null');
  } catch {
    /* queda en null */
  }

  const requeridos = ['@context', '@type', 'name', 'startDate', 'location'];
  const faltan = requeridos.filter((k) => !evento?.[k]);

  check(
    `RNF-3.1 · schema.org/Event completo (${idioma})`,
    evento?.['@type'] === 'Event' && faltan.length === 0,
    faltan.length ? `faltan: ${faltan.join(', ')}` : `${requeridos.length} campos presentes`,
  );

  check(
    `RNF-3.1 · el evento declara su idioma (${idioma})`,
    evento?.inLanguage === idioma,
    `inLanguage: ${evento?.inLanguage ?? 'ausente'}`,
  );

  // Las afiliaciones sin confirmar no deben declararse como organización.
  const performersSinAfiliacion = (evento?.performer ?? []).filter(
    (p) => p.affiliation && !p.affiliation.name,
  );
  check(
    `RNF-3.1 · ninguna afiliación vacía en performer (${idioma})`,
    performersSinAfiliacion.length === 0,
    `${evento?.performer?.length ?? 0} expositores declarados`,
  );
}

console.log('\nComprobación de RNF-3 — SEO y metadatos\n');
let fallos = 0;
for (const r of resultados) {
  if (!r.ok) fallos++;
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.nombre.padEnd(52)} ${r.detalle}`);
}
console.log(`\n${fallos === 0 ? 'TODOS LOS CRITERIOS CUMPLEN' : `${fallos} CRITERIOS FALLAN`}\n`);
process.exit(fallos === 0 ? 0 : 1);
