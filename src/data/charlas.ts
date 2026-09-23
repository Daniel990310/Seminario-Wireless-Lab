import { comun } from './comun';

/**
 * Las charlas que los expositores ya confirmaron, **antes de que exista el programa**.
 *
 * Este archivo no lo importa ninguna página todavía, y es deliberado. El programa real
 * necesita la parrilla horaria, y el organizador todavía no la tiene: el correo del
 * 2026-09-22 fija el formato de cada sesión —45 minutos de charla y 15 de preguntas— y
 * el plazo para que los ocho envíen su material —**lunes 28 de septiembre de 2026**—,
 * pero ninguna hora.
 *
 * Existe para que, cuando lleguen los horarios, armar `program.days` sea **colocar cada
 * charla en su hora** y no volver a transcribir títulos y resúmenes desde un correo.
 * Mientras tanto la sección «Programa» muestra el aviso provisional de RF-8.1, que es
 * lo correcto: un programa a medias es peor que ninguno.
 *
 * ⚠️ **Publicar esto exige un requisito escrito.** Hoy el sitio no tiene dónde poner el
 * título de una charla: ni la ficha de expositor lo lleva, ni hay programa. Las dos
 * opciones y la recomendación están al final de
 * `specs/gestion/programa-y-expositores.md`. Mientras no esté en `requirements.md`, este
 * archivo es material en espera y no contenido publicado.
 *
 * **El texto está en inglés y no se traduce.** Es como lo escribió cada autor, y una
 * traducción nuestra de su resumen sería nuestra, no suya. Cuando el programa se publique
 * habrá que decidir si se traduce —y entonces se pide la traducción al autor— o si se
 * mantiene en inglés en las dos versiones, como el título del seminario (RF-1.2).
 *
 * La copia **congelada tal como llegó** está en `specs/gestion/programa-y-expositores.md`.
 * Si alguien edita algo aquí, ahí sigue estando el original contra el que comparar.
 */

/**
 * Identificador de expositor, derivado de `comun.ts`. Escribir aquí un `id` que no exista
 * en la nómina **no compila**, que es lo que impide que una charla quede huérfana.
 */
type IdExpositor =
  | (typeof comun.speakers.international)[number]['id']
  | (typeof comun.speakers.national)[number]['id'];

export interface Charla {
  /** Título tal como lo envió el autor. */
  title: string;
  /** Resumen tal como lo envió el autor. El organizador pidió 100–150 palabras. */
  abstract: string;
  /** Fecha en que llegó, para saber qué tan viejo es el texto. */
  recibida: string;
}

/**
 * Formato de sesión confirmado por el organizador el 2026-09-22. Vive aquí y no escrito
 * en un componente porque es un dato del evento, no una cadena de interfaz.
 */
export const FORMATO_SESION = { charlaMin: 45, preguntasMin: 15 } as const;

/** Plazo que dio el organizador a los ocho expositores para enviar su material. */
export const PLAZO_MATERIAL_ISO = '2026-09-28';

/**
 * Dos de ocho. Faltan Zussman, Du, Siringo, Siles, Gutiérrez y Toledo.
 *
 * Es `Partial` a propósito: lo normal es que falten, y obligar a que estén las ocho
 * dejaría el archivo sin compilar durante toda la semana de espera.
 */
export const charlasConfirmadas: Partial<Record<IdExpositor, Charla>> = {
  valenzuela: {
    title:
      '6G Vision, challenges and technology drivers: Sensing capabilities enabling the networking of merged cyber physical domains',
    abstract:
      '6G must address the "AI super cycle" that is expected to create an unprecedented surge in network traffic demand, with 100 times more connected devices and up to 10 Tbps data rates enabling new services such as high-resolution AR/VR, digital twins, real-time data from autonomous vehicle-to-X systems, drones, and robots as well as touch-based data requiring ultra-low latency. Thus, 6G is expected to be AI native end-to-end and across all layers. Many of the new high demand 6G services and applications will involve the integration of communications, compute and sensing. Thus, sensing capabilities enabling the networking of the cyber-physical domains may become an essential 6G growth and market success driver. In this talk, I will review this 6G Vision and challenges, deployment scenarios and key technology drivers, with a special focus on sensing-based applications and relevant technology advances.',
    recibida: '2026-09-21',
  },
  feick: {
    title:
      'Referential Grade Propagation Measurements and Models: Channel Sounding from 3.5 GHz to 140 GHz',
    abstract:
      'We present empirically-based statistical wireless channel models, with an emphasis on our recent work at mmWave frequencies. Accuracy and robustness of our results are achieved thanks to massive amounts of data collected in a wide range of settings. We show how this has been achieved using our own custom-designed portable channel sounders, built specifically to accurately measure path-loss with high sampling rates and a very large link budget. Our work has spanned frequency bands from 3.5 GHz to 140 GHz and includes most critical parameters needed for wireless service planning such as propagation loss versus distance, antenna gain degradation from multipath and fade margins. We also include recent results on backscatter power, relevant when evaluating the feasibility of joint communication and sensing.',
    recibida: '2026-09-22',
  },
};
