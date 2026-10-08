/*
 * Abre un PDF de `difusion/flyer/`, informa si el texto llegó vivo, lo ordena en capas y lo
 * guarda como .ai.
 *
 * Lo ejecuta `abrir-flyer.ps1` por COM (`DoJavaScript`) con cuatro argumentos: el PDF, su
 * mapa (`<pieza>.mapa.tsv`), la raíz del repositorio y una carpeta temporal. Antepone
 * `unir-renglones.jsx` y `estructurar.jsx`: con `DoJavaScript` el script llega como texto
 * y un `#include` relativo no tiene desde dónde resolverse. ExtendScript es ES3: nada de
 * `let`, flechas ni `JSON`.
 *
 * En la carpeta temporal deja dos PNG del lienzo, `<pieza>-antes.png` con los renglones ya
 * unidos y `<pieza>-despues.png` ya ordenado, para que `comparar-png.mjs` mida que ordenar
 * no movió nada.
 *
 * Devuelve una línea: `marcos=<n> renglones=<n> error=<pt> fondo=<n> parrafos=<n>/<n>
 * errorParrafo=<pt> logos=<n> fuentes=<lista>`. Si Illustrator no encuentra una fuente,
 * la sustituye y su nombre aparece aquí en lugar del de la familia del sitio; eso es lo
 * que hay que mirar.
 */
var rutaPdf = arguments[0];
var rutaMapa = arguments[1];
var raiz = arguments[2];
var temporal = arguments[3];
var pieza = File(rutaPdf).name.replace(/\.pdf$/i, '');
app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

/* El TSV de `mapaATsv` (`scripts/lib/mapa-flyer.mjs`): una fila por objeto. */
function leerMapa(ruta) {
  var f = new File(ruta);
  f.encoding = 'UTF-8';
  f.open('r');
  var filas = f.read().split(/\r?\n/);
  f.close();
  var mapa = [];
  for (var i = 0; i < filas.length; i++) {
    var c = filas[i].split('\t');
    if (c.length < 9) continue;
    mapa.push({
      tipo: c[0], nombre: c[1], caja: [+c[2], +c[3], +c[4], +c[5]],
      renglones: +c[6], alinear: c[7], texto: c[8].replace(/\\n/g, '\n')
    });
  }
  return mapa;
}

/* A 4/3: el PDF mide 0,75 pt por píxel y así el PNG sale del tamaño del cartel. */
function exportarPng(doc, ruta) {
  var o = new ExportOptionsPNG24();
  o.artBoardClipping = true;
  o.horizontalScale = 100 / 0.75;
  o.verticalScale = 100 / 0.75;
  o.antiAliasing = true;
  o.transparency = false;
  doc.exportFile(new File(ruta), ExportType.PNG24, o);
}

var mapa = leerMapa(rutaMapa);
var doc = app.open(new File(rutaPdf));
var union = unirRenglones(doc);
/* Después de unir: el error de la unión ya se informa aparte, en puntos. */
exportarPng(doc, temporal + '/' + pieza + '-antes.png');
var vistas = {};
var lista = [];
/* Letra por letra: tras unir, un renglón puede mezclar fuentes («Organiza:» y el nombre). */
for (var i = 0; i < doc.textFrames.length; i++) {
  var letras = doc.textFrames[i].textRange.characters;
  for (var j = 0; j < letras.length; j++) {
    var nombre = letras[j].characterAttributes.textFont.name;
    if (!vistas[nombre]) {
      vistas[nombre] = true;
      lista.push(nombre);
    }
  }
}

var marcos = doc.textFrames.length;
var orden = estructurar(doc, mapa, raiz);
exportarPng(doc, temporal + '/' + pieza + '-despues.png');
var rutaAi = rutaPdf.replace(/\.pdf$/i, '.ai');
doc.saveAs(new File(rutaAi), new IllustratorSaveOptions());
/*
 * Se cierra al guardar: abrir las cuatro piezas en cada corrida dejó nueve documentos
 * abiertos a la vez y la máquina se puso lenta (2026-10-01). Para retocar se abre el .ai.
 */
doc.close(SaveOptions.DONOTSAVECHANGES);
app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

'marcos=' + marcos + ' renglones=' + union.renglones + ' error=' + union.errorMaximo.toFixed(2) +
  'pt fondo=' + orden.fondo + ' parrafos=' + orden.convertidos + '/' + orden.parrafos +
  ' errorParrafo=' + orden.errorParrafo.toFixed(2) + 'pt logos=' + orden.logos +
  ' fuentes=' + lista.join(',');
