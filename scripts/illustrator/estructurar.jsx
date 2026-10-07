/*
 * Ordena en capas y grupos con nombre lo que Illustrator importó del PDF de un cartel.
 *
 * Al abrir el PDF de Chromium todo queda en una capa, dentro de grupos con máscara de
 * recorte anidados hasta cinco niveles, y cada logo es un puñado de trazados sueltos
 * (medido en `es-unica` el 2026-10-07: 15 grupos, 14 con máscara, 183 trazados
 * compuestos). Mover o escalar un logo exigía bucear en esos grupos. Aquí:
 *
 *   1. Se sueltan las máscaras que no recortan nada (rectángulos que contienen a su
 *      contenido, o la página entera) y los grupos sin transparencia. Las que sí recortan,
 *      como el círculo de un retrato, se quedan: son la forma del objeto.
 *   2. Cada objeto del mapa (`<pieza>.mapa.tsv`, de `scripts/lib/mapa-flyer.mjs`) se
 *      vuelve un grupo con nombre en su capa: Texto, Logos, QR, Fotos. La figura y lo que
 *      no cae en ningún objeto quedan en Fondo.
 *   3. Cada párrafo de varios renglones pasa a texto de área, si al refluir en Illustrator
 *      corta en los mismos sitios que el cartel. Si no, se queda en renglones agrupados.
 *   4. Se añade fuera de la mesa de trabajo una capa «Logos para colocar», que no imprime,
 *      con todos los logos del proyecto incrustados.
 *
 * ExtendScript es ES3. Lo antepone `abrir-flyer.ps1`, como `unir-renglones.jsx`.
 */

var CAPAS = ['Fondo', 'Fotos', 'QR', 'Logos', 'Texto'];
var CAPA_DE = { figura: 'Fondo', foto: 'Fotos', qr: 'QR', logo: 'Logos', texto: 'Texto' };

function recortarEspacios(s) { return s.replace(/^\s+|\s+$/g, ''); }

/* `[x, y, ancho, alto]` del mapa, en puntos desde arriba a la izquierda → `[izq, arriba, der, abajo]`. */
function aLienzo(doc, c) {
  var ab = doc.artboards[0].artboardRect;
  return [ab[0] + c[0], ab[1] - c[1], ab[0] + c[0] + c[2], ab[1] - c[1] - c[3]];
}

function contiene(c, b, tol) {
  return b[0] >= c[0] - tol && b[2] <= c[2] + tol && b[1] <= c[1] + tol && b[3] >= c[3] - tol;
}

function area(c) { return (c[2] - c[0]) * (c[1] - c[3]); }

/* ── 1. Aplanar ──────────────────────────────────────────────────────────────── */

function trazoDeRecorte(g) {
  for (var i = 0; i < g.pageItems.length; i++) {
    var it = g.pageItems[i];
    if (it.typename === 'PathItem' && it.clipping) return it;
    if (it.typename === 'CompoundPathItem' && it.pathItems.length && it.pathItems[0].clipping) return it;
  }
  return null;
}

/* Un rectángulo recto: cuatro vértices en las esquinas de su caja y sin curvas. */
function esRectangulo(p) {
  if (p.typename !== 'PathItem' || p.pathPoints.length < 4 || p.pathPoints.length > 5) return false;
  var b = p.geometricBounds;
  for (var i = 0; i < p.pathPoints.length; i++) {
    var pt = p.pathPoints[i];
    var a = pt.anchor;
    if (Math.abs(a[0] - b[0]) > 0.5 && Math.abs(a[0] - b[2]) > 0.5) return false;
    if (Math.abs(a[1] - b[1]) > 0.5 && Math.abs(a[1] - b[3]) > 0.5) return false;
    if (Math.abs(pt.leftDirection[0] - a[0]) + Math.abs(pt.leftDirection[1] - a[1]) > 0.01) return false;
    if (Math.abs(pt.rightDirection[0] - a[0]) + Math.abs(pt.rightDirection[1] - a[1]) > 0.01) return false;
  }
  return true;
}

