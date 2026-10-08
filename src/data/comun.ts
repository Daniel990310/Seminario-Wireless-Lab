/*
 * Los logos ráster del proyecto se importan, no se referencian por ruta.
 *
 * PUCV no publica SVG de su escudo —el paquete `logos_pucv` de Normas Gráficas trae PNG—, y
 * la EIE y CYTED entregaron JPG/PNG: son los archivos que el optimizador de Astro puede mejorar. Importarlos
 * desde `src/assets` es lo que le permite emitir formatos modernos y declarar las
 * dimensiones intrínsecas. Los demás logos son SVG y siguen en `/public`, porque para
 * vectores el optimizador no hace nada y el flujo de sustituir el archivo por su nombre es
 * más útil.
 */
import type { IconoSesion } from './programa';
import pucvClaro from '~/assets/logos/pucv.png';
import pucvOscuro from '~/assets/logos/pucv-oscuro.png';
/*
 * Logo EIE: vuelve la submarca horizontal, la que estaba antes del 2026-10-01, por
 * indicación de Mauricio en la reunión del 2026-10-04. El logo institucional cuadrado
 * (`eie-institucional*.png`) queda en `src/assets/logos/` sin usar. Ver RF-10.
 */
import eieClaro from '~/assets/logos/eie-pucv.png';
import eieOscuro from '~/assets/logos/eie-pucv-oscuro.png';
import cytedLogo from '~/assets/logos/cyted-40-anos.png';
/*
 * ═══ COLUMBIA Y USACH VUELVEN, POR DECISIÓN DE LA ORGANIZACIÓN ═══
 *
 * Repuestos el **2026-09-25**. Estuvieron fuera desde el 2026-08-25 porque no había
 * autorización de su titular, y **siguen sin tenerla**: lo que cambió no es el permiso,
 * es la decisión. Mauricio Rodríguez, director del programa y del seminario, asumió la
 * responsabilidad de publicar las marcas disponibles públicamente, y Daniel lo instruyó
 * así. Queda escrito en RF-22 con fecha y nombre, porque una decisión de este tipo no
 * puede vivir solo en un chat.
 *
 * El 2026-10-04 Mauricio extendió esa decisión: los logos que faltaban (ALMA, UPB) se
 * toman de internet y Columbia cambia de archivo, bajo su responsabilidad (RF-22).
 *
 * · **Columbia: la marca de la universidad, no la de CUSPS.** Los archivos anteriores eran
 *   de la School of Professional Studies y se retiraron. Ahora va el logotipo institucional
 *   de Columbia University, que es el nombre de la ficha; se tomó del SVG de Wikipedia
 *   (`Columbia_University_1754.svg`, una sola tinta `#000d74`) y se rasterizó a PNG, con la
 *   variante oscura en blanco. Columbia Creative indicó que a Zussman le corresponde la de
 *   Columbia Engineering, que no está publicada con texto; si él la manda, se sustituye.
 * · **USACH desaparecía en tema oscuro.** Tinta negra pura —`rgb(0,0,0)` en los píxeles
 *   opacos `[medido]`—, **1,10:1** sobre el fondo oscuro. Desde el 2026-10-04 lleva
 *   `usach-oscuro.png`, la misma silueta en blanco derivada del original.
 */
import columbiaClaro from '~/assets/logos/columbia-university.png';
import columbiaOscuro from '~/assets/logos/columbia-university-oscuro.png';
import usachClaro from '~/assets/logos/usach.png';
import usachOscuro from '~/assets/logos/usach-oscuro.png';
/*
 * ALMA: el logotipo de color que publica ESO (`eso.org/public/products/logos/alma-logo`),
 * una placa azul opaca que se lee igual en los dos temas, así que va sin variante.
 * UPB: el de su sitio, `upb.edu`, que solo está en blanco con alfa; esa es la variante
 * oscura, y la clara es la misma silueta en `#1d1d1b`, como las demás marcas de una tinta.
 */
