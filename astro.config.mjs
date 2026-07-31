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
 * previsualización se anuncie con su propia URL en lugar de apuntar a un
 * dominio que todavía no existe.
 *
 * Cuando el dominio institucional esté listo, basta con definir SITE_URL en el
 * panel del hosting (o cambiar PRODUCTION_SITE aquí abajo).
 */
export const PRODUCTION_SITE = 'https://seminario-wireless.pucv.cl';

const site =
  process.env.SITE_URL || // Anulación manual
  process.env.CF_PAGES_URL || // Cloudflare Pages
  process.env.DEPLOY_PRIME_URL || // Netlify: previsualización por rama
  process.env.URL || // Netlify: producción
  PRODUCTION_SITE;

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

  // React se usa solo como capa de renderizado. Los componentes se renderizan en
  // el servidor sin directiva `client:*`, por lo que no envían JavaScript.
  integrations: [
    // `i18n` en el sitemap emite las alternativas por idioma en cada URL (RF-1.8).
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Los componentes de Magic UI importan desde `@/lib/utils`.
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
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
