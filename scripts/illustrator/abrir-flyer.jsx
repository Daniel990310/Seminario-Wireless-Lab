/*
 * Abre un PDF de `difusion/flyer/`, informa si el texto llegó vivo y lo guarda como .ai.
 *
 * Lo ejecuta `abrir-flyer.ps1` por COM (`DoJavaScript`), que le pasa la ruta del PDF
 * como primer argumento y antepone `unir-renglones.jsx`: con `DoJavaScript` el script
 * llega como texto y un `#include` relativo no tiene desde dónde resolverse. ExtendScript
 * es ES3: nada de `let`, flechas ni `JSON`.
 *
 * Devuelve una línea: `marcos=<n> renglones=<n> error=<pt> fuentes=<lista>`. Si
 * Illustrator no encuentra una fuente, la sustituye y su nombre aparece aquí en lugar del
 * de la familia del sitio; eso es lo que hay que mirar.
 */
var rutaPdf = arguments[0];
app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

var doc = app.open(new File(rutaPdf));
var union = unirRenglones(doc);
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
var rutaAi = rutaPdf.replace(/\.pdf$/i, '.ai');
doc.saveAs(new File(rutaAi), new IllustratorSaveOptions());
/*
 * Se cierra al guardar: abrir las cuatro piezas en cada corrida dejó nueve documentos
 * abiertos a la vez y la máquina se puso lenta (2026-10-01). Para retocar se abre el .ai.
 */
doc.close(SaveOptions.DONOTSAVECHANGES);
app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

'marcos=' + marcos + ' renglones=' + union.renglones + ' error=' + union.errorMaximo.toFixed(2) +
  'pt fuentes=' + lista.join(',');
