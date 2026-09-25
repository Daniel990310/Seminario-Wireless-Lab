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
import { acceso } from './acceso';

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

/**
 * `BO` entra el 2026-09-22 con Gustavo Siles, de la Universidad Privada Boliviana,
 * confirmado en la lista de expositores del organizador. Añadir un código aquí
 * **no compila** hasta que `paises` lo traduzca en los dos idiomas, que es lo que
 * impide publicar una ficha con el país en blanco.
 */
export type CodigoPais = 'US' | 'CL' | 'BO';

/**
 * Grados del comité organizador. Es una unión y no una cadena libre a propósito:
 * `ui.pie.grados` es un `Record` sobre este tipo, así que añadir un grado nuevo
 * **no compila** hasta que esté traducido en los dos idiomas.
 */
export type GradoAcademico = 'doctor' | 'candidato';

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

  /**
   * Régimen de acceso. El dato vive en `acceso.ts`, sin importaciones, para que
   * `scripts/verify-seo.mjs` pueda leer **la misma fuente** que el sitio. Ver la
   * cabecera de ese archivo.
   */
  acceso,

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
      /*
       * Los dos expositores que faltaban, incorporados el 2026-09-22 con la lista de
       * confirmados que envió Mauricio Rodríguez. Ver
       * `specs/gestion/programa-y-expositores.md`.
       *
       * **Ninguno de los dos tiene retrato**, y es el estado correcto: una foto solo se
       * publica con autorización expresa de la persona (RF-11.1). Hasta que llegue, la
       * ficha muestra el monograma de iniciales (RF-11.2).
       *
       * Siringo va en el bloque «internacionales» aunque **trabaje en Chile**: el Joint
       * ALMA Observatory es un consorcio internacional —ESO, NSF y NINS— y así lo agrupó
       * el organizador. Por lo mismo se queda **sin `country`**: ninguna etiqueta de país
       * describe una organización intergubernamental, y el campo es opcional justamente
       * para no tener que inventar una. Si la organización decide que lleve «Chile», se
       * añade `country: 'CL'` y no hay que tocar nada más.
       *
       * La afiliación es la cadena que confirmó el organizador. Matiz que conviene saber
       * antes de «corregirla»: la página oficial de ALMA lo lista como *Front-End
       * Technical Lead* del **Joint ALMA Observatory**, y ESO es uno de los tres socios
       * de ALMA, no su empleador directo.
       */
      {
        id: 'siringo',
        name: 'Giorgio Siringo',
        affiliation: 'ALMA / European Southern Observatory',
        perfil: 'https://www.almaobservatory.org/en/team/giorgio-siringo/',
      },
      {
        id: 'siles',
        name: 'Gustavo A. Siles Soria',
        affiliation: 'Universidad Privada Boliviana',
        country: 'BO',
        perfil: 'https://lrc.upb.edu/people/',
      },
    ],
    national: [
      /*
       * Afiliación confirmada el 2026-09-22: el organizador lo lista como **CCTVal** en
       * la nómina oficial de expositores. Cierra A3, que llevaba abierta desde julio
       * porque las fuentes públicas lo situaban en el Wireless Communications Research
       * Group de la UTFSM y eso era `[probable]`, no confirmado.
       *
       * Las dos cosas son compatibles y por eso la cadena las nombra juntas: el CCTVal
       * —Centro Científico Tecnológico de Valparaíso— es un centro basal **alojado en la
       * UTFSM**, y la propia PUCV lo presenta como «Dr. Rodolfo Feick (CCTVal-UTFSM)».
       * El organizador escribió solo «CCTVal»; se publica la forma larga porque una
       * sigla sola no identifica a la institución para quien llega de fuera.
       */
      {
        id: 'feick',
        foto: fotoFeick,
        name: 'Rodolfo Feick',
        affiliation: 'CCTVal, Universidad Técnica Federico Santa María',
        country: 'CL',
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

  /**
   * Inscripción (RF-3). **Un enlace saliente a un formulario de Google**, no un
   * formulario propio ni un `<iframe>`: ver el porqué en RF-3, que lo decide.
   *
   * Conectado el 2026-09-24 con el formulario creado por el organizador, que responde
   * público y sin exigir sesión de Google `[medido: 2026-09-24]`.
   * Si vuelve a `null` **no se pinta ningún botón** y el sitio queda como estaba.
   *
   * No se traduce: Google Forms sirve un único formulario para los dos idiomas.
   * Si algún día hay uno por idioma, esto pasa a `es.ts`/`en.ts` y `tipos.ts`
   * obliga a que estén los dos.
   */
  registro: {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSc7ltNBBSxUn9ViybRyeRSjDrIsV0evnSK62EcXXybKsgcwAw/viewform' as string | null,
  },

  /**
   * Comité organizador y desarrollo del sitio, en el pie (indicación de Daniel,
   * 2026-09-22).
   *
   * Los **nombres** viven aquí porque el nombre de una persona no se traduce. El
   * **grado** sí, y por eso es una clave que `ui.pie.grados` resuelve en cada idioma:
   * «Ing., candidato a Doctor» y «Eng., PhD candidate» no son la misma cadena.
   *
   * Dos normalizaciones deliberadas respecto de cómo llegaron los datos:
   *   - `Caignet` y no «Caigent», que es como se escribió una de las dos veces. Manda
   *     la dirección institucional, `daniel.caignet@pucv.cl`.
   *   - Grados como `Dr.` y nombres en caja normal con sus tildes, no `Phd.` ni
   *     versales. En un sitio institucional una abreviatura inventada se nota.
   * Si alguno de los dos está mal, se corrige aquí y aparece en los dos idiomas.
   */
  committee: [
    { nombre: 'Mauricio Alejandro Rodríguez Guzmán', grado: 'doctor' },
    { nombre: 'Daniel Caignet González', grado: 'candidato' },
    // `satisfies` y no una anotación: conserva los tipos literales de `grado` —que
    // es lo que permite indexar `ui.pie.grados` sin castear— y a la vez falla aquí
    // mismo si alguien escribe un grado que no existe en los dos idiomas.
  ] satisfies ReadonlyArray<{ nombre: string; grado: GradoAcademico }>,

  /** Quien construyó el sitio. Separado del comité: son dos papeles distintos. */
  developer: { nombre: 'Daniel Caignet González' },

  contact: {
    /**
     * Dirección real y probada, desde el 2026-09-22. Ya no es un marcador (cerraba A4).
     *
     * No es un buzón: es un alias de **Cloudflare Email Routing** sobre `bcsensing.org`
     * que reenvía a `daniel.caignet@pucv.cl`. Gratis, y evita publicar una dirección
     * personal en una página que va a repartirse impresa.
     *
     * Lo que hay detrás, para quien tenga que tocarlo:
     *   - MX `route1/2/3.mx.cloudflare.net`, SPF `include:_spf.mx.cloudflare.net`,
     *     DKIM `cf2024-1._domainkey` y DMARC `p=reject`.
     *   - El atrapa-todo está **desactivado** a propósito: cualquier otra dirección
     *     `@bcsensing.org` rebota, así que probar direcciones no revela cuáles existen.
     *   - `p=reject` vale porque el dominio **solo recibe**. Si algún día se responde
     *     desde aquí con un relé SMTP, hay que añadirlo al SPF y firmar con DKIM
     *     **antes** de enviar, o esos envíos rebotarán.
     *
     * Comprobado de extremo a extremo el 2026-09-22: DNS resuelto contra los NS
     * autoritativos y un correo de prueba recibido en el buzón PUCV `[verificado]`.
     */
    email: 'contact@bcsensing.org',
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

