# Subdominio `pucv.cl` para el sitio del seminario

Levantado el **2026-08-25** desde
<https://dsic.pucv.cl/solicitudes-de-servicios/hosting/> y de los formularios oficiales
`F-180_v1_Solicitud_Dominios.docx` y `F-170_v4_Solicitud_Webhosting-3.docx`, leídos
completos `[verificado: 2026-08-25]`. Cierra la decisión abierta **A6** (subdominio
definitivo).

## Lo primero, porque cambia el trámite: son dos servicios distintos

La página de la DSIC mezcla tres formularios y es fácil pedir el que no toca.

| Formulario | Qué hace | Costo | SLA |
| ---------- | -------- | ----- | --- |
| **F-180 · Solicitud de Dominios** | Crea el subdominio `algo.pucv.cl` y su registro DNS | **Gratuito** | 48 horas hábiles |
| F-170 · Solicitud de Webhosting | Da espacio en disco en los servidores de la PUCV | **UF 0,5** (tarifa base) | 48 horas hábiles |
| F-190 · Adquisición de Dominios | Compra un dominio externo (`.com`, `.cl`…) | Costo del proveedor | 48 horas hábiles mínimo |

**Nos hace falta solo el F-180.** El sitio ya está desplegado en Cloudflare Workers y es
100 % estático; el hosting de la PUCV sería un segundo lugar donde vive lo mismo.

**Y conviene decir qué se pierde al no pedir el F-170**, porque es una decisión y no un
descarte obvio. El hosting de la PUCV *sí* podría servir —1 GB y 10.000 archivos sobran
para un `dist/` de este tamaño, y trae certificado Let's Encrypt gratis—. Lo que se pierde
al quedarse en Cloudflare: nada de la parte técnica; y lo que se gana es el flujo de
despliegue que ya existe (`wrangler deploy`, verificado) en lugar de subir archivos a mano
cada vez. Lo que se pierde al *irse* a la PUCV sería justamente eso, más la red de borde.
Si la DTI prefiere que el sitio viva en su infraestructura, es una conversación válida y el
sitio se puede mover: es HTML, CSS y tipografías.

> ⚠️ **La incertidumbre real del trámite, y no hay que taparla.** El F-180 crea el
> subdominio y su DNS, pero **su anexo de condiciones está escrito para sitios alojados en
> la PUCV**, y no dice si la DSIC crea un `CNAME` hacia infraestructura externa. Puede que
> pidan el F-170, o que lo resuelvan sin problema. Por eso el correo lo pregunta de frente
> en lugar de suponerlo, y por eso la sección **D · Observaciones** del formulario lleva la
> explicación técnica.

## Datos para llenar el F-180

Se completa «con letra imprenta, clara y legible». Los campos marcados `(*)` son
obligatorios: **sin ellos la solicitud no se procesa**.

### A · Identificación del solicitante y responsable ante la PUCV `(*)`

Tiene que ser **una persona de la PUCV**, no un proveedor externo: el campo se llama
«responsable ante la PUCV» y la sección E exige la firma de la autoridad responsable.

| Campo | Qué poner |
| ----- | --------- |
| RUT | del responsable PUCV |
| Apellido paterno · Apellido materno · Nombres | ídem |
| Función / Cargo | p. ej. «Investigador responsable, proyecto FOVI250222» o «Director, Escuela de Ingeniería Eléctrica» |
| Anexo / Celular | anexo institucional |
| e-mail | correo `@pucv.cl` |
| Unidad | Escuela de Ingeniería Eléctrica |

### B · Datos del dominio a asignar (DNS)

| Campo | Qué poner |
| ----- | --------- |
| Denominación del dominio `(*)` | **`beyondconnectivity.pucv.cl`** (alternativa: `seminariowireless.pucv.cl`) |
| Requiero sub dominio pucv.cl | marcar **`dominio.pucv.cl`** con una X |
| Dominios no pucv.cl | **dejar en blanco.** Es la vía del F-190 y no la queremos |

Sobre el nombre: `beyondconnectivity` conserva el título oficial del seminario, que por
decisión **D2** no se traduce nunca. Es largo pero se escribe una vez y queda en el
canónico, el sitemap y las imágenes para compartir.

### C · Responsable técnico

Aquí sí va quien opera el sitio: nombre, RUT, correo y teléfono de quien vaya a
coordinar el DNS con la DSIC.

### D · Observaciones

Este campo es el que evita una ida y vuelta. Texto propuesto:

> El sitio del seminario está desplegado en infraestructura externa (Cloudflare Workers),
> es 100 % estático y no requiere espacio de hosting en la PUCV. Solicitamos únicamente la
> creación del subdominio y su registro DNS apuntando a ese despliegue, mediante `CNAME`.
> Podemos entregar el destino exacto y el registro de validación que Cloudflare solicite.
> Si el procedimiento exige que el sitio esté alojado en servidores de la Universidad,
> agradecemos indicarlo para evaluarlo.

