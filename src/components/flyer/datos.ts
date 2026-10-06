/**
 * Lo que las láminas de difusión derivan de los datos del sitio. Nada se escribe a mano:
 * si cambia un expositor o la sede en `src/data/`, las piezas cambian al regenerarlas.
 *
 * ESCALA TIPOGRÁFICA DE LAS LÁMINAS, en px de lienzo (entre paréntesis, pt en un teléfono
 * de 390 pt, escala 0,361). El escalón más bajo es el piso de `PISO_FLYER`:
 *   31 rótulo y menciones (11,2) · 36 cuerpo (13) · 44 destacado (15,9) ·
 *   52 subtítulo (18,8) · 76 fecha (27,4) · 84 título de lámina (30,3).
 * Una lámina que necesite otro valor lo declara donde lo usa y dice por qué.
 */
import type { Contenido } from '~/data/contenido';
import type { LaminaFlyer } from '~/data/flyer';

/*
 * El descriptor del logo, tal cual lo trae el manual de marca 5.2. El logo dice «Beyond
 * Connectivity / Wireless Sensing», así que debajo solo va lo que el título oficial añade.
 */
const DESCRIPTOR_LOGO = 'Wireless Sensing';

export function datosFlyer(c: Contenido) {
  const i = c.title.indexOf(DESCRIPTOR_LOGO);
  const restoTitulo = i >= 0 ? c.title.slice(i + DESCRIPTOR_LOGO.length).trim() : c.title;

  /* El dominio sin esquema: es lo que la persona escribe, y en un PNG no hay enlace. */
  const dominio = new URL(import.meta.env.SITE ?? 'https://bcsensing.org').hostname;

  /*
   * Afiliación corta: solo se abrevian las instituciones cuya sigla registra el sitio
   * (`comun.ts`, `participants`) —UC, USACH, UTFSM, ALMA, UPB—, aprobado por Daniel el
   * 2026-10-01. Columbia y Nokia Bell Labs quedan como están: no tienen sigla, tienen un
   * nombre corto. El nombre completo sigue en el texto alternativo y en el sitio.
   */
  const siglas = c.participants.filter((p) => /^[A-Z]{2,}$/.test(p.shortName));
  const corta = (afiliacion: string) =>
    siglas.reduce((a, p) => a.replace(p.name, p.shortName), afiliacion);

  const expositores = (lista: Contenido['speakers']['international']) =>
    lista.map((e) => ({ ...e, afiliacionCorta: corta(e.affiliation) }));

  /*
   * El organizador, pedido por Daniel el 2026-10-01: Mauricio Rodríguez, director del
   * seminario. Sale del comité (`comun.ts`, `committee`) con el grado en la forma de cada
   * idioma —«Dr.» delante en español, «PhD» detrás en inglés—, la que ya usa el pie del sitio.
   */
  const director = c.committee.find((p) => p.grado === 'doctor');
  const grado = director ? c.ui.pie.grados[director.grado] : '';
  const organizador = director
    ? c.lang === 'es'
      ? `${grado} ${director.nombre}`
      : `${director.nombre}, ${grado}`
    : null;

  return {
    restoTitulo,
    dominio,
    organizador,
    internacionales: expositores(c.speakers.international),
    nacionales: expositores(c.speakers.national),
  };
}

/*
 * Texto alternativo de cada lámina, para pegar al publicar: Instagram y LinkedIn lo piden
 * por imagen. Dice lo que la lámina dice, con los nombres de institución completos.
 */
export function altFlyer(c: Contenido, lamina: LaminaFlyer) {
  const t = c.ui.flyer;
  const { dominio, organizador } = datosFlyer(c);
  const organiza = organizador ? ` ${t.organiza}: ${organizador}.` : '';
  const evento = `${c.title}. ${c.dates.label}, ${c.venue.name}, ${c.venue.country}.${organiza}`;
  const lista = [...c.speakers.international, ...c.speakers.national]
    .map((e) => `${e.name} (${e.affiliation})`)
    .join(', ');
  const qr = c.registro.url ? ` ${t.qr} (QR).` : '';
  const partes: Record<LaminaFlyer, string[]> = {
    portada: [evento, `${t.inscripciones} ${dominio}.`],
    historia: [evento, `${t.sticker}.`],
    expositores: [`${c.tituloCorto}, ${c.dates.label}. ${t.expositores}: ${lista}.`],
    inscripcion: [`${c.tituloCorto}, ${c.dates.label}. ${t.inscripcion}: ${t.escanea} ${dominio}.${qr}`, `${c.funding.mencion}.`],
    unica: [evento, `${t.expositores}: ${lista}.`, `${t.inscripciones} ${dominio}.${qr}`],
  };
  return partes[lamina].join(' ');
}
