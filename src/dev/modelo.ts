/**
 * El borrador del panel de ajuste: sus tipos, sus valores de partida y cómo se
 * recupera de `localStorage`. Sin DOM, para que cualquier módulo del panel pueda
 * importarlo sin arrastrar efectos.
 */

export type Idioma = 'es' | 'en';
export type Tema = 'light' | 'dark';
export type ModoFondo = 'solido' | 'imagen';
/** Qué hace un clic dentro de la página: seguir el enlace, escribir o elegir. */
export type Herramienta = 'navegar' | 'textos' | 'senalar';

export interface ImagenCargada {
  nombre: string;
  /** `data:` URL ya reducida; ver `reducir` en `ui.ts`. */
  datos: string;
  /** Medidas del archivo original, para saber con qué se cuenta al instalarlo. */
  ancho?: number;
  altoPx?: number;
}

export interface AjusteFranja {
  x: number;
  y: number;
  escala: number;
  velo: number;
  alto: number;
  /**
   * Con `relacionFija`, la altura pasa a ser `100vw / relacion` y el recorte que
   * se ve es **el mismo en toda pantalla**. Sin ella rige el `clamp` de hoy, que
   * mantiene la relación solo entre 686 y 1219 px de ancho `[medido: 2026-09-22]`.
   */
  relacionFija: boolean;
  relacion: number;
  /** Fracción superior de la banda que cubre el degradado hacia la barra. */
  desvanecido: number;
  imagen: ImagenCargada | null;
}

export interface AjusteSeccion {
  modo: ModoFondo;
  x: number;
  y: number;
  velo: number;
  desenfoque: number;
  imagen: ImagenCargada | null;
}

export interface AjusteRetrato {
  x: number;
  y: number;
  /** Foto de prueba. Publicarla exige la autorización de RF-11.1. */
  imagen: ImagenCargada | null;
}

/**
 * Un texto editado se identifica por su contenido original y no por su posición.
 * Hasta el 2026-10-02 la clave era el índice del nodo en la página: al pulsar
 * Enter el nodo ganaba un hijo, dejaba de contar y **todos los siguientes se
 * corrían una plaza** al recargar `[medido: 2026-10-02]`.
 */
export interface CambioTexto {
  idioma: Idioma;
  seccion: string;
  etiqueta: string;
  /** Cuántos nodos de la misma sección tenían antes este mismo texto. */
  ocurrencia: number;
  original: string;
  nuevo: string;
}

/** Tokens de color del sitio que se pueden asignar a un texto elegido. */
export const TOKENS_DE_TEXTO = ['foreground', 'muted-foreground', 'primary', 'accent'] as const;
export type TokenDeTexto = (typeof TOKENS_DE_TEXTO)[number];

interface MedidasOriginales {
  tamano: number;
  peso: string;
  margenArriba: number;
  margenAbajo: number;
  alineacion: string;
}

/** Un elemento cualquiera de la página, elegido con la herramienta «señalar». */
export interface AjusteElemento {
  /** Selector estable desde el ancestro con `id` más cercano. Es también la clave. */
  selector: string;
  descripcion: string;
  /** Las clases de Tailwind que lleva hoy: es lo que habrá que cambiar en el código. */
  clases: string;
  seccion: string;
  original: MedidasOriginales;
  escalaLetra: number;
  peso: string | null;
  margenArriba: number | null;
  margenAbajo: number | null;
  alineacion: string | null;
  color: TokenDeTexto | null;
  oculto: boolean;
  nota: string;
}

interface CambioColor {
  original: string;
  nuevo: string;
}

export interface Ajustes {
  vista: { ancho: number; tema: Tema; idioma: Idioma };
  franja: AjusteFranja;
  secciones: Record<string, AjusteSeccion>;
  retratos: Record<string, AjusteRetrato>;
  /** Clave: `claveDeTexto`. */
  textos: Record<string, CambioTexto>;
  /** Clave: el selector del elemento. */
  elementos: Record<string, AjusteElemento>;
  /** Por tema, token (sin `--`) → cambio. */
  colores: Record<Tema, Record<string, CambioColor>>;
  /** Ids de sección en el orden deseado; vacío es el orden del repositorio. */
  orden: string[];
}

