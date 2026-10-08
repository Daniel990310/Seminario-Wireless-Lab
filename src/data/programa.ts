import type { IdExpositor } from './charlas';

/**
 * El programa del seminario, de `Programa_Beyond Connectivity.docx`, que entregó Daniel
 * el 2026-10-07. Es la parrilla que faltaba desde el correo del 2026-09-22: con ella, el
 * aviso provisional de RF-8.1 deja paso a las jornadas.
 *
 * Una sola parrilla para los dos idiomas, porque las horas y el orden no se traducen.
 * Cada sesión de un expositor se enlaza por su `id`: título y resumen salen de
 * `charlas.ts` y nombre y afiliación de `comun.ts`, así que una charla que llegue después
 * aparece en su hora sin tocar este archivo. Las pausas son claves que cada idioma
 * nombra en `ui.programa.pausas`.
 *
 * Dos lecturas del documento que conviene saber:
 *   - «Coffe Break» se lee como pausa para café; la errata no se copia.
 *   - «IEEE AP-S Chile» (10:15–10:30) va tal cual: el documento no dice si es una
 *     presentación del capítulo o una charla, y no se le inventa título.
 */

export type Pausa =
  | 'registro'
  | 'recepcion'
  | 'bienvenidaIntro'
  | 'bienvenida'
  | 'cafe'
  | 'almuerzo'
  | 'posters'
  | 'cierreDia'
  | 'cierre';

/** Los dibujos de `IconoSesion.astro`: uno por clase de sesión, no por sesión. */
export type IconoSesion = 'registro' | 'bienvenida' | 'charla' | 'cafe' | 'almuerzo' | 'posters' | 'antena' | 'cierre';

export const ICONO_DE_PAUSA: Record<Pausa, IconoSesion> = {
  registro: 'registro',
  recepcion: 'registro',
  bienvenidaIntro: 'bienvenida',
  bienvenida: 'bienvenida',
  cafe: 'cafe',
  almuerzo: 'almuerzo',
  posters: 'posters',
  cierreDia: 'cierre',
  cierre: 'cierre',
};

export type Sesion =
  | { hora: string; expositor: IdExpositor }
  | { hora: string; pausa: Pausa }
  /** Nombre propio que no se traduce; su ícono va aquí porque el nombre no dice de qué clase es. */
  | { hora: string; nombre: string; icono: IconoSesion };

export interface Jornada {
  dia: 'miercoles21' | 'jueves22';
  horario: string;
  sesiones: Sesion[];
}

export const programa: Jornada[] = [
  {
    dia: 'miercoles21',
    horario: '08:30–17:30',
    sesiones: [
      { hora: '08:30–09:00', pausa: 'registro' },
      { hora: '09:00–09:15', pausa: 'bienvenidaIntro' },
      { hora: '09:15–10:15', expositor: 'valenzuela' },
      // Antena: AP-S es la sociedad de antenas y propagación del IEEE.
      { hora: '10:15–10:30', nombre: 'IEEE AP-S Chile', icono: 'antena' },
      { hora: '10:30–11:00', pausa: 'cafe' },
      { hora: '11:00–12:00', expositor: 'feick' },
      { hora: '12:00–13:00', expositor: 'zussman' },
      { hora: '13:00–14:00', pausa: 'almuerzo' },
      { hora: '14:00–15:00', pausa: 'posters' },
      { hora: '15:00–16:00', expositor: 'du' },
      { hora: '16:00–17:00', expositor: 'siles' },
      { hora: '17:00–17:15', pausa: 'cierreDia' },
    ],
  },
  {
    dia: 'jueves22',
    horario: '08:30–13:00',
    sesiones: [
      { hora: '08:30–09:00', pausa: 'recepcion' },
      { hora: '09:00–09:15', pausa: 'bienvenida' },
      { hora: '09:15–10:15', expositor: 'siringo' },
      { hora: '10:15–10:45', pausa: 'cafe' },
      { hora: '10:45–11:45', expositor: 'toledo' },
      { hora: '11:45–12:45', expositor: 'gutierrez' },
      { hora: '12:45–13:00', pausa: 'cierre' },
    ],
  },
];
