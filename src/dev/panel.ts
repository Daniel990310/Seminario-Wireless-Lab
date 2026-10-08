/**
 * Lógica del panel de ajuste visual. **Solo se carga en `npm run dev`**: la ruta
 * `/ajustar` la inyecta una integración de `astro.config.mjs` que no corre en
 * `build`, así que este archivo no puede terminar en `dist/`.
 *
 * Qué hace y qué NO hace, porque la distinción es el propósito de la herramienta:
 *
 *   - **No** edita el repositorio. Nada de lo que se toque aquí modifica un solo
 *     archivo del proyecto. Es un borrador que vive en `localStorage`.
 *   - **Sí** emite valores. Cada perilla está atada a una propiedad real de un
 *     componente real, y el informe dice en qué archivo va cada número. Eso es lo
 *     que se pega en el chat para que se implemente.
 *
 * La página se muestra dentro de un `<iframe>` y no incrustada en este documento,
 * por una razón que se puede comprobar: las `media query` se resuelven contra el
 * ancho del *viewport*, y el de un iframe es su propio ancho. Así el control de
 * ancho reproduce de verdad el móvil, en vez de encoger un contenedor y dejar
 * aplicado el diseño de escritorio.
 *
 * Este archivo orquesta. Cada herramienta vive en su módulo: `textos.ts`,
 * `seleccion.ts` (señalar elementos), `colores.ts`; el borrador en `modelo.ts` y
 * los controles comunes en `ui.ts`.
 */
import { cssDeColores, grupoColores, informeColores } from './colores';
import {
  CLAVE_ACTUAL,
  CLAVE_INSTANTANEAS,
  FRANJA_ACTUAL,
  cargar,
  mezclar,
  porOmision,
  seccionPorOmision,
  type Ajustes,
  type Herramienta,
  type ImagenCargada,
  type Idioma,
  type ModoFondo,
  type Tema,
} from './modelo';
import { aplicarRetratos, avisosRetratos, grupoRetratos, informeRetratos, prepararRetratos } from './retratos';
import { cssDeElementos, grupoElementos, informeElementos, prepararSenalar } from './seleccion';
import { aplicarTextos, informeTextos, prepararEdicion } from './textos';
import { REFUERZO, boton, cargadorDeImagen, casilla, comoElemento, crear, ctx, deslizador, grupo, opciones } from './ui';

let ajustes = cargar();

function guardar(): void {
  try {
    localStorage.setItem(CLAVE_ACTUAL, JSON.stringify(ajustes));
  } catch {
    // Cuota agotada: casi siempre una fotografía grande metida en el borrador.
    avisar(
      'No se pudo guardar el borrador: las imágenes cargadas ocupan demasiado. ' +
        'Siguen aplicadas en esta sesión, pero se pierden al recargar.',
    );
  }
}

/* -------------------------------------------------------------------- marco */

const marco = document.getElementById('lienzo') as HTMLIFrameElement;
const avisoEl = document.getElementById('aviso') as HTMLElement;
const informeEl = document.getElementById('informe') as HTMLTextAreaElement;
const diagnosticoEl = document.getElementById('diagnostico') as HTMLElement;
const controlesEl = document.getElementById('controles') as HTMLElement;
const herramientasEl = document.getElementById('herramientas') as HTMLElement;

let temporizadorAviso = 0;

function avisar(texto: string, ms = 0): void {
  window.clearTimeout(temporizadorAviso);
  avisoEl.textContent = texto;
  avisoEl.hidden = texto === '';
  if (ms > 0) temporizadorAviso = window.setTimeout(() => avisar(''), ms);
}

/** `null` también cuando el marco salió del sitio: un documento ajeno no se lee. */
function pagina(): Document | null {
  try {
    return marco.contentDocument;
  } catch {
    return null;
  }
}

/** Nota viva bajo el control de relación; se rellena en `aplicar`. */
let notaRelacion: HTMLElement | null = null;

const ANCHOS_DE_REFERENCIA = [390, 768, 1280, 1920];

/** Lo que mide la franja ahora mismo en el marco, no lo que debería medir. */
function medidaDeLaFranja(): { ancho: number; alto: number } | null {
  const el = pagina()?.querySelector('.franja-sede');
  if (!el) return null;
  const c = el.getBoundingClientRect();
  return c.height > 0 ? { ancho: c.width, alto: c.height } : null;
}

