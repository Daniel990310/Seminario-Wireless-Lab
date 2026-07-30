# Verificación

Generado por `npm run verify`. **No editar a mano**: se sobrescribe en cada corrida.

**Fecha:** 2026-07-30 · **Commit:** `1c4fa86`
**Resultado:** **presupuestos incumplidos**

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
| RNF-1.3 | Nodos con contraste indeterminado | 28 | 104 | 0 | **incumple** |
| RNF-1.4 | Secciones sin nombre accesible | 7 | 7 | 0 | **incumple** |
| RNF-1.5 | Saltos de nivel en encabezados | 0 | 0 | 0 | cumple |
| RNF-2.1 | JavaScript comprimido | 109.3 kB | 0.0 kB | 115.0 kB | cumple |
| RNF-2.2 | Primera carga comprimida | 241.2 kB | 136.1 kB | 260.0 kB | cumple |
| RNF-2.6 | Tipografías | 110.9 kB | 122.6 kB | 125.0 kB | cumple |

En RNF-1.1 y RNF-1.3 la columna «Actual» **suma todas las corridas**, mientras que
la línea base se midió solo en escritorio. Para compararlas de igual a igual, ver
el desglose por corrida más abajo.

## Desglose de peso

| Recurso | Comprimido |
| ------- | ---------- |
| JavaScript | 0.0 kB |
| Tipografías | 122.6 kB |
| HTML (incluye los scripts en línea) | 13.5 kB |
| CSS | 0.0 kB |
| Imágenes SVG | 3.3 kB |
| **Primera carga** | **136.1 kB** |

Solo se cuenta lo que la página referencia. Archivos generados que **ningún archivo
de `dist` menciona**, y que por tanto ningún navegador descarga:

| Archivo huérfano | Comprimido |
| ---------------- | ---------- |
| `_astro\client.D9vVWfjN.js` | 59536 B |
| `_astro\index.C2M3icnH.css` | 11991 B |

Total huérfano: 71.5 kB.

## Por corrida

Los totales de la tabla anterior suman todas las corridas. Este desglose evita
leer un total como si fuera un valor por pantalla.

| Pantalla / tema | Hallazgos | Indeterminados |
| --------------- | --------- | -------------- |
| escritorio / light | 0 | 30 |
| escritorio / dark | 0 | 30 |
| movil / light | 0 | 22 |
| movil / dark | 0 | 22 |

## Cobertura

| Dato | Valor |
| ---- | ----- |
| Páginas auditadas | `/` |
| Corridas | 4 |
| Temas distinguibles | sí |
| Secciones | 7 |
| Encabezados | 24 |
| Idioma declarado | `es` |

## Nodos indeterminados

axe no pudo calcular el contraste en **104** nodos. Ocurre
cuando el texto se superpone a un fondo no uniforme. **No son aprobaciones**:
RNF-1.3 exige resolverlos, midiendo un ratio que cumpla o eliminando la
superposición.