function recorta(doc, g, clip) {
  if (!esRectangulo(clip)) return true;
  var cb = clip.geometricBounds;
  var ab = doc.artboards[0].artboardRect;
  var esPagina = Math.abs(cb[0] - ab[0]) < 1 && Math.abs(cb[1] - ab[1]) < 1 &&
    Math.abs(cb[2] - ab[2]) < 1 && Math.abs(cb[3] - ab[3]) < 1;
  if (esPagina) return false;
  for (var i = 0; i < g.pageItems.length; i++) {
    var it = g.pageItems[i];
    if (it === clip) continue;
    if (!contiene(cb, it.visibleBounds, 1)) return true;
  }
  return false;
}

/* Saca a los hijos delante del grupo, en el mismo orden de apilado, y borra el grupo. */
function soltar(g) {
  while (g.pageItems.length) g.pageItems[0].move(g, ElementPlacement.PLACEBEFORE);
  g.remove();
}

function aplanar(doc, contenedor) {
  var i = 0;
  while (i < contenedor.pageItems.length) {
    var it = contenedor.pageItems[i];
    if (it.typename !== 'GroupItem') { i++; continue; }
    if (it.clipped) {
      var clip = trazoDeRecorte(it);
      if (clip && !recorta(doc, it, clip)) { it.clipped = false; clip.remove(); }
    }
    /* Un grupo con opacidad o fusión la pierde al soltarlo: se conserva entero. */
    if (!it.clipped && it.opacity === 100 && it.blendingMode === BlendModes.NORMAL) { soltar(it); continue; }
    aplanar(doc, it);
    i++;
  }
}

/* ── 2. Capas y grupos con nombre ────────────────────────────────────────────── */

function menorQueContiene(cajas, b, tol) {
  var mejor = null;
  for (var i = 0; i < cajas.length; i++) {
    if (contiene(cajas[i].lienzo, b, tol) && (!mejor || area(cajas[i].lienzo) < area(mejor.lienzo))) mejor = cajas[i];
  }
  return mejor;
}

/*
 * La figura de fondo se sale del lienzo y llega como un grupo con transparencia que no cabe
 * en su caja: para ese grupo basta con que más de la mitad caiga dentro. Solo para grupos:
 * con cualquier objeto, la franja blanca de las marcas pasaba a la figura y quedaba tapada
 * (`es-carrusel-1`, 2026-10-07: un 25 % del lienzo cambiado).
 */
function figuraQueCubre(objetos, it) {
  if (it.typename !== 'GroupItem') return null;
  var b = it.geometricBounds;
  for (var i = 0; i < objetos.length; i++) {
    var c = objetos[i].lienzo;
    if (objetos[i].tipo !== 'figura') continue;
    var ancho = Math.min(c[2], b[2]) - Math.max(c[0], b[0]);
    var alto = Math.min(c[1], b[1]) - Math.max(c[3], b[3]);
    if (ancho > 0 && alto > 0 && ancho * alto > area(b) / 2) return objetos[i];
  }
  return null;
}

/*
 * La figura se queda en Fondo y en su sitio del apilado, encima de su primer trazo: la
 * franja blanca de las marcas va por encima de ella y en otra capa quedaría debajo.
 */
function grupoDe(o, capas, primero) {
  if (!o.grupo) {
    o.grupo = capas[CAPA_DE[o.tipo]].groupItems.add();
    o.grupo.name = o.nombre;
    if (o.tipo === 'figura') o.grupo.move(primero, ElementPlacement.PLACEBEFORE);
  }
  return o.grupo;
}

/* ── 3. Párrafos a texto de área ─────────────────────────────────────────────── */

var JUSTIFICACION = { izquierda: Justification.LEFT, centro: Justification.CENTER, derecha: Justification.RIGHT };

/* Caja de las letras, no del marco: se mide sobre un duplicado convertido en contornos. */
function cajaDeLetras(items) {
  var c = null;
  for (var i = 0; i < items.length; i++) {
    var o = items[i].duplicate().createOutline();
    var b = o.geometricBounds;
    o.remove();
    c = c ? [Math.min(c[0], b[0]), Math.max(c[1], b[1]), Math.max(c[2], b[2]), Math.min(c[3], b[3])] : b;
  }
  return c;
}