import almaLogo from '~/assets/logos/alma.png';
import upbClaro from '~/assets/logos/upb.png';
import upbOscuro from '~/assets/logos/upb-oscuro.png';
import pucClaro from '~/assets/logos/puc.png';
import pucOscuro from '~/assets/logos/puc-oscuro.png';
import comsocClaro from '~/assets/logos/comsoc-chile.png';
import comsocOscuro from '~/assets/logos/comsoc-chile-oscuro.png';
import cpsRtcClaro from '~/assets/logos/cps-rtc.png';
import cpsRtcOscuro from '~/assets/logos/cps-rtc-oscuro.png';
/*
 * CCTVal: el logotipo horizontal de color de `cctval.cl` (`ORG_CCTVAL_Logotipo_…_Mesa-de-
 * trabajo-1.png`, 4501 × 1697, recortado y llevado a 1400 px). Tinta `rgb(45, 48, 198)`:
 * 8,55:1 sobre el fondo claro y 2,00:1 sobre el oscuro `[medido]`, así que la variante
 * oscura es la silueta en blanco.
 */
import cctvalClaro from '~/assets/logos/cctval.png';
import cctvalOscuro from '~/assets/logos/cctval-oscuro.png';
import apsOscuro from '~/assets/logos/ieee-aps-oscuro.png';
/*
 * Retrato de Mauricio Rodríguez para «El seminario» (RF-31). Lo pidió él, a través de
 * Daniel, el 2026-10-04: eso es la autorización de RF-11.1. Desde el 2026-10-06 es la foto
 * de estudio que entregó Daniel (`Mauricio_Rodriguez.png`, 1024×1536, fondo gris): recorte
 * cuadrado con la cabeza a la altura de la de los expositores, con el fondo gris extendido
 * a los lados y arriba copiando el borde, porque el original es más angosto que el
 * cuadrado. Sale a 800×800 WebP. La anterior era la de su ficha en `eie.pucv.cl`.
 */
import fotoRodriguez from '~/assets/organizacion/rodriguez.webp';

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
import fotoSiles from '~/assets/expositores/siles.webp';
import fotoGutierrez from '~/assets/expositores/gutierrez.webp';
import fotoToledo from '~/assets/expositores/toledo.webp';
import fotoSiringo from '~/assets/expositores/siringo.webp';
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
  /**
   * Factor adicional solo en la fila de participantes del flyer, que es más densa que el
   * muro del sitio. 1 por omisión.
   */
  escalaOpticaFlyer?: number;
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
    /** Ficha del expositor en «Expositores», destino del enlace de su nombre. */
    speakerId?: string;
    /** Sin ícono en el programa de demostración, que no tiene clases de sesión. */
    icono?: IconoSesion;
    /**
     * Resumen de la charla. Opcional a propósito: una pausa o un almuerzo no
     * lo tienen, y forzarlo obligaría a inventar texto.
     */
    summary?: string;
    /** Idioma de título y resumen cuando no es el de la página: las charlas van en inglés. */
    lang?: 'en';
  }>;
}

