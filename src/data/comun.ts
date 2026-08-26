/*
 * Los dos únicos logos ráster del proyecto se importan, no se referencian por ruta.
 *
 * PUCV no publica SVG de su escudo —el paquete `logos_pucv` de Normas Gráficas trae PNG—,
 * así que son los dos únicos archivos que el optimizador de Astro puede mejorar. Importarlos
 * desde `src/assets` es lo que le permite emitir formatos modernos y declarar las
 * dimensiones intrínsecas. Los demás logos son SVG y siguen en `/public`, porque para
 * vectores el optimizador no hace nada y el flujo de sustituir el archivo por su nombre es
 * más útil.
 */
import pucvClaro from '~/assets/logos/pucv.png';
import pucvOscuro from '~/assets/logos/pucv-oscuro.png';
/*
 * Submarca oficial de la Escuela de Ingeniería Eléctrica, del paquete `logos_submarca` de
 * Normas Gráficas PUCV. Instalada el 2026-08-07.
 *
 * El rastreo del 2026-08-03 la dejó pendiente porque la descarga se cortó dos veces; se
 * cortó una tercera y salió con reanudación por rangos. El paquete pesa **186,1 MB**, que es
 * la razón de los cortes.
 *
 * Variante `AZUL` para fondo claro y `BLANCO` para fondo oscuro, que son las dos que el
 * manual autoriza para cada fondo. No se recolorea ninguna (RF-10.4). El paquete de
 * submarcas **sí** trae versión para fondo oscuro, a diferencia del paquete del escudo
 * principal, que no la tiene y sigue pedida.
 */
import eieClaro from '~/assets/logos/eie-pucv.png';
import eieOscuro from '~/assets/logos/eie-pucv-oscuro.png';
/*
 * ═══ AQUÍ ESTABAN LOS IMPORTS DE COLUMBIA Y USACH ═══
 *
 * Retirados el 2026-08-25 con las marcas que alimentaban (ver `participants`). Se quitan
 * los imports y no solo su uso porque `astro check` los reportaría como código muerto, y
 * este proyecto lo mantiene en 0 avisos.
 *
 * **Los archivos siguen en `src/assets/logos/`**: `columbia.png`, `columbia-oscuro.png` y
 * `usach.png`. Reponer una marca autorizada es volver a poner su `import` y su línea
 * `logo:`. Lo que hay que saber al hacerlo:
 *
 * · **Columbia está con la marca equivocada.** Los archivos son `CUSPS_logo_simple_RGB_*`,
 *   la submarca de la School of Professional Studies, y Gil Zussman es de SEAS. Se
 *   nombraron `columbia.png` / `columbia-oscuro.png` a propósito, para que sustituir el
 *   archivo por el correcto no obligue a tocar código. Originales en `marcas/columbia/`.
 *   Variantes del paquete: `dkblue` para fondo claro, `white` para oscuro.
 * · **USACH no tiene variante para fondo oscuro y hace falta.** Su tinta es negra pura
 *   —`rgb(0,0,0)` en los píxeles opacos `[medido]`— y sobre `#0a1020` desaparece. No se
 *   resuelve recoloreando: alterar el color de una marca va contra el manual de su dueño
 *   (RF-10.4). Está pedida a `imagen@usach.cl`.
 */

/*
 * Retratos de los expositores, normalizados el 2026-08-09.
 *
 * Autorización: los entregó Daniel confirmando el permiso, que es lo que exige RF-11.1.
 *
 * El material llegaba dispar —cuatro cuadrados de entre 300 y 600 px, uno vertical de
 * 3744×5120 y dos WebP— así que puestos tal cual las fichas mostrarían caras a distinta
 * altura y a distinto tamaño. Se unificaron a **512×512 con recorte guiado por saliencia**,
 * que en un retrato cae sobre la cara; no es detección facial, es una heurística, y por eso
 * los seis recortes se revisaron a ojo antes de darlos por buenos: ninguna cabeza queda
 * cortada. Un recorte centrado puro habría decapitado la foto vertical.
 *
 * OJO con el de Zussman: el original mide 260×260, así que al llevarlo a 512 se interpola y
 * se ve más blando que los demás. Si aparece uno de mayor resolución, conviene cambiarlo.
 */
import fotoZussman from '~/assets/expositores/zussman.webp';
import fotoDu from '~/assets/expositores/du.webp';
import fotoValenzuela from '~/assets/expositores/valenzuela.webp';
import fotoFeick from '~/assets/expositores/feick.webp';
import fotoGutierrez from '~/assets/expositores/gutierrez.webp';
import fotoToledo from '~/assets/expositores/toledo.webp';

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

