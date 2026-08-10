# Logos institucionales

> **Los logos ráster de la PUCV ya no viven aquí.** Desde el 2026-08-06 están en
> [`src/assets/logos/`](../../src/assets/logos/) —`pucv.png` y `pucv-oscuro.png`— y se
> **importan** en `src/data/comun.ts` en lugar de referenciarse por ruta.
>
> El motivo: `<Image />` de Astro solo puede optimizar lo que se importa desde `src`, y ahí
> gana dos veces. Emite WebP —`[medido]` 69,9 → **35,7 kB** y 45,4 → **26,8 kB**, un 46 %
> menos entre los dos— y sobre todo **declara `width` y `height`**, que es lo que evita que
> la fila de logos se recoloque al cargar: con `h-10 w-auto` y sin dimensiones intrínsecas
> el ancho es 0 hasta que la imagen llega.
>
> **Los SVG se quedan en esta carpeta**, y no por inercia: el optimizador de Astro no
> procesa vectores —los pasa sin tocar— así que moverlos no ganaría nada y se perdería el
> flujo de esta carpeta, que es sustituir el archivo conservando el nombre sin tocar código.
>
> Si algún día llega un logo **ráster** de otra institución, va a `src/assets/logos/` y se
> importa; si llega en SVG, va aquí. El tipo `Logo` de `comun.ts` admite las dos formas y
> `LogoWall.astro` ramifica según cuál sea.

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

## Qué se buscó ya, y qué se puede instalar

**El 2026-08-03 se rastrearon las siete marcas en sus fuentes oficiales.** El resultado, con
el enlace de cada una y el veredicto de si su uso está permitido, está en
[`specs/002-rediseno-visual/marcas/README.md`](../../specs/002-rediseno-visual/marcas/README.md).
Resumen para quien llegue a esta carpeta:

| Archivo | Situación |
| ------- | --------- |
| `anid.svg` | **Es la marca equivocada.** ANID exige el conjunto «Ministerio de Ciencia + ANID»; el archivo oficial ya está descargado, en SVG y con versión para fondo oscuro |
| `pucv.svg` | Oficial disponible **solo en PNG y solo para fondo claro**: el paquete de PUCV no trae versión blanca. Pedida |
| `eie-pucv.svg` | Pendiente: la descarga del paquete de submarcas se cortó dos veces |
| `uc.svg` · `usach.svg` | Descargables de sus portales, pero son **marcas de terceros**: falta autorización |
| `columbia.svg` · `nokia-bell-labs.svg` | **Prohibido sin permiso escrito**, dicho por sus propias guías. Se quedan como marcadores |

Y una consecuencia que afecta al código: los logos oficiales vienen **en una variante por
fondo**, y hoy `LogoWall.astro` admite un solo archivo por institución. Instalar solo la
variante clara sería una regresión en el tema oscuro. Es RF-10 del plan 002.

## Consideración importante

Cada institución tiene un manual de uso de marca que define proporciones,
espacios mínimos y variantes autorizadas. Conviene solicitar los archivos
oficiales a las respectivas direcciones de comunicaciones en lugar de extraerlos
de un sitio web, tanto por calidad como por cumplimiento del manual. Lo mismo
aplica a ANID, que exige formatos específicos para el reconocimiento de
proyectos financiados.
