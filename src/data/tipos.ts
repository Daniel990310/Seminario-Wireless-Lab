/**
 * Interfaz que TODO idioma debe satisfacer (T7).
 *
 * Esta es la pieza que hace que una traducción faltante sea un **error de
 * compilación** y no un hueco que alguien descubre en producción: `es.ts` y
 * `en.ts` se declaran `satisfies ContenidoIdioma`, así que `astro check` falla
 * si a uno le falta una clave que el otro tiene.
 *
 * Todo lo que no aparece aquí vive en `comun.ts` y no se traduce.
 *
 * Los rótulos de interfaz están agrupados por sección de la página, no en una
 * bolsa plana: con más de setenta cadenas, una lista alfabética hace imposible
 * saber si falta algo o si algo dejó de usarse.
 */
import type { CodigoPais, DiaPrograma } from './comun';

export interface SeccionEncabezado {
  /**
   * Epígrafe. **Opcional a propósito, y la excepción es la regla.**
   *
   * Solo lo lleva la sección cuyo `title` NO nombra la sección. Hoy es una:
   * `seminario`, cuyo título es una tesis y no una etiqueta. En las demás el epígrafe
   * repetía el título en pequeño —«Sede» sobre «Auditorio de la Sede PUCV Santiago»— y
   * se retiró el 2026-08-06. Antes de añadir uno nuevo, comprobar que dice algo que el
   * `title` no diga.
   */
  eyebrow?: string;
  title: string;
  lead?: string;
}

export interface ContenidoIdioma {
  /** Código BCP 47 para el atributo `lang` del documento (RF-1.3). */
  lang: 'es' | 'en';
  /** Nombre del idioma en su propio idioma, para el selector. */
  nombre: string;

  dates: {
    /** Fecha larga: «21 y 22 de octubre de 2026». */
    label: string;
    /** Fecha corta para la barra y el pie: «21–22 OCT 2026». */
    shortLabel: string;
  };

  venue: {
    /** El nombre del recinto sí se traduce; la dirección postal no. */
    name: string;
    country: string;
  };

  /** Etiquetas de país, por código. Evita repetirlas por cada expositor. */
  paises: Record<CodigoPais, string>;

  program: {
    pendingNotice: string;
    pendingDetail: string;
    days: DiaPrograma[];
  };

  /** Texto para un expositor cuya afiliación aún no está confirmada. */
  afiliacionPorConfirmar: string;

  /**
   * Reseña de cada expositor, por `id` de `comun.ts`.
   *
   * Es un `Record` con clave obligatoria por expositor, así que **añadir uno
   * nuevo sin su reseña en los dos idiomas rompe la compilación**, que es
   * justo lo que se quiere: una ficha vacía en un sitio institucional es peor
   * que no tener ficha.
   */
  expositores: Record<
    'zussman' | 'du' | 'valenzuela' | 'feick' | 'gutierrez' | 'toledo',
    { resena: string; linea: string }
  >;

  funding: {
    /** Nombre del proyecto FOVI. El código no se traduce. */
    projectName: string;
  };

  network: {
    hubDetail: string;
    hubRole: string;
  };

  about: {
    lead: string;
    paragraphs: string[];
  };

  topics: Array<{ title: string; description: string }>;

  contact: {
    school: string;
  };

  seo: {
    description: string;
    /** Se suman a `comun.keywordsComunes`. */
    keywords: string[];
  };

  /** Rótulos de navegación. El orden define el orden de la barra y del pie. */
  nav: Array<{ href: string; label: string }>;

  ui: {
    saltarAlContenido: string;
    abrirMenu: string;
    contacto: string;
    asuntoConsulta: string;

    tema: {
      legend: string;
      light: string;
      dark: string;
      system: string;
    };

    idioma: {
      /** Rótulo del grupo, para lectores de pantalla. */
      legend: string;
      /** Texto del enlace al otro idioma. */
      cambiarA: string;
    };

    /**
     * Página de error 404 (RNF-7.6).
     *
     * La página es **una sola** y muestra los dos idiomas a la vez: un sitio estático
     * sirve el mismo `404.html` para cualquier ruta inexistente, en `/` o en `/en/`,
     * y no hay nada en el borde que pueda elegir sin un Worker. Por eso estas cadenas
     * se leen de los DOS idiomas en la misma página, y no solo del que toque.
     */
    error404: {
      /** Rótulo pequeño sobre el título. No se traduce el número. */
      etiqueta: string;
      titulo: string;
      explicacion: string;
      /** Texto del enlace de vuelta al inicio de ESTE idioma. */
      volver: string;
      /** `<title>` del documento. La página lleva los dos, unidos por un guion. */
      tituloDocumento: string;
    };

    hero: {
      eyebrow: string;
      lugarEyebrow: string;
      fechasEyebrow: string;
      verPrograma: string;
      verExpositores: string;
      /** Descripción accesible de la figura de propagación. */
      figuraTitulo: string;
      figuraDescripcion: string;
    };

    secciones: {
      seminario: SeccionEncabezado;
      programa: SeccionEncabezado;
      expositores: SeccionEncabezado;
      sede: SeccionEncabezado;
      organizacion: SeccionEncabezado;
    };

    expositores: {
      internacionales: string;
      nacionales: string;
      /** Abre la ficha con la reseña. */
      verFicha: string;
      lineaInvestigacion: string;
      /** Enlace al perfil institucional, que es la fuente de la reseña. */
      verPerfil: string;
    };

    programa: {
      enPreparacion: string;
      solicitarAviso: string;
      asuntoConsultaPrograma: string;
      /** Aviso obligatorio cuando se muestran las sesiones de ejemplo. */
      avisoDemostracion: string;
      /** Nombre accesible del grupo de pestañas de jornadas. */
      jornadas: string;
      /** Abre el resumen de una sesión. */
      verResumen: string;
    };

    sede: {
      fechas: string;
      consultas: string;
      cargarMapa: string;
      abrirEnGoogleMaps: string;
      avisoMapa: string;
      tituloMapa: string;
    };

    organizacion: {
      organizan: string;
      participantes: string;
      financia: string;
      proyecto: string;
      /**
       * Leyenda del marcador de una marca sin autorización todavía. Obligatoria en los dos
       * idiomas a propósito: un marcador que en inglés saliera en español leería como un
       * descuido justo donde el sitio está admitiendo que falta algo.
       */
      logoPendiente: string;
    };

    pie: {
      contacto: string;
      secciones: string;
      financiadoPor: string;
      proyecto: string;
    };
  };
}