function pintarNotaRelacion(): void {
  if (!notaRelacion) return;
  const f = ajustes.franja;
  const medida = medidaDeLaFranja();
  const ahora = medida
    ? `Ahora mismo: ${Math.round(medida.ancho)} × ${Math.round(medida.alto)} px → ${(medida.ancho / medida.alto).toFixed(2)} : 1.`
    : '';

  if (!f.relacionFija) {
    notaRelacion.textContent =
      `${ahora} Sin fijarla rige la del sitio: ${FRANJA_ACTUAL.relacion} : 1, con un tope por alto ` +
      'de ventana que hace desaparecer la banda en un teléfono apaisado.';
    return;
  }

  const alturas = ANCHOS_DE_REFERENCIA.map((w) => `${w}px → ${Math.round(w / f.relacion)}px de alto`).join(' · ');
  notaRelacion.textContent = `${ahora} Fijada en ${f.relacion.toFixed(2)} : 1 → ${alturas}. Mirá el móvil antes de decidir.`;
}

/* --------------------------------------------------------- aplicar ajustes */

/**
 * La hoja que se inyecta en la página. Se regenera entera en cada cambio: es un
 * kilobyte de texto y evita llevar la cuenta de qué regla hay que retirar.
 */
function construirCss(): string {
  const f = ajustes.franja;
  // Con relación fija la altura se deriva del ancho de la ventana, así que el
  // recorte visible deja de depender de la pantalla. Se sigue expresando como
  // **altura** y no como `aspect-ratio` a propósito: la contracción al hacer
  // scroll anima `height`, y animar desde `auto` no es lo mismo en todo navegador.
  // Sin relación fija, la misma fórmula que `--alto-franja` en `global.css`, escalada por «alto».
  const alturaFranja = f.relacionFija
    ? `calc(100vw / ${f.relacion})`
    : `max(0px, min(calc(100vw / ${FRANJA_ACTUAL.relacion} * ${f.alto}), calc(100vh - 32rem)))`;
  /*
   * `!important` en las propiedades personalizadas, y no es adorno.
   *
   * Astro compila el estilo de un componente con un atributo de ámbito, de modo
   * que `.franja-sede` del componente sale como `.franja-sede[data-astro-cid-…]`:
   * especificidad (0,2,0). Lo que inyecta el panel es `.franja-sede`, (0,1,0), y
   * **pierde**. Durante horas los deslizadores de velo y desvanecido movieron el
   * número del informe sin cambiar un solo píxel, y Daniel lo reportó como «nunca
   * vi diferencia al mover el velo» `[2026-09-22]`.
   *
   * Regla para quien añada perillas: si la propiedad la declara un componente en su
   * propio `<style>`, la inyección necesita ganarle en especificidad. Las reglas
   * nuevas usan `REFUERZO` (`ui.ts`), que da especificidad de id sin `!important`;
   * estas cuatro lo conservan porque así están medidas, y la de `object-position`
   * compite con un estilo en línea, que solo `!important` supera. Y la prueba que lo
   * cubre tiene que comparar **píxeles**, no el texto del CSS; la que había
   * comparaba el informe, que era justo lo único que sí cambiaba.
   */
  const lineas: string[] = [
    `:root { --alto-franja: ${alturaFranja} !important; }`,
    `.franja-sede { --velo: ${f.velo}% !important; --desvanecido: ${f.desvanecido}% !important; }`,
    // `!important` porque `FranjaSede.astro` pone `object-position` en el atributo
    // `style` del propio `<img>`, y un estilo en línea gana a cualquier hoja.
    `.franja-sede__imagen { object-position: ${f.x}% ${f.y}% !important;` +
      ` transform: scale(${f.escala}); transform-origin: ${f.x}% ${f.y}%; }`,
    // La barra de desarrollo de Astro tapa el pie de la vista previa y se dejaba señalar.
    `${REFUERZO} astro-dev-toolbar { display: none; }`,
    // Qué se puede editar, a la vista solo mientras la herramienta está activa.
    `${REFUERZO}[data-panel-herramienta="textos"] [data-panel-atado] { outline: 1px dashed rgba(220,120,40,.75); outline-offset: 3px; cursor: text; }`,
  ];

  for (const [id, s] of Object.entries(ajustes.secciones)) {
    if (s.modo !== 'imagen' || !s.imagen) continue;
    lineas.push(
      `#${id} { isolation: isolate; }`,
      `#${id}::before { content:""; position:absolute; inset:0; z-index:0; pointer-events:none;` +
        ` background-image:url("${s.imagen.datos}"); background-size:cover;` +
        ` background-position:${s.x}% ${s.y}%; filter:blur(${s.desenfoque}px); }`,
      `#${id}::after { content:""; position:absolute; inset:0; z-index:0; pointer-events:none;` +
        ` background-color:var(--background); opacity:${(s.velo / 100).toFixed(2)}; }`,
      `#${id} > * { position:relative; z-index:1; }`,
    );
  }

  lineas.push(...cssDeColores(), ...cssDeElementos());
  return lineas.join('\n');
}

