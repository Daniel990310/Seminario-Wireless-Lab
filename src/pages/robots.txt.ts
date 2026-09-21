/**
 * `/robots.txt`, generado en el build (RNF-3.5).
 *
 * Por qué es un endpoint y no un archivo en `public/`: todo lo que vive en
 * `public/` se copia **verbatim** a `dist/`, así que un `robots.txt` escrito a
 * mano anunciaría el sitemap de producción también desde una URL de
 * previsualización, e invitaría a indexar una copia provisional. Es exactamente
 * el fallo de RNF-7.2 con otra cara: un archivo que no sabe dónde está publicado.
 *
 * La decisión de «esto es producción» sale de la misma fuente que la del
 * `noindex` de `BaseLayout` —`PRODUCTION_HOST` más la bandera de respaldo—, no de
 * una copia. Dos reglas que deben coincidir siempre y se escriben una vez.
 */
import type { APIRoute } from 'astro';
import { PRODUCTION_HOST, SITE_ES_RESPALDO } from '../../astro.config.mjs';

export const GET: APIRoute = ({ site }) => {
  /*
   * Tres condiciones, y las tres tienen que darse. `site` puede ser `undefined`
   * si nadie configuró el dominio; `SITE_ES_RESPALDO` marca el caso en que el
   * build cayó al valor por omisión creyéndose producción, que es lo que pasó el
   * 2026-07-31 al desplegar en Workers sin `SITE_URL`.
   */
  const enProduccion = !!site && site.host === PRODUCTION_HOST && !SITE_ES_RESPALDO;

  const cuerpo = enProduccion
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        // La única forma de descubrimiento del sitemap que los rastreadores
        // usan de verdad. El `<link rel="sitemap">` del <head> no lo es.
        `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
        '',
      ].join('\n')
    : [
        '# URL provisional: este despliegue no debe indexarse.',
        '# Ver RNF-7.2 y RNF-7.3.',
        'User-agent: *',
        'Disallow: /',
        '',
      ].join('\n');

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
