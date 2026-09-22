// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/*
 * Dominio del sitio.
 *
 * `site` define las URLs absolutas del sitemap, del enlace canónico y de las
 * etiquetas Open Graph. Se resuelve desde el entorno para que un despliegue de
 * previsualización se anuncie con su propia URL en lugar de apuntar al dominio
 * de producción.
 *
 * Desde el 2026-09-21 esto es un dominio comprado y en uso, no una previsión:
 * la DTI de la PUCV no respondió por el subdominio institucional y el cliente
 * registró `bcsensing.org` —«BC» por *Beyond Connectivity*, el título corto—.
 * Ver A6 en `specs/001-mejora-calidad/requirements.md`. Si el subdominio PUCV
 * llega más adelante, redirige **hacia aquí**: mover el canónico después de que
 * el sitio esté indexado cuesta más que sostener la redirección.
 */
export const PRODUCTION_SITE = 'https://bcsensing.org';

/*
 * El host de producción, derivado y no escrito a mano.
 *
 * RNF-7.4 prohíbe que nada quede atado a un dominio concreto, y hasta hoy había
 * **dos** copias literales de `seminario-wireless.pucv.cl` —en `BaseLayout.astro`
 * y en `verify-seo.mjs`— que decidían si el sitio se indexa. Con dos literales, un
 * cambio de dominio que olvide uno deja el sitio publicado con `noindex` para
 * siempre, y el verificador aprobándolo. Ambos importan ahora esta constante.
 */
export const PRODUCTION_HOST = new URL(PRODUCTION_SITE).host;

const sitioDeclarado =
  process.env.SITE_URL || // AnulaciÃ³n manual
  process.env.CF_PAGES_URL || // Cloudflare Pages
  process.env.DEPLOY_PRIME_URL || // Netlify: previsualizaciÃ³n por rama
  process.env.URL; // Netlify: producciÃ³n

const site = sitioDeclarado || PRODUCTION_SITE;

/*
 * Â¿La URL de arriba saliÃ³ del entorno, o es el respaldo?
 *
 * Importa para decidir si el sitio puede indexarse. Cuando nadie declara la
 * URL, `site` cae a `PRODUCTION_SITE` y el sitio **cree** estar en producciÃ³n
 * aunque estÃ© publicado en otra parte: el enlace canÃ³nico apunta a un dominio
 * que quizÃ¡ ni existe, y el `noindex` de previsualizaciÃ³n se apaga.
 *
 * PasÃ³ de verdad en el primer despliegue a Cloudflare Workers, el 2026-07-31:
 * `CF_PAGES_URL` solo la define Pages, no Workers, asÃ­ que sin `SITE_URL` el
 * build saliÃ³ creyÃ©ndose producciÃ³n. Ver `ESTADO.md` Â§6c.
 *
 * `BaseLayout` usa esta bandera para forzar `noindex` cuando la URL es el
 * respaldo. Es defensa en profundidad: preferimos no ser indexados por error
 * antes que ser indexados con URLs rotas.
 */
export const SITE_ES_RESPALDO = !sitioDeclarado;

/**
 * Panel de ajuste visual en `/ajustar`, **solo con `astro dev`**.
 *
 * La ruta se inyecta aqui y no existe un archivo en `src/pages/`: una pagina de
 * `src/pages/` se construye siempre y terminaria publicada en `dist/`. Con la
 * inyeccion condicionada a `command === 'dev'`, en produccion la ruta no esta
 * protegida —**no existe**—, que es la unica forma de no anadir superficie.
 *
 * Que hace el panel esta explicado en `src/dev/ajustar.astro`.
 */
function panelDeAjuste() {
  /** @type {import('astro').AstroIntegration} */
  const integracion = {
    name: 'panel-de-ajuste',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({ pattern: '/ajustar', entrypoint: './src/dev/ajustar.astro' });
      },
    },
  };
  return integracion;
}

