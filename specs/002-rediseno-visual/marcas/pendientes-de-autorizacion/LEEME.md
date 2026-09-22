# Marcas retiradas de `public/` a la espera de autorización

Movidas aquí el **2026-08-27**, justo antes de redesplegar. Son los archivos de UC y de
Nokia Bell Labs que hasta entonces vivían en `public/logos/`.

## Por qué no basta con quitarlos de la maqueta

El 2026-08-25 se dejó de **mostrar** estas marcas (RF-22), pero los archivos seguían en
`public/`, y **todo lo que hay en `public/` se copia a `dist/` y se publica**. O sea:
`https://…/logos/uc.svg` habría respondido 200 en el sitio en vivo, sin que ninguna página
lo enlazara.

Es una exposición mucho menor que enseñar la marca en la página, pero **es alojarla**. Y
el requisito no dice «no mostrar»: dice que una marca de tercero no se publica sin
autorización de su titular. Se detectó mirando `dist/logos/` antes de desplegar, no
razonando: el `dist` es el que dice qué se publica.

Los ráster —Columbia y USACH— no tenían este problema: viven en `src/assets/logos/` y
Astro **solo los emite si alguien los importa**. Al retirar el `import` dejaron de
emitirse. Comprobado en `dist/_astro/` `[medido: 2026-08-27]`.

## Qué hay aquí

| Archivo | Institución | Nota |
| ------- | ----------- | ---- |
| `uc.svg` | Pontificia Universidad Católica de Chile | Variante `LINEAL P2727` para fondo claro |
| `uc-oscuro.svg` | ídem | Variante `LINEAL BLANCO`. **Elegida por proporción, no por número**: el `-04` azul tiene proporción 2,56 y el `-04` blanco 3,87; el blanco equivalente es el `-03` |
| `nokia-bell-labs.svg` | Nokia Bell Labs | **Es el único ejemplar.** Lo instaló Daniel directamente en `public/logos/` y no está archivado en ningún otro sitio: por eso se movió y no se borró |

Los originales del paquete oficial de la UC están al lado, en [`../uc/`](../uc/).

## Cómo reponer una marca cuando llegue su autorización

1. Copiar el archivo de vuelta a `public/logos/` **conservando el nombre**.
2. Reponer su línea `logo:` —y `logoOscuro:` si la tiene— en `src/data/comun.ts`.
3. Anotar en `../README.md` quién autorizó, cuándo y con qué alcance.
4. `npm run verify:todo` y revisión visual en los dos temas.

## Y una comprobación que conviene no perder

**Antes de desplegar, mirar qué hay en `dist/`, no qué referencia el HTML.** Son dos
preguntas distintas y esta carpeta existe porque se confundieron. En la misma revisión
apareció que `public/logos/README.md` se servía en `https://…/logos/README.md` con
**200** `[medido: 2026-08-27]`: documentación interna del proyecto —rutas, decisiones y
qué instituciones no han autorizado su marca— publicada en el sitio de la Universidad.
Está movida a [`../logos-en-public.md`](../logos-en-public.md). **Nada que no sea el sitio
va en `public/`.**
