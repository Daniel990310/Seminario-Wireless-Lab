# Programa y expositores · lo que confirmó la organización

Qué dijo el organizador, cuándo, y qué se hizo con cada dato. Existe porque la
nómina de expositores y los títulos de charla **no salen de fuentes públicas**:
los envía Mauricio Rodríguez por correo, y sin este archivo el sitio no podría
justificar de dónde vino un nombre.

Regla que hereda de [`../fuentes.md`](../fuentes.md): cada dato de aquí lleva su
procedencia. Lo que llega por correo del organizador es `[confirmado]`; lo que se
compone a partir de perfiles públicos es `[verificado]` con su enlace; lo que se
deduce es `[probable]` y **no se publica como confirmado** (RF-7.3).

---

## Fuente · correo del 2026-09-22

Mauricio Rodríguez reenvía a Daniel dos hilos con los expositores en copia. El
original suyo es del 2026-09-21, 13:07 y 12:08. Archivo recibido:
`Fwd Seminar program and website – title, abstract, bio, and photo.pdf`.

Lo que el correo fija, y que el sitio no tenía:

| Dato | Valor | Estado |
| --- | --- | --- |
| Nómina de expositores | **8 personas**, con afiliación | `[confirmado]` |
| Formato de cada sesión | **45 min de charla + 15 min de preguntas** | `[confirmado]` |
| Sede | Campus Santiago PUCV | `[confirmado]`, ya estaba |
| Fechas | 21–22 de octubre de 2026 | `[confirmado]`, ya estaba |
| Plazo para que los expositores envíen material | **lunes 28 de septiembre de 2026** | `[confirmado]` |
| Qué se les pidió | título, resumen de 100–150 palabras, reseña de 100–150 palabras y fotografía reciente | `[confirmado]` |

El organizador además pidió a Valenzuela, Feick, Du y Zussman que **coordinen el
alcance entre ellos** para no repetir contenido: sus temas se solapan en
propagación, modelado de canal, detección y medición.

## Nómina confirmada

Tal como la escribió el organizador. La columna «en el sitio» dice qué se hizo.

| # | Nombre | Afiliación según el organizador | En el sitio |
| --- | --- | --- | --- |
| 1 | Gil Zussman | Columbia University | ya estaba |
| 2 | Jinfeng Du | Nokia Bell Labs | ya estaba |
| 3 | Reinaldo Valenzuela | *(sin afiliación en la lista)* | ya estaba, como Nokia Bell Labs |
| 4 | Giorgio Siringo | ALMA / European Southern Observatory | **añadido el 2026-09-22** |
| 5 | Gustavo Siles | Universidad Privada Boliviana | **añadido el 2026-09-22** |
| 6 | Rodolfo Feick | CCTVal | **afiliación confirmada**, cierra A3 |
| 7 | Miguel Gutiérrez | Pontificia Universidad Católica de Chile | ya estaba |
| 8 | Karel Toledo | Universidad de Santiago de Chile | ya estaba |

### Rodolfo Feick · cierra A3

La ficha decía «Afiliación por confirmar» desde julio. Las fuentes públicas lo
situaban en el Wireless Communications Research Group de la UTFSM, pero eso era
`[probable]` y RF-7.3 prohíbe publicarlo como confirmado.

El organizador lo lista como **CCTVal**. No contradice lo anterior: el CCTVal
—Centro Científico Tecnológico de Valparaíso— es un centro basal **alojado en la
UTFSM**, y la propia PUCV lo presenta como «Dr. Rodolfo Feick (CCTVal-UTFSM)»
`[verificado]`. Se publica la forma larga, `CCTVal, Universidad Técnica Federico
Santa María`, porque una sigla sola no identifica a la institución para quien
llega de fuera.

### Giorgio Siringo · dos matices que conviene saber

1. **La afiliación publicada es la cadena del organizador**, y desde el 2026-10-06
   la respalda su propia firma: «Senior RF Engineer, ALMA» e «International Staff
   Member, ESO» `[verificado, del autor]`. ESO sí es su empleador; trabaja
   destinado en ALMA. (Antes este punto decía lo contrario, deducido de la página
   del Joint ALMA Observatory.)
2. **Va en el bloque «internacionales» y sin país.** Trabaja en Chile, pero ALMA
   es un consorcio intergubernamental y ninguna etiqueta de país lo describe. El
   campo `country` es opcional justamente para eso. Si se decide que lleve
   «Chile», se añade `country: 'CL'` y no hay que tocar nada más.

### Fuente de cada afirmación de las reseñas nuevas

La ficha enlaza **un** perfil (RF-7.2), pero una reseña puede apoyarse en más de
una fuente. Las que no caben en el enlace quedan aquí, para que cualquier dato se
pueda rastrear sin volver a buscarlo.

