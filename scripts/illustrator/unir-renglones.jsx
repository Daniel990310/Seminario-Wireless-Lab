/*
 * Une en un solo marco de texto cada renglón que Illustrator importó letra por letra.
 *
 * Al abrir el PDF de Chromium, Illustrator crea un marco por carácter —espacios incluidos—:
 * 405 de 412 marcos en `es-carrusel-1` (medido el 2026-10-02). Así no se puede editar una
 * frase. Aquí se agrupan los marcos que comparten grupo y línea base, se ordenan por x y se
 * reemplazan por un marco que conserva fuente, cuerpo y color de cada letra.
 *
 * Geometría medida en esa importación: sin matriz de transformación, y el borde derecho de
 * `geometricBounds` es el avance de la letra. El hueco entre una letra y la siguiente es,
 * entonces, el espaciado entre letras del cartel; su mediana se vuelve `tracking`. Después
 * se corrige el `tracking` para que el renglón mida lo mismo que medía, y el error que queda
 * se informa.
 *
 * Un hueco de más de un cuerpo separa dos textos que solo comparten línea base, como
 * «ORGANIZA» y «FINANCIAN» en la franja de marcas.
 *
 * ExtendScript es ES3. Se carga con `#include` desde `abrir-flyer.jsx`.
 */
function unirRenglones(doc) {
  var marcos = [];
  var padres = [];
  for (var i = 0; i < doc.textFrames.length; i++) {
    var t = doc.textFrames[i];
    if (t.kind !== TextType.POINTTEXT || t.contents.length === 0) continue;
    var p = -1;
    for (var j = 0; j < padres.length; j++) if (padres[j] === t.parent) { p = j; break; }
    if (p < 0) { padres.push(t.parent); p = padres.length - 1; }
    marcos.push({
      t: t, x: t.anchor[0], y: t.anchor[1], der: t.geometricBounds[2],
      cuerpo: t.textRange.characterAttributes.size, clave: p + '|' + Math.round(t.anchor[1] * 4)
    });
  }

  var lineas = {};
  var claves = [];
  for (var k = 0; k < marcos.length; k++) {
    var c = marcos[k].clave;
    if (!lineas[c]) { lineas[c] = []; claves.push(c); }
    lineas[c].push(marcos[k]);
  }

  var renglones = 0;
  var peor = 0;
  for (var n = 0; n < claves.length; n++) {
    var linea = lineas[claves[n]];
    linea.sort(function (a, b) { return a.x - b.x; });
    var tramo = [linea[0]];
    for (var m = 1; m <= linea.length; m++) {
      var sigue = m < linea.length && linea[m].x - linea[m - 1].der <= linea[m - 1].cuerpo;
      if (sigue) { tramo.push(linea[m]); continue; }
      if (tramo.length > 1) {
        var error = unirTramo(tramo, padres[parseInt(claves[n], 10)]);
        if (error > peor) peor = error;
        renglones++;
      }
      if (m < linea.length) tramo = [linea[m]];
    }
  }
  return { renglones: renglones, marcos: doc.textFrames.length, errorMaximo: peor };
}

function mediana(v) {
  if (!v.length) return 0;
  v.sort(function (a, b) { return a - b; });
  return v[Math.floor(v.length / 2)];
}

/* Devuelve, en puntos, cuánto difiere el ancho del renglón nuevo del original. */
function unirTramo(tramo, padre) {
  var huecos = [];
  for (var i = 1; i < tramo.length; i++) huecos.push(tramo[i].x - tramo[i - 1].der);
  var espaciado = mediana(huecos);

  var texto = '';
  for (var j = 0; j < tramo.length; j++) texto += tramo[j].t.contents;
  var nuevo = padre.textFrames.add();
  nuevo.contents = texto;

  var letras = nuevo.textRange.characters;
  var pos = 0;
  for (var a = 0; a < tramo.length; a++) {
    var origen = tramo[a].t.textRange.characters;
    for (var b = 0; b < origen.length; b++, pos++) {
      var de = origen[b].characterAttributes;
      var hacia = letras[pos].characterAttributes;
      hacia.textFont = de.textFont;
      hacia.size = de.size;
      hacia.fillColor = de.fillColor;
      hacia.tracking = Math.round(espaciado / de.size * 1000);
    }
  }

  var primero = tramo[0];
  var ancho = tramo[tramo.length - 1].der - primero.x;
  var medido = nuevo.geometricBounds[2] - nuevo.geometricBounds[0];
  if (letras.length > 1) {
    var ajuste = (ancho - medido) / (letras.length - 1);
    for (var q = 0; q < letras.length; q++) {
      var at = letras[q].characterAttributes;
      at.tracking = Math.round(at.tracking + ajuste / at.size * 1000);
    }
    medido = nuevo.geometricBounds[2] - nuevo.geometricBounds[0];
  }
  nuevo.translate(primero.x - nuevo.anchor[0], primero.y - nuevo.anchor[1]);
  nuevo.move(primero.t, ElementPlacement.PLACEBEFORE);
  for (var r = 0; r < tramo.length; r++) tramo[r].t.remove();
  return Math.abs(ancho - medido);
}
