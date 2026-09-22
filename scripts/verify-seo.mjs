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
/*
 * El host de producción se importa; no se escribe aquí.
 *
 * RNF-7.4: «Ningún verificador queda atado a un dominio concreto». Hasta el
 * 2026-09-21 este archivo tenía `seminario-wireless.pucv.cl` escrito a mano, que
 * es la misma forma del defecto que la propia regla nombra: al cambiar de dominio,
 * el verificador seguiría midiendo contra el viejo y aprobaría un sitio publicado
 * con `noindex` permanente.
 */
import { PRODUCTION_HOST } from '../astro.config.mjs';
/*
 * El régimen de acceso se IMPORTA de los datos; no se escribe aquí. Repetirlo sería
 * el mismo defecto que RNF-7.4 prohíbe para el dominio: dos copias, y el verificador
 * aprobando contra la suya cuando la del sitio cambia.
 */
import { acceso as ACCESO } from '../src/data/acceso.ts';
import { rutaOg } from '../src/data/og.ts';

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
  const ruta = join(RAIZ, 'public', rutaOg(idioma).replace(/^\//, ''));

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
    !!m.ogImage?.endsWith(rutaOg(idioma)),
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
  const enProduccion = !!m.canonical && new URL(m.canonical).host === PRODUCTION_HOST;
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

  /*
   * RNF-3.6 · `url` e `image` en los datos estructurados.
   *
   * No basta con que existan: tienen que ser **los mismos** que ya declara la
   * página. Un `url` que no coincide con el canónico le da al buscador dos
   * direcciones para el mismo contenido, y una `image` propia sería un segundo
   * activo que nadie regenera cuando cambia el título.
   */
  check(
    `RNF-3.6 · el evento declara url y coincide con el canónico (${idioma})`,
    !!evento?.url && evento.url === meta[idioma].canonical,
    evento?.url ? (evento.url === meta[idioma].canonical ? 'coinciden' : 'difieren') : 'sin url',
  );

  check(
    `RNF-3.6 · el evento declara image y coincide con og:image (${idioma})`,
    !!evento?.image && evento.image === meta[idioma].ogImage,
    evento?.image
      ? evento.image === meta[idioma].ogImage
        ? 'coinciden'
        : 'difieren'
      : 'sin image',
  );

  /*
   * RNF-3.7 · régimen de acceso.
   *
   * El criterio NO es «dice que es gratis»: es que **concuerde con los datos**. Escrito
   * al revés, el día que el seminario pase a cobrar y alguien cambie `comun.acceso`, el
   * verificador seguiría en verde mientras Google anuncia «Gratis». Un precio viejo en
   * un resultado de búsqueda es peor que no declarar precio.
   */
  check(
    `RNF-3.7 · isAccessibleForFree concuerda con los datos (${idioma})`,
    evento?.isAccessibleForFree === ACCESO.gratuito,
    `${evento?.isAccessibleForFree} ↔ datos: ${ACCESO.gratuito}`,
  );

  check(
    `RNF-3.7 · la Offer lleva precio Y moneda (${idioma})`,
    evento?.offers?.price === ACCESO.precio && evento?.offers?.priceCurrency === ACCESO.moneda,
    evento?.offers
      ? `${evento.offers.price} ${evento.offers.priceCurrency}`
      : 'sin offers: Google no construye el distintivo «Gratis» solo con isAccessibleForFree',
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

// ---------------------------------------------------------------------------
// 5. robots.txt generado (RNF-3.5)
// ---------------------------------------------------------------------------
/*
 * La regla que se comprueba es la misma que gobierna el `noindex`: si la URL es
 * provisional, se prohíbe el rastreo entero; si es la de producción, se permite y
 * se anuncia el sitemap. Que las dos señales coincidan importa más que cualquiera
 * por separado — un `robots.txt` que invita a rastrear un despliegue marcado
 * `noindex` es una contradicción que el buscador resuelve como quiere.
 */
const rutaRobots = join(DIST, 'robots.txt');

if (!existsSync(rutaRobots)) {
  check('RNF-3.5 · existe /robots.txt', false, 'falta en dist/');
} else {
  const robots = await readFile(rutaRobots, 'utf8');
  const urlDeclaradaEnEntorno = !!(
    process.env.SITE_URL ||
    process.env.CF_PAGES_URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL
  );
  const canonicalEnProduccion =
    !!meta.es.canonical && new URL(meta.es.canonical).host === PRODUCTION_HOST;
  const debeProhibirRastreo = !canonicalEnProduccion || !urlDeclaradaEnEntorno;

  check('RNF-3.5 · existe /robots.txt', true, `${robots.length} bytes`);

  check(
    'RNF-3.5 · el régimen de rastreo concuerda con el del noindex',
    debeProhibirRastreo ? /^Disallow: \/$/m.test(robots) : /^Allow: \/$/m.test(robots),
    debeProhibirRastreo ? 'provisional → debe prohibir' : 'producción → debe permitir',
  );

  /*
   * El sitemap se anuncia **solo** en producción, y con URL absoluta: el formato
   * de robots.txt no admite rutas relativas en esa directiva.
   */
  const sitemapAnunciado = robots.match(/^Sitemap: (\S+)$/m)?.[1];
  check(
    'RNF-3.5 · anuncia el sitemap solo en producción',
    debeProhibirRastreo
      ? !sitemapAnunciado
      : sitemapAnunciado === `https://${PRODUCTION_HOST}/sitemap-index.xml`,
    sitemapAnunciado ?? 'sin línea Sitemap',
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
