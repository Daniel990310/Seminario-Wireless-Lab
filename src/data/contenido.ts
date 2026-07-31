/**
 * Punto único de acceso al contenido (T7).
 *
 * Combina lo que no se traduce (`comun.ts`) con el idioma pedido (`es.ts` o
 * `en.ts`) y resuelve lo que depende de ambos: la dirección completa, los países
 * de cada expositor y las palabras clave.
 *
 * Los componentes **no importan `es` ni `en`**: reciben el resultado de
 * `contenido(lang)` por props. Así un componente no puede quedarse atado a un
 * idioma sin que se note.
 */
import {
  comun,
  PROGRAMA_DEMOSTRATIVO,
  type CodigoPais,
  type ExpositorComun,
  type NodoRed,
} from './comun';
import { es } from './es';
import { en } from './en';
import { programaDemoEs, programaDemoEn } from './programa-demo';

export const IDIOMAS = ['es', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** Idioma servido en la raíz. El otro cuelga de `/<idioma>/`. */
export const IDIOMA_POR_DEFECTO: Idioma = 'es';

const porIdioma = { es, en } as const;

/** Ruta base de un idioma: `/` para el de por defecto, `/en/` para el resto. */
export const rutaBase = (lang: Idioma) => (lang === IDIOMA_POR_DEFECTO ? '/' : `/${lang}/`);

/** El otro idioma. Con dos, es el que no es este; con más, habría que elegir. */
export const otroIdioma = (lang: Idioma): Idioma => (lang === 'es' ? 'en' : 'es');

/**
 * Nombre de cada idioma **en ese idioma**, no traducido al idioma de la página.
 * Es la convención en selectores de idioma: quien busca la versión inglesa
 * busca «English», no «Inglés», y puede no saber leer la página actual.
 */
export const NOMBRES_IDIOMA: Record<Idioma, string> = { es: 'Español', en: 'English' };

export function contenido(lang: Idioma) {
  const t = porIdioma[lang];
  const pais = (codigo?: CodigoPais) => (codigo ? t.paises[codigo] : undefined);

  // Los expositores combinan nombre e institución (comunes) con país y estado
  // de afiliación (traducidos). Sin afiliación confirmada, cada idioma pone su
  // propio texto en lugar de dejar el hueco.
  const expositor = (e: ExpositorComun) => {
    // La clave está tipada en `ContenidoIdioma`, así que un expositor sin
    // reseña en algún idioma no compila.
    const ficha = t.expositores[e.id as keyof typeof t.expositores];
    return {
      id: e.id,
      name: e.name,
      affiliation: e.affiliation ?? t.afiliacionPorConfirmar,
      affiliationPending: e.affiliationPending ?? false,
      country: pais(e.country),
      perfil: e.perfil,
      resena: ficha.resena,
      linea: ficha.linea,
    };
  };

  const nodo = (n: NodoRed) => ({
    label: n.label,
    detail: n.detail,
    country: pais(n.country),
  });

  return {
    lang: t.lang,
    nombre: t.nombre,

    title: comun.title,
    tituloCorto: comun.tituloCorto,
    subtitle: comun.subtitle,

    dates: { ...comun.dates, ...t.dates },

    venue: {
      ...comun.venue,
      ...t.venue,
      fullAddress: `${comun.venue.street}, ${comun.venue.district}, ${comun.venue.city}, ${t.venue.country}`,
    },

    /*
     * Los días demostrativos solo entran si la bandera está encendida Y el
     * programa real está vacío: si alguien ya publicó el programa de verdad,
     * dejar la bandera puesta por descuido no puede sobrescribirlo.
     *
     * `esDemostracion` viaja con los datos para que la sección pueda avisar de
     * que lo que se ve está inventado. El aviso no es opcional.
     */
    program: {
      ...t.program,
      days:
        PROGRAMA_DEMOSTRATIVO && t.program.days.length === 0
          ? lang === 'es'
            ? programaDemoEs
            : programaDemoEn
          : t.program.days,
      esDemostracion: PROGRAMA_DEMOSTRATIVO && t.program.days.length === 0,
    },
    about: t.about,
    topics: t.topics,

    speakers: {
      international: comun.speakers.international.map(expositor),
      national: comun.speakers.national.map(expositor),
    },

    organizers: comun.organizers,
    participants: comun.participants,

    funding: {
      agency: comun.funding.agency,
      project: { code: comun.funding.project.code, name: t.funding.projectName },
    },

    network: {
      hub: { ...comun.network.hub, detail: t.network.hubDetail, role: t.network.hubRole },
      foreign: comun.network.foreign.map(nodo),
      local: comun.network.local.map(nodo),
    },

    contact: { ...comun.contact, ...t.contact },

    seo: {
      description: t.seo.description,
      keywords: [...comun.keywordsComunes, ...t.seo.keywords],
    },

    nav: t.nav,
    ui: t.ui,
  };
}

/** Forma del contenido ya resuelto. Es lo que reciben los componentes. */
export type Contenido = ReturnType<typeof contenido>;
