/**
 * Lo que las láminas de difusión derivan de los datos del sitio. Nada se escribe a mano:
 * si cambia un expositor o la sede en `src/data/`, las piezas cambian al regenerarlas.
 *
 * ESCALA TIPOGRÁFICA DE LAS LÁMINAS, en px de lienzo (entre paréntesis, pt en un teléfono
 * de 390 pt, escala 0,361). El escalón más bajo es el piso de `PISO_FLYER`:
 *   31 rótulo y afiliación (11,2) · 34 nombre de expositor (12,3) · 36 cuerpo (13) ·
 *   44 destacado (15,9) · 52 subtítulo (18,8) · 64 fecha compacta (23,1) ·
 *   84 título de lámina (30,3) · 100 fecha de portada (36,1).
 * La franja de marcas tiene su propio piso, `PISO_PIE_FLYER` (24). Una lámina que necesite
 * otro valor lo declara donde lo usa y dice por qué.
 */
import type { Institucion, Logo } from '~/data/comun';
import type { Contenido } from '~/data/contenido';
import type { LaminaFlyer } from '~/data/flyer';

/*
 * El descriptor del logo, tal cual lo trae el manual de marca 5.2. El logo dice «Beyond
 * Connectivity / Wireless Sensing», así que debajo solo va lo que el título oficial añade.
 */
const DESCRIPTOR_LOGO = 'Wireless Sensing';

export interface ParticipanteFlyer {
  /** Sigla o nombre corto: lo que se declara en `data-participante` y espera RF-26.3. */
  nombre: string;
  nombreCompleto: string;
  logo?: Logo;
  escala: number;
}

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

  /*
   * Fila de instituciones participantes del sitio (Mauricio, 2026-10-08). Sobre el fondo
   * oscuro, la variante oscura si la hay. Una sin logo no se filtra aquí: `Participantes`
   * la omite, y el generador lo detecta porque espera a todas por nombre (RF-26.3).
   */
  const instituciones: readonly Institucion[] = c.participants;
  const participantes: ParticipanteFlyer[] = instituciones.map((p) => ({
    nombre: p.shortName,
    nombreCompleto: p.name,
    logo: p.logoOscuro ?? p.logo,
    escala: (p.escalaOptica ?? 1) * (p.escalaOpticaFlyer ?? 1),
  }));

  /*
   * Mención de financiamiento al pie: el agradecimiento que mandó Mauricio el 2026-10-09,
   * en el idioma de la pieza (`ui.flyer.agradecimiento`). La comparten la franja, el texto
   * alternativo y el criterio RF-26.6.
   */
  const mencion = c.ui.flyer.agradecimiento;

  return {
    restoTitulo,
    dominio,
    organizador,
    internacionales: expositores(c.speakers.international),
    nacionales: expositores(c.speakers.national),
    participantes,
    mencion,
    /* Solo el programa real: el demostrativo del sitio lleva un aviso que la lámina no tiene. */
    jornadas: c.program.esDemostracion ? [] : c.program.days,
  };
}

/*
 * Pie de publicación: el texto que va bajo el post, **uno por publicación** —el carrusel
 * entero o la pieza única—, no uno por imagen; eso es el texto alternativo. Lo pidió
 * Daniel el 2026-10-09. Sale de los mismos datos que el sitio, para que no se contradigan.
 * Es el mismo texto para las dos publicaciones: la frase «desliza para ver…» del carrusel
 * se quitó porque al leerse completo no tenía sentido (Daniel).
 */
export function pieDePublicacion(c: Contenido) {
  const t = c.ui.flyer;
  const { dominio, organizador, mencion } = datosFlyer(c);
  const [, escuela] = c.organizers;
  // Raya y no paréntesis: la afiliación de Siringo ya trae «(ALMA)».
  const expositores = [...c.speakers.international, ...c.speakers.national]
    .map((e) => `- ${e.name} — ${e.affiliation}`)
    .join('\n');
  return [
    `${c.ui.hero.eyebrow}\n${c.title}`,
    `${c.dates.label}, ${c.venue.name}, ${c.venue.country}.`,
    organizador ? `${t.organiza}: ${organizador} (${escuela.name}).` : '',
    `${t.expositores}:\n${expositores}`,
    `${t.programaPie} https://${dominio}`,
    mencion,
  ]
    .filter(Boolean)
    .join('\n\n');
}

/*
 * Texto alternativo de cada lámina, para pegar al publicar: Instagram y LinkedIn lo piden
 * por imagen. Dice lo que la lámina dice, con los nombres de institución completos.
 */
export function altFlyer(c: Contenido, lamina: LaminaFlyer) {
  const t = c.ui.flyer;
  const { dominio, organizador, participantes, mencion, jornadas } = datosFlyer(c);
  const organiza = organizador ? ` ${t.organiza}: ${organizador}.` : '';
  const evento = `${c.title}. ${c.dates.label}, ${c.venue.name}, ${c.venue.country}.${organiza}`;
  // Raya y punto y coma: la afiliación de Feick lleva coma y la de Siringo, paréntesis.
  const lista = [...c.speakers.international, ...c.speakers.national]
    .map((e) => `${e.name} — ${e.affiliation}`)
    .join('; ');
  const qr = c.registro.url ? ` ${t.qr} (QR).` : '';
  const instituciones = `${c.ui.organizacion.participantes}: ${participantes.map((p) => p.nombreCompleto).join('; ')}.`;
  const horario = jornadas.map((d) => `${d.label}, ${d.date}`).join('; ');
  const partes: Record<LaminaFlyer, string[]> = {
    portada: [evento, `${t.inscripciones} ${dominio}.`, instituciones, mencion],
    historia: [evento, `${t.sticker}.`, instituciones, mencion],
    expositores: [`${c.tituloCorto}, ${c.dates.label}. ${t.expositores}: ${lista}.`, mencion],
    inscripcion: [
      `${c.tituloCorto}, ${c.dates.label}. ${t.inscripcion}: ${t.escanea} ${dominio}.${qr}`,
      horario && `${horario}.`,
      instituciones,
      mencion,
    ],
    /*
     * Sin la lista de instituciones: cada expositor ya lleva la suya, y con ella el texto
     * pasaba de los 1000 caracteres de Instagram (RF-29.1).
     */
    unica: [evento, `${t.expositores}: ${lista}.`, `${t.inscripciones} ${dominio}.${qr}`, mencion],
  };
  return partes[lamina].filter(Boolean).join(' ');
}
