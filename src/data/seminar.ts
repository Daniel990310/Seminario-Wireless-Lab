/**
 * Fuente única de contenido del seminario.
 *
 * Todo el texto, los expositores, las instituciones y el programa se editan
 * aquí. Las páginas y componentes solo leen de este archivo, de modo que
 * actualizar la web no requiere tocar el marcado ni los estilos.
 */

export interface Speaker {
  name: string;
  affiliation: string;
  country?: string;
  /** Marca la afiliación como pendiente de confirmación. */
  affiliationPending?: boolean;
}

export interface ProgramDay {
  date: string;
  label: string;
  sessions: Array<{ time: string; title: string; speaker?: string }>;
}

export interface Institution {
  name: string;
  shortName: string;
  /** Ruta del logo dentro de /public. Ver public/logos/README.md */
  logo: string;
  url?: string;
}

export const seminar = {
  /** Título oficial: se mantiene en inglés en toda la web. */
  title: 'Beyond Connectivity: Wireless Sensing in mmWave and Sub-THz Bands',
  subtitle:
    'International Seminar on Wireless Propagation, Sensing, and Future Communication Networks',

  dates: {
    label: '21 y 22 de octubre de 2026',
    shortLabel: '21–22 OCT 2026',
    startISO: '2026-10-21',
    endISO: '2026-10-22',
  },

  venue: {
    name: 'Auditorio de la Sede PUCV Santiago',
    street: 'Antonio Bellet 314',
    district: 'Providencia',
    city: 'Santiago',
    country: 'Chile',
    get fullAddress() {
      return `${this.street}, ${this.district}, ${this.city}, ${this.country}`;
    },
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Antonio+Bellet+314%2C+Providencia%2C+Santiago%2C+Chile',
  },

  /**
   * Programa preliminar.
   *
   * Mientras `days` esté vacío, la web muestra automáticamente el aviso
   * `pendingNotice`. Al agregar días y sesiones, la sección pasa a mostrar
   * la agenda sin necesidad de cambiar nada más.
   */
  program: {
    pendingNotice: 'Programa preliminar próximamente disponible.',
    pendingDetail:
      'Estamos coordinando la agenda de sesiones con los expositores. Esta sección se actualizará con el detalle de charlas, horarios y actividades.',
    days: [] as ProgramDay[],
  },

  speakers: {
    international: [
      { name: 'Gil Zussman', affiliation: 'Columbia University', country: 'Estados Unidos' },
      { name: 'Jinfeng Du', affiliation: 'Nokia Bell Labs', country: 'Estados Unidos' },
      { name: 'Reinaldo A. Valenzuela', affiliation: 'Nokia Bell Labs', country: 'Estados Unidos' },
    ] satisfies Speaker[],
    national: [
      { name: 'Rodolfo Feick', affiliation: 'Afiliación por confirmar', affiliationPending: true },
      {
        name: 'Miguel Gutiérrez Gaitán',
        affiliation: 'Pontificia Universidad Católica de Chile',
        country: 'Chile',
      },
      {
        name: 'Karel Toledo de la Garza',
        affiliation: 'Universidad de Santiago de Chile',
        country: 'Chile',
      },
    ] satisfies Speaker[],
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
  ] satisfies Institution[],

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
  ] satisfies Institution[],

  funding: {
    agency: {
      name: 'Agencia Nacional de Investigación y Desarrollo',
      shortName: 'ANID',
      logo: '/logos/anid.svg',
      url: 'https://www.anid.cl',
    } satisfies Institution,
    project: {
      code: 'FOVI250222',
      name: 'Detección inalámbrica en mmWave y sub-THz',
    },
  },

  /** Texto de presentación del seminario. */
  about: {
    lead:
      'Un encuentro internacional dedicado a la detección inalámbrica en bandas de ondas milimétricas y sub-terahertz, y a su papel en las redes de comunicación del futuro.',
    paragraphs: [
      'Las bandas mmWave y sub-THz abren la posibilidad de que una misma infraestructura inalámbrica no solo transmita información, sino que además perciba el entorno: detectar presencia y movimiento, estimar distancias, caracterizar materiales y reconstruir escenas. Esta convergencia entre comunicación y detección es uno de los ejes de las redes 6G.',
      'El seminario reúne a investigadores de Estados Unidos y Chile para discutir modelos de propagación, mediciones experimentales, arquitecturas de sensado conjunto y los desafíos abiertos de llevar estas tecnologías a despliegues reales.',
    ],
  },

  /** Temas tratados, usados en la sección de alcance. */
  topics: [
    {
      title: 'Propagación en mmWave y sub-THz',
      description:
        'Modelos de canal, pérdidas por penetración, dispersión y campañas de medición en bandas milimétricas y sub-terahertz.',
    },
    {
      title: 'Detección inalámbrica',
      description:
        'Sensado del entorno mediante señales de radio: detección de presencia, estimación de rango y caracterización de materiales.',
    },
    {
      title: 'Comunicación y sensado conjuntos',
      description:
        'Arquitecturas ISAC que integran transmisión de datos y percepción del entorno sobre la misma infraestructura.',
    },
    {
      title: 'Redes de comunicación futuras',
      description:
        'Implicancias para el diseño de redes 6G, superficies reconfigurables y despliegues de alta frecuencia.',
    },
  ],

  /** Contacto de la organización. Ajustar al correo institucional definitivo. */
  contact: {
    email: 'seminario.wireless@pucv.cl',
    school: 'Escuela de Ingeniería Eléctrica, Pontificia Universidad Católica de Valparaíso',
  },

  seo: {
    description:
      'Seminario internacional sobre detección inalámbrica en bandas mmWave y sub-THz. 21 y 22 de octubre de 2026, Sede PUCV Santiago, Chile. Expositores de Columbia University, Nokia Bell Labs, PUC, USACH y PUCV.',
    keywords: [
      'wireless sensing',
      'mmWave',
      'sub-THz',
      '6G',
      'propagación inalámbrica',
      'ISAC',
      'seminario internacional',
      'PUCV',
      'ANID',
      'FOVI250222',
    ],
  },
} as const;

export type Seminar = typeof seminar;
