/**
 * Contenido en español. Versión de referencia (RF-1: español en `/`).
 *
 * `satisfies ContenidoIdioma` no es decorativo: si aquí falta una clave que
 * `en.ts` tiene, o al revés, `astro check` falla. Esa es toda la garantía de que
 * no queden traducciones a medias.
 */
import type { ContenidoIdioma } from './tipos';

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
    BO: 'Bolivia',
  },

  program: {
    pendingNotice: 'Programa preliminar próximamente disponible.',
    pendingDetail:
      'Estamos coordinando la agenda de sesiones con los expositores. Esta sección se actualizará con el detalle de charlas, horarios y actividades.',
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
    /*
     * Reescrita el 2026-09-22 con la reseña que envió él mismo. Es la única del sitio
     * que no se compone desde perfiles públicos, y manda porque es de primera mano.
     *
     * Dos cosas que cambiaron respecto de la versión anterior, y por qué:
     *   · El departamento **no** era el de Comunicaciones Inalámbricas sino el de
     *     **Teoría de la Comunicación**, y él lo firma con «(R)». Va en pasado por esa
     *     marca; el cargo que declara en presente es Distinguished Member of Technical
     *     Staff. Si «(R)» significara otra cosa, esta frase es lo que hay que corregir.
     *   · **No entra su recuento de citas.** Él escribe «over 36,400 Google Scholar
     *     citations»; es una cifra que sube cada semana y en una página estática se
     *     vuelve falsa sola. Los artículos y las patentes sí, porque no se mueven.
     * Ver `specs/gestion/programa-y-expositores.md`.
     */
    valenzuela: {
      resena:
        'Distinguished Member of Technical Staff de Bell Laboratories, donde dirigió el Departamento de Teoría de la Comunicación. Miembro de la Academia Nacional de Ingeniería de Estados Unidos, Fellow del IEEE, Bell Labs Fellow y Fellow del Wireless World Research Forum. Recibió el IEEE Eric E. Sumner Award, el IEEE CTTC Technical Achievement Award en 2014 y el IEEE VTS Avant Garde Award en 2015. Ingeniero por la Universidad de Chile y doctor por el Imperial College de Londres. Trabaja en mediciones y modelos de propagación, sistemas MIMO y espacio-tiempo con arreglos de antenas en transmisión y recepción, redes heterogéneas, celdas pequeñas e interfaces de aire de próxima generación. Más de 250 artículos y 44 patentes.',
      linea: 'MIMO, antenas inteligentes y propagación',
    },
    siringo: {
      resena:
        'Ingeniero sénior de radiofrecuencia, líder técnico del front-end y gestor del espectro de ALMA, como miembro del personal internacional del Observatorio Europeo Austral (ESO). Licenciado en Física por la Universidad La Sapienza de Roma, con una tesis en cosmología experimental, y doctor en Astronomía por la Universidad de Bonn, con una tesis sobre polarización submilimétrica en regiones de formación estelar. Llegó a Chile con ESO como astrónomo de operaciones del radiotelescopio APEX y se unió a ALMA como científico de pruebas durante su construcción.',
      linea: 'Receptores en mm y submm; gestión del espectro',
    },
    siles: {
      resena:
        'Profesor investigador titular y director del Laboratorio de Radiocomunicaciones de la Universidad Privada Boliviana, y presidente del capítulo IEEE AP-S Bolivia. Doctor en Sistemas y Tecnologías de Telecomunicaciones por la Universidad Politécnica de Madrid (2012), donde fue investigador hasta 2015; luego pasó por la Agencia Espacial Boliviana. Ha participado en experimentos de propagación satelital con balizas en bandas Ka y Q junto a la UPM. Sus intereses son la propagación radioeléctrica, las comunicaciones inalámbricas y la radiometeorología.',
      linea: 'Propagación atmosférica y radiometeorología',
    },
    feick: {
      resena:
        'Investigador del CCTVal, el Centro Científico Tecnológico de Valparaíso alojado en la Universidad Técnica Federico Santa María, donde encabeza el Wireless Communications Research Group. Tiene una trayectoria larga en campañas de medición de canal y caracterización de propagación, y ha coautorado mediciones a 28 GHz en el área del banco de pruebas COSMOS, el mismo proyecto en el que participa Columbia University.',
      linea: 'Medición y caracterización de canal',
    },
    gutierrez: {
      resena:
        'Profesor asistente del Departamento de Ingeniería Eléctrica de la Pontificia Universidad Católica de Chile desde 2024, y Senior Member del IEEE. Doctor por la Universidad de Oporto, magíster por el Politécnico de Turín e ingeniero civil electrónico por la PUCV. Colabora con el centro CISTER de Oporto y presidió el capítulo chileno de IEEE ComSoc.',
      linea: 'Redes inalámbricas de tiempo real, IoT y localización',
    },
    toledo: {
      resena:
        'Profesor asistente del Departamento de Ingeniería Eléctrica de la Universidad de Santiago de Chile, donde se doctoró en Ciencias de la Ingeniería, mención Automática. Ingeniero en Telecomunicaciones y magíster en Sistemas Digitales por la Universidad Tecnológica de La Habana (CUJAE), donde fue profesor. Fue investigador postdoctoral en el Centro Científico Tecnológico de Valparaíso (CCTVal) de la Universidad Técnica Federico Santa María. Sus intereses son los sistemas de comunicación inalámbrica, el internet de las cosas, la eficiencia energética, la optimización y el procesamiento digital de señales.',
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
      'Las bandas mmWave y sub-THz permiten que una misma infraestructura inalámbrica no solo transmita información, sino que perciba el entorno: detectar presencia y movimiento, estimar distancias y reconstruir escenas. Esa convergencia entre comunicación y detección es uno de los ejes de las redes 6G.',
      'El seminario reúne a investigadores de Chile y del extranjero para discutir propagación, mediciones y sensado conjunto, y para mostrar la investigación de la PUCV junto a la de sus colaboradores en estos temas. Se realiza en el marco de tres proyectos que lo financian: FOVI250222 y Fondecyt Regular 1250951, de ANID, y 525RT0175, de CYTED.',
    ],
    director: {
      epigrafe: 'Dirige el seminario',
      cargo: 'Escuela de Ingeniería Eléctrica · PUCV',
      texto:
        'Profesor de la Escuela de Ingeniería Eléctrica de la PUCV y director del Doctorado en Ingeniería Eléctrica, convocó a los expositores de este encuentro. Investiga telecomunicaciones inalámbricas, propagación y microondas, y dirige el Laboratorio de Comunicaciones Inalámbricas.',
      verPerfil: 'Perfil institucional',
    },
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
      inscribirse: 'Inscribirse',
      verExpositores: 'Expositores',
      figuraTitulo: 'Detección inalámbrica en bandas mmWave y sub-THz',
      figuraDescripcion:
        'Representación esquemática de un emisor de radio cuyos frentes de onda se propagan sobre una retícula polar de rango que cambia de relieve e intensidad al interactuar.',
    },

    flyer: {
      expositores: 'Expositores',
      inscripciones: 'Inscripciones en',
      qr: 'Formulario de inscripción',
      organiza: 'Organiza',
      // Sin «→»: Illustrator no mapea esa glifa del subconjunto incrustado y la sustituye por Myriad.
      inscripcion: 'Inscripción',
      escanea: 'Escanea el código o entra a',
      sticker: 'Inscríbete en el enlace',
      programaPie: 'Inscripciones y programa:',
      // Traducción del agradecimiento de Mauricio (2026-10-09). Folios dados por él; 11261397 y
      // CIA250027 no están cotejados con ANID `[supuesto]`. Ver `tipos.ts`.
      agradecimiento:
        'Este trabajo fue financiado por ANID FONDECYT 1250951 y 11261397, ANID CCTVal CIA250027, ANID Vinculación Internacional FOVI250222 y el Programa Iberoamericano de Ciencia y Tecnología para el Desarrollo - CYTED (525RT0175-DISeCom).',
      grupoInternacional: 'Internacionales',
      grupoNacional: 'Nacionales',
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
        eyebrow: 'Programa',
        title: 'Jornadas del 21 y 22 de octubre',
      },
      expositores: {
        eyebrow: 'Expositores',
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
      dias: {
        miercoles21: 'Miércoles 21 de octubre',
        jueves22: 'Jueves 22 de octubre',
      },
      pausas: {
        registro: 'Registro',
        recepcion: 'Recepción',
        bienvenidaIntro: 'Bienvenida e introducción',
        bienvenida: 'Bienvenida',
        cafe: 'Pausa para café',
        almuerzo: 'Almuerzo y cóctel',
        posters: 'Sesión de pósteres',
        cierreDia: 'Cierre de la primera jornada',
        cierre: 'Cierre del seminario',
      },
      charlaPorConfirmar: 'Título de la charla por confirmar',
      charlas: {
        titulo: 'Charlas confirmadas',
        nota: 'Títulos y resúmenes en inglés, tal como los enviaron los expositores.',
        sinHorario: 'Los horarios se publicarán con el programa.',
      },
    },

    sede: {
      fechas: 'Fechas',
      consultas: 'Consultas',
      cargarMapa: 'Cargar mapa interactivo',
      abrirEnGoogleMaps: 'Abrir en Google Maps',
      avisoMapa: 'Al cargar el mapa se solicita contenido a Google Maps.',
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
      comite: 'Comité organizador',
      desarrollo: 'Desarrollo del sitio',
      grados: {
        doctor: 'Dr.',
        candidato: 'Ing., candidato a Doctor',
      },
    },
  },
} satisfies ContenidoIdioma;
