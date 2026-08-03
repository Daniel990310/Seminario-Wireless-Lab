// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/*
 * Dominio del sitio.
 *
 * `site` define las URLs absolutas del sitemap, del enlace canónico y de las
 * etiquetas Open Graph. Se resuelve desde el entorno para que un despliegue de
 * previsualización se anuncie con su propia URL en lugar de apuntar a un
 * dominio que todavía no existe.
 *
 * Cuando el dominio institucional esté listo, basta con definir SITE_URL en el
 * panel del hosting (o cambiar PRODUCTION_SITE aquí abajo).
 */
export const PRODUCTION_SITE = 'https://seminario-wireless.pucv.cl';

const sitioDeclarado =
  process.env.SITE_URL || // Anulación manual
  process.env.CF_PAGES_URL || // Cloudflare Pages
  process.env.DEPLOY_PRIME_URL || // Netlify: previsualización por rama
  process.env.URL; // Netlify: producción

const site = sitioDeclarado || PRODUCTION_SITE;

/*
 * ¿La URL de arriba salió del entorno, o es el respaldo?
 *
 * Importa para decidir si el sitio puede indexarse. Cuando nadie declara la
 * URL, `site` cae a `PRODUCTION_SITE` y el sitio **cree** estar en producción
 * aunque esté publicado en otra parte: el enlace canónico apunta a un dominio
 * que quizá ni existe, y el `noindex` de previsualización se apaga.
 *
 * Pasó de verdad en el primer despliegue a Cloudflare Workers, el 2026-07-31:
 * `CF_PAGES_URL` solo la define Pages, no Workers, así que sin `SITE_URL` el
 * build salió creyéndose producción. Ver `ESTADO.md` §6c.
 *
 * `BaseLayout` usa esta bandera para forzar `noindex` cuando la URL es el
 * respaldo. Es defensa en profundidad: preferimos no ser indexados por error
 * antes que ser indexados con URLs rotas.
 */
export const SITE_ES_RESPALDO = !sitioDeclarado;

export default defineConfig({
  site,
  output: 'static',

  /*
   * Sitio bilingüe (RF-1, T7).
   *
   * `prefixDefaultLocale: false` deja el español en la raíz y el inglés en
   * `/en/`. Se prefiere a prefijar ambos idiomas porque la organización es
   * chilena y `/` es la dirección que se va a repartir e imprimir; obligar a
   * `/es/` añadiría una redirección permanente a la ruta más usada.
   *
   * NO se activa `redirectToDefaultLocale` ni ninguna detección por navegador:
   * RF-1.1 exige que cada versión sea alcanzable por sí misma, sin depender de
   * lo que el navegador declare.
   */
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  /*
   * Sin integración de framework de interfaz. La había —`@astrojs/react`, para
   * shadcn/ui según D6— y se retiró el 2026-07-31: no quedaba ningún `.tsx` ni
   * ninguna directiva `client:` desde T3, y la integración emitía en cada build su
   * runtime de cliente de 59,5 kB comprimidos que ningún archivo de `dist`
   * referenciaba. Si alguna vez hace falta una isla, se reinstala en un comando; lo
   * que no se sostiene es mantener la integración sin un componente que la use, que
   * es la misma regla que RF-6.4 aplica a las primitivas de Radix.
   */
  integrations: [
    // `i18n` en el sitemap emite las alternativas por idioma en cada URL (RF-1.8).
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
      // `/og/` son los lienzos de los que se capturan las imágenes para
      // compartir: no son páginas para visitar y no deben indexarse.
      filter: (pagina) => !pagina.includes('/og/'),
    }),
  ],
  /*
   * Aquí vivía un alias `'@' → ./src`, para que los componentes de Magic UI
   * importaran `@/lib/utils`. Magic UI salió en T3 y T5, y `src/lib/utils.ts` no lo
   * usaba nadie. Se retira con el alias, que además estaba construido con
   * `new URL(...).pathname`: la forma que en Windows da `/C:/Users/…` y que
   * `AGENTS.md` prohíbe justamente por eso.
   */
  vite: {
    plugins: [tailwindcss()],
  },
  // Fuentes variables auto-hospedadas desde `src/assets/fonts`.
  //
  // Se usa el proveedor `local` en lugar de Google/Fontsource a propósito: el
  // build no depende de la red ni de un CDN, es reproducible en cualquier
  // entorno de despliegue y ningún visitante hace peticiones a terceros. Astro
  // igualmente calcula métricas de fallback (menos CLS) y emite el preload.
  fonts: [
    {
      name: 'Crimson Pro',
      cssVariable: '--font-display',
      provider: fontProviders.local(),
      // Solo el subconjunto `latin`: cubre todos los caracteres acentuados del
      // español y del inglés, así que `latin-ext` sería peso descargado en vano.
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