### E · Recepción de solicitud `(*)`

Nombre y **firma de la autoridad responsable**, y fecha de recepción. Este campo es el que
convierte el formulario en solicitud válida: sin firma no entra al sistema de atención.

## Cómo se envía

| Dato | Valor |
| ---- | ----- |
| Correo del servicio | **`servicios.dsic@pucv.cl`** |
| Correo de soporte y consultas del formulario | **`soporte@pucv.cl`** |
| Call Center | **+56 32 227 3400**, anexo **3400** |
| SLA de habilitación de un dominio nuevo | **48 horas hábiles** desde el ingreso de la solicitud completa |
| SLA de cambio de DNS | 48 horas hábiles |

---

## Correo para enviar la solicitud

**Para:** `servicios.dsic@pucv.cl`
**Copia:** `soporte@pucv.cl`
**Asunto:** Solicitud F-180 · subdominio `beyondconnectivity.pucv.cl` — seminario internacional EIE / proyecto ANID FOVI250222
**Adjunto:** `F-180_v1_Solicitud_Dominios` completado y firmado (PDF)

> Estimado equipo de la DSIC:
>
> Adjunto el formulario **F-180 v1 · Solicitud de Dominios**, completado y firmado, para
> solicitar la creación del subdominio **`beyondconnectivity.pucv.cl`**.
>
> **Para qué es.** Es el sitio del seminario internacional *Beyond Connectivity: Wireless
> Sensing in mmWave and Sub-THz Bands*, que la Escuela de Ingeniería Eléctrica realizará
> el **21 y 22 de octubre de 2026** en la Sede Santiago de la Universidad, en el marco del
> proyecto **FOVI250222**, financiado por la Agencia Nacional de Investigación y
> Desarrollo, ANID. El sitio es la vía de difusión y de registro de asistentes del
> seminario, e incluye expositores de Nokia Bell Labs, Columbia University, la UC y la
> USACH.
>
> **Qué necesitamos exactamente, y qué no.** Pedimos **solo el subdominio y su registro
> DNS**. No solicitamos espacio de hosting: el sitio es completamente estático —HTML, CSS
> y tipografías, sin base de datos ni componentes de servidor— y está desplegado en
> Cloudflare Workers, funcionando hoy en una URL provisional. Lo que haría falta es un
> registro **`CNAME`** desde el subdominio hacia ese despliegue; podemos entregarles el
> destino exacto y el registro de validación de certificado que Cloudflare solicite, en
> cuanto nos digan que la vía es viable.
>
> **La pregunta concreta, por si el procedimiento no lo contempla.** El anexo de
> condiciones del formulario está redactado para sitios alojados en servidores de la
> Universidad. Si la creación de un subdominio `pucv.cl` apuntando a infraestructura
> externa requiere otro trámite, una autorización adicional, o si la DSIC prefiere que el
> sitio se aloje en su plataforma, agradecemos que nos lo indiquen: en ese caso
> evaluaríamos el formulario F-170 y coordinaríamos la migración, que es factible por ser
> un sitio estático.
>
> **Datos técnicos del sitio, por si sirven para la evaluación:**
>
> - Sitio estático generado con Astro. Sin PHP, sin base de datos, sin envío de correo.
> - Peso de primera carga: 167 kB comprimidos.
> - Bilingüe, español en la raíz e inglés en `/en/`.
> - Accesibilidad WCAG 2.1 AA verificada de forma automatizada: 0 hallazgos de `axe-core`
>   en dos anchos, dos temas y los dos idiomas.
> - Certificado TLS gestionado por el proveedor.
>
> Quedamos atentos a lo que necesiten de nuestra parte. Cualquier consulta, con gusto la
> resolvemos por este medio o por teléfono.
>
> Saludos cordiales,
>
> [Nombre] — [cargo]
> Escuela de Ingeniería Eléctrica, Pontificia Universidad Católica de Valparaíso
> Proyecto FOVI250222 · Comité organizador *Beyond Connectivity 2026*
> [correo `@pucv.cl`] · [anexo / celular]

---

## Lo que hay que hacer en el repositorio cuando el dominio exista

No es parte del trámite, pero se olvida y deja el sitio mintiendo sobre sí mismo:

1. **Definir `SITE_URL`** con el dominio nuevo al construir para desplegar. Sin eso el
   canónico apunta al respaldo `PRODUCTION_SITE`, que hoy es un dominio inexistente. Está
   avisado en `wrangler.jsonc`.
2. **Regenerar las imágenes para compartir**: `npm run og`. Llevan la URL dentro.
3. **Retirar el `noindex`**, que existe justamente porque el dominio era provisional.
4. **Correr `npm run verify:publicado -- https://beyondconnectivity.pucv.cl`**, los 22
   criterios de RNF-3 contra el sitio en vivo.
5. **Anotar el dominio definitivo** en `requirements.md`, cerrando A6.
