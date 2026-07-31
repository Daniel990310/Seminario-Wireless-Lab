/**
 * Contenido en inglés (RF-1: inglés en `/en/`).
 *
 * Traducción de registro académico, no literal: el objetivo es que un
 * investigador anglófono lo lea como si se hubiera escrito en inglés.
 *
 * Lo que NO se traduce vive en `comun.ts`: el título oficial del seminario, los
 * nombres institucionales, los nombres de personas, la dirección postal y el
 * código del proyecto. Ver la nota de ese archivo.
 */
import type { ContenidoIdioma } from './tipos';
import type { DiaPrograma } from './comun';

export const en = {
  lang: 'en',
  nombre: 'English',

  dates: {
    label: '21–22 October 2026',
    shortLabel: '21–22 OCT 2026',
  },

  venue: {
    name: 'Auditorium, PUCV Santiago Campus',
    country: 'Chile',
  },

  paises: {
    US: 'United States',
    CL: 'Chile',
  },

  program: {
    pendingNotice: 'Preliminary programme coming soon.',
    pendingDetail:
      'We are coordinating the session schedule with the speakers. This section will be updated with talks, times and activities.',
    days: [] as DiaPrograma[],
  },

  afiliacionPorConfirmar: 'Affiliation to be confirmed',

  funding: {
    projectName: 'Wireless sensing in mmWave and sub-THz bands',
  },

  network: {
    hubDetail: 'School of Electrical Engineering',
    hubRole: 'Host',
  },

  about: {
    lead: 'An international meeting on wireless sensing in millimetre-wave and sub-terahertz bands, and its role in future communication networks.',
    paragraphs: [
      'The mmWave and sub-THz bands make it possible for a single wireless infrastructure not only to carry information but also to perceive its surroundings: detecting presence and motion, estimating range, characterising materials and reconstructing scenes. This convergence of communication and sensing is one of the pillars of 6G networks.',
      'The seminar brings together researchers from the United States and Chile to discuss propagation models, experimental measurements, joint sensing architectures and the open challenges of taking these technologies to real deployments.',
    ],
  },

  topics: [
    {
      title: 'mmWave and sub-THz propagation',
      description:
        'Channel models, penetration loss, scattering and measurement campaigns in millimetre-wave and sub-terahertz bands.',
    },
    {
      title: 'Wireless sensing',
      description:
        'Sensing the environment with radio signals: presence detection, range estimation and material characterisation.',
    },
    {
      title: 'Joint communication and sensing',
      description:
        'ISAC architectures that combine data transmission and environmental perception over the same infrastructure.',
    },
    {
      title: 'Future communication networks',
      description:
        'Implications for 6G network design, reconfigurable intelligent surfaces and high-frequency deployments.',
    },
  ],

  contact: {
    school:
      'School of Electrical Engineering, Pontificia Universidad Católica de Valparaíso',
  },

  seo: {
    description:
      'International seminar on wireless sensing in mmWave and sub-THz bands. 21–22 October 2026, PUCV Santiago Campus, Chile. Speakers from Columbia University, Nokia Bell Labs, PUC, USACH and PUCV.',
    keywords: ['wireless propagation', 'international seminar', 'radio sensing'],
  },

  nav: [
    { href: '#seminario', label: 'The seminar' },
    { href: '#programa', label: 'Programme' },
    { href: '#expositores', label: 'Speakers' },
    { href: '#red', label: 'Network' },
    { href: '#sede', label: 'Venue' },
    { href: '#organizacion', label: 'Organisation' },
  ],

  ui: {
    saltarAlContenido: 'Skip to content',
    abrirMenu: 'Open navigation menu',
    contacto: 'Contact',
    asuntoConsulta: 'Enquiry — Beyond Connectivity 2026',

    tema: {
      legend: 'Page theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },

    idioma: {
      legend: 'Language',
      cambiarA: 'Español',
    },

    hero: {
      eyebrow: 'International seminar',
      lugarEyebrow: 'Venue',
      fechasEyebrow: 'Dates',
      verPrograma: 'View programme',
      verExpositores: 'Speakers',
      figuraTitulo: 'Wireless sensing in mmWave and sub-THz bands',
      figuraDescripcion:
        'Schematic view of a radio emitter whose wavefronts propagate across a polar range grid, reach an object and return as a point cloud reconstructed from the reflections.',
    },

    secciones: {
      seminario: {
        eyebrow: 'The seminar',
        title: 'Communication and sensing over the same infrastructure',
      },
      programa: {
        eyebrow: 'Programme',
        title: 'Sessions on 21 and 22 October',
      },
      expositores: {
        eyebrow: 'Speakers',
        title: 'Participating researchers',
        lead: 'Specialists in propagation, wireless sensing and next-generation network architectures.',
      },
      red: {
        eyebrow: 'Collaboration network',
        title: 'Participating institutions',
        lead: 'The seminar brings together research groups from the United States and Chile around the School of Electrical Engineering at PUCV.',
      },
      sede: {
        eyebrow: 'Venue',
        title: 'Auditorium, PUCV Santiago Campus',
      },
      organizacion: {
        eyebrow: 'Organisation',
        title: 'Organisation and funding',
      },
    },

    expositores: {
      internacionales: 'International speakers',
      nacionales: 'Chilean speakers',
    },

    programa: {
      enPreparacion: 'In preparation',
      solicitarAviso: 'Request publication notice',
      asuntoConsultaPrograma: 'Programme enquiry — Beyond Connectivity 2026',
    },

    sede: {
      fechas: 'Dates',
      consultas: 'Enquiries',
      cargarMapa: 'Load interactive map',
      abrirEnGoogleMaps: 'Open in Google Maps',
      avisoMapa: 'Loading the map requests content from OpenStreetMap.',
      tituloMapa: 'Map of the venue',
    },

    organizacion: {
      organizan: 'Organised by',
      participantes: 'Participating and collaborating institutions',
      financia: 'Funded by',
      proyecto: 'Project',
    },

    pie: {
      contacto: 'Contact',
      secciones: 'Sections',
      financiadoPor: 'Funded by',
      proyecto: 'Project',
    },
  },
} satisfies ContenidoIdioma;