/*
 * Crea el texto de área con el texto del párrafo (`texto`, con `\n` donde el cartel fuerza
 * el corte) y la letra, cuerpo, color y espaciado de cada carácter de los renglones.
 * Devuelve el marco, o null si los caracteres no casan.
 */
function crearArea(capa, renglones, texto, caja, ancho, interlinea, alinear) {
  var origen = [];
  for (var r = 0; r < renglones.length; r++) {
    var letras = renglones[r].textRange.characters;
    for (var k = 0; k < letras.length; k++) origen.push(letras[k]);
  }
  var destino = texto.replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\r');
  var rect = capa.pathItems.rectangle(caja[1], caja[0], ancho, (caja[1] - caja[3]) + 2 * interlinea);
  var area = capa.textFrames.areaText(rect);
  area.contents = destino;
  var nuevas = area.textRange.characters;
  var j = 0;
  var previo = null;
  for (var i = 0; i < nuevas.length; i++) {
    var ch = destino.charAt(i);
    while (j < origen.length && /\s/.test(origen[j].contents) && !/\s/.test(ch)) j++;
    var de = previo;
    if (/\s/.test(ch)) {
      if (j < origen.length && /\s/.test(origen[j].contents)) de = origen[j++];
    } else {
      if (j >= origen.length || origen[j].contents !== ch) { area.remove(); return null; }
      de = origen[j++];
    }
    var hacia = nuevas[i].characterAttributes;
    if (de) {
      var a = de.characterAttributes;
      hacia.textFont = a.textFont;
      hacia.size = a.size;
      hacia.fillColor = a.fillColor;
      hacia.tracking = a.tracking;
      previo = de;
    }
    hacia.autoLeading = false;
    hacia.leading = interlinea;
  }
  for (var p = 0; p < area.paragraphs.length; p++) {
    area.paragraphs[p].paragraphAttributes.justification = JUSTIFICACION[alinear];
    area.paragraphs[p].paragraphAttributes.hyphenation = false;
  }
  return area;
}

function cortaIgual(area, renglones) {
  if (area.lines.length !== renglones.length) return false;
  for (var i = 0; i < renglones.length; i++) {
    if (recortarEspacios(area.lines[i].contents) !== recortarEspacios(renglones[i].contents)) return false;
  }
  return true;
}

/*
 * Devuelve el error de posición en puntos, o -1 si se dejó en renglones. Prueba con algo
 * de holgura de ancho: Illustrator y Chromium no miden igual y un renglón justo al borde
 * pasaría al siguiente.
 */
function aParrafo(capa, o, renglones) {
  renglones.sort(function (a, b) { return b.anchor[1] - a.anchor[1]; });
  var interlinea = (renglones[0].anchor[1] - renglones[renglones.length - 1].anchor[1]) / (renglones.length - 1);
  var caja = o.lienzo;
  var holguras = [0.01, 0.03, 0.06, 0.1];
  for (var h = 0; h < holguras.length; h++) {
    var ancho = (caja[2] - caja[0]) * (1 + holguras[h]);
    var area = crearArea(capa, renglones, o.texto, caja, ancho, interlinea, o.alinear);
    if (!area) return -1;
    if (!cortaIgual(area, renglones)) { area.remove(); continue; }

    var antes = cajaDeLetras(renglones);
    var despues = cajaDeLetras([area]);
    var dx = o.alinear === 'centro' ? (antes[0] + antes[2] - despues[0] - despues[2]) / 2
      : o.alinear === 'derecha' ? antes[2] - despues[2] : antes[0] - despues[0];
    area.translate(dx, antes[1] - despues[1]);
    var error = Math.abs(antes[3] - (despues[3] + antes[1] - despues[1]));
    area.name = o.nombre;
    area.move(renglones[0], ElementPlacement.PLACEBEFORE);
    for (var r = 0; r < renglones.length; r++) renglones[r].remove();
    return error;
  }
  return -1;
}

/* ── 4. Logos para colocar ───────────────────────────────────────────────────── */

