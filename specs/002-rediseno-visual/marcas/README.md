# Marcas institucionales: qué se puede usar, qué no, y por qué

## Actualización del 2026-08-07 — la autorización del cliente y su alcance

Daniel informó que **el cliente autorizó el uso de las imágenes de las instituciones** y que
asume la responsabilidad. Eso cambia lo que se puede instalar, pero no todo, y la distinción
es de titularidad y no de permiso:

**El cliente puede autorizar sus propias marcas.** El cliente es la PUCV, organizadora del
seminario. Su autorización cubre el escudo PUCV y las submarcas de sus unidades.

- ✅ **EIE PUCV: instalada.** Del paquete oficial `logos_submarca` de Normas Gráficas, en
  variante `AZUL` para fondo claro y `BLANCO` para fondo oscuro. La descarga se había cortado
  dos veces en el rastreo del 2026-08-03 y se cortó una tercera; salió con **reanudación por
  rangos**, porque el paquete pesa **186,1 MB**. Originales archivados en esta carpeta.
- Nota útil que aparece con esto: **el paquete de submarcas sí trae versión para fondo
  oscuro**, a diferencia del paquete del escudo principal, que no la tiene y sigue pedida.

**Autorización confirmada el 2026-08-07.** Daniel informó que las instituciones dieron la
autorización, y sobre esa base se instalaron:

- ✅ **Columbia: instalada**, variante `dkblue` para fondo claro y `white` para oscuro.
  **Pero es la marca equivocada:** los archivos entregados son `CUSPS_logo_simple_RGB_*`, la
  submarca de la **School of Professional Studies**, y el expositor de Columbia —Gil Zussman—
  es de Ingeniería Eléctrica, o sea **SEAS**. Es el mismo tipo de error que un nombre
  institucional traducido a mano: no es un problema de permiso, es de exactitud. Se instalaron
  con los nombres `columbia.png` y `columbia-oscuro.png` **precisamente para que sustituir el
  archivo por la marca correcta no obligue a tocar código.** Originales en `marcas/columbia/`.
- ✅ **Nokia Bell Labs: instalada por Daniel** directamente en `public/logos/`. Es SVG, así que
  se queda ahí: el optimizador de Astro no procesa vectores. Una sola variante, usada en los
  dos temas.
- ⏳ **UC y USACH** siguen como marcadores de posición: el archivo está a un clic en sus
  portales, pero no se ha descargado todavía.

**Nota que conserva su valor pese a la autorización.** Una autorización solo vale si la da el
titular; asumir la responsabilidad cubre el riesgo de quien la asume, no convierte a nadie en
dueño de la marca ajena. Las cuatro restantes son de terceros:

| Marca | Qué dice su propia fuente | Estado |
| ----- | ------------------------- | ------ |
| **PUC de Chile (UC)** | Publica EPS, JPG, SVG, PNG y manual, pero la página está dirigida a sus **unidades internas** y no dice nada sobre terceros. Deriva las dudas a `mhola@uc.cl` (María Soledad Hola, Dirección de Diseño Corporativo) `[verificado: 2026-08-07]` | Descargable, **sin permiso explícito para externos**. Pedir a esa dirección |
| **USACH** | Publica los imagotipos en ZIP, `.svg` y `.ai`. Y dice algo más fuerte: **«la Dirección de Comunicaciones y Medios … es la encargada de autorizar o rechazar todos los sitios web»**. Contacto `imagen@usach.cl` `[verificado: 2026-08-07]` | Descargable, **con autorización explícitamente requerida**. Pedir a esa dirección |
| **Columbia University** | Su guía —registrada el 2026-08-03— exige que las partes externas pidan permiso a la Office of General Counsel o a Columbia Licensing. Al reintentar el 2026-08-07 el servidor devolvió **403**, y un bloqueo del servidor no es una invitación a rodearlo | **No instalar.** Requiere permiso escrito de Columbia |
| **Nokia Bell Labs** | Sus términos dicen que el acceso al sitio **no concede licencia ni derecho a usar ninguna marca** | **No instalar.** Requiere consentimiento escrito previo de Nokia |

