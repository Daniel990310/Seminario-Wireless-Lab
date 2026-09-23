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
| [01](01-columbia.md) | Columbia University | Gil Zussman | `creative@columbia.edu` | `[verificado]` en `visualidentity.columbia.edu/branding` |
| [02](02-nokia-bell-labs.md) | Nokia Bell Labs | Jinfeng Du · Reinaldo A. Valenzuela | `Press.Services@nokia.com` + los expositores | **entrada, no destino** — ver abajo |
| [03](03-uc.md) | Pontificia U. Católica de Chile | Miguel Gutiérrez Gaitán | `mhola@uc.cl` | `[verificado]` |
| [04](04-usach.md) | Universidad de Santiago de Chile | Karel Toledo de la Garza | `imagen@usach.cl` | `[verificado]` |
| [05](05-utfsm-cctval.md) | CCTVal · UTFSM | Rodolfo Feick | `cristian.reyessa@usm.cl` **+ formulario** | `[verificado]` en `comunicaciones.usm.cl/kit-digital-usm/` |
| [06](06-alma.md) | ALMA / ESO | Giorgio Siringo | `copyright@alma.cl` | `[verificado]` en el aviso de copyright de ALMA |
| [07](07-upb.md) | Universidad Privada Boliviana | Gustavo A. Siles Soria | vía el Dr. Siles | **no publica contacto de marca** — buscado |
| [08](08-pucv-variante-oscura.md) | PUCV | *(organizador)* | Dirección de Comunicación Estratégica | interno |

Los dígitos del orden no significan prioridad. **Si hay que elegir por dónde empezar, es por
el 05, el 06 y el 07**: son los que todavía no se han pedido nunca.

## Cómo se consiguió cada dirección, y qué queda sin cerrar

Siete de las ocho tienen ya un destino concreto. Ninguna se rellenó a ojo.

- **Columbia → `creative@columbia.edu`.** Su guía de marca lo dice con todas las letras:
  *«If you would like to request special permission to use the parent brand trademark,
  please email your request to Columbia Creative»*. Ese es nuestro caso exacto —un tercero
  usando la marca matriz—, así que no hace falta pasar por el Office of General Counsel
  salvo que ellos deriven. En copia va `licensing@columbia.edu`.
- **ALMA → `copyright@alma.cl`.** Es la dirección que su propio aviso de copyright enlaza
  **en la frase que exige el consentimiento escrito para el logo**.
- **USM → correo _y_ formulario.** Además de `cristian.reyessa@usm.cl`, el kit digital tiene
  un **formulario para enviar piezas gráficas a autorización**. Es la única de las ocho con
  un trámite formalizado de punta a punta: solicitud, plazo de cinco días hábiles y acuse.
- **Nokia → no hay destino, hay entrada.** Es el único titular que **exige consentimiento
  escrito sin decir a quién pedírselo**: sus términos lo imponen, y tanto la página de
  términos como la de contacto devuelven **403** a cualquier lectura automática. Lo
  publicado que sirve de puerta es la oficina de prensa, `Press.Services@nokia.com`, y el
  formulario de Bell Labs. **El camino corto es Du y Valenzuela**, que están dentro y
  tienen acceso al proceso interno; por eso van en copia y no por cortesía.
- **UPB → vía el Dr. Siles.** Se buscó y **no existe** contacto de marca publicado: ni
  manual de identidad, ni dirección de imagen corporativa, ni formulario. Cuidado con los
  buscadores aquí: casi todo lo que devuelven es de la **Universidad Pontificia Bolivariana**
  de Colombia, que es otra institución. Siles va en copia y lo más eficiente es pedirle a él
  la unidad correcta.

> **Dos direcciones venían ofuscadas por Cloudflare** —Columbia y ALMA— y se decodificaron
> con el esquema público del propio Cloudflare, que es lo mismo que hace el navegador de
> cualquiera al abrir la página. Son direcciones publicadas para que la gente escriba.
> Aun así **conviene confirmarlas a ojo antes de enviar**, que cuesta diez segundos.

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
