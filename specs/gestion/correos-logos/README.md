# Correos para pedir los logos que faltan

Redactados el **2026-09-23**. Uno por institución, **listos para copiar y pegar** en el
cliente de correo. Cada archivo trae destinatario, asunto y cuerpo; lo único que falta
poner es el envío.

Sustituyen en la práctica a los borradores de
[`../correos-instituciones.md`](../correos-instituciones.md), que quedan como registro de
por qué cada titular está en la situación en que está. **Lo que cambió respecto de
aquellos:** eran seis expositores y ahora son ocho, el sitio no tenía dirección publicada
y ahora es <https://bcsensing.org>, la firma estaba como `[Nombre] — [cargo]`, y faltaban
las tres instituciones nuevas.

## Estado, y qué se pide en cada caso

| # | Institución | Expositor | Destinatario | Estado de la dirección |
| - | ----------- | --------- | ------------ | ---------------------- |
| [01](01-columbia.md) | Columbia University | Gil Zussman | Office of General Counsel / Columbia Licensing | **por confirmar** — `cufo.columbia.edu` devolvió 403 |
| [02](02-nokia-bell-labs.md) | Nokia Bell Labs | Jinfeng Du · Reinaldo A. Valenzuela | Nokia Trademark / Brand | **por confirmar** — vía `nokia.com/notices/terms/` |
| [03](03-uc.md) | Pontificia U. Católica de Chile | Miguel Gutiérrez Gaitán | `mhola@uc.cl` | `[verificado]` |
| [04](04-usach.md) | Universidad de Santiago de Chile | Karel Toledo de la Garza | `imagen@usach.cl` | `[verificado]` |
| [05](05-utfsm-cctval.md) | CCTVal · UTFSM | Rodolfo Feick | `cristian.reyessa@usm.cl` | `[verificado]` en `comunicaciones.usm.cl/kit-digital-usm/` |
| [06](06-alma.md) | ALMA / ESO | Giorgio Siringo | ALMA Education and Public Outreach Dept. | **por confirmar** — correo ofuscado por Cloudflare |
| [07](07-upb.md) | Universidad Privada Boliviana | Gustavo A. Siles Soria | Comunicación / Marketing institucional | **por confirmar** — no publica contacto de marca |
| [08](08-pucv-variante-oscura.md) | PUCV | *(organizador)* | Dirección de Comunicación Estratégica | interno |

Los tres primeros dígitos del orden no significan prioridad. **Si hay que elegir por dónde
empezar, es por el 05, el 06 y el 07**: son los que todavía no se han pedido nunca.

## Las cuatro direcciones que hay que copiar antes de enviar

Este proyecto **no inventa un dato institucional**, así que ninguna de estas se rellenó a
ojo. Las cuatro se consiguen mirando la página del titular:

1. **Columbia** — `cufo.columbia.edu/content/guidelines-use-columbia-marks`. Devolvió
   **403** al leerlo desde aquí `[medido: 2026-08-25]`; desde un navegador normal abre.
2. **Nokia** — el equipo de marca que indique `nokia.com/notices/terms/`.
3. **ALMA** — su aviso de copyright, <https://www.almaobservatory.org/en/copyright-notice/>,
   enlaza el contacto de consentimiento para la marca, pero **la dirección va ofuscada por
   Cloudflare** y solo se ve al pasar por el navegador. Ahí está, en la nota que empieza
   «*Note that this general permission does not extend to the use of ALMA's logo…*».
4. **UPB** — no publica un contacto de marca. Lo más corto es **pedírselo a Gustavo Siles**,
   que es el expositor y sabe a qué unidad va; está dicho así dentro del archivo 07.

## Quién firma y desde dónde

Los cuerpos van firmados por **Daniel Caignet González**, comité organizador. Si prefieres
que firme Mauricio Rodríguez —es director del programa de doctorado y quien coordina con
los expositores—, **se cambia el bloque final y nada más**; el resto del texto no depende
de quién firme.

⚠️ **La dirección de contacto del cuerpo es `contact@bcsensing.org`**, que es la que publica
el sitio y reenvía a tu casilla PUCV. Va así por dos razones: es la misma que verá quien
entre a la web, y **el repositorio tiene dos versiones distintas de tu dirección PUCV**
—`daniel.caignet@pucv.cl` en `comun.ts` y `daniel.caignet.g@mail.pucv.cl` en la cabecera
del correo de Mauricio—. Antes de enviar, confirma cuál es la buena y ponla si quieres
firmar con ella.

**Envía desde tu casilla habitual.** `bcsensing.org` **hoy solo recibe**: no hay relé SMTP,
así que un correo «desde» `contact@` no se puede mandar todavía.

## Lo que se pide en todos, y por qué está redactado así

Los tres puntos se repiten en los ocho porque los tres hacen falta:

1. **Autorización** para mostrar la marca en la sección de instituciones del sitio,
   enlazada a la página del titular, sin alterar, y **sin sugerir patrocinio ni respaldo**.
2. **El archivo correcto, con variante para fondo claro y para fondo oscuro.** El sitio
   tiene los dos temas y **no recolorea marcas ajenas** (RF-10.4): pedir las dos variantes
   es lo que evita tener que hacerlo. Se pide SVG cuando existe.
3. **El manual de normas gráficas** aplicable, para respetar área de resguardo y tamaño
   mínimo sin adivinar.

Y los ocho dicen, en una línea, que **la sección puede quedar sin publicar hasta que
contesten**. No es cortesía: hoy está así de verdad. Ninguna de estas marcas se muestra
—todas pintan el marcador de posición—, y decirlo es lo que distingue pedir permiso de
pedir perdón.

## Lo que este trámite NO cubre

- **Las fotografías de los expositores.** Son de la persona, no de su institución, y van
  por otra vía: el organizador ya se las pidió a los ocho con plazo del 28 de septiembre.
  Ver [`../programa-y-expositores.md`](../programa-y-expositores.md).
- **ESO como marca aparte.** El 06 pide la marca de **ALMA**. Si la organización prefiere
  mostrar la del Observatorio Europeo Austral, es otra solicitud y otro titular.
- **ANID y EIE PUCV.** Sus marcas ya están instaladas y no falta ninguna; lo pendiente con
  ANID es validación de uso, y está en `../correos-instituciones.md` §7.

## Aviso de exposición

Este repositorio es **público** hoy. Esta carpeta añade direcciones de correo de terceros
a las que ya expone `../correos-instituciones.md`. Sigue siendo una decisión abierta pasar
el repositorio a privado; esto la hace un poco más urgente, no menos.
