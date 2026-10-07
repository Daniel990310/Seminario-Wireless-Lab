import { comun } from './comun';

/**
 * Las charlas que los expositores ya confirmaron, **antes de que exista el programa**.
 *
 * Desde el 2026-10-06 se publican (RF-32): Daniel pidió que vayan **dentro del
 * programa**, cada una en un desplegable para ver de qué trata. El programa con horas
 * sigue pendiente —el correo del 2026-09-22 fija el formato, 45 minutos de charla y 15 de
 * preguntas, pero ninguna hora—, así que la sección muestra el aviso provisional de
 * RF-8.1 y debajo esta lista. Cuando lleguen los horarios, armar `program.days` es
 * **colocar cada charla en su hora** sin volver a transcribir nada.
 *
 * **El texto está en inglés y no se traduce**, en las dos versiones del sitio, como el
 * título del seminario (RF-1.2). Es como lo escribió cada autor: una traducción nuestra
 * de su resumen sería nuestra, no suya. Por eso el marcado lo declara con `lang="en"`.
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
 * Cuáles faltan y cuándo llegó cada una: `specs/gestion/programa-y-expositores.md`.
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
  siringo: {
    title: 'Spectrum management and RFI monitoring at the Atacama Large Millimeter/submillimeter Array',
    abstract:
      'The Atacama Large Millimeter/submillimeter Array, ALMA, operates ten radio frequency bands at the Chajnantor plateau under exceptional natural conditions and limited radio-frequency interference (RFI) protection granted by the national administration on the Chilean territory. I report about spectrum management efforts in an increasingly crowded spectrum due to the development of new facilities on the Chajnantor plateau, self-generated interference, and satellite constellations. The integration of ALMA Band-2 receiver (67-90 GHz) in the array required a new assessment of the RFI environment. A one-week campaign using the Yebes 72-90 GHz portable RFI monitoring receiver temporarily installed at the ALMA site confirmed a largely clean environment, while identifying localized Band 2 RFI threats that require prevention measures.',
    recibida: '2026-10-06',
  },
  siles: {
    title:
      'Earth–space and terrestrial atmospheric propagation experiments and opportunities for meteorological sensing',
    abstract:
      'Radiowave propagation through the atmosphere is usually viewed as a source of impairments for communication systems. However, the same propagation effects can also contain information about the environment. This talk presents both perspectives through an overview of approximately three decades of atmospheric propagation experiments carried out at the Universidad Politécnica de Madrid (UPM). The first part will review UPM measurement campaigns over Earth–space and terrestrial paths at frequencies above 30 GHz, with particular attention to the long-term 39.4 GHz Q-band beacon experiment in Madrid using the Alphasat satellite. The second part will introduce, from a theoretical perspective and drawing on published literature, the opportunistic use of communication links for meteorological sensing, focusing on the retrieval of rainfall rate and atmospheric water vapour from propagation attenuation.',
    recibida: '2026-09-30',
  },
  toledo: {
    title:
      'Intelligent UAV-Assisted Wireless Networks: Trajectory Planning, Cooperation, and Decisions Under Uncertainty',
    abstract:
      'Unmanned aerial vehicles (UAVs) can provide flexible wireless coverage as users move and network conditions change. Their usefulness, however, depends on decisions about where to fly, how to serve users, and how to balance communication performance against limited onboard energy. This talk examines these questions through recent work on UAV-assisted 5G and 6G networks. It begins with trajectory adaptation for highway vehicular communications, where a UAV responds to changing traffic and link conditions. It then considers energy-efficient path planning under uncertain user locations and network conditions, using belief structures to guide decisions. Finally, it explores cooperative deployment of multiple UAVs through multi-agent reinforcement learning. Together, these studies show how trajectory optimization, uncertainty-aware reasoning, and learned coordination can support more adaptive aerial wireless networks, while revealing the trade-offs involved in moving from a single UAV to cooperative systems.',
    recibida: '2026-09-27',
  },
};