**Giorgio Siringo** · enlace de la ficha: <https://www.almaobservatory.org/en/team/giorgio-siringo/>

| Afirmación | Fuente | Estado |
| --- | --- | --- |
| Front-End Technical Lead de ALMA | página oficial de su equipo, enlazada en la ficha | `[verificado]` |
| Intereses técnicos: detectores mm/submm, interferometría, polarización, imagen | misma página, campo *Technical interests* | `[verificado]` |
| Doctorado en la Universidad de Bonn, tesis *PolKa: a Polarimeter for Submillimeter Bolometer Arrays* (2003) | repositorio institucional de Bonn, <https://bonndoc.ulb.uni-bonn.de/xmlui/handle/20.500.11811/1899> | `[verificado]` |
| PolKa se instaló en el telescopio APEX | actas SPIE alojadas en eso.org, <https://www.eso.org/sci/libraries/SPIE2010/7741-7.pdf> | `[verificado]` |
| Antes, científico del Observatorio Europeo Austral | la misma publicación de ESO lo firma con esa afiliación | `[verificado]` |

**Superada el 2026-10-06** por la reseña que él envió, igual que con Valenzuela y
Siles. Cambios de fondo: la tesis de Bonn la describe él como *sub-millimeter
polarization in star-forming regions*, no por el instrumento PolKa; añade sus cargos
de Senior RF Engineer y Spectrum Manager, la licenciatura en Física de La Sapienza y
su paso por APEX y por la construcción de ALMA. La tabla queda como rastro.

Descartado a propósito: lo que aportan LinkedIn y los agregadores comerciales de
contactos. No son fuente institucional y no hacía falta ninguno — todo lo anterior
salió de repositorios y del sitio de ESO.

**Gustavo Siles** · enlace de la ficha: <https://lrc.upb.edu/people/>

Todo sale de esa página `[verificado]`: director del Laboratorio de
Radiocomunicaciones, profesor investigador, doctor en Sistemas y Tecnologías de la
Comunicación, e intereses en radiopropagación, comunicaciones por satélite y
comunicaciones inalámbricas. Las bandas Ka, Q, V y W y la altitud de 4.000 m salen
de sus artículos, enlazados desde su ORCID y su Google Scholar en esa misma página.

### Reseña de Valenzuela · reescrita con la que envió él

Es **la única reseña del sitio que no se compone desde perfiles públicos**. Manda
la suya porque es de primera mano, y corrige un error que el sitio publicaba:

| Antes (compuesto de fuentes públicas) | Ahora (lo que él firma) |
| --- | --- |
| «Director del departamento de investigación en Comunicaciones Inalámbricas» | Departamento de **Teoría de la Comunicación**, y con «(R)» |
| — | Distinguished Member of Technical Staff, Bell Laboratories |
| Academia Nacional de Ingeniería, IEEE Fellow, Bell Labs Fellow | añade **WWRF Fellow**, Eric E. Sumner Award, CTTC 2014, VTS Avant Garde 2015 |
| — | más de 250 artículos y 44 patentes |

Dos decisiones que conviene conocer antes de tocarla:

1. **El cargo va en pasado** por la «(R)» con que él lo firma, que lo más probable
   es que signifique *retired* `[probable]`. No se publica la abreviatura ni su
   expansión: se publica el tiempo verbal que implica. **Si «(R)» significara otra
   cosa, esa frase es lo que hay que corregir**; vale la pena preguntárselo a
   Mauricio junto con la foto.
2. **No entra su recuento de citas.** Él escribe «over 36,400 Google Scholar
   citations». Es una cifra que sube cada semana y en una página estática se
   vuelve falsa sola. Artículos y patentes sí, porque no se mueven.

También mencionaba «Highly Cited Author» de Thomson ISI y Fulbright Senior
Specialist; quedaron fuera por longitud, no por duda. Si se quieren dentro, se
añaden a la reseña de los dos idiomas.

### Las fotografías · lo que dice la norma y lo que se hizo

**Ninguno de los dos nuevos tiene retrato, y no se les buscó uno.** RF-11.3 es
explícito: *«Ninguna imagen de expositor se toma de su perfil institucional ni de
un buscador»*, y RF-11.1 exige autorización expresa de la persona. Las seis fotos
que hoy tiene el sitio las entregó Daniel con el permiso confirmado; ninguna se
descargó de la web.

Hay además una razón práctica que apunta al mismo sitio: **el organizador ya les
pidió la foto a los ocho**, con plazo del 28 de septiembre. Un retrato sacado de
la web hoy se reemplaza en seis días por el autorizado, y entretanto el sitio
publica una imagen sin permiso.

