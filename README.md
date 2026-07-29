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
| Tipografía   | Space Grotesk · Inter · JetBrains Mono | Auto-hospedadas: sin peticiones a Google Fonts.                                              |
| Verificación | `astro check` (TypeScript strict)      | Errores de tipo detectados antes del despliegue.                                             |

El resultado es una única página estática, sin JavaScript de framework en el
cliente: solo tres scripts propios de pocas líneas (barra de navegación,
aparición al hacer scroll y carga del mapa).

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
cualquier hosting: Netlify, Cloudflare Pages, Vercel, GitHub Pages o un
servidor Apache/nginx de la universidad. No requiere Node.js en el servidor.

Si se publica en un subdirectorio (por ejemplo `pucv.cl/seminario/`), agregar
`base: '/seminario'` en `astro.config.mjs`.

## Estructura

```
src/
├── data/seminar.ts          # ← todo el contenido editable
├── layouts/BaseLayout.astro # <head>, SEO, datos estructurados del evento
├── pages/index.astro        # composición de las secciones
├── components/
│   ├── PropagationFigure.astro  # gráfica de propagación y detección (SVG propio)
│   ├── Hero.astro, SiteHeader.astro, SiteFooter.astro
│   ├── Section.astro, SpeakerCard.astro, LogoWall.astro
│   └── VenueLocator.astro       # panel de la sede con mapa bajo demanda
├── styles/global.css        # sistema de diseño (colores, tipografía, utilidades)
└── assets/fonts/            # fuentes auto-hospedadas
```

## Notas de diseño

- **Gráfica principal.** `PropagationFigure.astro` es un SVG propio: un emisor
  sobre una retícula polar de radar, frentes de onda que se atenúan con la
  distancia, un objeto dispersor y la nube de puntos reconstruida a partir de
  los ecos. Se hizo a medida en lugar de usar una foto de antenas porque
  representa el tema real del seminario, pesa unos pocos kB y escala sin
  pérdida en cualquier pantalla.
- **Accesibilidad.** Contraste alto sobre fondo oscuro, enlace de salto al
  contenido, foco visible, la figura descrita con `<title>`/`<desc>`, y todas
  las animaciones anuladas si el sistema declara `prefers-reduced-motion`.
- **Privacidad.** Sin analítica, sin fuentes remotas y sin cookies. El mapa de
  la sede solo se solicita a OpenStreetMap si la persona pulsa el botón.
- **Idioma.** Interfaz en español y título oficial en inglés, según lo pedido.
  Si más adelante se necesita una versión completa en inglés, Astro resuelve
  esto con enrutamiento i18n y un segundo archivo de datos.
