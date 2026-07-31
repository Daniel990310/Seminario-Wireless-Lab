/**
 * Contenido que NO se traduce (T7).
 *
 * La regla para decidir qué vive aquí: si traducirlo produciría un dato falso o
 * un nombre que nadie usa, no se traduce.
 *
 * - **El título oficial del seminario** se mantiene en inglés en ambos idiomas.
 *   Lo exige RF-1.2, y por eso vive aquí y no en los archivos de idioma: así no
 *   *puede* traducirse por descuido.
 * - **Los nombres institucionales** son nombres propios registrados. «Pontificia
 *   Universidad Católica de Valparaíso» no se convierte en «Pontifical Catholic
 *   University» en su propia comunicación oficial, y una traducción inventada de
 *   una institución es del mismo tipo de error que un logo inventado, que este
 *   proyecto ya tiene prohibido.
 * - **Los nombres de personas, la dirección postal, las fechas ISO y el código
 *   del proyecto** son identificadores: cambian de significado si se traducen.
 *
 * Los países NO están aquí: se guardan como código y cada idioma pone su
 * etiqueta, para no repetir «Estados Unidos» en seis lugares.
 */

export type CodigoPais = 'US' | 'CL';

export interface Institucion {
  name: string;
  shortName: string;
  /** Ruta del logo dentro de /public. Ver public/logos/README.md */
  logo: string;
  url?: string;
}

export interface ExpositorComun {
  name: string;
  /** Nombre institucional. No se traduce; ver la nota de arriba. */
  affiliation?: string;
  country?: CodigoPais;
  /** Sin afiliación confirmada: cada idioma pone su propio texto. */
  affiliationPending?: boolean;
}

export interface NodoRed {
  label: string;
  detail: string;
  country: CodigoPais;
}

export interface DiaPrograma {
  date: string;
  label: string;
  sessions: Array<{ time: string; title: string; speaker?: string }>;
}

export const comun = {
  /** Título oficial: se mantiene en inglés en toda la web (RF-1.2). */
  title: 'Beyond Connectivity: Wireless Sensing in mmWave and Sub-THz Bands',
  /** Forma corta para la barra, donde el título completo no cabe. Tampoco se traduce. */
  tituloCorto: 'Beyond Connectivity',
  subtitle:
    'International Seminar on Wireless Propagation, Sensing, and Future Communication Networks',

  dates: {
    startISO: '2026-10-21',
    endISO: '2026-10-22',
  },

  venue: {
    street: 'Antonio Bellet 314',
    district: 'Providencia',
    city: 'Santiago',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Antonio+Bellet+314%2C+Providencia%2C+Santiago%2C+Chile',
  },

  speakers: {
    international: [
      { name: 'Gil Zussman', affiliation: 'Columbia University', country: 'US' },
      { name: 'Jinfeng Du', affiliation: 'Nokia Bell Labs', country: 'US' },
      { name: 'Reinaldo A. Valenzuela', affiliation: 'Nokia Bell Labs', country: 'US' },
    ],
    national: [
      { name: 'Rodolfo Feick', affiliationPending: true },
      {
        name: 'Miguel Gutiérrez Gaitán',
        affiliation: 'Pontificia Universidad Católica de Chile',
        country: 'CL',
      },
      {
        name: 'Karel Toledo de la Garza',
        affiliation: 'Universidad de Santiago de Chile',
        country: 'CL',
      },
    ],
  },

  organizers: [
    {
      name: 'Pontificia Universidad Católica de Valparaíso',
      shortName: 'PUCV',
      logo: '/logos/pucv.svg',
      url: 'https://www.pucv.cl',
    },
    {
      name: 'Escuela de Ingeniería Eléctrica PUCV',
      shortName: 'EIE PUCV',
      logo: '/logos/eie-pucv.svg',
      url: 'https://www.eie.ucv.cl',
    },
  ],

  participants: [
    {
      name: 'Pontificia Universidad Católica de Chile',
      shortName: 'UC',
      logo: '/logos/uc.svg',
      url: 'https://www.uc.cl',
    },
    {
      name: 'Universidad de Santiago de Chile',
      shortName: 'USACH',
      logo: '/logos/usach.svg',
      url: 'https://www.usach.cl',
    },
    {
      name: 'Nokia Bell Labs',
      shortName: 'Nokia Bell Labs',
      logo: '/logos/nokia-bell-labs.svg',
      url: 'https://www.bell-labs.com',
    },
    {
      name: 'Columbia University',
      shortName: 'Columbia',
      logo: '/logos/columbia.svg',
      url: 'https://www.columbia.edu',
    },
  ],

  funding: {
    agency: {
      name: 'Agencia Nacional de Investigación y Desarrollo',
      shortName: 'ANID',
      logo: '/logos/anid.svg',
      url: 'https://www.anid.cl',
    },
    project: { code: 'FOVI250222' },
  },

  contact: {
    email: 'seminario.wireless@pucv.cl',
  },

  /*
   * Topología de la red de colaboración. Solo lo que no se traduce: las
   * instituciones y las personas. El rótulo del organizador y los países los
   * pone cada idioma.
   *
   * El orden importa y las listas tienen exactamente dos entradas por lado
   * porque la geometría del trayecto está calculada para dos (ver
   * `CollaborationNetwork.astro`). Añadir una tercera exige recalcular los
   * trayectos, no solo agregar el dato.
   */
  network: {
    hub: { label: 'PUCV' },
    foreign: [
      { label: 'Columbia University', detail: 'Gil Zussman', country: 'US' },
      { label: 'Nokia Bell Labs', detail: 'Jinfeng Du · Reinaldo A. Valenzuela', country: 'US' },
    ],
    local: [
      { label: 'PUC de Chile', detail: 'Miguel Gutiérrez Gaitán', country: 'CL' },
      { label: 'U. de Santiago', detail: 'Karel Toledo de la Garza', country: 'CL' },
    ],
  },

  /** Términos técnicos que se usan igual en ambos idiomas. */
  keywordsComunes: [
    'wireless sensing',
    'mmWave',
    'sub-THz',
    '6G',
    'ISAC',
    'PUCV',
    'ANID',
    'FOVI250222',
  ],
} as const;

export type Comun = typeof comun;