/**
 * Cambia la fuente de un `<img>` por la del borrador, o la devuelve a la suya. Se
 * hace por DOM y no por CSS: `<img>` es un elemento reemplazado, y sustituir su
 * fuente conserva `object-fit` y las medidas ya calculadas. `srcset` hay que
 * vaciarlo, o gana al `src`.
 */
function cambiarFuente(img: HTMLImageElement, imagen: ImagenCargada | null): void {
  if (img.dataset.fuenteOriginal === undefined) {
    img.dataset.fuenteOriginal = img.getAttribute('src') ?? '';
    img.dataset.conjuntoOriginal = img.getAttribute('srcset') ?? '';
  }
  if (imagen) {
    img.removeAttribute('srcset');
    if (img.src !== imagen.datos) img.src = imagen.datos;
  } else if (img.getAttribute('src') !== img.dataset.fuenteOriginal) {
    img.src = img.dataset.fuenteOriginal;
    if (img.dataset.conjuntoOriginal) img.srcset = img.dataset.conjuntoOriginal;
  }
}

/** Secciones que se pueden reordenar: todas menos el hero, que abre la página. */
function seccionesMovibles(d: Document): HTMLElement[] {
  return [...d.querySelectorAll<HTMLElement>('main > section[id]')].filter((s) => s.id !== 'top');
}

function ordenDeseado(d: Document): string[] {
  const actuales = seccionesMovibles(d).map((s) => s.id);
  return [...ajustes.orden.filter((id) => actuales.includes(id)), ...actuales.filter((id) => !ajustes.orden.includes(id))];
}

/** Recoloca las secciones en los mismos huecos que ocupan, para no mover nada más. */
function aplicarOrden(d: Document): void {
  if (ajustes.orden.length === 0) return;
  const secciones = seccionesMovibles(d);
  const porId = new Map(secciones.map((s) => [s.id, s]));
  const deseado = ordenDeseado(d);
  const huecos = secciones.map((s) => {
    const marca = d.createComment('panel');
    s.before(marca);
    return marca;
  });
  huecos.forEach((h, i) => h.replaceWith(porId.get(deseado[i])!));
}

function aplicar(): void {
  const d = pagina();
  if (!d) return;

  // Ancho del marco: 0 es «todo el espacio disponible».
  marco.style.width = ajustes.vista.ancho === 0 ? '100%' : `${ajustes.vista.ancho}px`;

  // El tema lo fija el propio sitio al arrancar leyendo `tema-seminario`
  // (`BaseLayout.astro`); se escribe la misma clave para que un recargado no
  // deshaga la elección hecha aquí.
  try {
    localStorage.setItem('tema-seminario', ajustes.vista.tema);
  } catch {
    /* modo privado: el atributo de abajo basta para esta sesión */
  }
  d.documentElement.dataset.theme = ajustes.vista.tema;
  d.documentElement.dataset.panelHerramienta = ctx.herramienta;

  let hoja = d.getElementById('ajustes-del-panel') as HTMLStyleElement | null;
  if (!hoja) {
    hoja = d.createElement('style');
    hoja.id = 'ajustes-del-panel';
    d.head.append(hoja);
  }
  hoja.textContent = construirCss();

  const imgFranja = d.querySelector<HTMLImageElement>('.franja-sede__imagen');
  if (imgFranja) cambiarFuente(imgFranja, ajustes.franja.imagen);

  aplicarOrden(d);
  aplicarTextos(d);
  // Después de los textos: la clave de un retrato es el nombre original de su `<h4>`.
  aplicarRetratos(d);
  pintarDiagnostico();
  // Tras un cambio de altura hay que dejar maquetar antes de medir la franja.
  requestAnimationFrame(pintarNotaRelacion);
  informeEl.value = informe();
}