export const comun = {
  /** Título oficial: se mantiene en inglés en toda la web (RF-1.2). */
  title: 'Beyond Connectivity: Wireless Sensing in mmWave and Sub-THz Bands',
  /**
   * `<title>` del documento, la pestaña y el buscador: variante de `title` (RF-1.2), corta
   * a propósito (~61 caracteres), sin la fecha, que va en la descripción, y con «/» en vez
   * de « and ». El `<h1>` sigue usando `title`; si el nombre oficial cambia, actualizar
   * las dos.
   */
  tituloDocumento: 'Beyond Connectivity: Wireless Sensing in mmWave/Sub-THz Bands',
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
       * El retrato de Siles entró el 2026-10-01: él mismo lo envió (`foto_GSiles_USRS.jpg`,
       * correo del 2026-09-30) para la sección de expositores del sitio, que es la
       * autorización de RF-11.1. 560×560, recorte cuadrado centrado en la cara y revisado
       * con la máscara circular. El de Siringo entró el mismo día: Daniel confirmó que
       * autoriza su publicación (RF-11.1).
       *
       * Siles es el único internacional de los dos: la Universidad Privada Boliviana está
       * en Bolivia y por eso entra `BO` en `CodigoPais`. **Siringo se movió al bloque
       * nacional el 2026-09-25**, por decisión de Daniel; el porqué está junto a su ficha.
       */
      {
        id: 'siles',
        foto: fotoSiles,
        name: 'Gustavo A. Siles Soria',
        affiliation: 'Universidad Privada Boliviana',
        country: 'BO',
        perfil: 'https://lrc.upb.edu/people/',
      },
    ],
    national: [
      /*
       * **Nacional, no internacional.** Estuvo tres días en el bloque de internacionales
       * porque el organizador lo listó junto a los de Estados Unidos y porque el Joint ALMA
       * Observatory es un consorcio intergubernamental —ESO, NSF y NINS—. Daniel lo corrigió
       * el 2026-09-25 con el criterio que manda aquí: **el expositor trabaja en Chile**, en
       * el observatorio de Atacama, y el bloque agrupa por dónde está la persona y no por la
       * nacionalidad de su empleador.
       *
       * Con eso el `country` deja de ser un problema y pasa a ser `CL`: antes se omitía
       * justamente porque ninguna etiqueta de país describe a un consorcio, pero la etiqueta
       * describe a la persona.
       *
       * La afiliación es la cadena que confirmó el organizador, y su firma del 2026-10-06 la
       * respalda: «Senior RF Engineer, ALMA» e «International Staff Member, ESO». ESO sí es
       * su empleador; trabaja destinado en ALMA.
       */
      {
        id: 'siringo',
        foto: fotoSiringo,
        name: 'Giorgio Siringo',
        affiliation: 'ALMA / European Southern Observatory',
        country: 'CL',
        perfil: 'https://www.almaobservatory.org/en/team/giorgio-siringo/',
      },
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
      url: 'https://eie.pucv.cl',
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
   */
  participants: [
    /*
     * Desde el 2026-10-06, el escudo con «Pontificia Universidad Católica de Chile» debajo
     * (`PUC-11.png`, entregado por Daniel), y no el `uc.svg` anterior. Entre los archivos
     * que llegaron estaba también el logotipo vigente «UC | Chile», pero dice «UC» en
     * grande, justo lo que Mauricio pidió cambiar por «PUC» (reunión del 2026-10-04).
     * Este dice el nombre completo y su tinta gris oscura se lee mejor que el azul claro
     * del anterior (3,58:1). La variante oscura es la misma silueta en blanco.
     * Autorización pedida a `mhola@uc.cl`, sin respuesta: publicada por la decisión de RF-22.
     */
    {
      name: 'Pontificia Universidad Católica de Chile',
      // «PUC» y no «UC», por indicación de Mauricio Rodríguez en la reunión del 2026-10-04.
      shortName: 'PUC',
      logo: pucClaro,
      logoOscuro: pucOscuro,
      // Juicio a ojo: escudo de línea fina y texto pequeño, casi todo aire; a igual área
      // se veía la más chica del muro.
      escalaOptica: 1.35,
      url: 'https://www.uc.cl',
    },
    /*
     * ⚠️ **Sin `logoOscuro`, y eso se ve.** Su paquete no trae variante blanca y la tinta
     * negra da **1,10:1** sobre el fondo del tema oscuro `[medido]`: la marca está ahí y no
     * se distingue. `LogoWall` usa `logo` en los dos temas cuando falta `logoOscuro`, así
     * que no se rompe nada, simplemente no se ve.
     *
     * La salida es derivar la variante blanca del original —negate conservando el alfa, lo
     * mismo que se hizo con el escudo PUCV—. **Está pendiente**, y hasta entonces esta marca
     * solo cumple en tema claro. Autorización pedida a `imagen@usach.cl`, **sin respuesta**.
     *
     * `escalaOptica: 0.82` porque su imagotipo llena la caja más que los demás y a igual
     * área se ve más pesado.
     */
    {
      name: 'Universidad de Santiago de Chile',
      shortName: 'USACH',
      logo: usachClaro,
      // Variante oscura derivada el 2026-10-04: la misma silueta en blanco. El original es
      // tinta negra pura `[medido]` y en tema oscuro no se veía (1,10:1).
      logoOscuro: usachOscuro,
      escalaOptica: 0.82,
      url: 'https://www.usach.cl',
    },
    /*
     * ═══ LA PRIMERA MARCA DE TERCERO AUTORIZADA ═══
     *
     * Concedida por escrito el **2026-09-24** por Cristian Reyes Sandoval, Jefe del Área
     * de Diseño de la Sub Dirección de Imagen Corporativa de la UTFSM, en respuesta a la
     * solicitud del comité. Los dos archivos los envió él. Copia del hilo en
     * `specs/gestion/correos-logos/respuestas/`.
     *
     * **Es la marca institucional USM, no la submarca del CCTVal.** Se le preguntó cuál
     * correspondía —Feick participa por su afiliación al centro— y respondió enviando la
     * institucional, así que esa es la que se usa. Si más adelante prefieren la submarca,
     * se sustituyen los dos archivos conservando el nombre y no hay que tocar código.
     *
     * Las dos variantes tienen **el mismo `viewBox`** —305,85 × 61,76, proporción 4,95—
     * así que la marca no cambia de forma al cambiar de tema, que es el defecto que tiene
     * la UC. Una sola tinta cada una: `#1d1d1b` la clara y `#fff` la oscura `[medido]`.
     *
     * **Nos autorizó además a recolorearla** para ajustarla al azul del sitio —«si desean
     * hacer el cambio de color para mantener la paleta cromática del sitio no veo ningún
     * problema»—. **No se ejercita ese permiso**, y no por inercia: con las dos variantes
     * ya cubrimos los dos fondos, así que recolorear no resolvería nada que no esté
     * resuelto, y una marca en un color que su dueño no usa se ve como un error aunque
     * esté permitida. El permiso queda registrado por si alguna vez hace falta.
     *
     * **Pendiente que nace con esto:** pidieron ver la integración —«quedamos atentos a la
     * integración para ver que esté utilizada de manera correcta»—. Hay que escribirle a
     * Cristian con el enlace cuando esté desplegada.
     */
    {
      name: 'Universidad Técnica Federico Santa María',
      shortName: 'UTFSM',
      logo: '/logos/utfsm.svg',
      logoOscuro: '/logos/utfsm-oscuro.svg',
      url: 'https://www.usm.cl',
    },
    /*
     * El centro por el que participa Feick, junto a la marca USM y no en su lugar: la USM
     * autorizó la institucional, y la submarca que pidió Mauricio el 2026-09-25 nunca llegó.
     * Se toma de internet por la decisión de Mauricio del 2026-10-04 (RF-22), que Daniel
     * extendió al CCTVal el 2026-10-08. `cctval.cl` y no `cctval.usm.cl`, que tiene el
     * certificado TLS vencido.
     */
    {
      name: 'Centro Científico Tecnológico de Valparaíso',
      shortName: 'CCTVal',
      logo: cctvalClaro,
      logoOscuro: cctvalOscuro,
      url: 'https://cctval.cl',
    },
    /*
     * Un solo archivo para los dos temas, y esta vez no es una carencia: su tinta es el azul
     * `#005aff`, que da **4,69:1** sobre el fondo claro y **3,56:1** sobre el oscuro
     * `[medido]`. Las dos por encima del umbral de objeto gráfico, así que la marca se ve
     * bien en ambos sin necesitar variante.
     *
     * Sus términos de uso dicen que el acceso al sitio **no concede derecho a usar ninguna
     * marca** y exigen consentimiento escrito previo. No lo tenemos: de los siete titulares,
     * este es el que lo niega de forma más explícita.
     */
    {
      name: 'Nokia Bell Labs',
      shortName: 'Nokia Bell Labs',
      logo: '/logos/nokia-bell-labs.svg',
      url: 'https://www.bell-labs.com',
    },
    /*
     * Columbia contestó el 2026-09-24 y **el archivo hay que pedírselo a Zussman**:
     * Geoffrey Allen, de Columbia Creative, responde que cualquier docente puede
     * descargar la marca de Columbia Engineering desde `downloads.visualidentity.columbia.edu`.
     *
     * Confirma de paso que teníamos razón en el error que les señalamos: la marca que
     * corresponde es la de **Columbia Engineering (SEAS)**, no la de CUSPS que teníamos.
     *
     * Lo que **todavía no hay** es una autorización explícita por escrito para mostrarla
     * en un sitio de terceros. Contestaron nuestra petición —que describía el uso
     * completo— indicándonos cómo conseguir el archivo, lo que se lee razonablemente como
     * consentimiento; pero una línea suya diciéndolo cuesta nada y vale mucho más que esa
     * lectura nuestra. Ver `specs/gestion/correos-logos/respuestas/`.
     */
    {
      name: 'Columbia University',
      shortName: 'Columbia',
      // Logotipo institucional de la universidad desde el 2026-10-04; ver el bloque de imports.
      logo: columbiaClaro,
      logoOscuro: columbiaOscuro,
      url: 'https://www.columbia.edu',
    },
    /*
     * Las dos instituciones que entraron con la nómina definitiva. Sin autorización de su
     * titular: se publican por la decisión de Mauricio del 2026-10-04 (RF-22). El aviso de
     * copyright de ALMA exige consentimiento escrito previo para su logo, pedido a
     * `copyright@alma.cl` sin respuesta; la UPB no publica contacto de marca.
     */
    {
      name: 'ALMA / European Southern Observatory',
      shortName: 'ALMA',
      logo: almaLogo,
      // Placa opaca y vertical: el área la lleva al tope de 1,7× y en la fila densa del
      // flyer pesaba más que cualquier otra marca.
      escalaOpticaFlyer: 0.75,
      url: 'https://www.almaobservatory.org',
    },
    {
      name: 'Universidad Privada Boliviana',
      shortName: 'UPB',
      logo: upbClaro,
      logoOscuro: upbOscuro,
      // Juicio a ojo: a igual área su silueta maciza pesaba más que el resto del muro.
      escalaOptica: 0.78,
      url: 'https://www.upb.edu',
    },
    /*
     * Las dos marcas que llegaron con Miguel Gutiérrez Gaitán, entregadas por Daniel el
     * 2026-10-06. [supuesto] que entran como colaboradoras por él: el CPS-RTC es el centro
     * de investigación aplicada de la PUC financiado por ANID (convocatoria 2025) que
     * dirige Felipe Núñez y del que Gutiérrez es investigador principal; el capítulo
     * chileno de IEEE ComSoc es el que él presidió. Sin `url`: ninguna de las dos tiene
     * una dirección confirmada.
     *
     * ComSoc venía en dos archivos: el original opaco sobre blanco y uno sin fondo hecho
     * con una herramienta automática, que dejó la tinta translúcida. Se usa el original con
     * el blanco convertido en transparencia (tinta `rgb(3, 90, 130)` [medido]); la variante
     * oscura es la silueta en blanco. La del CPS-RTC pasa a claro solo lo gris, sin tocar
     * el azul de la marca.
     *
     * Autorización: Gutiérrez las mandó para el sitio («Recuerda usar los logos de ComSoc
     * Chile, del centro y de la UC (dejé 2 tipos) para poder usar fondos si fuera
     * necesario», correo a Mauricio del 2026-09-10) `[verificado]`. Las variantes oscuras
     * son derivadas nuestras y en el CPS-RTC eso toca colores, lo que RF-10.4 evita;
     * Mauricio asumió la responsabilidad de publicarlas así (Daniel, 2026-10-06).
     */
    {
      name: 'IEEE Communications Society, Chile Section',
      shortName: 'IEEE ComSoc Chile',
      logo: comsocClaro,
      logoOscuro: comsocOscuro,
    },
    {
      name: 'Cyber-Physical Systems Research and Technology Center',
      shortName: 'CPS-RTC',
      logo: cpsRtcClaro,
      logoOscuro: cpsRtcOscuro,
      // Juicio a ojo: el subtítulo en dos renglones finos se perdía a igual área.
      escalaOptica: 1.2,
    },
  ],

  /*
   * Marcas que van en la fila de participantes del flyer y no en el sitio. IEEE AP-S, la
   * sociedad de antenas y propagación, que tiene su espacio en el programa: Mauricio pidió
   * su logo en el flyer (Daniel, 2026-10-08), bajo la misma decisión de tomar de internet
   * los logos que faltan (RF-22). `main-logo-2025.svg` de `ieeeaps.org`, rasterizado a
   * 360 px de alto; la variante oscura es la silueta en blanco. Solo esa variante, porque
   * la fila va sobre el fondo oscuro de la lámina.
   */
  colaboradoresFlyer: [
    {
      name: 'IEEE Antennas and Propagation Society',
      shortName: 'IEEE AP-S',
      logoOscuro: apsOscuro,
      url: 'https://www.ieeeaps.org',
    },
    // `satisfies` comprueba el contrato; `as` lo ensancha para que se lean los opcionales.
  ] satisfies Institucion[] as Institucion[],

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
    /**
     * Otros proyectos de ANID que financian el seminario (RNF-8.4). El Fondecyt Regular de
     * Mauricio Rodríguez lo pidió él, a través de Daniel, el 2026-10-06 `[supuesto: dado por
     * él, no cotejado con el repositorio de ANID]`. Solo instrumento y
     * folio: el título del proyecto no llegó y no se publica uno buscado por nuestra cuenta.
     * Instrumento y folio no se traducen, como la mención.
     *
     * Los dos proyectos de Miguel Gutiérrez Gaitán (Fondecyt 11241221 y CPS-RTC CIA250016)
     * estuvieron aquí del 2026-10-07 al 2026-10-08; Daniel los retiró: eran información de
     * Miguel, no financiamiento del seminario.
     */
    otrosProyectos: [{ instrumento: 'Fondecyt Regular', code: '1250951' }],
  },

  /**
   * Los demás financiadores del seminario, **al mismo nivel que ANID**.
   *
   * Incorporado el 2026-09-25 por indicación de Mauricio Rodríguez. La primera versión de
   * ese día lo puso como «red a la que el seminario se adscribe», en tipografía menor y
   * debajo del proyecto: **estaba mal y Daniel lo corrigió el mismo día**. CYTED financia,
   * no acoge. Se deja escrito porque el error es fácil de repetir: el código lleva `RT` de
   * *Red Temática* y eso invita a leerlo como pertenencia en vez de como financiamiento.
   *
   * Por qué ANID sigue aparte y no entra en esta lista: su mención tiene **nomenclatura
   * obligatoria** —la fórmula exacta que exige su manual (RNF-8.1)— y su bloque la compone
   * con `concurso`. Meterlos en la misma estructura obligaría a que ANID renunciara a su
   * fórmula o a que los demás cargaran con un campo que no usan.
   *
   * **Nada de esto se traduce**, por lo mismo que la mención de ANID: el nombre de una red
   * CYTED es su nombre oficial, en español, y traducirlo produciría una red que no existe.
   *
   * `logo` es opcional. Desde el 2026-10-01 lleva **la marca conmemorativa de 40 años**
   * (PNG 300×298, fondo negro opaco), que Daniel entregó y pidió usar: CYTED no publica
   * otro archivo utilizable `[medido: 2026-09-25]`. Es una marca de aniversario, no el
   * logotipo permanente; cuando llegue el archivo institucional es cambiar esta línea.
   * El fondo negro se conserva tal cual, como el JPG de la EIE: no se recolorea la marca.
   */
  financiadores: [
    {
      agency: {
        name: 'Programa Iberoamericano de Ciencia y Tecnología para el Desarrollo',
        shortName: 'CYTED',
        url: 'https://www.cyted.org',
        logo: cytedLogo,
      },
      project: {
        code: '525RT0175',
        acronimo: 'DISeCom',
        name: 'Gemelos digitales integrando la detección y las comunicaciones inalámbricas en Iberoamérica',
        periodo: '2025–2028',
      },
    },
  ],

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
    // Nombre corto por pedido suyo en la reunión del 2026-10-04.
    { nombre: 'Mauricio Rodríguez', grado: 'doctor' },
    { nombre: 'Daniel Caignet González', grado: 'candidato' },
    // `satisfies` y no una anotación: conserva los tipos literales de `grado` —que
    // es lo que permite indexar `ui.pie.grados` sin castear— y a la vez falla aquí
    // mismo si alguien escribe un grado que no existe en los dos idiomas.
  ] satisfies ReadonlyArray<{ nombre: string; grado: GradoAcademico }>,

  /**
   * Quien dirige el seminario, con retrato, en la sección «El seminario» (RF-31). El
   * nombre no se traduce; el cargo y el texto viven en `about.director` de cada idioma.
   */
  director: {
    nombre: 'Mauricio Rodríguez',
    foto: fotoRodriguez,
    perfil: 'https://eie.pucv.cl/nuestro-equipo/mauricio-rodriguez-guzman/',
  },

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

