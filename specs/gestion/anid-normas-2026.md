# Documentación ANID entregada por el cliente — revisión del 2026-08-25

Cuatro documentos, en `C:\Users\danie\OneDrive\Documentos\Claude\ANID documentación`,
fechados en el disco el **2026-08-25**. Leídos íntegros `[verificado]`.

| Documento | Páginas | ¿Ya se conocía? |
| --------- | ------- | --------------- |
| `Cómo mencionar a ANID en productos 2026.pdf` | 1 | **Sí.** Es la fuente de RNF-8.1 y RNF-8.2, citada desde el 2026-08-03 |
| `Manual de marca ANID 2026.pdf` | **26** | **No.** El repositorio lo citaba de segunda mano («pueden revisar el Manual…»), nunca lo tuvo |
| `Eventos y actividades remotas 2026.pdf` | 4 | **No. Es el más accionable de los cuatro** |
| `Cómo mencionar a ANID en notas periodísticas.pdf` | 1 | **No** |

**Lo que confirma el primero, y no cambia nada:** la nomenclatura «Financiado por la
Agencia Nacional de Investigación y Desarrollo, ANID / Instrumento (concurso)», el logo
conjunto Ministerio de Ciencia + ANID, y que los **sitios web** están nombrados entre los
productos donde aplica. Todo eso ya está implementado.

---

## 1 · El manual de marca: cinco reglas que tocan a este sitio

### 1.1 Convivencia con otros logos — la regla que el sitio puede estar incumpliendo

> «Los logos de otras instituciones no gubernamentales **deben situarse a la izquierda de
> ANID** y tener el mismo peso visual, para no restar importancia.» `[verificado: manual, p. 8]`

Y para logos gubernamentales, a la **derecha** de ANID —solo su parte roja—, máximo tres
instituciones; con más de tres ministerios pasa a leerse como actividad de Gobierno y se
listan en tipografía gobCL.

**Cómo está el sitio hoy** `[medido: `PaginaSeminario.astro:237-306`]`: las marcas de las
universidades participantes van en dos `LogoWall`, y el logo Ministerio de Ciencia + ANID
va en **un bloque propio, debajo**, junto a la mención y el código del proyecto.

**No está claro si eso cumple.** La regla del manual está escrita para una composición
horizontal —un *lockup* de marcas en una fila— y aquí la disposición es vertical, con ANID
en su propia superficie destacada, que es lo contrario de restarle importancia. Pero el
manual no contempla el caso. **Es la consulta 2 del correo a ANID**, y no se resuelve
adivinando: cambiar la maqueta a una fila con ANID a la derecha es trabajo real, y hacerlo
sin saber si hacía falta sería inventarse un requisito.

### 1.2 Versión «pluma»: probablemente no es la variante correcta para el tema oscuro

> «La versión pluma del isologo **sólo admite colores planos** y deberá ser utilizada
> **únicamente para sistemas de impresión que no permiten el uso de colores** ni grisados
> o para aplicaciones directas sobre materiales especiales tales como telas, cueros,
> metales, pulidos, bruñidos o materializaciones en alto o bajorrelieve, sobre superficies
> de mampostería o sobre fotografías.» `[verificado: manual, pp. 7 y 11]`

Una pantalla con fondo oscuro **no es ninguna de esas cosas**. Y el sitio usa
`anid-minciencia-oscuro.svg`, que viene de `LOGOS MINCIENCIA + ANID 2026_PLUMA-BLANCO.svg`.

**No hay alternativa dentro del kit**: es el único archivo blanco sobre transparente que
trae. Así que el sitio no está eligiendo mal entre dos opciones, está usando la única que
existe para un caso que el manual no cubre. **Consulta 3 del correo a ANID.**

### 1.3 Y un dato que corrige la ficha del repositorio

`specs/002-rediseno-visual/marcas/README.md` dice que `anid-minciencia-claro.svg` sale de
`..._PLUMA.svg`, «tinta única `#1c335a`», y que la versión color queda «de reserva».

**Lo que está instalado no es eso.** `public/logos/anid-minciencia.svg` lleva **dos
tintas, `#1b6ab1` y `#e73c48`** `[medido: 2026-08-25]`: es la variante **COLOR**, que para
el tema claro es la correcta. La ficha describe una decisión distinta de la que se tomó.
Hay que corregir la ficha, no el archivo.

### 1.4 El isologo reducido está prohibido para nosotros