/* ------------------------------------------------------------- diagnóstico */

/**
 * La regla no es un número de contraste, y esto ya costó una medición en el
 * proyecto: axe marca como **indeterminado** todo texto que tenga una imagen en
 * su pila de fondo, sea cual sea el velo que se le ponga encima, y `verify.mjs`
 * exige 0 nodos indeterminados (RNF-1.3). Así que «imagen bajo texto» es
 * binario: o el velo es opaco y la imagen no se ve, o la comprobación falla.
 * La nota larga está en `src/components/FranjaSede.astro`, líneas 5-17.
 */
function diagnostico(): string[] {
  const problemas: string[] = [];
  for (const [id, s] of Object.entries(ajustes.secciones)) {
    if (s.modo !== 'imagen' || !s.imagen) continue;
    if (s.velo >= 100) {
      problemas.push(`#${id}: el velo está al 100 %, la imagen no se ve. Publicable, pero no aporta nada.`);
    } else {
      problemas.push(
        `#${id}: imagen bajo texto con velo ${s.velo} %. axe devolverá esos textos como contraste ` +
          'indeterminado y «npm run verify» fallará (RNF-1.3). Lo que sí se publica es una banda de ' +
          'imagen sin texto encima, como la franja de la sede.',
      );
    }
  }
  problemas.push(...avisosRetratos());
  return problemas;
}

function pintarDiagnostico(): void {
  const problemas = diagnostico();
  diagnosticoEl.hidden = problemas.length === 0;
  diagnosticoEl.textContent = '';
  for (const p of problemas) diagnosticoEl.append(crear('li', '', p));
}

/* ----------------------------------------------------------------- informe */