export const CLAVE_ACTUAL = 'panel-ajuste:actual';
export const CLAVE_INSTANTANEAS = 'panel-ajuste:instantaneas';

/** Los valores de partida son los que hoy están en el repositorio, no ceros. */
export const FRANJA_ACTUAL: AjusteFranja = {
  x: 50,
  y: 50,
  escala: 1,
  velo: 18,
  alto: 1,
  relacionFija: false,
  relacion: 7.33, // la que ya rige entre 686 y 1219 px `[medido: 2026-09-22]`
  desvanecido: 18,
  imagen: null,
};

export function seccionPorOmision(): AjusteSeccion {
  return { modo: 'solido', x: 50, y: 50, velo: 100, desenfoque: 0, imagen: null };
}

export function porOmision(): Ajustes {
  return {
    vista: { ancho: 0, tema: 'light', idioma: 'es' },
    franja: { ...FRANJA_ACTUAL },
    secciones: {},
    retratos: {},
    textos: {},
    elementos: {},
    colores: { light: {}, dark: {} },
    orden: [],
  };
}

export function claveDeTexto(c: Pick<CambioTexto, 'idioma' | 'seccion' | 'ocurrencia' | 'original'>): string {
  return `${c.idioma}|${c.seccion}|${c.ocurrencia}|${c.original}`;
}

/**
 * Los borradores anteriores al 2026-10-02 guardaban los textos por índice y sin
 * idioma. Se conservan como español —el único idioma en que se podía editar sin
 * que el cambio se colara en el otro— y se reubican por su texto original.
 */
function migrarTextos(crudos: Record<string, Partial<CambioTexto>> | undefined): Record<string, CambioTexto> {
  const salida: Record<string, CambioTexto> = {};
  for (const t of Object.values(crudos ?? {})) {
    if (typeof t.original !== 'string' || typeof t.nuevo !== 'string') continue;
    const c: CambioTexto = {
      idioma: t.idioma ?? 'es',
      seccion: t.seccion ?? 'sin-seccion',
      etiqueta: t.etiqueta ?? '',
      ocurrencia: t.ocurrencia ?? 0,
      original: t.original,
      nuevo: t.nuevo,
    };
    salida[claveDeTexto(c)] = c;
  }
  return salida;
}

/**
 * Mezcla por nivel y no superficial: un borrador guardado antes de que existiera
 * una perilla nueva se queda sin ella y `undefined` se cuela en el CSS. Se usa
 * igual al cargar el borrador y al abrir una instantánea.
 */
export function mezclar(guardado: Partial<Ajustes>): Ajustes {
  const base = porOmision();
  const retratos: Record<string, AjusteRetrato> = {};
  // Un borrador anterior al 2026-10-02 trae retratos sin `imagen`.
  const viejos = (guardado.retratos ?? {}) as Record<string, Partial<AjusteRetrato>>;
  for (const [clave, r] of Object.entries(viejos)) {
    retratos[clave] = { x: 50, y: 50, imagen: null, ...r };
  }
  return {
    ...base,
    ...guardado,
    vista: { ...base.vista, ...(guardado.vista ?? {}) },
    franja: { ...base.franja, ...(guardado.franja ?? {}) },
    secciones: guardado.secciones ?? {},
    retratos,
    textos: migrarTextos(guardado.textos),
    elementos: guardado.elementos ?? {},
    colores: { light: { ...guardado.colores?.light }, dark: { ...guardado.colores?.dark } },
    orden: guardado.orden ?? [],
  };
}

export function cargar(): Ajustes {
  try {
    const crudo = localStorage.getItem(CLAVE_ACTUAL);
    return crudo ? mezclar(JSON.parse(crudo) as Partial<Ajustes>) : porOmision();
  } catch {
    return porOmision();
  }
}