Mientras llegan, las dos fichas muestran el monograma de iniciales (RF-11.2), que
es el estado por defecto y no un hueco.

---

## Charlas recibidas · 5 de 8

**Publicadas desde el 2026-10-06** (RF-32) en la sección «Programa», cada una en un
desplegable. El texto vive como dato en
**[`src/data/charlas.ts`](../../src/data/charlas.ts)**, junto con el formato de
sesión y el plazo.

Lo que sigue es la copia **congelada tal como llegó al correo**. Si alguien edita
`charlas.ts`, aquí sigue el original contra el que comparar.

### Reinaldo Valenzuela `[confirmado, del autor]`

> **Title:** 6G Vision, challenges and technology drivers: Sensing capabilities
> enabling the networking of merged cyber physical domains
>
> **Abstract:** 6G must address the "AI super cycle" that is expected to create an
> unprecedented surge in network traffic demand, with 100 times more connected
> devices and up to 10 Tbps data rates enabling new services such as
> high-resolution AR/VR, digital twins, real-time data from autonomous
> vehicle-to-X systems, drones, and robots as well as touch-based data requiring
> ultra-low latency. Thus, 6G is expected to be AI native end-to-end and across
> all layers. Many of the new high demand 6G services and applications will
> involve the integration of communications, compute and sensing. Thus, sensing
> capabilities enabling the networking of the cyber-physical domains may become an
> essential 6G growth and market success driver. In this talk, I will review this
> 6G Vision and challenges, deployment scenarios and key technology drivers, with
> a special focus on sensing-based applications and relevant technology advances.

Envió además **reseña propia y fotografía** (`RAV Photo.jpg`, 44 kB). La reseña ya
está incorporada —ver «Reseña de Valenzuela» más arriba—, y la fotografía también
(`src/assets/expositores/valenzuela.webp`).

### Rodolfo Feick `[confirmado, del autor]`

> **Title:** Referential Grade Propagation Measurements and Models: Channel
> Sounding from 3.5 GHz to 140 GHz
>
> **Abstract:** We present empirically-based statistical wireless channel models,
> with an emphasis on our recent work at mmWave frequencies. Accuracy and
> robustness of our results are achieved thanks to massive amounts of data
> collected in a wide range of settings. We show how this has been achieved using
> our own custom-designed portable channel sounders, built specifically to
> accurately measure path-loss with high sampling rates and a very large link
> budget. Our work has spanned frequency bands from 3.5 GHz to 140 GHz and
> includes most critical parameters needed for wireless service planning such as
> propagation loss versus distance, antenna gain degradation from multipath and
> fade margins. We also include recent results on backscatter power, relevant when
> evaluating the feasibility of joint communication and sensing.

**No envió reseña ni fotografía**: a las dos peticiones respondió «Please use
latest paper». La ficha conserva la reseña compuesta desde su perfil público y la
fotografía que ya estaba autorizada.

### Gustavo Siles `[confirmado, del autor]` · recibido el 2026-09-30

> **Title:** Earth–space and terrestrial atmospheric propagation experiments and
> opportunities for meteorological sensing
>
> **Abstract:** Radiowave propagation through the atmosphere is usually viewed as a
> source of impairments for communication systems. However, the same propagation
> effects can also contain information about the environment. This talk presents
> both perspectives through an overview of approximately three decades of
> atmospheric propagation experiments carried out at the Universidad Politécnica de
> Madrid (UPM). The first part will review UPM measurement campaigns over
> Earth–space and terrestrial paths at frequencies above 30 GHz, with particular
> attention to the long-term 39.4 GHz Q-band beacon experiment in Madrid using the
> Alphasat satellite. The second part will introduce, from a theoretical
> perspective and drawing on published literature, the opportunistic use of
> communication links for meteorological sensing, focusing on the retrieval of
> rainfall rate and atmospheric water vapour from propagation attenuation.

Envió **reseña propia** (unas 170 palabras, sobre las 100–150 pedidas) y
fotografía (`foto_GSiles_USRS.jpg`). La reseña de la ficha se reescribió con su
texto el 2026-10-02: la anterior afirmaba bandas V y W y mediciones «a más de
4.000 m», que él no declara. La fotografía **ya está publicada** (recorte
560×560); el envío al organizador para la web se toma como autorización (RF-11.1).

### Karel Toledo `[confirmado, del autor]` · recibido el 2026-09-27, cargado el 2026-10-06

