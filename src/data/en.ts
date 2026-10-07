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
    BO: 'Bolivia',
  },

  program: {
    pendingNotice: 'Preliminary programme coming soon.',
    pendingDetail:
      'We are coordinating the session schedule with the speakers. This section will be updated with talks, times and activities.',
    days: [] as DiaPrograma[],
  },

  afiliacionPorConfirmar: 'Affiliation to be confirmed',

  /*
   * Written from the public institutional and academic profiles linked in
   * `comun.ts`. Every claim is checkable at the source linked in the card.
   */
  expositores: {
    zussman: {
      resena:
        'Kenneth Brayer Professor of Electrical Engineering and department chair at Columbia University, where he leads the Wireless and Mobile Networking Lab. He is Columbia PI of the COSMOS testbed, part of the NSF PAWR programme. PhD in Electrical Engineering from the Technion, with a postdoc at MIT.',
      linea: 'Wireless, mobile and resilient networks',
    },
    du: {
      resena:
        'Researcher at Nokia Bell Labs since 2015, working on the fundamentals of wireless communication: communication theory, radio system design and optimisation, and millimetre-wave propagation measurement. PhD from KTH Stockholm, with a postdoc at MIT.',
      linea: 'mmWave propagation and channel modelling',
    },
    // Rewritten 2026-09-22 from the biography he sent himself. See the note in `es.ts`.
    valenzuela: {
      resena:
        'Distinguished Member of Technical Staff at Bell Laboratories, where he directed the Communication Theory Department. Member of the US National Academy of Engineering, IEEE Fellow, Bell Labs Fellow and WWRF Fellow. He received the IEEE Eric E. Sumner Award, the 2014 IEEE CTTC Technical Achievement Award and the 2015 IEEE VTS Avant Garde Award. BSc from Universidad de Chile and PhD from Imperial College London. He works on propagation measurements and models, MIMO and space-time systems using transmit and receive antenna arrays, HetNets, small cells and next-generation air interface techniques and architectures. Over 250 papers and 44 patents.',
      linea: 'MIMO, smart antennas and propagation',
    },
    siringo: {
      resena:
        'Senior RF Engineer, Front-End Technical Lead and Spectrum Manager at ALMA, as an international staff member of the European Southern Observatory (ESO). Degree in physics from La Sapienza University of Rome, with a thesis in experimental cosmology, and PhD in astronomy from the University of Bonn, with a thesis on submillimetre polarisation in star-forming regions. He came to Chile with ESO as operations astronomer at the APEX radio telescope, then joined ALMA as a Test Scientist during its construction.',
      linea: 'mm/submm receivers and spectrum management',
    },
    siles: {
      resena:
        'Senior research professor and director of the Radiocommunications Laboratory at Universidad Privada Boliviana, and IEEE AP-S Bolivia Chapter Chair. PhD in Telecommunications Systems and Technologies from Universidad Politécnica de Madrid (2012), where he was a research assistant until 2015; he then worked at the Bolivian Space Agency. He has taken part in satellite propagation experiments with UPM using Ka- and Q-band beacons. His interests are radiowave propagation, wireless communications and radiometeorology.',
      linea: 'Atmospheric propagation and radiometeorology',
    },
    feick: {
      resena:
        'Researcher at CCTVal, the Valparaíso science and technology centre hosted by Universidad Técnica Federico Santa María, where he heads the Wireless Communications Research Group. He has a long record in channel measurement campaigns and propagation characterisation, and has co-authored 28 GHz measurements in the COSMOS testbed area, the same project Columbia University takes part in.',
      linea: 'Channel measurement and characterisation',
    },
    gutierrez: {
      resena:
        'Assistant professor in the Electrical Engineering Department at Pontificia Universidad Católica de Chile since 2024, and an IEEE Senior Member. PhD from the University of Porto, MSc from Politecnico di Torino and an electronics engineering degree from PUCV. He collaborates with the CISTER centre in Porto and chaired the IEEE ComSoc Chile chapter.',
      linea: 'Real-time wireless networked systems, IoT and localisation',
    },
    toledo: {
      resena:
        'Assistant professor in the Electrical Engineering Department at Universidad de Santiago de Chile, where he received his PhD in Engineering Sciences, mention in Automation. BSc in Telecommunication Engineering and MSc in Digital Systems from the Technological University of Havana (CUJAE), where he was a professor. He was a postdoctoral researcher at the Valparaíso science and technology centre (CCTVal), Universidad Técnica Federico Santa María. His interests are wireless communication systems, the Internet of Things, energy efficiency, optimisation and digital signal processing.',
      linea: 'Drone-assisted networks and energy efficiency',
    },
  },

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
      'The mmWave and sub-THz bands let a single wireless infrastructure not only carry information but also perceive its surroundings: detecting presence and motion, estimating range and reconstructing scenes. This convergence of communication and sensing is one of the pillars of 6G networks.',
      'The seminar brings together researchers from Chile and abroad to discuss propagation, measurements and joint sensing, and to showcase PUCV research alongside that of its collaborators in these fields. It is held within three projects that fund it: FOVI250222 and Fondecyt Regular 1250951, from ANID, and 525RT0175, from CYTED.',
    ],
    director: {
      epigrafe: 'Seminar director',
      cargo: 'School of Electrical Engineering · PUCV',
      texto:
        'A professor at the PUCV School of Electrical Engineering and director of the PhD in Electrical Engineering, he invited the speakers to this meeting. He researches wireless telecommunications, propagation and microwaves, and heads the Wireless Communications Laboratory.',
      verPerfil: 'Institutional profile',
    },
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

    error404: {
      etiqueta: 'Error 404',
      titulo: 'This page does not exist',
      explicacion: 'The link may have been copied incorrectly. The seminar is on the home page.',
      volver: 'Go to home page',
      tituloDocumento: 'Page not found',
    },

    hero: {
      eyebrow: 'International seminar',
      lugarEyebrow: 'Venue',
      fechasEyebrow: 'Dates',
      verPrograma: 'View programme',
      inscribirse: 'Register',
      verExpositores: 'Speakers',
      figuraTitulo: 'Wireless sensing in mmWave and sub-THz bands',
      figuraDescripcion:
        'Schematic view of a radio emitter whose wavefronts propagate across a polar range grid that changes relief and intensity when interacting.',
    },

    flyer: {
      expositores: 'Speakers',
      inscripciones: 'Register at',
      qr: 'Registration form',
      organiza: 'Organised by',
      financian: 'Funded by',
      // Sin «→»: ver el comentario en `es.ts`.
      desliza: 'Swipe: speakers and registration',
      inscripcion: 'Registration',
      escanea: 'Scan the code or go to',
      sticker: 'Register via the link',
      grupoInternacional: 'International',
      // No «Chilean»: el grupo es por institución con sede en Chile, no por nacionalidad.
      grupoNacional: 'Based in Chile',
    },

    secciones: {
      seminario: {
        eyebrow: 'The seminar',
        title: 'Communication and sensing over the same infrastructure',
      },
      /*
       * Mismo criterio que en `es.ts`, del que esto es el espejo: el epígrafe sobrevive
       * solo donde el `<h2>` no nombra la sección, y eso deja únicamente `seminario`.
       * La nota larga con el razonamiento está allí y no se duplica aquí a propósito.
       */
      programa: {
        title: 'Sessions on 21 and 22 October',
      },
      expositores: {
        title: 'Participating researchers',
        lead: 'Specialists in propagation, wireless sensing and next-generation network architectures.',
      },
      sede: {
        title: 'Auditorium, PUCV Santiago Campus',
      },
      organizacion: {
        title: 'Organisation and funding',
      },
    },

    expositores: {
      internacionales: 'International speakers',
      nacionales: 'Chilean speakers',
      verFicha: 'Read profile',
      lineaInvestigacion: 'Research area',
      verPerfil: 'Institutional profile',
    },

    programa: {
      enPreparacion: 'In preparation',
      solicitarAviso: 'Request publication notice',
      asuntoConsultaPrograma: 'Programme enquiry — Beyond Connectivity 2026',
      avisoDemostracion:
        'Sample programme. These sessions are fictional and only show the format: none has been agreed with the speakers.',
      jornadas: 'Seminar days',
      verResumen: 'Abstract',
      charlas: {
        titulo: 'Confirmed talks',
        nota: 'Titles and abstracts as sent by the speakers.',
        sinHorario: 'Times will be published with the programme.',
      },
    },

    sede: {
      fechas: 'Dates',
      consultas: 'Enquiries',
      cargarMapa: 'Load interactive map',
      abrirEnGoogleMaps: 'Open in Google Maps',
      avisoMapa: 'Loading the map requests content from Google Maps.',
      tituloMapa: 'Map of the venue',
    },

    organizacion: {
      organizan: 'Organised by',
      participantes: 'Participating and collaborating institutions',
      financia: 'Funded by',
      proyecto: 'Project',
      /** Ver la nota de `es.ts`: es texto visible, así que no puede vivir en el componente. */
      logoPendiente: 'LOGO PENDING',
    },

    pie: {
      contacto: 'Contact',
      secciones: 'Sections',
      financiadoPor: 'Funded by',
      proyecto: 'Project',
      comite: 'Organizing committee',
      desarrollo: 'Site development',
      /*
       * El grado cambia de forma según el idioma, por indicación de Daniel el
       * 2026-09-22: en español `Dr.` y en inglés `PhD`. No es una traducción
       * literal sino la convención de cada tradición académica, y es justo el
       * motivo por el que los grados viven en los archivos de idioma y no junto
       * a los nombres en `comun.ts`.
       *
       * Sin punto final: la forma corriente en inglés es `PhD` o `Ph.D.`, nunca
       * `PhD.` con un solo punto al final. Si se prefiere la otra, se cambia aquí.
       */
      grados: {
        doctor: 'PhD',
        candidato: 'Eng., PhD candidate',
      },
    },
  },
} satisfies ContenidoIdioma;
