/**
 * Programa DEMOSTRATIVO. No es el programa del seminario.
 *
 * ⚠️ Estas sesiones **están inventadas**. Sirven para ver cómo se comporta la
 * sección «Programa» cuando tiene contenido, y para que la organización tenga
 * una plantilla que rellenar. Ninguna de estas charlas ha sido acordada con
 * ningún expositor.
 *
 * **Está desactivado por defecto.** Se enciende con `PROGRAMA_DEMOSTRATIVO` en
 * `comun.ts`, y cuando está encendido la sección muestra un aviso visible que
 * dice que son datos de ejemplo. Las dos cosas son deliberadas: un programa
 * apócrifo en el sitio de un evento real, con fechas y sede reales, es
 * información falsa con la que alguien podría organizar un viaje.
 *
 * Es la misma razón por la que este proyecto prohíbe generar o aproximar los
 * logos institucionales.
 *
 * **Para publicar el programa de verdad:** poblar `program.days` en `es.ts` y
 * `en.ts` con los datos reales, y borrar este archivo junto con la bandera.
 *
 * Los temas de cada sesión se eligieron a partir de las líneas de investigación
 * públicas de cada expositor, para que la demostración sea verosímil; los
 * títulos, horarios y la existencia misma de las sesiones son invención.
 */
import type { DiaPrograma } from './comun';

export const programaDemoEs: DiaPrograma[] = [
  {
    date: '21 de octubre de 2026',
    label: 'Primera jornada · Propagación y medición',
    sessions: [
      { time: '09:00', title: 'Acreditación y café de bienvenida' },
      {
        time: '09:30',
        title: 'Apertura del seminario',
        speaker: 'Escuela de Ingeniería Eléctrica, PUCV',
      },
      {
        time: '10:00',
        title: 'Modelado de canal en bandas milimétricas: de la medición al modelo',
        speaker: 'Reinaldo A. Valenzuela — Nokia Bell Labs',
        summary:
          'Cómo se construye un modelo de canal a partir de campañas de medición, qué supuestos se introducen en cada paso y cuáles sobreviven al contraste con datos de despliegues reales.',
      },
      { time: '11:00', title: 'Pausa' },
      {
        time: '11:30',
        title: 'Campañas de medición de propagación: método y fuentes de error',
        speaker: 'Rodolfo Feick',
        summary:
          'Diseño de una campaña de medición: elección de escenarios, calibración del equipo y las fuentes de error que más pesan en el resultado final.',
      },
      {
        time: '12:30',
        title: 'Medición de propagación en sub-THz: qué cambia respecto de mmWave',
        speaker: 'Jinfeng Du — Nokia Bell Labs',
        summary:
          'Qué deja de funcionar al subir de ondas milimétricas a sub-terahertz: presupuesto de enlace, penetración en materiales y exigencias sobre el instrumental.',
      },
      { time: '13:30', title: 'Almuerzo' },
      {
        time: '15:00',
        title: 'Mesa redonda: bancos de prueba abiertos para investigación en propagación',
        speaker: 'Expositores de la jornada',
      },
    ],
  },
  {
    date: '22 de octubre de 2026',
    label: 'Segunda jornada · Detección y redes futuras',
    sessions: [
      {
        time: '09:30',
        title: 'Redes inalámbricas resilientes y el banco de pruebas COSMOS',
        speaker: 'Gil Zussman — Columbia University',
        summary:
          'Arquitecturas de red que degradan de forma controlada ante fallos, y qué permite medir un banco de pruebas urbano abierto que un laboratorio no reproduce.',
      },
      {
        time: '10:30',
        title: 'Detección y localización en redes de tiempo real',
        speaker: 'Miguel Gutiérrez Gaitán — Pontificia Universidad Católica de Chile',
        summary:
          'Estimación de posición sobre infraestructura de comunicación existente, y las garantías temporales que exige llevarla a un entorno industrial.',
      },
      { time: '11:30', title: 'Pausa' },
      {
        time: '12:00',
        title: 'Estaciones base móviles: redes asistidas por drones en 5G y 6G',
        speaker: 'Karel Toledo de la Garza — Universidad de Santiago de Chile',
        summary:
          'Drones como estaciones base que se reposicionan según la demanda, con las restricciones de energía y enlace que impone operar en banda milimétrica.',
      },
      { time: '13:00', title: 'Almuerzo' },
      {
        time: '14:30',
        title: 'Sesión de pósteres de estudiantes de posgrado',
      },
      {
        time: '16:00',
        title: 'Discusión final: agenda de colaboración Chile — Estados Unidos',
        speaker: 'Todos los expositores',
      },
      { time: '17:00', title: 'Cierre' },
    ],
  },
];

export const programaDemoEn: DiaPrograma[] = [
  {
    date: '21 October 2026',
    label: 'Day one · Propagation and measurement',
    sessions: [
      { time: '09:00', title: 'Registration and welcome coffee' },
      {
        time: '09:30',
        title: 'Opening remarks',
        speaker: 'School of Electrical Engineering, PUCV',
      },
      {
        time: '10:00',
        title: 'Channel modelling in millimetre-wave bands: from measurement to model',
        speaker: 'Reinaldo A. Valenzuela — Nokia Bell Labs',
        summary:
          'How a channel model is built from measurement campaigns, which assumptions enter at each step, and which survive contact with data from real deployments.',
      },
      { time: '11:00', title: 'Break' },
      {
        time: '11:30',
        title: 'Propagation measurement campaigns: method and sources of error',
        speaker: 'Rodolfo Feick',
        summary:
          'Designing a measurement campaign: choosing scenarios, calibrating equipment, and the error sources that weigh most on the result.',
      },
      {
        time: '12:30',
        title: 'Sub-THz propagation measurement: what changes from mmWave',
        speaker: 'Jinfeng Du — Nokia Bell Labs',
        summary:
          'What stops working when moving from millimetre waves to sub-terahertz: link budget, material penetration, and the demands placed on instrumentation.',
      },
      { time: '13:30', title: 'Lunch' },
      {
        time: '15:00',
        title: 'Panel: open testbeds for propagation research',
        speaker: 'Speakers of the day',
      },
    ],
  },
  {
    date: '22 October 2026',
    label: 'Day two · Sensing and future networks',
    sessions: [
      {
        time: '09:30',
        title: 'Resilient wireless networks and the COSMOS testbed',
        speaker: 'Gil Zussman — Columbia University',
        summary:
          'Network architectures that degrade gracefully under failure, and what an open urban testbed measures that a laboratory cannot reproduce.',
      },
      {
        time: '10:30',
        title: 'Sensing and localisation in real-time networks',
        speaker: 'Miguel Gutiérrez Gaitán — Pontificia Universidad Católica de Chile',
        summary:
          'Position estimation over existing communication infrastructure, and the timing guarantees required to take it into an industrial setting.',
      },
      { time: '11:30', title: 'Break' },
      {
        time: '12:00',
        title: 'Mobile base stations: drone-assisted networks in 5G and 6G',
        speaker: 'Karel Toledo de la Garza — Universidad de Santiago de Chile',
        summary:
          'Drones as base stations that reposition according to demand, with the energy and link constraints of operating in millimetre band.',
      },
      { time: '13:00', title: 'Lunch' },
      { time: '14:30', title: 'Graduate student poster session' },
      {
        time: '16:00',
        title: 'Closing discussion: a Chile — United States collaboration agenda',
        speaker: 'All speakers',
      },
      { time: '17:00', title: 'Close' },
    ],
  },
];
