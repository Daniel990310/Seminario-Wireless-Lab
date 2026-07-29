# Logos institucionales

Los archivos de esta carpeta son **marcadores de posición**: se ven como una caja
de borde discontinuo con el nombre de la institución y la leyenda
`LOGO PENDIENTE`. Están para que la maquetación quede lista y solo haya que
reemplazar los archivos por los oficiales.

## Cómo reemplazarlos

Sustituye cada archivo **manteniendo exactamente el mismo nombre**. No hay que
tocar código: `src/data/seminar.ts` ya apunta a estas rutas.

| Archivo                       | Institución                                  |
| ----------------------------- | -------------------------------------------- |
| `anid.svg`                    | Agencia Nacional de Investigación y Desarrollo |
| `pucv.svg`                    | Pontificia Universidad Católica de Valparaíso |
| `eie-pucv.svg`                | Escuela de Ingeniería Eléctrica PUCV          |
| `uc.svg`                      | Pontificia Universidad Católica de Chile      |
| `usach.svg`                   | Universidad de Santiago de Chile              |
| `nokia-bell-labs.svg`         | Nokia Bell Labs                               |
| `columbia.svg`                | Columbia University                           |

## Requisitos de los archivos

- **Formato:** SVG de preferencia. Si solo hay PNG, usar el de mayor resolución
  con fondo transparente y cambiar la extensión en `src/data/seminar.ts`.
- **Fondo transparente.** El sitio tiene fondo oscuro; un logo con fondo blanco
  se verá como un recuadro.
- **Versión monocroma clara u original sobre oscuro.** Casi todas las
  universidades publican una variante para fondos oscuros en su manual de marca;
  esa es la que corresponde usar.
- **Márgenes recortados.** Sin espacio en blanco sobrante alrededor, porque la
  altura se fija por CSS y el aire extra descuadra la alineación óptica.

## Consideración importante

Cada institución tiene un manual de uso de marca que define proporciones,
espacios mínimos y variantes autorizadas. Conviene solicitar los archivos
oficiales a las respectivas direcciones de comunicaciones en lugar de extraerlos
de un sitio web, tanto por calidad como por cumplimiento del manual. Lo mismo
aplica a ANID, que exige formatos específicos para el reconocimiento de
proyectos financiados.