function informe(): string {
  const f = ajustes.franja;
  const l: string[] = [];
  l.push(`# Ajustes del panel · ${new Date().toLocaleString('es-CL')}`);
  l.push('');
  l.push(
    'Pedido: implementar estos ajustes siguiendo AGENTS.md, en una rama `ajustes/<asunto>` nacida de ' +
      'origin/main. No desplegar. Antes del pull request: npm run check, npm run build y npm run verify:todo.',
  );
  l.push('');
  const cabecera = l.length;
  l.push(
    `Vista usada: ancho ${ajustes.vista.ancho === 0 ? 'completo' : `${ajustes.vista.ancho} px`} · ` +
      `tema ${ajustes.vista.tema} · idioma ${ajustes.vista.idioma}`,
  );
  l.push('');

  const medida = medidaDeLaFranja();
  if (medida) {
    l.push(
      `Franja tal como se está viendo: ${Math.round(medida.ancho)} × ${Math.round(medida.alto)} px ` +
        `→ ${(medida.ancho / medida.alto).toFixed(2)} : 1`,
    );
    l.push('');
  }

  const franjaCambiada =
    f.x !== FRANJA_ACTUAL.x ||
    f.y !== FRANJA_ACTUAL.y ||
    f.escala !== FRANJA_ACTUAL.escala ||
    f.velo !== FRANJA_ACTUAL.velo ||
    f.desvanecido !== FRANJA_ACTUAL.desvanecido ||
    f.alto !== FRANJA_ACTUAL.alto ||
    f.relacionFija ||
    f.imagen !== null;
  if (franjaCambiada) {
    l.push('## Franja de la sede');
    if (f.x !== 50 || f.y !== 50) {
      l.push(`- encuadre: "${f.x}% ${f.y}%"  (antes "50% 50%")  → src/components/SiteHeader.astro, prop \`encuadre\``);
    }
    if (f.velo !== 18) l.push(`- velo: ${f.velo}%  (antes 18%)  → src/components/FranjaSede.astro, \`--velo\``);
    if (f.desvanecido !== 18) {
      l.push(`- desvanecido: ${f.desvanecido}%  (antes 18%)  → src/components/FranjaSede.astro, \`--desvanecido\``);
    }
    if (f.relacionFija) {
      l.push(`- relación FIJA: ${f.relacion.toFixed(2)} : 1  → src/styles/global.css, \`--alto-franja: calc(100vw / ${f.relacion.toFixed(2)})\``);
      l.push('    ⚠ quita el tope por alto de ventana: en un teléfono apaisado la banda deja de desaparecer');
      l.push(
        `    alturas que resultan: ${ANCHOS_DE_REFERENCIA.map((w) => `${w}px → ${Math.round(w / f.relacion)}px`).join(' · ')}`,
      );
      l.push('    (con la relación fija, el control de «alto» deja de tener efecto)');
    } else if (f.alto !== 1) {
      l.push(`- alto: ×${f.alto}  → src/styles/global.css, \`--alto-franja\``);
    }
    if (f.escala !== 1) {
      l.push(`- zoom: ${f.escala}×  ⚠ no existe hoy: hace falta una prop nueva en FranjaSede.astro`);
    }
    if (f.imagen) {
      const medidas = f.imagen.ancho ? ` (${f.imagen.ancho}×${f.imagen.altoPx} px)` : '';
      l.push(`- imagen: ${f.imagen.nombre}${medidas}  ⚠ archivo local: hay que añadirlo a src/assets/fondos/ recortado a la relación de arriba`);
    }
    l.push('');
  }

  const conFondo = Object.entries(ajustes.secciones).filter(([, s]) => s.modo === 'imagen' && s.imagen);
  if (conFondo.length > 0) {
    l.push('## Fondos de sección');
    for (const [id, s] of conFondo) {
      l.push(
        `- #${id}: imagen ${s.imagen?.nombre} · encuadre ${s.x}% ${s.y}% · ` +
          `velo ${s.velo}% · desenfoque ${s.desenfoque}px`,
      );
    }
    l.push('');
  }

  if (ajustes.orden.length > 0) {
    const d = pagina();
    l.push('## Orden de secciones (src/components/PaginaSeminario.astro)');
    l.push(`- ${d ? ordenDeseado(d).map((id) => `#${id}`).join(' → ') : ajustes.orden.join(' → ')}`);
    l.push('    La navegación de la barra lleva su propio orden (SiteHeader.astro): moverla también.');
    l.push('');
  }

  l.push(...informeRetratos(), ...informeTextos(), ...informeColores(), ...informeElementos());

  const problemas = diagnostico();
  if (problemas.length > 0) {
    l.push('## Avisos de accesibilidad y permisos');
    for (const p of problemas) l.push(`- ${p}`);
    l.push('');
  }

  if (l.length <= cabecera + 4) l.push('(todavía sin cambios)');
  return l.join('\n');
}

/* --------------------------------------------------------------- controles */

/**
 * Se reconstruye tras cada carga del marco —las secciones se leen de la página—
 * y cuando una herramienta cambia lo que hay que mostrar. Conserva qué grupos
 * estaban abiertos y dónde estaba el desplazamiento, o cada clic en la página
 * devolvería el panel arriba del todo.
 */
function montarControles(): void {
  const d = pagina();
  if (!d) return;
  const abiertos = new Map(
    [...controlesEl.querySelectorAll<HTMLDetailsElement>(':scope > details')].map((g) => [g.querySelector('summary')?.textContent, g.open]),
  );
  const desplazamiento = controlesEl.parentElement?.scrollTop ?? 0;
  controlesEl.textContent = '';

  /* --- vista --- */
  const gVista = grupo('Vista');
  gVista.append(
    opciones(
      [['móvil 390', 390], ['tableta 768', 768], ['portátil 1280', 1280], ['completo', 0]] as const,
      ajustes.vista.ancho as number,
      (v) => {
        ajustes.vista.ancho = v;
        alCambiar();
      },
    ),
    opciones([['claro', 'light'], ['oscuro', 'dark']] as ReadonlyArray<readonly [string, Tema]>, ajustes.vista.tema, (t) => {
      ajustes.vista.tema = t;
      alCambiar();
      // Los colores del tema se leen de la página: hay que volver a medirlos.
      requestAnimationFrame(montarControles);
    }),
    opciones([['ES', 'es'], ['EN', 'en']] as ReadonlyArray<readonly [string, Idioma]>, ajustes.vista.idioma, (i) => {
      ajustes.vista.idioma = i;
      guardar();
      marco.src = i === 'es' ? '/' : '/en/';
    }),
  );
  controlesEl.append(gVista);

  /* --- franja de la sede --- */
  const f = ajustes.franja;
  const gFranja = grupo('Franja de la sede (el banner)');
  gFranja.append(
    deslizador({ etiqueta: 'encuadre ↔', min: 0, max: 100, paso: 1, unidad: '%', leer: () => f.x, escribir: (v) => (f.x = v) }),
    deslizador({ etiqueta: 'encuadre ↕', min: 0, max: 100, paso: 1, unidad: '%', leer: () => f.y, escribir: (v) => (f.y = v) }),
    deslizador({ etiqueta: 'zoom', min: 1, max: 2, paso: 0.01, unidad: '×', leer: () => f.escala, escribir: (v) => (f.escala = v) }),
    deslizador({ etiqueta: 'velo', min: 0, max: 80, paso: 1, unidad: '%', leer: () => f.velo, escribir: (v) => (f.velo = v) }),
    deslizador({
      etiqueta: 'desvanecido hacia la barra',
      min: 0,
      max: 60,
      paso: 1,
      unidad: '%',
      leer: () => f.desvanecido,
      escribir: (v) => (f.desvanecido = v),
    }),
    deslizador({ etiqueta: 'alto', min: 0.4, max: 2, paso: 0.05, unidad: '×', leer: () => f.alto, escribir: (v) => (f.alto = v) }),
    cargadorDeImagen('otra fotografía', (img) => (f.imagen = img)),
  );

  // Relación fija: la perilla que contesta «que se vea lo mismo en toda pantalla».
  const fijar = casilla('relación fija (mismo recorte en toda pantalla)', f.relacionFija, (v) => {
    f.relacionFija = v;
    alCambiar();
  });
  notaRelacion = crear('p', 'nota');
  gFranja.append(
    fijar,
    deslizador({
      etiqueta: 'relación ancho : alto',
      min: 3,
      max: 16,
      paso: 0.01,
      unidad: ' : 1',
      leer: () => f.relacion,
      escribir: (v) => {
        f.relacion = v;
        f.relacionFija = true;
        const entrada = fijar.querySelector('input');
        if (entrada) entrada.checked = true;
      },
    }),
    notaRelacion,
  );
  controlesEl.append(gFranja);

  /* --- lo más usado en una revisión, arriba --- */
  controlesEl.append(grupoElementos());
  const gRetratos = grupoRetratos(d);
  if (gRetratos) controlesEl.append(gRetratos);
  controlesEl.append(grupoColores());

  /* --- orden de secciones --- */
  const gOrden = grupo('Orden de secciones', ajustes.orden.length > 0);
  const orden = ordenDeseado(d);
  orden.forEach((id, i) => {
    const mover = (destino: number): void => {
      const nuevo = [...orden];
      [nuevo[i], nuevo[destino]] = [nuevo[destino], nuevo[i]];
      ajustes.orden = nuevo;
      alCambiar();
      montarControles();
    };
    const fila = crear('div', 'fila botones');
    const subir = boton('↑', () => mover(i - 1));
    const bajar = boton('↓', () => mover(i + 1));
    subir.disabled = i === 0;
    bajar.disabled = i === orden.length - 1;
    fila.append(crear('span', 'rotulo-color', `#${id}`), subir, bajar);
    gOrden.append(fila);
  });
  gOrden.append(
    boton('orden original', () => {
      ajustes.orden = [];
      guardar();
      // Las secciones ya se movieron en el DOM: solo una recarga las devuelve.
      marco.contentWindow?.location.reload();
    }),
  );
  controlesEl.append(gOrden);

  /* --- fondos de sección --- */
  for (const seccion of d.querySelectorAll<HTMLElement>('main > section[id]')) {
    const id = seccion.id;
    ajustes.secciones[id] ??= seccionPorOmision();
    const s = ajustes.secciones[id];
    const g = grupo(`Fondo de #${id}`, s.modo === 'imagen');
    g.append(
      opciones([['color sólido', 'solido'], ['imagen', 'imagen']] as ReadonlyArray<readonly [string, ModoFondo]>, s.modo, (m) => {
        s.modo = m;
        alCambiar();
      }),
      cargadorDeImagen('imagen de fondo', (img) => {
        s.imagen = img;
        if (img) s.modo = 'imagen';
      }),
      deslizador({ etiqueta: 'encuadre ↔', min: 0, max: 100, paso: 1, unidad: '%', leer: () => s.x, escribir: (v) => (s.x = v) }),
      deslizador({ etiqueta: 'encuadre ↕', min: 0, max: 100, paso: 1, unidad: '%', leer: () => s.y, escribir: (v) => (s.y = v) }),
      deslizador({ etiqueta: 'velo', min: 0, max: 100, paso: 1, unidad: '%', leer: () => s.velo, escribir: (v) => (s.velo = v) }),
      deslizador({ etiqueta: 'desenfoque', min: 0, max: 20, paso: 1, unidad: 'px', leer: () => s.desenfoque, escribir: (v) => (s.desenfoque = v) }),
    );
    controlesEl.append(g);
  }

  for (const g of controlesEl.querySelectorAll<HTMLDetailsElement>(':scope > details')) {
    const antes = abiertos.get(g.querySelector('summary')?.textContent);
    if (antes !== undefined) g.open = antes;
  }
  if (controlesEl.parentElement) controlesEl.parentElement.scrollTop = desplazamiento;

  aplicar();
}

function alCambiar(): void {
  aplicar();
  guardar();
}

/* --------------------------------------------------------------- herramienta */

const AYUDA: Record<Herramienta, string> = {
  navegar: '',
  textos:
    'Hacé clic en cualquier texto y escribí encima. Los enlaces y botones no se activan mientras tanto: ' +
    'para editar dentro de un desplegable (una reseña, el menú), abrilo antes con «navegar».',
  senalar: 'Hacé clic en cualquier elemento para cambiarle tamaño, margen o color, ocultarlo o dejarle una nota.',
};

function elegirHerramienta(h: Herramienta): void {
  ctx.herramienta = h;
  for (const b of herramientasEl.querySelectorAll<HTMLButtonElement>('button')) {
    b.classList.toggle('activo', b.dataset.herramienta === h);
  }
  avisar(AYUDA[h], 6000);
  const d = pagina();
  if (!d) return;
  prepararEdicion(d);
  montarControles();
}

/**
 * Lo que hay que hacer con cada documento nuevo del marco, antes de pintar nada:
 * sus escuchas no sobreviven a una navegación.
 */
function prepararMarco(d: Document): void {
  // Si la carga se cuenta dos veces —ver el arranque—, la segunda no duplica escuchas:
  // un clic en un enlace externo abriría dos pestañas.
  if (d.documentElement.dataset.panelPreparado === 'si') return;
  d.documentElement.dataset.panelPreparado = 'si';

  // El idioma lo dice la ruta y no el borrador: el selector de idioma del propio
  // sitio cambia de página sin pasar por el panel, y los textos editados se
  // anotarían en el idioma equivocado.
  const idioma: Idioma = d.location.pathname.startsWith('/en') ? 'en' : 'es';
  if (ajustes.vista.idioma !== idioma) {
    ajustes.vista.idioma = idioma;
    guardar();
  }

  d.addEventListener(
    'click',
    (e) => {
      const objetivo = comoElemento(e.target);
      if (!objetivo) return;
      if (ctx.herramienta === 'textos') {
        // Para escribir en un botón o un enlace hay que poder hacer clic sin activarlo,
        // ni el enlace ni el guion del sitio que lo escucha (menú, tema, idioma).
        if (objetivo.closest('a[href], button, summary, label')) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (ctx.herramienta !== 'navegar') return;
      const enlace = objetivo.closest<HTMLAnchorElement>('a[href]');
      if (!enlace) return;
      // Un enlace a otro sitio dentro del marco lo deja en blanco —Google Forms no se
      // deja enmarcar— y el panel pierde la página. Se abre aparte.
      const url = new URL(enlace.href, d.baseURI);
      if (url.origin === location.origin) return;
      e.preventDefault();
      window.open(url.href, '_blank', 'noopener');
      avisar(`${url.host} se abrió en otra pestaña: el marco no puede salir del sitio.`, 4000);
    },
    true,
  );

  prepararSenalar(d);
  prepararEdicion(d);
  prepararRetratos(d);
}

/* ------------------------------------------------------------ instantáneas */

function instantaneas(): Record<string, Ajustes> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_INSTANTANEAS) ?? '{}') as Record<string, Ajustes>;
  } catch {
    return {};
  }
}

