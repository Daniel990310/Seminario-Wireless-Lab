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

  /*
   * Reseñas redactadas a partir de los perfiles institucionales y académicos
   * públicos que enlaza `comun.ts` (IEEE Xplore, páginas de facultad, ANID,
   * Google Scholar). Cada dato es comprobable en la fuente enlazada en la ficha.
   *
   * Deliberadamente sobrias y sin superlativos: es una conferencia académica, y
   * los honores hablan solos. Nada de logros que no aparezcan en una fuente.
   */
  expositores: {
    zussman: {
      resena:
        'Profesor Kenneth Brayer de Ingeniería Eléctrica y director del departamento en Columbia University, donde dirige el Wireless and Mobile Networking Lab. Es investigador principal por Columbia del banco de pruebas COSMOS, de la iniciativa PAWR de la NSF. Doctor en Ingeniería Eléctrica por el Technion y posdoctorado en el MIT.',
      linea: 'Redes inalámbricas, móviles y resilientes',
    },
    du: {
      resena:
        'Investigador en Nokia Bell Labs desde 2015, donde trabaja en los fundamentos de las comunicaciones inalámbricas: teoría de la comunicación, diseño y optimización de sistemas de radio y medición de propagación en ondas milimétricas. Doctor por el KTH de Estocolmo y posdoctorado en el MIT.',
      linea: 'Propagación en mmWave y modelado de canal',
    },
    valenzuela: {
      resena:
        'Director del departamento de investigación en Comunicaciones Inalámbricas de Nokia Bell Labs y miembro de la Academia Nacional de Ingeniería de Estados Unidos, que lo eligió en 2017 por su liderazgo en sistemas multiantena y modelado de canal. Bell Labs Fellow y Fellow del IEEE. Estudió Ingeniería en la Universidad de Chile y se doctoró en el Imperial College de Londres.',
      linea: 'MIMO, antenas inteligentes y propagación',
    },
    feick: {
      resena:
        'Encabeza el Wireless Communications Research Group de la Universidad Técnica Federico Santa María, con una trayectoria larga en campañas de medición de canal y caracterización de propagación. Ha coautorado mediciones a 28 GHz en el área del banco de pruebas COSMOS, el mismo proyecto en el que participa Columbia University.',
      linea: 'Medición y caracterización de canal',
    },
    gutierrez: {
      resena:
        'Profesor asistente del Departamento de Ingeniería Eléctrica de la Pontificia Universidad Católica de Chile desde 2024, y Senior Member del IEEE. Doctor por la Universidad de Oporto, magíster por el Politécnico de Turín e ingeniero civil electrónico por la PUCV. Colabora con el centro CISTER de Oporto y presidió el capítulo chileno de IEEE ComSoc.',
      linea: 'Redes inalámbricas de tiempo real, IoT y localización',
    },
    toledo: {
      resena:
        'Profesor asistente del Departamento de Ingeniería Eléctrica de la Universidad de Santiago de Chile. Dirige un proyecto Fondecyt de Iniciación sobre redes inalámbricas adaptativas con drones autónomos como estaciones base móviles, con aplicación a ondas milimétricas en 5G y 6G.',
      linea: 'Redes asistidas por drones y eficiencia energética',
    },
  },

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

    error404: {
      etiqueta: 'Error 404',
      titulo: 'Esta página no existe',
      explicacion: 'Puede que el enlace esté mal copiado. El seminario está en el inicio.',
      volver: 'Ir al inicio',
      tituloDocumento: 'Página no encontrada',
    },

    hero: {
      eyebrow: 'Seminario internacional',
      lugarEyebrow: 'Lugar',
      fechasEyebrow: 'Fechas',
      verPrograma: 'Ver programa',
      verExpositores: 'Expositores',
      figuraTitulo: 'Detección inalámbrica en bandas mmWave y sub-THz',
      figuraDescripcion:
        'Representación esquemática de un emisor de radio cuyos frentes de onda se propagan sobre una retícula polar de rango que cambia de relieve e intensidad al interactuar.',
    },

    secciones: {
      seminario: {
        eyebrow: 'El seminario',
        title: 'Comunicación y detección sobre la misma infraestructura',
      },
      /*
       * Cinco secciones NO llevan epígrafe, y es una decisión, no un olvido.
       *
       * Un epígrafe tiene que codificar algo verdadero del contenido; si solo lo
       * decora, sobra. Aquí decía «Expositores» sobre un título que ya decía
       * «Investigadores participantes», «Sede» sobre «Auditorio de la Sede PUCV
       * Santiago» y «Organización» sobre «Organización y financiamiento»: la misma
       * palabra dos veces, en dos tamaños.
       *
       * La regla es: **el epígrafe sobrevive solo donde el `<h2>` no nombra la
       * sección.** Eso deja exactamente uno, `seminario`, cuyo título es una tesis
       * —«Comunicación y detección sobre la misma infraestructura»— y no una etiqueta;
       * ahí el epígrafe sí hace trabajo, porque dice en qué sección estás mientras el
       * título argumenta.
       *
       * El `<h2>` no se puede quitar en su lugar: es el nombre accesible de la región
       * por `aria-labelledby` y sin él las secciones dejan de anunciarse como regiones
       * navegables (RNF-1.4). Y la orientación no se pierde: la etiqueta de cada
       * sección sigue estando en la barra de navegación, marcada con
       * `aria-current="location"` (RF-6.1).
       *
       * Intento anterior descartado el 2026-08-06: reescribir los cinco títulos para
       * que «aportaran algo». Producía texto de relleno inventado para justificar un
       * hueco, que es peor que la repetición.
       */
      programa: {
        title: 'Jornadas del 21 y 22 de octubre',
      },
      expositores: {
        title: 'Investigadores participantes',
        lead: 'Especialistas en propagación, detección inalámbrica y arquitecturas de redes de próxima generación.',
      },
      sede: {
        title: 'Auditorio de la Sede PUCV Santiago',
      },
      organizacion: {
        title: 'Organización y financiamiento',
      },
    },

    expositores: {
      internacionales: 'Expositores internacionales',
      nacionales: 'Expositores nacionales',
      verFicha: 'Ver reseña',
      lineaInvestigacion: 'Línea de investigación',
      verPerfil: 'Perfil institucional',
    },

    programa: {
      enPreparacion: 'En preparación',
      solicitarAviso: 'Solicitar aviso de publicación',
      asuntoConsultaPrograma: 'Consulta por el programa — Beyond Connectivity 2026',
      avisoDemostracion:
        'Programa de ejemplo. Estas sesiones son ficticias y sirven solo para mostrar el formato: ninguna ha sido acordada con los expositores.',
      jornadas: 'Jornadas del seminario',
      verResumen: 'Resumen',
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
      /*
       * Leyenda del marcador de posición de una marca cuyo titular todavía no autorizó
       * su uso. Vive aquí, y no en `LogoWall.astro`, porque **es texto visible**: escrita
       * en el componente la detectó `verify:idioma` como cadena sin traducir, que es
       * exactamente para lo que existe esa comprobación.
       */
      logoPendiente: 'LOGO PENDIENTE',
    },

    pie: {
      contacto: 'Contacto',
      secciones: 'Secciones',
      financiadoPor: 'Financiado por',
      proyecto: 'Proyecto',
    },
  },
} satisfies ContenidoIdioma;
