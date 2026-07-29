// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Ajustar `site` al dominio definitivo antes de publicar: define las URLs
// absolutas del sitemap y de las etiquetas Open Graph.
export default defineConfig({
  site: 'https://seminario-wireless.pucv.cl',
  output: 'static',
  integrations: [sitemap()],
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
