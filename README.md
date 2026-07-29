# Beyond Connectivity — Sitio del seminario

Sitio web del seminario internacional **Beyond Connectivity: Wireless Sensing in
mmWave and Sub-THz Bands**, organizado por la Escuela de Ingeniería Eléctrica de
la Pontificia Universidad Católica de Valparaíso.

21 y 22 de octubre de 2026 · Auditorio de la Sede PUCV Santiago.

## Stack

| Pieza        | Elección                               | Por qué                                                                                     |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| Framework    | [Astro](https://astro.build) 7         | Sitio de contenido: genera HTML estático y envía casi nada de JavaScript.                    |
| Estilos      | Tailwind CSS 4                         | Sistema de diseño en un solo lugar (`src/styles/global.css`), sin CSS muerto en producción.   |
| Componentes  | [Magic UI](https://magicui.design) (MIT) | Solo dos componentes, copiados al repo en `src/components/ui`. Ver más abajo.               |
| Tipografía   | Space Grotesk · Inter · JetBrains Mono | Auto-hospedadas: sin peticiones a Google Fonts.                                              |
| Verificación | `astro check` (TypeScript strict)      | Errores de tipo detectados antes del despliegue.                                             |

### Sobre Magic UI

Se evaluaron **shadcn/ui + Radix**, **Aceternity UI** y **Magic UI**. Se eligió
Magic UI porque parte de su vocabulario de componentes coincide con el tema del
seminario: haces que recorren un trayecto, frentes de onda concéntricos, nodos
enlazados. shadcn/ui + Radix resuelve accesibilidad e interacción, pero este
sitio casi no tiene widgets interactivos; sería la elección correcta si hubiera
formularios de inscripción. Aceternity aporta efectos de mucho impacto
(auroras, meteoritos, tarjetas 3D) que leen como landing de producto, un
registro equivocado para un evento académico.

De Magic UI se conservan **dos** componentes, los que tienen correlato con la
materia del seminario:

- `AnimatedBeam` — los enlaces de la red de colaboración internacional.
- `Ripple` — frentes de onda concéntricos.

Se descartaron a propósito `MagicCard` (halo que sigue al cursor), `BorderBeam`,
`AuroraText`, `AnimatedShinyText`, `Marquee` y `Particles`: son efectos de
interfaz, no del tema, y su tono no corresponde a una conferencia científica.

Los componentes están **copiados al repositorio**, no instalados como
dependencia. Se pueden editar libremente y no hay riesgo de que una
actualización cambie el diseño. Se documentan en el código las adaptaciones
respecto del original (por ejemplo, `magic-card` importaba `next-themes`, que es
de Next.js).

React entra solo como capa de renderizado. La mayoría de los componentes se
renderiza en el servidor **sin** directiva `client:*`, así que no envían
JavaScript; sus animaciones son CSS. La única isla hidratada es la red de
colaboración, porque `AnimatedBeam` mide la posición real de cada nodo en el DOM
para trazar las curvas. Ese es el costo: unos 110 kB comprimidos de React +
Motion para esa sección. Si se prefiere un sitio de cero JavaScript, el mismo
efecto se puede reescribir con SVG y `stroke-dashoffset`, quitando React del
proyecto.

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo en localhost:4321
npm run build      # generar el sitio estático en dist/
npm run preview    # previsualizar lo generado
npm run check      # verificación de tipos
```

## Cómo editar el contenido

**Todo el contenido vive en `src/data/seminar.ts`.** No hace falta tocar el
marcado ni los estilos para actualizar la web.

| Qué cambiar                     | Dónde                                          |
| ------------------------------- | ---------------------------------------------- |
| Título, subtítulo, fechas, sede | `seminar.title`, `dates`, `venue`              |
| Expositores                     | `seminar.speakers.international` / `.national`  |
| Instituciones y financiamiento  | `seminar.organizers`, `participants`, `funding` |
| Texto de presentación y temas   | `seminar.about`, `seminar.topics`               |
| Correo de contacto              | `seminar.contact.email`                         |

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
2. **Afiliación de Rodolfo Feick**, hoy indicada como «Afiliación por
   confirmar» en `src/data/seminar.ts`.
3. **Correo de contacto.** `seminario.wireless@pucv.cl` es un valor de ejemplo;
   reemplazar por la casilla institucional real.
4. **Dominio.** Ajustar `site` en `astro.config.mjs` al dominio definitivo: de
   él dependen el sitemap y las URLs de Open Graph que se ven al compartir el
   enlace.
5. **Imagen para compartir.** Falta un `og:image` (1200×630 px). Sin ella, al
   compartir en redes o WhatsApp se muestra solo texto.

## Despliegue

`npm run build` produce `dist/`, una carpeta de archivos estáticos que sirve
cualquier hosting. No requiere Node.js en el servidor.

### Configuración del hosting

| Campo               | Valor           |
| ------------------- | --------------- |
| Comando de build    | `npm run build` |
| Carpeta de salida   | `dist`          |
| Versión de Node     | 20 o superior   |

No hacen falta variables de entorno para empezar.

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

### Sobre el plan gratuito

Cloudflare Pages y Netlify permiten uso comercial en sus planes gratuitos. El
plan Hobby de Vercel **no**: prohíbe los despliegues destinados al beneficio
económico de cualquier persona involucrada en la producción del proyecto,
incluido un consultor pagado que escriba el código, y permite dar de baja esos
despliegues sin aviso previo. Para trabajo facturado en Vercel hace falta el
plan Pro.

### Subdirectorio

Si se publica bajo una ruta (por ejemplo `pucv.cl/seminario/`), agregar
`base: '/seminario'` en `astro.config.mjs`.

### Cabeceras HTTP

`public/_headers` define caché y cabeceras de seguridad en el formato que leen
tanto Cloudflare Pages como Netlify. Los archivos de `/_astro` llevan hash en el
nombre y se cachean de forma indefinida; el HTML se revalida siempre, para que
una corrección de contenido se vea al instante.

## Estructura

```
src/
├── data/seminar.ts          # ← todo el contenido editable
├── layouts/BaseLayout.astro # <head>, SEO, datos estructurados del evento
├── pages/index.astro        # composición de las secciones
├── components/
│   ├── PropagationFigure.astro  # gráfica de propagación y detección (SVG propio)
│   ├── CollaborationNetwork.tsx # red internacional (isla React con AnimatedBeam)
│   ├── ProgramPending.astro     # estado provisional del programa
│   ├── Hero.astro, SiteHeader.astro, SiteFooter.astro
│   ├── Section.astro, SpeakerCard.astro, LogoWall.astro
│   ├── VenueLocator.astro       # panel de la sede con mapa bajo demanda
│   └── ui/                      # componentes de Magic UI copiados (MIT)
├── lib/utils.ts             # helper `cn`, convención de shadcn/ui
├── styles/global.css        # sistema de diseño (colores, tipografía, keyframes)
└── assets/fonts/            # fuentes auto-hospedadas
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