/** Lleva el marco al idioma del borrador; la carga monta los controles. */
function irAlIdiomaDelBorrador(): void {
  const ruta = ajustes.vista.idioma === 'en' ? '/en/' : '/';
  if (new URL(marco.src, location.href).pathname === ruta) marco.contentWindow?.location.reload();
  else marco.src = ruta;
}

function pintarInstantaneas(): void {
  const lista = document.getElementById('instantaneas') as HTMLElement;
  lista.textContent = '';
  const todas = instantaneas();
  const nombres = Object.keys(todas);
  if (nombres.length === 0) {
    lista.append(crear('p', 'nota', 'Todavía no guardaste ninguna.'));
    return;
  }
  for (const nombre of nombres) {
    const fila = crear('div', 'fila botones');
    const abrir = boton(
      nombre,
      () => {
        // Misma mezcla que al cargar: una instantánea vieja no trae las perillas nuevas.
        ajustes = mezclar(todas[nombre]);
        guardar();
        irAlIdiomaDelBorrador();
      },
      'menor crecer',
    );
    const borrar = boton('✕', () => {
      const resto = instantaneas();
      delete resto[nombre];
      localStorage.setItem(CLAVE_INSTANTANEAS, JSON.stringify(resto));
      pintarInstantaneas();
    });
    borrar.title = `Borrar «${nombre}»`;
    fila.append(abrir, borrar);
    lista.append(fila);
  }
}