**Sobre «obtenerla del navegador si no hay en los sitios»:** no se hizo, y no por comodidad.
Extraer una marca de una página renderizada en lugar de tomarla del paquete de su dueño es
justo lo que esta carpeta prohíbe desde su primera versión —«conviene solicitar los archivos
oficiales … en lugar de extraerlos de un sitio web»—, y agrava el problema en los dos casos
donde el titular ya dijo por escrito que no. Donde el dueño **sí** publica el archivo (UC,
USACH), extraerlo del navegador no aporta nada: el paquete oficial está a un clic.

Lo que sigue abierto, y es de gestión y no de código: **cuatro correos**. Los borradores para
PUCV y ANID ya están al final de este documento; faltan UC (`mhola@uc.cl`), USACH
(`imagen@usach.cl`), Columbia (Office of General Counsel / Columbia Licensing) y Nokia. Que
los expositores de esas cuatro instituciones participen en el seminario es un buen argumento
para pedirlo, no un permiso implícito.

Búsqueda hecha el **2026-08-03** contra las fuentes oficiales de cada institución. Los
archivos de esta carpeta **todavía no están en `public/logos/`** a propósito: ver
«Por qué no se han instalado» al final.

Regla que sigue en pie y que esta carpeta **no** contradice: los logos institucionales
**no se generan ni se aproximan con ninguna herramienta** (`AGENTS.md`). Lo que hay aquí
son los archivos **oficiales publicados por su propio dueño**, que es lo contrario de
aproximarlos.

## Veredicto por marca

