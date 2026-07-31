# Verificación

Generado por `npm run verify`. **No editar a mano**: se sobrescribe en cada corrida.

**Fecha:** 2026-07-31 · **Commit:** `3fe4c74`
**Resultado:** todos los presupuestos cumplidos

Método: axe-core sobre el build servido localmente, en 1440×900 y 390×844,
con `prefers-reduced-motion: reduce` y **transiciones anuladas antes de medir**
(ver la nota metodológica de [la línea base](../baseline/auditoria-2026-07-29.md)).
Peso medido con gzip nivel 9 sobre `dist/` en **kB decimal (1 kB = 1000 bytes)**;
los woff2 se cuentan tal cual porque ya vienen comprimidos. La primera carga
excluye los logos, que son diferidos, y el mapa, que se pide a petición.

Nota: este script comprime con `zlib` de Node y la línea base usó `gzip -9` de
GNU. Las dos implementaciones difieren en torno al 0,3 %, así que una variación
de ese orden respecto de la línea base no indica un cambio real.

## Presupuestos

| Requisito | Comprobación | Línea base | Actual | Límite | Estado |
| --------- | ------------ | ---------- | ------ | ------ | ------ |
| RNF-1.1 | Hallazgos axe WCAG 2.1 AA | 16 | 0 | 0 | cumple |
| RNF-1.3 | Nodos con contraste indeterminado | 28 | 0 | 0 | cumple |
| RNF-1.4 | Secciones sin nombre accesible | 7 | 0 | 0 | cumple |
| RNF-1.5 | Saltos de nivel en encabezados | 0 | 0 | 0 | cumple |
| RNF-2.1 | JavaScript comprimido | 109.3 kB | 1.4 kB | 115.0 kB | cumple |
| RNF-2.2 | Primera carga comprimida | 241.2 kB | 140.7 kB | 260.0 kB | cumple |
| RNF-2.6 | Tipografías | 110.9 kB | 122.6 kB | 125.0 kB | cumple |

En RNF-1.1 y RNF-1.3 la columna «Actual» **suma todas las corridas**, mientras que
la línea base se midió solo en escritorio. Para compararlas de igual a igual, ver
el desglose por corrida más abajo.

## Desglose de peso

| Recurso | Comprimido |
| ------- | ---------- |
| JavaScript en archivos `.js` | 0.0 kB |
| JavaScript en línea, dentro del HTML | 1.4 kB |
| JavaScript total (RNF-2.1) | 1.4 kB |
| Tipografías | 122.6 kB |
| HTML (incluye el CSS y los scripts en línea) | 18.1 kB |
| CSS | 0.0 kB |
| Imágenes SVG | 3.3 kB |
| **Primera carga** | **140.7 kB** |

Solo se cuenta lo que la página referencia. Archivos generados que **ningún archivo
de `dist` menciona**, y que por tanto ningún navegador descarga:

| Archivo huérfano | Comprimido |
| ---------------- | ---------- |
| `_astro\client.D9vVWfjN.js` | 59536 B |
| `_astro\PropagationFigure.DHFzmLjD.css` | 11759 B |

Total huérfano: 71.3 kB.

## Por corrida

Los totales de la tabla anterior suman todas las corridas. Este desglose evita
leer un total como si fuera un valor por pantalla.

| Pantalla / tema | Hallazgos | Indeterminados |
| --------------- | --------- | -------------- |
| escritorio / light | 0 | 0 |
| escritorio / dark | 0 | 0 |
| movil / light | 0 | 0 |
| movil / dark | 0 | 0 |
| escritorio / light | 0 | 0 |
| escritorio / dark | 0 | 0 |
| movil / light | 0 | 0 |
| movil / dark | 0 | 0 |

## Cobertura

| Dato | Valor |
| ---- | ----- |
| Páginas auditadas | `/en\`, `/` |
| Corridas | 8 |
| Temas distinguibles | sí |
| Secciones | 7 |
| Encabezados | 24 |
| Idioma declarado | `en` |