/* ---------------------------------------------------------------- arranque */

Object.assign(ctx, {
  ajustes: () => ajustes,
  pagina,
  alCambiar,
  guardar: () => {
    guardar();
    informeEl.value = informe();
  },
  remontar: montarControles,
  avisar,
});

function alCargarMarco(): void {
  const d = pagina();
  if (!d) {
    controlesEl.textContent = '';
    avisar('El marco salió del sitio. Volvé con «ES» o «EN» en «Vista».');
    return;
  }
  prepararMarco(d);
  montarControles();
}

marco.addEventListener('load', alCargarMarco);

for (const b of herramientasEl.querySelectorAll<HTMLButtonElement>('button')) {
  b.addEventListener('click', () => elegirHerramienta(b.dataset.herramienta as Herramienta));
}

document.getElementById('guardar-instantanea')?.addEventListener('click', () => {
  const nombre = prompt('Nombre de la instantánea');
  if (!nombre) return;
  const todas = instantaneas();
  todas[nombre] = ajustes;
  try {
    localStorage.setItem(CLAVE_INSTANTANEAS, JSON.stringify(todas));
    pintarInstantaneas();
    avisar(`Instantánea «${nombre}» guardada.`, 2500);
  } catch {
    avisar('No cabe: alguna instantánea tiene fotografías demasiado grandes. Borrá una vieja y reintentá.');
  }
});

