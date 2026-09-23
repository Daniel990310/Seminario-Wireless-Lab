# Beyond Connectivity — versión 5.2

## Favicon 5.2: derivado del logo

Se reutilizan sin redibujar los trazados de las dos ondas exteriores del logo aprobado. Conservan su curvatura, extremos afinados y relación con el punto. Solo se omite la onda interior, se centra el conjunto y se refuerza el contorno 0,125 px por lado a tamaño de 16 px para mejorar la rasterización. El punto conserva su proporción original (2,375 px de diámetro a 16 px).

Comparación: `favicon-comparacion.png`. El ICO y los PNG de 16, 32 y 48 px corresponden a esta versión. El logo completo no cambia.

## Cambios

- Arcos redibujados como bandas elípticas con centro y proporción comunes. El grosor aumenta hacia el centro de cada banda y disminuye hacia sus extremos; los terminales tienen un redondeo leve.
- El objeto detectado conserva su posición dentro de la apertura exterior.
- Cobre oscuro para fondos claros; cobre claro para fondos oscuros.
- Descriptor «Wireless Sensing» ampliado y mínimos de uso revisados.
- Favicon con dos ondas dibujado específicamente para 16 px.
- Ejemplo HTML corregido para conservar la proporción.

## Elegir un archivo

| Uso | Archivo |
| --- | --- |
| Flyers y composiciones amplias | `logo-principal.svg` o su PNG transparente |
| Banner o formulario de registro | `logo-horizontal.svg` o su PNG transparente |
| Cabecera web, espacio estrecho | `logo-cabecera.svg` o su PNG transparente |
| Sobre fondo oscuro | Variantes terminadas en `-blanco` |
| Impresión a una tinta | Variantes terminadas en `-monocromo` |
| Símbolo independiente | `simbolo.svg` |
| Composición centrada | `logo-vertical.svg` |
| Perfil de redes | `avatar.png` (1080 × 1080) |
| Pestaña del navegador | `favicon.svg` o `favicon.ico` |
| Icono de aplicación / pantalla de inicio | `icono-app.svg`, `favicon-180.png`, `favicon-192.png`, `favicon-512.png` |
| Imagen del enlace compartido | `whatsapp-og.png` (1200 × 630) |
| Presentación de la propuesta | `vista-previa.png` |
| Comprobar exportaciones pequeñas | `verificacion.png` y `verificacion.json` |

Los SVG no contienen imágenes incrustadas ni requieren instalar fuentes. Las bandas y letras son trazados; el texto no se edita como una caja de texto. Tipografía: Atkinson Hyperlegible Next Semibold para el nombre y Medium para el descriptor.

## Tamaños y márgenes

- Principal con descriptor: desde **400 px de ancho**; descriptor de 12,31 px nominales.
- Horizontal con descriptor: desde **420 px de ancho**; descriptor de 12,54 px nominales.
- Vertical con descriptor: desde **360 px de ancho**; descriptor de 12 px nominales.
- Para cabeceras menores, usar el logo sin descriptor. Se comprobó la cabecera a 280 px de ancho.
- Símbolo completo: preferiblemente desde **32 px**. Para 16–24 px, usar la geometría simplificada de `favicon.svg`.
- Dejar margen libre alrededor, al menos equivalente al diámetro del punto.
- Mantener siempre la proporción. No estirar ni comprimir.

Estos mínimos son recomendaciones basadas en las exportaciones revisadas. La legibilidad final también depende de la pantalla, impresión y tamaño de visualización.

## Color

| Color | Valor | Aplicación |
| --- | --- | --- |
| Azul | `#1A3A5D` | Símbolo y nombre sobre claro; fondos oscuros |
| Cobre oscuro | `#A66A35` | Punto sobre blanco o azul muy claro |
| Cobre claro | `#DBAA77` | Punto sobre azul profundo |
| Azul muy claro | `#E9F0FA` | Fondo de apoyo |
| Tinta única | `#0B1827` | Versiones monocromáticas |

Contrastes calculados: cobre oscuro sobre blanco **4,44:1**, sobre azul muy claro **3,87:1**; cobre claro sobre azul **5,55:1**. No usar la variante oscura del punto sobre un fondo azul profundo: usar el archivo `-blanco` completo.

## Integración web

Copiar los archivos elegidos a una carpeta pública `/brand/`. En Astro, puede ser `public/brand/`.

```html
<!-- Dentro del head; actualizar las etiquetas existentes, sin duplicarlas. -->
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/brand/favicon-180.png" sizes="180x180">

<meta property="og:type" content="website">
<meta property="og:url" content="https://bcsensing.org/">
<meta property="og:title" content="Beyond Connectivity — Wireless Sensing">
<meta property="og:description" content="Seminario internacional sobre detección inalámbrica en mmWave y sub-THz. 21 y 22 de octubre de 2026, Santiago, Chile.">
<meta property="og:image" content="https://bcsensing.org/brand/whatsapp-og.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Beyond Connectivity: Wireless Sensing. 21–22 de octubre de 2026, Santiago, Chile.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://bcsensing.org/brand/whatsapp-og.png">

<!-- Cabecera azul: dimensión intrínseca correcta y altura automática. -->
<a href="/" aria-label="Beyond Connectivity — inicio">
  <img src="/brand/logo-cabecera-blanco.svg"
       alt="Beyond Connectivity"
       width="670" height="104"
       style="display:block;width:280px;max-width:100%;height:auto">
</a>
```

A 280 px de ancho la altura de esta cabecera es 43,46 px, conservando la relación del SVG. No fijar simultáneamente una altura de 48 px.

Para la vista previa del enlace usar el PNG público y su URL absoluta. El favicon no reemplaza la imagen Open Graph. Las plataformas pueden conservar imágenes anteriores en caché; comprobar el enlace después de publicar. En formularios que no aceptan SVG, usar los PNG.

## Verificación realizada

Se revisaron las composiciones claras y oscuras, monocromía, símbolo a varios tamaños, favicon nativo de 16 px y composiciones con descriptor a los mínimos indicados. Las pruebas se hicieron mediante rasterización local; no constituyen una prueba de impresión física ni un estudio de reconocimiento con público.

El ICO incluye las exportaciones específicas de 16, 32 y 48 px del favicon simplificado; los iconos de pantalla de inicio usan el símbolo completo.

La fecha queda fuera del logo reutilizable y solo aparece en la pieza para compartir el enlace. Los logotipos institucionales de PUCV, ANID y colaboradores se colocan por separado cuando corresponda.

Los archivos están listos para su incorporación. Esta entrega no modifica la página publicada.