/**
 * Enciende el programa DEMOSTRATIVO de `programa-demo.ts`.
 *
 * ⚠️ **Debe quedar en `false` en cualquier despliegue público.** Con `true`, la
 * sección «Programa» muestra sesiones inventadas —marcadas como tales con un
 * aviso visible— para poder ver cómo se comporta con contenido.
 *
 * Un programa apócrifo en el sitio de un evento real, con fechas y sede reales,
 * es información falsa con la que alguien podría organizar un viaje. Por eso
 * está apagado por defecto y por eso el aviso no es opcional.
 *
 * Al publicar el programa real: poblar `program.days` en `es.ts` y `en.ts`, y
 * borrar esta bandera junto con `programa-demo.ts`.
 */
export const PROGRAMA_DEMOSTRATIVO = false;

export type CodigoPais = 'US' | 'CL';

/*
 * Los logos aceptan dos formas, y la distinción tiene consecuencias.
 *
 * - `string` es una ruta dentro de `/public`: el archivo se sirve tal cual. Es lo correcto
 *   para los SVG, porque el optimizador de imágenes de Astro no los procesa —los pasa sin
 *   tocar— y porque el flujo documentado en `public/logos/README.md` consiste en sustituir
 *   el archivo conservando el nombre, sin tocar código.
 * - `ImageMetadata` es un archivo importado desde `src/assets`, y sirve para los **ráster**.
 *   Ahí sí gana: `<Image />` emite formatos modernos y, sobre todo, **declara `width` y
 *   `height`**, que es lo que evita que la fila de logos se recoloque al cargar.
 *
 * Con `h-10 w-auto` y sin dimensiones intrínsecas, el ancho es 0 hasta que la imagen llega
 * y la fila salta. Ese era el defecto real que señalaba la barra de auditoría del servidor
 * de desarrollo el 2026-08-06, no el peso.
 */
export type Logo = string | ImageMetadata;

export interface Institucion {
  name: string;
  shortName: string;
  /**
   * SVG: ruta en `/public`. Ráster: importado de `src/assets/logos`. Ver `Logo`.
   *
   * **Opcional a propósito, y no por comodidad.** Sin archivo, `LogoWall` pinta el
   * marcador de posición —caja de trazo discontinuo con el nombre y `LOGO PENDIENTE`—,
   * que es el estado correcto de una marca cuyo titular todavía no autorizó su uso.
   * Un logo de tercero sin permiso no se muestra «mientras llega la respuesta»: se
   * pide primero. Ver `specs/gestion/correos-instituciones.md`.
   */
  logo?: Logo;
  /**
   * Variante autorizada para fondo oscuro (RF-10).
   *
   * Existe porque los logos oficiales vienen **en una variante por fondo**, y no
   * se pueden recolorear por CSS: alterar el color de una marca va contra el
   * manual de su dueño. Si falta, se usa `logo` en los dos temas, que es lo
   * correcto para un marcador de posición monocromo.
   */
  logoOscuro?: Logo;
  /**
   * Corrección óptica del tamaño, 1 por omisión.
   *
   * `LogoWall` iguala el **área** de todas las marcas, que es lo que resuelve el problema
   * grueso: a igual altura, Columbia ocupaba once veces más superficie que USACH. Pero área
   * igual no es peso igual, porque la **densidad de tinta dentro de la caja** cambia de una
   * marca a otra: el logo de la UC es un escudo pequeño sobre una línea de texto fina, casi
   * todo aire, mientras que el de USACH llena su caja.
   *
   * Ningún cálculo sobre el `viewBox` puede ver eso —habría que medir los píxeles con tinta—
   * así que este factor es **un juicio a ojo, y se declara como tal**. Se usa con moderación:
   * si hiciera falta un valor lejos de 1, el problema es que la variante elegida del logo no
   * es la adecuada para una pared horizontal.
   */
  escalaOptica?: number;
  url?: string;
}

export interface ExpositorComun {
  /** Clave estable para enlazar con la reseña de cada idioma. */
  id: string;
  name: string;
  /** Nombre institucional. No se traduce; ver la nota de arriba. */
  affiliation?: string;
  country?: CodigoPais;
  /** Sin afiliación confirmada: cada idioma pone su propio texto. */
  affiliationPending?: boolean;
  /**
   * Perfil institucional o académico público. Se enlaza en la ficha para que
   * cualquier dato de la reseña sea comprobable en su fuente.
   */
  perfil?: string;
  /**
   * Retrato ya normalizado a cuadrado. **Opcional a propósito.**
   *
   * Sin foto, la ficha muestra el monograma de iniciales, que es un estado por defecto y no
   * un hueco (RF-11.2). Esa vía tiene que seguir funcionando: una foto solo se publica con
   * autorización expresa de la persona (RF-11.1), así que el caso «todavía no hay» es
   * normal y no excepcional.
   */
  foto?: ImageMetadata;
}