function bibliotecaDeLogos(doc, raiz) {
  var capa = doc.layers.add();
  capa.name = 'Logos para colocar';
  capa.printable = false;
  var ab = doc.artboards[0].artboardRect;
  var x = ab[2] + 60;
  var y = ab[1];
  var archivos = Folder(raiz + '/src/assets/logos').getFiles('*.png')
    .concat(Folder(raiz + '/public/logos').getFiles('*.svg'));
  var n = 0;
  for (var i = 0; i < archivos.length; i++) {
    var f = archivos[i];
    var it;
    if (/\.svg$/i.test(f.name)) {
      it = capa.groupItems.createFromFile(f);
    } else {
      var colocado = capa.placedItems.add();
      colocado.file = f;
      colocado.embed();
      it = capa.pageItems[0];
    }
    var alto = it.height;
    if (alto > 0) it.resize(6000 / alto, 6000 / alto);
    it.position = [x, y];
    it.name = decodeURI(f.name).replace(/\.(png|svg)$/i, '');
    y -= it.height + 24;
    n++;
  }
  return n;
}

/* ── Todo junto ──────────────────────────────────────────────────────────────── */

function estructurar(doc, mapa, raiz) {
  var base = doc.layers[0];
  aplanar(doc, base);

  var capas = {};
  base.name = CAPAS[0];
  capas[CAPAS[0]] = base;
  for (var c = 1; c < CAPAS.length; c++) {
    capas[CAPAS[c]] = doc.layers.add();
    capas[CAPAS[c]].name = CAPAS[c];
  }

  var objetos = [];
  var textos = [];
  for (var m = 0; m < mapa.length; m++) {
    var o = mapa[m];
    o.lienzo = aLienzo(doc, o.caja);
    o.renglonesIa = [];
    (o.tipo === 'texto' ? textos : objetos).push(o);
  }

  /* De abajo arriba: cada uno entra encima de lo anterior y el apilado no cambia. */
  var items = [];
  for (var i = 0; i < base.pageItems.length; i++) items.push(base.pageItems[i]);
  var sueltos = 0;
  for (var k = items.length - 1; k >= 0; k--) {
    var it = items[k];
    var b = it.geometricBounds;
    if (it.typename === 'TextFrame') {
      /* La línea base y no la caja del marco: en cuerpos grandes la caja de la fuente
         sobresale del renglón del cartel (la fecha, en mono de 48 px, quedaba fuera). */
      var lineaBase = it.anchor[1];
      var t = menorQueContiene(textos, [b[0], lineaBase, b[2], lineaBase], 3);
      if (t) { t.renglonesIa.push(it); it.move(capas.Texto, ElementPlacement.PLACEATBEGINNING); continue; }
    }
    var dueno = menorQueContiene(objetos, b, 3) || figuraQueCubre(objetos, it);
    if (dueno) it.move(grupoDe(dueno, capas, it), ElementPlacement.PLACEATBEGINNING);
    else if (it.typename === 'TextFrame') {
      it.name = it.contents.substr(0, 40);
      it.move(capas.Texto, ElementPlacement.PLACEATBEGINNING);
    } else sueltos++;
  }

  var parrafos = 0;
  var convertidos = 0;
  var peor = 0;
  for (var n = 0; n < textos.length; n++) {
    var tx = textos[n];
    var rs = tx.renglonesIa;
    if (!rs.length) continue;
    if (rs.length > 1 && rs.length === tx.renglones) {
      parrafos++;
      var error = aParrafo(capas.Texto, tx, rs);
      if (error >= 0) { convertidos++; if (error > peor) peor = error; continue; }
    }
    if (rs.length === 1) { rs[0].name = tx.nombre; continue; }
    var g = capas.Texto.groupItems.add();
    g.name = tx.nombre;
    rs.sort(function (a, b) { return a.anchor[1] - b.anchor[1]; });
    for (var q = 0; q < rs.length; q++) rs[q].move(g, ElementPlacement.PLACEATBEGINNING);
  }

  for (var v = CAPAS.length - 1; v >= 1; v--) if (!capas[CAPAS[v]].pageItems.length) capas[CAPAS[v]].remove();

  return {
    fondo: sueltos, parrafos: parrafos, convertidos: convertidos, errorParrafo: peor,
    logos: bibliotecaDeLogos(doc, raiz)
  };
}