> «El isologo reducido o marcador es de **uso exclusivo para la papelería representativa de
> ANID**: tarjetas de presentación, hojas, sobres y carpetas, ppts, así como para avatares
> en redes sociales.» `[verificado: manual, p. 13]`

El sitio no lo usa. Queda escrito para que a nadie le parezca una alternativa «más limpia»
que el logo conjunto.

### 1.5 Fotografías: una prohibición nueva que afecta a lo que está pendiente

> «Queda **estrictamente prohibido** utilizar fotografías o videos o de Inteligencia
> Artificial para **generar imágenes de personas rostros sintéticos** en toda nuestra
> comunicación.» `[verificado: manual, p. 18]`

Y además: nada de filtros o efectos de postproducción que atenten contra la credibilidad
de la escena, nada de fotografías «artificiales y extremadamente compuestas o
construidas», y consentimiento informado de imagen mediante contrato de cesión de derechos.

**Esto refuerza y amplía lo que el proyecto ya decidió.** RF-11 y la nota de
`marcas/README.md` prohíben tomar fotos de expositores de la web por copyright y derechos
de imagen; ahora hay una segunda razón, del financista, y **cubre el atajo que nadie había
prohibido todavía: generar el retrato**. Toca directamente dos pendientes:

- **Los seis retratos de expositores.** Se piden al expositor con autorización escrita
  (A14); el monograma es el estado por defecto. Nada generado.
- **El carrusel de fotos de la sede**, pendiente de que lleguen las fotos. Deben ser
  capturas reales, sin composición artificial ni filtros que alteren la escena.

### 1.6 Tipografía: probablemente no nos aplica, pero conviene decirlo

El manual asigna **gobCL** para logos y titulares y **Verdana** para párrafos, y exige
gobCL para «complementos de dirección web o redes sociales, así como el slogan de ANID».
El sitio usa Crimson Pro y Atkinson Hyperlegible Next (decisión **D4**), esta última
elegida por legibilidad para baja visión.

`[Probable]` esas reglas gobiernan las **piezas de ANID**, no la identidad de un proyecto
financiado: el propio manual dice que las directrices «no pretenden restringir la
creatividad». No se cambia nada por esto. Si ANID responde otra cosa en la validación, se
reabre D4, que es una decisión cerrada y no se toca sin acuerdo.

### 1.7 La puerta que el manual deja abierta, y que conviene usar

> «De necesitar una aplicación del diseño adicional o **generar un producto distinto a los
> considerados en este manual, debe ser solicitado al Departamento de Comunicaciones
> ANID**.» `[verificado: manual, p. 25]`

Un sitio web con tema claro y tema oscuro es exactamente ese caso. Por eso el correo a ANID
ofrece mostrar el sitio antes de publicarlo: convierte tres dudas en una validación.

---

## 2 · El protocolo de eventos: lo más accionable de los cuatro documentos

Este documento no existía en el rastro del proyecto y **abre un trámite con fecha límite**.

### 2.1 Hay una minuta que hay que llenar, y pide datos que el sitio ya tiene

La «MINUTA PARA EVENTOS O ACTIVIDADES» del anexo pide: nombre del evento, fecha, hora de
inicio y cierre, lugar, link de plataforma, formato (gratuito / pagado / invitación
cerrada), área de ANID con la que se vincula, responsable, organizador, descripción breve,
objetivos, antecedentes, otras autoridades, participantes internacionales, si es bilingüe y
en qué idioma, público objetivo, perfil y proyección de asistentes, auspiciadores.

Casi todo eso está en `src/data/` o en la especificación. **Lo que falta y hay que
decidir**: hora de inicio y cierre por jornada (depende del programa, que sigue vacío),
proyección de asistentes, y si el seminario es gratuito.

En «Solicitud a ANID» la minuta tiene casillas para **Participación de Autoridad ANID**,
**Logos**, **Difusión / vinculación** y apoyo en contactos. Es decir: **la vía formal para
pedir los logos es esta minuta**, no un correo suelto. El correo del punto 7 de
[`correos-instituciones.md`](correos-instituciones.md) la anuncia y la acompaña.

### 2.2 Si se quiere una autoridad de ANID, hay una fecha tope

> «La invitación debe ser enviada a la Agencia, **como mínimo, con 15 días hábiles de
> anticipación**.» `[verificado]`

El seminario es el **21 y 22 de octubre de 2026**. Quince días hábiles antes cae en torno
al **29 de septiembre de 2026** `[supuesto: sin descontar feriados chilenos de septiembre,
que son varios — conviene apuntar a mediados de septiembre]`.