export default defineConfig({
  site,
  output: 'static',

  /*
   * Sitio bilingÃ¼e (RF-1, T7).
   *
   * `prefixDefaultLocale: false` deja el espaÃ±ol en la raÃ­z y el inglÃ©s en
   * `/en/`. Se prefiere a prefijar ambos idiomas porque la organizaciÃ³n es
   * chilena y `/` es la direcciÃ³n que se va a repartir e imprimir; obligar a
   * `/es/` aÃ±adirÃ­a una redirecciÃ³n permanente a la ruta mÃ¡s usada.
   *
   * NO se activa `redirectToDefaultLocale` ni ninguna detecciÃ³n por navegador:
   * RF-1.1 exige que cada versiÃ³n sea alcanzable por sÃ­ misma, sin depender de
   * lo que el navegador declare.
   */
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  /*
   * `@astrojs/react` estÃ¡ de vuelta, por decisiÃ³n de Daniel del 2026-08-06 (D11).
   *
   * Historia, porque importa para no repetirla: la integraciÃ³n existÃ­a por D6, para
   * shadcn/ui, y se retirÃ³ el 2026-07-31 al no quedar ningÃºn `.tsx` ni ninguna
   * directiva `client:` desde T3 â€”emitÃ­a en cada build un runtime de cliente de
   * 59,5 kB comprimidos que ningÃºn archivo de `dist` referenciaba. Vuelve ahora
   * porque D11 adopta Framer Motion, cuya API de componentes (`motion/react`) es
   * React y no funciona sin ella.
   *
   * La regla que la retirÃ³ sigue vigente y ahora aplica a esta reinstalaciÃ³n: **la
   * integraciÃ³n sin un componente que la use no se sostiene.** Es la misma que
   * RF-6.4 aplica a las primitivas de Radix. Mientras no exista una isla real, esto
   * es peso latente, y D11 anota el nÃºmero medido para que la decisiÃ³n de
   * conservarla se tome con la cifra delante, no de memoria.
   */
  integrations: [
    react(),
    // `i18n` en el sitemap emite las alternativas por idioma en cada URL (RF-1.8).
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
      // `/og/` son los lienzos de los que se capturan las imágenes para
      // compartir: no son páginas para visitar y no deben indexarse. Y
      // `/robots.txt` es un endpoint, no una página: listarlo en el sitemap sería
      // pedirle al buscador que indexe el archivo que le da las instrucciones.
      filter: (pagina) => !pagina.includes('/og/') && !pagina.endsWith('/robots.txt'),
    }),
    // Solo se activa con `astro dev`; ver la nota sobre `panelDeAjuste` arriba.
    panelDeAjuste(),
  ],
  /*
   * AquÃ­ vivÃ­a un alias `'@' â†’ ./src`, para que los componentes de Magic UI
   * importaran `@/lib/utils`. Magic UI saliÃ³ en T3 y T5, y `src/lib/utils.ts` no lo
   * usaba nadie. Se retira con el alias, que ademÃ¡s estaba construido con
   * `new URL(...).pathname`: la forma que en Windows da `/C:/Users/â€¦` y que
   * `AGENTS.md` prohÃ­be justamente por eso.
   */
  vite: {
    /*
     * Por qué existe este límite, y por qué 12 kB.
     *
     * Astro compila y agrupa cada `<script>` de componente (lo hace desde v0.26),
     * y **decide inlinarlo o emitirlo como archivo según este umbral**. Con el
     * valor por omisión —4 kB— el guion de `SensingPersistence` se pasaba, salía
     * como `_astro/…js` y el navegador volvía a pedir un script: eso rompía el
     * criterio de T3 «el navegador no pide ningún .js», que estaba en verde desde
     * que se retiró React. `[medido: 2026-08-03, verify:red]`
     *
     * La alternativa era `is:inline`, y sale peor: la documentación de Astro dice
     * que ese modo **no transforma TypeScript** ni resuelve importaciones, así que
     * habría que reescribir en JavaScript plano el guion más complejo del proyecto
     * y perder `astro check` sobre él. `[verificado: Astro, directives-reference y
     * client-side-scripts, 2026-08-03]`
     *
     * 12 kB y no más: la hoja de estilos son 62,8 kB sin comprimir y tiene que
     * seguir siendo un archivo aparte —`build.inlineStylesheets: 'auto'` usa este
     * mismo umbral—, porque se comparte entre las dos páginas y así se cachea una
     * vez. Y no menos: el guion agrupado no cabía en 4 kB. El precio de subirlo es
     * que cualquier activo importado por debajo de 12 kB pasará a `data:` en vez de
     * a archivo; si algún día se importa una imagen de ese tamaño, hay que
     * comprobar que eso siga siendo lo que se quiere.
     *
     * El peso no cambia por inlinar: 154,9 kB de primera carga en los dos casos.
     * Son los mismos bytes, en el HTML en vez de en un archivo. `[medido]`
     */
    build: { assetsInlineLimit: 12000 },
    plugins: [tailwindcss()],
  },
  // Fuentes variables auto-hospedadas desde `src/assets/fonts`.
  //
  // Se usa el proveedor `local` en lugar de Google/Fontsource a propÃ³sito: el
  // build no depende de la red ni de un CDN, es reproducible en cualquier
  // entorno de despliegue y ningÃºn visitante hace peticiones a terceros. Astro
  // igualmente calcula mÃ©tricas de fallback (menos CLS) y emite el preload.
  fonts: [
    {
      name: 'Crimson Pro',
      cssVariable: '--font-display',
      provider: fontProviders.local(),
      // Solo el subconjunto `latin`: cubre todos los caracteres acentuados del
      // espaÃ±ol y del inglÃ©s, asÃ­ que `latin-ext` serÃ­a peso descargado en vano.
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/crimson-pro-latin.woff2'],
            weight: '200 900',
            style: 'normal',
          },
        ],
      },
      fallbacks: ['ui-serif', 'Georgia', 'serif'],
    },
    {
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--font-body',
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/atkinson-hyperlegible-next-latin.woff2'],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/jetbrains-mono-latin.woff2'],
            weight: '100 800',
            style: 'normal',
          },
        ],
      },
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});