export interface NodoRed {
  label: string;
  detail: string;
  country: CodigoPais;
}

export interface DiaPrograma {
  date: string;
  label: string;
  sessions: Array<{
    time: string;
    title: string;
    speaker?: string;
    /**
     * Resumen de la charla. Opcional a propósito: una pausa o un almuerzo no
     * lo tienen, y forzarlo obligaría a inventar texto.
     */
    summary?: string;
  }>;
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

  /*
   * Los perfiles enlazados son la fuente de cada reseña: cualquier dato de la
   * ficha se puede comprobar ahí. Las reseñas en sí viven en los archivos de
   * idioma, porque son texto y se traducen.
   */
  speakers: {
    international: [
      {
        id: 'zussman',
        foto: fotoZussman,
        name: 'Gil Zussman',
        affiliation: 'Columbia University',
        country: 'US',
        perfil: 'https://www.ee.columbia.edu/gil-zussman',
      },
      {
        id: 'du',
        foto: fotoDu,
        name: 'Jinfeng Du',
        affiliation: 'Nokia Bell Labs',
        country: 'US',
        perfil: 'https://www.bell-labs.com/about/researcher-profiles/jinfengdu/',
      },
      {
        id: 'valenzuela',
        foto: fotoValenzuela,
        name: 'Reinaldo A. Valenzuela',
        affiliation: 'Nokia Bell Labs',
        country: 'US',
        perfil: 'https://www.nokia.com/people/reinaldo-valenzuela/',
      },
    ],
    national: [
      /*
       * La afiliación sigue marcada como pendiente a propósito. Las fuentes
       * públicas lo sitúan al frente del Wireless Communications Research Group
       * de la Universidad Técnica Federico Santa María, pero eso es `[probable]`
       * hasta que la organización lo confirme, y este proyecto no publica datos
       * institucionales sin confirmar. Ver `ESTADO.md` §7.
       */
      {
        id: 'feick',
        foto: fotoFeick,
        name: 'Rodolfo Feick',
        affiliationPending: true,
        perfil: 'http://investigacion.electronica.usm.cl/~wcg/',
      },
      {
        id: 'gutierrez',
        foto: fotoGutierrez,
        name: 'Miguel Gutiérrez Gaitán',
        affiliation: 'Pontificia Universidad Católica de Chile',
        country: 'CL',
        perfil: 'https://www.ing.uc.cl/academicos-e-investigadores/miguel-jose-gutierrez-gaitan/',
      },
      {
        id: 'toledo',
        foto: fotoToledo,
        name: 'Karel Toledo de la Garza',
        affiliation: 'Universidad de Santiago de Chile',
        country: 'CL',
        perfil: 'https://investigadores.anid.cl/en/public_search/researcher?id=34038',
      },
    ],
  },

  organizers: [
    /*
     * Logo oficial, del paquete `logos_pucv` de Normas Gráficas de la Dirección
     * de Comunicación Estratégica. Es PNG porque PUCV no publica SVG.
     *
     * La variante oscura se derivó de la monocromática oficial pasando la tinta
     * a blanco, sin tocar forma ni alfa: el paquete no incluye una versión
     * blanca sobre transparente y la tinta institucional da **2,62:1** sobre el
     * fondo del tema oscuro `[medido]`, por debajo del umbral de objeto gráfico.
     * Está pedida a Comunicación Estratégica (A13); cuando llegue, se sustituye
     * el archivo y no hay que tocar código.
     */
    {
      name: 'Pontificia Universidad Católica de Valparaíso',
      shortName: 'PUCV',
      logo: pucvClaro,
      logoOscuro: pucvOscuro,
      url: 'https://www.pucv.cl',
    },
    {
      name: 'Escuela de Ingeniería Eléctrica PUCV',
      shortName: 'EIE PUCV',
      logo: eieClaro,
      logoOscuro: eieOscuro,
      url: 'https://www.eie.ucv.cl',
    },
  ],

