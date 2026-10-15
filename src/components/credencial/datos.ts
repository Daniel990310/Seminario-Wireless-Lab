/**
 * Credenciales del evento (RF-36): qué credenciales hay y de qué color va cada categoría.
 * Las pidió el profesor por Daniel el 2026-10-15: 10 × 14 cm vertical, en inglés, cuatro
 * categorías, con nombre impreso y un lote en blanco.
 *
 * Aquí solo van nombres que el sitio ya publica: expositores y comité. Los de las personas
 * inscritas son datos personales y **no pasan por el sitio ni por el repositorio**: el
 * generador los escribe sobre la credencial en blanco, en el navegador, al capturar
 * (`scripts/generar-credenciales.mjs --inscritos`), y las deja en una carpeta ignorada.
 */
import { datosFlyer } from '~/components/flyer/datos';
import type { Contenido } from '~/data/contenido';

export type CategoriaCredencial = 'expositor' | 'organizacion' | 'asistente' | 'apoyo';

/*
 * Color de la banda de cada categoría: lo que distingue a distancia quién es quién. Los tres
 * primeros salen de la paleta del sitio; el verde azulado del apoyo no está en ella, porque
 * hacía falta un cuarto tono que no se confunda con los otros tres `[supuesto: elegido aquí]`.
 * Contraste del texto sobre la banda: 9,1:1 · 11,6:1 · 13,4:1 · 6,0:1 `[calculado, WCAG 2]`.
 */
export const COLOR_CATEGORIA: Record<CategoriaCredencial, { fondo: string; texto: string }> = {
  expositor: { fondo: 'var(--gold-400)', texto: 'var(--ink-900)' },
  organizacion: { fondo: 'var(--navy-700)', texto: 'var(--pure-white)' },
  asistente: { fondo: 'var(--slate-100)', texto: 'var(--navy-900)' },
  apoyo: { fondo: '#1f6f66', texto: 'var(--pure-white)' },
};

export interface Credencial {
  id: string;
  categoria: CategoriaCredencial;
  /** Sin nombre, la credencial sale en blanco, con líneas para escribirlo a mano. */
  nombre?: string;
  afiliacion?: string;
}

/* El identificador sale del apellido: estable si cambia el orden de la nómina. */
const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function rotuloCategoria(c: Contenido, categoria: CategoriaCredencial) {
  const r = c.ui.credencial;
  return { expositor: r.expositor, organizacion: c.ui.pie.comite, asistente: r.asistente, apoyo: r.apoyo }[categoria];
}

export function credenciales(c: Contenido): Credencial[] {
  // La afiliación corta de las piezas (siglas que el sitio registra): en una credencial cabe
  // en un renglón; «Atacama Large Millimeter/submillimeter Array (ALMA)» ocupaba dos.
  const { internacionales, nacionales } = datosFlyer(c);
  const expositores = [...internacionales, ...nacionales].map((e) => ({
    id: `expositor-${e.id}`,
    categoria: 'expositor' as const,
    nombre: e.name,
    afiliacion: e.afiliacionCorta,
  }));
  // Sin grado: en una credencial se lee el nombre; el grado del comité está en el sitio.
  const [pucv] = c.organizers;
  const comite = c.committee.map((p) => ({
    id: `organizacion-${slug(p.nombre)}`,
    categoria: 'organizacion' as const,
    nombre: p.nombre,
    afiliacion: pucv.shortName,
  }));
  const enBlanco = (Object.keys(COLOR_CATEGORIA) as CategoriaCredencial[]).map((categoria) => ({ id: `${categoria}-en-blanco`, categoria }));
  return [...expositores, ...comite, ...enBlanco];
}