| Marca | Fuente oficial | Claro | Oscuro | Veredicto |
| ----- | -------------- | ----- | ------ | --------- |
| **MinCiencia + ANID** | [Kit digital ANID](https://anid.cl/media-kit/) → [`Logos.zip`](https://s3.amazonaws.com/documentos.anid.cl/documentos-y-servicios/kit-digital/Logos.zip) | ✅ SVG | ✅ SVG | **Usar, y además es obligatorio.** Ver abajo |
| **PUCV** | [Normas Gráficas PUCV](https://www.pucv.cl/uuaa/direccion-de-comunicacion-estrategica/normas-graficas-pucv) → `logos_pucv__1_.zip` | ✅ PNG 1297 px | ❌ **no existe** en el paquete | Usar en claro. Pedir la versión para fondo oscuro |
| **EIE PUCV** | `logos_submarca_…zip` de la misma página | ⏳ | ⏳ | La descarga se cortó dos veces. Reintentar, o pedirla a `dir.eie@pucv.cl` |
| **PUC de Chile (UC)** | [Uso de la marca UC](https://www.uc.cl/uso-de-la-marca/) — publica SVG, EPS, PNG y manual | disponible | probable | **Marca de tercero: pedir autorización.** Contacto en el propio sitio: `mhola@uc.cl` |
| **USACH** | [Guía de Normas Gráficas USACH](https://guiaweb.usach.cl/normas-gr%C3%A1ficas) | disponible | probable | Ídem: pedir autorización |
| **Columbia University** | [Visual Identity](https://visualidentity.columbia.edu/) · [Guidelines for Use of Columbia Marks](https://cufo.columbia.edu/content/guidelines-use-columbia-marks) | — | — | **No usar sin permiso.** Su guía es explícita: las partes externas piden permiso a la Office of General Counsel o a Columbia Licensing |
| **Nokia Bell Labs** | [Nokia — Terms of use](https://www.nokia.com/notices/terms/) | — | — | **No usar sin consentimiento escrito previo.** Sus términos dicen que el acceso al sitio no concede licencia ni derecho a usar ninguna marca |

Los cuatro últimos son **marcas de terceros**. Que el archivo esté descargable no es
permiso: los portales de marca de una universidad están dirigidos a sus propias unidades.
PUCV es distinto porque es la institución organizadora, y ANID es distinto porque exige
que su marca aparezca.

## Lo que ANID exige, que hoy el sitio no cumple

`[verificado: ANID, «¿Cómo mencionar a ANID en productos de divulgación derivados de los
proyectos?», kit digital, 2026-08-03]`. Los sitios web están nombrados explícitamente
entre los productos en los que aplica.

1. **La mención textual tiene una nomenclatura fija:**

   > Financiado por la Agencia Nacional de Investigación y Desarrollo, ANID / Instrumento
   > (concurso)

   El sitio dice hoy «Financiado por» + «Agencia Nacional de Investigación y Desarrollo» +
   «Proyecto FOVI250222», que se parece pero **no es** la fórmula: falta el instrumento
   (concurso) en la posición que ANID indica. Y hay que confirmar con la organización cómo
   se nombra exactamente el concurso de `FOVI250222` — ponerlo a ojo sería inventar un dato.
2. **El logo obligatorio es el conjunto «Ministerio de Ciencia + ANID»**, no la marca ANID
   sola. El marcador de posición actual (`anid.svg`, «ANID») es la marca equivocada.
3. **«Usar siempre el logo institucional actualizado y validado por la Agencia»**: el
   paquete oficial es de 2026 y es el que está aquí.

## Archivos de esta carpeta

| Archivo | Original oficial | Para qué |
| ------- | ---------------- | -------- |
| `anid-minciencia-claro.svg` | `LOGOS MINCIENCIA + ANID 2026_PLUMA.svg` | Tema claro. Tinta única `#1c335a` |
| `anid-minciencia-oscuro.svg` | `LOGOS MINCIENCIA + ANID 2026_PLUMA-BLANCO.svg` | Tema oscuro. Versión blanca |
| `anid-minciencia-color.svg` | `LOGOS MINCIENCIA + ANID 2026_COLOR.svg` | Full color, `#1b6ab1` y `#e73c48`. De reserva |
| `pucv-monocromo-h.png` | `Escudo_PUCV-2016_monocromo h.png` | Tema claro. 1297×1077, con alfa |
| `pucv-color-h.png` | `Escudo_PUCV-2016_color h.png` | Tema claro, versión color |

Los tres SVG de ANID pesan **41,8 kB** cada uno sin optimizar. Antes de instalarlos hay que
decidir si se pasan por un optimizador: cambia la codificación, no el dibujo, así que no es
una modificación de la marca en el sentido del manual —pero eso hay que comprobarlo
comparando el resultado, no suponerlo.

## Por qué PUCV no tiene versión para fondo oscuro

Medido, no leído `[medido: luminancia media de los píxeles con tinta, muestreo 1:7]`:

| Variante | Luminancia de la tinta | Cobertura | Qué es |
| -------- | ---------------------- | --------- | ------ |
| `monocromo h` / `v` | 82 | 5 % | Tinta oscura sobre transparente |
| `monocromo lleno h` / `v` | 104 | 6 % | Ídem, trazo más grueso |
| `color h` / `v` | 106 | 9 % | Color sobre transparente |
| `Logo PUCV Vertical Negro` | 17 | 16 % | Negro sobre transparente |
| `calado h` / `v` | 90 | **99 %** | **No es transparente: es un bloque relleno** |

Ninguna es blanca sobre transparente, que es la que hace falta sobre `#0a1020`. Y `calado`
no sirve: con el 99 % del lienzo opaco se vería como un recuadro, que es justo lo que
`public/logos/README.md` prohíbe. **Hay que pedirla**, y probablemente exista: el
`normas_graficas_2023.pdf` de la misma página es el documento que lo dice.

## Fotografías de los expositores: no se toman de la web

Esto es un **no**, y conviene que esté escrito con su motivo.

Una fotografía de una persona identificable tiene dos capas de derechos: el **copyright del
fotógrafo** y los **derechos de imagen de la persona retratada**. Las fotos de perfil
institucional y académico son «todos los derechos reservados» por omisión: que sean
públicamente visibles no las hace reutilizables. Publicarlas en el sitio de un evento real
es exactamente el mismo tipo de problema que publicar un programa apócrifo, y con
consecuencia legal en vez de reputacional.

Se buscó si existe alguna con licencia libre, por si el caso fácil existía:
**Gil Zussman tiene artículo en Wikipedia y no tiene fotografía** `[verificado]`. Ninguno de
los seis aparece con retrato en Wikimedia Commons.

**Lo que sí funciona, y es lo estándar:** pedírselas al expositor junto con la confirmación
de su participación. Nadie que acepta dar una charla se niega a mandar una foto. Mientras
lleguen, el **monograma de iniciales** que ya propuso el prototipo de rediseño es un estado
por defecto digno, no un hueco.

## Plantillas para pedir lo que falta

### A cada expositor (junto con la confirmación de participación)

> Asunto: Beyond Connectivity 2026 — foto y reseña para el sitio del seminario
>
> Estimado/a [nombre]:
>
> Estamos preparando el sitio del seminario **Beyond Connectivity: Wireless Sensing in
> mmWave and Sub-THz Bands** (PUCV, 21 y 22 de octubre de 2026), donde su ficha de
> expositor incluirá una breve reseña y un enlace a su perfil institucional.
>
> ¿Podría enviarnos una fotografía suya de al menos 800 px de lado, y confirmarnos
> expresamente que podemos publicarla en el sitio del seminario y en su difusión? Si
> prefiere que indiquemos el crédito del fotógrafo, díganos cómo debe citarse.
>
> Le adjuntamos también la reseña que preparamos a partir de su perfil público, para que
> la corrija o la reemplace por la que prefiera.

### A cada institución de tercero (UC, USACH, Columbia, Nokia Bell Labs)

> Asunto: Permission to display the [institución] logo on an academic seminar website
>
> Dear [Communications / Licensing team],
>
> The Pontificia Universidad Católica de Valparaíso (Chile) is organising the
> international seminar *Beyond Connectivity: Wireless Sensing in mmWave and Sub-THz
> Bands* (21–22 October 2026), funded by the Chilean National Research and Development
> Agency (ANID, project FOVI250222). [Nombre del expositor], of your institution, is one of
> the invited speakers.
>
> We would like to display your institutional logo on the seminar website, in a section
> labelled «participating and collaborating institutions», linked to your homepage. We
> would use only the variants authorised by your visual identity guidelines, unmodified.
>
> Could you confirm whether this use is permitted, and point us to the file variants we
> should use for light and dark backgrounds? If a written authorisation is required, we
> would be grateful for guidance on the process.

### A la PUCV, por la variante que falta

> Asunto: Escudo PUCV para fondo oscuro — sitio del seminario FOVI250222
>
> El paquete `logos_pucv` de Normas Gráficas incluye las variantes monocromo, color y
> calado, pero no una versión blanca sobre fondo transparente. El sitio del seminario
> tiene tema claro y oscuro, y sobre el fondo oscuro las variantes disponibles no se leen.
> ¿Existe una versión autorizada para fondos oscuros? Necesitamos también el logo de la
> Escuela de Ingeniería Eléctrica en la misma condición.

## Por qué no se han instalado todavía

Dos razones técnicas, ninguna de trámite:

1. **`LogoWall.astro` admite un solo archivo por institución** y lo pinta con un `<img>`
   que no sabe del tema. Los logos oficiales vienen en una variante por fondo, así que hace
   falta un campo más en `Institucion` y que el componente muestre el que corresponde. Es un
   requisito, no un ajuste: está escrito en `../requirements.md`.
2. **Poner solo la variante clara sería una regresión**: en tema oscuro un escudo de tinta
   `#1c335a` sobre `#0a1020` es prácticamente invisible. Peor que el marcador actual, que al
   menos se ve y dice «logo pendiente».