  /*
   * ═══ LAS CUATRO MARCAS DE TERCEROS VUELVEN A MARCADOR DE POSICIÓN ═══
   *
   * Retiradas el 2026-08-25, por instrucción de Daniel. **No es una regresión de
   * maquetación: es que estaban publicadas sin autorización de su titular.**
   *
   * Lo que lo destapó: al preparar los correos que piden el permiso se midió qué
   * mostraba la URL publicada, y mostraba las cuatro `[medido: 2026-08-25]`. El correo
   * a Columbia decía «no las hemos publicado» y el enlace del propio correo lo
   * desmentía. Y en dos casos —Columbia y Nokia— el titular ya había dicho por escrito
   * que su uso exige consentimiento previo: pedir permiso enseñando el uso ya hecho no
   * es pedir permiso.
   *
   * Dos defectos más que el mismo cambio resuelve:
   *   · El archivo de Columbia era el equivocado —`CUSPS`, la School of Professional
   *     Studies— y Zussman es de SEAS. Se mostraba la marca de otra facultad.
   *   · USACH desaparecía en tema oscuro: tinta negra pura sobre `#0a1020`.
   *
   * Los archivos NO se borran; siguen en `public/logos/` y en `src/assets/logos/`.
   * Reponer una marca cuando llegue su autorización es **volver a poner su línea
   * `logo:`**, con la variante por tema si la tiene. El trámite y su estado están en
   * `specs/gestion/correos-instituciones.md`.
   *
   * Nota para quien reponga la UC: **la numeración de sus archivos no significa lo
   * mismo entre variantes.** El `-04` azul tiene proporción 2,56 y el `-04` blanco
   * 3,87; el blanco equivalente es el `-03`. Se eligen por proporción, no por número,
   * para que la marca no cambie de forma al cambiar de tema.
   */
  participants: [
    {
      name: 'Pontificia Universidad Católica de Chile',
      shortName: 'UC',
      // Autorización pedida a `mhola@uc.cl`. Archivos listos: `/logos/uc.svg` y
      // `/logos/uc-oscuro.svg`, con `escalaOptica: 1.28`.
      url: 'https://www.uc.cl',
    },
    {
      name: 'Universidad de Santiago de Chile',
      shortName: 'USACH',
      // Autorización pedida a `imagen@usach.cl`, junto con la variante blanca que su
      // paquete no trae. Al reponer: `logo: usachClaro` con `escalaOptica: 0.82`.
      url: 'https://www.usach.cl',
    },
    {
      name: 'Nokia Bell Labs',
      shortName: 'Nokia Bell Labs',
      // Sus términos: el acceso al sitio no concede derecho a usar ninguna marca.
      // Archivo listo: `/logos/nokia-bell-labs.svg`.
      url: 'https://www.bell-labs.com',
    },
    {
      name: 'Columbia University',
      shortName: 'Columbia',
      // Requiere permiso de su Office of General Counsel. **Y hay que pedirles el
      // archivo correcto**: el que tenemos es de CUSPS, no de SEAS.
      url: 'https://www.columbia.edu',
    },
  ],

  /*
   * Reconocimiento del financiamiento (RNF-8). **No es cortesía: ANID lo exige**,
   * y nombra los sitios web entre los productos donde aplica.
   *
   * Dos cosas que estaban mal antes del 2026-08-03 y que este bloque corrige:
   *
   * 1. **La marca obligatoria es el conjunto «Ministerio de Ciencia + ANID»**, no
   *    la marca ANID sola. Los archivos son los oficiales del kit digital, en su
   *    versión 2026, con variante para cada fondo.
   * 2. **La mención tiene nomenclatura fija**: «Financiado por la Agencia Nacional
   *    de Investigación y Desarrollo, ANID / Instrumento (concurso)». Por eso
   *    `mencion` vive aquí y no en los archivos de idioma: es una fórmula
   *    institucional en español, y traducirla la rompería.
   *
   * Fuente de las dos, en `specs/fuentes.md`: el documento «¿Cómo mencionar a
   * ANID en productos de divulgación?» de su kit digital.
   */
  funding: {
    agency: {
      name: 'Agencia Nacional de Investigación y Desarrollo',
      shortName: 'ANID',
      logo: '/logos/anid-minciencia.svg',
      logoOscuro: '/logos/anid-minciencia-oscuro.svg',
      url: 'https://www.anid.cl',
    },
    project: { code: 'FOVI250222' },
    /**
     * Nombre oficial del concurso. `[verificado]` en la página del concurso en
     * anid.cl; la correspondencia entre el código `FOVI25…` y la convocatoria
     * 2025 es `[probable]` y **está pendiente de que la organización la
     * confirme** (A11). Si el concurso fuera otro, se cambia esta línea.
     */
    concurso: 'Concurso de Fomento a la Vinculación Internacional para Instituciones de Investigación 2025',
    /** La fórmula exacta que exige ANID. Se compone con `concurso`. */
    mencion: 'Financiado por la Agencia Nacional de Investigación y Desarrollo, ANID',
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