La invitación **debe ir firmada por la máxima autoridad de la institución organizadora**
—rector, decano o director— y acompañada de la minuta y del programa de la actividad. Es
decir: **no se puede invitar a ANID mientras `program.days` esté vacío.** El programa deja
de ser solo una sección del sitio y pasa a ser un requisito de un trámite con fecha.

### 2.3 Contactos, actualizados a julio de 2026

Del propio documento `[verificado]`:

| Autoridad | Cargo | Contacto administrativo |
| --------- | ----- | ----------------------- |
| Alejandra Pizarro | Directora Nacional | Susana Celis (Gabinete) `scelis@anid.cl` · María Elena Mora `mmora@anid.cl` |
| Héctor Zavala | Subdirector (s) de Capital Humano | `marevalo@anid.cl` |
| Nicole Ehrenfeld | Subdirectora (s) de Centros e Investigación Asociativas | `lcamacho@anid.cl` |
| Carlos Ladrix | Subdirector de Investigación Aplicada | `svidal@anid.cl` |
| Fabiola Cid | Subdirectora (s) de Proyectos de Investigación | `pandrade@anid.cl` |
| Patricia Muñoz | Subdirectora de Redes, Estrategia y Conocimiento | `ayanez@anid.cl` |

**Cuál corresponde a FOVI250222 está sin confirmar.** `[Probable]` la Subdirección de
Redes, Estrategia y Conocimiento, porque FOVI es el instrumento de vinculación
internacional. Hay que confirmarlo con la organización antes de copiar a nadie: mandar una
invitación institucional a la subdirección equivocada es un error visible.

---

## 3 · Menciones en prensa: reglas para cuando se anuncie el seminario

No afecta al código, y conviene tenerlo escrito antes de que alguien redacte el
comunicado `[verificado]`:

1. **Comunicado de prensa:** nombre completo **y** sigla — «cuenta con el financiamiento de
   la Agencia Nacional de Investigación y Desarrollo, ANID».
2. **Nota escrita o digital con espacio limitado:** se puede usar solo la sigla, y entonces
   **se omite el artículo «La»** — «cuenta con el financiamiento de ANID», no «de la ANID».
3. **Radio y televisión:** que quien vocee el proyecto mencione el financiamiento en algún
   momento de su intervención.

Y del documento de productos, dos que se olvidan: los nombres científicos van en
nomenclatura estándar, y **las regiones se citan por su nombre, no por su número**.

---

## 4 · Resumen: qué cambia y qué no

**Nada de esto rompe el sitio.** Los cuatro documentos confirman lo que RNF-8 ya
implementa. Lo que aportan es esto:

| # | Hallazgo | Qué hay que hacer |
| - | -------- | ----------------- |
| 1 | Convivencia de logos: ANID a la derecha de las marcas no gubernamentales | **Consultar antes de tocar la maqueta.** Consulta 2 del correo |
| 2 | La versión «pluma» no está prevista para pantalla, y es la única blanca del kit | Consulta 3 del correo |
| 3 | `marcas/README.md` describe la variante clara como «pluma» y lo instalado es la **color** | Corregir la ficha `[medido]` |
| 4 | Prohibido generar rostros con IA; sin filtros que alteren la escena; consentimiento por escrito | Anotar en RF-11 y en el carrusel de la sede, **antes** de que lleguen las fotos |
| 5 | El isologo reducido es de uso exclusivo de ANID | Anotar como prohibición |
| 6 | Existe una **minuta obligatoria** y es la vía formal para pedir los logos | Llenarla. Faltan horarios, aforo y si es gratuito |
| 7 | Invitar a una autoridad de ANID exige **15 días hábiles** y adjuntar el programa | Fija una fecha tope en torno a mediados de septiembre de 2026, y **convierte `program.days` en bloqueante de un trámite** |
| 8 | Tipografías gobCL / Verdana | `[Probable]` no aplica al sitio del proyecto. No se toca D4 salvo que ANID diga otra cosa |
| 9 | Reglas de mención en prensa, incluida la omisión del artículo «La» con la sigla | Tenerlo a mano para el comunicado |

Los puntos **1, 2, 4 y 5** son requisitos nuevos o precisiones de RNF-8, y por la regla 1
de `AGENTS.md` **se escriben en `requirements.md` antes de tocar código**. El **3** es una
corrección de registro y se puede hacer ya. El **7** cambia la prioridad del programa.
