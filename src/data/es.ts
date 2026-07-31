/**
 * Contenido en español. Versión de referencia (RF-1: español en `/`).
 *
 * `satisfies ContenidoIdioma` no es decorativo: si aquí falta una clave que
 * `en.ts` tiene, o al revés, `astro check` falla. Esa es toda la garantía de que
 * no queden traducciones a medias.
 */
import type { ContenidoIdioma } from './tipos';
import type { DiaPrograma } from './comun';

export const es = {
  lang: 'es',
  nombre: 'Español',

  dates: {
    label: '21 y 22 de octubre de 2026',
    shortLabel: '21–22 OCT 2026',
  },

  venue: {
    name: 'Auditorio de la Sede PUCV Santiago',
    country: 'Chile',
  },

  paises: {
    US: 'Estados Unidos',
    CL: 'Chile',
  },

  program: {
    pendingNotice: 'Programa preliminar próximamente disponible.',
    pendingDetail:
      'Estamos coordinando la agenda de sesiones con los expositores. Esta sección se actualizará con el detalle de charlas, horarios y actividades.',
    days: [] as DiaPrograma[],
  },

  afiliacionPorConfirmar: 'Afiliación por confirmar',

  funding: {
    projectName: 'Detección inalámbrica en mmWave y sub-THz',
  },

  network: {
    hubDetail: 'Escuela de Ingeniería Eléctrica',
    hubRole: 'Organiza',
  },

  about: {
    lead: 'Encuentro internacional dedicado a la detección inalámbrica en bandas de ondas milimétricas y sub-terahertz, y a su papel en las redes de comunicación futuras.',
    paragraphs: [
      'Las bandas mmWave y sub-THz abren la posibilidad de que una misma infraestructura inalámbrica no solo transmita información, sino que además perciba el entorno: detectar presencia y movimiento, estimar distancias, caracterizar materiales y reconstruir escenas. Esta convergencia entre comunicación y detección es uno de los ejes de las redes 6G.',
      'El seminario reúne a investigadores de Estados Unidos y Chile para discutir modelos de propagación, mediciones experimentales, arquitecturas de sensado conjunto y los desafíos abiertos de llevar estas tecnologías a despliegues reales.',
    ],
  },

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

  contact: {
    school: 'Escuela de Ingeniería Eléctrica, Pontificia Universidad Católica de Valparaíso',
  },

  seo: {
    description:
      'Seminario internacional sobre detección inalámbrica en bandas mmWave y sub-THz. 21 y 22 de octubre de 2026, Sede PUCV Santiago, Chile. Expositores de Columbia University, Nokia Bell Labs, PUC, USACH y PUCV.',
    keywords: ['propagación inalámbrica', 'seminario internacional', 'detección inalámbrica'],
  },

  nav: [
    { href: '#seminario', label: 'El seminario' },
    { href: '#programa', label: 'Programa' },
    { href: '#expositores', label: 'Expositores' },
    { href: '#red', label: 'Red' },
    { href: '#sede', label: 'Sede' },
    { href: '#organizacion', label: 'Organización' },
  ],

  ui: {
    saltarAlContenido: 'Saltar al contenido',
    abrirMenu: 'Abrir menú de navegación',
    contacto: 'Contacto',
    asuntoConsulta: 'Consulta — Beyond Connectivity 2026',

    tema: {
      legend: 'Tema de la página',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },

    idioma: {
      legend: 'Idioma',
      cambiarA: 'English',
    },

    hero: {
      eyebrow: 'Seminario internacional',
      lugarEyebrow: 'Lugar',
      fechasEyebrow: 'Fechas',
      verPrograma: 'Ver programa',
      verExpositores: 'Expositores',
      figuraTitulo: 'Detección inalámbrica en bandas mmWave y sub-THz',
      figuraDescripcion:
        'Representación esquemática de un emisor de radio cuyos frentes de onda se propagan sobre una retícula polar de rango, alcanzan un objeto y regresan como una nube de puntos reconstruida a partir de las reflexiones.',
    },

    secciones: {
      seminario: {
        eyebrow: 'El seminario',
        title: 'Comunicación y detección sobre la misma infraestructura',
      },
      programa: {
        eyebrow: 'Programa',
        title: 'Jornadas del 21 y 22 de octubre',
      },
      expositores: {
        eyebrow: 'Expositores',
        title: 'Investigadores participantes',
        lead: 'Especialistas en propagación, detección inalámbrica y arquitecturas de redes de próxima generación.',
      },
      red: {
        eyebrow: 'Red de colaboración',
        title: 'Instituciones vinculadas',
        lead: 'El seminario articula grupos de investigación de Estados Unidos y Chile en torno a la Escuela de Ingeniería Eléctrica de la PUCV.',
      },
      sede: {
        eyebrow: 'Sede',
        title: 'Auditorio de la Sede PUCV Santiago',
      },
      organizacion: {
        eyebrow: 'Organización',
        title: 'Organización y financiamiento',
      },
    },

    expositores: {
      internacionales: 'Expositores internacionales',
      nacionales: 'Expositores nacionales',
    },

    programa: {
      enPreparacion: 'En preparación',
      solicitarAviso: 'Solicitar aviso de publicación',
      asuntoConsultaPrograma: 'Consulta por el programa — Beyond Connectivity 2026',
    },

    sede: {
      fechas: 'Fechas',
      consultas: 'Consultas',
      cargarMapa: 'Cargar mapa interactivo',
      abrirEnGoogleMaps: 'Abrir en Google Maps',
      avisoMapa: 'Al cargar el mapa se solicita contenido a OpenStreetMap.',
      tituloMapa: 'Mapa de la sede',
    },

    organizacion: {
      organizan: 'Organizan',
      participantes: 'Instituciones participantes y colaboradoras',
      financia: 'Financia',
      proyecto: 'Proyecto',
    },

    pie: {
      contacto: 'Contacto',
      secciones: 'Secciones',
      financiadoPor: 'Financiado por',
      proyecto: 'Proyecto',
    },
  },
} satisfies ContenidoIdioma;
