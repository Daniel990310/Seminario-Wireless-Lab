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
  // React se usa solo como capa de renderizado para los componentes de Magic UI
  // (src/components/ui). La mayoría se renderiza en el servidor sin directiva
  // `client:*`, por lo que no envían JavaScript: sus animaciones son CSS. Solo
  // se hidratan los que necesitan medir el DOM o seguir el cursor.
  integrations: [sitemap(), react()],
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
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      provider: fontProviders.local(),
      // Solo el subconjunto `latin`: cubre todos los caracteres acentuados del
      // español y del inglés, así que `latin-ext` sería peso descargado en vano.
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/space-grotesk-latin.woff2'],
            weight: '300 700',
            style: 'normal',
          },
        ],
      },
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-body',
      provider: fontProviders.local(),
      options: {
        variants: [
          { src: ['./src/assets/fonts/inter-latin.woff2'], weight: '100 900', style: 'normal' },
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
