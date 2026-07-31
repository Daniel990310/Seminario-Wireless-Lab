# Beyond Connectivity — Sitio del seminario

Sitio web del seminario internacional **Beyond Connectivity: Wireless Sensing in
mmWave and Sub-THz Bands**, organizado por la Escuela de Ingeniería Eléctrica de
la Pontificia Universidad Católica de Valparaíso.

21 y 22 de octubre de 2026 · Auditorio de la Sede PUCV Santiago.

## Stack

| Pieza        | Elección                                        | Por qué                                                                                    |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Framework    | [Astro](https://astro.build) 7                  | Sitio de contenido: genera HTML estático y envía casi nada de JavaScript.                   |
| Estilos      | Tailwind CSS 4                                  | Sistema de diseño en un solo lugar (`src/styles/global.css`), sin CSS muerto en producción. |
| Tipografía   | Crimson Pro · Atkinson Hyperlegible Next · JetBrains Mono | Auto-hospedadas: sin peticiones a Google Fonts. Atkinson está diseñada para baja visión.  |
| Idiomas      | i18n nativo de Astro                            | Español en `/`, inglés en `/en/`. Rutas reales, sin detección por navegador.                |
| Verificación | `astro check` y siete verificadores propios     | Ver «Comandos». Sin ellos en verde, ninguna afirmación de calidad está respaldada.          |

### Cuánto JavaScript envía este sitio

**1,1 kB comprimidos**, y ninguna petición a un archivo `.js`: el poco código que
corre —menú móvil, selector de tema, carga diferida del mapa, sección activa—
viaja dentro del HTML.

Conviene saber cómo se llegó aquí, porque el camino tuvo marcha atrás:

- Se partió de **Magic UI** con `AnimatedBeam` y `Ripple`, que costaban unos
  110 kB de React + Motion.
- **T3** reescribió la red de colaboración con SVG y `stroke-dashoffset`, y quitó
  Motion. El sitio pasó a no hidratar ninguna isla.
- **T5** retiró `Ripple`: sus círculos llevaban `background-color` y unos rects
  enormes que dejaban el texto vecino sin contraste medible para axe, y además
  usaba sombras, que el sistema de diseño no admite.

React sigue instalado como capa de renderizado, pero hoy **ningún componente se
hidrata**. `src/components/ui/` está vacío: la base de shadcn/ui sigue montada
—`components.json` y los alias— por si T10 incorpora componentes interactivos.

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo en localhost:4321
npm run build      # generar el sitio estático en dist/
npm run preview    # previsualizar lo generado
npm run check      # verificación de tipos
npm run og         # regenerar las imágenes para compartir (requiere build)
```

### Verificación

Todos requieren un `npm run build` previo. `npm run verify:todo` los corre en
cadena y resume.

| Comando                    | Qué comprueba                                                        |
| -------------------------- | -------------------------------------------------------------------- |
| `npm run verify`           | **La autoridad.** axe-core en 2 anchos × 2 temas × 2 idiomas, y peso   |
| `npm run verify:tema`      | Los 17 criterios de RF-4 que axe no puede evaluar                     |
| `npm run verify:red`       | Los 7 criterios de T3 sobre la red de colaboración                    |
| `npm run verify:teclado`   | Foco visible, recorrido por teclado y zoom de texto al 200 % (T6)     |
| `npm run verify:idioma`    | Los 17 criterios de RF-1, incluidos **textos sin traducir**           |
| `npm run verify:seo`       | Los 20 criterios de RNF-3: imágenes para compartir y metadatos        |
| `npm run verify:interaccion` | RF-6: contenido íntegro sin JavaScript y sección activa             |

## Cómo editar el contenido

**Todo el contenido vive en `src/data/`.** No hace falta tocar el marcado ni los
estilos para actualizar la web.

El sitio es bilingüe, así que el contenido está partido en cuatro archivos:

| Archivo         | Qué lleva                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------- |
| `comun.ts`      | Lo que **no** se traduce: título oficial, nombres de instituciones y personas, dirección, fechas ISO, código del proyecto |
| `es.ts`         | Todo el texto en español                                                                       |
| `en.ts`         | Lo mismo en inglés                                                                             |
| `tipos.ts`      | La interfaz que ambos idiomas deben cumplir. **No se edita al cambiar textos**                 |

La regla para saber dónde va algo: *si traducirlo produce un dato falso o un
nombre que nadie usa, va en `comun.ts`*. «Pontificia Universidad Católica de
Valparaíso» no se traduce; «Auditorio de la Sede PUCV Santiago» sí.

### Al corregir textos, tocar los dos idiomas

Dos redes de seguridad, y conviene saber qué cubre cada una:

- **Si falta una clave en un idioma, el proyecto no compila.** `astro check`
  falla indicando cuál. Esto pasa al añadir contenido nuevo.
- **Si la clave está pero con el texto sin traducir, TypeScript no lo ve**: la
  clave existe y su tipo es `string`. Para eso está `npm run verify:idioma`, que
  compara las dos páginas generadas y avisa de textos idénticos sin
  justificación. **Es la comprobación que importa cuando lleguen correcciones
  tras la revisión.**

Si se cambia el título o la fecha, regenerar las imágenes para compartir con
`npm run og`: llevan ese texto dentro y no se actualizan solas.

### Publicar el programa

La sección «Programa» funciona sola. Mientras `program.days` esté vacío muestra
el aviso *«Programa preliminar próximamente disponible»*. Al agregar jornadas,
la agenda reemplaza el aviso automáticamente:

```ts
program: {
  // ...
  days: [
    {
      date: '21 de octubre de 2026',
      label: 'Primera jornada',
      sessions: [
        { time: '09:00', title: 'Registro y bienvenida' },
        { time: '09:30', title: 'Título de la charla', speaker: 'Gil Zussman — Columbia University' },
      ],
    },
  ],
}
```

## Pendientes antes de publicar

1. **Logos oficiales.** Los archivos de `public/logos/` son marcadores de
   posición. Ver [`public/logos/README.md`](public/logos/README.md) para el
   detalle de cada archivo y los requisitos de formato.
2. **Afiliación de Rodolfo Feick**, hoy «Afiliación por confirmar» en
   `src/data/comun.ts`.
3. **Correo de contacto.** `seminario.wireless@pucv.cl` es un valor de ejemplo;
   reemplazar por la casilla institucional real.
4. **Dominio.** Ajustar `site` en `astro.config.mjs` al dominio definitivo: de
   él dependen el sitemap, los `hreflang` y las URLs de las imágenes para
   compartir. Después, regenerar con `npm run og`.
5. **Programa.** `program.days` está vacío en ambos idiomas y la sección muestra
   el aviso provisional. Poblarlo también desbloquea tres interacciones de RF-6
   que hoy no se pueden implementar por falta de contenido.
6. **Validar los datos estructurados** en <https://validator.schema.org> y ver
   la previsualización real del enlace. Requiere el sitio publicado o pegar a
   mano el bloque `application/ld+json` de cada página.

## Despliegue

`npm run build` produce `dist/`, una carpeta de archivos estáticos que sirve
cualquier hosting. No requiere Node.js en el servidor.

El sitio se publica en **Cloudflare Pages**.

### Conectar el repositorio

En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**,
autorizar el repositorio y completar:

| Campo             | Valor           |
| ----------------- | --------------- |
| Comando de build  | `npm run build` |
| Carpeta de salida | `dist`          |
| Versión de Node   | 20 o superior   |

No hacen falta variables de entorno para empezar: Cloudflare define
`CF_PAGES_URL` automáticamente y el sitio se configura con su propia URL.

Cada rama genera su propia URL de previsualización, así que se pueden mostrar
avances sin alterar la versión que ya se envió a revisión.

### Dominio propio

Cloudflare Pages no cobra por dominios propios ni por el certificado TLS, y
admite varios por proyecto. Lo que hay que tener es control del dominio.

**Opción recomendada: un subdominio de `pucv.cl`** (por ejemplo
`seminario-wireless.pucv.cl`). No tiene costo, aporta la credibilidad del
dominio institucional y **no exige mover el DNS de `pucv.cl` a Cloudflare**: la
DTI solo agrega un registro CNAME.

El orden importa, y equivocarlo es la causa habitual de un error 522:

1. Primero, en el proyecto de Pages: **Custom domains → Set up a custom
   domain**, e ingresar el subdominio.
2. Después, pedir a la DTI de la PUCV que cree el CNAME.

Texto listo para enviar a la DTI:

```
Solicito crear un registro DNS para el sitio del seminario internacional
"Beyond Connectivity" (proyecto ANID FOVI250222), organizado por la Escuela
de Ingeniería Eléctrica.

Tipo:   CNAME
Nombre: seminario-wireless
Valor:  <nombre-del-proyecto>.pages.dev
TTL:    automático o 3600

El sitio está alojado en Cloudflare Pages. El certificado TLS lo emite
Cloudflare automáticamente; no se requiere ninguna acción adicional.
```

**Alternativa: dominio propio.** Un `.cl` en NIC Chile cuesta del orden de
$9.990 CLP + IVA al año, con descuentos por períodos de varios años. Detalle a
considerar: para usar el dominio raíz (`beyondconnectivity.cl`) hay que apuntar
los nameservers del dominio a Cloudflare, porque un CNAME no puede vivir en la
raíz de la zona. Con un subdominio (`www.` o cualquier otro) basta el CNAME
desde cualquier proveedor de DNS.

**Mientras tanto:** la URL `<nombre-del-proyecto>.pages.dev` funciona desde el
primer despliegue y sirve perfectamente para la revisión con la contraparte.

Al pasar al dominio definitivo, actualizar `PRODUCTION_SITE` en
`astro.config.mjs` (o definir `SITE_URL` en el panel). El `noindex` de las URLs
provisionales desaparece solo. Ojo: `seminario-wireless.pucv.cl` es un nombre
supuesto; hay que confirmarlo con la DTI antes de darlo por definitivo.

### Dominio y URLs absolutas

`site` en `astro.config.mjs` se resuelve desde el entorno, en este orden:

1. `SITE_URL` — anulación manual.
2. `CF_PAGES_URL` — la define Cloudflare Pages.
3. `DEPLOY_PRIME_URL` / `URL` — las define Netlify.
4. `PRODUCTION_SITE` como respaldo (`https://seminario-wireless.pucv.cl`).

De ahí salen el enlace canónico, el sitemap y las URLs de Open Graph. Gracias a
esto un despliegue de previsualización se anuncia con su propia URL en lugar de
apuntar a un dominio que todavía no existe.

Mientras el sitio no esté en el dominio institucional, emite
`<meta name="robots" content="noindex, nofollow">` para que la copia de revisión
no compita con el dominio definitivo por el mismo contenido. Al publicar en el
dominio real, ese `noindex` desaparece solo.

**Cuando el dominio esté listo:** apuntar el DNS al hosting y actualizar
`PRODUCTION_SITE` en `astro.config.mjs` (o definir `SITE_URL` en el panel).

### Por qué Cloudflare Pages

Ancho de banda y peticiones ilimitados en el plan gratuito, 500 compilaciones al
mes, dominios propios y certificado TLS sin costo, y **uso comercial permitido**
en el plan gratuito.

Se descartó el plan Hobby de Vercel porque prohíbe los despliegues destinados al
beneficio económico de cualquier persona involucrada en la producción del
proyecto —incluido un consultor pagado que escriba el código— y permite darlos
de baja sin aviso previo. Netlify sí permite uso comercial y era una alternativa
válida, con un límite de 100 GB de ancho de banda al mes.

### Subdirectorio

Si en lugar de un subdominio se publica bajo una ruta (por ejemplo
`pucv.cl/seminario/`), agregar `base: '/seminario'` en `astro.config.mjs`.

### Cabeceras HTTP

`public/_headers` define caché y cabeceras de seguridad en el formato que leen
tanto Cloudflare Pages como Netlify. Los archivos de `/_astro` llevan hash en el
nombre y se cachean de forma indefinida; el HTML se revalida siempre, para que
una corrección de contenido se vea al instante.

## Estructura

```
src/
├── data/                        # ← todo el contenido editable
│   ├── comun.ts                 #   lo que no se traduce
│   ├── es.ts · en.ts            #   el texto de cada idioma
│   ├── tipos.ts                 #   la interfaz que ambos deben cumplir
│   └── contenido.ts             #   los combina; es lo que reciben los componentes
├── layouts/BaseLayout.astro     # <head>, SEO, hreflang, datos estructurados
├── pages/
│   ├── index.astro              #   español, en la raíz
│   ├── en/index.astro           #   inglés
│   └── og/es.astro · en.astro   #   lienzos de las imágenes para compartir
├── components/
│   ├── PaginaSeminario.astro    # la página entera; las rutas solo eligen idioma
│   ├── PropagationFigure.astro  # gráfica de propagación y detección (SVG propio)
│   ├── CollaborationNetwork.astro # red internacional, Astro puro sin hidratar
│   ├── CartelOg.astro           # el cartel de 1200×630 que se captura
│   ├── LanguageSelector.astro   # cambio de idioma, patrón USWDS de dos idiomas
│   ├── ThemeSelector.astro      # tres estados con radios nativos, 0 kB
│   ├── ProgramPending.astro     # estado provisional del programa
│   ├── Hero.astro, SiteHeader.astro, SiteFooter.astro
│   ├── Section.astro, SpeakerCard.astro, LogoWall.astro
│   ├── VenueLocator.astro       # panel de la sede con mapa bajo demanda
│   └── ui/                      # vacío: base de shadcn/ui montada, sin componentes
├── lib/utils.ts                 # helper `cn`, convención de shadcn/ui
├── styles/global.css            # sistema de diseño en tres capas de tokens
└── assets/fonts/                # fuentes auto-hospedadas

scripts/                         # los siete verificadores y el generador de imágenes
public/og/                       # imágenes para compartir, versionadas
```

## Notas de diseño

- **Tono.** Registro institucional: tipografía sólida sin degradados, paleta
  monocroma cian sobre azul profundo, esquinas poco redondeadas y acentos
  apagados. Sin degradados de arcoíris, brillos ni carruseles.
- **El movimiento representa el tema, no la interfaz.** Toda la animación tiene
  correlato físico con la materia del seminario:
  - Los frentes de onda se atenúan con la distancia, como la caída de potencia
    con el rango.
  - La nube de ecos se ilumina **por orden de distancia al emisor**: el retardo
    de cada punto se calcula con su distancia real (`echoDelay` en
    `PropagationFigure.astro`), imitando el barrido de rango de un receptor.
  - El barrido de radar recorre el sector en 17 s, con el ritmo de un
    instrumento y no de una interfaz.
  - Los haces de la red de colaboración representan transmisiones entre
    instituciones.
  No hay animaciones activadas por el cursor ni efectos decorativos de hover.
- **Gráfica principal.** `PropagationFigure.astro` es un SVG propio: un emisor
  sobre una retícula polar de radar, frentes de onda que se atenúan con la
  distancia, un objeto dispersor y la nube de puntos reconstruida a partir de
  los ecos. Se hizo a medida en lugar de usar una foto de antenas porque
  representa el tema real del seminario, pesa unos pocos kB y escala sin
  pérdida en cualquier pantalla.
- **Accesibilidad.** Contraste alto sobre fondo oscuro, enlace de salto al
  contenido, foco visible, la figura descrita con `<title>`/`<desc>`, y todas
  las animaciones anuladas si el sistema declara `prefers-reduced-motion`. Ojo:
  los componentes de Magic UI **no** respetan esa preferencia por sí solos
  cuando animan desde JavaScript, así que la red de colaboración consulta
  `useReducedMotion` y detiene el haz explícitamente.
- **Privacidad.** Sin analítica, sin fuentes remotas y sin cookies. El mapa de
  la sede solo se solicita a OpenStreetMap si la persona pulsa el botón.
- **Idioma.** Interfaz en español y título oficial en inglés, según lo pedido.
  Si más adelante se necesita una versión completa en inglés, Astro resuelve
  esto con enrutamiento i18n y un segundo archivo de datos.