document.getElementById('copiar')?.addEventListener('click', () => {
  const texto = informe();
  navigator.clipboard.writeText(texto).then(
    () => avisar('Informe copiado. Pegalo en el chat.', 2500),
    () => {
      // Sin permiso de portapapeles: queda seleccionado para copiarlo a mano.
      const desplegable = informeEl.closest('details');
      if (desplegable) desplegable.open = true;
      informeEl.value = texto;
      informeEl.select();
      avisar('El navegador no dejó copiar. El informe quedó seleccionado: Ctrl+C.');
    },
  );
});

document.getElementById('restablecer')?.addEventListener('click', () => {
  const seguro = confirm('Se descarta el borrador actual. Las instantáneas guardadas no se tocan. ¿Seguir?');
  if (!seguro) return;
  ajustes = porOmision();
  guardar();
  elegirHerramienta('navegar');
  irAlIdiomaDelBorrador();
});

pintarInstantaneas();

// El marco arranca en `/` porque es lo que dice su atributo `src`. Si el borrador
// venía en inglés, se corrige aquí, antes de que nadie toque un control. Va antes
// de leer la página ya cargada: esa lectura toma el idioma de la ruta, `/`, y
// borraría el inglés del borrador.
if (ajustes.vista.idioma === 'en' && !new URL(marco.src, location.href).pathname.startsWith('/en')) {
  marco.src = '/en/';
} else {
  // Un módulo corre diferido: si el marco ya terminó de cargar, su `load` pasó sin nadie escuchando.
  const yaCargada = pagina();
  if (yaCargada?.readyState === 'complete' && yaCargada.location.href !== 'about:blank') alCargarMarco();
}
