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

> **Al día 2026-08-25.** El párrafo que seguía aquí describía el estado de julio, cuando
> los siete archivos eran marcadores dibujados en SVG. Ya no es así, y la tabla apuntaba
> además a `src/data/seminar.ts`, que **no existe**: es `src/data/comun.ts`.
>
> **El marcador ya no es un archivo.** Lo pinta `LogoWall.astro` en HTML cuando una
> institución no tiene `logo`, con la capa semántica de color. Los SVG de marcador de antes
> traían los colores escritos a mano de la paleta previa a la identidad PUCV, y sobre el
> fondo claro de hoy no llegan a 4,5:1 — **y ningún verificador lo vería**, porque axe mide
> texto del documento y no texto dentro de un SVG. Ver RF-22.
>
> **Qué hay hoy en esta carpeta**, y por qué:
>
> | Archivo | Estado |
> | ------- | ------ |
> | `anid-minciencia.svg` · `anid-minciencia-oscuro.svg` | **En uso.** Conjunto Ministerio de Ciencia + ANID, obligatorio por RNF-8. El claro es la variante **color**; el oscuro es `PLUMA-BLANCO` y está consultado con la agencia (RNF-8.5) |
> | `uc.svg` · `uc-oscuro.svg` · `nokia-bell-labs.svg` | **Presentes pero NO referenciados.** Se retiraron el 2026-08-25 por RF-22: falta la autorización de su titular. Reponerlos es volver a poner su línea `logo:` en `comun.ts` |
>
> PUCV, EIE, USACH y Columbia son ráster y viven en `src/assets/logos/`. Los dos últimos
> también están retirados, por lo mismo.

Cuando llegue un archivo oficial, sustitúyelo **manteniendo exactamente el mismo nombre**:
así reponer una marca no obliga a tocar más que la línea `logo:` de `src/data/comun.ts`.

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