> **Title:** Intelligent UAV-Assisted Wireless Networks: Trajectory Planning,
> Cooperation, and Decisions Under Uncertainty
>
> **Abstract:** Unmanned aerial vehicles (UAVs) can provide flexible wireless
> coverage as users move and network conditions change. Their usefulness, however,
> depends on decisions about where to fly, how to serve users, and how to balance
> communication performance against limited onboard energy. This talk examines
> these questions through recent work on UAV-assisted 5G and 6G networks. It begins
> with trajectory adaptation for highway vehicular communications, where a UAV
> responds to changing traffic and link conditions. It then considers
> energy-efficient path planning under uncertain user locations and network
> conditions, using belief structures to guide decisions. Finally, it explores
> cooperative deployment of multiple UAVs through multi-agent reinforcement
> learning. Together, these studies show how trajectory optimization,
> uncertainty-aware reasoning, and learned coordination can support more adaptive
> aerial wireless networks, while revealing the trade-offs involved in moving from
> a single UAV to cooperative systems.

Llegó como `Seminar_PUCV_2026.docx`, con reseña propia, y la foto `kt.jpg` (ya
publicada). La reseña de la ficha se reescribió con su texto el 2026-10-06: la
anterior hablaba de un proyecto Fondecyt de Iniciación sobre drones que él no
menciona. Ahora: doctorado en la USACH (mención Automática), pregrado y magíster en
la CUJAE de La Habana, posdoctorado en el CCTVal.

### Giorgio Siringo `[confirmado, del autor]` · recibido el 2026-10-06

> **Title:** Spectrum management and RFI monitoring at the Atacama Large
> Millimeter/submillimeter Array
>
> **Abstract:** The Atacama Large Millimeter/submillimeter Array, ALMA, operates
> ten radio frequency bands at the Chajnantor plateau under exceptional natural
> conditions and limited radio-frequency interference (RFI) protection granted by
> the national administration on the Chilean territory. I report about spectrum
> management efforts in an increasingly crowded spectrum due to the development of
> new facilities on the Chajnantor plateau, self-generated interference, and
> satellite constellations. The integration of ALMA Band-2 receiver (67-90 GHz) in
> the array required a new assessment of the RFI environment. A one-week campaign
> using the Yebes 72-90 GHz portable RFI monitoring receiver temporarily installed
> at the ALMA site confirmed a largely clean environment, while identifying
> localized Band 2 RFI threats that require prevention measures.

Envió además reseña propia (ya en la ficha, ver arriba) y la foto
`Giorgio_Siringo.jpg` (publicada en el PR #17). **Horario:** Mauricio le confirmó
el **jueves 22 de octubre en la mañana** y él lo aceptó. Es el primer dato de
parrilla; se usa cuando se arme `program.days`.

### Faltan tres

Zussman, Du y Gutiérrez no han enviado nada que esté en el rastro del proyecto; el
plazo era el **28 de septiembre**.

### Correo de Gutiérrez del 10-sep (reenviado el 2026-10-06)

Respuesta a la invitación a la visita a ALMA. Lo que toca al sitio y lo que no:

| Punto | Estado |
| --- | --- |
| Logos de ComSoc Chile, CPS-RTC y UC (dos versiones) | **hecho** el 2026-10-06 en `comun.ts` |
| Visita al Observatorio Manuel Foster (UC, cerro San Cristóbal) guiada por Leonardo Vanzi | logística del organizador; no va al sitio salvo que se confirme y se pida |
| Invitar a la decana | ídem |
| ¿Sesión de pósters con alumnos? | sin decidir; si se confirma, es un requisito nuevo |

La **visita a ALMA** (22 al 25 de octubre, opcional y a costo de cada participante)
tampoco está en el sitio; sigue sujeta a confirmación de ALMA.

---

## Decisión · dónde van los títulos y resúmenes (resuelta el 2026-10-06)

**Resuelta por Daniel con una tercera vía:** dentro de «Programa», en una lista
desplegable aparte, sin esperar a la parrilla y sin cargar las fichas (RF-32). Lo
que sigue es el análisis previo, como rastro.

El sitio no tiene sitio para una charla. Las dos opciones, con lo que cuesta cada
una:

1. **Esperar al programa.** `DiaPrograma` ya admite `title`, `speaker` y `summary`
   por sesión, y RF-8 cubre el estado provisional. No hay que tocar nada. El coste
   es que **nada se publica hasta que exista la parrilla horaria**, que hoy no
   existe: el correo fija el formato de 45+15 pero no las horas.
2. **La charla entra en la ficha del expositor.** Título y resumen junto a la
   reseña, publicables **a medida que llegan**, sin esperar al horario. Es un
   requisito nuevo —extiende RF-7— y hay que decidir si el resumen se ve entero o
   plegado, porque 150 palabras por ficha cambian el ritmo de la sección.

Recomendación: la 2, con el resumen dentro del desplegable que la ficha ya tiene.
Llegan por goteo hasta el 28 y la opción 1 los deja invisibles hasta que alguien
arme la parrilla. **No se implementa hasta que esté escrito en `requirements.md`.**
